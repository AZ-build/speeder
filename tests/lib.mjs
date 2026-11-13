// Shared by the tests: opens the game in headless Chrome as a phone.
// "deterministic" (the default) seeds Math.random and stops the game's own frame loop, so the
// test drives every frame itself and two runs of the same build give the same result.
let chromium;
try { ({ chromium } = await import('playwright')); }
catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }

export async function open(dir, opts = {}) {
  const launch = { args: ['--no-sandbox', '--allow-file-access-from-files'] };
  const exe = process.env.CHROME_PATH || '/usr/bin/google-chrome';
  try { (await import('node:fs')).accessSync(exe); launch.executablePath = exe; } catch (e) { /* use Playwright's own browser */ }
  const browser = await chromium.launch(launch);
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 390, height: 844 }, deviceScaleFactor: opts.dpr || 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  if (opts.deterministic !== false) {
    await page.addInitScript(() => {
      let s = 123456789;
      Math.random = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
      window.__seed = (n) => { s = n; };
      window.requestAnimationFrame = () => 0;   // the test drives the game itself
    });
  }
  await page.goto('file://' + dir + '/index.html' + (opts.query || ''));
  await page.waitForFunction(() => !!window.SPEEDER);
  return { browser, page, errors };
}
