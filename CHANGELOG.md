# Changelog — Speeder

All notable changes are documented here, session by session. Newest entries go at the top.

---

## [v0.12.3] — 2026-11-13

### Session 13f — Light-speed streaks blended into the walls

Adrian: even thicker, more subtle, and blended into the wall of the hyperlane.

- The light-speed streaks are now wide, faint bands painted onto the walls themselves, in the
  walls' own blues and violets (an occasional one in the next world's colour), with no bright
  middle. They sit right on the wall and are drawn under the panel seams, so they read as part
  of the wall rather than something floating in front of it.
- Classic and Warp Run unchanged.

---

## [v0.12.2] — 2026-11-13

### Session 13e — Softer light-speed streaks

Adrian: the streaks need to be softer, fuzzier, less striking and distracting.

- Light-speed streaks on the walls are now soft, hazy bands of light (wide faint glow, a faint
  brighter middle, no hard white line), a gentle shimmer instead of a flicker, and fewer of
  them (80, was 120). The star streaks inside the tube are softer too.
- Your bullets fade from view part way down the tunnel, so they no longer scribble a bright
  knot over the middle of the screen. They still hit things all the way down.
- Classic and Warp Run unchanged.

---

## [v0.12.1] — 2026-11-13

### Session 13d — A new look for the hyperlane

Adrian, after his first look: there's potential, but the styling and effects need a lot more.
The tunnel could be a little bigger; there needs to be more contrast between the walls and the
things coming at you (maybe lighter walls, darker or brighter shapes); maybe zoom in.

- **One rule for the whole look: a lit tunnel, dark hazards edged in neon, bright pickups.**
  Things now stand out from the walls by brightness and by colour (cool walls, warm danger).
- **Walls:** a solid tube of lit panels in blue-violet instead of thin lines on black, with
  glowing seams, alternate strips a shade lighter so the tiles rush past, walls getting lighter
  toward the far end (lit by the core), and rings of light racing at you faster than you fly,
  with their seam in the colour of the world you're heading to. The walls stay blue-violet
  whatever world is ahead, so orange rocks and red lasers never blend in.
- **Bigger tunnel, closer camera:** radius 4 (was 3.4), camera closer behind the speeder and
  zoomed in (the speeder is about a third bigger on screen), wider view for more rush, and the
  camera banks more with your moves.
- **Hazards:** rocks are near-black with bright orange edges and a hot glow, and get **red target
  brackets** when they're on a collision course; lasers sit on a dark band so they stay sharp
  against the walls, and flicker when they're on your line; iris walls are dark slabs with the
  hole as the brightest thing on them, plus four arrows pointing in.
- **Pickups:** rings, cells and orbs are brighter, with a dark outline so they read against
  bright parts of the tunnel. Each ring now gives a **burst of speed** (+20%, with a zoom and
  stretched streaks); all six still earns the perfect-line bonus.
- **Light-speed walls** (Adrian, mid-session: "like light speed in Star Wars"): the walls ripple
  and warp in waves running round and down the tube (drawing only: nothing you can hit moves),
  and 120 streaks of blue-white light pour down the walls at twice your speed, curling round the
  tube and flickering. They only appear from mid-distance in, so the far middle stays clear for
  what's coming at you.
- **Camera keeps the speeder below the far end of the tunnel** (higher, and follows more of your
  up-and-down), so it never sits in the bright centre where everything converges.
- **Speed and hyperspace effects:** star streaks through the tube and energy dashes racing
  along the walls, stretching longer as you boost and as the exit nears; a **jump-in effect**
  (the tunnel forms around you over 0.7 s out of a burst of light lines, replacing the coloured
  flash); a dark frame round the screen edges to pull your eye to the middle; softer, shorter
  engine trails.
- The world gate's window now shows the new tunnel look.
- Frame cost checked: a lane frame costs about half a road frame (test machine, not a phone).
- **Classic and Warp Run are unchanged.** Not yet played by a human.

---

## [v0.12.0] — 2026-11-13

### Session 13c — HYPERLANE: flying between worlds

Adrian: add the flying idea to the Lab, but don't make people reach the end of a loop to try
it. Put it between each world: through the portal into a zero-gravity hyperspace tunnel at high
speed, dodging things and picking up power-ups. The speeder should fly naturally: rotate and
flip with your moves, turning its top toward the way it's going, and spin in a cool way.

- **New experiment: HYPERLANE** (on by default in the Lab). Every world gate, including the
  one after the Warden, now opens onto a hyperspace tunnel instead of the next world. Fly in
  and you're in the lane for about **16 seconds**, then out through an exit that shows the next
  world, which loads in around you as usual. The road waits where the gate was.
- **Two-way steering in the lane:** the same relative drag, now up and down as well as left and
  right, kept inside the tunnel (a circle). Arrow keys or WASD on a computer. No jumps in here.
- **What's in a lane:** rocks (shoot them, +60, sometimes drop a cell; hit one and it costs a
  hit), red laser beams across the tunnel (some turning, a turning cross on loop 2+), iris walls
  with one hole to fly through, six-ring lines (+150, +300, ... and +800 with 2 cells for all
  six), spirals of cells, and one **power-up orb** per lane with a rock parked in front of it.
  A lane always starts with rings to teach up and down; the orb comes third. Close calls count.
- **The speeder flies freely:** it glides to your thumb as on the road and noses toward where
  it's going. The option being compared is how it rolls: **Barrel rolls** (it rolls so its
  top points the way it's moving, banks right over in a hard turn, flips upside down on a fast
  dive, and a fast swipe sideways throws in a full barrel roll) vs **Smooth banks** (banks into
  turns and tips its nose, never upside down).
- **Looks:** an 18-sided neon tube that snakes about and slowly twists, rings of light in the
  colour of the world ahead, a bright core at the far end, streaks along the walls, engine
  trails that show every swerve, and a world gate that now shows the tunnel through its window.
- **Lab panel:** HYPERLANE switch, a "Flying style" option, and a new test setup switch,
  **Start in a hyperlane**, so you can try it the moment a run starts.
- HUD: a HYPERLANE timer bar on the timers row; "▲ HYPERLANE" instead of "▲ WARP GATE" ahead of a
  gate; a one-time "drag up and down too" hint.
- Game over in the Lab lists hyperlanes, lane rings, hits and barrel rolls. Analytics:
  `lab/lane/<variant>/rings-*`, `hits-*-per-lane`, `*-barrel-rolls`, `died-in-lane`.
- Trade-off to know: with HYPERLANE on, a Lab loop takes about a minute longer (five lanes).
- New test file `tests/lane.mjs`; `tests/soak.mjs` now flies lanes too.
- **Classic and Warp Run are unchanged** (same seeded-run check as before).
- Not tested by a human yet: lane length, speed, how much is in it, and both flying styles are
  first guesses.

---

## [v0.11.0] — 2026-11-13

### Session 13b — Bigger jump, sky ramps with rings, and a test setup for high speed

Adrian: the jumps should be higher and longer, so you can do more and earn more. Add ramps as
the next experiment, with rings to fly through in the sky. And a setting for the starting loop
plus a "fully loaded" checkbox, to test at high speed without 20 minutes of play first.

- **Jump is bigger:** about 2.4 high for 1.1 seconds (was 1.5 and 0.7). That is a little more
  than a ramp jump, so it now clears what a ramp jump clears: lasers and trucks as well as
  mines, walls, craters and ram bikes. Pylons and crystals are still too tall. More time in the
  air means more things flown over, and each is worth AIR +150.
- **New experiment: SKY RAMPS** (switch it on or off in the Lab). Every 11-17 seconds a big
  lime ramp appears. Take it and you fly about 6 high for 2.6 seconds, with **five rings** in
  the sky to steer through. Rings pay +200, +400, +600, +800, +1,000; all five is a **perfect
  flight**: +1,000 more, 2 power cells and a jump charge. The road underneath is kept clear, so
  you can stay down and skip it. Never in tunnels, before a world gate or during the boss.
- **Test setup** card in the Lab: **Start on loop 1-6** (the run begins at that loop's speed,
  difficulty and score multiplier; loop 3 is about 505 km/h) and **Fully loaded** (guns at
  level 8 and 2 shields from the start). The distance on the game-over screen counts only what
  you flew.
- Game over in the Lab now also shows rings, flights, perfect flights and the test setup used.
- How to play: the Lab section covers the bigger jump, sky ramps and the test setup.
- The Lab panel scrolls instead of squashing now that it holds more.
- For the next builder: experiments can now add their own hazard patterns (`labPattern`) and
  their own objects on the road (`labObj` / `drawLabObj`). See LAB.md.
- **Classic and Warp Run are unchanged** (same seeded-run check as v0.10).
- Not tested by a human yet: every number above is a first guess.

---

## [v0.10.0] — 2026-11-13

### Session 13 — The Lab, and its first experiment: JUMP

Adrian: could we add a jump, like a flick up? Other ideas too: different roads or ramps, mega
jumps, maybe a mode where you fly through space in a tunnel and move up and down as well. But
don't merge it with the game: add a test mode where anyone can try new features.

- **THE LAB**, a third mode for trying ideas out. Open it from the title screen (the lime
  button beside How to play), switch experiments on or off, and ride. A Lab run plays by Warp
  Run's rules with the experiments layered over the top.
- **Lab runs stay off every leaderboard** (world and "This device") and have no share card.
  The Lab keeps only its own best score on the device.
- **Thumbs up or down** on each experiment at the end of a Lab run. Votes and usage go to the
  analytics dashboard under `lab/...`, per variant, so two versions of an idea can be compared.
- The Lab is **never the saved mode**: the game always reopens on the last real mode you played.
- A link ending in **`?lab`** opens the Lab directly (for inviting testers).
- **Experiment: JUMP.** Hop anywhere, no ramp needed. About 1.5 high for 0.7 seconds (a ramp
  jump is 2.2 and 0.95 s). A hop clears mines, walls, craters, ram bikes, turrets and chasms.
  Pylons, crystals, trucks and laser fences are too tall, so ramps keep their job.
  - **Two gestures to compare:** flick your steering thumb up, or tap with a second finger
    (a quick one-finger tap works too). Space, Up or W on a computer.
  - **Two costs to compare:** hold 2 jump charges and earn one back every 2 close calls, or
    unlimited jumps. Charges show as lime arrows in the top bar; they blink red when empty.
  - "HIT THE RAMP" reads "RAMP OR JUMP" when you have a charge. AIR bonuses count for hops.
- How to play has a new section, The Lab.
- **Classic and Warp Run are unchanged.** All Lab code sits behind `LAB.on` / `labOn()`. A
  seeded 2-minute Classic run and 5-minute Warp Run produce identical game states before and
  after this version.
- New for whoever builds the next experiment: **`LAB.md`** (rules of the Lab, how to read the
  results, the recipe for adding an experiment, the ideas queue) and **`tests/`** (three
  automated checks to run before publishing).
- Not tested by a human yet: hop size, the flick and tap thresholds and the charge rate are
  first guesses.

---

## [v0.9.5] — 2026-11-10

### Session 12f — No bend push, smoother speed-ups (Warp Run)

Adrian: the speeder is too hard to control in high loops, it has to be fine control. And
the speed jump at the start of each loop is too sudden.

- **Bend push removed in Warp Run** (`W_DRIFT_MAX = 0`, was 0.5). The speeder only moves when
  your thumb does. Bends still matter: bullets fly straight, so they still drift outward in a
  bend. Sky Islands' crosswind still pushes you (it's a hazard and is announced). Classic keeps
  its push (`DRIFT_MAX`).
- **Speed rises a little through every world** instead of all at once at a new loop
  (`warpTop()`). Loop 1 is unchanged (settles at 90, about 450 km/h). From loop 2 the +50 km/h
  a loop is spread over its five worlds, about +10 km/h per world, rising smoothly inside each
  one, so there is no jump at the gates either. Each loop finishes at the speed the whole loop
  used to run at, so every loop is a little slower on average than before; the 655 km/h cap is
  now reached at the end of loop 5 instead of its start.
- How to play: Loops now says each world is a little faster than the last.

---

## [v0.9.4] — 2026-11-10

### Session 12e — Leaderboards show the top 50

- Both world leaderboards (Classic and Warp Run) now keep the **top 50 runs** instead of 25
  (`BOARD_N`). A run uploads if it makes the top 50 or is your best, and the ladder, rank
  messages and "Top 50 needs ..." line all follow. The How to play page says 50.
- No database rules change was needed. Runs that were outside the old top 25 but were not a
  player's best were never uploaded, so places 26-50 fill in as people play.
- Cost: each leaderboard download now reads 50 scores (Warp Run reads 100, to skip old-version
  runs) instead of 25/50. Downloads are still reused for 1-10 minutes (`TOP_AGE_*`).

---

## [v0.9.3] — 2026-11-10

### Session 12d — Bend push capped, boss tougher again

Adrian felt "a slight pull back to the middle... a movement that is not coming from my
thumb". The only thing that does that with nothing on screen is the push bends give you
toward the outside (since v0.3). It grows with the square of your speed and was capped at
2 units a second, which Warp Run reaches from late loop 1. He asked to cap or remove it.
Early feedback also says the boss should be harder still.

- **Bend push capped in Warp Run** at 0.5 units a second, a quarter of before
  (`W_DRIFT_MAX`; set it to 0 to remove the push completely). Classic keeps the old cap
  (`DRIFT_MAX`).
- **The Warden, harder again.** Measured with a test driver that reacts 0.3 s late: 0 hits a
  fight against v0.9.0's boss, about 1.3 now (0.3 for a driver reacting in 0.2 s, so it is
  still fair). Real players will take more than the test driver does.
  - It never stops shooting: single aimed shots keep coming under its other attacks
    (`BOSS_SNIPE`: every 1.5 / 1.1 / 0.8 s by stage).
  - Shots are about 20% faster. Pauses between attacks are shorter (`BOSS_PACE`).
  - Lane beams: four lanes from the second stage, and they chain: two sets in a row in the
    second stage, three in the last, each with a shorter warning (`bossBeam`).
  - Mine walls: from the second stage a second wall follows with its gap one lane over.
  - Laser fences: narrower gap (2.7), a pair from the second stage, and the second one's gap
    is a step to one side instead of lined up.
  - Bursts are five shots wide in the last stage; one more ram bike, and they close faster
    and turn harder.
  - About 25% more health (`BOSS_TOUGH` 42) and it weaves faster. A fight lasts around 35-40
    seconds for the test driver with mid-level guns.

**Not played by a human yet.** If it's now too much, the first knobs to turn back are
`BOSS_SNIPE` and the number of beam sets (`bossBeam(e, st + 1)`).

---

## [v0.9.2] — 2026-11-10

### Session 12c — Rank messages name the mode

Adrian: the game-over screen and the share still said "number one in the world", but there
are now two world leaderboards.

- Everything that claims a world rank now says which mode it is for:
  - Game over: "WARP RUN WORLD RECORD!" / "CLASSIC WORLD RECORD!", and "#3 IN WARP RUN!" with
    "WARP RUN world leaderboard" under it.
  - The save message: "You're #3 in the world for Warp Run!"
  - Share text: "I just set the Warp Run WORLD RECORD on SPEEDER: ..." and "I'm #3 in the
    world in SPEEDER's Classic mode ..." (Classic used to say just "SPEEDER").
  - Share picture: "WARP RUN WORLD RECORD", "#3 IN THE WORLD · CLASSIC"; the stats line now
    names Classic too.
  - The leaderboard panel's count line and the in-run "WORLD #1 PACE!" message.

---

## [v0.9.1] — 2026-11-10

### Session 12b — iPhone screen fit

Adrian's screenshots from the installed app on his iPhone showed three things: a dead strip
along the bottom of every screen, the title screen cut off below "How to play" (no version
line), and in a run the score sitting under the iPhone's clock with the speed and loop
readout behind the pause and sound buttons.

- **Title screen always fits.** Since v0.8 added the two mode buttons it was taller than any
  phone under about 770 points, and the bottom was simply cut off (on an iPhone SE too, not
  only Adrian's). The gap where the speeder shows through now gives way first, the hints
  shrink and then hide on short screens, and a phone on its side gets a compact layout.
- **Score under the clock.** The game reads the notch size once at launch; on an installed
  iPhone app that reading can come back as zero for a moment, with no "resize" afterwards.
  The game now re-measures a few times a second (`checkSize`) and, when the window is short
  by the status bar, uses that shortfall as the notch size (`measureScreen`).
- **Dead strip along the bottom.** An installed iPhone app can report a window shorter than
  the screen by the height of the status bar. The game now uses the real screen height there
  (`measureScreen`, `--app-h`). Had been there in earlier versions too.

**Tested** in the test browser at seven screen sizes and with the iPhone's wrong height faked.
**Not verified on a real iPhone:** the bottom strip is a quirk of iOS itself, so that fix is
a best attempt until Adrian checks it. The other two don't depend on it.

---

## [v0.9.0] — 2026-11-10

### Session 12 — Warp Run after Adrian's first playtest

Adrian played Warp Run and liked it, but it "doesn't feel done". His notes: the world
transitions feel cheap (a wormhole that looks overlaid on the game, then a hyperspace tube);
worlds go by too fast, 10-15 seconds in high loops; the boss is too easy; the green gems float
along with you instead of staying where the enemy died; slalom walls and sliding laser fences
are too hard at top speed; sometimes you pass straight through a laser fence without being
hurt; the worlds could be more immersive (city buildings don't look like buildings up close);
you can ride the wall through a whole zone; and his two test scores should come off the board.

- **World gates replace the wormhole and the hyperspace tube.** Each world now ends at a gate
  built across the road: two pillars and a top beam (`drawPortal`, `GATE_*`). Its opening is a
  **window onto the next world**: that world's sky, ground and road, lined up with this one.
  You fly through it and you're there. There is no flash and no jump: the world changes at the
  moment the window fills the whole screen (`enterWorld`), a moment after the speeder itself
  has gone through.
- **The new world loads in around you** over about 1.5 seconds (`REZ_T`): the road is there
  at once, the sky switches on piece by piece (stars, mountains, skyline, sun: `REZ_AT`), and
  the scenery rises out of the ground in a wave that spreads away from you (`rezWave`). A few
  bars of static for the first third of a second. No strobing: each piece blinks once, softly.
- **No more dead time around a gate.** The road runs straight through it, there are about two
  seconds of clear road after it, and then hazards start again. The world's name card comes
  once the world has loaded in, after the WORLD CLEARED message. Before: a white flash,
  1.9 seconds in a tube, another flash.
- **Worlds last about 40 seconds in every loop** (`W_WORLD_T`). A world's length is now worked
  out from the speed you'll be doing in it (`sectorLen`), never shorter than the old 3.4 km.
  Loop 1: about 55 s for the first world, then 40 s each. Loop 5: 40 s each instead of ~15 s.
  Tunnels and crosswinds stretch with the world. A full loop is now about 4 minutes.
- **The Warden is a real fight** (`BOSS_SEQ`, `BOSS_PACE`, `bossStageUp`):
  - Three stages, one for each third of its health, marked by notches on its health bar.
  - Stage 1: aimed shots, mine wall, lane beams, and a new **laser fence** it sends down the
    road. Stage 2 adds **three-way bursts** and **ram bikes** it drops at you (they give
    points and cells). Stage 3 does everything with shorter pauses.
  - It weaves faster and follows you less, so you have to chase it. Its hit area is narrower
    (3.0 wide, was 3.8).
  - More health: `BOSS_TOUGH` 34 (was 25), about 23 seconds of on-target fire with one gun
    and 15 fully maxed (was 16 and 8).
  - Lane beams light 3 or 4 lanes (was 2 to 4), and a safe lane is always next door or two away.
- **Power cells stay on the road** where the enemy went down, and come at you with the road
  like everything else. Close up they lean toward you a little so a near pass still collects.
- **Top speed is fairer** (Warp Run only; `sp`, `v` and `ml` in `spawnPattern`):
  - Slalom walls are at least 0.55 seconds apart at any speed (at 655 km/h that is 3x the old gap).
  - Double walls: the second comes at least 0.55 s later and its gap moves at most 3 units.
  - Laser fences: the gap is never tighter than 2.8 (was 2.2) and widens a little at very high
    speed, it slides more gently, and a second fence follows at least 0.7 s later with its gap
    timed to be almost where the first one's was when you went through.
  - Every other pattern's inner spacing stretches with speed too. How fast moving hazards slide
    stops rising part-way through loop 2.
- **Fixed: flying through lasers and walls unharmed.** At high speed the road moves further in
  one frame than a laser or wall is deep, so a hit could fall between two frames. Measured at
  655 km/h before the fix: a laser fence hit only 59% of the time, a wall 70%, a ram bike 44%.
  Now 100%, including when the phone drops frames. This fix is in Classic too (rarer there:
  worked out, not measured, about 1 in 8 laser fences at Classic's top speed).
- **Rail riding has a limit** (Warp Run only; `updateRail`, `RAIL_*`). Ride a rail and it
  heats up: sparks go yellow, orange, red and "RAIL HOT" flashes. After about 3 seconds it
  overloads: you're thrown back onto the road (no damage) and both rails are locked for
  5 seconds. Traffic in Neon City now fills the road rail to rail, so there's no free lane
  along the edge.
- **Worlds look more alive.**
  - Buildings are buildings: stacked tiers, lit windows on the front and on the side facing
    the road, a strip of lit shopfronts at street level, neon blade signs, roof masts
    (`drawTower`, `buildWindowTex`). The detail is in the lowest dozen units, because that is
    all a phone ever shows of a nearby building. (Classic's Neon City gets these too.)
  - Warp Run only: palms in the desert, holo billboards and street lamps in the city,
    floating rocks and paper lanterns in the sky, drifting lights over the crystal plain,
    beacons and rocks in space (`SKINS[].extra`, `drawRoadside`). No measurable cost in the
    test browser's frame time; not yet checked on a real phone.
- **Warp Run leaderboard reset** (`W_BOARD_MIN_V`): the board only shows runs made on v0.9.0
  or newer, and each device forgets its own Warp Run records once when it updates. Adrian's
  two v0.8 test scores no longer appear for anyone. They are still in the database (the rules
  don't allow deleting); he can delete them in the Firebase console if he wants them gone.
- How to play updated: world gates, the Warden's stages, cells, riding the rail.

**Tested:** frame-by-frame screenshots of the gate in portrait and landscape; three full loops
with an automated driver (no errors); a driver with human-speed reactions at loops 1-3 and 5-6
(no laser or slalom hits); Classic for four minutes; real-time play with touch input.
**No human has played v0.9 yet.**

**Decisions made:**
- A gate you can see through, with the world building itself on the far side, instead of a
  flash that hides a swap. Adrian's idea ("blinks into existence, since it's a digital world").
- World length follows time, not distance.
- Rail riding is limited, not punished: no damage, and the edge trick still works for a gap.
- A board reset is a version number in the code, so it needs no Firebase work.

**Next session focus:**
- Adrian plays v0.9: is the boss now a good fight or too much? Is 40 s per world right?
  Does the rail limit feel fair? Do the gates feel good at speed?
- Then tune: `W_WORLD_T`, `BOSS_TOUGH`, `BOSS_PACE`, `RAIL_HOT_T`, slalom/laser spacing.

---

## [v0.8.0] — 2026-11-09

### Session 11 — Two modes: Classic, and the new Warp Run

Adrian reached 138 km and found it "the same old thing": he barely noticed the zones change.
What was going on: the five zones were only 1.4 km each (about 16 seconds at top speed, with a
4-second cross-fade), they repeated every 7 km, and speed, hazard patterns and guns had all
topped out within the first ~10 km. He'd seen each zone about 20 times. He asked for worlds
with their own feel (track and obstacles, not just scenery), real transitions, a boss, loops
that also score, better guns and new ways to get upgrades, without hurting frame rate, with
the existing game kept as "Classic", and analytics to see which mode people play.

- **Two modes, picked on the title screen.** CLASSIC is the v0.7.7 game, untouched (same
  hazards, speeds, scores and leaderboard). WARP RUN is new and is the default selection.
  Each mode has its own best score, "This device" list and world leaderboard; the
  leaderboard screen has a Warp Run / Classic switch, and game over offers "Play X instead".
  The choice is saved in `speeder.settings` (`mode`).
- **Five worlds, 3.4 km each** (`W_SECTOR` 2400 units, was 1400 for a zone), each with its own
  rail, grid and road colors, its own look for pylons and walls, and its own hazard (`SKINS`):
  - **Neon Desert**: orange rails, stone obelisks, wide gentle bends, **ram packs** (an
    arrowhead of ram bikes that hold formation).
  - **Neon City**: blue rails, **tunnels** (two per visit, with ribs and lamps strobing past)
    and **traffic**: hover-trucks going your way at about 40% of your speed. Can't be shot.
  - **Sky Islands**: gold rails, **chasms** (the road is missing; a full-width ramp throws you
    across) and **crosswinds** (warned under the speeder, then they push you sideways).
  - **Crystal Wastes**: pink rails on a teal road, **crystals** that burst out of a glowing
    crack as you approach. 3 hits to shatter (+100), or dodge.
  - **Cosmic Highway**: violet rails on a near-black road, black monoliths, **meteors** (a
    target ring, then a burning crater) and **floaty jumps** (45% longer in the air).
  - Danger colors never change between worlds: mines orange, ramps lime, lasers and enemies red.
- **Warp gates.** Each world ends at a big swirling gate in the next world's colors. Fly in:
  the screen whites out, you spend about a second and a half in a tube of light (no hazards,
  can't be hurt), and you come out in the next world with a title card. The swap happens
  inside the flash, so nothing blends or pops. World cleared: +1,000.
- **The Warden (boss)** at the end of the fifth world, on a straight so shots fly true. It
  drifts across the track (line up to hit it) and cycles three warned attacks: an aimed
  volley, a wall of drifting mines with open lanes, and lane beams (lit lanes get scorched).
  Health bar at the top. Its health follows your firepower (`BOSS_TOUGH`, `gunDps()`): about
  16 seconds of on-target fire with one gun, about 8 fully maxed, a third more each loop.
  One guaranteed REPAIR / SHIELD gate pair before it. Beating it: +5,000, six power cells,
  and a prototype.
- **Loops.** After the boss the five worlds start again as LOOP 2, 3, ... Every point is
  multiplied by the loop number. Each loop: top speed +50 km/h (453 → 655 km/h by loop 5,
  `W_SPEED_STEP` / `W_SPEED_MAX`), harder patterns (`W_LVL_STEP`), enemies +1 hit (max +3),
  a faster, angrier boss. Spacing between hazards stretches with speed, so the time between
  them never drops below Classic's hardest.
- **Power cells and OVERDRIVE.** Destroyed enemies drop a green cell that drifts toward you;
  drive through it. 8 cells (`OD_NEED`) fire OVERDRIVE for 8 seconds: double fire rate, +1 damage.
- **Close calls.** Passing a pylon, wall, mine, truck, crystal or crater with under half a
  unit to spare scores +40, chaining up to +400, and adds a third of a cell.
- **Prototypes.** After each boss a pair of gates offers two permanent upgrades: HEAVY CORE
  (+1 damage, stackable), TWIN WINGS, HULL +1, AEGIS (shield regrows), MAGNET, CHAIN BLAST.
  This is how guns keep growing past level 8.
- **Analytics** (GoatCounter): `play/warp` and `play/classic` (one per run started),
  `mode/<mode>` (someone switched), `warp/run/<distance>`, `warp/reached/L<loop>-W<world>`
  (where each Warp run ended), `warp/loop/<n>`, `warp/boss/<n>`. Classic's existing
  `run/<distance>` events are unchanged, so old numbers still compare.
- **Sharing.** Warp Run challenge links carry `&m=w`, open the game in Warp Run, and only
  count as beaten in that mode. Old links are Classic.
- **How to play** has a Warp Run section.
- **Frame rate.** Measured in headless Chrome at iPhone size, average draw time per frame:
  Classic 20-24 ms, Warp Run 15-22 ms in the same test (tunnels and the boss fight are the
  cheapest scenes, because the sky and scenery aren't drawn). Not a phone measurement, but
  the comparison says Warp Run costs no more than Classic. New effects are a few dozen
  lines or arcs each; nothing new allocates per frame.
- **Tested** with an automated driver: five full loops (26 worlds, 5 bosses, 75,000+ frames)
  with no errors, plus Classic for the same length. **Not yet played by a human**: difficulty
  numbers are a first pass.

**One-time job for Adrian:** the Warp Run world leaderboard needs its own database rule.
Paste `firestore-rules-warp.txt` into the Firebase rules (README, "Adding the Warp Run
leaderboard"). Until then Warp Run scores are kept on the device and upload afterwards
(your 5 best).

**Later the same day:** Adrian published the rules. Added `firestore-rules-FULL.txt`, the whole
Firebase rules page as it should look (he had pasted from an out-of-date folder on his PC).

Knobs: `W_SECTOR`, `W_SPEED_STEP`, `W_SPEED_MAX`, `W_LVL_STEP`, `WARP_T`, `OD_NEED`, `OD_TIME`,
`BOSS_TOUGH`, `BOSS_PTS`, `SKINS` (colors, `curve`, `float`, `pat` weights, `sig` patterns),
`TRAFFIC_CLOSE`, `BOSS_SEQ`, `SETTINGS_DEFAULT.mode` (which mode new players start on).

---

## [v0.7.7] — 2026-11-08

- **Foldables steer like phones.** Adrian's friend on an unfolded Android fold had to lift his
  thumb to cross the track. Steering scaled with screen width up to 520 points, so on an
  unfolded fold a full cross took ~3.1 in of thumb travel vs ~2.3 in on an iPhone 13. Now
  capped at 400 points (`STEER_MAX_W`), so wide screens need the same thumb travel as an
  iPhone. Phones up to 400 points wide (iPhone 13/14/15/16, most Androids) are unchanged;
  Plus/Pro Max iPhones are ~7–9% lighter.
- Why he noticed now: v0.7.2–v0.7.3 (same session, 2026-11-07) briefly had much lighter
  steering (~1.4 in to cross). He got used to it; v0.7.4 put the original back.

---

## [v0.7.6] — 2026-11-07

- **Camera setting.** Settings → Camera cycles Close / Normal / Far / Full track and re-fits
  the camera right away. Close is exactly v0.7.1, Normal (default) is v0.7.5's slight
  pull-back, Far is further back, and Full track keeps both rails on screen at the speeder
  (like v0.7.2). Saved per device in `speeder.settings` (`cam`). Knob: `CAM_VIEWS`
  (share of the track's width visible at the speeder on a phone); replaces `VIEW_SHARE`.
  Big screens zoom out with the setting too, and still never let the track fill the screen.

---

## [v0.7.5] — 2026-11-07

- **Camera feel back to v0.7.1.** v0.7.3's lockstep camera felt stiff. The camera again eases
  after the speeder with a slight lag (`CAM_FOLLOW` 6), follows 85% of your sideways move on
  phones, and looks a little into each turn (`AIM_AHEAD` 31). The only camera change left from
  v0.7.1 is the slight pull-back (`VIEW_SHARE`) and the big-screen fit (`FIT_WIDE`).

---

## [v0.7.4] — 2026-11-07

- **Steering back to the original feel.** v0.7.2's thumb-distance steering was too touchy.
  Crossing the track takes a drag of nearly the full screen width again (capped at 520 points
  on big screens), same as v0.7.1. Removed `STEER_CROSS`. The camera changes from v0.7.3 stay.

---

## [v0.7.3] — 2026-11-07

### Session 10b — Back to the close camera, just pulled back a little

v0.7.2 zoomed out too far (camera ~4x farther back): Adrian lost the feeling of flying the
speeder. He liked the tight, close view and only wanted a slight pull-back.

- **Close camera, slight pull-back.** On phones the camera is ~1.5x farther back than v0.7.1
  (was 4x in v0.7.2): you see about 38% of the track's width at the speeder instead of ~27%.
  Knob: `VIEW_SHARE`.
- **Camera moves in lockstep, no lag.** With a close camera both rails can't fit at once, so the
  camera copies just enough of your sideways move to keep the rail you're next to on screen,
  and it moves exactly with the speeder (no sliding or catch-up after you stop). `CAM_TRACK`
  is worked out per screen in `fitView()`.
- **Wide screens** (unfolded foldables, tablets): show the whole track at up to 85% of the
  width, so the camera never needs to move and the track never fills the screen.
  Desktops stay as close as a phone. Knobs: `FIT_WIDE`, `VIEW_MAX_H`.
- Speeder drawn at `SHIP_SCALE` 1.0 (v0.7.1 0.8, v0.7.2 1.2).
- Kept from v0.7.2: one-swipe steering by thumb distance (`STEER_CROSS`), bends keep the
  track centered at the speeder, drones from behind start off-screen.

---

## [v0.7.2] — 2026-11-07

### Session 10 — Camera locked to the middle, whole track on screen

On an iPhone 13 Adrian couldn't see both rails where the speeder is, the camera slid side to
side, and on fast runs he couldn't get from one side to the other in one thumb motion. His
friend on an unfolded Android foldable had it worse.

What was going on: the track was never fully on screen at the speeder's row. On an iPhone 13
only about a quarter of its width fit (it was about 1,400 points wide on a 390-point screen),
so the camera followed you sideways to keep the speeder in view. That's been true since the
start; the v0.6 "tighter camera" just made the sliding more noticeable. Steering needed a drag
of ~92% of the screen width to cross the track, and up to 470 points on big screens.

- **Camera locked to the middle.** It no longer follows you sideways, and in bends it keeps the
  track centered at the speeder's row. Only the speeder moves.
- **Whole track on screen.** The camera sits farther back and higher, along the same viewing
  angle, so the road ahead looks the same and only the near view zooms out. Worked out per
  screen: phones fill ~92% of the width with the track; wider screens (tablets, unfolded
  foldables, desktop) fill 70% or less so scenery still shows at the sides.
  Knobs: `VIEW_TAN`, `FIT_NARROW`, `FIT_WIDE`, `FIT_MAX_H`.
- **One-motion steering.** Steering now goes by thumb distance instead of screen width: about
  230 points (~1.4 in) crosses the whole track at 100%, on any screen. Knob: `STEER_CROSS`.
- **Bigger speeder.** It's drawn 50% bigger (`SHIP_SCALE` 0.8 → 1.2) so it still reads well
  in the wider view. Its hit area is unchanged, so it's a little forgiving.
- Drones that swoop in from behind now start behind the camera, so they don't pop in mid-screen.
- Removed `CAM_FOLLOW` and `AIM_Z`.

**To check on real phones:** does it still feel fast? Are near hazards big enough to read?
Is steering too twitchy for precise dodges (try the Steering speed setting)?

---

## [v0.7.1] — 2026-11-07

### Session 9 — Battery fix for big Android phones

A friend on an Android foldable said the game drained his battery fast after v0.7.0. Adrian's
iPhone was fine. Likely cause: two things that only hit his kind of phone.

**What we found:**
- **120 frames a second.** Many Android phones refresh 90-120 times a second, and Chrome asks
  the game to draw on every refresh. iPhone Safari asks for 60. So his phone was drawing about
  twice as many frames as Adrian's, for no visible gain.
- **A much bigger screen.** Unfolded, his canvas was about 3.6 million pixels vs 1.3 million on
  an iPhone, so every frame cost almost 3x as much. v0.7.0's heavier effects made that worse.
- **Reflections** were about 10-15% of the drawing cost in tests. A real cost, but not the main one.

**What we did:**
- **60fps cap** in `frame()` (`FPS_PLAY`). Extra screen refreshes are skipped. iPhones don't change.
- **Lower frame rate when little moves:** title and game over draw at 30fps (`FPS_IDLE`), the
  pause menu at 15 (`FPS_PAUSED`). The resume countdown and the wreck stay at 60.
- **Pixel budget** per graphics level (`QUALS[].px`, High = 2.3M). Normal phones fit under it and
  look the same; big screens draw a bit less sharp. Unfolded foldable: 3.65M → 2.3M pixels.
- **Reflections only on phone-sized screens** (`GLOSS_MAX_AREA`, `glossOn`). Kept on regular phones.
- Measured on a simulated unfolded foldable: drawing work per second down to roughly a quarter
  to a third of before (cheaper frames × half as many). iPhone-sized screen: unchanged.

**To check:** ask the friend to reinstall or reopen (it may take two opens to pick up the update)
and compare. If it's still heavy, next steps: reflections off everywhere, or fewer glows/particles on High.

---

## [v0.7.0] — 2026-11-05

### Session 8 — Visual polish pass

Adrian: gameplay is good, but the animations and designs could use more love. We screenshotted
every zone on a phone-sized screen, listed the weak spots, and Adrian picked all four areas.

**What we did:**
- **Explosions.** Debris used to be flat squares. Now every blast has a hot flash, a shockwave
  ring, sparks that streak (drawn from where they were a moment ago, so they smear like real
  sparks), and tumbling debris chunks, some of which trail embers. New particle kinds in
  `burst()`, `debris()`, `shockRing()`, `flashAt()`. Cap: `PART_MAX`.
- **The wreck.** The speeder now comes apart: a big flash, two ground shockwaves, hull plates and
  engine pods flying off and burning, and about a second of slow motion (`G.slowmo`, eased in
  `frame()`). The game-over panel appears a touch sooner to make up for it.
- **Speeder.** Brighter top deck, darker sides (stronger silhouette), and a canopy lit from
  inside with a soft pink glow.
- **3D enemies.** Drones, ram bikes and turrets are now small 3D models like the speeder and
  pylons (`DRONE_MESH`, `RAM_MESH`, `TURRET_BASE` / `TURRET_HEAD`). Drones bank as they move,
  ram bikes lean toward you, turret barrels track you. Hits flash the whole model white
  (`MESH_TINT`). Collisions didn't change.
- **Glossy road (High graphics only).** The sky glows in the far road, the sun lays a broken
  column of light down it, rails and their lamps show upside down, and the speeder, pylons,
  mines and enemies all reflect. `drawGloss()`, `reflect()`, `QUALS[].gloss`.
- **Shield.** A glassy bubble with a honeycomb, a bright band drifting through it and a glint
  racing round the rim. A hit flares it white and cracks it; losing the last shield shatters it.
- **Pickups.** Taking a gate fires a flash and a ring at the gate, and the power's icon flies
  from the speeder up into the top bar.
- **Hull hit.** The hex you lose bursts outward in the top bar.
- **Zone title card.** A neon line wipes open in the new zone's colors and the name settles in.
- **Readability.** A soft dark band behind the top bar (GUNS was unreadable over the sun);
  "Touch to ride" sits in a pill and no longer fades to almost nothing.
- **Lower graphics levels** make fewer particles (`QUALS[].fx`: Low 0.5, Med 0.75, High 1).
- Test hooks added to `window.SPEEDER`: `explode`, `killEnemy`, `addEnemy`, `hurt`, `render`.
- Drawing cost per frame measured about 15% higher than v0.6.4 on a desktop test; the auto
  graphics setting still steps down on slow phones.
- Version v0.7.0; service worker cache bumped.

**Needs a look on real phones:** frame rate on a mid-range phone (High graphics), whether the
glossy road is too busy in Neon Desert (sun reflection), and how the wreck slow motion feels.

---

## [v0.6.4] — 2026-11-05

### Session 7b — Analytics switched on

- `GC_CODE = 'speeder'`. Dashboard: https://speeder.goatcounter.com (Adrian's GoatCounter account).
- Version v0.6.4; service worker cache bumped.

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
