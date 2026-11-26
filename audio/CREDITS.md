# Sound credits

Every sound in this folder is **CC0 (public domain)**: free to use in any project, no credit required.
We credit the makers anyway because they earned it.

## Music
- `music.mp3`: "Synthwave House Loop" by **Fupi** (114 BPM, 24-bar loop).
  https://opengameart.org/content/synthwave-house-loop

- `lab-music/`: **Sunset Drive I-V**, made for Speeder (v0.18.0) with `sound-picker/tools/music5/`.
  Played by the Lab's MUSIC experiment. CC0, ours.

## Sound effects: the Heavy set (v0.18.0)
`shoot1-3`, `hit`, `pop`, `boom`, `wreck`, `hurt`, `power`, `shield` were made for Speeder with
`sound-picker/tools/synth.py` ("E Heavy" on the sound picker, the set players voted for). CC0, ours.
`power` and `shield` are chords in C; with the Lab's music on, the game retunes them to the song's key.

## Other sound effects (by Kenney, https://kenney.nl)
From the **Sci-Fi Sounds** pack (https://kenney.nl/assets/sci-fi-sounds):
- `zap` laser_retro_002 · `land` impact_metal_002
- `launch` thruster_fire_001 (first half second) · `engine.wav` space_engine_low_000 (made into a seamless loop)
- (until v0.18.0 also the shots, hits, explosions, crash, hurt and shield; the old set is kept in
  `sound-picker/r1/now/` for comparison)

From the **Digital Audio** pack (https://kenney.nl/assets/digital-audio):
- `jump` phase_jump_2 · `swarm` phaser_up_7

From the **Music Jingles** pack (https://kenney.nl/assets/music-jingles):
- `fanfare` jingles_sax_1 · `pass` jingles_hit_14 · `ui` jingles_hit_12

All effects were trimmed, level-matched and converted to MP3 so they play on every phone.
To swap a sound, replace the file with one of the same name, then bump `CACHE` in `sw.js`.
