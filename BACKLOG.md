# Backlog — Speeder

A parking lot for ideas, features, and questions we want to revisit, but aren't working
on right now. Add anything here so it doesn't get lost.

---

## Feature Ideas

> Things we might build someday. No commitment yet.

- [x] ~~**Track curves and hills**~~ Done in v0.3.
- [x] ~~**Zones**~~ Done in v0.3 (visuals). Still open: zone-specific hazards (e.g. falling rocks in Sky Islands, crystal shards in Crystal Wastes).
- [ ] **Synthwave music that changes per zone.**
- [ ] **Speed pads in bends**: reward taking the inside line of a turn.
- [ ] **Zone boss at the end of each loop** (after Cosmic Highway).
- [ ] **Boss encounters** every few zones: a big carrier drone you have to line up shots on while dodging.
- [ ] **Near-miss bonus**: passing close to a pylon gives points and a "WHOOSH". Rewards risky lines.
- [ ] **Combo multiplier** for chaining kills without getting hit.
- [ ] **Boost pads** on the ground: a short speed surge with invulnerability.
- [ ] **Meta-progression**: earn credits per run and unlock speeder skins or starting upgrades. (v0.4's 3D speeder makes color skins easy: just swap the face colors.)
- [ ] **"Speeder position" setting** if some players still cover it with their thumb (`SHIP_AT`).
- [ ] **Synthwave music track** (generated in code, or a licensed loop).
- [ ] **Daily challenge seed**: everyone gets the same course that day.
- [ ] **More settings**: left-handed HUD, colorblind-friendly enemy colors. (Screen shake toggle done in v0.3.)
- [ ] **Leaderboard extras**: weekly board, show your rank even outside the top 25, rude-name filter.
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
- [ ] Two-player split-screen or async "beat my score" share links.
- [ ] Wrap as a native app store build (Capacitor) if it takes off.

---

## Deprioritized (decided against for now)

> Things we considered and consciously set aside — with a note on why.

| Idea | Why we set it aside |
|------|---------------------|
| A shoot or boost button | Adrian wants a single interaction; auto-fire keeps it one-thumb. |
| three.js / real 3D engine | Heavier on phones and adds a library; pseudo-3D canvas suits the look. Revisit if we need true 3D models. |
| Tilt-to-steer | iPhones require a motion permission prompt; drag chosen instead. |
