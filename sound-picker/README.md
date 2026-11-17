# Sound picker

A separate page (https://speeder-game.com/sound-picker/) where Adrian auditions sound options,
one round at a time. The service worker leaves it alone (v0.16.2), so it never affects the game.

- **Round 1 (v0.16.3): direction.** `r1/<option>/` holds each option's files. A = the game today
  (same volumes), B = today's sounds smoothed and evened out, C = Synthwave, D = Retro arcade,
  E = Heavy. C-E were made from scratch with `tools/synth.py` (CC0, ours).
- Each option's `vol` table on the page uses the same numbers as the game's `sfx` table, so a
  winning option's volumes can be copied straight into `index.html`.
- The **RIDE** demo is a scripted 12-second run on the game's own mix chain (master 0.595,
  music 0.42, engine 0.13): normal fire, RAPID fire, hits, pops, a mine, a hit, a shield, a crash.

## Making and balancing sounds

- `python3 tools/synth.py <outdir>` renders the synthesized sets (needs numpy, scipy, ffmpeg).
- `python3 tools/measure.py <outdir>` measures each file as a phone speaker hears it (everything
  under 250 Hz removed) and works out a volume that puts it at a set level against the music
  (`TARGET`, in dB: shots -9, bullet hits -15, pops -2, explosions +1, crash +4, hurt +3,
  power-up +1, shield -1). These targets are a starting point, to be tuned by ear.
- What we learned measuring today's set (v0.16.1): shots sat only 1-5 dB under the music while
  firing up to 11 times a second; power-up and shield were 9-10 dB over it; the crash and the
  hurt sound were mostly deep bass that phone speakers can't play.
- The music is in **C major** (114 BPM): pitched sounds in the new sets use C, E and G.
