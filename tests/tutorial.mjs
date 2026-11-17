// Flight School: does every step still work? An autopilot plays the whole tutorial on a phone
// screen and checks each practice step finishes, every card can light up what it explains, the
// first-time offer shows, and finishing starts a real Warp Run. Usage: node tests/tutorial.mjs "$PWD"
import { open } from './lib.mjs';

const dir = process.argv[2] || process.cwd();
const { browser, page, errors } = await open(dir);
let fails = 0;
const check = (ok, name, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); if (!ok) fails++; };

await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));
check(await page.evaluate(() => !document.getElementById('tutOffer').classList.contains('hidden')), 'first-time offer shows on a new device');
await page.evaluate(() => document.getElementById('tutOfferGo').click());
check(await page.evaluate(() => TUT.on && TUT.cur.id === 'welcome' && paused), 'Start Flight School opens the first card, game frozen');

const n = await page.evaluate(() => TUT_STEPS.length);
const noSpot = new Set(['welcome', 'powers', 'modes', 'extras', 'ready']);
for (let i = 0; i < n; i++) {
  const r = await page.evaluate(() => {
    render(); tutLayout();
    const st = TUT.cur, out = { id: st.id, spot: !document.getElementById('tutSpot').classList.contains('hidden') };
    if (!st.goal) return out;
    tutPrimary();                         // "Try it"
    const dt = 1 / 60;
    let t = 0;
    const steer = () => {
      const id = st.id;
      const next = (list) => (list || []).filter((o) => !o.dead && o.d > G.d - 1).sort((a, b) => a.d - b.d)[0];
      if (id === 'steer' || id === 'overdrive') { const c = next(cells); return c ? c.x : 0; }
      if (id === 'aim') { const e = enemies.find((q) => !q.dead); return e ? e.x : 0; }
      if (id === 'warden') return WP.boss ? WP.boss.x : 0;
      if (id === 'edge') { const o = next(TUT.s.list); return o ? (o.x < 0 ? 5.3 : -5.3) : 0; }
      if (id === 'rail') return 5.3;
      if (id === 'gatepair' || id === 'proto') { const g = gates.find((q) => !q.pair.resolved); return g ? g.x : 0; }
      if (id === 'ramps' || id === 'close') return 0;
      let best = 0, bestScore = -1e9;          // otherwise: the clearest lane just ahead
      for (let x = -4.8; x <= 4.8; x += 0.4) {
        let sc = -Math.abs(x - player.x) * 0.05;
        for (const o of objs.concat(enemies)) {
          if (o.dead || o.type === 'portal' || o.type === 'ramp' || o.type === 'gap') continue;
          const rel = o.d - G.d;
          if (rel < -1 || rel > 45) continue;
          const gap = Math.abs(o.x - x) - (o.w || 1) / 2;
          if (gap < 0.6) sc -= (2 - gap) * (50 - rel);
        }
        if (sc > bestScore) { bestScore = sc; best = x; }
      }
      return best;
    };
    while (TUT.mode === 'play' && t < 90) {
      player.tx = clamp(steer(), -5.3, 5.3);
      update(dt); render(); tutFrame(dt); t += dt;
    }
    return Object.assign(out, { done: TUT.mode === 'done', secs: +t.toFixed(1), tries: TUT.tries });
  });
  if (r.done !== undefined) check(r.done && r.secs < 40, 'practice "' + r.id + '" can be finished', r);
  if (!noSpot.has(r.id)) check(r.spot, 'card "' + r.id + '" lights up what it explains');
  if (i < n - 1) await page.evaluate(() => tutPrimary());
}
check(await page.evaluate(() => WP.loop === 2), 'the tutorial ends in loop 2');
await page.evaluate(() => tutPrimary());   // "Ride Warp Run"
const after = await page.evaluate(() => ({ tut: TUT.on, state: G.state, mode: G.mode, saved: localStorage.getItem('speeder.tutDone') }));
check(!after.tut && after.state === 'play' && after.mode === 'warp' && after.saved === '1', 'finishing starts a real Warp Run and remembers it', after);
check(errors.length === 0, 'no page errors', errors);
await browser.close();
console.log(fails ? '\n' + fails + ' FAILED' : '\nALL PASSED');
process.exit(fails ? 1 : 0);
