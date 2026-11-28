# Speeder — Project Context

> This file is the single source of truth for this project. Read it at the start of every
> session. Update it whenever something important changes.

---

## Overview

Speeder is an endless, neon-synthwave hover-racer for phones that runs in the browser and
installs to the home screen as a PWA (Progressive Web App: a website that can be installed
like an app and works offline). You pilot a futuristic speeder bike just above the ground at
high speed. The camera sits low behind you, so the horizon is near the top of the screen and
hazards rush at you from far away. **The only control is steering left and right.** The guns
fire on their own.

There are two modes (v0.8): **WARP RUN**, five worlds with their own hazards, a world gate
between each, a boss, and loops that get faster and score more; and **CLASSIC**, the original
endless run, kept exactly as it was in v0.7.7.

There is also **THE LAB** (v0.10): a test mode where new ideas are tried out without touching
the two real modes. Anyone can open it from the title screen, switch experiments on, play and
vote. **Read `LAB.md` before adding or changing an experiment.**

## Status

| Field | Value |
|-------|-------|
| **Current Version** | v0.23.2 |
| **Phase** | Prototype / Exploration (friends playing; Warp Run reworked in v0.9 after Adrian's first playtest, needs another; the Lab added in v0.10; its experiments, JUMP, SKY RAMPS, HYPERLANE and MUSIC (v0.18; Redline v0.22), and its test setup are untested on a phone) |
| **Started** | 2026-10-30 |
| **Last Updated** | 2026-11-27 |
| **GitHub Repo** | `AZ-build/speeder`, live at https://speeder-game.com/ (custom domain since v0.12.9; the old https://az-build.github.io/speeder/ address redirects there) |

---

## The Problem We're Solving

Adrian wants a fast, one-thumb arcade game he can pick up on a phone: easy to learn, with a
real sense of speed and a steady stream of small decisions. Success looks like this: you
"just one more run" it, and every few seconds you're making a choice (dodge or line up a
shot, or pick which gate to take), all with a single control.

## Goals

- Make speed *feel* good: scrolling grid, speed lines, a banking speeder, and screen shake.
- Make one input deep: steering is how you dodge, aim, and choose power-ups.
- Installable on iPhone and Android, playable offline.
- **v1.0 means:** runs at a smooth 60fps on a mid-range phone, gets harder in a satisfying
  way, has 3+ enemy types and 6 power-ups that feel distinct, keeps a best score, and has sound.
  Friends can play it from a link without being told how.

---

## How the game works (v0.1)

- **Steering:** relative drag. Put your thumb down anywhere and slide; the speeder moves by
  the same amount. It doesn't jump to where your thumb is. Desktop: arrow keys or A/D.
- **Shooting:** automatic and straight ahead, so to aim you have to steer. Bullets fly in a true
  straight line (v0.3.1), so in a bend they drift toward the outside rail.
- **Jumps (v0.3.1):** drive onto a lime ramp to launch for about a second. Fly over mines for an
  AIR bonus; later, full-width barriers can only be cleared from the ramp. Pylons are too tall to jump.
- **Edge bank (v0.6.1):** near a side rail the speeder rolls up onto its side, top facing the
  middle, and its hit area shrinks to half, so tight gaps by the edge are easier to slip through.
- **Hull:** 3 hits and you're wrecked. A hit makes you invulnerable for a moment and slows you down briefly.
- **Speed:** starts at about 160 km/h and climbs toward about 450 km/h the farther you go.
- **Obstacles:** pylons (tall, can't be destroyed), walls with a gap, slalom half-walls,
  and mines (orange, 2 shots to destroy).
- **Enemies:** drones (hover ahead and shoot; some swoop in from behind), turrets (fixed on
  the ground, they shoot as you approach), and ram bikes (head straight at you and steer toward you).
- **Moving obstacles (v0.5):** sliding pylons (glowing groove shows their path), swaying lines
  of mines, laser fences whose gap slides (bullets pass through lasers).
- **Power-up gates:** always come in **pairs**, and you pick one by driving through it. Two
  labels under the speeder show both choices early (◀ left | right ▶). Sometimes mines guard one gate.
  Maxed powers (guns at 8, shield at 2) are no longer offered.
  - SHIELD (absorbs 1 hit, stacks to 2) · GUNS+ (permanent for the run, 8 levels: 1-4 more
    bullets, 5 piercing, 6 wing missiles, 7 heavy rounds, 8 max) · RAPID (12s) · REPAIR (+1 hull) ·
    MISSILES (8 homing missiles hunt enemies, then mines) · 2X SCORE (15s; taking it again resets the timer, no stacking)
- **Score:** distance + kills, times the multiplier. Best score is saved on the device.
- **Helper text (v0.5):** gate choices, ramp warning, toasts and zone names sit below the
  speeder, never over the road ahead.
- **Title screen (v0.14):** logo, a friend's challenge if any, the speeder, then the WARP RUN | CLASSIC switch,
  "Touch to ride", your best, and one row of icon buttons (Board, Settings, Help, Share, Lab). Tips show until
  the first run on a device. Share opens the share sheet with an invite to speeder-game.com.
- **Menus (v0.2):** pause button → Resume / Leaderboard / Settings / Quit run, with a 3-2-1
  countdown on resume. Auto-pauses when you leave the app. Settings (per device): sound,
  volume, music, engine hum, vibration, steering speed, camera distance (v0.7.6: Close / Normal / Far / Full track), graphics, screen shake, leaderboard name.
- **Curving track (v0.3):** the road bends, runs S-curves and climbs onto sky roads. Bends get
  sharper with distance. Turns push you gently toward the outside; yellow chevrons warn of bends.
  Gameplay still runs on a straight "track space" underneath, so collisions are unaffected.
- **Zones (v0.3):** every 1.4 km the world blends into the next zone: Neon Desert, Neon City,
  Sky Islands, Crystal Wastes, Cosmic Highway (then repeats). Same system, different colors,
  sky objects and roadside props.
- **World leaderboard (v0.5, views v0.21):** opens on **Players**, the top 50 players by their best
  run (v0.21.0). **Runs** is the top 50 *runs* (25 until v0.9.4; one player can hold several spots), and
  **Mine** the 10 best runs on this device. Mode and view are two slim pill switches on one line.
  A run uploads if it makes the top 50 runs or is your best. If you're offline, scores wait and upload later.
- **Celebrations and sharing (v0.5):** game over shows NEW WORLD RECORD / #N IN THE WORLD /
  NEW PERSONAL BEST with confetti. "Share & challenge" sends a score picture plus a link with
  `?c=<score>&n=<name>`; opening it sets a challenge shown on the title screen.
- **How to play page (v0.5.2):** from the title screen and pause menu; lists every power-up,
  obstacle and enemy with its limits. Update it whenever a power-up or hazard changes.
- **Ladder (v0.5):** under the score during a run, the next leaderboard score to beat.

### Flight School (v0.15), the tutorial

- **What it is:** a guided Warp Run that teaches everything, hands on. 40 steps in 10 parts
  (`TUT_CH`, `TUT_STEPS` in index.html): the screen tour, controls, power-ups, obstacles, enemies,
  cells and close calls, the five worlds, the Warden and loops, then "Ride Warp Run".
- **How it runs:** `TUT.on` makes the run gentle and scripted: a steady `TUT.v` speed (40, about
  200 km/h), difficulty `TUT.lvl`, no automatic spawning (`runSpawner` returns), each world's own
  gate and hazards removed (`tutStripSector`), and hits only flash (`tutHurt`). Each step: a card
  with the game frozen (`paused`) and its subject lit up (`spot`: a HUD part from `HUDR`, `'ship'`,
  `'pause'`, `'boss'`, or a function giving a screen rectangle); "Try it" runs it; `goal()` returns
  true when done (frozen again, waits for Next) or `{ retry: 'message' }` to set it up again.
  While you practise, the instruction bar (`tutHint`) sits at the bottom of the screen, never over
  the horizon (v0.16.5); only its ? and Skip buttons take taps.
- **HUDR:** `drawHUD()` records where each HUD part was drawn ([x, y, w, h]); the tour lights them
  up and puts a tappable outline on each.
- **Never saved:** no leaderboard, local scores, ladder, analytics for runs, or player counts.
  Finishing stores `speeder.tutDone`; the first-time offer stores `speeder.tutOffer`.
- **Adding a step:** add an object to `TUT_STEPS` (id, ch, title, body; for practice: hint,
  setup(s), goal(s), done; optional spot, spotDone, sec = which world, keep). Update its text if
  the thing it explains changes, like the How to play page. Then run `node tests/tutorial.mjs "$PWD"`.

### Warp Run (v0.8, reworked in v0.9), the second mode

Same steering, guns, power-up gates and hazards as above, plus:

- **Worlds:** five, in a fixed order: Neon Desert → Neon City → Sky Islands → Crystal Wastes →
  Cosmic Highway. Each lasts **about 40 seconds whatever your speed** (v0.9: its length is worked
  out from the speed you'll be doing, never under 3.4 km; the very first world is about 55 s).
  Each has its own rail/grid/road colors, its own pylon and wall look, and a signature hazard:
  ram packs · traffic and tunnels · chasms and crosswind · crystals that burst from the road
  (3 hits) · meteors and floaty jumps. Danger colors stay the same everywhere (mines orange,
  ramps lime, lasers and enemies red).
- **World gates (v0.9):** each world ends at a gate built across the road. Its opening is a
  window onto the next world (that world's sky, ground and road). Fly through and you're there:
  no flash, no jump. The new world then **loads in** around you over about 1.5 seconds (sky
  switches on piece by piece, scenery rises out of the ground in a wave spreading away from
  you). About two seconds of clear road, then hazards again. +1,000.
- **Boss:** the Warden waits at the end of Cosmic Highway, on a straight. Line up to shoot it.
  **Three stages** (v0.9), one per third of its health: aimed shots, mine walls, lane beams and
  laser fences it sends down the road; then three-way bursts and ram bikes; then everything
  faster. It weaves and you have to chase it. Its health scales with your guns and the loop.
  +5,000, six power cells and a prototype for beating it.
- **Loops:** after the boss the worlds repeat as loop 2, 3, ... Score is multiplied by the
  loop number; top speed rises 50 km/h a loop to 655 km/h, spread across the loop's five worlds (v0.9.5); patterns and enemies get tougher.
  Anything you react to in sequence (slalom, double walls, paired laser fences) is spaced by
  time, not distance, so top speed stays fair (v0.9).
- **Power cells / OVERDRIVE:** enemies drop cells that **stay on the road where they fell**
  (v0.9); 8 cells = 8 seconds of double fire rate and +1 damage. **Close calls** (passing
  within half a unit of an obstacle) score and charge it too.
- **Rail riding limit (v0.9):** ride a side rail for about 3 seconds and it overloads: you're
  thrown back onto the road (no damage) and both rails are locked for 5 seconds. Warp Run only.
- **Prototypes:** permanent upgrades chosen from a gate pair after each boss: HEAVY CORE,
  TWIN WINGS, HULL +1, AEGIS, MAGNET, CHAIN BLAST.
- **Music:** the old "Synthwave House Loop", like Classic. (Redline played here in v0.23.0-0.23.1;
  rolled back in v0.23.2 for battery. It lives in the Lab: see `LAB.md`.)
- **Own leaderboard:** Firestore list `speeder_warp_scores`; local keys under `speeder.w.`.
  It only shows runs from version `W_BOARD_MIN_V` or newer: raising that number resets the board.
- Timing with a perfect driver: a loop takes about 4 minutes (five 40-second worlds plus the boss).

### The Lab (v0.10), the test mode

Full guide, experiment list, results guide and the recipe for adding one: **`LAB.md`**.

- **What it is:** a third mode for trying ideas before they go into the real game. A Lab run
  plays by Warp Run's rules with the switched-on experiments layered over the top.
- **Getting in:** title screen → **LAB** (lime flask icon at the end of the button row) → switch things
  on → **Ride in the Lab**. A link ending in `?lab` opens the Lab panel directly.
- **Kept apart:** Lab runs never go to a world leaderboard, the "This device" boards or the
  share card. The Lab is never the saved mode: the game always reopens on the last real mode.
  Every Lab hook in the code sits behind `LAB.on` / `labOn('<id>')`.
- **Votes:** the game-over screen asks for a thumbs up or down on each experiment that was on.
  Votes and usage go to analytics under `lab/...`, counted per variant (the experiment plus its
  options, e.g. `jump.flick.charges`).
- **Experiment 1, JUMP:** a jump you can do anywhere. Since v0.11 it is about 2.4 high for
  1.1 s (a ramp jump is 2.2 and 0.95 s; v0.10's was 1.5 and 0.7 s) and clears what a ramp jump
  clears: mines, walls, lasers, trucks, craters, ram bikes, turrets and chasms; not pylons or
  crystals. Two things are being compared: the **gesture** (flick the steering thumb up, or tap
  with a second finger; Space on a computer) and the **fuel** (hold 2 charges, each close call
  earns half of one back; or unlimited).
- **Experiment 2, SKY RAMPS (v0.11):** every 11-17 s a big lime ramp launches a flight about 6
  high for 2.6 s with five rings to steer through (+200 up to +1,000, all five = perfect flight:
  +1,000, 2 power cells, a jump charge). The road underneath is kept clear, so it is a choice.
- **Experiment 3, HYPERLANE (v0.12):** every world gate opens onto a zero-gravity hyperspace
  tunnel for about 11 s (16 until v0.12.6) before the next world. The same drag steers up and down too. Rocks
  (shoot or dodge), lasers, iris walls (fly through the hole), six-ring lines, cell spirals and
  one power-up orb per lane. The road waits while you're in it. Compared: **flying style**,
  Barrel rolls (the speeder rolls its top toward where it's going, flips on dives, a fast swipe
  spins it round) vs Smooth banks (never upside down).
- **Experiment 4, MUSIC (v0.18, Studio songs v0.20, Redline v0.22):** music that builds world by
  world. Option **Soundtrack**: **Redline** (default; Claude's live-synth track, `audio/redline.js`;
  it was Warp Run's music in v0.23.0-0.23.1, rolled back for battery) or **Sunset Drive** (the
  recordings). "My Studio songs" only on a device that opened the hidden Studio. Details in `LAB.md`.
- **Test setup (v0.11):** a card in the Lab panel, not an experiment: **Start on loop 1-6**
  (the run begins at that loop's speed, difficulty and score multiplier) and **Fully loaded**
  (guns at level 8 and 2 shields from the start). For testing at high speed. v0.12 adds
  **Start in a hyperlane** (shown while HYPERLANE is on).
- **Ideas queued for the Lab:** new roads (raised or split), forks in the road (see `LAB.md`).

---

## Tech Stack & Tools

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Plain HTML + JavaScript + Canvas 2D | One file: `index.html`. No libraries, nothing to install. |
| 3D look | Homemade perspective math ("pseudo-3D") | Out Run-style. Everything is projected from world x/y/distance onto the screen. |
| Sound | Web Audio playing CC0 audio files in `audio/` | Effects: the Heavy set made for Speeder (v0.18.0) plus a few from Kenney's packs, tuned to sit with the music in v0.22.0 (soft bus, ducking, limiter). Music: "Synthwave House Loop" by Fupi (tempo and brightness follow the run) everywhere but the Lab's MUSIC experiment, which plays Redline (`audio/redline.js`, synthesised live, made for Speeder) or Sunset Drive I-V (`audio/lab-music/`). With sound off no audio runs at all (v0.23.2). Sound off by default (v0.23.1) while Adrian refines the music. Credits in `audio/CREDITS.md`. |
| Offline / install | `manifest.webmanifest` + `sw.js` (service worker) | Bump `CACHE` in sw.js after each change so phones get updates. |
| Backend / DB | Firebase Firestore, **ORBit's project `orbit-23921`**, lists `speeder_scores` (Classic) and `speeder_warp_scores` (Warp Run) | Loaded only when needed (Firestore "lite" library). Settings and local scores live in the browser's localStorage. Rules: `firestore-rules-speeder.txt` (Classic) and `firestore-rules-warp.txt` (Warp Run). v0.17.0 prepared a move to Speeder's own project plus App Check (`SPEEDER_FIREBASE`, `APP_CHECK_KEY`, `firestore-rules-own-project.txt`, `FIREBASE-SETUP.md`): not done yet, waiting on Adrian. |
| Hosting | GitHub Pages, custom domain `speeder-game.com` | A PWA needs https to install; GitHub Pages provides it for free. Domain bought by Adrian through Squarespace (2026-11-16); its DNS records point at GitHub Pages. The `CNAME` file in the repo holds the domain: never delete it. |

### Files

```
Speeder/
├── index.html             ← the whole game
├── manifest.webmanifest   ← app name, icons, colors (for "install")
├── sw.js                  ← service worker (offline caching)
├── icons/                 ← app icons (192, 512, maskable 512, Apple 180, favicon 32), v2 artwork since v0.13.0
├── social/                ← card-bg.jpg (score card artwork, 1080x1350) and share-wide.jpg (link preview, 1200x630)
├── stats/index.html       ← private stats page (speeder-game.com/stats/): GoatCounter API + leaderboards; not part of the game
├── CNAME                  ← the custom domain (speeder-game.com) for GitHub Pages; never delete
├── audio/                 ← sound effects, engine loop, music + CREDITS.md (all CC0); lab-music/ = Sunset Drive I-V for the Lab (v0.18.0); redline.js = the Redline synth and arrangement (v0.22.0)
├── studio/                ← the Speeder Studio (v0.20.0): index.html (the page) and engine.js (synth + sequencer, also used by the Lab)
├── sound-picker/          ← page for auditioning new sounds (speeder-game.com/sound-picker/), its files and tools; see its README.md; tools/redline/preview.mjs renders a Redline listening preview
├── README.md              ← how to play it locally and publish it
├── moderation.txt         ← the hide list: board entries, devices and name words to hide (v0.17.0); the game reads it every 10 minutes
├── FIREBASE-SETUP.md      ← Adrian's steps for Speeder's own Firebase project and App Check (prepared in v0.17.0)
├── firestore-rules-own-project.txt ← the whole rules page for that new project
├── firestore-rules-speeder.txt ← the database rules block for the Classic leaderboard
├── firestore-rules-warp.txt ← the database rules block for the Warp Run leaderboard
├── firestore-rules-feedback.txt ← the rules block for player feedback (v0.19.0; ADMIN_UID = Adrian's ID, from the stats page)
├── firestore-rules-FULL.txt ← the whole Firebase rules page as published (ORBit + Classic + Warp Run); keep it in step whenever a block changes
├── LAB.md                 ← the Lab: rules, experiments, how to read results, how to add an experiment
├── tests/                 ← automated checks (see "Before you publish" in LAB.md); not part of the game
├── PROJECT_CONTEXT.md / CHANGELOG.md / BACKLOG.md / TODO.md
```

### Key tuning knobs (top of the script in index.html)

`CAM_H` / `PLAYER_Z` camera height and distance behind the speeder (now worked out per screen in `fitView()`) ·
`SHIP_AT` where the speeder sits on screen · `SHIP_SCALE` / `SHIP_TILT` speeder size and tilt ·
`SHIP` / `PYLON_MESH` the 3D models (lists of corner points and faces) ·
`DRIFT` how hard turns push you outward, `DRIFT_MAX` / `W_DRIFT_MAX` the most they can push in Classic / Warp Run · `kMaxAt()` how sharp bends get with distance ·
`planCourse()` the bend and hill generator · `THEMES` zone colors, sky layers, props and hills ·
`ZONE_LEN` zone length · `RAMP_*` / `JUMP_T` / `JUMP_G` ramp size and jump feel · `QUALS` what each graphics level turns on ·
`FAR` draw distance · `FPS_PLAY` / `FPS_IDLE` / `FPS_PAUSED` frame-rate caps · `QUALS[].px` pixel budget · `GLOSS_MAX_AREA` biggest screen that gets reflections · `TRACK_HALF` track half-width · `PATTERNS` which hazards appear and
from what distance · speed curve in `update()` (`32 + 58 * (1 - exp(-d / 4500))`) ·
steering sensitivity in `steerSensitivity()` · `GUN_MAX` / `GUN_PERKS` gun levels ·
`MULT_TIME` 2X duration · `EDGE_START` / `EDGE_BANK` / `EDGE_HALF_W` / `EDGE_YAW` the edge bank and how skinny it gets · `VIEW_TAN` / `CAM_VIEWS` (the Camera setting's levels) / `FIT_WIDE` / `VIEW_MAX_H` camera angle, how close it is, and big-screen fit (`fitView()`) · `CAM_TRACK` how much the camera follows your sideways move · `CAM_FOLLOW` how quickly it eases after you · `AIM_AHEAD` how far it looks into turns · `STEER_EASE` how quickly the speeder glides to your thumb · `LEAN_MAX` / `LEAN_GAIN` the small lean while moving · `SWARM_N` missiles per MISSILES pickup ·
`MUSIC_VOL` / `MUSIC_RATE_MAX` music level and top tempo · `sfx` (in the Sound section) each effect's file, volume and pitch (retuned in v0.22.0; `true` as the last argument = the soft bus) · `SFX_SOFT_HZ` / `SFX_FOLLOW` the soft bus's top end and how it follows Redline's level · `duckMusic()` how far and how long the music dips under a big sound · `ENGINE_VOL` / `ENGINE_VOL_LAB` engine hum, and under the Lab's music · `AU.limit` the final limiter ·
`PART_MAX` particle cap · `QUALS[].fx` / `QUALS[].gloss` particle amount and glossy road per graphics level · `DRONE_MESH` / `RAM_MESH` / `TURRET_BASE` / `TURRET_HEAD` enemy models · `drawGloss()` road reflections · `drawShield()` shield bubble · `G.slowmo` wreck slow motion ·
`kmBucket()` / `WARP_KM` / `CLASSIC_KM` / `LAB_KM` the distance buckets in analytics (match the stats page) · `LOOP_CAP` highest loop number in analytics · `trackRunNumber()` the exact run counter (`runs/<mode>/<n>`) · `GC_CODE` analytics on/off (GoatCounter site code, now `speeder`; dashboard https://speeder.goatcounter.com, and our own at https://speeder-game.com/stats/) · `trackOnce()` / `trackPlayerRun()` / `trackNamed()` the once-per-device player counts · `TOP_AGE_*` how long a downloaded leaderboard is reused ·
`WIND_SIGN_Y` where the WIND sign sits (`drawWindSign()`) · `FEEDBACK` / `FB_MAX` / `FB_GAP` / `FB_DAY` feedback collection, note length, time between notes and notes a day per device ·
`choosePowers()` how often each gate appears · `BARRIERS` / `BARRIER_GAP` which patterns can't follow each other and the space after them · `BOARD_N` leaderboard size · `PLAYERS_PAGE` / `PLAYERS_MAX_READ` / `TOP_AGE_PLAYERS` how the Players view reads runs (page size, most runs read, how long it's reused).

**Warp Run knobs:** `SETTINGS_DEFAULT.mode` which mode new players start on · `W_WORLD_T` seconds a world lasts · `W_SECTOR` the shortest a world can be · `REZ_T` / `REZ_AT` how long a new world takes to load in and when each part of the sky switches on · `GATE_H` / `GATE_DEP` / `GATE_PW` the world gate's size · `RAIL_HOT_T` / `RAIL_COOL_T` / `RAIL_X` rail riding: seconds before overload, seconds locked, how close to the edge counts · `BOSS_PACE` the boss's rest between attacks per stage · `BOSS_SNIPE` how often it fires single shots under its other attacks · `W_BOARD_MIN_V` oldest version whose scores the Warp board shows · `sp` / `v` / `ml` in `spawnPattern` (how patterns stretch with speed) · `W_SPEED_STEP` / `W_SPEED_MAX` top speed per loop and its cap · `W_LVL_STEP` pattern difficulty per loop · `OD_NEED` / `OD_TIME` cells for OVERDRIVE and how long it lasts · `BOSS_TOUGH` / `BOSS_PTS` / `BOSS_SEQ` boss health, reward and attack order for each of its three stages · `SKINS` each world's colors, obstacle look, `curve` (bendiness), `float` (jump length), `pat` (how often ordinary patterns appear) and `sig` (its own patterns) and `extra` (its own roadside props) · `drawRoadside()` the lamps, lanterns and beacons along each world's road · `drawTower()` / `buildWindowTex()` buildings · `TRAFFIC_CLOSE` how fast you catch traffic · `POWERS` entries starting `p_` are the prototypes · `NEAR_TYPES` what counts for close calls · `TUN_W` / `TUN_H` tunnel size.

**Lab knobs:** `LAB_EXPERIMENTS` the list of experiments (the Lab panel, saved switches, votes and analytics build themselves from it) · JUMP: `HOP_H` / `HOP_T` how high and how long a jump is · `HOP_MAX` charges you can hold · `HOP_PER_CLOSE` charge earned per close call · `HOP_OVER` which obstacles a hop clears · `FLICK_PX` / `FLICK_MS` / `FLICK_RATIO` what counts as a flick up · `TAP_MS` / `TAP_PX` what counts as a one-finger tap · SKY RAMPS: `SKY_W` / `SKY_LEN` / `SKY_H` the ramp's size · `SKY_PEAK` / `SKY_T` how high and how long the flight is · `SKY_RINGS` / `RING_R` how many rings and how big · `RING_PTS` / `RING_PERFECT` points · `SKY_EVERY` seconds between sky ramps · HYPERLANE: `LANE_T` seconds in a lane · `LANE_R` / `LANE_LIM` tunnel size and how far you can go · `LANE_SPEEDUP` / `LANE_MIN_V` speed · `LANE_CAM_Z` / `LANE_ZOOM` / `LANE_FOLLOW` camera · `LANE_PANEL` / `LANE_LIT` / `LANE_PULSE` / `LT_PULSE` the walls' colours and light pulses · `LANE_WARP` / `LANE_STREAKS` light-speed ripple and streaks · `LANE_CAM_UP` / `LANE_FOLLOW_Y` keep the speeder below the far end · `LANE_BEND` how much it snakes · `LANE_GAP` space between sections · `ROLL_V` / `LANE_ROLL_RATE` / `LANE_BANK` how the speeder rolls · `SPIN_V` / `SPIN_T` barrel roll swipe and length · `LROCK_HP` / `LRING_PTS` / `LRING_PERFECT` / `LIRIS_HOLE` hazards and points · `LANE_SECTIONS` what's in a lane · MUSIC: Redline (in `audio/redline.js`): `levelFor()` layers by loop and world, `bpmFor()` / `BPM_MIN` / `BPM_MAX` tempo, `LOOP_KEYS` keys, `OPEN` filter build per level, `LIFT` level per level, `PUMP` kick ducking, `RIFFS` / `PROG_A` / `PROG_B` the tunes, `POOL` what varies at the top each loop, `KIT` drums and effects · Sunset Drive: `LM_SONGS` (tempo and key of each song) · `LM_BARS` loop length · `LM_VOL` level · `LM_FADE` crossfade · `LM_ROLL` run-in/out in each file · test setup: `LAB_LOOPS` the highest starting loop offered.

### Testing hooks

Automated checks live in `tests/`: `bash tests/same-as-before.sh` (Classic and Warp Run play exactly as in the last commit), `node tests/lab.mjs "$PWD"` (the Lab), `node tests/lane.mjs "$PWD"` (the hyperlane), `node tests/soak.mjs "$PWD"` (a bot plays long Lab runs), `node tests/tutorial.mjs "$PWD"` (an autopilot plays all of Flight School), `node tests/fairplay.mjs` (anti-cheat, name filter, hide list; serves the game at a pretend web address with a stand-in Firebase), `node tests/touch.mjs "$PWD"` (a resting or creeping second finger never steers), `node tests/keyboard.mjs "$PWD"` (name boxes stay above a phone keyboard), `node tests/music.mjs "$PWD"` (the Lab's MUSIC, Sunset Drive option, played in real time with audio over http), `node tests/studio.mjs "$PWD"` (the Studio and Studio songs in the Lab), `node tests/board.mjs "$PWD"` (the leaderboard's Players and Runs views), `node tests/redline.mjs "$PWD"` (the Lab's Redline soundtrack: rules, tempo cap, variety, cost, a real run). Run all twelve before publishing.

**Since v0.17.0 the hooks below only exist with test tools on:** add `?dev` to the address on the live site (e.g. https://speeder-game.com/?dev; it stays on for that tab and shows "TEST TOOLS ON"), or open the game from a file / localhost (the tests do). Runs with test tools on never reach a world board, and analytics is off. The game's own names (`G`, `SET`, `TUT`...) are no longer global: use `SPEEDER.inside(() => G.d)` to run code inside the game.

Flight School hooks: `SPEEDER.tutStart('help')`, `SPEEDER.tutGo(n)` (jump to step n), `SPEEDER.TUT` (`cur`, `mode`, `ev` counters), `SPEEDER.TUT_STEPS`, `SPEEDER.HUDR`.

Lab hooks: `SPEEDER.setMode('lab'); SPEEDER.startGame()` (start a Lab run), `SPEEDER.LAB` (`on`, `cfg` = the saved switches, `run` = this run's experiments), `SPEEDER.labSet('jump', 'gesture', 'tap')` / `SPEEDER.labSet('jump', 'fuel', 'free')` / `SPEEDER.labSet('jump', 'on', false)`, `SPEEDER.tryHop('key')`, `SPEEDER.hopCharge(1)`, `SPEEDER.JUMP` (`n` charges, `hops`, `denied`, `by`), `SPEEDER.openPanel('lab')`, `SPEEDER.labSet('ramps', 'on', true)`, `SPEEDER.spawnSkyRamp(SPEEDER.G.d + 90)` (put a sky ramp just ahead), `SPEEDER.SKY` (`offered`, `flights`, `rings`, `perfect`), `SPEEDER.labSet('setup', 'loop', 3)` / `SPEEDER.labSet('setup', 'loaded', true)` (test setup for the next Lab run), `SPEEDER.labSet('lane', 'feel', 'bank')`, `SPEEDER.labSet('setup', 'lane', true)` (next Lab run starts in a hyperlane), `SPEEDER.startLane('resume')` (into a lane now), `SPEEDER.LANE` (`on`, `x`/`y` and `tx`/`ty` the speeder and its target, `roll`, `objs`, `runs`, `rings`, `hits`, `rolls`), `SPEEDER.LANE.exit.d = SPEEDER.LANE.d + 30` (to the exit). Lab storage keys: `speeder.lab.cfg` (switches), `speeder.lab.setup` (starting loop, fully loaded, start in a hyperlane), `speeder.lab.best`, `speeder.lab.votes`.

Warp Run keeps the same per-mode keys under `speeder.w.` (`speeder.w.best`, `speeder.w.local`, `speeder.w.worldTop`, ...), plus `speeder.w.live` (set once its world board has loaded) and `speeder.w.boardV` (the board reset this device has applied). `speeder.hidden.<mode>` (v0.17.0, replaced `speeder.w.hidden`): scores of entries left off a board (hidden by moderation.txt, or older than the Warp board reset), left out of your rank. `speeder.mod` the last moderation.txt, `speeder.dbRest` when to try Firebase again after the daily allowance ran out. `speeder.pendingRuns` is shared; each run carries its mode.

Local storage keys: `speeder.settings`, `speeder.best`, `speeder.local`, `speeder.pid` (player ID), `speeder.onlineBest`, `speeder.myRuns` (your board entries), `speeder.pendingRuns` (waiting to upload), `speeder.worldTop` (cached top 50 for the ladder), `speeder.worldTopAt` (when it was downloaded), `speeder.challenge`, `speeder.seen` (analytics: not a new player).

`window.SPEEDER` (test tools only, see above) exposes game state (e.g. `SPEEDER.G.d = 3000`
jumps ahead in difficulty and zone, `SPEEDER.setQuality(0)` forces Low graphics, `SPEEDER.G.invuln = 999` makes you invincible,
`SPEEDER.applyPower('missile')` gives a power-up, `SPEEDER.die()` ends the run, `SPEEDER.explode(x, y, d, color, big)` sets off a blast,
`SPEEDER.hurt()` takes a hit, `SPEEDER.addEnemy('turret', {...})` places an enemy).

Warp Run hooks: `SPEEDER.setMode('warp')`, `SPEEDER.WP` (run state: `loop`, `sec`, `theme`, `phase`, `perks`, `od`, `rez`), `SPEEDER.G.d = SPEEDER.WP.gateD - 200` (jump to just before the world gate or boss), `SPEEDER.enterWorld()` (go to the next world now), `SPEEDER.WP.rez = 0` (replay the load-in), `SPEEDER.WP.rail` / `railLock` (rail heat and lock), `SPEEDER.startBoss()`, `SPEEDER.spawnWarpPattern('traffic' | 'chasm' | 'spikes' | 'meteors' | 'rampack', SPEEDER.G.d + 100, 5)`, `SPEEDER.chargeOD(8)`, `SPEEDER.applyPerk('p_core')`, `SPEEDER.stats.pat` (how many of each pattern have spawned), `SPEEDER.step(1/60, 600)` (run 10 seconds of game instantly).

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Controls | Relative finger drag | Adrian picked drag. Relative stops the thumb from hiding the speeder and works anywhere on screen. |
| Shooting | Automatic, forward only | Keeps the game to one input; aiming *is* steering, which creates tension with dodging. |
| Structure | Endless run, rising speed | Best fit for quick phone sessions and chasing a high score. |
| Look | Neon synthwave | Adrian's pick. Glowing grid, striped sun, wireframe mountains. |
| Tagline (v0.16.1) | "Left. Right. No brakes." | Adrian's pick: says the one control (side to side) and the speed. He liked "One thumb. No brakes." but not the word thumb. |
| Power-ups | Paired gates, choose by lane | Adds a real decision without another button. Claude suggested it, Adrian approved. |
| Rendering | Canvas 2D pseudo-3D, no three.js | Light, fast on phones, nothing to install, suits the retro look. |
| Gate preview banner | HUD chips at top | At speed, gate labels are only readable late, so the banner lets you choose early. |
| Leaderboard | Global, in ORBit's Firebase project | Adrian chose global. Reusing ORBit's project avoids a new account and setup. |
| Leaderboard entries | One per run (v0.5), only runs that make the top 50 (25 before v0.9.4) or are your best | Adrian wants players to own several spots. Same database list, so no breaking change. |
| NOVA → MISSILES | Homing missile swarm | NOVA was hard to understand; missiles you can watch are clearer and more fun. Adrian's idea. |
| Guns past level 4 | New abilities, not more bullets | More bullets would clutter the screen and cost frame rate. |
| Helper text | Below the speeder | That part of the screen shows road you've already passed. |
| Barrier spacing | No two barriers in a row, 48-unit gap after one (v0.5.3) | Players found a laser fence right after a wall impossible. |
| Score balance | Leave as is for now (2026-11-04) | Adrian wants feedback first; a rebalance would mean resetting the board. |
| 2X stacking | Removed in v0.5.1 | Adrian: it would let scores run away; score should be mostly about distance. |
| Sharing | Score picture + challenge link | Turns a good run into an invite for a friend. |
| Game over restart | "Ride again" button, not tap-anywhere | Stops accidental restarts while typing a name. |
| Camera | Height 2.6, speeder ~60% down the screen (v0.4) | Kids' thumbs covered the speeder at 77%. Higher + closer keeps it visible and feels more like driving. Trade-off: road ahead is a little more squeezed. |
| Steering feel (v0.6.2) | Quick glide to the thumb (as before), small lean while moving | v0.6.1 locked the speeder to the thumb; Adrian found it felt wrong and asked for the smoothing back. |
| Edge bank (v0.6.1) | Rolls up on its side near the rails (top facing the middle) and its hit area halves | Adrian's idea: side gaps are hard to reach fast with a thumb, and it looks great. Replaced the v0.5.1 lean into quick turns. Risk: riding the rail could become the safe spot. |
| Speeder and pylons | Small homemade 3D models (flat-shaded faces) | Lets the speeder really roll and turn, without adding a 3D library. |
| Scenery vs road | Scenery drawn with the nearer road cut out | Stops buildings appearing on top of raised roads. |
| Curves | Bend the drawing, not the gameplay | Everything is drawn through one per-frame bend table, so rails, hazards, gates and bullets can't misalign, and collisions didn't change. |
| Hills | Track only lifts above the ground; never hides behind a crest | Keeps hazards visible at all times. |
| Scenery | Recycled pool, drawn under gameplay, kept off the track | Rich world without hurting readability or frame rate. |
| Zones | One shared system, 5 color/prop mixes that blend | Variety without five separate environments to maintain. |
| Graphics quality | Auto steps down if the frame rate drops | Keeps older phones smooth without asking players to tune anything. |
| Sound (v0.6) | Free CC0 sound files instead of generated tones | Adrian found the generated sounds cheap. CC0 means no licence worries or credit needed. |
| Analytics (v0.6.3) | GoatCounter, events only, no cookies | Free, privacy-friendly, phone-friendly dashboard, no cookie banner. Offline runs aren't counted. |
| Sound off (v0.16.3) | Off by default, and switched off once on every device (`SOUND_RESET`), while new sounds are picked | Adrian found the sound jarring. Raise `SOUND_RESET` (and set the default back on) when the new set ships, so everyone hears it. |
| Picking sounds (v0.16.3) | A separate picker page, one round at a time: direction first, then each sound, then balance | Adrian wants to choose each sound himself. The page plays a scripted run through the game's own mix, so options are judged in context, at matched levels. |
| Stats page (v0.16.2) | Our own page at speeder-game.com/stats/ reading GoatCounter's API, not a Claude artifact | Adrian asked for an artifact, but artifacts can't reach outside sites, so it couldn't be live. The key lives only in Adrian's browser; the page shows nothing without it. Trade-off: the address is public (harmless without the key). |
| Players view (v0.21.0) | Board opens on top 50 players by best run; Runs and Mine one tap away. Built by reading runs top-down (up to 300) and keeping each player's first | Adrian: more people are playing, so a few grinders shouldn't fill the board. No Firebase change. Trade-off: up to 300 reads per Players download instead of ~65 (kept 5 min on the device). If one day it reads too much, a per-player "best" list in Speeder's own Firebase project is the fix. |
| Leaderboard reads (v0.6.3) | Reuse a recent download; only re-download after a run that could make the board | Free Firebase plan is ~50k reads/day, shared with ORBit. |
| Built-in browsers (v0.6.3) | Detect TikTok/Instagram etc. and say "Open in browser" | They can't install the game, and the game is being shared on TikTok. |
| Visual polish (v0.7) | Particles with flashes, shockwaves and debris; 3D enemies; glossy road on High only | Adrian wanted more polish. Heavier effects are tied to the graphics level so older phones skip them. |
| Camera fit (v0.7.5) | Close chase camera, ~1.5x farther back than v0.7.1; eases after the speeder (85% follow, slight lag) and looks into turns, as in v0.7.1; wide screens show the whole track (≤85% width) and don't move | v0.7.2 fit the whole track on phones but was too zoomed out: lost the feel of flying. A close camera can't show both rails. v0.7.3's lag-free lockstep camera felt stiff, so the v0.7.1 smoothing is back. |
| Camera setting (v0.7.6) | Players pick Close / Normal / Far / Full track; Normal is the default | People disagree on close-and-thrilling vs seeing the whole track; a setting lets each player choose. |
| Steering (v0.7.7) | Crossing the track takes a drag of nearly the full screen width on a phone; capped at 400 points (`STEER_MAX_W`) so foldables/tablets need the same thumb travel as an iPhone | Tried thumb-distance steering in v0.7.2 (~230 points to cross); Adrian found it too touchy. The old 520-point cap made unfolded folds need ~3.1 in of thumb travel. |
| Extra touches (v0.16.6) | A second finger only takes over the steering once it slides 12 points (`TAKEOVER_PX`); when one lifts, the finger still down keeps steering. Steering speed slider now 50-250% | A resting palm or other thumb used to take over at once and leave the moving thumb dead until lifted: an Android friend had to lift his thumb almost every move. |
| Bullet speed (v0.17.1) | Above 450 km/h bullets fly faster and farther in step with your speed (`SHOT_KEEP_V`, `shotPace()`); fire rate unchanged | A friend: "the ship travels as fast as its weapons". At 655 km/h the road came at you faster than bullets pulled away. Classic and loop 1 never pass 450, so they're unchanged. No board reset (Adrian's call). |
| Frame pacing (v0.17.1) | Measure the screen's refresh rate and draw every Nth refresh: 60/90 Hz every refresh, 120/144 Hz every other | The old timer drew 90 Hz screens 11 and 22 ms apart by turns: judder that shows at high speed. Trade-off: 90 Hz phones draw 90 fps (a little more battery). |
| Second finger (v0.17.1) | Takes over only with a quick slide (12 points within 250 ms, `TAKEOVER_MS`), also after the thumb lifts | v0.16.6's "12 points since it landed" let a creeping palm steer the speeder on its own. |
| Frame rate (v0.7.1) | Capped at 60fps; 30 on title/game over, 15 when paused | 120Hz Android phones were drawing twice as often as iPhones and draining battery. |
| Big screens (v0.7.1) | Pixel budget per graphics level; reflections only on phone-sized screens | An unfolded foldable drew ~3x the pixels of an iPhone. Normal phones are unaffected. |
| Modes (v0.8) | Classic kept untouched; all new ideas live in a second mode, Warp Run, which is the default | Adrian's call: keep the existing experience as Classic. Separate best scores and leaderboards, so Classic's board never needs a reset. |
| World length (v0.8) | 3.4 km per world in Warp Run (Classic zones are 1.96 km on the HUD). Superseded in v0.9: see below | A Classic zone lasts ~16 s at top speed with a 4 s fade: too short to notice. |
| World identity (v0.8) | Recolor track, rails, pylons and walls per world; never recolor mines, ramps, lasers or enemies | Players read hazards by color at 450+ km/h. Adrian agreed with the push-back on recoloring everything. |
| World transitions (v0.9) | A gate you can see the next world through; the swap happens when its window fills the screen; the new world then loads in around you | v0.8's wormhole disc, white flash and hyperspace tube felt cheap and overlaid, and broke the flow. Adrian: "a portal gate", and the world "blinks into existence since it all looks like a digital world". |
| World length (v0.9) | About 40 seconds per world in every loop (length follows speed) | A fixed 3.4 km took ~15 s at loop-5 speed: no time to get into a groove. |
| Top-speed fairness (v0.9) | Slalom, double walls and paired laser fences are spaced by time; laser gaps never under 2.8 and paired fences line up | Adrian found slalom and sliding lasers too hard at top speed. Warp Run only. |
| Collisions (v0.9) | Checked against the whole stretch travelled in a frame | At 655 km/h a laser fence only registered 59% of the time (the road moved further in a frame than the fence is deep). Fixed in both modes. |
| Rail riding (v0.9) | Rail overheats after ~3 s, throws you off with no damage, locks both rails for 5 s | Adrian: you could wall-ride a whole zone. Limiting it keeps the edge trick for tight gaps (his v0.6.1 idea) without punishing a brush with the rail. Warp Run only, so Classic stays as it was. |
| Boss (v0.9) | Three stages with new attacks, more health, harder to keep in your sights | Adrian found the v0.8 boss too easy. More variety and pressure rather than only a bigger health bar. |
| Boss (v0.9.3) | Constant aimed shots under every attack; beams, mine walls and fences come in linked pairs or chains | Early feedback: still too easy. A test driver took 0 hits from v0.9.0's boss; attacks that each need one small move never overlapped. |
| Bend push (v0.9.3) | Capped at 0.5 units/s in Warp Run (was 2) | At Warp Run speeds it reached the cap in most bends and felt like the speeder steering itself. Classic unchanged. |
| Bend push (v0.9.5) | Removed in Warp Run (`W_DRIFT_MAX = 0`) | Adrian: high loops need fine control; the speeder should only move with your thumb. Crosswind (a hazard) stays. Classic unchanged. |
| Loop speed-ups (v0.9.5) | Spread over the loop's five worlds, rising smoothly (`warpTop()`); loop 1 unchanged | Adrian found the +50 km/h jump at each new loop too sudden. |
| Board resets (v0.9) | `W_BOARD_MIN_V`: the Warp board only shows runs from that version on | The game will keep changing; old scores shouldn't be unbeatable. Needs no Firebase work (the rules don't allow deletes). |
| Loops and score (v0.8) | Score x loop number; +50 km/h and tougher patterns per loop | Makes score mostly about how far you get, which Adrian wanted, without touching Classic's board. |
| Late-loop fairness (v0.8) | Hazard spacing stretches with speed | Speed is the new difficulty; the time between hazards never drops below Classic's hardest. "Challenging, not impossible." |
| Boss health (v0.8) | Scales with your firepower (to the power 0.75) and the loop | Gun damage ranges 15x from level 1 to maxed. A fixed health bar was either a wall or a 2-second fight. Better guns still kill it about twice as fast. |
| Boss arena (v0.8) | Straight road | Bullets drift outward in bends; at boss range that's up to 3 units, which made hits feel random. |
| Warp leaderboard (v0.8) | Its own Firestore list, `speeder_warp_scores` | The Classic rules only allow fixed fields and a per-km score cap that loops break. A new list needs one paste of rules by Adrian; until then scores wait on the device. |
| The Lab (v0.10) | A third mode for experiments, on Warp Run's rules, with on/off switches, no leaderboard, and a thumbs up/down after each run | Adrian wants to try ideas (a jump, new roads, mega jumps, a space-flight stretch) without merging them into the game, and for anyone to be able to try them. Less prominent than the two real modes on purpose. |
| Lab is never the saved mode (v0.10) | The game always reopens on the last real mode | A friend who tries the Lab once shouldn't come back the next day to runs that don't count. |
| Lab votes (v0.10) | Counted per variant, one per device unless it changes | Lets two versions of an idea be compared, and counts people rather than runs. |
| Jump gesture (v0.10) | Two are being tested side by side: flick up and second-finger tap | Claude's concern: a flick can misfire because the thumb drifts up and down while steering. The Lab decides rather than guessing. |
| Jump cost (v0.10) | Tested both ways: 2 charges earned from close calls, or unlimited | Claude's concern: a free jump makes mines, chasms and ramps stop mattering. A hop is also lower than a ramp jump and can't clear pylons, crystals, trucks or lasers, so ramps keep their job. |
| Bigger jump (v0.11) | About 2.4 high for 1.1 s (was 1.5 and 0.7), and it clears lasers and trucks too | Adrian: higher and longer, "so you can do more and earn more". Once the jump visibly flies over a truck it has to clear it. Trade-off: it now does what an ordinary ramp does, so only the charge cost keeps ordinary ramps meaningful. |
| Sky ramps (v0.11) | A choice, not a gate: the ramp is 5 wide and the road under the flight is kept clear | Adrian asked for ramps with rings to fly through in the sky. Keeping the road clear means nobody is punished for missing a ramp at 500 km/h. Trade-off: skipping one is 2.6 s of empty road. |
| Rings (v0.11) | They keep time with the speeder in flight; each is worth more than the last | Height always matches the flight arc, so only steering decides a hit. Rising values reward finishing the line. |
| Test setup (v0.11) | Starting loop and "fully loaded" live in the Lab only, with no vote | Adrian wants to test ideas at high speed without 20 minutes of play first. Kept out of the real modes so leaderboards stay fair. |
| Hyperlane placement (v0.12) | At every world gate, not only after the Warden | Adrian: "you shouldn't have to get to the end of a loop to try it". Trade-off: a Lab loop takes about a minute longer. |
| Hyperlane and the road (v0.12) | The road waits while you're in the lane; the lane takes over update and drawing | Keeps the lane fully separate from road gameplay, so it can't break Warp Run, and lets it live in the Lab as a layer rather than its own run. |
| Hyperlane steering (v0.12) | The same relative drag, now two-way, held inside a circle; no jumps in the lane | One input stays the design. A flick-up jump would fight steering up. |
| Speeder in the lane (v0.12) | Two styles compared: Barrel rolls (top toward the move, flips on dives, swipe to spin) vs Smooth banks | Adrian described the first; Claude's concern: flipping upside down may disorient, so the Lab compares it with a calmer one. Rolls are looks only, never change collisions. |
| Hyperlane look (v0.12.1) | Lit blue-violet tunnel, dark hazards edged in neon, bright pickups; walls never take the next world's colour | Adrian: needs more contrast between walls and what's coming, maybe lighter walls, a bigger tunnel, zoomed in. Light-vs-dark plus cool-vs-warm keeps hazards readable at speed. |
| Music speed-up | Play the loop faster (pitch rises too) as speed climbs, capped at +14% | Simple, no extra files, and the rising pitch adds urgency. Trade-off: a pitch-preserving version would need several pre-made copies of the track. |
| Wind warning (v0.19.0) | A light, see-through WIND sign high on the side the wind comes from, chevrons pointing the way it blows; the notice under the speeder stays | Adrian heard from several players who'd reached high loops that they never knew about the wind and thought the speeder was steering itself. His design: light, not distracting, on the wind's side. |
| Feedback (v0.19.0) | Notes from the title screen (Ideas) and after a run, saved in Firestore; only Adrian can read, mark done or delete them, on the stats page, signed in with Google | Adrian wants feedback in one place he can work through. Firestore rules can only tell it's him through sign-in, so the stats page signs him in and the rules check his ID. Trade-off: one-time setup in the Firebase console. |
| Beat composer (v0.20.0) | The Speeder Studio: a page of grids and knobs with guardrails (scale-only notes, 16-step grid, mood-limited chords); its songs play live in the Lab | Adrian found the composed music too chill and wanted to shape it himself. Live synthesis means what he hears in the Studio is exactly what plays in the game, with no files to render. Trade-off: code-made instruments, and the synth runs during play (phone performance unverified). |
| Sound effects (v0.18.0) | The Heavy set from the sound picker, at its balanced volumes; sound still off by default | Adrian: "heavy got the most votes. Use that please." Turning sound back on for everyone (`SOUND_RESET`) is left for him to decide. |
| New music (v0.18.0) | Sunset Drive I-V, made for Speeder, in the Lab first | Adrian found free packs off-target; he wants chill that builds (his Spotify "e-Jamz" is the reference) and loved the Sunset Drive sketch. Five variations, one per loop, so a 30-minute run doesn't repeat. |
| Redline (v0.22.0) | Claude composes one live-synth track that follows the run (levels by world, tempo by the road's speed, capped at 128 BPM, variety instead of speed at the top); default soundtrack in the Lab, Sunset Drive still a choice | Adrian found the Studio too hard on a phone and asked Claude to make the music: big, slow-building synth, starts low, speeds up with the levels but not past top speed, then new riffs and effects. Live synthesis is the only way the tempo can follow the speed without pitch changes and the riffs can vary for ever; drums and pads are pre-rendered so it costs less than the Studio engine. Trade-off: synthesised instruments, not yet measured on a real phone. |
| Effects with the music (v0.22.0) | Rapid-fire sounds quieter, softened and following Redline's level; jump and swarm down to the others; the music dips under big sounds; a final limiter; in every mode | Adrian: the game sound shouldn't be distracting and should work with the music. Measured: world 1's music is ~8 dB under worlds 3-5, so shots were as loud as the music at the start; jump and swarm were 9-11 dB over it. Random picks untouched, so runs are identical. |
| Redline in the main game (v0.23.0, undone in v0.23.2) | Was Warp Run only with sound on for everyone; then sound off again (v0.23.1) and Warp Run back on the old track (v0.23.2) | Adrian liked it, then found it drained his battery: "performance is priority". It waits in the Lab until it's measured on a real phone. |
| Music sync (v0.18.0) | The music keeps its own beat; the game says which part it wants; changes wait for the next bar line; parts are layers of one 8-bar grid | Adrian asked what happens if he slows down or beats the Warden fast. Nothing can drift: a part just loops longer or the handoff comes sooner, and swaps always land on the beat. Trade-off: up to one bar's delay (2.1-2.5 s) before the music follows a new world. |

---

## What's Not In Scope (for now)

- Player accounts or logins (the leaderboard uses a random ID saved on each device)
- A second button (boost, bomb, etc.). One input is the design. (The Lab's JUMP experiment is a
  second input on purpose: it is there to find out whether it earns a place. It stays in the Lab
  until Adrian decides.)
- Native app store builds

---

## About the Builder

- **Name**: Adrian Zuniga
- **Role**: Senior Product Manager at Fulcrum (www.fulcrumapp.com)
- **GitHub**: https://github.com/AZ-build
- **Technical level**: Non-technical. Needs plain English explanations, step-by-step
  instructions for anything in the command line, and jargon explained when used.
- **Working style**: Prototype-first. Explores visually before committing to a build.
  Appreciates being challenged and getting suggestions, not just "yes and."
- **Deploying**: Adrian wants Claude to always publish updates for him at the end of each change.
  How: in a claude.ai session, attach the repo `AZ-build/speeder` (push access), commit, and push
  to `main`. GitHub Pages republishes https://speeder-game.com/ about a minute later.
  Remember to bump `CACHE` in sw.js so installed phones pick up the update. Claude can't change
  GitHub Pages settings or Firebase rules from its tools; those are one-time jobs for Adrian.

---

## Session Notes

See `CHANGELOG.md` for a full session-by-session history.

**Performance first (v0.23.2, 2026-11-27):** Adrian: Redline in Warp Run "did drain battery";
"performance is priority". Warp Run back on the old track; Redline back in the Lab only, ~56%
cheaper. Found and fixed a drain for everyone: audio ran at volume zero while muted; now muted =
no audio at all. **Before Redline goes back into the main game:** measure on a real phone (battery
over a 10-minute run and frame rate, music on vs off), and consider Sunset Drive (file playback, cheap
on CPU) as the main-game option. **Ask Adrian** whether the drain was with sound on or muted.

**Sound off again (v0.23.1, 2026-11-27):** Adrian: "it should be muted by default, I still need to
refine the music". Off by default and switched off once on every phone (`SOUND_RESET` '3',
`SOUND_RESET_TO` false). Redline stays in Warp Run for anyone with sound on. When the music is
ready: raise `SOUND_RESET` to '4' with `SOUND_RESET_TO = true` and set the default on.

**Redline in Warp Run, sound on (v0.23.0, 2026-11-27):**
- Adrian liked Redline and asked for it in the main game: Warp Run only, and sound on for everyone
  (`SOUND_RESET` '2'). The Lab's MUSIC card is now only for trying Sunset Drive / Studio songs.
- Watch: players turning sound off (no event for it yet), and frame rate on real phones now that the
  synth runs in every Warp Run. Ask Adrian how it feels across a full run.

**Redline and the effects mix (v0.22.0, 2026-11-27):**
- Adrian: the Studio "didn't really work for me... too hard to control on a phone, hard to see the
  whole song and change certain things". He asked Claude to make the music: slow-building, big
  electronic synth, starts low, a beat that builds slowly and speeds up with the levels, not faster
  past top speed but different riffs or sound effects; and the game sound tuned to work with it.
- Built Redline (`audio/redline.js`), now the Lab's default soundtrack (Soundtrack: Redline / Sunset
  Drive). A listening preview (a whole run in 4 minutes) was sent in the chat; render it again with
  `sound-picker/tools/redline/preview.mjs`. Effects retuned in every mode (see CHANGELOG).
- **Ask Adrian:** does it start low enough without being dull? Is the hook catchy? Does the Warden
  feel like the peak? Is 128 BPM the right top? Do the riff changes keep a long run fresh? Are the
  effects right against it now (shots especially), and does the game stay smooth with it on his
  phone (Show frame rate, music on vs off)?
- (v0.23.0: sound is now on for everyone.)
- Ideas not built: laser fences pulsing on Redline's beat (the old "Delores" idea); Redline in Warp
  Run and Classic if it graduates (Classic could use distance for the levels).

**Leaderboard by player (v0.21.0, 2026-11-26):**
- Board opens on the top 50 players; filters on one slim line; list fills the screen. **Ask Adrian:**
  is the Players view what he wanted, and does "Mine" read clearly (it was "This device")?
- Open question: game over still says "#N IN THE WORLD" counting runs, so it can differ from your
  place in the Players view. Option: count players instead (costs reads) or say "#N run".

**The Studio (v0.20.0, 2026-11-26):**
- https://speeder-game.com/studio/. **Hidden since v0.20.1** (Adrian: the Lab is public, so not yet):
  no link in the game; only a device that has opened the Studio hears its songs in the Lab. **Ask Adrian:** does the beat feel right now, is the Studio easy to
  use on his phone, does a Lab run stay smooth with the live synth (frame rate), and are the five
  built-in songs a good start? Feedback setup is done (he published the rules, 2026-11-26).
- Ideas not built: share songs through Firebase so friends can vote on them; sampled drums (CC0)
  for a less synthetic sound; Studio songs in Warp Run/Classic if it graduates.

**Wind sign and feedback (v0.19.0, 2026-11-26):**
- WIND sign added (see CHANGELOG). Ask whether it's easy enough to notice without being distracting
  (size and opacity: `drawWindSign()`, the alpha values at its top).
- Feedback: Adrian did the setup on 2026-11-26 (Google sign-in, authorized domain, rules with his ID).
  Confirm a real note arrives and shows on the stats page.
- Music: Adrian played the Lab's MUSIC and found it **too chill, out of place**; he likes the
  build-up but wants **more beat** and fewer moody (minor) turns. He asked about a **beat
  composer** for himself: knobs, melodies to make or pick from, guardrails to stay in key and on
  rhythm. Built in v0.20.0 as the Studio (above).

**Sound and music (v0.18.0, 2026-11-26):**
- The Heavy effects are in the game. **Sound is still off by default**: ask Adrian whether to turn it
  back on for everyone now (raise `SOUND_RESET` and set the default on), or after he's played a
  few runs with it.
- New Lab experiment **MUSIC** (Sunset Drive I-V). How we got there: free packs were off-target;
  his Spotify "e-Jamz" playlist (melodic deep house, chillwave, Khruangbin) set the direction; of
  three sketches (claude.ai artifact "Speeder music sketches") he loved Sunset Drive, found the
  deep house one alright, disliked the synthwave one. He asked for 5 parts per song mapped to the
  worlds, a slightly faster sister song after each Warden, five songs before repeating, and to
  stay in sync. He also said "tie the beat to the Delores": unclear, probably "the lasers"
  (laser fences pulsing on the beat). **Ask him.**
- **Nobody has heard it in a run yet.** Ask: does each world's step up feel right, is World 1 too
  sparse, is the handoff after the Warden exciting, are the five songs too alike, and the level
  against the effects. The tools to change it are in `sound-picker/tools/music5/`.
- Ideas not built: laser fences (or other hazards) pulsing on the beat; a part of its own for
  hyperlanes; music in Warp Run and Classic once it graduates.

**iPhone name typing (v0.17.3, 2026-11-21):** Adrian couldn't see his name while typing it in
Settings on iOS (the keyboard covered the box). Fixed by fitting the panel above the keyboard
(`keyboardFit()`). Tested with a pretend keyboard in Chrome only: **ask Adrian to confirm on his iPhone.**

**Still reported after v0.17.1 (v0.17.2, 2026-11-20 evening):**
- Friend: still lag, still "traveling faster than the bullets", steering "snapping my ship back to
  center". v0.17.2 adds a run report on the game-over screen (with Show frame rate on). **Ask him for
  a screenshot of it** after a run that felt bad. Read it: version (is he on 0.17.2?), fps vs Hz and
  % slow frames (lag), graphics step-down, rail overloads (the likeliest "snap to center" in Warp Run:
  thrown ~2 units in and kept off both edges for 5 s), winds, finger handoffs, touch cancels.
- Bullets: v0.17.1 only speeds them up above 450 km/h, so at loop 2-3 (455-505 km/h) it barely
  changes anything (x1.01-1.12). At high speed a target is only on screen ~1.8 s (FAR / speed), so
  at a fixed fire rate fewer volleys can hit it. A real fix means scaling fire rate (and bullet speed)
  with speed in Warp Run: more kills, so a board reset question for Adrian. Waiting on his call.

**Lag and self-steering (v0.17.1, 2026-11-20):**
- The Android friend (fold): lag at high speed in later loops, "the ship travels as fast as its
  weapons", and the speeder steering itself since v0.16.6. Fixed: bullets keep pace above 450 km/h,
  even frame pacing, a resting/creeping finger no longer steers (see CHANGELOG). **Ask him** to turn on
  Settings → Show frame rate and report the numbers late in a run (fps, Hz, worst ms, graphics level),
  and whether the self-steering is gone. If he plays Classic, its bend push (`DRIFT`) also moves the
  speeder in turns (by design, unchanged); Warp Run has none.
- If frame rate is still low late in a run: spark particles and bullets are the cost that grows
  (profiled in headless Chrome only). Cheaper bullets/sparks at high counts is the next step.

**Launch prep (v0.17.0, 2026-11-18):**
- From the marketing plan (2026-11-16, "Speeder Launch & Monetization Plan" doc): hold off on
  Reddit until cheating, rude names and the shared Firebase allowance are handled. v0.17.0 did
  everything that needs no Firebase (see CHANGELOG). **Still to do, by Adrian:** `FIREBASE-SETUP.md`
  Part 1 (Speeder's own project; he sends the config) and Part 2 (App Check; he sends the reCAPTCHA
  v3 site key, then enforces after a test run). **Ask first:** fresh boards ("Season 1") or carry the
  current scores over? Carrying over needs a one-off copy (not built: the new rules require `t` and a
  proper entry ID, so it would need a temporary rule or a copy page).
- When he sends the config: set `SPEEDER_FIREBASE` in index.html **and** stats/index.html, publish,
  check a real upload. When he sends the site key: set `APP_CHECK_KEY` in both files.
- `firestore-rules-own-project.txt` was checked by hand only (the Firebase emulator download is
  blocked from Claude's workspace). Firebase checks syntax when he clicks Publish.
- Moderation: stats page → "Check the boards" → Copy ID → a new line in `moderation.txt`. Watch
  `fair/flag/...` on the dashboard: if real players get flagged, a check is too strict.
- Not covered (needs a paid plan or a server): a truly cheat-proof board. Someone determined can
  still pause the game in the browser's debugger. The aim is: casual cheating doesn't work, and
  anything that slips through is quick to hide.

**Stats fixes (v0.16.7, 2026-11-17):**
- Distance buckets now reach 300+ km (Warp) and 200+ km (Classic); older runs sit in a grey
  "34+ km (old)" / "12+ km (old)" bar. Loop analytics go to 20 (`LOOP_CAP`). If runs ever pass
  300 km routinely, add edges to `WARP_KM` in index.html and `WARP_BUCKETS` in stats/index.html.
- Countries: "Played a run" (real players) vs "All visits", plus "Opened it, never played"
  (likely bots). Untested against the real GoatCounter (`include_paths` on /stats/locations):
  if the players view says it couldn't load, that request is the clue.

**Steering complaint (v0.16.6, 2026-11-17):**
- Adrian's Android friend (plays his fold folded): steering inconsistent, lifts his thumb almost
  every move, "moves with my thumb again", can't get past 50K. Fixed a real bug (a stray second
  touch made the steering thumb dead until lifted) and raised the Steering speed slider to 250%.
  His settings were probably reset by the domain move. **Ask whether it's better**, and at what
  Steering speed. If thumb travel is still the problem, ideas offered: a lighter default on narrow
  screens, or a Lab STEERING experiment (fast swipes go further, or joystick-style hold to slide).

**Where things stand (after v0.16.4, 2026-11-16):**
- Stats page now has trends over time in every section (lines, stacked and 100% columns; one
  reusable `timeChart()` in `stats/index.html`). Adrian likes historical trends: new stats should
  get an over-time view too.
- Runs are now counted exactly: each run sends `runs/<mode>/<n>` (its number in the sitting;
  `trackRunNumber()`, `RUN_N_RESET`, `RUN_N_MAX`), and the stats page adds them up.
- Adrian's first try of the stats page got "GoatCounter answered 404 for /stats/hits", then
  "too many requests". v0.16.4 paces requests (GoatCounter: 4 a second, 500 an hour), drops
  `group=day`, keeps partial results, and quotes GoatCounter's error. **Ask whether it loads
  now**; if not, the message on the page is the clue (the 404's cause isn't confirmed).

**Sound rework, ongoing (v0.16.3 and the sound picker, 2026-11-16):**
- Adrian found the sound jarring and asked for it off while we pick new sounds one at a time,
  with tuning and balancing. v0.16.3 switches sound off (new players, and once for everyone).
- **Sound picker**, https://speeder-game.com/sound-picker/ (`sound-picker/`, see its README).
  Three tabs: **Effects** (A today, B today smoothed, C Synthwave, D Retro arcade, E Heavy, each
  with a 12-second RIDE demo on the game's mix), **Music** (A today, B Night Drive, C Darkline,
  D Neon Dream, E Battle Theme) and **Engine** (A today, B turbine, C hover, D podracer, E synth).
  Players PICK, answer questions and choose a track per world; nothing is sent until **Submit**
  (Adrian's rule). Results: "Sound votes" on the stats page. Waiting for Adrian's and players' picks.
- A player suggested **different music per world**; the picker asks which track fits each world.
- Plan after that: Round 2, one sound at a time in the chosen direction (shots, bullet hits,
  enemy pop, explosion, crash, hurt, power-up, shield, then the rest: zap, jump, land, swarm,
  launch, pass, fanfare, ui, engine hum); maybe music; Round 3, a balance mixer (sliders over the
  demo). Then put the set into the game, raise `SOUND_RESET` and turn sound back on by default.
- Measured problems with today's set: shots almost as loud as the music at up to 11 a second;
  power-up and shield far louder than the music; crash and hurt mostly bass a phone can't play;
  bullet hits are a sharp metal clang up to 16 times a second.
- Sources: kenney.nl and opengameart.org are blocked from Claude's workspace. New sets are made
  with `sound-picker/tools/synth.py`. The **uisfx** npm package (CC0 audio, 12 styles x 78 UI and
  game cues, e.g. level-up, bonus, reward) is a reachable library for pickups and menu sounds.

**Earlier (after v0.16.2, 2026-11-16):**
- New private stats page, **https://speeder-game.com/stats/** (`stats/index.html`): players and
  returns, countries and phones, modes and run length, Lab verdicts per variant, Flight School
  funnel, everyone on the world boards, sharing and installs, every event. Needs a GoatCounter API
  key with "Read statistics", pasted once on the device. Tested with sample data only: ask Adrian
  whether it loaded with his real key (if GoatCounter refuses the browser's request, the page says
  it couldn't reach GoatCounter).
- When adding analytics events, add them to the stats page too (each section is a render
  function; unknown events still show under "Every event").
- sw.js now only saves the game page for offline use (before, any page visited replaced it).

**Earlier (after v0.16.0, 2026-11-16):**
- Title logo is now the brand artwork (`icons/logo.webp`). Panels have a pinned Back button.
  Flight School can be started from the pause menu's How to play (two taps: it ends the run).
- Tagline is now **"Left. Right. No brakes."** (Adrian's pick, v0.16.1): title screen, page and
  link-preview text, manifest, and repainted into the share card and link preview artwork.

**Earlier (after v0.15.0, 2026-11-16):**
- **Flight School** added: a hands-on tutorial (screen tour + practice of every mechanic, all five
  worlds, the Warden, loops). Opened from the top of How to play, and offered once to first-time
  players. Built in one go at Adrian's request; tested by an autopilot, **not yet played by a human**.
  Ask: is it too long (about 5-6 minutes)? Is 200 km/h too slow to feel like Speeder? Which steps
  drag? Watch `tut/part/...` and `tut/quit/...` on the dashboard to see where people stop.

**Earlier (after v0.14.0, 2026-11-16):**
- Title screen tidied: slim mode switch, one row of icon buttons (Board, Settings, Help, Share,
  Lab), tips only until a device's first run. New **Share** button invites friends to the game.
- Player counting on the analytics dashboard (https://speeder.goatcounter.com), each event once
  per device: `player/first-run` (played at all), `player/named` (saved a name),
  `player/renamed`, `player/day` (played that day). Plus `share/game` and `share/game/sent`.
  Counts started fresh with the move to speeder-game.com (new address = new storage).

**Earlier (after v0.13.0, 2026-11-16):**
- New artwork (v2 brand pack Adrian had made with ChatGPT; originals in
  `E:\Claude Projects\Speeder\speeder-brand-v2.zip`): new app icons and favicon, the score
  card drawn on artwork (`drawCardOnArt()`, with the old code-drawn card as a fallback), and
  link previews (Open Graph tags pointing at `https://speeder-game.com/social/share-wide.jpg`).
  The brand pack also has `score-card-example` (fake data, labelled EXAMPLE RUN): not used.

**Earlier (after v0.12.9, 2026-11-16):**
- Speeder moved to its own domain, **speeder-game.com** (bought through Squarespace). DNS
  records in Squarespace: four A records and four AAAA records on `@` pointing at GitHub Pages,
  and `www` as a CNAME to `az-build.github.io`. The share link and share picture now use the new
  address. Old links redirect. Trade-off: the browser treats the new address as a different site,
  so each phone starts fresh there (best scores on the device, settings, name, player ID).
  World leaderboard entries are untouched. Friends who installed the old app should reinstall
  from the new address.

**Earlier (after v0.12.8, 2026-11-15):**
- An Android friend reported sideways swipes closing the app. Cause: Android's edge-swipe Back
  gesture (a web page can't switch it off), not a game change. v0.12.8 catches Back during a run
  and pauses instead (`armBackGuard()`, analytics `back/paused`). Watch that event; if it is
  common, consider steering that needs less thumb travel. Ask whether he still has trouble.

**Earlier (after v0.12.6, 2026-11-13):**
- Adrian likes the hyperlane ("cool"). Since v0.12.1: softer streaks blended into the walls
  (v0.12.2-3), slower lanes and solid shaded walls with a dark far end (v0.12.4), a proper
  landing out of the lane and a new outline shield that rolls with the speeder in every mode
  (v0.12.5), bigger wall holes and rings plus 11 s lanes instead of 16 (v0.12.6), and walls that
  clearly look like walls: pink honeycomb force fields with depth in the opening (v0.12.7).

**Earlier (after v0.12.1, 2026-11-13):**
- Adrian's first look at the hyperlane: potential, but the look needed a lot more (bigger
  tunnel, more contrast, maybe zoomed in). v0.12.1 is a full visual pass: lit panelled walls,
  dark hazards with neon edges and target brackets, bright pickups, a bigger tunnel and closer
  camera, a jump-in effect, speed bursts through rings, and (his mid-session ask) Star Wars-style
  light-speed walls: rippling, with streaks of light pouring down them. v0.12.2 made the streaks
  soft and hazy (Adrian: too striking and distracting). Still not played on a phone.

**Earlier the same day (after v0.12.0, 2026-11-13):**
- Adrian asked for the flying idea in the Lab, between worlds rather than after the Warden:
  through the portal into a zero-g hyperspace tunnel at high speed, dodging and grabbing
  power-ups, with the speeder rotating and flipping naturally. v0.12.0 adds it as HYPERLANE,
  with two flying styles to compare and a "Start in a hyperlane" test switch.
- Classic and Warp Run still play exactly as before (`tests/same-as-before.sh`).
- **Not played by a human yet:** lane length (16 s), speed, how much is in a lane, the barrel
  roll swipe speed, and both flying styles are first guesses. Knobs are in `LAB.md`.

**Earlier the same day (after v0.11.0, 2026-11-13):**
- Adrian's first Lab feedback: he likes the Lab; the jump should be higher and longer; next
  experiment should be ramps with rings in the sky; and he wants to test at high speed without
  playing for 20 minutes. v0.11.0 does all four: bigger jump, SKY RAMPS experiment, and a test
  setup card (start on loop 1-6, fully loaded).
- Classic and Warp Run still play exactly as before (`tests/same-as-before.sh`).
- **Not played by a human yet:** the bigger jump, sky ramps (flight size, ring spacing at 500+
  km/h, how often they come) and the loop start. All numbers are first guesses; knobs are in `LAB.md`.

**Earlier the same day (after v0.10.0, 2026-11-13):**
- v0.10.0 added **the Lab** and its first experiment, **JUMP**. Adrian asked for a jump (a
  flick up, maybe), other ideas (different roads and ramps, mega jumps, a space-flight mode in
  a tunnel with up/down movement) and a test mode so none of it is merged into the game.
- Agreed plan and order: 1) Lab shell (done), 2) jump with two gestures to compare (done),
  3) mega ramps and new roads, 4) space tunnel, suggested as a 20-30 s stretch after the
  Warden rather than a separate game. Adrian also liked two additions: forks in the road and
  air rings.
- Classic and Warp Run play exactly as before: a seeded 2-minute Classic run and
  5-minute Warp Run produce identical game states before and after (`tests/same-as-before.sh`).
- **No human has played the Lab or the jump yet.** Hop height and length, the flick and tap
  thresholds, and the charge rate are first guesses. Automated tests cover the rules, not the feel.
- v0.9's playtest is still outstanding too (see below).

**Earlier (after v0.9.0, 2026-11-10):**
- Adrian played v0.8's Warp Run on 2026-11-10 (a million points on his first run): he liked
  it but it didn't feel done. v0.9.0 answers every note he gave: world gates you see through
  and worlds that load in (no wormhole, no hyperspace tube), 40-second worlds in every loop, a
  three-stage Warden, cells that stay on the road, fairer slalom and lasers at top speed, the
  laser pass-through bug, a limit on rail riding, real-looking city buildings plus roadside
  details in every world, and a Warp board reset.
- v0.9.1 (same day) fixed screen fit on Adrian's installed iPhone app: the title screen now
  always fits (version line visible), the HUD no longer slides under the clock (the notch size
  is re-measured, `checkSize` / `measureScreen`), and the game uses the real screen height
  where iOS reports a window short by the status bar (`--app-h`). **The bottom-strip part is
  unverified on a real iPhone**: ask Adrian whether the dark strip along the bottom is gone.
- v0.9.2 (same day): every message that claims a world rank (game over, save message, share
  text, share picture) now names the mode, because there are two world leaderboards.
- v0.9.5 (same day): bend push removed in Warp Run; speed rises a little each world from loop 2 instead of jumping at each loop.
- v0.9.4 (same day): both world leaderboards keep the top 50 runs (`BOARD_N`, was 25).
- v0.9.3 (same day): the push bends give you is capped at 0.5 units/s in Warp Run
  (`W_DRIFT_MAX`; Adrian felt it as the speeder moving without his thumb), and the Warden is
  harder again after early feedback (constant aimed shots, chained lane beams, double mine
  walls, offset laser fences, more health).
- v0.9 was tested by automated drivers and screenshots only. **No human has played it yet**:
  the boss, the 40-second worlds and the rail limit are first guesses.
- The Warp board is reset by version (`W_BOARD_MIN_V = '0.9.0'`). Adrian's two v0.8 test
  entries are hidden for everyone but still in Firestore; deleting them is optional and is a
  job for him in the Firebase console.
- Classic changed in two small ways: the collision fix (lasers can no longer be skipped
  between frames) and the new building look in Neon City. Nothing else.
- Adrian's PC copy of the project (`E:\Claude Projects\Speeder`) is a plain copy, not linked
  to GitHub. It was last refreshed at v0.8.0; refresh it again.
- Warp Run's leaderboard rules have been live since 2026-11-10 and scores do save.

**Earlier (after v0.8.0, 2026-11-09):**
- v0.8.0 added game modes. CLASSIC is v0.7.7 unchanged. WARP RUN (the default) has five
  worlds with their own track colors, obstacle looks and hazards, a boss (the Warden) at the
  end of each loop, loops with a score multiplier, power cells and OVERDRIVE, close-call
  bonuses, and prototype upgrades after each boss.

**Earlier (after v0.7.7, 2026-11-08):**
- v0.7.7: unfolded foldables now steer with the same thumb travel as an iPhone.
- v0.7.6 added a Camera setting (Close = v0.7.1, Normal default, Far, Full track).
- v0.7.5: v0.7.1's smooth camera feel with a slight pull-back so the near rail shows,
  original steering feel (v0.7.4). (v0.7.2's full zoom-out and quicker steering were both too much.) Needs a feel check on real phones.

**Earlier (after v0.7.1, 2026-11-07):**
- v0.7.1 fixed battery drain on a friend's Android foldable: 60fps cap, slower redraws on menus,
  a pixel budget for big screens, reflections only on phone-sized screens. Waiting to hear if it helped.

**Earlier (after v0.7.0, 2026-11-05):**
- v0.7.0 was a visual polish pass: new explosions and wreck, 3D enemies, glossy road, shield
  bubble, pickup and zone animations, readability fixes. Needs a check on a real mid-range phone
  for frame rate.

**Earlier (after v0.6.0, 2026-11-04):**
- v0.6.0 replaced all generated sounds with CC0 recordings and added reactive synthwave music.
  Needs a listen on real phones: overall mix, music level vs effects, and the tempo rise.
- Firebase rules updated to the v0.5 version (looser score check). All setup steps are done.
- Adrian is waiting for feedback from friends before making more changes.

**Next session focus:**
- **Redline** (back in the Lab only since v0.23.2, for battery; sound off by default): Adrian is refining the music. Measure battery and frame rate on a real phone before it goes back into Warp Run. His runs with it;
  tune from what they say (`LIFT`, `OPEN`, `BPM_MAX`, `RIFFS`, `POOL`, the sfx volumes). See
  "Redline and the effects mix" above.
- **The Studio** (v0.20.0): Adrian tried it (2026-11-27) and found it too hard to control on a phone
  (can't see the whole song, hard to change parts). Parked; Claude composes instead (Redline). If he
  wants it back: a phone-first redesign (one section at a time, a whole-song overview strip).
- **Sound and music** (see "Sound and music (v0.18.0)" above): Adrian's first runs with the Heavy
  effects and the Lab's MUSIC; whether to turn sound back on by default; what "the Delores" meant.
  Round 2 (one sound at a time) and Round 3 (a balance mixer) are still open if he wants them.
- Adrian's playtest of the HYPERLANE (switch on "Start in a hyperlane"): does the v0.12.1 look
  work (contrast, zoom, effects)? Barrel rolls or Smooth
  banks? Does up/down steering feel natural? Is 11 s right, and is there too much or too little
  in a lane? Then tune the knobs in `LAB.md`.
- Adrian's playtest of v0.11 in the Lab, ideally starting on loop 3, fully loaded: is the jump
  now the right size, does flick-up misfire while steering, is the second-finger tap
  comfortable, do charges feel like a decision or a nuisance? Sky ramps: is the flight big
  enough, are five rings threadable at that speed, do the ramps come too often or too rarely?
  Then tune the knobs in `LAB.md`.
- Next experiments: new roads, forks in the road. Follow the recipe in `LAB.md`.
- Adrian's playtest of v0.9: do the gates feel good at speed, is the boss now a good fight or
  too much, is 40 s per world right, does the rail limit feel fair, where does a great run end?
- Then tune: `W_WORLD_T`, `BOSS_TOUGH`, `BOSS_PACE`, `RAIL_HOT_T`, each world's `pat` / `sig`
  weights, slalom and laser spacing, crosswind strength.
- Check frame rate on a real mid-range phone (new buildings and roadside props).
- Ideas raised, not built: a different boss per loop, music per world (a player's idea; the sound picker now asks which track fits each world), a near-miss bonus in
  Classic, roadside markers showing your best distance.
- Start from friends' feedback (now including the new sound and music): Share & challenge, the moving obstacles, missiles, gun levels 5-8, the new edge bank and small middle lean (v0.6.2).
- Scoring balance: today kills are roughly 2/3 of a score and distance about 1/5. Adrian said the
  score "should be mostly about distance", but chose to **leave the leaderboard as is for now**.
  Option on the table: a growing per-km distance bonus and smaller kill points, with a board reset.
- Ideas raised, not started: near-miss bonus, daily challenge course, weekly board, rude-name filter, music.
