# To-Do — Speeder

Active checklist for current work. This file lives in the present tense — what are we
actually working on right now?

> Update this at the end of every session. Move finished items to CHANGELOG.md, not just
> mark them done here.

---

## 🔨 This Session

- [x] v0.5.0: sharing, top-runs board, celebrations, missiles, gun levels 5-8, moving obstacles, helper text below the speeder
- [x] v0.5.1: 2X no longer stacks; speeder banks hard on quick turns
- [x] v0.5.2: How to play page
- [x] Adrian updated the Firebase rules to the v0.5 version
- [ ] **Adrian:** collect friends' feedback (Share & challenge, moving obstacles, missiles, banking)
- [x] v0.8.0: Classic and Warp Run modes; five worlds with their own hazards; warp gates; the Warden boss; loops; power cells, OVERDRIVE, close calls, prototypes; mode analytics
- [x] **Adrian:** Warp Run leaderboard rules published (2026-11-10); `firestore-rules-FULL.txt` is the whole page
- [x] Warp Run scores save to the world board (Adrian's two test runs showed up, 2026-11-10)
- [x] **Adrian:** played Warp Run and gave notes (2026-11-10)
- [x] v0.9.0: world gates you see through and worlds that load in; 40-second worlds; three-stage Warden; cells stay on the road; fairer slalom and lasers at top speed; laser pass-through fix; rail overheat; city buildings and roadside details; Warp board reset
- [x] v0.10.0: the Lab (test mode with switches, no leaderboard, votes) and its first experiment, JUMP
- [x] v0.11.0: bigger jump, SKY RAMPS experiment (ramps with rings), test setup (starting loop, fully loaded)
- [x] v0.12.0: HYPERLANE experiment (zero-g tunnel between worlds, two flying styles), "Start in a hyperlane" test setup
- [ ] **Adrian:** play the HYPERLANE (v0.12) on a phone: switch on "Start in a hyperlane" to try it at once. Both flying styles; is 16 s the right length; too much or too little in it; does up/down steering feel natural with one thumb?
- [ ] **Adrian:** play v0.11 in the Lab on a phone, starting on loop 3 and fully loaded: the bigger jump (both gestures, both fuel settings) and the sky ramps (questions listed in LAB.md)
- [ ] **Adrian:** send friends the Lab link (https://az-build.github.io/speeder/?lab) and watch the `lab/vote/...` numbers on the analytics dashboard
- [ ] **Adrian:** play v0.9 and say how these feel: the gates, the boss, 40 s per world, the rail limit
- [ ] **Adrian (optional):** delete the two v0.8 test entries in the Firebase console (they're already hidden from the board)
- [ ] Check v0.9's frame rate on a real mid-range phone (new buildings and roadside props)

---

## ⏭️ Next Up

- [ ] Tune feel from playtest notes (steering speed default, speed curve, spawn spacing)
- [ ] Tune Warp Run from Adrian's v0.9 playtest (`W_WORLD_T`, `BOSS_TOUGH`, `BOSS_PACE`, `RAIL_HOT_T`, slalom and laser spacing)
- [ ] Tune or settle JUMP from Adrian's playtest (pick a gesture, pick charges or unlimited, or retire it)
- [ ] Tune SKY RAMPS from Adrian's playtest (flight size, ring spacing, how often)
- [ ] Next Lab experiment: new roads or forks (recipe in LAB.md)
- [ ] Decide the next big feature: a second boss, music per world, or more set pieces (see BACKLOG)
- [ ] Name filter for rude leaderboard names

---

## ⏳ Blocked / Waiting On

| Task | Blocked by | Who/What |
|------|------------|----------|
| Score rebalance toward distance | Decision: leave as is until feedback | Adrian |
| Difficulty tuning | Real playtest on a phone | Adrian |

---

## ✅ Done This Week

Quick wins to remember before the changelog entry.

- Concept defined, project set up
- First playable prototype (v0.1) with enemies, obstacles, paired power-up gates, sound, PWA install
- v0.2: pause menu, settings, world leaderboard
- v0.3: curving track with hills, roadside scenery, 5 zones, visual polish, graphics setting
- v0.4: new speeder model, camera moved up
- v0.5: sharing, top-runs board, missiles, moving obstacles
