# The Lab — Speeder's test mode

> Read this before adding, changing or removing an experiment. It is written for whoever
> picks the project up next (Adrian, or Claude in a new session).

The Lab is a third mode (added in v0.10.0) where new ideas are tried out **without touching
Classic or Warp Run**. Anyone can open it, switch experiments on or off, play, and vote.

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

A **variant** is the experiment plus its options, for example `jump.flick.charges` or
`jump.tap.free`. Votes are counted per variant, so two ways of doing the same idea can be
compared. A device's vote is remembered (`speeder.lab.votes`) and only sent when it is new or
changes, so the counts are roughly people, not runs.

---

## Experiments

| Experiment | Since | Status | What it tests |
|------------|-------|--------|---------------|
| **JUMP** (`jump`) | v0.10.0 | In the Lab. No human has played it yet. | A hop you can do anywhere. Options: gesture (flick up / second-finger tap) and fuel (2 earned charges / unlimited). |

### JUMP: how it works

- A hop is lower and shorter than a ramp jump: about 1.5 high for 0.7 s (ramp: 2.2, 0.95 s).
- It clears **mines, walls (jump barriers too), meteor craters, ram bikes, turrets, chasms**
  while you're in the air. It does **not** clear pylons, crystals, trucks or laser fences
  (`HOP_OVER` decides). A ramp jump still clears lasers and trucks, so ramps keep their job.
- You can only hop from the road (not in the air, not on a ramp).
- **Fuel:** "Earned" = hold 2 charges, each close call gives half a charge back. "Unlimited" =
  no cost. Charges show as lime arrows in the top bar.
- **Gestures:** "Flick up" = the steering thumb rises 34 points within 150 ms and moves up
  more than sideways. "2nd finger" = any second finger touching down while the first steers
  (it does not take over the steering), or a quick one-finger tap. On a computer: Space, Up or W.
- AIR bonus (+150 per thing you fly over) applies to hops as well as ramp jumps.
- Knobs (in the "Experiment: JUMP" block of `index.html`): `HOP_H`, `HOP_T`, `HOP_MAX`,
  `HOP_PER_CLOSE`, `HOP_OVER`, `FLICK_PX`, `FLICK_MS`, `FLICK_RATIO`, `TAP_MS`, `TAP_PX`.
- **Open questions for the playtest:** does flick-up misfire while steering hard? Is the
  second-finger tap comfortable one-handed? Do charges make a jump feel like a decision, or
  just get in the way? Does a free jump make mines and walls pointless? On an iPhone, a flick
  that starts at the very bottom edge can trigger the phone's own home gesture.

---

## Ideas waiting for the Lab

In the order suggested on 2026-11-13. Each should arrive as its own experiment.

1. **Mega ramps and new roads.** Bigger launches, longer air time, raised or split roads.
   Reuses the jump physics (`player.y`, `player.vy`, `jumpG()`).
2. **Air rings.** Off a mega ramp, steer through rings in mid-air for a bonus, so a big jump
   still involves a decision.
3. **Forks in the road.** A safe path and a risky one with more power cells. Fits the
   "choose by steering" design.
4. **Space tunnel.** Fly through a tunnel, moving up and down as well as left and right, and
   dodge. The biggest one: it needs two-axis steering and its own obstacle patterns. Suggested
   first shape: a 20-30 second stretch after the Warden, not a whole new game. Because it
   changes the controls, it will need its own run setup rather than a layer on Warp Run (see
   "A bigger experiment" below).

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

Today every Lab run is Warp Run plus layers. Something like the space tunnel changes the
controls and the obstacles, so it should start its own run instead: in `startLabRun()`, check
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
node tests/soak.mjs "$PWD"       # a bot plays two long Lab runs; any script error fails
```

`same-as-before.sh` plays a fixed, seeded run of each main mode in the last committed
`index.html` and in the working copy and compares the game state every 5 seconds. If a change
was *meant* to alter Classic or Warp Run, expect it to differ and say so in the CHANGELOG.

These tests cannot judge feel. A new experiment is "untested by a human" until Adrian has
played it on a phone.
