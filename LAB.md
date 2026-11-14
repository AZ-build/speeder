# The Lab — Speeder's test mode

> Read this before adding, changing or removing an experiment. It is written for whoever
> picks the project up next (Adrian, or Claude in a new session).

The Lab is a third mode (added in v0.10.0) where new ideas are tried out **without touching
Classic or Warp Run**. Anyone can open it, switch experiments on or off, play, and vote.
It also has a **test setup** card (v0.11.0) for getting to high speed quickly, or (v0.12.0)
straight into a hyperlane.

---

## The rules of the Lab

1. **Classic and Warp Run must not change.** Every piece of experiment code sits behind
   `LAB.on` or `labOn('<id>')`, which are only true during a Lab run. The test
   `tests/same-as-before.sh` proves it (see "Before you publish").
2. **A Lab run plays by Warp Run's rules** (worlds, gates, boss, cells, close calls), with the
   switched-on experiments layered over the top.
3. **Lab runs never reach a leaderboard.** No world board, no "This device" board, no share
   card. The Lab keeps only its own best score on the device (`speeder.lab.best`).
4. **The Lab is never the saved mode.** The game always opens on the last real mode played.
   You step into the Lab on purpose each time.
5. **Every experiment gets a vote.** The game-over screen asks for a thumbs up or down on each
   experiment that was on.
6. **An idea leaves the Lab one of two ways:** it graduates into Warp Run (or becomes its own
   mode), or it is retired. Adrian decides. Nothing graduates without a human playtest.

## How players get there

- Title screen → **THE LAB** (the lime button next to How to play) → switch things on →
  **Ride in the Lab**.
- A link ending in `?lab` opens the Lab panel directly:
  `https://az-build.github.io/speeder/?lab`. Good for inviting testers.
- After a Lab run: **Ride again** stays in the Lab, **Change the experiments** reopens the
  panel, **Play WARP RUN instead** leaves.

## Reading the results

Analytics dashboard: https://speeder.goatcounter.com (filter for `lab/`).

| Event | Meaning |
|-------|---------|
| `mode/lab`, `play/lab` | Someone chose the Lab / started a Lab run |
| `lab/link` | The game was opened from a `?lab` link |
| `lab/play/<variant>` | A run started with this experiment and these options |
| `lab/run/<distance>km` | How far Lab runs get |
| `lab/vote/<variant>/up` or `/down` | A thumbs up or down |
| `lab/jump/<variant>/<n>-jumps` | How many jumps happened in a run (0, 1-4, 5-14, 15+) |
| `lab/ramps/took-most` / `took-some` / `took-few` | Share of the sky ramps offered in a run that the player actually took |
| `lab/ramps/4-5-rings` / `2-3-rings` / `0-1-rings` | Average rings threaded per flight in a run |
| `lab/lane/<variant>/rings-most` / `rings-some` / `rings-few` | Share of lane rings threaded in a run |
| `lab/lane/<variant>/hits-0-per-lane` / `hits-1-per-lane` / `hits-2plus-per-lane` | Hits taken per hyperlane, on average |
| `lab/lane/<variant>/0-barrel-rolls` / `1-4-` / `5+-` | Barrel rolls in a run (Barrel rolls style only): do people find them? |
| `lab/lane/<variant>/died-in-lane`, `no-lanes` | The run ended inside a lane / before the first one |
| `lab/setup/loop<N>`, `loop<N>-loaded`, `...-lane` | A run used the test setup (later loop, fully loaded, started in a hyperlane) |

A **variant** is the experiment plus its options, for example `jump.flick.charges` or
`jump.tap.free`. Votes are counted per variant, so two ways of doing the same idea can be
compared. A device's vote is remembered (`speeder.lab.votes`) and only sent when it is new or
changes, so the counts are roughly people, not runs.

---

## Experiments

| Experiment | Since | Status | What it tests |
|------------|-------|--------|---------------|
| **JUMP** (`jump`) | v0.10.0, made bigger in v0.11.0 | In the Lab. Adrian's first note (2026-11-13): make it higher and longer. Done; needs another try. | A jump you can do anywhere. Options: gesture (flick up / second-finger tap) and fuel (2 earned charges / unlimited). |
| **SKY RAMPS** (`ramps`) | v0.11.0 | In the Lab. No human has played it yet. | Big ramps that launch a long flight with five rings to steer through. No options yet. |
| **HYPERLANE** (`lane`) | v0.12.0 | In the Lab. No human has played it yet. | A zero-gravity tunnel between every two worlds, steering up and down as well as sideways. Option: flying style (barrel rolls / smooth banks). |

### JUMP: how it works

- Since v0.11 a jump is a little bigger than a ramp jump: about 2.4 high for 1.1 s (ramp: 2.2,
  0.95 s). In v0.10 it was 1.5 high for 0.7 s; Adrian asked for higher and longer "so you can
  do more and earn more".
- It clears whatever it visibly flies over, the same as a ramp jump: **mines, walls (jump
  barriers too), laser fences, trucks, meteor craters, ram bikes, turrets, chasms**. Pylons
  and crystals are taller than any jump. (`HOP_OVER` lists what a jump may clear. In v0.10
  lasers and trucks were left out so ramps kept a job; with the bigger jump that looked wrong,
  because you could be seen flying over a truck and still hit it.)
- **Known trade-off:** the jump now does everything an ordinary ramp does, so only the charge
  cost keeps ordinary ramps meaningful. With "Unlimited" on they aren't.
- You can only jump from the road (not in the air, not on a ramp).
- **Fuel:** "Earned" = hold 2 charges, each close call gives half a charge back. "Unlimited" =
  no cost. Charges show as lime arrows in the top bar.
- **Gestures:** "Flick up" = the steering thumb rises 34 points within 150 ms and moves up
  more than sideways. "2nd finger" = any second finger touching down while the first steers
  (it does not take over the steering), or a quick one-finger tap. On a computer: Space, Up or W.
- AIR bonus (+150 per thing you fly over) applies to hops as well as ramp jumps.
- A perfect sky-ramp flight also gives a jump charge.
- Knobs (in the "Experiment: JUMP" block of `index.html`): `HOP_H`, `HOP_T`, `HOP_MAX`,
  `HOP_PER_CLOSE`, `HOP_OVER`, `FLICK_PX`, `FLICK_MS`, `FLICK_RATIO`, `TAP_MS`, `TAP_PX`.
- **Open questions for the playtest:** does flick-up misfire while steering hard? Is the
  second-finger tap comfortable one-handed? Do charges make a jump feel like a decision, or
  just get in the way? Does a free jump make mines and walls pointless? On an iPhone, a flick
  that starts at the very bottom edge can trigger the phone's own home gesture.

### SKY RAMPS: how it works

- Every 11-17 seconds of ordinary road (the first one after about 5 seconds) a **sky ramp**
  appears: lime like every ramp, but wider (5), longer (9) and taller (1.4). "SKY RAMP" is
  announced under the speeder as it comes into view.
- Taking it launches a flight about **6 high for 2.6 seconds**, with low gravity so there is
  time to steer.
- **Five rings** hang along the flight path, about half a second apart, each a step of 1.7-2.6
  to one side of the last, so you always have to steer and can always reach the next one. The
  brightest ring is the next one.
- In flight the rings keep time with you (each sits where you will be at its moment, whatever
  your speed does), so their height always matches your arc. Only steering decides a hit.
- **Points:** +200, +400, +600, +800, +1,000 (times the loop multiplier). All five is a
  **perfect flight**: +1,000 more, 2 power cells, and a jump charge if JUMP is on.
- The road under the whole flight is kept clear, so skipping the ramp is always safe. Sky
  ramps never appear in a tunnel, in the run-up to a world gate, or during the boss.
- Ordinary AIR bonuses still apply on landing.
- Knobs (in the "Experiment: SKY RAMPS" block): `SKY_W`, `SKY_LEN`, `SKY_H` the ramp's size ·
  `SKY_PEAK`, `SKY_T` how high and how long the flight is · `SKY_RINGS`, `RING_R` how many
  rings and how big · `RING_PTS`, `RING_PERFECT` points · `SKY_EVERY` seconds between ramps.
- How it plugs in: a sky ramp is an ordinary `ramp` object carrying its own height and launch
  speed (`h`, `vy`, `mega: true`); rings are objects tagged `lab: 'ring'`. It is spawned through
  `labPattern()`, flown with `player.mega` (its own gravity in `jumpG()`).
- **Open questions for the playtest:** is the flight long and high enough to feel like a mega
  jump? Are five rings in 2 seconds too quick at 500+ km/h? Should the ramp be something you
  must take (full width) rather than a choice? Is the empty road underneath boring if you skip?

### HYPERLANE: how it works

Adrian's idea (2026-11-13): the space tunnel shouldn't wait for the end of a loop. Put it
between worlds: through the portal into hyperspace, at high speed, dodging things and grabbing
power-ups, with the speeder rolling and flipping naturally as you move.

- **When:** every world gate (including the one after the Warden) opens onto the lane instead
  of the next world; the gate's window shows the tunnel. You're in it for about **11 seconds**
  (`LANE_T`), then out through an exit that shows the next world, which loads in as usual
  (`enterWorld()`). The first lane of a run comes at the first gate, about 55 seconds in, or
  straight away with the test setup's **Start in a hyperlane**.
- **The road waits.** While you're in the lane, nothing on the road moves and `G.d` doesn't
  change; the lane has its own distance (`LANE.d`). The score, timers (RAPID, 2X, OVERDRIVE,
  AEGIS), hull, shields and guns carry on as normal.
- **Speed:** 1.05x the road's speed (`LANE_SPEEDUP`; 1.25 until v0.12.4, Adrian: too fast),
  never under 60 (about 300 km/h, `LANE_MIN_V`). On the way out the road eases back down to its own speed.
- **Steering:** the same relative drag and the same sensitivity, in two directions, held
  inside a circle (`LANE_LIM`). Arrow keys / WASD on a computer. A thumb already down when you
  enter keeps steering. No jumps in a lane (flick-up would clash with steering up).
- **What's in it** (`LANE_SECTIONS`, picked in `laneNextSection()`): a lane always opens with
  `rings`, has the `orb` third, and otherwise picks from `rocks`, `laser`, `spin`, `iris`,
  `cells`, `rings` (plus `cross` and more rocks from loop 2), never the same twice in a row,
  with 0.75-1.1 s of open tunnel between, and the last ~2 s clear before the exit.
  - **Rocks** (orange edges, like mines: shootable): 3 HP on loop 1, +2 a loop (to loop 5).
    +60 each; 35% drop a cell where they were. Hitting one costs a hit and smashes it. Some
    drift from loop 2.
  - **Lasers** (red, like everywhere): a beam across the tunnel; bullets pass through.
    `spin` beams turn; `cross` is two at right angles, turning together.
  - **Iris walls** (pink, like walls): a wall right across with one hole (radius 1.6, a little
    smaller each loop, never under 1.3; was 1.2 / 0.95 until v0.12.6, too hard to hit). Bullets only get through the hole.
  - **Rings** (yellow, radius 1.3; 1.0 until v0.12.6): six in a snaking line, +150 x how many you've threaded so far; all six
    is +800, 2 cells and a zoom.
  - **Cells** (green): a spiral of 8, each charges OVERDRIVE. MAGNET pulls them in.
  - **Orb:** one power-up per lane, only ones that would do something (shield, guns, repair,
    rapid, 2X), with a rock parked right in front of it (shoot through it or go round).
  - Close calls (passing a rock, laser or iris rim with a little room) count as in Warp Run.
- **Flying style** (the option being compared, `labOpt('lane', 'feel')`):
  - **Barrel rolls** (`roll`, default): the speeder rolls so its top points the way it's
    moving, like a fighter turning: moving up it stays upright, sideways it banks right over,
    diving fast it flips upside down, then rights itself when you stop. The faster the move,
    the further round it rolls (`ROLL_V`). A fast swipe sideways (`SPIN_V`, about 1,400
    points a second) throws in a full barrel roll (`SPIN_T`). Rolls are only for looks: they
    don't change what hits you.
  - **Smooth banks** (`bank`): banks into sideways moves (up to `LANE_BANK`) and tips its nose up
    and down. Never upside down, no barrel rolls.
  - Both: the nose points a little toward where it's going (pitch and yaw), and the gun
    spread turns with the speeder (rolled on its side, the bullets fan out up and down).
- **The look (v0.12.1, after Adrian's first look):** a lit tunnel, dark hazards edged in neon,
  bright pickups. The walls are filled panels in blue-violet (`LANE_PANEL`), shaded like a
  solid surface (lit from above, dark grooves between panels; v0.12.4, after Adrian found them
  see-through), fading to a deep dark blue far off (`LANE_DEEP`) so everything coming at you
  glows against it, with rings of light rushing at you (`LT_PULSE`,
  `LT_PULSE_V`, lightening to `LANE_PULSE`; their seam is in the next world's colour). The walls
  never take the next world's colour, so danger colours always stand out. Rocks are near-black
  with orange edges and get red target brackets on a collision course; lasers sit on a dark
  band; iris walls are glowing pink honeycomb force fields with energy waves, hazard stripes
  round the opening and visible thickness inside it (v0.12.7: Adrian found the dark version
  didn't read as a wall; `drawIris()`, `IRIS_HEX`, `IRIS_DEPTH`). The tunnel forms around you as you drop in
  (`LANE.form`, 0.7 s), streaks stretch with speed, boosts and the exit, and a dark vignette
  frames the screen. Each ring gives a speed burst (`LANE.boost`, +20%). Light-speed walls:
  the walls ripple (`LANE_WARP`, drawing only) and wide, faint bands of light pour down them,
  painted onto the walls in the walls' own colours under the seams (`LANE_STREAKS`,
  `laneWarpStreak()`, `drawLaneWarp()`; Adrian found the first ones too striking, v0.12.2
  softened them and v0.12.3 blended them into the walls). The camera sits above the speeder (`LANE_CAM_UP`) and
  follows more of its up-and-down (`LANE_FOLLOW_Y`) so the speeder stays below the far end.
- **Coming out (v0.12.5):** `exitLane()` drops you onto the road in the air, still rolled
  however you were (`LANE.land`); `updateLaneLanding()` / `laneLandTilt()` ease the roll back to
  level the short way round over `LAND_T` (0.6 s) while the road's own gravity brings you down to
  a normal landing. One guarded line in `drawPlayer` adds the leftover roll.
- **How it plugs in:** `startLane()` is called from the world gate (one guarded line in
  `updateWarpObj`), and while `LANE.on` the game's `update()` and `render()` hand over to
  `updateLane()` / `drawLane()` (one guarded line each). The lane writes its own camera into the
  shared camera values (`laneView()`), so the usual drawing helpers (`sx`/`sy`, `drawMesh`,
  particles, popups) work in the tunnel; the road's horizon is put back by `exitLane()` and
  `resetLane()`. The tunnel's bends are drawing only, like the road's: gameplay is straight.
- Knobs (in the "Experiment: HYPERLANE" block): `LANE_T`, `LANE_R`, `LANE_SPEEDUP`,
  `LANE_MIN_V`, `LANE_CAM_Z`, `LANE_ZOOM` (how big the speeder is on screen), `LANE_CAM_UP`, `LANE_FOLLOW`, `LANE_FOLLOW_Y`, `LANE_WARP`, `LANE_STREAKS`, `LANE_BEND`, `LANE_GAP`, `ROLL_V`,
  `LANE_ROLL_RATE`, `LANE_BANK`, `SPIN_V`, `SPIN_T`, `LROCK_HP`, `LRING_R`, `LRING_PTS`,
  `LRING_PERFECT`, `LIRIS_HOLE`, `LASER_HALF`; what's in a lane: `LANE_SECTIONS`.
- **Known trade-off:** five lanes a loop add about a minute (11 s each), so a Lab loop takes
  ~5 minutes instead of ~4. If it should graduate, the obvious variants are "every other gate" or
  "only after the Warden".
- **Open questions for the playtest:** Is the new look (v0.12.1) right: walls light enough,
  hazards easy to read at speed, zoom right? Barrel rolls or Smooth banks? Is up/down with the same
  thumb natural, or does it fight the left/right? Is 11 s right (16 until v0.12.6)? Too much or too little in a
  lane? Is the barrel-roll swipe too easy or too hard to trigger? Does the lane break the flow
  between worlds that Adrian liked in v0.9, or is it a welcome change of pace?

## Test setup (not an experiment)

A card at the bottom of the Lab panel, for testing at high speed without playing for 20
minutes first. It has no vote. Saved on the device (`speeder.lab.setup`).

- **Start on: Loop 1-6.** Loop 1 is a normal start. Any other loop places the run as far
  along the track as a real run would be by then (speed and difficulty both follow distance),
  sets the loop and its score multiplier, and starts you at 70% of that loop's speed, reaching
  full speed within a couple of seconds. Roughly: loop 2 = 455 km/h, loop 3 = 505, loop 4 =
  555, loop 5 = 605, loop 6 = 655 (top speed). The distance shown at the end counts only what
  you flew (`LAB.d0` is where the run began).
- **Fully loaded.** Start with guns at level 8 and 2 shields. It does not add prototypes.
- **Start in a hyperlane** (shown while HYPERLANE is on). The run begins inside a lane and
  comes out into the world it started in.
- Code: `labStartOnLoop()` and `startLabRun()`.

---

## Ideas waiting for the Lab

Each should arrive as its own experiment. (Mega ramps and air rings from the first list became
SKY RAMPS in v0.11.)

1. **New roads.** Raised or split roads, a road in the sky you land on.
2. **Forks in the road.** A safe path and a risky one with more power cells. Fits the
   "choose by steering" design.

(The space tunnel became HYPERLANE in v0.12: it turned out it could be a layer on Warp Run
after all, by pausing the road while the lane runs.)

---

## How to add an experiment

All of it lives in `index.html`, in the block headed `THE LAB (v0.10)`.

1. **Register it.** Add an entry to `LAB_EXPERIMENTS`:

   ```js
   {
     id: 'megaramp',            // short, lowercase, never reused: it names saved switches, votes and analytics
     name: 'MEGA RAMPS',        // shown in the Lab panel, the game-over screen and the vote
     since: '0.11.0',
     on: false,                 // is it switched on for someone opening the Lab for the first time?
     blurb: 'One or two plain sentences on what it does.',
     opts: [                    // optional: ways of doing it that should be compared
       { id: 'size', name: 'Ramp size', def: 'big', choices: [
         { id: 'big', name: 'Big', hint: 'One line on what this choice does.' },
         { id: 'huge', name: 'Huge', hint: '...' },
       ] },
     ],
   }
   ```

   That alone gives it a switch and option buttons in the Lab panel, saved settings, a vote
   row on the game-over screen and analytics names.

2. **Give it its own block** under the others: `// ---- Experiment: MEGA RAMPS ----`, with its
   constants, state and functions together.

3. **Hook it into the game only through `labOn('megaramp')`** (and `labOpt('megaramp', 'size')`
   for an option). Shared hook points that already exist:

   | Hook | When it runs |
   |------|--------------|
   | `resetLab()` | every run reset: put the experiment's reset here |
   | `startLabRun()` | a Lab run starts (after Warp Run is set up) |
   | `updateLab(dt)` | every frame of a Lab run |
   | `labCloseCall()` | a close call just happened |
   | `labPattern(at)` | the game is about to pick its next hazard pattern: spawn your own at `at` and return the length of road it needs, or -1 to pass |
   | `labObj(o, rel, playing)` / `drawLabObj(o, z)` | update and draw objects tagged `lab: '<name>'` (they skip the game's own collisions, bullets and close calls) |
   | `labChips(x, y)` | draw on the HUD's timers row; return the width used |
   | `drawLabHints()` | draw helper text (keep it below the speeder) |
   | `labPointerDown / Move / Up(e)`, `labKey()` | touches and keys during a Lab run |
   | `labRunEnded(km)` | the run ended: send the experiment's analytics |
   | `labStatsLine()` | add a line to the game-over stats |

   If the experiment has to change a line in the main game (a collision rule, a spawn), keep
   it to one guarded line, written so it does nothing when the Lab is off.

4. **Add it to the How to play page** (the "The Lab" section) and to the table above.

5. **Bump the version** (`VERSION` in `index.html`, `CACHE` in `sw.js`), add a CHANGELOG entry,
   update `PROJECT_CONTEXT.md`.

### A bigger experiment (its own kind of run)

(HYPERLANE shows a middle way: a stretch that takes over the game for a while inside a normal
Lab run. While `LANE.on`, `update()` and `render()` hand over to the lane's own functions, and
the road simply waits. Copy that if your idea is "a different kind of play for a while".)

Today every Lab run is Warp Run plus layers. Something that replaces the whole run (a
different game, not a stretch of one) should start its own run instead: in `startLabRun()`, check
for it first and call its own setup rather than `startWarpRun()`. Give its entry a flag such
as `solo: true` and have the Lab panel switch the other experiments off while it is on. Not
built yet; build it when the first such experiment arrives.

### Graduating or retiring

- **Graduate:** move the experiment's code out from behind `labOn()` into Warp Run (behind
  `WP.on`), delete its entry from `LAB_EXPERIMENTS`, raise `W_BOARD_MIN_V` if it changes what
  a fair score is, and update How to play.
- **Retire:** delete its entry and its block. Saved switches and votes for an id that no
  longer exists are ignored.
- Either way, move its row in the table above to a "Past experiments" table with the outcome.

---

## Before you publish

From the repo folder (needs Node and Chrome with Playwright, as in Claude's workspace):

```
bash tests/same-as-before.sh     # Classic and Warp Run play exactly as in the last published version
node tests/lab.mjs "$PWD"        # the Lab: screens, jump rules, gestures, no leaderboard writes
node tests/lane.mjs "$PWD"       # HYPERLANE: steering, rolls, hits, pick-ups, in and out of a lane
node tests/soak.mjs "$PWD"       # a bot plays three long Lab runs (lanes included); any script error fails
```

`same-as-before.sh` plays a fixed, seeded run of each main mode in the last committed
`index.html` and in the working copy and compares the game state every 5 seconds. If a change
was *meant* to alter Classic or Warp Run, expect it to differ and say so in the CHANGELOG.

These tests cannot judge feel. A new experiment is "untested by a human" until Adrian has
played it on a phone.
