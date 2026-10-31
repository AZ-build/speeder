# Speeder

A neon hover-speeder run for your phone. Drag to steer. Your guns fire on their own.
Drive through a gate to take its power. v0.2

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

What the rule does: anyone can read the board. Each player has one entry, which can only go
up. Names are limited to 12 characters, and scores have to look like a real run. It can't stop
a determined cheater (no browser game can), but it blocks the easy tricks.

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
| **Gates** | Come in pairs. The banner at the top shows both choices early |
| **Pause** | The ❚❚ button, top right. Opens Leaderboard and Settings too |

**Power-ups:** SHIELD (blocks a hit) · GUNS+ (more guns, up to 4 levels) · RAPID (fires faster for 12s) ·
REPAIR (+1 hull) · NOVA (destroys every enemy and mine on screen) · 2X SCORE (15s)

**Enemies:** red drones hover ahead and shoot (some swoop in from behind you) · turrets on the
ground fire as you approach · ram bikes charge straight at you. Orange mines can be shot.
Purple pylons and pink walls can't be shot, so dodge them.

**Settings:** sound, volume, engine hum, vibration (Android), steering speed, leaderboard name.
