# Changelog — Speeder

All notable changes are documented here, session by session. Newest entries go at the top.

---

## [v0.2] — 2026-10-30

### Session 2 — Menu, settings, pause, world leaderboard

**What we did:**
- **Pause:** pause button (top right) opens a menu with Resume, Leaderboard, Settings and Quit run.
  Resuming plays a 3-2-1 countdown. The game also pauses itself when you leave the app.
  Esc or P pauses on a computer.
- **Settings** (saved on the device): sound on/off, volume, engine hum, vibration, steering
  speed (50–160%), leaderboard name.
- **World leaderboard:** one entry per player, top 25, with tabs for "World" and "This device"
  (your 10 best runs). Your own row is highlighted.
  - First time you finish a run, you type a name. After that, any new personal best uploads by itself.
  - Shows your world rank after saving ("You're #2 in the world!").
  - If you're offline, the score is kept and uploads next time.
  - Stored in Firebase project `orbit-23921` (ORBit's), in a separate list called `speeder_scores`.
  - Names are cleaned (A–Z, 0–9, space, `- _ .`, max 12) and shown as plain text, so nobody can inject code.
- Title and game over screens now have Leaderboard and Settings buttons. Game over uses a
  **Ride again** button instead of tap-anywhere, so you don't restart by accident while typing.
- Version stamp on the title screen (v0.2.0).
- Service worker: version bumped to v0.2.0. Leaderboard traffic always goes to the network
  and is never cached.
- Tested at phone size with a fake leaderboard: pause/resume, settings, name entry,
  auto-upload, ranks, and auto-pause when the app is hidden all work. No errors.

**Decisions made:**
- Global leaderboard (Adrian's call), reusing ORBit's Firebase project so there's no new account to set up.
- One entry per player (their best) instead of one per run, so the board shows each person once.
- Database rules limit what a score can look like. They can't fully stop a determined cheater,
  because any browser game can be tampered with.

**Next session focus:**
- Adrian creates the empty GitHub repo + adds the Firebase rules, then Claude publishes it.
- Playtest on phone, tune feel.

---

## [v0.1] — 2026-10-30

### Session 1 — Concept + first playable prototype

**What we did:**
- Defined the concept: endless neon hover-racer, low camera with the horizon near the top,
  one input (steer), auto-fire, power-up checkpoints, enemies, obstacles.
- Built the first playable version in `index.html` (canvas, no libraries):
  - Synthwave world: striped sun, wireframe mountains, scrolling grid, rails, speed lines
  - Relative finger-drag steering with banking; keyboard fallback for desktop
  - Auto-fire with 4 gun levels
  - Obstacles: pylons, gapped walls, slalom half-walls, mines (destructible)
  - Enemies: drones (some swoop in from behind), turrets, ram bikes, all with aimed shots you can dodge
  - Paired power-up gates (Shield, Guns+, Rapid, Repair, Nova, 2X Score), with a top banner
    previewing the choice
  - Hull/shield system, hit flash, screen shake, vibration (Android), low-hull warning
  - Score, distance, kills, local best score, title / game over / pause screens
  - Generated sound effects + engine hum, mute button
- Added PWA install support: manifest, service worker (offline), app icons, iOS install hint.
- Tested at phone size (390×844) and in landscape: 60fps in the test browser, no errors. An
  autopilot test bot survived 60 seconds at full hull, so the opening is gentle.
- Created project files: PROJECT_CONTEXT.md, CHANGELOG.md, BACKLOG.md, TODO.md, README.md.

**Decisions made:**
- Relative drag (not absolute) so your thumb never covers the speeder.
- Power-ups come as **paired gates**, so steering is also how you choose.
- Pseudo-3D canvas instead of a 3D library: lighter on phones, suits the retro look.
- Camera height 4.0 and the speeder placed low on the screen so the view is wide enough in portrait.

**Next session focus:**
- Adrian plays it on his phone and reports how it feels: steering sensitivity, speed, difficulty.
- Publish to GitHub Pages so it can be installed.

---

<!--
HOW TO ADD A NEW ENTRY:

Copy this block and paste it above the previous entry:

## [vX.X] — [Date]

### Session N — [Short title describing the session]

**What we did:**
-

**Decisions made:**
-

**Next session focus:**
-

-->
