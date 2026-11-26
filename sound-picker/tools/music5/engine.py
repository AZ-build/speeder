"""Tiny offline synth engine for Speeder music sketches (numpy + scipy)."""
import numpy as np
import scipy.signal as ss
from scipy.ndimage import minimum_filter1d, uniform_filter1d

SR = 44100
PI2 = 2 * np.pi
rng = np.random.default_rng(11)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(n):
    return np.arange(n) / SR


def lp(x, fc, order=2):
    sos = ss.butter(order, min(fc, SR * 0.45), 'low', fs=SR, output='sos')
    return ss.sosfilt(sos, x, axis=-1)


def hp(x, fc, order=2):
    sos = ss.butter(order, fc, 'high', fs=SR, output='sos')
    return ss.sosfilt(sos, x, axis=-1)


def bp(x, lo, hi, order=2):
    sos = ss.butter(order, [lo, min(hi, SR * 0.45)], 'band', fs=SR, output='sos')
    return ss.sosfilt(sos, x, axis=-1)


def noise(n):
    return rng.uniform(-1, 1, n)


# ---------- oscillators ----------
def blep_saw(freq_inst, phase0=None):
    """Band-limited (polyBLEP) saw from an array of instantaneous frequencies."""
    dt = np.asarray(freq_inst, dtype=float) / SR
    if phase0 is None:
        phase0 = rng.random()
    ph = (phase0 + np.cumsum(dt)) % 1.0
    s = 2 * ph - 1
    m = ph < dt
    t = ph[m] / dt[m]
    s[m] -= t + t - t * t - 1
    m = ph > 1 - dt
    t = (ph[m] - 1) / dt[m]
    s[m] -= t * t + t + t + 1
    return s


def blep_square(freq_inst, phase0=None):
    if phase0 is None:
        phase0 = rng.random()
    return 0.5 * (blep_saw(freq_inst, phase0) - blep_saw(freq_inst, (phase0 + 0.5) % 1.0))


def sine_ph(freq_inst, phase0=0.0):
    return np.sin(PI2 * (phase0 + np.cumsum(np.asarray(freq_inst, dtype=float) / SR)))


def adsr(n, att, rel_start, rel, dec=0.0, sus=1.0):
    """Envelope for n samples: attack, optional decay to sus, release starting at rel_start (s)."""
    t = tt(n)
    e = np.ones(n)
    if att > 0:
        e = np.minimum(1.0, t / att)
        e = 1 - (1 - e) ** 2
    if dec > 0:
        d = np.clip((t - att) / dec, 0, None)
        e = np.where(t > att, sus + (1 - sus) * np.exp(-3 * d), e)
    r = np.clip((t - rel_start) / max(rel, 1e-3), 0, None)
    e = e * np.where(t > rel_start, np.exp(-5 * r), 1.0)
    return e


def vibrato(n, f, rate=5.0, cents=12, delay=0.2):
    t = tt(n)
    depth = np.clip((t - delay) / 0.3, 0, 1) * cents
    return f * 2 ** (depth * np.sin(PI2 * rate * t) / 1200)


# ---------- instruments (return mono or stereo arrays) ----------
def pad_note(m, dur, voices=5, detune=14, att=0.5, rel=1.6, wobble=0.0, bright=1.0):
    n = int((dur + rel * 1.3) * SR)
    t = tt(n)
    out = np.zeros((2, n))
    f0 = mtof(m)
    tape = 1 + wobble * np.sin(PI2 * 0.23 * t + 1.3) / 1200 * np.log(2)
    for v in range(voices):
        c = detune * (2 * v / (voices - 1) - 1) if voices > 1 else 0
        f = f0 * 2 ** (c / 1200) * tape * (1 + 0.0007 * np.sin(PI2 * (0.4 + 0.13 * v) * t + v))
        s = blep_saw(f)
        pan = (2 * v / (voices - 1) - 1) * 0.8 if voices > 1 else 0
        out[0] += s * np.cos((pan + 1) * np.pi / 4)
        out[1] += s * np.sin((pan + 1) * np.pi / 4)
    out *= adsr(n, att, dur, rel) / voices
    return lp(out, 1800 * bright + f0 * 2)


def soft_pad_note(m, dur, att=0.8, rel=2.0):
    """Warm sine/triangle-ish pad (organic)."""
    n = int((dur + rel * 1.3) * SR)
    f = mtof(m)
    out = np.zeros((2, n))
    for i, c in enumerate([-6, 6]):
        fi = f * 2 ** (c / 1200)
        s = sine_ph(np.full(n, fi), rng.random()) + 0.18 * sine_ph(np.full(n, 2 * fi), rng.random()) \
            + 0.08 * blep_saw(np.full(n, fi))
        out[i] = s
    return out * adsr(n, att, dur, rel) * 0.6


def marimba(m, vel=1.0):
    n = int(1.3 * SR)
    t = tt(n)
    f = mtof(m)
    s = np.sin(PI2 * f * t) * np.exp(-t / 0.42) \
        + 0.33 * np.sin(PI2 * 3.93 * f * t) * np.exp(-t / 0.07) \
        + 0.10 * np.sin(PI2 * 9.2 * f * t) * np.exp(-t / 0.018)
    s += 0.05 * hp(noise(n), 2000) * np.exp(-t / 0.004)
    s *= np.minimum(1, t / 0.002)
    return s * vel * 0.8


def pluck(m, vel=1.0, decay=0.32, bright=3800, dark=500, shape='saw'):
    n = int((decay * 3.2) * SR)
    t = tt(n)
    f = np.full(n, mtof(m))
    osc = blep_saw(f) if shape == 'saw' else blep_square(f)
    osc = 0.6 * osc + 0.4 * blep_saw(f * 1.004)
    b = lp(osc, bright)
    d = lp(osc, dark)
    fe = np.exp(-t / 0.07)
    s = (d + (b - d) * fe) * np.exp(-t / decay) * np.minimum(1, t / 0.003)
    return s * vel * 0.7


def bell(m, vel=1.0):
    n = int(2.5 * SR)
    t = tt(n)
    f = mtof(m)
    s = np.sin(PI2 * f * t) * np.exp(-t / 0.9) + 0.4 * np.sin(PI2 * 2.76 * f * t) * np.exp(-t / 0.25) \
        + 0.15 * np.sin(PI2 * 5.4 * f * t) * np.exp(-t / 0.08)
    return s * np.minimum(1, t / 0.002) * vel * 0.5


def sub_bass(m, dur, vel=1.0, drive=1.6):
    n = int((dur + 0.15) * SR)
    t = tt(n)
    f = np.full(n, mtof(m))
    s = sine_ph(f) + 0.3 * sine_ph(2 * f) + 0.12 * sine_ph(3 * f)
    s += 0.18 * lp(blep_saw(f), 500)
    s = np.tanh(drive * s) / np.tanh(drive)
    env = adsr(n, 0.006, dur, 0.06, dec=0.4, sus=0.7)
    return s * env * vel * 0.8


def house_bass(m, vel=1.0, length=0.22):
    n = int((length + 0.12) * SR)
    t = tt(n)
    f = np.full(n, mtof(m))
    s = sine_ph(f) + 0.35 * sine_ph(2 * f) + 0.12 * sine_ph(3 * f)
    s += 0.25 * lp(blep_saw(f), 420)
    s = np.tanh(1.8 * s) / np.tanh(1.8)
    env = adsr(n, 0.004, length, 0.05, dec=0.12, sus=0.55)
    return s * env * vel * 0.8


def synth_bass(m, length=0.2, vel=1.0):
    n = int((length + 0.08) * SR)
    t = tt(n)
    f = np.full(n, mtof(m))
    osc = blep_saw(f) + 0.6 * blep_saw(f * 1.006)
    b = lp(osc, 2200)
    d = lp(osc, 320)
    s = d + (b - d) * np.exp(-t / 0.05)
    s += 0.6 * sine_ph(f)
    s = np.tanh(1.4 * s)
    return s * adsr(n, 0.003, length, 0.03) * vel * 0.55


def lead_note(m, dur, style='chill', vel=1.0):
    rel = 0.35
    n = int((dur + rel * 1.4) * SR)
    t = tt(n)
    f = vibrato(n, mtof(m), rate=5.2, cents=14 if style != 'flute' else 9, delay=0.18)
    if style == 'flute':
        s = sine_ph(f) + 0.12 * sine_ph(2 * f) + 0.06 * sine_ph(3 * f)
        breath = bp(noise(n), mtof(m) * 1.5, mtof(m) * 4) * 0.12
        s = s + breath * (0.5 + 0.5 * np.exp(-t / 0.15))
        env = adsr(n, 0.05, dur, rel)
    elif style == 'synthwave':
        s = blep_saw(f * 2 ** (-9 / 1200)) + blep_saw(f * 2 ** (9 / 1200)) + 0.5 * blep_square(f / 2)
        s = lp(s, 3200) * 0.45
        env = adsr(n, 0.012, dur, rel)
    else:  # chill: soft detuned saw, gentle
        s = blep_saw(f * 2 ** (-7 / 1200)) + blep_saw(f * 2 ** (7 / 1200)) + 0.6 * sine_ph(f)
        s = lp(s, 2100) * 0.45
        env = adsr(n, 0.035, dur, rel)
    return s * env * vel * 0.6


# ---------- drums ----------
def kick(f0=150, f1=48, dec=0.42, click=0.25, drive=1.8):
    n = int(dec * 1.6 * SR)
    t = tt(n)
    f = f1 + (f0 - f1) * np.exp(-t / 0.032)
    s = np.sin(PI2 * np.cumsum(f) / SR) * np.exp(-t / (dec * 0.38))
    s += click * hp(noise(n), 1500) * np.exp(-t / 0.003)
    return np.tanh(drive * s) / np.tanh(drive)


def snare(tone=190, dec=0.14, gated=False):
    n = int(0.5 * SR)
    t = tt(n)
    body = np.sin(PI2 * np.cumsum(tone * (1 + 0.25 * np.exp(-t / 0.01))) / SR) * np.exp(-t / 0.055)
    nz = bp(noise(n), 1400, 9000) * np.exp(-t / dec)
    s = 0.55 * body + 0.9 * nz
    if gated:
        irn = int(0.36 * SR)
        ti = tt(irn)
        ir = noise(irn) * np.where(ti < 0.28, 1.0, np.exp(-(ti - 0.28) / 0.015)) * 0.06
        tail = ss.fftconvolve(lp(s, 7000), ir)[:n]
        s = s + 1.2 * tail
    return s * 0.7


def clap(dec=0.12):
    n = int(0.45 * SR)
    t = tt(n)
    nz = bp(noise(n), 900, 4200)
    env = np.zeros(n)
    for k, d in enumerate([0, 0.010, 0.021]):
        env += np.where(t >= d, np.exp(-(t - d) / 0.004), 0) * (0.8 + 0.1 * k)
    env += np.where(t >= 0.03, np.exp(-(t - 0.03) / dec), 0) * 0.7
    return nz * env * 0.8


_METAL = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]


def hat(open_=False, vel=1.0):
    dec = 0.22 if open_ else 0.035
    n = int((dec * 5) * SR)
    t = tt(n)
    m = sum(blep_square(np.full(n, f * 1.9)) for f in _METAL)
    s = hp(0.5 * m + 0.6 * noise(n), 7200, order=4) * np.exp(-t / dec)
    return s * vel * 0.35


def shaker(vel=1.0):
    n = int(0.16 * SR)
    t = tt(n)
    a = 0.018
    env = (t / a) * np.exp(1 - t / a)
    return bp(noise(n), 5500, 12000) * env * vel * 0.3


def conga(high=True, vel=1.0):
    f0 = 330 if high else 220
    n = int(0.45 * SR)
    t = tt(n)
    f = f0 * (1 + 0.35 * np.exp(-t / 0.008))
    s = np.sin(PI2 * np.cumsum(f) / SR) * np.exp(-t / (0.12 if high else 0.18))
    s += 0.15 * bp(noise(n), 1500, 5000) * np.exp(-t / 0.006)
    return s * vel * 0.55


def rim(vel=1.0):
    n = int(0.12 * SR)
    t = tt(n)
    s = (np.sin(PI2 * 1700 * t) + 0.6 * np.sin(PI2 * 520 * t)) * np.exp(-t / 0.018)
    s += 0.3 * hp(noise(n), 3000) * np.exp(-t / 0.004)
    return s * vel * 0.4


def tom(f0=150, vel=1.0):
    n = int(0.6 * SR)
    t = tt(n)
    f = f0 * (0.72 + 0.28 * np.exp(-t / 0.09)) * (1 + 0.3 * np.exp(-t / 0.01))
    s = np.sin(PI2 * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    s += 0.12 * bp(noise(n), 800, 5000) * np.exp(-t / 0.03)
    return np.tanh(1.5 * s) * vel * 0.6


def crash(vel=1.0, length=3.0):
    n = int(length * SR)
    t = tt(n)
    m = sum(blep_square(np.full(n, f * 3.1)) for f in _METAL)
    s = hp(0.4 * m + noise(n), 4500, order=2) * np.exp(-t / 1.1) * np.minimum(1, t / 0.002)
    return s * vel * 0.25


def riser(seconds, f_lo=300, f_hi=7000):
    n = int(seconds * SR)
    t = tt(n) / seconds
    x = noise(n)
    out = np.zeros(n)
    blk = 1024
    zi = None
    for s0 in range(0, n, blk):
        fc = f_lo * (f_hi / f_lo) ** t[min(s0 + blk // 2, n - 1)]
        sos = ss.butter(2, [fc * 0.7, min(fc * 1.4, SR * 0.45)], 'band', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        out[s0:s0 + blk], zi = ss.sosfilt(sos, x[s0:s0 + blk], zi=zi)
    return out * t ** 2 * 0.5


# ---------- effects ----------
def make_ir(rt=2.6, pre=0.025, bright=5000, dark=1400):
    n = int(rt * SR)
    t = tt(n)
    ir = np.zeros((2, n + int(pre * SR)))
    for c in range(2):
        nz = noise(n)
        a = lp(nz, bright)
        b = lp(nz, dark)
        w = t / rt
        ir[c, int(pre * SR):] = (a * (1 - w) + b * w) * np.exp(-6.9 * t / rt)
    ir /= np.sqrt(np.sum(ir ** 2, axis=1, keepdims=True))
    return ir


def reverb(x, ir):
    return np.stack([ss.fftconvolve(x[c], ir[c])[:x.shape[1]] for c in range(2)])


def pingpong(x, d_s, fb=0.45, reps=7, lpf=3200):
    mono = lp(x.mean(axis=0), lpf)
    d = int(d_s * SR)
    out = np.zeros_like(x)
    y = mono
    for i in range(1, reps + 1):
        y = lp(y, lpf * 0.85) if i > 1 else y
        sh = i * d
        if sh >= x.shape[1]:
            break
        out[i % 2, sh:] += (fb ** i) * y[:-sh]
    return out


def sweep_lp(x, times, fcs, block=512):
    n = x.shape[1]
    out = np.empty_like(x)
    zi = None
    for s0 in range(0, n, block):
        fc = float(np.interp((s0 + block / 2) / SR, times, fcs))
        sos = ss.butter(2, min(fc, SR * 0.45), 'low', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2, 2))
        out[:, s0:s0 + block], zi = ss.sosfilt(sos, x[:, s0:s0 + block], axis=-1, zi=zi)
    return out


def sidechain(n, kick_times, depth=0.6, tau=0.11):
    t = tt(n)
    kt = np.sort(np.asarray(kick_times))
    if len(kt) == 0:
        return np.ones(n)
    idx = np.searchsorted(kt, t, side='right') - 1
    d = np.where(idx >= 0, t - kt[np.clip(idx, 0, None)], 10.0)
    duck = np.exp(-d / tau) * np.clip(d / 0.004, 0, 1)
    # ease back to full level just before the next kick, so it pumps smoothly
    return 1 - depth * duck


# ---------- track / mixer ----------
class Track:
    def __init__(self, bpm, bars, tail=4.0):
        self.bpm = bpm
        self.spb = 60.0 / bpm
        self.bar_s = 4 * self.spb
        self.bars = bars
        self.n = int((bars * self.bar_s + tail) * SR)
        self.buses = {}
        self.kicks = []

    def at(self, bar, beat=0.0):
        return (bar * 4 + beat) * self.spb

    def add(self, bus, sig, time_s, pan=0.0, gain=1.0):
        b = self.buses.setdefault(bus, np.zeros((2, self.n)))
        i = int(round(time_s * SR))
        if i >= self.n:
            return
        if sig.ndim == 1:
            sig = np.stack([sig * np.cos((pan + 1) * np.pi / 4), sig * np.sin((pan + 1) * np.pi / 4)]) * np.sqrt(2)
        m = min(sig.shape[1], self.n - i)
        b[:, i:i + m] += sig[:, :m] * gain

    def keyframes(self, kf):
        """[(bar, value), ...] -> per-sample curve."""
        times = [self.at(b) for b, _ in kf]
        vals = [v for _, v in kf]
        return times, vals

    def mix(self, settings, ir, master_rms_db=-15.5, gain=None, fade=True):
        dry = np.zeros((2, self.n))
        send = np.zeros((2, self.n))
        t = tt(self.n)
        for name, x in self.buses.items():
            st = settings.get(name, {})
            if 'sweep' in st:
                tm, fc = self.keyframes(st['sweep'])
                x = sweep_lp(x, tm, fc)
            if 'hp' in st:
                x = hp(x, st['hp'])
            if st.get('sc', 0) > 0:
                x = x * sidechain(self.n, self.kicks, st['sc'])
            if 'gain' in st:
                tm, g = self.keyframes(st['gain'])
                x = x * np.interp(t, tm, g)
            if 'delay' in st:
                d, fb, mixv = st['delay']
                x = x + mixv * pingpong(x, d * self.spb, fb)
            v = st.get('vol', 1.0)
            dry += x * v
            send += x * v * st.get('rev', 0.15)
        wet = reverb(send, ir)
        m = hp(dry + wet, 32)
        # loudness: normalise the RMS of the loudest 8 s to the target
        a = np.mean(m ** 2, axis=0)
        win = int(8 * SR)
        loud = np.sqrt(np.max(uniform_filter1d(a, win)))
        if gain is None:
            gain = 10 ** (master_rms_db / 20) / max(loud, 1e-9)
        self.gain = gain
        m *= gain
        # simple look-ahead limiter at -1 dBFS
        ceil = 10 ** (-1 / 20)
        pk = np.max(np.abs(m), axis=0)
        g = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
        g = minimum_filter1d(g, 441)
        g = uniform_filter1d(g, 441)
        g = np.minimum(g, minimum_filter1d(np.minimum(1.0, ceil / np.maximum(pk, 1e-9)), 3))
        m *= g
        m = np.clip(m, -0.999, 0.999)
        if fade:
            f = int(2.5 * SR)
            m[:, -f:] *= np.linspace(1, 0, f) ** 2
        return m


def epiano(m, dur=0.6, vel=1.0):
    """Rhodes-ish electric piano: FM bell attack that mellows, gentle tremolo, a touch of stereo."""
    n = int((dur + 1.2) * SR)
    t = tt(n)
    f = mtof(m)
    idx = 0.4 + 2.2 * np.exp(-t / 0.05)
    mod = np.sin(PI2 * f * t)
    car = np.sin(PI2 * f * t + idx * mod) + 0.15 * np.sin(PI2 * 2 * f * t)
    env = np.minimum(1, t / 0.003) * np.exp(-t / 0.9) * np.where(t > dur, np.exp(-(t - dur) / 0.12), 1.0)
    trem = 1 + 0.25 * np.sin(PI2 * 4.5 * t)
    s = car * env * vel * 0.45
    return np.stack([s * trem, s * (2 - trem)]) * 0.7


def string_note(m, dur, vel=1.0, att=0.6, rel=0.9):
    """Warm string ensemble: detuned saws with vibrato, soft attack, dark."""
    n = int((dur + rel * 1.4) * SR)
    t = tt(n)
    out = np.zeros((2, n))
    for v, c in enumerate([-9, -3, 4, 10]):
        f = vibrato(n, mtof(m) * 2 ** (c / 1200), rate=5.0 + 0.3 * v, cents=7, delay=0.3)
        s = blep_saw(f)
        pan = (-0.6, -0.2, 0.2, 0.6)[v]
        out[0] += s * np.cos((pan + 1) * np.pi / 4)
        out[1] += s * np.sin((pan + 1) * np.pi / 4)
    out = lp(out, 1900 + mtof(m)) * adsr(n, att, dur, rel) * vel * 0.18
    return out
