// The Lab's MUSIC experiment (v0.18.0), played for real: the game runs in headless Chrome in real
// time with audio on (served over http, because the music files can't be fetched from file://).
// Checks: the first song starts, parts change on bar lines as worlds change, a hyperlane drops to
// part 1, the Warden hands off to the next song exactly two bars after a bar line, the pickups are
// retuned, a crash stops the music, no script errors, and the old track stays silent meanwhile.
// node tests/music.mjs "$PWD"
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }

const dir = process.argv[2] || process.cwd();
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const f = existsSync(p) && statSync(p).isDirectory() ? join(p, 'index.html') : p;
  if (!existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((ok) => server.listen(0, ok));
const port = server.address().port;

const results = [];
const ok = (name, cond, extra) => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  [' + JSON.stringify(extra) + ']' : '')); };
const exe = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const launch = { args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] };
if (existsSync(exe)) launch.executablePath = exe;
const browser = await chromium.launch(launch);
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await ctx.addInitScript(() => {
  localStorage.setItem('speeder.soundReset', '3');
  localStorage.setItem('speeder.lab.cfg', JSON.stringify({ jump: { on: false }, ramps: { on: false }, lane: { on: false }, music: { on: true, song: 'sunset' } }));
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR|Failed to load resource|firestore|goatcounter/i.test(m.text())) errors.push('console: ' + m.text()); });
await page.goto('http://localhost:' + port + '/?dev');
await page.waitForFunction(() => !!window.SPEEDER);
const S = (fn, arg) => page.evaluate(fn, arg);
const IN = (code) => page.evaluate((c) => SPEEDER.inside(c), code);
const wait = (ms) => page.waitForTimeout(ms);
const state = () => IN(`() => ({ song: LM.song, part: LM.cur ? LM.cur.part : 0, t0: LM.t0, bar: LM.bar, busy: LM.busy, now: AU.ctx.currentTime, key: AU.key, best: LM.best, oldVol: AU.musicBus.gain.value, bus: LM.bus ? LM.bus.gain.value : -1 })`);
const onBar = (t, s) => Math.abs(((t - s.t0) / s.bar) - Math.round((t - s.t0) / s.bar)) < 0.002;

await S(() => { SPEEDER.SET.sound = true; SPEEDER.SET.music = true; SPEEDER.SET.volume = 80; });
await IN(`() => { audioInit(); }`);
ok('music experiment is listed and on by default', await S(() => !!SPEEDER.LAB_EXPERIMENTS.find((X) => X.id === 'music' && X.on)));
await S(() => { SPEEDER.setMode('lab'); SPEEDER.startGame(); SPEEDER.G.invuln = 1e9; });
ok('a Lab run with MUSIC switches the director on', await S(() => SPEEDER.labOn('music') && SPEEDER.LM.on));
await page.waitForFunction(() => SPEEDER.LM.cur, null, { timeout: 15000 });
let s = await state();
ok('song 1 starts on part 1 (Neon Desert)', s.song === 0 && s.part === 1, s);
await wait(1500);
s = await state();
ok('the old track is muted, the Lab music bus is up', s.oldVol < 0.01 && s.bus > 0.3, { old: s.oldVol, bus: s.bus });
ok('pickups retuned to D', Math.abs(s.key - Math.pow(2, 2 / 12)) < 1e-6, s.key);

// worlds 2-5: each change lands on a bar line
for (let w = 2; w <= 5; w++) {
  await S(() => { SPEEDER.enterWorld(); SPEEDER.G.invuln = 1e9; });
  const before = await state();
  await wait(3200);                         // a bar at 96 BPM is 2.5 s
  s = await state();
  const at = s.busy - 0.05;
  ok('world ' + w + ': part ' + w + ' plays, switched on a bar line', s.song === 0 && s.part === w && onBar(at, s) && at >= before.now, { part: s.part, barsIn: (at - s.t0) / s.bar });
}

// a hyperlane drops back to part 1, the next world brings the full part back
await S(() => { SPEEDER.startLane('resume'); });
await wait(3000);
s = await state();
ok('in a hyperlane: part 1', s.part === 1, s.part);
await S(() => { SPEEDER.exitLane && SPEEDER.exitLane(); });
await IN(`() => { LANE.on = false; }`);
await wait(3000);
s = await state();
ok('out of the lane: back to part 5', s.part === 5, s.part);

// the Warden: part 5, then the handoff to song 2
await S(() => { SPEEDER.startBoss(); SPEEDER.G.invuln = 1e9; });
await wait(500);
const pre = await state();
await IN(`() => { bossDown(WP.boss || { x: 0, d: G.d + 40 }); }`);
await page.waitForFunction(() => SPEEDER.LM.song === 1, null, { timeout: 10000 });
s = await state();
const T = s.t0 - 2 * pre.bar;
ok('Warden down: song 2 starts two bars after a bar line of song 1', Math.abs(((T - pre.t0) / pre.bar) - Math.round((T - pre.t0) / pre.bar)) < 0.002, { barsIn: (T - pre.t0) / pre.bar });
ok('song 2 runs at 100 BPM from part 1, pickups in E', Math.abs(s.bar - 2.4) < 1e-9 && s.part === 1 && Math.abs(s.key - Math.pow(2, 4 / 12)) < 1e-6, s);
ok('song counter says song 2', s.best === 2, s.best);
await wait(Math.max(0, (s.t0 - s.now) * 1000) + 800);
ok('the handoff has played into song 2', (await state()).now > s.t0);

// into loop 2: still song 2, parts follow the worlds again
await S(() => { SPEEDER.enterWorld(); SPEEDER.G.invuln = 1e9; });
await wait(800);
s = await state();
ok('loop 2 world 1: song 2 part 1', s.song === 1 && s.part === 1 && (await S(() => SPEEDER.WP.loop)) === 2, s);
await S(() => { SPEEDER.enterWorld(); });
await wait(3000);
s = await state();
ok('loop 2 world 2: song 2 part 2', s.song === 1 && s.part === 2, s);

// crash: tape stop
await S(() => { SPEEDER.G.invuln = 0; SPEEDER.die(); });
await wait(600);
ok('a crash stops the music', await S(() => !SPEEDER.LM.cur && SPEEDER.LM.dead));
await page.waitForFunction(() => SPEEDER.G.state === 'over', null, { timeout: 8000 }).catch(() => {});
ok('game-over stats name the song reached', await S(() => /Sunset Drive II/.test(document.getElementById('over').innerHTML)));

// Lab off: the old music plays as before and the director stays off
await S(() => { SPEEDER.labSet('music', 'on', false); SPEEDER.setMode('lab'); SPEEDER.startGame(); });
await wait(1200);
ok('MUSIC off: the director stays off and the old track plays', await IN(`() => !LM.on && !LM.cur && AU.musicBus.gain.value > 0.05`));
await S(() => { SPEEDER.setMode('warp'); SPEEDER.startGame(); });
await wait(1200);
ok('Warp Run: no Lab music', await IN(`() => !LM.on && !LM.cur`));

ok('no script errors', errors.length === 0, errors.slice(0, 5));
await browser.close();
server.close();
console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed ? failed + ' FAILED' : 'ALL ' + results.length + ' PASSED');
process.exit(failed ? 1 : 0);
