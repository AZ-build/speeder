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
| **Current Version** | v0.12.0 |
| **Phase** | Prototype / Exploration (friends playing; Warp Run reworked in v0.9 after Adrian's first playtest, needs another; the Lab added in v0.10; its experiments, JUMP, SKY RAMPS and HYPERLANE, and its test setup are untested on a phone) |
| **Started** | 2026-10-30 |
| **Last Updated** | 2026-11-13 |
| **GitHub Repo** | `AZ-build/speeder`, live at https://az-build.github.io/speeder/ |

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
- **Menus (v0.2):** pause button → Resume / Leaderboard / Settings / Quit run, with a 3-2-1
  countdown on resume. Auto-pauses when you leave the app. Settings (per device): sound,
  volume, music, engine hum, vibration, steering speed, camera distance (v0.7.6: Close / Normal / Far / Full track), graphics, screen shake, leaderboard name.
- **Curving track (v0.3):** the road bends, runs S-curves and climbs onto sky roads. Bends get
  sharper with distance. Turns push you gently toward the outside; yellow chevrons warn of bends.
  Gameplay still runs on a straight "track space" underneath, so collisions are unaffected.
- **Zones (v0.3):** every 1.4 km the world blends into the next zone: Neon Desert, Neon City,
  Sky Islands, Crystal Wastes, Cosmic Highway (then repeats). Same system, different colors,
  sky objects and roadside props.
- **World leaderboard (v0.5):** top 50 *runs* (25 until v0.9.4) (one player can hold several spots), plus a
  "This device" tab (10 best local runs). A run uploads if it makes the top 50 or is your best.
  If you're offline, scores wait and upload later.
- **Celebrations and sharing (v0.5):** game over shows NEW WORLD RECORD / #N IN THE WORLD /
  NEW PERSONAL BEST with confetti. "Share & challenge" sends a score picture plus a link with
  `?c=<score>&n=<name>`; opening it sets a challenge shown on the title screen.
- **How to play page (v0.5.2):** from the title screen and pause menu; lists every power-up,
  obstacle and enemy with its limits. Update it whenever a power-up or hazard changes.
- **Ladder (v0.5):** under the score during a run, the next leaderboard score to beat.

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
- **Own leaderboard:** Firestore list `speeder_warp_scores`; local keys under `speeder.w.`.
  It only shows runs from version `W_BOARD_MIN_V` or newer: raising that number resets the board.
- Timing with a perfect driver: a loop takes about 4 minutes (five 40-second worlds plus the boss).

### The Lab (v0.10), the test mode

Full guide, experiment list, results guide and the recipe for adding one: **`LAB.md`**.

- **What it is:** a third mode for trying ideas before they go into the real game. A Lab run
  plays by Warp Run's rules with the switched-on experiments layered over the top.
- **Getting in:** title screen → **THE LAB** (lime button beside How to play) → switch things
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
  tunnel for about 16 s before the next world. The same drag steers up and down too. Rocks
  (shoot or dodge), lasers, iris walls (fly through the hole), six-ring lines, cell spirals and
  one power-up orb per lane. The road waits while you're in it. Compared: **flying style**,
  Barrel rolls (the speeder rolls its top toward where it's going, flips on dives, a fast swipe
  spins it round) vs Smooth banks (never upside down).
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
| Sound | Web Audio playing CC0 audio files in `audio/` | Effects from Kenney's free packs, music "Synthwave House Loop" by Fupi. Credits in `audio/CREDITS.md`. Music tempo and brightness follow the run. |
| Offline / install | `manifest.webmanifest` + `sw.js` (service worker) | Bump `CACHE` in sw.js after each change so phones get updates. |
| Backend / DB | Firebase Firestore, **ORBit's project `orbit-23921`**, lists `speeder_scores` (Classic) and `speeder_warp_scores` (Warp Run) | Loaded only when needed (Firestore "lite" library). Settings and local scores live in the browser's localStorage. Rules: `firestore-rules-speeder.txt` (Classic) and `firestore-rules-warp.txt` (Warp Run). |
| Hosting | GitHub Pages (planned) | A PWA needs https to install; GitHub Pages provides it for free. |

### Files

```
Speeder/
├── index.html             ← the whole game
├── manifest.webmanifest   ← app name, icons, colors (for "install")
├── sw.js                  ← service worker (offline caching)
├── icons/                 ← app icons (192, 512, maskable 512, Apple 180)
├── audio/                 ← sound effects, engine loop, music + CREDITS.md (all CC0)
├── README.md              ← how to play it locally and publish it
├── firestore-rules-speeder.txt ← the database rules block for the Classic leaderboard
├── firestore-rules-warp.txt ← the database rules block for the Warp Run leaderboard
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
`MUSIC_VOL` / `MUSIC_RATE_MAX` music level and top tempo · `sfx` (in the Sound section) each effect's file, volume and pitch ·
`PART_MAX` particle cap · `QUALS[].fx` / `QUALS[].gloss` particle amount and glossy road per graphics level · `DRONE_MESH` / `RAM_MESH` / `TURRET_BASE` / `TURRET_HEAD` enemy models · `drawGloss()` road reflections · `drawShield()` shield bubble · `G.slowmo` wreck slow motion ·
`GC_CODE` analytics on/off (GoatCounter site code, now `speeder`; dashboard https://speeder.goatcounter.com) · `TOP_AGE_*` how long a downloaded leaderboard is reused ·
`choosePowers()` how often each gate appears · `BARRIERS` / `BARRIER_GAP` which patterns can't follow each other and the space after them · `BOARD_N` leaderboard size.

**Warp Run knobs:** `SETTINGS_DEFAULT.mode` which mode new players start on · `W_WORLD_T` seconds a world lasts · `W_SECTOR` the shortest a world can be · `REZ_T` / `REZ_AT` how long a new world takes to load in and when each part of the sky switches on · `GATE_H` / `GATE_DEP` / `GATE_PW` the world gate's size · `RAIL_HOT_T` / `RAIL_COOL_T` / `RAIL_X` rail riding: seconds before overload, seconds locked, how close to the edge counts · `BOSS_PACE` the boss's rest between attacks per stage · `BOSS_SNIPE` how often it fires single shots under its other attacks · `W_BOARD_MIN_V` oldest version whose scores the Warp board shows · `sp` / `v` / `ml` in `spawnPattern` (how patterns stretch with speed) · `W_SPEED_STEP` / `W_SPEED_MAX` top speed per loop and its cap · `W_LVL_STEP` pattern difficulty per loop · `OD_NEED` / `OD_TIME` cells for OVERDRIVE and how long it lasts · `BOSS_TOUGH` / `BOSS_PTS` / `BOSS_SEQ` boss health, reward and attack order for each of its three stages · `SKINS` each world's colors, obstacle look, `curve` (bendiness), `float` (jump length), `pat` (how often ordinary patterns appear) and `sig` (its own patterns) and `extra` (its own roadside props) · `drawRoadside()` the lamps, lanterns and beacons along each world's road · `drawTower()` / `buildWindowTex()` buildings · `TRAFFIC_CLOSE` how fast you catch traffic · `POWERS` entries starting `p_` are the prototypes · `NEAR_TYPES` what counts for close calls · `TUN_W` / `TUN_H` tunnel size.

**Lab knobs:** `LAB_EXPERIMENTS` the list of experiments (the Lab panel, saved switches, votes and analytics build themselves from it) · JUMP: `HOP_H` / `HOP_T` how high and how long a jump is · `HOP_MAX` charges you can hold · `HOP_PER_CLOSE` charge earned per close call · `HOP_OVER` which obstacles a hop clears · `FLICK_PX` / `FLICK_MS` / `FLICK_RATIO` what counts as a flick up · `TAP_MS` / `TAP_PX` what counts as a one-finger tap · SKY RAMPS: `SKY_W` / `SKY_LEN` / `SKY_H` the ramp's size · `SKY_PEAK` / `SKY_T` how high and how long the flight is · `SKY_RINGS` / `RING_R` how many rings and how big · `RING_PTS` / `RING_PERFECT` points · `SKY_EVERY` seconds between sky ramps · HYPERLANE: `LANE_T` seconds in a lane · `LANE_R` / `LANE_LIM` tunnel size and how far you can go · `LANE_SPEEDUP` / `LANE_MIN_V` speed · `LANE_CAM_Z` / `LANE_FOLLOW` camera · `LANE_BEND` how much it snakes · `LANE_GAP` space between sections · `ROLL_V` / `LANE_ROLL_RATE` / `LANE_BANK` how the speeder rolls · `SPIN_V` / `SPIN_T` barrel roll swipe and length · `LROCK_HP` / `LRING_PTS` / `LRING_PERFECT` / `LIRIS_HOLE` hazards and points · `LANE_SECTIONS` what's in a lane · test setup: `LAB_LOOPS` the highest starting loop offered.

### Testing hooks

Automated checks live in `tests/`: `bash tests/same-as-before.sh` (Classic and Warp Run play exactly as in the last commit), `node tests/lab.mjs "$PWD"` (the Lab), `node tests/lane.mjs "$PWD"` (the hyperlane), `node tests/soak.mjs "$PWD"` (a bot plays long Lab runs). Run all four before publishing.

Lab hooks: `SPEEDER.setMode('lab'); SPEEDER.startGame()` (start a Lab run), `SPEEDER.LAB` (`on`, `cfg` = the saved switches, `run` = this run's experiments), `SPEEDER.labSet('jump', 'gesture', 'tap')` / `SPEEDER.labSet('jump', 'fuel', 'free')` / `SPEEDER.labSet('jump', 'on', false)`, `SPEEDER.tryHop('key')`, `SPEEDER.hopCharge(1)`, `SPEEDER.JUMP` (`n` charges, `hops`, `denied`, `by`), `SPEEDER.openPanel('lab')`, `SPEEDER.labSet('ramps', 'on', true)`, `SPEEDER.spawnSkyRamp(SPEEDER.G.d + 90)` (put a sky ramp just ahead), `SPEEDER.SKY` (`offered`, `flights`, `rings`, `perfect`), `SPEEDER.labSet('setup', 'loop', 3)` / `SPEEDER.labSet('setup', 'loaded', true)` (test setup for the next Lab run), `SPEEDER.labSet('lane', 'feel', 'bank')`, `SPEEDER.labSet('setup', 'lane', true)` (next Lab run starts in a hyperlane), `SPEEDER.startLane('resume')` (into a lane now), `SPEEDER.LANE` (`on`, `x`/`y` and `tx`/`ty` the speeder and its target, `roll`, `objs`, `runs`, `rings`, `hits`, `rolls`), `SPEEDER.LANE.exit.d = SPEEDER.LANE.d + 30` (to the exit). Lab storage keys: `speeder.lab.cfg` (switches), `speeder.lab.setup` (starting loop, fully loaded, start in a hyperlane), `speeder.lab.best`, `speeder.lab.votes`.

Warp Run keeps the same per-mode keys under `speeder.w.` (`speeder.w.best`, `speeder.w.local`, `speeder.w.worldTop`, ...), plus `speeder.w.live` (set once its world board has loaded), `speeder.w.boardV` (the board reset this device has applied) and `speeder.w.hidden` (scores of older-version entries, left out of your rank). `speeder.pendingRuns` is shared; each run carries its mode.

Local storage keys: `speeder.settings`, `speeder.best`, `speeder.local`, `speeder.pid` (player ID), `speeder.onlineBest`, `speeder.myRuns` (your board entries), `speeder.pendingRuns` (waiting to upload), `speeder.worldTop` (cached top 50 for the ladder), `speeder.worldTopAt` (when it was downloaded), `speeder.challenge`, `speeder.seen` (analytics: not a new player).

`window.SPEEDER` in the browser console exposes game state (e.g. `SPEEDER.G.d = 3000`
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
| Leaderboard reads (v0.6.3) | Reuse a recent download; only re-download after a run that could make the board | Free Firebase plan is ~50k reads/day, shared with ORBit. |
| Built-in browsers (v0.6.3) | Detect TikTok/Instagram etc. and say "Open in browser" | They can't install the game, and the game is being shared on TikTok. |
| Visual polish (v0.7) | Particles with flashes, shockwaves and debris; 3D enemies; glossy road on High only | Adrian wanted more polish. Heavier effects are tied to the graphics level so older phones skip them. |
| Camera fit (v0.7.5) | Close chase camera, ~1.5x farther back than v0.7.1; eases after the speeder (85% follow, slight lag) and looks into turns, as in v0.7.1; wide screens show the whole track (≤85% width) and don't move | v0.7.2 fit the whole track on phones but was too zoomed out: lost the feel of flying. A close camera can't show both rails. v0.7.3's lag-free lockstep camera felt stiff, so the v0.7.1 smoothing is back. |
| Camera setting (v0.7.6) | Players pick Close / Normal / Far / Full track; Normal is the default | People disagree on close-and-thrilling vs seeing the whole track; a setting lets each player choose. |
| Steering (v0.7.7) | Crossing the track takes a drag of nearly the full screen width on a phone; capped at 400 points (`STEER_MAX_W`) so foldables/tablets need the same thumb travel as an iPhone | Tried thumb-distance steering in v0.7.2 (~230 points to cross); Adrian found it too touchy. The old 520-point cap made unfolded folds need ~3.1 in of thumb travel. |
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
| Music speed-up | Play the loop faster (pitch rises too) as speed climbs, capped at +14% | Simple, no extra files, and the rising pitch adds urgency. Trade-off: a pitch-preserving version would need several pre-made copies of the track. |

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
  to `main`. GitHub Pages republishes https://az-build.github.io/speeder/ about a minute later.
  Remember to bump `CACHE` in sw.js so installed phones pick up the update. Claude can't change
  GitHub Pages settings or Firebase rules from its tools; those are one-time jobs for Adrian.

---

## Session Notes

See `CHANGELOG.md` for a full session-by-session history.

**Where things stand (after v0.12.0, 2026-11-13):**
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
- Adrian's playtest of the HYPERLANE (switch on "Start in a hyperlane"): Barrel rolls or Smooth
  banks? Does up/down steering feel natural? Is 16 s right, and is there too much or too little
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
- Ideas raised, not built: a different boss per loop, music per world, a near-miss bonus in
  Classic, roadside markers showing your best distance.
- Start from friends' feedback (now including the new sound and music): Share & challenge, the moving obstacles, missiles, gun levels 5-8, the new edge bank and small middle lean (v0.6.2).
- Scoring balance: today kills are roughly 2/3 of a score and distance about 1/5. Adrian said the
  score "should be mostly about distance", but chose to **leave the leaderboard as is for now**.
  Option on the table: a growing per-km distance bonus and smaller kill points, with a board reset.
- Ideas raised, not started: near-miss bonus, daily challenge course, weekly board, rude-name filter, music.
