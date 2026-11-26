"""Decode each game file again and check the loop region lines up with the original loop and wraps cleanly."""
import glob, os, subprocess, numpy as np
from scipy.io import wavfile
ROLL = 0.25
for f in sorted(glob.glob('out/s5/*-w*.wav')):
    name = os.path.basename(f)[:-4]
    sr, x = wavfile.read(f); x = x.astype(float).mean(1)
    mp3 = f'../../../audio/lab-music/{name}.mp3'
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True).stdout
    y = np.frombuffer(raw, np.int16).astype(float)
    r = int(ROLL * sr); n = len(x)
    # where does the loop start in the decoded file? (search +-2000 samples around ROLL)
    seg = x[:4096]
    best = max(range(r - 2000, r + 2000), key=lambda o: np.dot(y[o:o + 4096], seg))
    cyc = y[best:best + n]
    err = np.sqrt(np.mean((cyc - x) ** 2)) / np.sqrt(np.mean(x ** 2))
    wrap = np.concatenate([y[best + n - 2205:best + n], y[best:best + 2205]])
    step = np.abs(np.diff(wrap)).max() / np.abs(np.diff(x)).max()
    print(f'{name:14s} loop starts at {best - r:+5d} samples from ROLL  mp3-vs-original {err:.3f}  biggest step at wrap vs loop {step:.2f}  dur {len(y)/sr:.3f}')
