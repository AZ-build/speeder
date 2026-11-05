# Changelog — Speeder

All notable changes are documented here, session by session. Newest entries go at the top.

---

## [v0.6.3] — 2026-11-05

### Session 7 — Getting ready for more players (TikTok sharing)

The game is spreading (Diego is sharing it on TikTok). Adrian asked about analytics, scaling,
a domain, and install instructions.

**What we did:**
- **Leaderboard uses far fewer database reads.** The free Firebase plan allows about 50,000
  reads a day, shared with ORBit, and each top-25 download costs 25. The game now reuses a
  recent copy: 3 min when opening the game, 1 min on the leaderboard screen, and after a run
  it only downloads again if the score could make the top 25. Knobs: `TOP_AGE_START`,
  `TOP_AGE_BOARD`, `TOP_AGE_RUN`. New storage key `speeder.worldTopAt`.
- **Analytics (GoatCounter), ready but off until `GC_CODE` is set.** No cookies, no personal
  data. Events: `open/<app|browser|tiktok|instagram…>`, `new-device`, `run/<km bucket>`,
  `board/top25`, `share`, `challenge-link`, `install/*`, `board-download` (each one = 25 reads,
  so this tracks database use). New storage key `speeder.seen`.
- **Install help.** Title screen shows a one-line tip matched to iPhone or Android, with a
  "How?" link to a new "Put it on your Home Screen" section on the How to play page (updated
  for the newer iPhone Safari, where Share sits inside the ••• menu).
- **Built-in browsers detected** (TikTok, Instagram, Facebook, Snapchat, X, and others). They
  can't install apps, so the title screen says so, explains "Open in Safari/browser", and
  offers a Copy link button.
- Version v0.6.3; service worker cache bumped.

**Still to do:** switch on analytics once Adrian has a GoatCounter code; choose a domain and
add score carry-over *before* switching (players' saved data is tied to the web address).

---

## [v0.6.2] — 2026-11-04

### Session 6c — Smoothing back, small lean in the middle

Adrian: the locked steering in v0.6.1 didn't feel right. He wanted the old smoothing back, with
the edge bank kept, plus a small lean when moving across the middle so it feels natural.

**What we did:**
- **Smoothing restored.** The speeder glides quickly to your thumb again (as in v0.6.0), and the
  camera follows at its old pace. Knobs: `STEER_EASE`, `CAM_FOLLOW`.
- **Small lean in the middle.** Moving across the track leans the speeder into the move, up to
  about 20° on a quick flick (the v0.5.1 lean went to 65°), then it settles level.
  Knobs: `LEAN_MAX`, `LEAN_GAIN`.
- **Edge bank and skinny footprint kept** from v0.6.1. The two leans add together.
- Version v0.6.2; service worker cache bumped.

---

## [v0.6.1] — 2026-11-04

### Session 6b — Locked steering and an edge bank

Adrian: the lean from v0.5.1 wasn't what he meant. The speeder seemed to drift a little after
he stopped his thumb, which will cost precision at high speed. What he wanted: near the side
rails the speeder banks up on its side, top facing the middle (like it's carving back in), and
gets skinnier so the gaps by the edges are easier to hit.

**What we did:**
- **Locked steering.** The speeder now sits exactly where your thumb puts it, with no glide
  afterwards (before, it eased toward your thumb over about a fifth of a second). Turns still
  push you outward as before.
- **Tighter camera.** The camera follows sideways about twice as tightly, so the speeder no longer
  slides on screen after you stop. Knob: `CAM_FOLLOW`.
- **Edge bank replaces the turn lean.** In the middle the speeder rides level. From about halfway
  out it starts to roll, reaching about 70° at the rail, top facing the middle and nose turned
  slightly back in. It depends only on where you are, so it never lags.
- **Skinnier when banked.** The hit area shrinks to half its normal width at the rail (walls,
  mines, enemies and enemy shots). Knobs: `EDGE_START`, `EDGE_BANK`, `EDGE_HALF_W`, `EDGE_YAW`.
- How to play page: the Steer entry explains the edge bank.
- Version v0.6.1; service worker cache bumped.

**Watch for:** a smaller hit area at the rails might make riding the edge the safest place to
be. If friends start hugging the rails, raise `EDGE_HALF_W` or spawn more edge hazards.

---

## [v0.6.0] — 2026-11-04

### Session 6 — Real sounds and music

Adrian: the generated beeps felt cheap. Swapped them for free, professionally made sounds.

- **All sound effects are now real recordings** from Kenney's free packs (Sci-Fi Sounds, Digital
  Audio, Music Jingles), all CC0 (public domain). Lasers pick from 3 variations with a little pitch
  wobble so rapid fire doesn't sound like a machine gun of the same clip. Sources: `audio/CREDITS.md`.
- **Engine hum** is a looping sci-fi engine recording that pitches up with speed (was a buzzing sawtooth).
- **Background music:** "Synthwave House Loop" by Fupi (CC0, 114 BPM). It reacts to the run:
  - Title screen: soft and muffled, like it's in the next room.
  - Start of a run: chill and a bit muffled; it opens up to full brightness by about 2.5 km.
  - Tempo climbs with the speed curve, from 114 to about 130 BPM at top speed (knob: `MUSIC_RATE_MAX`).
  - Pause: muffled and quieter. Crash: "tape stop" slow-down, then it drifts back in on the game-over screen.
- New **Music** on/off switch in Settings (the Sound switch and volume still control everything).
- Sounds load in the background after the first tap and are cached for offline play (~1.2 MB).
- Version v0.6.0; service worker cache bumped.

---

## [v0.5.3] — 2026-11-04

### Session 5d — No back-to-back barriers

Feedback from players: a laser fence right after a wall felt impossible.

- Barriers (walls, slalom, laser fences, jump barriers) can no longer come one right after the
  other; something else always comes in between. Knob: `BARRIERS` in the script.
- After any barrier there's now at least 48 world units (about half a second at top speed) before
  the next thing. Knob: `BARRIER_GAP`.
- Checked over 9,000 random spawns at three difficulty levels: zero back-to-back barriers.
- Version v0.5.3; service worker cache bumped.

---

## [v0.5.2] — 2026-11-04

### Session 5c — How to play page

- **How to play** page, opened from the title screen (button under Leaderboard/Settings) and
  from the pause menu. Sections: Riding, Power-ups, Obstacles, Enemies, Score. Each entry has a
  picture (power-ups use the same badges as the gates), what it does, and its limits in yellow
  (shield max 2, guns max 8, 2X doesn't stack, hits needed and points for each enemy, and so on).
- Version v0.5.2; service worker cache bumped.

---

## [v0.5.1] — 2026-11-04

### Session 5b — No more stacking 2X, the speeder leans into turns

**What we did:**
- **2X no longer stacks.** Taking 2X while it's running just resets its 15s timer ("timer
  reset"). Adrian: stacking would let scores run away; the score should be mostly about distance.
  The 2X gate shows up a bit less while 2X is already running.
- **Banking.** The speeder now rolls up to about 65° on a quick flick (it goes skinny), leans a
  little on a gentle steer, and settles back level a moment later. Its shadow narrows and the
  engine light trails stay attached as it rolls. Knobs: `BANK_MAX`, `BANK_GAIN`.
- Version v0.5.1; service worker cache bumped.

**Open question:** most of a score today comes from kills, not distance (see Session notes).

---

## [v0.5.0] — 2026-11-04

### Session 5 — Sharing, a real top-runs board, missiles, moving obstacles

Feedback from Adrian and friends (who are loving it): make a big deal of great scores and let
people share them, let one player hold several board spots, NOVA is confusing, too many walls,
guns should go further, 2X should stack, maxed powers shouldn't show up, and helper text
sometimes covers the track.

**What we did:**
- **Leaderboard is now top runs, not top players.** Every good run is its own entry, so one
  person can hold several spots. A run is uploaded if it makes the top 25 or is your best.
  Entry IDs start with your device ID, so all your spots are highlighted. Old entries stay.
  No database change was needed for this (the existing rule already allowed new entries).
- **Big celebrations.** The game-over screen shows NEW WORLD RECORD / #N IN THE WORLD /
  NEW PERSONAL BEST with confetti, a fanfare and a buzz. Gold for the top 3.
- **Share & challenge button.** Makes a 1080×1350 score picture (synthwave sun, your score, your
  world rank) and shares it with a link. The link carries your score, so a friend who opens it
  sees "ADRIAN challenged you: beat 45,210" on the title screen and gets told when they beat it.
  Falls back to copying the text if the phone can't share.
- **Live leaderboard ladder.** Under your score during a run: the next score to beat
  ("▲ #6 TIM 17,378"). Passing someone flashes "PASSED TIM" with a chime. Passing your best,
  the world #1, or a friend's challenge gets a big toast.
- **NOVA replaced by MISSILES.** 8 homing missiles fan out and hunt down enemies (first) and
  mines ahead, with smoke trails. The launch still knocks out incoming enemy fire.
- **Guns go to level 8.** Levels 1–4 as before; 5 piercing bullets, 6 wing missiles (a homing
  missile every 1.6s), 7 heavy rounds (double damage, pink bolts), 8 max power (wing missiles
  twice as often, faster bullets). HUD shows 4 yellow + 4 orange bars.
- **2X stacks.** Taking 2X while it's running doubles it: 4X, then 8X (max). The clock resets to
  15s each time. The gate says what you'd get (4X SCORE), and the HUD badge grows.
- **Maxed powers stop showing up.** GUNS+ at level 8 and SHIELD at 2 are no longer offered.
- **Fewer walls, new moving obstacles.** Walls and slalom show up about half as often. New:
  sliding pylons (with a glowing groove showing their path), swaying "snake" lines of mines,
  and red laser fences whose gap slides side to side (bullets pass through lasers).
- **Helper text moved off the road.** Gate choices, "HIT THE RAMP", power-up toasts and the zone
  name now sit below the speeder (road you've already passed). The gate chip on the side you're
  lined up with stays bright and the other dims.
- Database rules updated in `firestore-rules-speeder.txt` (looser score check for 8X runs).
  Scores the database turns down no longer block the upload queue.
- Version v0.5.0; service worker cache bumped.
- Tested in a headless phone browser (390×844, 360×640, landscape) with a fake leaderboard
  seeded with the real scores: celebrations, ranks, uploads, offline queue, share picture, all
  new obstacles and power-ups. No errors.

**Decisions made:**
- Keep the same database list (`speeder_scores`) with one entry per run, instead of a new list,
  so nothing breaks before Adrian updates the rules.
- Upload only runs that make the top 25 or beat your own best, to keep the database small.
- Laser fences have a slightly wider gap than walls, since the gap moves.

**Next session focus:**
- Watch friends use Share & challenge. Does the link get them playing?
- Is 8X too strong? Do the moving obstacles feel fair at top speed?

---

## [v0.4.0] — 2026-11-01

### Session 4 — New look for the speeder and the track, camera moved up

Feedback from players (kids): their thumb ends up covering the speeder, the starting pylons are
bland, and roadside buildings sometimes show up on top of the road like a glitch.

**What we did:**
- **Camera moved up and closer.** The speeder now sits about 60% of the way down the screen
  (was about 77%) and is a bit bigger, with a lower "in the seat" camera (`CAM_H` 4.0 → 2.6).
  The bottom ~40% of the screen is free road for your thumb. The horizon moved up slightly to make
  room. Tuning knob: `SHIP_AT` at the top of the script.
- **New speeder: a real 3D model.** An arrowhead hull with a glass canopy, a pink racing stripe,
  two engine pods on short wings and twin tail fins. It's a set of flat-shaded 3D faces, so it
  actually rolls when you steer, noses into the turn and tips up on jumps. Flames now come out of
  each engine in proper perspective, the hover pads glow on the road, and the fin tips blink.
  Shield bubble redrawn (double ring when you have 2 shields). Knobs: `SHIP_SCALE`, `SHIP_TILT`.
- **New pylons.** Six-sided towers that taper up from a wide base with a yellow trim, with a
  collar and a spike on top, a blinking beacon, glowing rings that slide up them, and a pulsing
  warning ring on the road around the base. Each one slowly turns. Far away they draw as a simple
  spike to save work.
- **Barriers point the way.** Wall faces now have neon chevrons that slide toward the gap, so
  you can tell at a glance which way to dodge. Full-width jump barriers have rising lime arrows.
  Glowing top rail with running lights.
- **Mines** are now spiked, spinning orbs with a beating core (it beats faster once you've hit it once).
- **Power-up gates** get lights chasing round the frame and a floating badge with a picture of the
  power (shield, triple arrows, lightning, plus, starburst, 2X), so non-readers can choose too.
- **Enemies:** drones have spinning wingtip rotors; ram bikes have spikes, twin headlights and
  light beams on the road in front of them; turret barrels swing to follow you.
- **Fixed: scenery painted over the road.** On hills and sky roads the track rises above the ground,
  and far-off buildings could be drawn on top of the nearer road. Scenery is now drawn with the
  road in front of it cut out, so the road always stays on top.
- Hazards you've already passed fade out quickly, so they don't clutter the space under the speeder
  now that more of the road behind you is on screen.
- Title screen: "Touch to ride" and the buttons moved to the bottom so they don't sit on the speeder.
- Version v0.4.0; service worker cache bumped.
- Tested at 390×844, 360×640 and landscape: no errors through all five zones on High and Low
  graphics; drawing cost about the same as v0.3.1.

**Decisions made:**
- Small homemade 3D models for the speeder and pylons instead of a 3D library (keeps the
  "no libraries" rule and stays light).
- Trade-off accepted: with the speeder higher, the road ahead takes up a bit less of the screen,
  so hazards are slightly more squeezed toward the horizon. Watch for this in playtests.

**Next session focus:**
- Watch the kids play: does the thumb still cover the speeder? Is the speeder too big?
- Check whether hazards still feel readable at top speed with the new camera.

---

## [v0.3.1] — 2026-10-30

### Session 3b — Straight bullets and jump ramps

**What we did:**
- **Bullets fly straight.** They used to follow the road around bends. Now they leave the nose
  in a straight line; in a bend the road turns away underneath them, so they drift toward the
  outside and sail off over the rail. Shooting in bends now means aiming a little into the turn.
- **Jump ramps.** Lime-green ramps with moving chevrons appear on the track (from about 150 m).
  Drive onto one and you launch for about a second; you can still steer in the air, and anything
  low that you fly over can't hit you.
  - Early on, ramps lead into a mine cluster: jump it for an **AIR** bonus (+150 per thing you
    clear) or just steer around.
  - From about 1.2 km, some ramps lead to a **barrier across the whole track** (marked with
    lime up-arrows). The only way past is to take the ramp. A "▲ HIT THE RAMP" banner warns you.
  - The barrier is placed so you still clear it even if you're slowed down from a hit.
  - Pylons are too tall to jump.
- The camera rises a little with you, the speeder's shadow shrinks as you climb, the light trails
  follow you up, and there's a launch sound and a landing thud with sparks.
- Title screen tip: "Hit a ramp to jump". Version v0.3.1; service worker cache bumped.
- Tested: autopilot runs with jumps (no errors, barrier cleared every time it took the ramp),
  bullet paths checked in a bend.

**Decisions made:**
- Jumps come from ramps, not a button, to keep the game one-thumb.
- Barriers only appear after 1.2 km so new players learn ramps on optional jumps first.

---

## [v0.3] — 2026-10-30

### Session 3 — Curving track, roadside world, five zones, visual polish

**What we did:**
- **Curves and hills.** The track now sweeps left and right, runs S-curves, and lifts off the
  ground onto sky-high stretches held up by pillars. Bends start gentle and get sharper the
  farther you go; big sweeping bends show up after about 2 km.
  - How it works: gameplay still happens on a "straight" track (same collisions, same spawning).
    Only the drawing bends. Every frame the game builds a small table of how far the road has
    turned and climbed at each distance ahead, and everything (rails, obstacles, gates, bullets,
    the speeder) is drawn through that same table, so nothing can drift out of line.
  - The road never hides behind a hill crest, so hazards ahead are always visible.
  - Turns gently push you toward the outside (like a car). It builds smoothly with the bend.
  - Yellow chevron signs on the outside rail warn you of each bend before it arrives.
  - The camera leans slightly into turns and looks a little into the bend; the sky, sun and
    mountains turn with the road.
- **Five zones** that blend into each other every 1.4 km: Neon Desert → Neon City →
  Sky Islands → Crystal Wastes → Cosmic Highway (then it loops). Each one is the same world
  system with different colors, sky objects (sun, moon, ringed planet, nebula, city skyline,
  floating islands, cloud sea) and roadside props. A "ZONE 2 · NEON CITY" label announces each one.
- **Roadside scenery** from a recycled pool of 80 props (nothing new is created during play):
  jagged polygon mountains, mesas, skyscrapers with lit windows, antennas with sky beams,
  floating monoliths, crystal clusters, floating islands with waterfalls, tumbling wireframe
  shapes, energy beams, and giant neon arches the track passes through. Props always sit
  outside the rails and are drawn underneath gameplay objects, so they never cover a hazard.
- **Feeling of speed:** the view widens slightly as you speed up, light trails stream from
  the three engines and curve when you steer, extra speed lines skim along the rails, the
  view surges and a colored ring bursts off the speeder when you take a power-up.
- **Track and object polish:** darker, more solid road with lane lines and center dashes;
  rails are a glowing band with a bright top edge and lit posts; pylons and walls have bright
  caps and glow pooled under them; gate labels sit on a dark plate so they read at a glance.
- **Speeder polish:** cleaner hull with highlights, animated two-layer flames that grow with
  speed, blinking wingtip lights, and it narrows as it banks so the roll reads better.
- **Settings:** new **Graphics** (Auto / High / Low) and **Screen shake** on/off. On Auto the
  game steps its quality down by itself if a phone can't hold a smooth frame rate.
- Version v0.3.0; service worker cache bumped so installed copies update.
- Tested at phone size (390×844) and in landscape across all five zones with an autopilot:
  no errors, collisions unchanged. Drawing cost went from about 0.8 ms to 1.2 ms per frame on
  the test machine (a phone has about 16 ms per frame).

**Decisions made:**
- Kept the homemade pseudo-3D canvas renderer (no 3D engine). Curves were added inside it.
- Hills only lift the track above the ground (bridges / sky roads), never sink below it.
- Scenery is always secondary: dimmer, drawn under hazards, and kept off the track.
- The course leans toward turning back after big turns, so the sun is usually somewhere ahead.

**Next session focus:**
- Adrian plays it on a phone: how do the bends feel? Is the outward push too weak or too strong?
- Check frame rate on an older phone (Settings → Graphics shows which level Auto picked).

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
