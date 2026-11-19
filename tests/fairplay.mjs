// v0.17.0 checks: anti-cheat, name filter, hide list. Serves the game at a pretend web address
// (https://speeder-game.test/) so it behaves like the live site (no test tools), with a stand-in
// for the Firebase library that keeps scores in the page.
// Usage: node tests/fairplay.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'https://speeder-game.test/';
const results = [];
const ok = (name, cond, extra) => { results.push([cond ? 'PASS' : 'FAIL', name, extra || '']); };

// A stand-in for firebase-app.js and firebase-firestore-lite.js. Rows live in window.__FS.
const FAKE_APP = 'export function initializeApp(c, n) { return { c, n }; }';
const FAKE_FS = `
const W = window;
W.__FS = W.__FS || { speeder_scores: {}, speeder_warp_scores: {}, writes: [] };
export function getFirestore() { return {}; }
export function collection(db, name) { return { name }; }
export function doc(db, name, id) { return { name, id }; }
export function orderBy() { return null; }
export function limit(n) { return { limit: n }; }
export function where(f, op, v) { return { gt: v }; }
export function query(c, ...parts) { const q = { name: c.name }; for (const p of parts) if (p) Object.assign(q, p); return q; }
export function serverTimestamp() { return 'TS'; }
export async function setDoc(ref, data) { W.__FS.writes.push({ col: ref.name, id: ref.id, data }); W.__FS[ref.name][ref.id] = data; }
function rows(q) { return Object.entries(W.__FS[q.name]).map(([id, d]) => ({ id, d })).sort((a, b) => b.d.score - a.d.score); }
export async function getDocs(q) { W.__FS.reads = (W.__FS.reads || 0) + 1; W.__FS.lastLimit = q.limit; return { docs: rows(q).slice(0, q.limit || 999).map((r) => ({ id: r.id, data: () => r.d })) }; }
export async function getCount(q) { return { data: () => ({ count: rows(q).filter((r) => r.d.score > q.gt).length }) }; }
`;

async function openGame(query, opts = {}) {
  const browser = await chromium.launch({ args: ['--no-sandbox'], executablePath: existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === 'www.gstatic.com' && url.pathname.endsWith('firebase-app.js')) return route.fulfill({ contentType: 'text/javascript', body: FAKE_APP });
    if (url.hostname === 'www.gstatic.com' && url.pathname.endsWith('firebase-firestore-lite.js')) return route.fulfill({ contentType: 'text/javascript', body: FAKE_FS });
    if (url.hostname === 'speeder-game.test') {
      let p = url.pathname === '/' ? '/index.html' : url.pathname;
      if (p === '/moderation.txt' && opts.moderation != null) return route.fulfill({ contentType: 'text/plain', body: opts.moderation });
      if (p === '/sw.js') return route.fulfill({ status: 404, body: '' });
      const f = join(ROOT, p);
      if (!existsSync(f)) return route.fulfill({ status: 404, body: '' });
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.webmanifest': 'application/manifest+json' };
      return route.fulfill({ body: readFileSync(f), contentType: types[extname(f)] || 'application/octet-stream' });
    }
    return route.fulfill({ status: 404, body: '' });   // nothing else (analytics, fonts) in tests
  });
  if (opts.seed) await page.addInitScript((seed) => { window.__FS = seed; }, opts.seed);
  if (opts.storage) await page.addInitScript((st) => { if (!sessionStorage.getItem('__seeded')) { for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v); sessionStorage.setItem('__seeded', '1'); } }, opts.storage);
  await page.goto(HOST + (opts.path || 'index.html') + (query || ''));
  await page.waitForTimeout(800);
  return { browser, page, errors };
}

const ID = (n) => 'p' + String(n).repeat(19).slice(0, 19);
const seedRows = () => ({
  speeder_scores: {
    [ID(1) + '_aaa']: { name: 'ACE', score: 90000, dist: 9000, kills: 10, v: '0.16.7' },
    [ID(2) + '_bbb']: { name: 'F4CK', score: 80000, dist: 8000, kills: 10, v: '0.16.7' },
    [ID(3) + '_ccc']: { name: 'CHEATER', score: 99999999, dist: 9000, kills: 10, v: '0.16.7' },
    [ID(4) + '_ddd']: { name: 'BOB', score: 70000, dist: 7000, kills: 10, v: '0.16.7' },
  },
  speeder_warp_scores: {},
  writes: [],
});

// 1. Live site: no console shortcuts, no reachable game state
{
  const { browser, page, errors } = await openGame('');
  const r = await page.evaluate(() => ({ speeder: typeof window.SPEEDER, G: typeof G, SET: typeof SET, tag: document.getElementById('versionTag').textContent }));
  ok('live: window.SPEEDER is gone', r.speeder === 'undefined', r.speeder);
  ok('live: game state not global (G, SET)', r.G === 'undefined' && r.SET === 'undefined', r.G + '/' + r.SET);
  ok('live: no TEST TOOLS tag', !/TEST/.test(r.tag), r.tag);
  ok('live: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

// 2. ?dev: shortcuts back, tag shown, and sticky for the tab
{
  const { browser, page, errors } = await openGame('?dev');
  let r = await page.evaluate(() => ({ speeder: typeof window.SPEEDER, tag: document.getElementById('versionTag').textContent }));
  ok('?dev: window.SPEEDER exists', r.speeder === 'object');
  ok('?dev: TEST TOOLS ON tag', /TEST TOOLS ON/.test(r.tag), r.tag);
  await page.goto(HOST + 'index.html'); await page.waitForTimeout(500);
  r = await page.evaluate(() => typeof window.SPEEDER);
  ok('?dev: stays on in the same tab', r === 'object');
  // a dev run never uploads
  await page.evaluate(() => { const S = window.SPEEDER; S.SET.name = 'TESTER'; S.startGame(); S.step(1 / 60, 600); S.die(); });
  await page.waitForTimeout(3500);
  r = await page.evaluate(() => ({ status: document.getElementById('saveStatus').textContent, writes: (window.__FS || { writes: [] }).writes.length, last: window.SPEEDER.lastRun }));
  ok('?dev: run is unranked', r.last && r.last.unranked === 'dev', JSON.stringify(r.last && r.last.unranked));
  ok('?dev: nothing uploaded', r.writes === 0, String(r.writes));
  ok('?dev: says test tools are on', /Test tools are on/.test(r.status), r.status);
  ok('?dev: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

// 3. Live site: board shows PILOT for a rude name, hides moderated runs, and a real run uploads
{
  const mod = '# test\n' + ID(3) + '_ccc   # cheater\nplayer ' + ID(9) + '\nword BADWORD\n';
  const seed = seedRows();
  seed.speeder_scores[ID(9) + '_x1'] = { name: 'ALT', score: 85000, dist: 8500, kills: 1, v: '0.16.7' };
  seed.speeder_scores[ID(5) + '_eee'] = { name: 'MY BADWORD', score: 60000, dist: 6000, kills: 1, v: '0.16.7' };
  const { browser, page, errors } = await openGame('', { seed, moderation: mod, storage: { 'speeder.tutOffer': '1' } });
  await page.waitForTimeout(1500);
  // open the leaderboard
  await page.click('#titleBoardBtn');
  await page.waitForTimeout(600);
  await page.click('#boardClassic');
  await page.waitForTimeout(1200);
  const names = await page.$$eval('#boardList .nm', (els) => els.map((e) => e.textContent));
  ok('board: rude name shows as PILOT', names.includes('PILOT') && !names.includes('F4CK'), names.join(','));
  ok('board: hidden run is gone', !names.includes('CHEATER'), names.join(','));
  ok('board: hidden player is gone', !names.includes('ALT'), names.join(','));
  ok('board: word from moderation.txt is blocked', !names.some((n) => /BADWORD/.test(n)), names.join(','));
  ok('board: real names still show', names.includes('ACE') && names.includes('BOB'), names.join(','));
  const lim = await page.evaluate(() => window.__FS.lastLimit);
  ok('board: classic asks for 50 + a few for hidden ones', lim > 50 && lim <= 80, String(lim));
  ok('board: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

// 4. Live site, a real run in real time: name filter at game over, then it uploads
{
  const { browser, page, errors } = await openGame('', { seed: seedRows(), storage: { 'speeder.tutOffer': '1' } });
  await page.clock.install();
  await page.reload(); await page.waitForTimeout(500);
  // start a run with a tap on Play
  await page.keyboard.press('Enter');
  let state = '';
  for (let i = 0; i < 40 && !/over/.test(state); i++) {
    await page.clock.runFor(5000);
    state = await page.evaluate(() => (document.getElementById('over') && !document.getElementById('over').classList.contains('hidden') ? 'over' : 'play'));
  }
  ok('run: ended by itself (no steering)', state === 'over', state);
  await page.clock.runFor(4000);
  await page.fill('#nameInput', 'F4CK');
  await page.click('#saveScoreBtn');
  let st = await page.textContent('#saveStatus');
  ok('name: F4CK refused at game over', /isn’t allowed/.test(st), st);
  await page.fill('#nameInput', 'ADRIAN');
  await page.click('#saveScoreBtn');
  for (let i = 0; i < 10; i++) { await page.clock.runFor(1000); await page.waitForTimeout(100); }
  st = await page.textContent('#saveStatus');
  const w = await page.evaluate(() => window.__FS.writes);
  ok('run: passes the fair-play check and uploads', w.length === 1 && w[0].data.name === 'ADRIAN', st + ' ' + JSON.stringify(w));
  ok('run: no t field while on ORBit’s project (old rules)', w[0] && !('t' in w[0].data), JSON.stringify(w[0] && w[0].data));
  // settings: a rude name is refused there too
  await page.evaluate(() => { document.getElementById('setName').value = 'SHITHEAD'; document.getElementById('setName').dispatchEvent(new Event('change')); });
  const note = await page.textContent('#nameNote');
  const kept = await page.inputValue('#setName');
  ok('name: refused in Settings, old name kept', /isn’t allowed/.test(note) && kept === 'ADRIAN', note + ' / ' + kept);
  ok('run: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

// 5. Stats page: the "Check the boards" table, with flags and Copy ID buttons
{
  const seed = seedRows();
  const { browser, page, errors } = await openGame('', { path: 'stats/index.html', seed, moderation: ID(3) + '_ccc\n', storage: { 'speeder.stats.key': 'test-key' } });
  await page.waitForTimeout(3000);
  const txt = await page.textContent('#boardsBody');
  const rows = await page.evaluate(() => { const ts = document.querySelectorAll('#boardsBody table'); return [...ts[ts.length - 1].querySelectorAll('tr')].map((t) => t.textContent); });
  ok('stats: check table is there', /Check the boards/.test(txt), txt.slice(0, 120));
  ok('stats: rude name flagged', rows.some((r) => /F4CK.*rude name/.test(r)), rows.join(' | '));
  ok('stats: hidden run left out and counted', !rows.some((r) => /CHEATER/.test(r)) && /hidden by moderation/.test(txt), rows.join(' | '));
  ok('stats: Copy ID buttons', (await page.$$('#boardsBody button.chip')).length >= 3);
  ok('stats: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

let fail = 0;
for (const [r, n, x] of results) { if (r === 'FAIL') fail++; console.log(r, '-', n, x && r === 'FAIL' ? '(' + x + ')' : ''); }
console.log(fail ? fail + ' FAILED' : 'ALL PASSED');
process.exit(fail ? 1 : 0);
