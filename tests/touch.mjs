// Steering with more than one finger (v0.17.1): a resting or creeping finger never steers; a quick slide takes over.
// Usage: node tests/touch.mjs "$PWD"
import { open } from './lib.mjs';
const dir = process.argv[2];
const { browser, page, errors } = await open(dir, { query: '?dev' });
await page.evaluate(() => { const S = window.SPEEDER; S.setMode('warp'); S.startGame(); S.G.invuln = 1e9; S.step(1/60, 30); });
const ev = (type, id, x, primary) => page.evaluate(([type, id, x, primary]) => {
  window.dispatchEvent(new PointerEvent(type, { pointerId: id, clientX: x, clientY: 600, isPrimary: primary, pointerType: 'touch', bubbles: true }));
}, [type, id, x, primary]);
const tx = () => page.evaluate(() => +window.SPEEDER.player.tx.toFixed(3));
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const out = [];
// 1. thumb steers
await ev('pointerdown', 1, 200, true); let a = await tx();
for (let i = 1; i <= 5; i++) { await ev('pointermove', 1, 200 + i * 10, true); await wait(16); }
out.push(['thumb swipe steers', (await tx()) - a > 0.5]);
// 2. palm lands and creeps 40 px slowly while the thumb rests
await ev('pointerdown', 2, 380, false); a = await tx();
for (let i = 1; i <= 40; i++) { await ev('pointermove', 2, 380 - i, false); await wait(60); }
out.push(['creeping palm does not steer', (await tx()) === a]);
// 3. thumb lifts; palm keeps creeping
await ev('pointerup', 1, 250, true); a = await tx();
for (let i = 1; i <= 30; i++) { await ev('pointermove', 2, 340 - i, false); await wait(60); }
out.push(['after thumb lifts, creeping palm does not steer', (await tx()) === a]);
// 4. that finger slides on purpose: it takes over
a = await tx();
for (let i = 1; i <= 6; i++) { await ev('pointermove', 2, 310 - i * 8, false); await wait(16); }
out.push(['deliberate slide takes over', a - (await tx()) > 0.3]);
// 5. a second thumb swiping quickly takes over from the first
await ev('pointerdown', 3, 100, false); a = await tx();
for (let i = 1; i <= 6; i++) { await ev('pointermove', 3, 100 + i * 8, false); await wait(16); }
out.push(['second thumb swipe takes over', (await tx()) - a > 0.3]);
for (const [n, ok] of out) console.log((ok ? 'PASS ' : 'FAIL ') + n);
console.log('errors', JSON.stringify(errors));
await browser.close();
if (out.some(([, ok]) => !ok) || errors.length) { console.log("FAILED"); process.exit(1); } else console.log("ALL PASSED");
