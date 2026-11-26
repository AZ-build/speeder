"""Encode Sunset Drive I-V for the game: each world loop gets ROLL seconds of its own end before it
and its own start after it (so it loops cleanly whether or not the phone trims the MP3's silence)."""
import sys, os, glob, subprocess, numpy as np
from scipy.io import wavfile
ROLL = 0.25
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
for f in sorted(glob.glob('out/s5/*.wav')):
    name = os.path.basename(f)[:-4]
    sr, x = wavfile.read(f)
    if '-gate' not in name:
        r = int(ROLL * sr)
        x = np.concatenate([x[-r:], x, x[:r]])
    tmp = '/tmp/enc.wav'
    wavfile.write(tmp, sr, x)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-codec:a', 'libmp3lame', '-b:a', '128k',
                    os.path.join(out, name + '.mp3')], check=True)
    print(name, round(len(x) / sr, 3))
