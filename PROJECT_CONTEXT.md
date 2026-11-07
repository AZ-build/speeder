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

## Status

| Field | Value |
|-------|-------|
| **Current Version** | v0.7.3 |
| **Phase** | Prototype / Exploration (friends playing; waiting on feedback) |
| **Started** | 2026-10-30 |
| **Last Updated** | 2026-11-07 |
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
  volume, music, engine hum, vibration, steering speed, leaderboard name.
- **Curving track (v0.3):** the road bends, runs S-curves and climbs onto sky roads. Bends get
  sharper with distance. Turns push you gently toward the outside; yellow chevrons warn of bends.
  Gameplay still runs on a straight "track space" underneath, so collisions are unaffected.
- **Zones (v0.3):** every 1.4 km the world blends into the next zone: Neon Desert, Neon City,
  Sky Islands, Crystal Wastes, Cosmic Highway (then repeats). Same system, different colors,
  sky objects and roadside props.
- **World leaderboard (v0.5):** top 25 *runs* (one player can hold several spots), plus a
  "This device" tab (10 best local runs). A run uploads if it makes the top 25 or is your best.
  If you're offline, scores wait and upload later.
- **Celebrations and sharing (v0.5):** game over shows NEW WORLD RECORD / #N IN THE WORLD /
  NEW PERSONAL BEST with confetti. "Share & challenge" sends a score picture plus a link with
  `?c=<score>&n=<name>`; opening it sets a challenge shown on the title screen.
- **How to play page (v0.5.2):** from the title screen and pause menu; lists every power-up,
  obstacle and enemy with its limits. Update it whenever a power-up or hazard changes.
- **Ladder (v0.5):** under the score during a run, the next leaderboard score to beat.

---

## Tech Stack & Tools

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Plain HTML + JavaScript + Canvas 2D | One file: `index.html`. No libraries, nothing to install. |
| 3D look | Homemade perspective math ("pseudo-3D") | Out Run-style. Everything is projected from world x/y/distance onto the screen. |
| Sound | Web Audio playing CC0 audio files in `audio/` | Effects from Kenney's free packs, music "Synthwave House Loop" by Fupi. Credits in `audio/CREDITS.md`. Music tempo and brightness follow the run. |
| Offline / install | `manifest.webmanifest` + `sw.js` (service worker) | Bump `CACHE` in sw.js after each change so phones get updates. |
| Backend / DB | Firebase Firestore, **ORBit's project `orbit-23921`**, list `speeder_scores` | Loaded only when needed (Firestore "lite" library). Settings and local scores live in the browser's localStorage. Rules: `firestore-rules-speeder.txt`. |
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
├── firestore-rules-speeder.txt ← the database rules block for the leaderboard
├── PROJECT_CONTEXT.md / CHANGELOG.md / BACKLOG.md / TODO.md
```

### Key tuning knobs (top of the script in index.html)

`CAM_H` / `PLAYER_Z` camera height and distance behind the speeder (now worked out per screen in `fitView()`) ·
`SHIP_AT` where the speeder sits on screen · `SHIP_SCALE` / `SHIP_TILT` speeder size and tilt ·
`SHIP` / `PYLON_MESH` the 3D models (lists of corner points and faces) ·
`DRIFT` how hard turns push you outward · `kMaxAt()` how sharp bends get with distance ·
`planCourse()` the bend and hill generator · `THEMES` zone colors, sky layers, props and hills ·
`ZONE_LEN` zone length · `RAMP_*` / `JUMP_T` / `JUMP_G` ramp size and jump feel · `QUALS` what each graphics level turns on ·
`FAR` draw distance · `FPS_PLAY` / `FPS_IDLE` / `FPS_PAUSED` frame-rate caps · `QUALS[].px` pixel budget · `GLOSS_MAX_AREA` biggest screen that gets reflections · `TRACK_HALF` track half-width · `PATTERNS` which hazards appear and
from what distance · speed curve in `update()` (`32 + 58 * (1 - exp(-d / 4500))`) ·
steering sensitivity in `steerSensitivity()` · `GUN_MAX` / `GUN_PERKS` gun levels ·
`MULT_TIME` 2X duration · `EDGE_START` / `EDGE_BANK` / `EDGE_HALF_W` / `EDGE_YAW` the edge bank and how skinny it gets · `VIEW_TAN` / `VIEW_SHARE` / `FIT_WIDE` / `VIEW_MAX_H` camera angle, how close it is, and big-screen fit (`fitView()`) · `CAM_TRACK` how much the camera copies your sideways move · `STEER_CROSS` thumb travel to cross the track · `STEER_EASE` how quickly the speeder glides to your thumb · `LEAN_MAX` / `LEAN_GAIN` the small lean while moving · `SWARM_N` missiles per MISSILES pickup ·
`MUSIC_VOL` / `MUSIC_RATE_MAX` music level and top tempo · `sfx` (in the Sound section) each effect's file, volume and pitch ·
`PART_MAX` particle cap · `QUALS[].fx` / `QUALS[].gloss` particle amount and glossy road per graphics level · `DRONE_MESH` / `RAM_MESH` / `TURRET_BASE` / `TURRET_HEAD` enemy models · `drawGloss()` road reflections · `drawShield()` shield bubble · `G.slowmo` wreck slow motion ·
`GC_CODE` analytics on/off (GoatCounter site code, now `speeder`; dashboard https://speeder.goatcounter.com) · `TOP_AGE_*` how long a downloaded leaderboard is reused ·
`choosePowers()` how often each gate appears · `BARRIERS` / `BARRIER_GAP` which patterns can't follow each other and the space after them · `BOARD_N` leaderboard size.

### Testing hooks

Local storage keys: `speeder.settings`, `speeder.best`, `speeder.local`, `speeder.pid` (player ID), `speeder.onlineBest`, `speeder.myRuns` (your board entries), `speeder.pendingRuns` (waiting to upload), `speeder.worldTop` (cached top 25 for the ladder), `speeder.worldTopAt` (when it was downloaded), `speeder.challenge`, `speeder.seen` (analytics: not a new player).

`window.SPEEDER` in the browser console exposes game state (e.g. `SPEEDER.G.d = 3000`
jumps ahead in difficulty and zone, `SPEEDER.setQuality(0)` forces Low graphics, `SPEEDER.G.invuln = 999` makes you invincible,
`SPEEDER.applyPower('missile')` gives a power-up, `SPEEDER.die()` ends the run, `SPEEDER.explode(x, y, d, color, big)` sets off a blast,
`SPEEDER.hurt()` takes a hit, `SPEEDER.addEnemy('turret', {...})` places an enemy).

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
| Leaderboard entries | One per run (v0.5), only runs that make the top 25 or are your best | Adrian wants players to own several spots. Same database list, so no breaking change. |
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
| Leaderboard reads (v0.6.3) | Reuse a recent download; only re-download after a run that could make the top 25 | Free Firebase plan is ~50k reads/day, shared with ORBit. |
| Built-in browsers (v0.6.3) | Detect TikTok/Instagram etc. and say "Open in browser" | They can't install the game, and the game is being shared on TikTok. |
| Visual polish (v0.7) | Particles with flashes, shockwaves and debris; 3D enemies; glossy road on High only | Adrian wanted more polish. Heavier effects are tied to the graphics level so older phones skip them. |
| Camera fit (v0.7.3) | Close chase camera, ~1.5x farther back than v0.7.1; moves in lockstep with the speeder, only enough to keep the near rail on screen; wide screens show the whole track (≤85% width) and don't move | v0.7.2 fit the whole track on phones but was too zoomed out: lost the feel of flying. A close camera can't show both rails, so the near rail is what's guaranteed. |
| Steering (v0.7.2) | Set by thumb distance (~230 points crosses the track) | Same feel on every screen; one swipe crosses the track. |
| Frame rate (v0.7.1) | Capped at 60fps; 30 on title/game over, 15 when paused | 120Hz Android phones were drawing twice as often as iPhones and draining battery. |
| Big screens (v0.7.1) | Pixel budget per graphics level; reflections only on phone-sized screens | An unfolded foldable drew ~3x the pixels of an iPhone. Normal phones are unaffected. |
| Music speed-up | Play the loop faster (pitch rises too) as speed climbs, capped at +14% | Simple, no extra files, and the rising pitch adds urgency. Trade-off: a pitch-preserving version would need several pre-made copies of the track. |

---

## What's Not In Scope (for now)

- Player accounts or logins (the leaderboard uses a random ID saved on each device)
- A second button (boost, bomb, etc.). One input is the design.
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

**Where things stand (after v0.7.3, 2026-11-07):**
- v0.7.3: close camera with a slight pull-back, no camera lag, near rail always visible,
  one-swipe steering. (v0.7.2's full zoom-out was too far.) Needs a feel check on real phones.

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
- Start from friends' feedback (now including the new sound and music): Share & challenge, the moving obstacles, missiles, gun levels 5-8, the new edge bank and small middle lean (v0.6.2).
- Scoring balance: today kills are roughly 2/3 of a score and distance about 1/5. Adrian said the
  score "should be mostly about distance", but chose to **leave the leaderboard as is for now**.
  Option on the table: a growing per-km distance bonus and smaller kill points, with a board reset.
- Ideas raised, not started: near-miss bonus, daily challenge course, weekly board, rude-name filter, music.
