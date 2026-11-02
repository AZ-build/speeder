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
| **Current Version** | v0.4.0 |
| **Phase** | Prototype / Exploration (playable, curving track, 5 zones, world leaderboard) |
| **Started** | 2026-10-30 |
| **Last Updated** | 2026-11-01 |
| **GitHub Repo** | `AZ-build/speeder` (Adrian creating the empty repo; target URL https://az-build.github.io/speeder/) |

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
- **Hull:** 3 hits and you're wrecked. A hit makes you invulnerable for a moment and slows you down briefly.
- **Speed:** starts at about 160 km/h and climbs toward about 450 km/h the farther you go.
- **Obstacles:** pylons (tall, can't be destroyed), walls with a gap, slalom half-walls,
  and mines (orange, 2 shots to destroy).
- **Enemies:** drones (hover ahead and shoot; some swoop in from behind), turrets (fixed on
  the ground, they shoot as you approach), and ram bikes (head straight at you and steer toward you).
- **Power-up gates:** always come in **pairs**, and you pick one by driving through it. A
  banner at the top shows both choices early (◀ left | right ▶). Sometimes mines guard one gate.
  - SHIELD (absorbs 1 hit, stacks to 2) · GUNS+ (permanent for the run, up to level 4) ·
    RAPID (12s) · REPAIR (+1 hull) · NOVA (clears enemies and mines) · 2X SCORE (15s)
- **Score:** distance + kills, doubled during 2X. Best score is saved on the device.
- **Menus (v0.2):** pause button → Resume / Leaderboard / Settings / Quit run, with a 3-2-1
  countdown on resume. Auto-pauses when you leave the app. Settings (per device): sound,
  volume, engine hum, vibration, steering speed, leaderboard name.
- **Curving track (v0.3):** the road bends, runs S-curves and climbs onto sky roads. Bends get
  sharper with distance. Turns push you gently toward the outside; yellow chevrons warn of bends.
  Gameplay still runs on a straight "track space" underneath, so collisions are unaffected.
- **Zones (v0.3):** every 1.4 km the world blends into the next zone: Neon Desert, Neon City,
  Sky Islands, Crystal Wastes, Cosmic Highway (then repeats). Same system, different colors,
  sky objects and roadside props.
- **World leaderboard (v0.2):** one entry per player (their best), top 25, plus a "This device"
  tab (10 best local runs). You enter a name after your first run, and new personal bests
  upload by themselves. If you're offline, scores wait and upload later.

---

## Tech Stack & Tools

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Plain HTML + JavaScript + Canvas 2D | One file: `index.html`. No libraries, nothing to install. |
| 3D look | Homemade perspective math ("pseudo-3D") | Out Run-style. Everything is projected from world x/y/distance onto the screen. |
| Sound | Web Audio, generated in code | No audio files. Mute button saved per device. |
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
├── README.md              ← how to play it locally and publish it
├── firestore-rules-speeder.txt ← the database rules block for the leaderboard
├── PROJECT_CONTEXT.md / CHANGELOG.md / BACKLOG.md / TODO.md
```

### Key tuning knobs (top of the script in index.html)

`CAM_H` camera height · `PLAYER_Z` how far ahead of the camera the speeder sits ·
`SHIP_AT` where the speeder sits on screen · `SHIP_SCALE` / `SHIP_TILT` speeder size and tilt ·
`SHIP` / `PYLON_MESH` the 3D models (lists of corner points and faces) ·
`DRIFT` how hard turns push you outward · `kMaxAt()` how sharp bends get with distance ·
`planCourse()` the bend and hill generator · `THEMES` zone colors, sky layers, props and hills ·
`ZONE_LEN` zone length · `RAMP_*` / `JUMP_T` / `JUMP_G` ramp size and jump feel · `QUALS` what each graphics level turns on ·
`FAR` draw distance · `TRACK_HALF` track half-width · `PATTERNS` which hazards appear and
from what distance · speed curve in `update()` (`32 + 58 * (1 - exp(-d / 4500))`) ·
steering sensitivity in `steerSensitivity()`.

### Testing hooks

Local storage keys: `speeder.settings`, `speeder.best`, `speeder.local`, `speeder.pid` (player ID), `speeder.onlineBest`, `speeder.pending`.

`window.SPEEDER` in the browser console exposes game state (e.g. `SPEEDER.G.d = 3000`
jumps ahead in difficulty and zone, `SPEEDER.setQuality(0)` forces Low graphics, `SPEEDER.G.invuln = 999` makes you invincible).

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
| Leaderboard entries | One per player, can only go up | Shows each person once and keeps the database small. |
| Game over restart | "Ride again" button, not tap-anywhere | Stops accidental restarts while typing a name. |
| Camera | Height 2.6, speeder ~60% down the screen (v0.4) | Kids' thumbs covered the speeder at 77%. Higher + closer keeps it visible and feels more like driving. Trade-off: road ahead is a little more squeezed. |
| Speeder and pylons | Small homemade 3D models (flat-shaded faces) | Lets the speeder really roll and turn, without adding a 3D library. |
| Scenery vs road | Scenery drawn with the nearer road cut out | Stops buildings appearing on top of raised roads. |
| Curves | Bend the drawing, not the gameplay | Everything is drawn through one per-frame bend table, so rails, hazards, gates and bullets can't misalign, and collisions didn't change. |
| Hills | Track only lifts above the ground; never hides behind a crest | Keeps hazards visible at all times. |
| Scenery | Recycled pool, drawn under gameplay, kept off the track | Rich world without hurting readability or frame rate. |
| Zones | One shared system, 5 color/prop mixes that blend | Variety without five separate environments to maintain. |
| Graphics quality | Auto steps down if the frame rate drops | Keeps older phones smooth without asking players to tune anything. |

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
- **Deploying**: Adrian wants Claude to always publish updates to GitHub Pages for him at the
  end of each change (repo `AZ-build/speeder`, https://az-build.github.io/speeder/).

---

## Session Notes

See `CHANGELOG.md` for a full session-by-session history.

**Next session focus (after v0.4.0):**
- Playtest with the kids: does the thumb still cover the speeder? Is it too big? Are hazards
  still readable at top speed with the higher camera?
- Possible next art pass: ramps, zone-specific hazards, speeder color skins.
