// A bot plays a long Lab run (jumping constantly, through world gates, hyperlanes and the boss),
// then a short run on the real frame loop. Any script error fails it.
import { open } from './lib.mjs';
const dir = process.argv[2] || process.cwd();
for (const [gesture, fuel, loop, feel] of [['flick', 'charges', 1, 'roll'], ['tap', 'free', 1, 'bank'], ['flick', 'charges', 4, 'roll']]) {
  const { browser, page, errors } = await open(dir);
  const r = await page.evaluate(([gesture, fuel, loop, feel]) => {
    const S = window.SPEEDER;
    window.__seed(7);
    S.labSet('jump', 'gesture', gesture); S.labSet('jump', 'fuel', fuel); S.labSet('jump', 'on', true); S.labSet('ramps', 'on', true); S.labSet('lane', 'on', true); S.labSet('lane', 'feel', feel);
    S.labSet('setup', 'loop', loop); S.labSet('setup', 'loaded', loop > 1);
    S.setMode('lab'); S.startGame();
    let hits = 0;
    for (let i = 0; i < 300 * 60; i++) {
      S.G.invuln = i % 600 < 300 ? 999 : Math.min(S.G.invuln, 1);   // half the time it can be hit, so the damage paths run too
      if (S.G.hull < 3) { S.G.hull = 3; hits++; }
      S.player.tx = 3.4 * Math.sin(i * 0.013) + 1.5 * Math.sin(i * 0.031);
      const ramp = S.objs.find((o) => o.mega && o.d > S.G.d && o.d - S.G.d < 120);
      if (ramp && i % 1200 < 800) S.player.tx = ramp.x;           // most of the time it goes for a sky ramp
      if (S.player.mega && S.SKY.cur) { const nx = S.SKY.cur.ramp.rings.find((q) => !q.done); if (nx && i % 2400 < 1500) S.player.tx = nx.x; }
      if (S.LANE.on) {
        // in a hyperlane: swoop around (fast enough for the odd barrel roll), or chase the next ring
        const L = S.LANE, nx = L.objs.find((q) => q.type === 'ring' && !q.done && q.d > L.d);
        if (nx && i % 900 < 500) { L.tx = nx.x; L.ty = nx.y; }
        else { L.tx = 2.4 * Math.sin(i * 0.05) * (i % 300 < 20 ? 1.6 : 1); L.ty = 2 * Math.cos(i * 0.037); }
      }
      if (i % 37 === 0) S.tryHop('key');
      if (i % 90 === 0) S.nearMiss();
      S.step(1 / 60, 1);
      if (i % 3 === 0) S.render();
      if (S.G.state !== 'play') break;
    }
    return { state: S.G.state, km: (S.G.d * 1.4 / 1000).toFixed(1), sec: S.WP.sec, loop: S.WP.loop, bosses: S.WP.bossKills, hops: S.JUMP.hops, n: S.JUMP.n, hits, ramps: S.SKY.offered, flights: S.SKY.flights, rings: S.SKY.rings, perfect: S.SKY.perfect,
      lanes: S.LANE.runs, laneRings: S.LANE.rings + '/' + S.LANE.ringsSeen, laneHits: S.LANE.hits, rolls: S.LANE.rolls, orbs: S.LANE.orbs };
  }, [gesture, fuel, loop, feel]);
  console.log(gesture, fuel, feel, 'start loop ' + loop, JSON.stringify(r), errors.length ? 'ERRORS ' + JSON.stringify(errors) : 'no errors');
  await browser.close();
}
{
  const { browser, page, errors } = await open(dir, { deterministic: false });
  await page.tap('#titleLabBtn'); await page.tap('#labRide');
  await page.waitForTimeout(1500);
  await page.touchscreen.tap(200, 600);
  await page.keyboard.press('Space');
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => ({ state: SPEEDER.G.state, d: Math.round(SPEEDER.G.d), hops: SPEEDER.JUMP.hops, lab: SPEEDER.LAB.on }));
  console.log('real frame loop', JSON.stringify(r), errors.length ? 'ERRORS ' + JSON.stringify(errors) : 'no errors');
  await browser.close();
}
