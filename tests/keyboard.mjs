// The name boxes stay visible above a phone keyboard (v0.17.3). A pretend keyboard shrinks the
// visible area (visualViewport) to 420 of 844 points; the focused box must sit inside it.
// Usage: node tests/keyboard.mjs "$PWD"
let chromium;
try { ({ chromium } = await import('playwright')); }
catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }
const dir = process.argv[2];
const launch = { args: ['--no-sandbox', '--allow-file-access-from-files'] };
try { (await import('node:fs')).accessSync('/usr/bin/google-chrome'); launch.executablePath = '/usr/bin/google-chrome'; } catch (e) {}
const browser = await chromium.launch(launch);
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => {
  const vv = new EventTarget();
  vv.height = 844; vv.width = 390; vv.offsetTop = 0; vv.offsetLeft = 0; vv.scale = 1;
  Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true });
  window.__kb = (h) => { vv.height = 844 - h; vv.dispatchEvent(new Event('resize')); };
});
await page.goto('file://' + dir + '/index.html?dev');
await page.waitForFunction(() => !!window.SPEEDER);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
async function check(name, id) {
  await page.evaluate((id) => { document.getElementById(id).focus(); window.__kb(424); }, id);
  await wait(200);
  const r = await page.evaluate((id) => { const b = document.getElementById(id).getBoundingClientRect(); return { top: b.top, bottom: b.bottom }; }, id);
  out.push([name + ' visible above the keyboard (box ' + Math.round(r.top) + '-' + Math.round(r.bottom) + ', keyboard from 420)', r.top >= 0 && r.bottom <= 420]);
  await page.screenshot({ path: '/tmp/kb-' + id + '.png' });
  await page.evaluate((id) => { document.getElementById(id).blur(); window.__kb(0); }, id);
  await wait(200);
  const h = await page.evaluate((id) => document.getElementById(id).closest('.overlay').style.height, id);
  out.push([name + ' panel back to full height after typing', h === '']);
}
await page.evaluate(() => window.SPEEDER.openPanel('settings'));
await wait(300);
await check('Settings name', 'setName');
await page.evaluate(() => { const S = window.SPEEDER; S.closePanels && S.closePanels(); S.setMode('warp'); S.startGame(); S.die(); });
await wait(2500);
await page.evaluate(() => { const o = document.getElementById('over'); o.classList.remove('hidden'); document.getElementById('nameInput').closest('.hidden')?.classList.remove('hidden'); });
await check('Game-over name', 'nameInput');
for (const [n, ok] of out) console.log((ok ? 'PASS ' : 'FAIL ') + n);
await browser.close();
if (out.some(([, ok]) => !ok) || errors.length) { console.log('FAILED', JSON.stringify(errors)); process.exit(1); } else console.log('ALL PASSED');
