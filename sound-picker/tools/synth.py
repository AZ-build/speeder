"""Speeder sound designer: renders candidate sound effects as mp3 files.
Each palette is a family of sounds made the same way, so they sound like one game."""
import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf, subprocess, os, sys

SR = 44100
rng = np.random.default_rng(7)
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)        # MIDI note -> Hz
C5, E5, G5, C6, E6, G6, C4, G4, E4 = 72, 76, 79, 84, 88, 91, 60, 67, 64


def t_(dur): return np.arange(int(dur * SR)) / SR


def env(dur, a=0.002, d=0.1, s=0.0, r=0.05, curve=4.0):
    """attack, then exponential-ish decay to sustain, release at the end"""
    n = int(dur * SR); t = np.arange(n) / SR
    e = np.ones(n)
    ai = t < a
    e[ai] = t[ai] / max(a, 1e-6)
    di = t >= a
    e[di] = s + (1 - s) * np.exp(-(t[di] - a) / max(d, 1e-6) * (curve / 4))
    rn = int(r * SR)
    if rn > 0 and rn < n: e[-rn:] *= np.linspace(1, 0, rn) ** 2
    return e


def sweep(f0, f1, dur, shape='exp'):
    t = t_(dur)
    if shape == 'exp': return f0 * (f1 / f0) ** (t / dur)
    return f0 + (f1 - f0) * (t / dur)


def osc(freq, kind='sine', duty=0.5, phase0=0.0):
    ph = np.cumsum(freq) / SR + phase0
    ph %= 1
    if kind == 'sine': return np.sin(2 * np.pi * ph)
    if kind == 'saw': return 2 * ph - 1
    if kind == 'square': return np.where(ph < duty, 1.0, -1.0)
    if kind == 'tri': return 4 * np.abs(ph - 0.5) - 1
    raise ValueError(kind)


def supersaw(freq, voices=5, detune=0.012):
    out = 0
    for i in range(voices):
        d = 1 + detune * (i - (voices - 1) / 2) / ((voices - 1) / 2)
        out = out + osc(freq * d, 'saw', phase0=rng.random())
    return out / voices


def noise(dur): return rng.uniform(-1, 1, int(dur * SR))


def crush_noise(dur, rate0, rate1):
    """8-bit style noise: random values held for a while, the hold rate sliding"""
    n = int(dur * SR); out = np.zeros(n); i = 0; v = 0
    rates = rate0 * (rate1 / rate0) ** (np.arange(n) / n)
    acc = 0
    for k in range(n):
        acc += rates[k] / SR
        if acc >= 1: acc -= 1; v = rng.choice([-1.0, 1.0]) * rng.uniform(0.6, 1)
        out[k] = v
    return out


def lp(x, cutoff, q=0.7):
    """lowpass; cutoff can be a number or a per-sample curve (applied in blocks)"""
    if np.isscalar(cutoff):
        sos = sg.butter(2, min(cutoff, SR * 0.45), 'low', fs=SR, output='sos'); return sg.sosfilt(sos, x)
    return _var(x, cutoff, 'low')


def hp(x, cutoff):
    sos = sg.butter(2, cutoff, 'high', fs=SR, output='sos'); return sg.sosfilt(sos, x)


def bp(x, lo, hi):
    sos = sg.butter(2, [lo, hi], 'band', fs=SR, output='sos'); return sg.sosfilt(sos, x)


def _var(x, cut, kind, block=256):
    out = np.zeros_like(x); zi = None
    for i in range(0, len(x), block):
        c = float(np.clip(cut[min(i, len(cut) - 1)], 30, SR * 0.45))
        b, a = sg.butter(2, c, kind, fs=SR)
        if zi is None: zi = sg.lfilter_zi(b, a) * 0
        out[i:i + block], zi = sg.lfilter(b, a, x[i:i + block], zi=zi)
    return out


def sat(x, drive=2.0): return np.tanh(x * drive) / np.tanh(drive)


def reverb(x, tail=0.6, mix=0.25, tone=4000):
    n = int(tail * SR)
    ir = rng.uniform(-1, 1, n) * np.exp(-np.arange(n) / SR / (tail / 5))
    ir = lp(ir, tone); ir /= np.sqrt(np.sum(ir ** 2))
    wet = sg.fftconvolve(np.concatenate([x, np.zeros(n)]), ir)[:len(x) + n]
    dry = np.concatenate([x, np.zeros(n)])
    return dry * (1 - mix) + wet * mix * 0.6


def echo(x, delay=0.12, fb=0.35, n=3):
    d = int(delay * SR); out = np.concatenate([x, np.zeros(d * n)])
    for k in range(1, n + 1): out[d * k:d * k + len(x)] += x * fb ** k
    return out


def mix(*parts):
    L = max(len(p) for p in parts); out = np.zeros(L)
    for p in parts: out[:len(p)] += p
    return out


def at(x, sec):  # delay a sound by sec
    return np.concatenate([np.zeros(int(sec * SR)), x])


def fade_tail(x, sec=0.01):
    n = min(len(x), int(sec * SR)); x = x.copy(); x[-n:] *= np.linspace(1, 0, n); return x


def save(x, path, peak_db=-1.0):
    x = fade_tail(x)
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (peak_db / 20)
    # trim trailing near-silence
    idx = np.where(np.abs(x) > 10 ** (-60 / 20))[0]
    if len(idx): x = x[:idx[-1] + int(0.01 * SR)]
    tmp = path + '.wav'
    wf.write(tmp, SR, (x * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-codec:a', 'libmp3lame', '-b:a', '112k', path], check=True)
    os.remove(tmp)


# ======================= SYNTHWAVE: soft analog synths, in the music's key =======================
def sw_shoot(note):
    d = 0.11
    f = NOTE(note) * np.exp(-t_(d) * 18) * 1.6 + NOTE(note) * 0.4   # quick pitch fall onto the note
    x = supersaw(f, 3, 0.008) * 0.8 + osc(f / 2, 'square', 0.3) * 0.3
    x = lp(x, 900 + 5000 * np.exp(-t_(d) * 40)) * env(d, 0.002, 0.035, r=0.02)
    return hp(x, 180)


def sw_hit():
    d = 0.05
    x = osc(np.full(int(d * SR), NOTE(C6 + 12)), 'tri') * env(d, 0.001, 0.012) * 0.6
    x += bp(noise(d), 2500, 6000) * env(d, 0.0005, 0.004) * 0.5
    return lp(x, 6000)


def sw_pop():
    d = 0.45
    body = lp(noise(d), 300 + 4500 * np.exp(-t_(d) * 14)) * env(d, 0.001, 0.12)
    thump = osc(sweep(160, 45, d), 'sine') * env(d, 0.001, 0.07) * 0.9
    zap = osc(sweep(1400, 200, d), 'saw') * env(d, 0.001, 0.04) * 0.25
    return reverb(sat(body + thump + lp(zap, 3000), 1.5), 0.5, 0.2, 3000)


def sw_boom():
    d = 1.3
    body = lp(noise(d), 120 + 2600 * np.exp(-t_(d) * 5)) * env(d, 0.002, 0.35)
    sub = osc(sweep(90, 30, d), 'sine') * env(d, 0.002, 0.3) * 1.1
    crack = hp(noise(0.06), 1500) * env(0.06, 0.0005, 0.015) * 0.5
    return reverb(sat(mix(body, sub, crack), 1.8), 1.0, 0.3, 2200)


def sw_wreck():
    d = 2.4
    boom = sw_boom()
    down = supersaw(sweep(NOTE(C5), 40, 1.6), 5, 0.02) * env(1.6, 0.01, 0.6) * 0.5
    down = lp(down, 2500 * np.exp(-t_(1.6) * 2) + 150)
    rumble = lp(noise(d), 160) * env(d, 0.05, 0.9) * 1.2
    return reverb(sat(mix(boom, at(down, 0.05), rumble), 1.4), 1.4, 0.3, 2000)


def sw_hurt():
    d = 0.5
    f = sweep(NOTE(G4 - 12), NOTE(C4 - 24), d)
    x = (osc(f, 'square', 0.4) + osc(f * 1.06, 'saw')) * 0.5 * env(d, 0.002, 0.16)
    x = lp(x, 400 + 3000 * np.exp(-t_(d) * 10))
    crunch = lp(noise(d), 2500) * env(d, 0.001, 0.05) * 0.8
    thump = osc(sweep(120, 40, d), 'sine') * env(d, 0.001, 0.08)
    return reverb(sat(mix(x, crunch, thump), 2.0), 0.4, 0.15)


def sw_power():
    out = np.zeros(1)
    for i, n in enumerate([C5, E5, G5, C6]):
        d = 0.22
        f = np.full(int(d * SR), NOTE(n))
        x = supersaw(f, 3, 0.006) * 0.6 + osc(f * 2, 'tri') * 0.25
        x = lp(x, 1200 + 5000 * np.exp(-t_(d) * 18)) * env(d, 0.003, 0.08)
        out = mix(out, at(x, i * 0.06))
    return reverb(echo(out, 0.132, 0.3, 3), 0.8, 0.25)


def sw_shield():
    d = 0.75
    chord = sum(supersaw(np.full(int(d * SR), NOTE(n)), 4, 0.01) for n in [C5, G5, C6]) / 3
    cut = 300 + 4000 * (1 - np.exp(-t_(d) * 6))
    x = lp(chord, cut) * env(d, 0.05, 0.4, r=0.2)
    shimmer = osc(sweep(NOTE(C6), NOTE(G6), d), 'sine') * env(d, 0.02, 0.3) * 0.3
    return reverb(x + shimmer, 0.9, 0.3)


# ======================= RETRO ARCADE: chip-tune style =======================
def ar_shoot(f0):
    d = 0.09
    x = osc(sweep(f0, f0 / 4, d), 'square', 0.5) * env(d, 0.001, 0.05, r=0.01)
    return lp(x, 7000)


def ar_hit():
    d = 0.04
    return lp(osc(np.full(int(d * SR), 1100.0), 'square', 0.25) * env(d, 0.001, 0.012), 6000) * 0.7


def ar_pop():
    d = 0.32
    return lp(crush_noise(d, 9000, 1200) * env(d, 0.001, 0.09), 8000)


def ar_boom():
    d = 0.95
    x = crush_noise(d, 5000, 300) * env(d, 0.001, 0.3)
    sub = osc(sweep(110, 40, d), 'square', 0.5) * env(d, 0.001, 0.12) * 0.4
    return lp(x + sub, 6000)


def ar_wreck():
    out = ar_boom()
    seq = [C5, G4, E4, C4, G4 - 12, C4 - 12]
    for i, n in enumerate(seq):
        d = 0.14
        x = osc(np.full(int(d * SR), NOTE(n)), 'square', 0.5) * env(d, 0.001, 0.1) * 0.5
        out = mix(out, at(x, 0.15 + i * 0.13))
    return lp(out, 7000)


def ar_hurt():
    d = 0.35
    f = sweep(500, 90, d) * (1 + 0.08 * np.sin(2 * np.pi * 30 * t_(d)))
    x = osc(f, 'square', 0.5) * env(d, 0.001, 0.15)
    return lp(x + crush_noise(d, 4000, 800) * env(d, 0.001, 0.05) * 0.6, 7000)


def ar_power():
    out = np.zeros(1)
    for i, n in enumerate([C5, E5, G5, C6, E6, G6]):
        d = 0.08
        x = osc(np.full(int(d * SR), NOTE(n)), 'square', 0.25) * env(d, 0.001, 0.06)
        out = mix(out, at(x, i * 0.045))
    return lp(out, 8000)


def ar_shield():
    d = 0.5
    f = sweep(NOTE(C4), NOTE(C6), d) * (1 + 0.05 * np.sin(2 * np.pi * 18 * t_(d)))
    return lp(osc(f, 'square', 0.5) * env(d, 0.005, 0.3, r=0.1), 6000)


# ======================= HEAVY: punchy, cinematic =======================
def hv_shoot(f0):
    d = 0.14
    thump = osc(sweep(170, 55, d), 'sine') * env(d, 0.001, 0.03) * 1.0
    zap = osc(sweep(f0, f0 / 5, d), 'saw') * env(d, 0.001, 0.03) * 0.6
    zap = lp(zap, 3500)
    click = hp(noise(0.02), 2000) * env(0.02, 0.0005, 0.004) * 0.4
    return sat(mix(thump, zap, click), 1.6)


def hv_hit():
    d = 0.09
    t = t_(d); f = 1500
    x = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (60 + 40 * i)) / (i + 1) for i, k in enumerate([1, 2.76, 5.40]))
    return lp(x * env(d, 0.0005, 0.04) + bp(noise(d), 1500, 5000) * env(d, 0.0005, 0.005) * 0.4, 5000)


def hv_pop():
    d = 0.55
    body = lp(noise(d), 200 + 6000 * np.exp(-t_(d) * 12)) * env(d, 0.001, 0.14)
    sub = osc(sweep(130, 38, d), 'sine') * env(d, 0.001, 0.1) * 1.3
    crackle = hp(noise(d), 3000) * (rng.random(int(d * SR)) > 0.985) * env(d, 0.01, 0.15) * 1.5
    return reverb(sat(mix(body, sub, crackle), 2.5), 0.6, 0.2, 3000)


def hv_boom():
    d = 1.8
    body = lp(noise(d), 80 + 3500 * np.exp(-t_(d) * 4)) * env(d, 0.001, 0.5)
    sub = osc(sweep(70, 25, d), 'sine') * env(d, 0.001, 0.45) * 1.5
    crack = hp(noise(0.08), 1200) * env(0.08, 0.0005, 0.02) * 0.9
    debris = hp(noise(d), 2500) * (rng.random(int(d * SR)) > 0.992) * env(d, 0.05, 0.4) * 1.2
    return reverb(sat(mix(body, sub, crack, debris), 3.0), 1.6, 0.35, 1800)


def hv_wreck():
    d = 3.0
    b = hv_boom()
    b2 = at(hv_boom() * 0.7, 0.25)
    groan = lp(supersaw(sweep(110, 30, 2.0), 5, 0.03), 600) * env(2.0, 0.05, 0.8) * 0.6
    return reverb(sat(mix(b, b2, at(groan, 0.1)), 1.5), 2.0, 0.3, 1500)


def hv_hurt():
    d = 0.55
    thump = osc(sweep(100, 35, d), 'sine') * env(d, 0.001, 0.12) * 1.4
    metal = hv_hit() * 1.2
    crunch = lp(noise(d), 1800) * env(d, 0.001, 0.08)
    alarm = lp(osc(np.full(int(d * SR), NOTE(G4 - 12)), 'saw') * env(d, 0.01, 0.2), 1200) * 0.3
    return reverb(sat(mix(thump, metal, crunch, alarm), 3.0), 0.5, 0.2)


def hv_power():
    d = 0.9
    riser = lp(noise(0.35), sweep(300, 6000, 0.35)) * np.linspace(0, 1, int(0.35 * SR)) ** 2 * 0.5
    chord = sum(supersaw(np.full(int(0.6 * SR), NOTE(n)), 5, 0.012) for n in [C4, G4, C5, E5]) / 4
    stab = lp(chord, 600 + 5000 * np.exp(-t_(0.6) * 6)) * env(0.6, 0.003, 0.25)
    sub = osc(np.full(int(0.4 * SR), NOTE(C4 - 24)), 'sine') * env(0.4, 0.002, 0.15)
    return reverb(mix(riser, at(stab, 0.3), at(sub, 0.3)), 1.0, 0.3)


def hv_shield():
    d = 0.9
    t = t_(d)
    hum = sum(osc(np.full(len(t), NOTE(n)) * (1 + 0.004 * np.sin(2 * np.pi * 5 * t)), 'saw') for n in [C4 - 12, C4, G4]) / 3
    x = lp(hum, 200 + 2500 * (1 - np.exp(-t * 8))) * env(d, 0.03, 0.4, r=0.25)
    whoosh = lp(noise(d), sweep(400, 5000, d)) * env(d, 0.15, 0.25) * 0.3
    return reverb(sat(x + whoosh, 1.5), 1.0, 0.3)


PALETTES = {
    'synth': {
        'shoot1': lambda: sw_shoot(G5), 'shoot2': lambda: sw_shoot(C6), 'shoot3': lambda: sw_shoot(E5),
        'hit': sw_hit, 'pop': sw_pop, 'boom': sw_boom, 'wreck': sw_wreck, 'hurt': sw_hurt, 'power': sw_power, 'shield': sw_shield,
    },
    'arcade': {
        'shoot1': lambda: ar_shoot(1400), 'shoot2': lambda: ar_shoot(1250), 'shoot3': lambda: ar_shoot(1600),
        'hit': ar_hit, 'pop': ar_pop, 'boom': ar_boom, 'wreck': ar_wreck, 'hurt': ar_hurt, 'power': ar_power, 'shield': ar_shield,
    },
    'heavy': {
        'shoot1': lambda: hv_shoot(1100), 'shoot2': lambda: hv_shoot(950), 'shoot3': lambda: hv_shoot(1250),
        'hit': hv_hit, 'pop': hv_pop, 'boom': hv_boom, 'wreck': hv_wreck, 'hurt': hv_hurt, 'power': hv_power, 'shield': hv_shield,
    },
}

if __name__ == '__main__':
    out = sys.argv[1]
    for pal, sounds in PALETTES.items():
        os.makedirs(f'{out}/{pal}', exist_ok=True)
        for name, fn in sounds.items():
            save(fn(), f'{out}/{pal}/{name}.mp3')
            print(pal, name)
