// REDLINE (v0.22.0), the Lab's default soundtrack, played for real: the game runs in headless Chrome
// in real time with audio on (served over http: the engine is a module). Checks the rules on their
// own (levels, tempo, keys), then a Lab run: it starts, it makes sound, world changes and a hyperlane
// land on bar lines, a riser comes before a gate, the Warden hands off up a key (pickups retuned),
// the tempo follows the road and stops at the top, a crash fades it out, the old track stays silent,
// the Lab panel's Soundtrack choice, and no script errors. Also how much it costs to run.
// node tests/redline.mjs "$PWD"
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
const base = 'http://localhost:' + server.address().port;
const results = [];
const ok = (name, cond, extra) => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  [' + JSON.stringify(extra) + ']' : '')); };
const exe = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch(Object.assign({ args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] }, existsSync(exe) ? { executablePath: exe } : {}));
const newPage = async (init) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR|Failed to load resource|firestore|goatcounter|favicon/i.test(m.text())) errors.push('console: ' + m.text()); });
  return { page, errors };
};

// ---- 1. the rules, and the cost, on their own ----
{
  const { page, errors } = await newPage();
  await page.goto(base + '/sound-picker/tools/redline/blank.html');
  const r = await page.evaluate(async () => {
    const R = await import('/audio/redline.js');
    const out = {};
    out.loop1 = [0, 1, 2, 3, 4].map((w) => R.levelFor(1, w, false)).join('');
    out.loop2 = [0, 1, 2, 3, 4].map((w) => R.levelFor(2, w, false)).join('');
    out.loop7 = [0, 1, 2, 3, 4].map((w) => R.levelFor(7, w, false)).join('');
    out.boss = R.levelFor(1, 4, true);
    out.bpm = [32, 60, 90, 110, 130, 200].map((v) => Math.round(R.bpmFor(v)));
    out.keys = [1, 2, 3, 4, 5, 6].map(R.keyOfLoop).join(',');
    out.semis = [0, 2, 4].map(R.keySemis).join(',');
    // an offline run at top speed: tempo creeps up 1 BPM a bar, stops at 128; level 6 varies its riffs and fills
    const oc = new OfflineAudioContext(2, 44100 * 80, 44100);
    const P = new R.Redline(oc, oc.destination, undefined, true);
    await P.prepare(0);
    const bars = [];
    P.on((e) => { if (e.type === 'bar') bars.push(e); });
    P.st.speed = 90; P.st.loop = 5; P.start(0.05);
    P.renderBars(40, () => ({ loop: 5, world: 3, frac: 0.5, speed: 200, gateEta: Infinity }));
    out.maxBpm = Math.max(...bars.map((b) => b.bpm));
    out.steps = bars.slice(1).every((b, i) => b.bpm - bars[i].bpm <= 1.0001);
    out.reached = bars[bars.length - 1].bpm;
    out.riffs = new Set(bars.filter((b) => b.p === 0).map((b) => b.riff + b.prog)).size;
    out.fills = new Set(bars.map((b) => b.fill).filter(Boolean)).size;
    out.evenBars = bars.slice(1).every((b, i) => Math.abs((b.time - bars[i].time) - 240 / bars[i].bpm) < 1e-6);
    // the cost: render 12 s of level 6, scheduled bar by bar the way the game does it
    const oc2 = new OfflineAudioContext(2, 44100 * 12, 44100);
    const Q = new R.Redline(oc2, oc2.destination, undefined, true);
    await Q.prepare(0);
    Q.st.speed = 110; Q.st.loop = 3; Q.start(0.05);
    const feed = () => { while (Q.T < oc2.currentTime + 0.6) { Q.set({ loop: 3, world: 4, boss: true, frac: 0.5, speed: 110, gateEta: Infinity }); Q.st.at = Q.T; Q.bar(); } };
    feed();
    for (let t = 0.5; t < 11.5; t += 0.5) oc2.suspend(t).then(() => { feed(); oc2.resume(); });
    const t0 = performance.now();
    const buf = await oc2.startRendering();
    out.cpu = (performance.now() - t0) / 1000 / 12;
    let sum = 0; const d = buf.getChannelData(0);
    for (let i = 44100; i < d.length; i++) sum += d[i] * d[i];
    out.rms = 10 * Math.log10(sum / (d.length - 44100));
    return out;
  });
  ok('levels: loop 1 climbs a level a world', r.loop1 === '12345', r.loop1);
  ok('levels: loop 2 comes back in at 4, full from its third world', r.loop2 === '45666', r.loop2);
  ok('levels: loop 3 on stays at the top, the Warden is the top', r.loop7 === '66666' && r.boss === 6);
  ok('tempo: 96 BPM at the start, ~117 at 450 km/h, 128 at 655 km/h and never more', r.bpm[0] === 96 && r.bpm[2] === 116 && r.bpm[4] === 128 && r.bpm[5] === 128, r.bpm);
  ok('tempo: rises at most 1 BPM a bar and stops at 128', r.steps && r.maxBpm <= 128 && Math.round(r.reached) === 128, { max: r.maxBpm, reached: r.reached });
  ok('beat: every bar exactly as long as its tempo says', r.evenBars);
  ok('keys: D, E, F#, then round again (pickups: +2, +4, +6 from C)', r.keys === '0,2,4,0,2,4' && r.semis === '2,4,6', { keys: r.keys, semis: r.semis });
  ok('top level: riffs and fills change from phrase to phrase', r.riffs >= 3 && r.fills >= 3, { riffs: r.riffs, fills: r.fills });
  ok('loudness at the top: about -15 dBFS RMS (like the Sunset Drive files)', r.rms > -18 && r.rms < -12, r.rms.toFixed(1));
  ok('cost: well under real time to render the busiest level (' + (r.cpu * 100).toFixed(1) + '% here)', r.cpu < 0.25, r.cpu.toFixed(3));
  ok('engine: no script errors', errors.length === 0, errors.slice(0, 3));
}

// ---- 2. a Lab run ----
{
  const { page, errors } = await newPage(() => {
    localStorage.setItem('speeder.soundReset', '2');
    localStorage.setItem('speeder.lab.cfg', JSON.stringify({ jump: { on: false }, ramps: { on: false }, lane: { on: true }, music: { on: true } }));
  });
  await page.goto(base + '/?dev');
  await page.waitForFunction(() => !!window.SPEEDER);
  const S = (fn, arg) => page.evaluate(fn, arg);
  const IN = (code) => page.evaluate((c) => SPEEDER.inside(c), code);
  const wait = (ms) => page.waitForTimeout(ms);
  ok('panel: the Soundtrack choice is Redline by default, Sunset Drive the other', await S(() => {
    SPEEDER.openPanel('lab');
    const chip = document.getElementById('labOpt_music_song');
    const t = chip && chip.textContent;
    chip.click();
    const t2 = document.getElementById('labOpt_music_song').textContent;
    document.getElementById('labOpt_music_song').click();
    const t3 = document.getElementById('labOpt_music_song').textContent;
    SPEEDER.closePanel();
    return t === 'Redline' && t2 === 'Sunset Drive' && t3 === 'Redline';
  }));
  ok('panel: no Studio choice or mention on a phone that never opened the Studio', await S(() => { SPEEDER.openPanel('lab'); const s = !/Studio/.test(document.getElementById('lab').innerText); SPEEDER.closePanel(); return s; }));
  await S(() => { SPEEDER.SET.sound = true; SPEEDER.SET.music = true; SPEEDER.SET.volume = 80; });
  await IN(`() => { audioInit(); }`);
  await S(() => { SPEEDER.setMode('lab'); SPEEDER.startGame(); SPEEDER.G.invuln = 1e9; });
  await page.waitForFunction(() => SPEEDER.RL.player && SPEEDER.RL.player.playing, null, { timeout: 20000 });
  ok('run: Redline is the soundtrack and starts', await IN(`() => LM.kind === 'redline' && RL.player.playing && !LM.cur`));
  await IN(`() => { window.__ev = []; RL.player.on((e) => window.__ev.push(e)); const an = AU.ctx.createAnalyser(); an.fftSize = 2048; window.__an = an; LM.bus.connect(an); }`);
  const rms = async (ms) => page.evaluate(async (ms) => {
    const an = window.__an, buf = new Float32Array(2048); let sum = 0, n = 0; const t0 = performance.now();
    while (performance.now() - t0 < ms) { await new Promise((r) => setTimeout(r, 40)); an.getFloatTimeDomainData(buf); for (const x of buf) { sum += x * x; n++; } }
    return 10 * Math.log10(sum / n + 1e-12);
  }, ms);
  const r1 = await rms(3000);
  ok('run: world 1 is playing, quietly (it starts low)', r1 > -45 && r1 < -18, r1.toFixed(1));
  let s = await IN(`() => ({ old: AU.musicBus.gain.value, bus: LM.bus.gain.value, key: AU.key, bpm: RL.player.bpm, lvl: RL.player.sec && RL.player.sec.lvl })`);
  ok('run: the old track is muted, the Lab music bus is up', s.old < 0.01 && s.bus > 0.3, s);
  ok('run: pickups retuned to D', Math.abs(s.key - Math.pow(2, 2 / 12)) < 1e-6, s.key);
  ok('run: level 1, 96-100 BPM', s.lvl === 1 && s.bpm >= 96 && s.bpm < 101, s);
  // a gate a little ahead: the bar it falls in gets a riser
  // (set just after a bar has been scheduled, so the next one is the bar the gate falls in)
  await page.waitForFunction(() => { const e = (window.__ev || []).filter((x) => x.type === 'bar').pop(); return e && SPEEDER.inside('() => AU.ctx.currentTime') > e.time - 0.2 && SPEEDER.inside('() => AU.ctx.currentTime') < e.time; }, null, { timeout: 6000, polling: 20 }).catch(() => {});
  await IN(`() => { WP.gateD = G.d + G.speed * (240 / RL.player.bpm) * 1.5; window.__eta = rlState().gateEta; }`);
  await page.waitForFunction(() => (window.__ev || []).some((e) => e.type === 'bar' && e.fill === 'riser'), null, { timeout: 9000 }).catch(() => {});
  ok('run: a riser builds into the world gate', await S(() => window.__ev.some((e) => e.type === 'bar' && e.fill === 'riser')), await S(() => ({ eta: window.__eta, bars: window.__ev.filter((e) => e.type === 'bar').slice(-3).map((e) => [e.time.toFixed(2), e.fill]) })));
  await page.waitForFunction(() => SPEEDER.WP.theme === 1 || SPEEDER.LANE.on, null, { timeout: 8000 }).catch(() => {});
  // through the gate with HYPERLANE on: a lane first
  if (!(await S(() => SPEEDER.LANE.on))) await S(() => SPEEDER.startLane('enter'));
  await IN(`() => { window.__ev.length = 0; }`);
  await page.waitForFunction(() => window.__ev.some((e) => e.type === 'level' && e.level === 0), null, { timeout: 7000 }).catch(() => {});
  let lv = await S(() => window.__ev.find((e) => e.type === 'level'));
  const bars = await S(() => window.__ev.filter((e) => e.type === 'bar').map((e) => e.time));
  ok('lane: a hyperlane drops to the floaty lane level, on a bar line', !!lv && lv.level === 0 && bars.some((t) => Math.abs(t - lv.time) < 1e-6), lv);
  await S(() => SPEEDER.exitLane());
  await IN(`() => { window.__ev.length = 0; }`);
  await page.waitForFunction(() => window.__ev.some((e) => e.type === 'level'), null, { timeout: 7000 }).catch(() => {});
  lv = await S(() => window.__ev.find((e) => e.type === 'level'));
  ok('world 2: level 2 lands on the next bar line', !!lv && lv.level === 2 && (await IN(`() => WP.theme`)) === 1, lv);
  const r2 = await rms(2500);
  ok('world 2 is louder than world 1 (the build)', r2 > r1 + 1.5, { w1: r1.toFixed(1), w2: r2.toFixed(1) });
  // to the Warden
  await IN(`() => { LAB.run.lane = undefined; delete LAB.run.lane; }`);
  for (let i = 0; i < 3; i++) await S(() => { SPEEDER.enterWorld(); SPEEDER.G.invuln = 1e9; });
  await S(() => { SPEEDER.startBoss(); SPEEDER.G.invuln = 1e9; });
  await IN(`() => { window.__ev.length = 0; }`);
  await page.waitForFunction(() => window.__ev.some((e) => e.type === 'level' && e.level === 6), null, { timeout: 7000 }).catch(() => {});
  ok('the Warden: level 6', await S(() => window.__ev.some((e) => e.type === 'level' && e.level === 6)));
  // Warden down
  await IN(`() => { WP.boss && (WP.boss.hp = 0); WP.phase = 'reward'; WP.boss = null; window.__ev.length = 0; }`);
  await page.waitForFunction(() => window.__ev.some((e) => e.type === 'song'), null, { timeout: 12000 }).catch(() => {});
  const ho = await S(() => ({ h: window.__ev.find((e) => e.type === 'handoff'), s: window.__ev.find((e) => e.type === 'song'), lv: window.__ev.filter((e) => e.type === 'level').pop() }));
  s = await IN(`() => ({ key: AU.key, best: LM.best, rk: RL.player.key })`);
  ok('after the Warden: a two-bar handoff, then loop 2 up a key in E', !!ho.h && !!ho.s && ho.s.loop === 2 && ho.s.key === 2, ho);
  ok('after the Warden: pickups retuned to E', Math.abs(s.key - Math.pow(2, 4 / 12)) < 1e-6, s);
  // tempo follows the road (not your actual speed)
  const b0 = await IN(`() => RL.player.bpm`);
  await IN(`() => { G.speed *= 0.5; }`);
  await wait(2600);
  const b1 = await IN(`() => RL.player.bpm`);
  ok('tempo: a hit (slowing down) does not drag the tempo down', b1 >= b0 - 0.01, { before: b0, after: b1 });
  // a crash
  await IN(`() => { window.__ev.length = 0; }`);
  await S(() => { SPEEDER.G.invuln = 0; SPEEDER.die(); });
  await wait(1600);
  ok('a crash fades it out', await IN(`() => !RL.player || !RL.player.playing`));
  await page.waitForFunction(() => SPEEDER.G.state === 'over', null, { timeout: 8000 }).catch(() => {});
  ok('game over names the soundtrack', await S(() => /Music\s*Redline/.test(document.getElementById('over').innerText)));
  // the Sunset Drive choice still plays Sunset Drive
  await S(() => { SPEEDER.labSet('music', 'song', 'sunset'); SPEEDER.setMode('lab'); SPEEDER.startGame(); SPEEDER.G.invuln = 1e9; });
  await page.waitForFunction(() => SPEEDER.LM.cur, null, { timeout: 15000 }).catch(() => {});
  ok('Sunset Drive choice: plays the Sunset Drive files, no Redline', await IN(`() => LM.kind === 'sunset' && !!LM.cur && !RL.player`));
  await S(() => { SPEEDER.labSet('music', 'song', 'redline'); SPEEDER.G.invuln = 0; SPEEDER.die(); });
  // Warp Run (v0.23.0): Redline is its music; Classic keeps the old track
  await page.waitForTimeout(300);
  await S(() => { SPEEDER.setMode('warp'); SPEEDER.startGame(); SPEEDER.G.invuln = 1e9; });
  await page.waitForFunction(() => SPEEDER.RL.player && SPEEDER.RL.player.playing, null, { timeout: 15000 }).catch(() => {});
  ok('Warp Run: Redline plays, the old track is muted', await IN(`() => LM.kind === 'redline' && RL.player && RL.player.playing && AU.musicBus.gain.value < 0.05`));
  await S(() => { SPEEDER.G.invuln = 0; SPEEDER.die(); });
  await page.waitForTimeout(1500);
  await S(() => { SPEEDER.setMode('classic'); SPEEDER.startGame(); });
  await wait(1500);
  ok('Classic: no Redline, the old track plays', await IN(`() => !LM.on && !RL.player && AU.musicBus.gain.value > 0.05`));
  // sound is on by default again (v0.23.0)
  ok('sound is on by default, and switched on once on every phone', await IN(`() => SETTINGS_DEFAULT.sound === true && SOUND_RESET === '2' && SOUND_RESET_TO === true`));
  ok('run: no script errors', errors.length === 0, errors.slice(0, 3));
}

await browser.close();
server.close();
console.log(results.join('\n'));
const fails = results.filter((r) => r.startsWith('FAIL')).length;
console.log(fails ? fails + ' FAILED' : 'All ' + results.length + ' passed');
process.exit(fails ? 1 : 0);
