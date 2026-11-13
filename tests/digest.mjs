// Plays a fixed, seeded run in each main mode and prints a fingerprint of the game state.
// Run it against the old and the new index.html: identical output = the mode plays identically.
import { open } from './lib.mjs';
const dir = process.argv[2] || process.cwd();
const out = {};
for (const [mode, secs] of [['classic', 120], ['warp', 300]]) {
  const { browser, page, errors } = await open(dir);
  out[mode] = await page.evaluate(([mode, secs]) => {
    const S = window.SPEEDER, rows = [];
    window.__seed(42); S.setMode(mode); S.startGame();
    for (let i = 0; i < secs * 60; i++) {
      S.G.invuln = 999;
      S.player.tx = 3.4 * Math.sin(i * 0.013) + 1.5 * Math.sin(i * 0.031);
      S.step(1 / 60, 1);
      if (i % 4 === 0) S.render();
      if (i % 300 === 299) {
        let h = 0;
        for (const o of S.objs) h += o.x * 3.1 + o.d * 0.001 + o.w;
        for (const e of S.enemies) h += e.x * 1.7 + e.d * 0.002 + (e.hp === Infinity ? 0 : e.hp);
        rows.push([S.G.d.toFixed(4), S.G.score.toFixed(3), S.G.kills, S.G.hull, S.G.shield, S.G.weapon, S.objs.length, S.enemies.length, S.gates.length, S.WP.sec, S.WP.loop, S.WP.od.toFixed(3), S.player.x.toFixed(5), S.player.y.toFixed(5), h.toFixed(4), S.stats.jumps, S.stats.air].join(','));
      }
    }
    return rows;
  }, [mode, secs]);
  if (errors.length) out[mode + '_errors'] = errors;
  await browser.close();
}
console.log(JSON.stringify(out, null, 1));
