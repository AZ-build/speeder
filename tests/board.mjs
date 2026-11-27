// v0.21.0: the leaderboard's Players view (best score per player, the default) and Runs view.
// Serves the game at a pretend web address with a stand-in Firebase full of runs, opens the board,
// and checks what it shows. Usage: node tests/board.mjs [dir] [screenshot-folder]
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }

const ROOT = resolve(process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..'));
const SHOTS = process.argv[3] ? resolve(process.argv[3]) : '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const HOST = 'https://speeder-game.test/';
const results = [];
const ok = (name, cond, extra) => { results.push([cond ? 'PASS' : 'FAIL', name, extra || '']); };

const FAKE_APP = 'export function initializeApp(c, n) { return { c, n }; }';
const FAKE_FS = `
const W = window;
export function getFirestore() { return {}; }
export function collection(db, name) { return { name }; }
export function doc(db, name, id) { return { name, id }; }
export function orderBy() { return null; }
export function limit(n) { return { limit: n }; }
export function startAfter(d) { return { after: d.id }; }
export function where(f, op, v) { return { gt: v }; }
export function query(c, ...parts) { const q = { name: c.name }; for (const p of parts) if (p) Object.assign(q, p); return q; }
export function serverTimestamp() { return 'TS'; }
export async function setDoc(ref, data) { W.__FS[ref.name][ref.id] = data; }
function rows(q) { return Object.entries(W.__FS[q.name]).map(([id, d]) => ({ id, d })).sort((a, b) => b.d.score - a.d.score); }
export async function getDocs(q) {
  let r = rows(q);
  if (q.after) r = r.slice(r.findIndex((x) => x.id === q.after) + 1);
  r = r.slice(0, q.limit || 999);
  W.__FS.reads = (W.__FS.reads || 0) + r.length;
  (W.__FS.log = W.__FS.log || []).push((q.after ? 'after ' : '') + q.limit + ':' + r.length);
  return { docs: r.map((x) => ({ id: x.id, data: () => x.d })) };
}
export async function getCount(q) { return { data: () => ({ count: rows(q).filter((r) => r.d.score > q.gt).length }) }; }
`;

const W_MIN = (readFileSync(join(ROOT, 'index.html'), 'utf8').match(/const W_BOARD_MIN_V = '([^']+)'/) || [])[1];
const ME = 'pmeeeeeeeeeeeeeeeeeee';
const pid = (n) => 'p' + String(n).padStart(19, '0');
const NAMES = ['ACE', 'NOVA', 'BLAZE', 'ZED', 'KIRA', 'JAX', 'RIO', 'MAX', 'ECHO', 'VEX', 'LUNA', 'TANK', 'PIXEL', 'DASH', 'ORION'];
// 70 players. The first 5 are "grinders" with 30 runs each, so the top 50 runs hold very few players.
function seed(nPlayers, grinders, grind = 30) {
  const warp = {};
  for (let p = 0; p < nPlayers; p++) {
    const runs = p < grinders ? grind : 1 + (p % 3);
    for (let k = 0; k < runs; k++) {
      const score = Math.round(5000000 / (p + 1) - k * 1000 - p * 7);
      warp[pid(p) + '_r' + k] = { name: NAMES[p % NAMES.length] + (p >= NAMES.length ? p : ''), score, dist: 40000 + score / 50, kills: 10, loop: 1 + (score > 1000000 ? 2 : 0), v: '0.20.1' };
    }
  }
  warp[ME + '_mine1'] = { name: 'ADRIAN', score: 900000, dist: 60000, kills: 10, loop: 2, v: '0.20.1' };
  warp[ME + '_mine2'] = { name: 'ADRIAN', score: 850000, dist: 58000, kills: 10, loop: 2, v: '0.20.1' };
  return { speeder_scores: {}, speeder_warp_scores: warp };
}

async function openGame(fs, viewport) {
  const browser = await chromium.launch({ args: ['--no-sandbox'], executablePath: existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined });
  const ctx = await browser.newContext({ viewport: viewport || { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === 'www.gstatic.com' && url.pathname.endsWith('firebase-app.js')) return route.fulfill({ contentType: 'text/javascript', body: FAKE_APP });
    if (url.hostname === 'www.gstatic.com' && url.pathname.endsWith('firebase-firestore-lite.js')) return route.fulfill({ contentType: 'text/javascript', body: FAKE_FS });
    if (url.hostname === 'speeder-game.test') {
      let p = url.pathname === '/' ? '/index.html' : url.pathname;
      if (p === '/sw.js' || p === '/moderation.txt') return route.fulfill({ status: 404, body: '' });
      const f = join(ROOT, p);
      if (!existsSync(f)) return route.fulfill({ status: 404, body: '' });
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };
      return route.fulfill({ body: readFileSync(f), contentType: types[extname(f)] || 'application/octet-stream' });
    }
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(([fsSeed, me, W_MIN]) => {
    window.__FS = fsSeed;
    if (!sessionStorage.getItem('__seeded')) {
      localStorage.setItem('speeder.pid', me);
      localStorage.setItem('speeder.settings', JSON.stringify({ name: 'ADRIAN', mode: 'warp', sound: false }));
      localStorage.setItem('speeder.w.live', '1');
      localStorage.setItem('speeder.w.boardV', W_MIN);
      localStorage.setItem('speeder.tutOffer', '1');
      localStorage.setItem('speeder.seen', '1');
      localStorage.setItem('speeder.w.local', JSON.stringify([{ name: 'ADRIAN', score: 900000, dist: 60000, loop: 2, t: 1 }]));
      sessionStorage.setItem('__seeded', '1');
    }
  }, [fs, ME, W_MIN]);
  await page.goto(HOST + 'index.html');
  await page.waitForTimeout(1200);
  await page.waitForFunction(() => localStorage.getItem('speeder.w.worldTopAt'), null, { timeout: 5000 }).catch(() => {});   // (the start-up download for the ladder)
  return { browser, page, errors };
}
const board = (page) => page.evaluate(() => ({
  rows: [...document.querySelectorAll('#boardList li')].map((li) => ({ name: li.querySelector('.nm').textContent, score: li.querySelector('.sc').firstChild.textContent, me: li.classList.contains('me') })),
  status: document.getElementById('boardStatus').textContent,
  reads: window.__FS.reads || 0,
  listTop: document.getElementById('boardList').getBoundingClientRect().top,
  listH: document.getElementById('boardList').getBoundingClientRect().height,
}));
const tap = async (page, sel) => { await page.click(sel); await page.waitForTimeout(600); };

const old = !existsSync(join(ROOT, 'index.html')) || !readFileSync(join(ROOT, 'index.html'), 'utf8').includes('tabPlayers');

// 1. Players is the default, one row per player, best score each
{
  const { browser, page, errors } = await openGame(seed(70, 5));
  await page.evaluate(() => { window.__FS.reads = 0; });
  await tap(page, '#titleBoardBtn');
  await page.waitForTimeout(600);
  const b = await board(page);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, (old ? 'before' : 'after') + '-players.png') });
  if (!old) {
    const names = b.rows.map((r) => r.name);
    ok('players: 50 rows', b.rows.length === 50, String(b.rows.length));
    ok('players: no player twice', new Set(names).size === names.length, names.join(','));
    ok('players: #1 is the best score', b.rows[0] && b.rows[0].name === 'ACE' && b.rows[0].score === '5,000,000', JSON.stringify(b.rows[0]));
    const me = b.rows.filter((r) => r.me);
    ok('players: you appear once, with your best', me.length === 1 && me[0].score === '900,000', JSON.stringify(me));
    ok('players: status says players', /players/.test(b.status) && /You’re #\d+/.test(b.status), b.status);
    ok('players: reads stay bounded (≤ 300)', b.reads <= 300, b.reads + ' ' + await page.evaluate(() => window.__FS.log.join(' | ')));
    const roomy = await page.evaluate(() => [...document.querySelectorAll('#board .seg-group button')].every((x) => x.scrollWidth <= x.clientWidth + 1));
    ok('players: filter labels fit their buttons', roomy);
    const oneLine = await page.evaluate(() => { const g = document.querySelectorAll('#board .seg-group'); return g[0].getBoundingClientRect().top === g[1].getBoundingClientRect().top; });
    ok('players: both filters on one line', oneLine);
    ok('players: list starts high on the screen (≤ 210 px)', b.listTop <= 210, String(Math.round(b.listTop)));
    // Runs view: one player can hold several spots
    await tap(page, '#tabRuns');
    const r = await board(page);
    if (SHOTS) await page.screenshot({ path: join(SHOTS, 'after-runs.png') });
    ok('runs: 50 rows', r.rows.length === 50, String(r.rows.length));
    ok('runs: one player holds several spots', r.rows.filter((x) => x.name === 'ACE').length > 1);
    ok('runs: status says runs', /runs in the world/.test(r.status), r.status);
    await tap(page, '#tabLocal');
    const l = await board(page);
    if (SHOTS) await page.screenshot({ path: join(SHOTS, 'after-mine.png') });
    ok('this device: shows local runs', l.rows.length === 1 && /this device/.test(l.status), l.status);
    // reopening the board keeps the cached players list (no new reads)
    await tap(page, '#tabPlayers');
    await page.evaluate(() => { window.__FS.reads = 0; });
    await tap(page, '#tabRuns'); await tap(page, '#tabPlayers');
    const again = await board(page);
    ok('players: cached, no new reads on switching back', again.reads === 0, String(again.reads));
  }
  ok('no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

// 2. Fewer than 50 players in total: shows them all, stops reading at the end of the list
if (!old) {
  const { browser, page, errors } = await openGame(seed(8, 2));
  await page.evaluate(() => { window.__FS.reads = 0; });
  await tap(page, '#titleBoardBtn');
  await page.waitForTimeout(600);
  const b = await board(page);
  ok('few players: all 9 shown once', b.rows.length === 9 && new Set(b.rows.map((r) => r.name)).size === 9, String(b.rows.length));
  const total = Object.keys(seed(8, 2).speeder_warp_scores).length;
  ok('few players: read the whole list, no more', b.reads === total, b.reads + ' of ' + total);
  ok('few players: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

// 2b. A few players with lots of runs each: stops at PLAYERS_MAX_READ and shows who it found
if (!old) {
  const { browser, page, errors } = await openGame(seed(60, 20, 40));
  await page.evaluate(() => { window.__FS.reads = 0; });
  await tap(page, '#titleBoardBtn');
  await page.waitForTimeout(600);
  const b = await board(page);
  ok('read cap: stops at 300 runs', b.reads === 300, String(b.reads));
  ok('read cap: still shows each player once', b.rows.length >= 8 && new Set(b.rows.map((r) => r.name)).size === b.rows.length, String(b.rows.length));
  ok('read cap: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

// 3. Small phone (iPhone SE size): filters fit, list gets the room
if (!old) {
  const { browser, page, errors } = await openGame(seed(70, 5), { width: 320, height: 568 });
  await tap(page, '#titleBoardBtn');
  await page.waitForTimeout(600);
  const b = await board(page);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'after-small.png') });
  const fit = await page.evaluate(() => [...document.querySelectorAll('#board .seg-group button')].every((x) => x.scrollWidth <= x.clientWidth + 1));
  ok('small phone: filter labels fit their buttons', fit);
  ok('small phone: list shows at least 5 rows', b.listH >= 5 * 40, String(Math.round(b.listH)));
  ok('small phone: no script errors', errors.length === 0, errors.join(' | '));
  await browser.close();
}

for (const [s, n, x] of results) console.log(s, n, x ? '(' + x + ')' : '');
const fails = results.filter((r) => r[0] === 'FAIL').length;
console.log(fails ? fails + ' FAILED' : 'All ' + results.length + ' board checks passed');
process.exit(fails ? 1 : 0);
