# Backlog — Speeder

A parking lot for ideas, features, and questions we want to revisit, but aren't working
on right now. Add anything here so it doesn't get lost.

---

## Lab experiments (ideas to try in the Lab first, see LAB.md)

- [x] ~~**Jump anywhere**~~ In the Lab since v0.10 (flick up vs second-finger tap; charges vs unlimited). Made higher and longer in v0.11 at Adrian's request. Awaiting a decision.
- [x] ~~**Mega ramps and air rings**~~ In the Lab since v0.11 as SKY RAMPS. Awaiting Adrian's playtest.
- [ ] **New roads**: raised or split roads, a road in the sky you land on.
- [ ] **Sky ramp options to compare**: a full-width ramp you must take vs the current optional one; 3 rings vs 5; something to collect on the road for players who stay down.
- [ ] **Fully loaded could include prototypes** (HEAVY CORE, TWIN WINGS...) if high-loop testing needs them.
- [ ] **Forks in the road**: a safe path and a risky one with more power cells.
- [ ] **Space tunnel**: fly through a tunnel, moving up/down as well as left/right, dodging. Suggested first as a 20-30 s stretch after the Warden. Needs its own run setup in the Lab ("A bigger experiment" in LAB.md).
- [ ] **Lab results in the game**: show the vote totals in the Lab panel (needs somewhere to read them from; today they only go to the analytics dashboard).

## Feature Ideas

> Things we might build someday. No commitment yet.

- [x] ~~**Track curves and hills**~~ Done in v0.3.
- [x] ~~**Zones**~~ Done in v0.3 (visuals). ~~Zone-specific hazards~~ done in v0.8 for Warp Run (ram packs, traffic and tunnels, chasms and wind, crystals, meteors).
- [ ] **Synthwave music that changes per zone.**
- [ ] **Speed pads in bends**: reward taking the inside line of a turn.
- [x] ~~**Zone boss at the end of each loop**~~ Done in v0.8 (the Warden, Warp Run).
- [ ] **A different boss per loop** (v0.8 has one boss that gets faster and angrier).
- [x] ~~**Near-miss bonus**~~ Done in v0.8 for Warp Run ("close calls"). Not in Classic.
- [ ] **Each run starts by loading in** the first world the way a world gate does (v0.9's effect), instead of it just being there.
- [ ] **Rail riding in Classic**: v0.9's rail overheat is Warp Run only, to keep Classic as it was.
- [ ] **Warp Run: more per-world set pieces**: a crystal cave, a canyon in the desert, a space station to fly through.
- [ ] **Warp Run: roadside markers** for your best distance and the next leaderboard rival.
- [ ] **Warp Run: more prototypes** (side guns, a drone wingman, a one-time revive).
- [ ] **Combo multiplier** for chaining kills without getting hit.
- [ ] **Boost pads** on the ground: a short speed surge with invulnerability.
- [ ] **Meta-progression**: earn credits per run and unlock speeder skins or starting upgrades. (v0.4's 3D speeder makes color skins easy: just swap the face colors.)
- [ ] **"Speeder position" setting** if some players still cover it with their thumb (`SHIP_AT`).
- [ ] **Synthwave music track** (generated in code, or a licensed loop).
- [ ] **Daily challenge seed**: everyone gets the same course that day.
- [ ] **More settings**: left-handed HUD, colorblind-friendly enemy colors. (Screen shake toggle done in v0.3.)
- [ ] **Leaderboard extras**: weekly board, rude-name filter. (Rank outside the top 50 shows on the game-over screen since v0.2.)
- [ ] **Run recap on the share card**: best moment, max multiplier, missiles kills.
- [ ] **Score ladder tuning**: should passing every player chime, or only top 10?
- [ ] **Stronger anti-cheat**: Firebase App Check, or a small server that replays and checks runs.
- [ ] More enemy types: a mine-layer that drops mines behind itself, a laser fence that sweeps across the track.

---

## Questions to Explore

> Things we're curious about but haven't investigated yet.

- [ ] Is relative drag the right feel, or would "speeder follows thumb with lag" be better? Playtest both.
- [ ] Should getting hit cost speed (current) or just hull?
- [ ] Are 3 hull points too forgiving or too harsh once speed climbs?
- [ ] Does the game need a "you're about to hit this" warning at very high speed?
- [ ] Is the outward push in bends (`DRIFT`) fun, or should it be weaker / a setting?
- [ ] Should Speeder get its own Firebase project eventually (instead of sharing ORBit's)?

---

## Someday / Maybe

> Bigger swings — possible future directions if the project grows.

- [ ] Ghost racing: race against your own best run.
- [ ] Two-player split-screen. (Async "beat my score" links done in v0.5.)
- [ ] Wrap as a native app store build (Capacitor) if it takes off.

---

## Deprioritized (decided against for now)

> Things we considered and consciously set aside — with a note on why.

| Idea | Why we set it aside |
|------|---------------------|
| A shoot or boost button | Adrian wants a single interaction; auto-fire keeps it one-thumb. |
| three.js / real 3D engine | Heavier on phones and adds a library; pseudo-3D canvas suits the look. Revisit if we need true 3D models. |
| Tilt-to-steer | iPhones require a motion permission prompt; drag chosen instead. |
