# Speeder

A neon hover-speeder run for your phone. Drag to steer. Your guns fire on their own.
Drive through a gate to take its power. v0.5

---

## Step 1 — Create the empty GitHub repo (1 minute)

GitHub blocked Claude from creating a public repo on your account, so this one step is yours.
After that, Claude can upload the files and switch on the web page for you.

1. Go to **https://github.com/new** (sign in as **AZ-build** if asked).
2. **Repository name:** `speeder`
3. Choose **Public**. Free GitHub Pages only works for public repos.
4. Leave everything else as it is. **Don't** tick "Add a README", so the repo starts empty.
5. Click **Create repository**.
6. Tell Claude "the repo is ready".

Claude then uploads the files, turns on GitHub Pages, and checks that the game is live at
**https://az-build.github.io/speeder/**.

> If you'd rather do the upload yourself: on the new repo page click **uploading an existing file**,
> drag in everything from `E:\Claude Projects\Speeder`, and click **Commit changes**. Then go to
> **Settings → Pages**, set **Branch** to `main` and `/ (root)`, and click **Save**.

---

## Step 2 — Let the leaderboard save scores (Firebase rules, 3 minutes)

> **Already set up, and just want to check or redo the rules?** `firestore-rules-FULL.txt` is the
> whole rules page exactly as it should look in Firebase today (ORBit + Speeder Classic + Warp Run).
> Select everything in the Firebase rules editor, paste that file over it, and click **Publish**.
> The steps below are the piece-by-piece history.

The world leaderboard lives in your **ORBit** Firebase project, in its own list called
`speeder_scores`. Until you add the rule below, the board may load but scores won't save.

1. Go to **https://console.firebase.google.com** and open the project **orbit-23921**.
2. In the left menu, click **Firestore Database**, then the **Rules** tab at the top.
3. Find the line `match /databases/{database}/documents {`.
4. Click at the end of that line and press Enter to make an empty line under it.
5. Open `firestore-rules-speeder.txt` from this folder, copy everything, and paste it into that empty line.
6. Click **Publish**.

**Don't delete anything that's already in the rules.** That's what keeps ORBit's leaderboard working.
If the editor shows a red error after pasting, the block probably landed outside the
`match /databases/...` braces. Undo with Ctrl+Z and try again, or paste a screenshot to Claude.

What the rule does: anyone can read the board. Every run is its own entry, so one player can
hold several spots. Names are limited to 12 characters, and scores have to look like a real run.
It can't stop a determined cheater (no browser game can), but it blocks the easy tricks.

### Updating the rule for v0.5 (2 minutes)

v0.5 adds missiles and more kills, so the old "does this score look real?" check can be
too strict for great runs. To update it:

1. Open **Firestore Database → Rules** in the **orbit-23921** project, as above.
2. Find the Speeder block. It starts with `// ---- Speeder leaderboard` and ends with the `}`
   just after `&& d.ts == request.time;` and its own `}`.
3. Select that whole block and delete it. Don't touch anything above or below it.
4. Paste the new block from `firestore-rules-speeder.txt` in the same spot, and click **Publish**.

Until you do this, almost every score still saves. Only very high multiplier runs get turned down.

### Adding the Warp Run leaderboard (v0.8, 2 minutes)

Warp Run keeps its scores in a second list, `speeder_warp_scores`, so they never mix with
Classic's. That list needs its own rule. Nothing about the Classic rule changes.

1. Open **Firestore Database → Rules** in the **orbit-23921** project, as above.
2. Find the line `match /databases/{database}/documents {`.
3. Click at the end of that line and press Enter to make an empty line under it.
4. Open `firestore-rules-warp.txt` from this folder, copy everything, and paste it into that empty line.
5. Click **Publish**.

Until you do this, the Warp Run leaderboard says it isn't switched on yet. Scores are kept on
each phone and upload by themselves once the rule is in (your 5 best).

---

## Install it on your phone (after Step 1)

- **iPhone (Safari):** open https://az-build.github.io/speeder/, tap **Share** (the square with
  an up arrow), then **Add to Home Screen**.
- **Android (Chrome):** open the link and tap **Install app** on the title screen (or use the
  ⋮ menu, then **Install app**).

It then opens full screen from your home screen and works offline. The world leaderboard
needs a connection, but scores you set while offline upload later.

### Updating it later

1. Upload the changed files to the repo (Claude can do this for you).
2. In `sw.js`, change the version in the `CACHE` line (for example `speeder-v0.2.0` to
   `speeder-v0.3.0`) so phones download the new version.
3. On your phone, close the app and open it again (sometimes twice).

---

## Play it on your computer

Double-click `index.html`. Arrow keys (or A/D) steer, Esc or P pauses. The world leaderboard
only works from the hosted web address, not from a file on your computer.

---

## How to play

| | |
|---|---|
| **Steer** | Put your thumb down anywhere and slide left or right |
| **Shoot** | Automatic. Line up with an enemy to hit it |
| **Hull** | Pink hexes, top left. 3 hits and you're wrecked |
| **Gates** | Come in pairs. The two labels under your speeder show both choices early |
| **Pause** | The ❚❚ button, top right. Opens Leaderboard and Settings too |

**Modes:** pick **WARP RUN** or **CLASSIC** on the title screen. Warp Run has five worlds with their
own hazards, a world gate between each (you can see the next world through it), a boss after the fifth, and loops that get faster and
multiply your score. Classic is the original endless run. Each has its own leaderboard.
The How to play page in the game explains everything in Warp Run.

**The Lab:** the lime **THE LAB** button on the title screen opens a test mode where new ideas
are tried out (a jump you can do anywhere; sky ramps with rings to fly through). It can also
start a run on a later loop, fully loaded, for testing at speed. Lab runs don't count on any leaderboard,
and each one ends by asking for a thumbs up or down. To send someone straight there, share
https://az-build.github.io/speeder/?lab. How it works and how to add an experiment: `LAB.md`.

**Power-ups:** SHIELD (blocks a hit) · GUNS+ (8 levels: more guns up to level 4, then piercing
bullets, wing missiles, heavy rounds and max power) · RAPID (fires faster for 12s) · REPAIR (+1 hull) ·
MISSILES (8 homing missiles hunt down enemies and mines ahead) · 2X SCORE (15s; taking another
while it's running resets the timer)

**Moving obstacles:** sliding pylons (a glowing groove shows how far they travel), swaying lines
of mines, and red laser fences whose gap slides from side to side. Bullets pass through lasers.

**Sharing:** after a run, tap **Share & challenge** to send a score picture and a link. Friends
who open the link get your score as a target to beat.

**Enemies:** red drones hover ahead and shoot (some swoop in from behind you) · turrets on the
ground fire as you approach · ram bikes charge straight at you. Orange mines can be shot.
Purple pylons and pink walls can't be shot, so dodge them.

**Settings:** sound, volume, music, engine hum, vibration (Android), steering speed, leaderboard name.
