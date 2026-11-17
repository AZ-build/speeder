"""Speeder engine hums: seamless loops the game pitches up with speed (playbackRate
0.75 + speed/90*0.6) and darkens with a lowpass (400 + speed*14 Hz), like engine.wav today.
Usage: python3 engine.py <outdir>"""
import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf, subprocess, os, sys

SR = 44100
L = 4.0          # loop length, seconds
X = 0.5          # crossfade used to make the loop seamless
rng = np.random.default_rng(5)
T = np.arange(int((L + X) * SR)) / SR


def lp(x, f): return sg.sosfilt(sg.butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sg.sosfilt(sg.butter(2, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b): return sg.sosfilt(sg.butter(2, [a, b], 'band', fs=SR, output='sos'), x)
def wander(rate, depth):  # slow random wobble, 1 +/- depth
    k = max(4, int((L + X) * rate))
    pts = rng.uniform(-1, 1, k + 3)
    return 1 + depth * np.interp(T, np.linspace(0, L + X, k + 3), pts)
def osc(f, kind='sine'):
    ph = np.cumsum(f * np.ones_like(T)) / SR
    if kind == 'sine': return np.sin(2 * np.pi * ph)
    if kind == 'saw': return 2 * (ph % 1) - 1
    if kind == 'pulse': return np.where(ph % 1 < 0.18, 1.0, -0.2)


def turbine():
    w = wander(1.5, 0.01)
    whine = sum(osc(620 * k * w) / k ** 1.3 for k in (1, 2, 3)) * 0.35
    air = bp(rng.uniform(-1, 1, len(T)), 500, 3500) * 0.8 * wander(3, 0.15)
    rumble = lp(rng.uniform(-1, 1, len(T)), 140) * 2.5
    return whine + air + rumble


def hover():
    w = wander(1, 0.004) * (1 + 0.004 * np.sin(2 * np.pi * 6 * T))
    hum = osc(110 * w) + 0.5 * osc(220 * w) + 0.25 * osc(330 * w * 1.002) + 0.3 * osc(55 * w)
    buzz = bp(osc(55 * w, 'saw'), 600, 1600) * 0.35
    fizz = bp(rng.uniform(-1, 1, len(T)), 2000, 6000) * 0.05
    return hum * 0.5 + buzz + fizz


def podracer():
    w = wander(2, 0.03)
    f = 42 * w * (1 + 0.06 * np.sin(2 * np.pi * 9 * T))
    x = osc(f, 'pulse') + 0.6 * osc(f * 2.01, 'pulse')
    rough = 1 + 0.5 * np.sign(np.sin(2 * np.pi * 27 * T * wander(4, 0.1)))
    x = np.tanh(lp(x * rough, 1800) * 2.5)
    return x + lp(rng.uniform(-1, 1, len(T)), 300) * 0.4


def synth_drone():
    cut = 700 + 500 * np.sin(2 * np.pi * T / L)       # one slow filter sweep per loop
    x = sum(osc(65.41 * d, 'saw') for d in (1, 1.004, 0.997)) / 3 + 0.6 * sum(osc(98.0 * d, 'saw') for d in (1, 1.005)) / 2
    out = np.zeros_like(x)
    for i in range(0, len(x), 512):            # filter that moves
        b, a = sg.butter(2, cut[i], 'low', fs=SR); out[i:i + 512] = sg.lfilter(b, a, x[i:i + 512])
    pulse = 1 - 0.25 * (0.5 + 0.5 * np.sin(2 * np.pi * (118 / 60 * 2) * T))
    return out * pulse + osc(32.7) * 0.4


def seamless(x):
    n, xn = int(L * SR), int(X * SR)
    y = x[:n].copy()
    f = np.linspace(0, 1, xn)
    y[:xn] = x[:xn] * f + x[n:n + xn] * (1 - f)
    return y


def save(x, path):
    x = seamless(x); x = x - np.mean(x)
    x = x / np.max(np.abs(x)) * 0.7
    tmp = path + '.wav'
    wf.write(tmp, SR, (x * 32767).astype(np.int16))
    # WAV, not MP3: MP3 adds silence at the ends and the loop would click
    os.replace(tmp, path)


if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    for name, fn in [('turbine', turbine), ('hover', hover), ('podracer', podracer), ('synth', synth_drone)]:
        save(fn(), f'{od}/{name}.wav'); print(name)
