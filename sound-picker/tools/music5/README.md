# Sunset Drive I-V (the Lab's MUSIC experiment)

Made from scratch for Speeder (CC0, ours). Five songs, one per loop, each in five world parts.

| Song | Key | Tempo | New colour |
|------|-----|-------|------------|
| Sunset Drive | D major | 96 BPM | (the original) |
| Sunset Drive II | E major | 100 BPM | marimba |
| Sunset Drive III | F# major | 104 BPM | electric piano |
| Sunset Drive IV | G major | 108 BPM | warm strings |
| Sunset Drive V | A major | 112 BPM | all of them, four-on-the-floor for the Warden |

Each song ends on the chord that starts the next one (V of the old key = IV of the new), so the
handoffs pivot smoothly.

Parts: World 1 pads, bells, soft bass, shaker · 2 swung hats, bassline, plucks (+ the song's colour) ·
3 the half-time beat · 4 the melody · 5 (and the Warden) everything, the beat doubled, the melody with
a higher twin. Every part is an 8-bar seamless loop on the same grid, so the game can swap parts on
any bar line. `-gate` is the two-bar handoff played after the Warden.

## Making them

Needs Python 3 with numpy and scipy, and ffmpeg.

```
python3 songs5.py                     # renders out/s5/*.wav (about 6 minutes on 2 cores)
python3 encode5.py ../../../audio/lab-music   # MP3s for the game, with 0.25 s run-in/run-out around each loop
python3 check5.py                     # decodes them again: loop lines up, no step at the wrap
```

`render_part()` renders a part three times in a row and keeps the middle copy, so reverb and echo
tails from the end wrap round into the start, then crossfades the first 20 ms from what naturally
follows. Each song's World 5 part sets the loudness (RMS of its loudest 8 s at -15.5 dBFS) and the
other parts of that song use the same gain, so World 1 really is quieter (about 6 dB) than World 5.

The game side is the "Experiment: MUSIC" block in index.html (`LM_SONGS`, `lmWant()`, `lmTick()`).
If you change a tempo or the 8-bar length here, change `LM_SONGS` / `LM_BARS` there too.
