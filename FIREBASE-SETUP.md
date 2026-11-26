# Firebase steps for launch (prepared in v0.17.0)

Two jobs only Adrian can do, about 10 minutes in total. Everything in the game is already built
for them and switched off until then. Do Part 1 first.

**Before you start, decide one thing and tell Claude:** the new project starts with empty
leaderboards. Either start fresh ("Season 1", a clean slate for the public launch), or have Claude
carry the current scores over (one extra step later).

---

## Part 1: Speeder's own project (about 5 minutes)

Why: today Speeder shares ORBit's free Firebase plan. A busy day for Speeder could use up the
daily allowance and break both games' leaderboards until midnight (Pacific).

1. Go to **console.firebase.google.com** and click **Create a project**.
2. Name it **speeder**. Turn **off** Google Analytics. Click **Create project**, then **Continue**.
3. On the left: **Build → Firestore Database → Create database**.
   Pick the location **nam5 (United States)**, then **Start in production mode → Create**.
4. Open the **Rules** tab. Delete everything there, paste the whole of
   `firestore-rules-own-project.txt`, and click **Publish**.
5. Click the **gear icon (top left) → Project settings**. Under "Your apps", click the **`</>`** (web) icon.
   Nickname: **Speeder**. Leave "Firebase Hosting" unticked. Click **Register app**.
6. Copy the block that starts with `const firebaseConfig = {` and send it to Claude.
   (It's safe to share: it's the same kind of public key the game already shows.)

Claude then switches the game over and publishes.

## Part 2: App Check (about 5 minutes)

Why: it makes the database accept scores only from the real game on speeder-game.com, so nobody can
post a made-up score with a script.

1. Go to **google.com/recaptcha/admin/create**.
   - Label: **speeder**
   - Type: **Score based (v3)**
   - Domains: **speeder-game.com**
   - Click **Submit**. You get a **site key** and a **secret key**.
2. Back in Firebase (the new speeder project): **Build → App Check → Apps**. Click the Speeder web
   app, choose **reCAPTCHA**, paste the **secret key**, and click **Save**.
3. Send Claude the **site key** only. **Never share the secret key.**
4. Claude publishes. Then play one run on your phone and tell Claude it went fine.
5. Last switch (only after step 4): **App Check → APIs → Cloud Firestore → Enforce → Confirm**.
   Enforcing before the game sends App Check would block everyone's scores.

---

## Feedback setup (v0.19.0, about 5 minutes)

Players can send you notes from the game (title screen → **Ideas**, or **Send feedback**
after a run). They're saved in Firebase, and only you can read them, on the stats page. These three
steps let the stats page know it's you. Do them in the project the game uses today
(**orbit-23921**, ORBit's); if you do Part 1 later, repeat steps 1 and 2 there (its rules already
have the Feedback block, just put your ID in).

1. **Turn on Google sign-in.** console.firebase.google.com → the **orbit-23921** project →
   **Build → Authentication** (click **Get started** if you see it) → **Sign-in method** tab →
   **Add new provider → Google** → switch **Enable** on, pick your email as the support email →
   **Save**.
2. **Let the stats page use it.** Still in Authentication: **Settings** tab → **Authorized
   domains** → **Add domain** → type `speeder-game.com` → **Add**.
3. **Tell the rules it's you.** Open https://speeder-game.com/stats/ → the **Feedback** card at the
   top → **Sign in with Google** and pick your account. It will say the rules don't know you yet
   and show your ID. Tap **Copy the rules block** (it has your ID in it). Then in the Firebase
   console: **Firestore Database → Rules** tab. Find the last two lines of the rules (two closing
   `}` braces). Paste the block on a new line **just above** them, and click **Publish**.
   Reload the stats page: the notes appear. (The block is also in `firestore-rules-feedback.txt`
   on GitHub, with `ADMIN_UID` where your ID goes.)

From then on: **Mark done** moves a note to the Done tab (**Reopen** brings it back), **Delete**
(tap twice) removes it for good.

Until step 3 is done, players who send a note see "Couldn't send it right now (not set up yet)",
so do these before telling people about it.

---

## What's already done (no Firebase needed)

- The console cheat no longer works: the game's insides can't be reached from the browser console,
  and the test shortcuts (`window.SPEEDER`) only exist with `?dev` on the address. Runs played with
  `?dev` never reach a world board.
- Every run is checked before upload (real time vs game time, distance vs top speed, score vs
  distance and kills). Runs that fail stay on the device only.
- Rude names are refused when typed and shown as PILOT on the boards.
- `moderation.txt` hides any board entry (or everything from one device) without touching Firebase.
  The stats page has a "Check the boards" table with flags and Copy ID buttons.
- Fewer database reads, and if the daily allowance ever runs out, the game rests for an hour and
  shows saved boards instead of failing over and over.
