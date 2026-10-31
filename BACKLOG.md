# Backlog — Speeder

A parking lot for ideas, features, and questions we want to revisit, but aren't working
on right now. Add anything here so it doesn't get lost.

---

## Feature Ideas

> Things we might build someday. No commitment yet.

- [ ] **Track curves and hills** (Out Run-style). The biggest single boost to the sense of speed and place.
- [ ] **Zones**: the world changes every ~2 km (synthwave grid → neon city → ice canyon) with new colors and hazards.
- [ ] **Boss encounters** every few zones: a big carrier drone you have to line up shots on while dodging.
- [ ] **Near-miss bonus**: passing close to a pylon gives points and a "WHOOSH". Rewards risky lines.
- [ ] **Combo multiplier** for chaining kills without getting hit.
- [ ] **Boost pads** on the ground: a short speed surge with invulnerability.
- [ ] **Meta-progression**: earn credits per run and unlock speeder skins or starting upgrades.
- [ ] **Synthwave music track** (generated in code, or a licensed loop).
- [ ] **Daily challenge seed**: everyone gets the same course that day.
- [ ] **More settings**: reduce screen shake, left-handed HUD, colorblind-friendly enemy colors.
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
