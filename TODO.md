# To-Do — Speeder

Active checklist for current work. This file lives in the present tense — what are we
actually working on right now?

> Update this at the end of every session. Move finished items to CHANGELOG.md, not just
> mark them done here.

---

## 🔨 This Session

- [x] **Adrian:** create the empty repo `AZ-build/speeder` on GitHub
- [x] **Claude:** upload the files (pushed v0.2 to `main`)
- [ ] **Adrian:** turn on GitHub Pages (Settings → Pages → Branch `main`, `/ (root)` → Save). Claude can't switch it on from here.
- [ ] **Adrian:** add the Speeder block to ORBit's Firebase rules (README, step 2), or the world leaderboard can't save scores
- [ ] **Adrian:** play on your phone and note how steering, speed and difficulty feel

---

## ⏭️ Next Up

- [ ] Tune feel from playtest notes (steering speed default, speed curve, spawn spacing)
- [ ] Decide the next big feature: track curves vs. zones vs. a boss (see BACKLOG)
- [ ] Name filter for rude leaderboard names

---

## ⏳ Blocked / Waiting On

| Task | Blocked by | Who/What |
|------|------------|----------|
| Going live on GitHub Pages | Pages switch in repo Settings | Adrian (Claude can't change repo settings from here) |
| World leaderboard saving scores | Firebase rules for `speeder_scores` | Adrian, in the Firebase console |
| Difficulty tuning | Real playtest on a phone | Adrian |

---

## ✅ Done This Week

Quick wins to remember before the changelog entry.

- Concept defined, project set up
- First playable prototype (v0.1) with enemies, obstacles, paired power-up gates, sound, PWA install
- v0.2: pause menu, settings, world leaderboard
