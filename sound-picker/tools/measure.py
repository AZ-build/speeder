"""Measure every candidate as a phone speaker would hear it and work out play volumes so
each palette is balanced the same way against the music."""
import numpy as np, scipy.signal as sg, subprocess, json, sys

SR = 44100
OUT = sys.argv[1]


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(float)


PHONE = sg.butter(2, 250, 'high', fs=SR, output='sos')       # phone speakers lose the deep bass


def loud(x, win=0.1):
    y = sg.sosfilt(PHONE, x)
    n = int(win * SR); p = np.convolve(y ** 2, np.ones(n) / n, 'valid') if len(y) > n else np.array([np.mean(y ** 2)])
    return 10 * np.log10(np.max(p) + 1e-12)


def centroid(x):
    m = np.abs(np.fft.rfft(x)); f = np.fft.rfftfreq(len(x), 1 / SR); return float(np.sum(f * m) / np.sum(m))


music = load(f'{OUT}/music.mp3')
# music's typical (median) short-term loudness, at the game's music level 0.42
y = sg.sosfilt(PHONE, music); n = int(0.4 * SR)
blocks = [10 * np.log10(np.mean(y[i:i + n] ** 2) + 1e-12) for i in range(0, len(y) - n, n)]
music_db = float(np.median(blocks)) + 20 * np.log10(0.42)
print('music (phone-weighted, at 0.42):', round(music_db, 1), 'dB')

# How loud each sound should sit against the music (dB). Frequent sounds sit low, rare ones high.
TARGET = {'shoot': -9, 'hit': -15, 'pop': -2, 'boom': 1, 'wreck': 4, 'hurt': 3, 'power': 1, 'shield': -1}
# The game's own volumes today, for the "now" palette
NOW_VOL = {'shoot1': .16, 'shoot2': .16, 'shoot3': .16, 'hit': .22, 'pop': .45, 'boom': .7, 'wreck': 1.0, 'hurt': .9, 'power': .65, 'shield': .7}

manifest = {'music_db': music_db, 'palettes': {}}
for pal in ['now', 'smooth', 'synth', 'arcade', 'heavy']:
    vols = {}
    for name in ['shoot1', 'shoot2', 'shoot3', 'hit', 'pop', 'boom', 'wreck', 'hurt', 'power', 'shield']:
        x = load(f'{OUT}/{pal}/{name}.mp3')
        L = loud(x)
        kind = 'shoot' if name.startswith('shoot') else name
        if pal == 'now':
            v = NOW_VOL[name]
        else:
            v = 10 ** ((music_db + TARGET[kind] - L) / 20)
        vols[name] = round(min(v, 1.5), 3)
        eff = L + 20 * np.log10(vols[name]) - music_db
        print(f'{pal:7s} {name:7s} {len(x)/SR:5.2f}s  peak {20*np.log10(np.max(np.abs(x))+1e-9):5.1f}  loud {L:6.1f}  centroid {centroid(x):6.0f}Hz  vol {vols[name]:.3f}  vs music {eff:+.1f}dB')
    manifest['palettes'][pal] = vols
json.dump(manifest, open(f'{OUT}/levels.json', 'w'), indent=1)
