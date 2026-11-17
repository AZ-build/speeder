"""Speeder music sketches: renders seamless synthwave loops as mp3.
Every instrument is synthesized here, so the results are ours (CC0).
Usage: python3 music.py <outdir>"""
import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf, subprocess, os, sys

SR = 44100
rng = np.random.default_rng(11)
NOTE = lambda n: 440.0 * 2 ** ((n - 69) / 12)
NAMES = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}


def n(name):  # 'A3' -> midi
    return 12 * (int(name[-1]) + 1) + NAMES[name[:-1]]


def lp(x, f, order=2):
    return sg.sosfilt(sg.butter(order, min(f, SR * 0.45), 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sg.sosfilt(sg.butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, a, b):
    return sg.sosfilt(sg.butter(2, [a, b], 'band', fs=SR, output='sos'), x)


def saw(f, dur, ph=None):
    t = np.arange(int(dur * SR)) / SR
    p = (f * t + (rng.random() if ph is None else ph)) % 1
    return 2 * p - 1


def sq(f, dur, duty=0.5):
    t = np.arange(int(dur * SR)) / SR
    return np.where((f * t + rng.random()) % 1 < duty, 1.0, -1.0)


def sine(f, dur):
    t = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * f * t)


def adsr(dur, a, d, s, r):
    N = int(dur * SR); t = np.arange(N) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    rn = min(N, int(r * SR))
    if rn: e[-rn:] *= np.linspace(1, 0, rn)
    return e


def supersaw(f, dur, voices=7, det=0.012):
    return sum(saw(f * (1 + det * (i / (voices - 1) - 0.5) * 2), dur) for i in range(voices)) / voices ** 0.7


# ---------------- instruments (mono) ----------------
def kick(punch=1.0):
    d = 0.42; t = np.arange(int(d * SR)) / SR
    f = 46 + 110 * punch * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    click = hp(rng.uniform(-1, 1, len(t)), 3000) * np.exp(-t * 400) * 0.3
    return np.tanh((body + click) * 1.6)


def snare():
    d = 0.35; t = np.arange(int(d * SR)) / SR
    nz = bp(rng.uniform(-1, 1, len(t)), 900, 6500) * np.exp(-t * 20)
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 28) * 0.6
    return nz + tone


def hat(open_=False):
    d = 0.25 if open_ else 0.05; t = np.arange(int(d * SR)) / SR
    return bp(rng.uniform(-1, 1, len(t)), 7000, 12000) * np.exp(-t * (13 if open_ else 80)) * 0.35


def bass(m, dur, cut=700, kind='saw'):
    f = NOTE(m)
    x = (saw(f, dur) if kind == 'saw' else sq(f, dur, 0.5)) * 0.7 + sine(f / 2 if m > 40 else f, dur) * 0.5
    env = adsr(dur, 0.004, 0.12, 0.55, 0.03)
    return lp(x, cut) * env


def pluck(m, dur, cut=3500, kind='saw'):
    f = NOTE(m)
    x = saw(f, dur) + saw(f * 1.006, dur) if kind == 'saw' else sq(f, dur, 0.25) * 1.2
    e = adsr(dur, 0.002, 0.07, 0.0, 0.01)
    return lp(x * 0.5, cut) * e


def pad(ms, dur, cut=2200, att=0.35):
    x = sum(supersaw(NOTE(m), dur) for m in ms) / len(ms)
    return lp(x, cut) * adsr(dur, att, 1.2, 0.8, 0.4)


def lead(m, dur, cut=4500, vib=True):
    t = np.arange(int(dur * SR)) / SR
    f = NOTE(m) * (1 + (0.006 * np.sin(2 * np.pi * 5.5 * t) * np.clip((t - 0.15) * 4, 0, 1) if vib else 0))
    ph = np.cumsum(f) / SR
    x = (2 * (ph % 1) - 1) * 0.6 + (2 * ((ph * 1.004) % 1) - 1) * 0.4
    return lp(x, cut) * adsr(dur, 0.01, 0.4, 0.7, 0.08)


def chip(m, dur, duty=0.25):
    return sq(NOTE(m), dur, duty) * adsr(dur, 0.002, 0.15, 0.5, 0.02) * 0.5


# ---------------- arrangement ----------------
class Song:
    def __init__(self, bpm, bars):
        self.bpm = bpm; self.bars = bars
        self.beat = 60 / bpm; self.L = bars * 4 * self.beat
        self.N = int(round(self.L * SR))
        self.tracks = {}

    def add(self, track, x, beat_pos):
        """place x at beat_pos (in beats); written twice so the loop wraps seamlessly"""
        buf = self.tracks.setdefault(track, np.zeros(self.N * 3))
        for k in (0, 1):
            i = int(round((beat_pos * self.beat) * SR)) + k * self.N
            j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i]

    def loop(self, track):  # the second pass: it already holds the first pass's tails
        buf = self.tracks[track]; return buf[self.N:2 * self.N] + buf[2 * self.N:3 * self.N] * 0  # tails past 2N are dropped (they start loop 3)


def reverb_st(x, tail=2.0, damp=5000, seed=1):
    r = np.random.default_rng(seed); n_ = int(tail * SR)
    out = []
    for ch in range(2):
        ir = r.uniform(-1, 1, n_) * np.exp(-np.arange(n_) / SR * 6.9 / tail)
        ir = lp(ir, damp); ir /= np.sqrt(np.sum(ir ** 2))
        y = sg.fftconvolve(np.concatenate([x, x]), ir)[len(x):2 * len(x)]   # circular: loops cleanly
        out.append(y)
    return np.stack(out)


def delay_st(x, sec, fb=0.4, n_=5):
    L = len(x); out = np.zeros((2, L)); d = int(sec * SR)
    for k in range(1, n_ + 1):
        out[k % 2] += np.roll(x, d * k) * fb ** k     # ping-pong, wraps around the loop
    return out


def pan(x, p):  # -1 left .. 1 right
    return np.stack([x * np.sqrt((1 - p) / 2), x * np.sqrt((1 + p) / 2)])


def duck(song, depth=0.5):
    """sidechain pump: dip on every beat, like the kick is pushing everything down"""
    t = np.arange(song.N) / SR
    ph = (t % song.beat) / song.beat
    return 1 - depth * np.exp(-ph * 9)


def master(st, peak=-1.0):
    st = st / (np.max(np.abs(st)) + 1e-9)
    st = np.tanh(st * 1.4) / np.tanh(1.4)
    return st / np.max(np.abs(st)) * 10 ** (peak / 20)


def save(st, path):
    tmp = path + '.wav'
    wf.write(tmp, SR, (st.T * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-codec:a', 'libmp3lame', '-b:a', '128k', path], check=True)
    os.remove(tmp)


def chord(root, kind='m', inv=0):
    iv = {'m': [0, 3, 7], 'M': [0, 4, 7], 'm7': [0, 3, 7, 10], 'M7': [0, 4, 7, 11], 'sus': [0, 5, 7]}[kind]
    return [root + i for i in iv]


# ================== 1. NIGHT DRIVE: classic driving synthwave, A minor, 118 BPM ==================
def night_drive():
    s = Song(118, 16)
    prog = [(n('A2'), 'm'), (n('F2'), 'M'), (n('C3'), 'M'), (n('G2'), 'M')]
    for bar in range(16):
        root, kind = prog[bar % 4]
        b0 = bar * 4
        for b in range(4): s.add('kick', kick(), b0 + b)
        s.add('snare', snare(), b0 + 1); s.add('snare', snare(), b0 + 3)
        for e in range(8): s.add('hat', hat(e % 2 == 1 and bar >= 4), b0 + e * 0.5)
        for e in range(8):   # driving 8th-note bass, octave jump on the off-beats
            s.add('bass', bass(root - 12 + (12 if e % 2 else 0), s.beat * 0.48, 650), b0 + e * 0.5)
        s.add('pad', pad([m + 12 for m in chord(root, kind)], s.beat * 4, 1800), b0)
        if bar >= 4:   # arpeggio from bar 5
            notes = chord(root + 24, kind) + [root + 36]
            for e in range(16): s.add('arp', pluck(notes[[0, 1, 2, 3, 2, 1, 0, 1][e % 8]], s.beat * 0.24, 3000), b0 + e * 0.25)
    mel = ['E5', 'D5', 'C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'A4', 'C5', 'D5', 'E5', 'D5', 'C5', 'B4']
    lens = [1.5, 0.5, 1, 1, 1.5, 0.5, 1, 1, 1.5, 0.5, 1, 1, 2, 1, 0.5, 0.5]
    pos = 32
    for _ in range(2):
        p = pos
        for m, L in zip(mel, lens): s.add('lead', lead(n(m), s.beat * L * 0.95), p); p += L
        pos += 16
    return mixdown(s, {'kick': (0.9, 0, 0, 0), 'snare': (0.5, 0, 0.45, 0), 'hat': (0.22, 0.3, 0.1, 0), 'bass': (0.55, 0, 0, 0.5),
                       'pad': (0.30, 0, 0.35, 0.6), 'arp': (0.22, -0.3, 0.25, 0.5, 0.75), 'lead': (0.30, 0.1, 0.35, 0.3, 0.75)})


# ================== 2. DARKLINE: darker, heavier, faster. A minor, 128 BPM ==================
def darkline():
    s = Song(128, 16)
    prog = [(n('A1'), 'm'), (n('A1'), 'm'), (n('F1'), 'M'), (n('E1'), 'M')]
    for bar in range(16):
        root, kind = prog[bar % 4]
        b0 = bar * 4
        for b in range(4): s.add('kick', kick(1.3), b0 + b)
        s.add('snare', snare(), b0 + 1); s.add('snare', snare(), b0 + 3)
        for e in range(16): s.add('hat', hat(False) * (1 if e % 4 == 2 else 0.5), b0 + e * 0.25)
        for e in range(16):   # rolling 16th bass, rests on the kick
            if e % 4 == 0: continue
            s.add('bass', bass(root + 12, s.beat * 0.22, 900, 'sq'), b0 + e * 0.25)
        if bar % 2 == 0: s.add('pad', pad([m + 24 for m in chord(root, kind)], s.beat * 8, 1400, 0.6), b0)
        if bar >= 8:
            riff = [0, 12, 7, 12, 3, 12, 7, 15]
            for e in range(8): s.add('lead', lead(root + 36 + riff[e], s.beat * 0.45, 2600, False), b0 + e * 0.5)
    return mixdown(s, {'kick': (1.0, 0, 0, 0), 'snare': (0.55, 0, 0.5, 0), 'hat': (0.18, 0.25, 0.05, 0), 'bass': (0.6, 0, 0, 0.6),
                       'pad': (0.30, 0, 0.4, 0.7), 'lead': (0.26, -0.15, 0.3, 0.4, 0.75)})


# ================== 3. NEON DREAM: dreamy, lighter, C major, 100 BPM ==================
def neon_dream():
    s = Song(100, 16)
    prog = [(n('C3'), 'M7'), (n('A2'), 'm7'), (n('F2'), 'M7'), (n('G2'), 'sus')]
    for bar in range(16):
        root, kind = prog[bar % 4]
        b0 = bar * 4
        s.add('kick', kick(0.7), b0); s.add('kick', kick(0.7), b0 + 2.5)
        s.add('snare', snare(), b0 + 1); s.add('snare', snare(), b0 + 3)
        for e in range(8): s.add('hat', hat(), b0 + e * 0.5)
        s.add('bass', bass(root - 12, s.beat * 1.9, 450), b0); s.add('bass', bass(root - 12, s.beat * 0.9, 450), b0 + 2.5)
        s.add('bass', bass(root - 12 + 7, s.beat * 0.45, 450), b0 + 3.5)
        s.add('pad', pad([m + 12 for m in chord(root, kind)], s.beat * 4, 2600, 0.5), b0)
        notes = chord(root + 24, kind)
        for e in range(8): s.add('arp', pluck(notes[e % len(notes)] + (12 if e >= 4 else 0), s.beat * 0.45, 2400), b0 + e * 0.5)
    mel = ['G5', 'E5', 'C5', 'E5', 'A5', 'G5', 'E5', 'D5']
    for half in (32, 48):
        p = half
        for m in mel: s.add('lead', lead(n(m), s.beat * 1.9, 3500), p); p += 2
    return mixdown(s, {'kick': (0.7, 0, 0, 0), 'snare': (0.42, 0, 0.6, 0), 'hat': (0.13, 0.35, 0.15, 0), 'bass': (0.5, 0, 0, 0.3),
                       'pad': (0.32, 0, 0.5, 0.4), 'arp': (0.2, 0.35, 0.4, 0.3, 0.75), 'lead': (0.24, -0.2, 0.55, 0.2, 0.75)})


def mixdown(s, spec):
    """spec: track -> (level, pan, reverb send, duck depth[, delay in beats])"""
    out = np.zeros((2, s.N))
    rev_bus = np.zeros(s.N)
    for name, sp in spec.items():
        if name not in s.tracks: continue
        lvl, p, rv, dk = sp[:4]
        x = s.loop(name) * lvl
        if dk: x = x * duck(s, dk)
        st = pan(x, p)
        if len(sp) > 4: st = st + delay_st(x, s.beat * sp[4], 0.38) * 0.6
        out += st; rev_bus += x * rv
    out += reverb_st(rev_bus, 2.2, 3200) * 0.9
    out = hp(out, 30)
    out = out - 0.45 * hp(out, 5500)          # tame the top end (about -5 dB above 6 kHz)
    return master(out), s


if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    for name, fn in [('nightdrive', night_drive), ('darkline', darkline), ('neondream', neon_dream)]:
        st, s = fn()
        save(st, f'{od}/{name}.mp3')
        print(name, f'{s.bpm} BPM, {s.bars} bars, {s.L:.2f} s')
