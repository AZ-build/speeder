// The Speeder Studio (v0.20.0) and its songs in the Lab, played for real in headless Chrome with
// audio on (served over http: the engine is a module). Checks: the presets and guardrails, the
// beat clock (steps evenly spaced, world changes only on bar lines), that it actually makes sound
// and how loud, the Studio page (play, edit, save, Lab playlist), and a Lab run on Studio songs
// (worlds, hyperlane, the Warden handoff, the player's own song, crash fade-out, no errors).
// node tests/studio.mjs "$PWD"
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }

const dir = process.argv[2] || process.cwd();
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.txt': 'text/plain', '.jpg': 'image/jpeg' };
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
const exe = '/usr/bin/google-chrome';
const browser = await chromium.launch(Object.assign({ args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] }, existsSync(exe) ? { executablePath: exe } : {}));
const newPage = async (init, arg) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  if (init) await ctx.addInitScript(init, arg);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR|Failed to load resource|firestore|goatcounter|favicon/i.test(m.text())) errors.push('console: ' + m.text()); });
  return { page, errors };
};

// ---- 1. the engine on its own ----
{
  const { page, errors } = await newPage();
  await page.goto(base + '/studio/');
  await page.waitForFunction(() => !!window.STUDIO);
  const r = await page.evaluate(async () => {
    const E = STUDIO.E;
    const out = {};
    out.presets = E.PRESETS.length;
    out.inKey = E.PRESETS.every((p) => { const s = E.cleanSong(p); const sc = E.scaleOf(s).map((x) => (x + s.key) % 12); return s.melody.flat().filter((n) => n >= 0).every((n) => sc.includes(E.melodyMidi(s, n) % 12)); });
    const bad = E.cleanSong({ mood: 'bright', chords: [1, 2, 5, 6], bpm: 999, key: -3, melody: [[99, 3.5, -7]] });
    out.guard = { chords: bad.chords, bpm: bad.bpm, key: bad.key, mel: bad.melody[0].slice(0, 3) };
    out.brightOnlyMajor = E.PRESETS.filter((p) => p.mood === 'bright').every((p) => p.chords.every((c) => !/m|dim/.test(E.chordName(p, c))));
    // play it for real and listen
    const ctx = new AudioContext();
    const an = ctx.createAnalyser(); an.fftSize = 2048; an.connect(ctx.destination);
    const P = new E.Player(ctx, an);
    const ev = [];
    P.on((e) => ev.push(e));
    P.setSong(E.PRESETS[0]);
    P.start(4);
    const buf = new Float32Array(2048);
    let sum = 0, n = 0;
    const t0 = performance.now();
    while (performance.now() - t0 < 4000) {
      await new Promise((r) => setTimeout(r, 40));
      an.getFloatTimeDomainData(buf);
      for (const x of buf) { sum += x * x; n++; }
    }
    out.rmsW5 = 10 * Math.log10(sum / n);
    // world change: asked mid-bar, lands on the next bar line
    P.setWorld(1);
    await new Promise((r) => setTimeout(r, 3500));
    const w = ev.find((e) => e.type === 'world');
    const steps = ev.filter((e) => e.type === 'step');
    out.worldOnBar = !!w && steps.some((s) => s.s === 0 && Math.abs(s.time - w.time) < 1e-6);
    const sd = 60 / E.PRESETS[0].bpm / 4;
    out.evenSteps = steps.slice(1).every((s, i) => Math.abs(s.time - steps[i].time - sd) < 1e-6);
    // handoff: two bars of build-up, then the next song on a bar line
    P.handoff(E.PRESETS[1]);
    await new Promise((r) => setTimeout(r, 7500));
    const h = ev.find((e) => e.type === 'handoff'), sg = ev.find((e) => e.type === 'song');
    out.handoff = !!h && !!sg && Math.abs(sg.time - h.time - 2 * 16 * sd) < 1e-6 && P.song.name === E.PRESETS[1].name;
    P.stop();
    return out;
  });
  ok('engine: five built-in songs', r.presets === 5, r.presets);
  ok('engine: every preset melody note is in its key', r.inKey);
  ok('engine: guardrails clean a bad song', JSON.stringify(r.guard) === JSON.stringify({ chords: [0, 3, 4, 4], bpm: 140, key: 9, mel: [-1, -1, -1] }), r.guard);
  ok('engine: Bright songs use only major chords', r.brightOnlyMajor);
  ok('engine: it makes sound, at the level of the Sunset Drive files (World 5, dBFS RMS)', r.rmsW5 > -19 && r.rmsW5 < -12, Math.round(r.rmsW5 * 10) / 10);
  ok('engine: steps evenly spaced at the tempo', r.evenSteps);
  ok('engine: a world change waits for the bar line', r.worldOnBar);
  ok('engine: handoff = two bars, then the next song', r.handoff);
  ok('engine: no script errors', errors.length === 0, errors.slice(0, 3));
  await page.context().close();
}

// ---- 2. the Studio page ----
{
  const { page, errors } = await newPage();
  await page.goto(base + '/studio/');
  await page.waitForFunction(() => !!window.STUDIO);
  ok('page: starts with one song of your own', await page.evaluate(() => STUDIO.songs().length === 1 && !STUDIO.cur.preset));
  await page.click('#play');
  await page.waitForTimeout(1500);
  ok('page: Play plays', await page.evaluate(() => STUDIO.player.playing && STUDIO.player.step > 4));
  // tap a beat square, a melody square, a chord
  await page.click('#beat .cell[data-d="clap"][data-s="2"]');
  const mel = await page.$$('#mel .cell');
  await mel[3].click();
  await page.click('#chords .chordbtn[data-i="0"]');
  await page.click('#chordPick .chip:last-child');
  await page.click('#mood .chip:nth-child(3)');   // Moody
  await page.waitForTimeout(400);
  const st = await page.evaluate(() => ({ clap: STUDIO.cur.drums.clap[2], mel: STUDIO.cur.melody[0].some((n) => n >= 0), mood: STUDIO.cur.mood, playerMood: STUDIO.player.song.mood, saved: JSON.parse(localStorage.getItem('speeder.studio.songs'))[0].mood }));
  ok('page: edits apply live and save', st.clap === 1 && st.mel && st.mood === 'moody' && st.playerMood === 'moody' && st.saved === 'moody', st);
  await page.click('#presets .chip:nth-child(2)');
  await page.selectOption('#loop0', { index: 1 });
  ok('studio: opening it switches its songs on for this device', await page.evaluate(() => localStorage.getItem('speeder.studio.use') === '1' && document.getElementById('useLab').checked));
  const lab = await page.evaluate(() => JSON.parse(localStorage.getItem('speeder.studio.lab')));
  ok('page: new song from a preset and a Lab playlist', Array.isArray(lab) && lab.length === 5, lab);
  await page.click('#play');
  ok('page: no script errors', errors.length === 0, errors.slice(0, 3));
  await page.context().close();
}

// ---- 3. a Lab run on Studio songs ----
{
  const mine = { id: 'mine1', name: 'Test Track', bpm: 120, key: 0, mood: 'bright' };
  const { page, errors } = await newPage((s) => {
    localStorage.setItem('speeder.soundReset', '3');
    localStorage.setItem('speeder.lab.cfg', JSON.stringify({ jump: { on: false }, ramps: { on: false }, lane: { on: false }, music: { on: true, song: 'studio' } }));
    localStorage.setItem('speeder.studio.use', '1');
    localStorage.setItem('speeder.studio.songs', JSON.stringify([s]));
  }, mine);
  await page.goto(base + '/?dev');
  await page.waitForFunction(() => !!window.SPEEDER);
  const IN = (code) => page.evaluate((c) => SPEEDER.inside(c), code);
  await page.evaluate(() => { SPEEDER.SET.sound = true; SPEEDER.SET.music = true; SPEEDER.SET.volume = 80; });
  await IN(`() => { audioInit(); }`);
  ok('lab: the Studio choice is only offered on a phone that opened the Studio', await page.evaluate(() => { const c = SPEEDER.LAB_EXPERIMENTS.find((x) => x.id === 'music').opts[0].choices.find((ch) => ch.id === 'studio'); return !!c && typeof c.only === 'function' && c.only() === true; }));
  await page.evaluate(() => { SPEEDER.setMode('lab'); SPEEDER.startGame(); SPEEDER.G.invuln = 1e9; });
  await page.waitForFunction(() => SPEEDER.ST.player && SPEEDER.ST.player.playing, null, { timeout: 15000 });
  let s = await IN(`() => ({ name: ST.player.song.name, list: ST.list.map((x) => x.name), w: ST.player.world, old: AU.musicBus.gain.value, files: !!LM.cur })`);
  ok('lab: your own song plays in loop 1, built-ins fill the rest', s.name === 'Test Track' && s.list.length === 5 && s.list[1] === 'Sunset Drive (punchy)', s);
  ok('lab: no Sunset Drive files and the old track muted', !s.files && s.old < 0.01, s);
  await page.evaluate(() => { SPEEDER.enterWorld(); SPEEDER.G.invuln = 1e9; });
  await page.waitForTimeout(2600);
  ok('lab: world 2 reaches the player', (await IN(`() => ST.player.world`)) === 1);
  await page.evaluate(() => { SPEEDER.startLane('resume'); });
  await page.waitForTimeout(2600);
  ok('lab: a hyperlane plays the Lane layers', (await IN(`() => ST.player.world`)) === 5);
  await IN(`() => { LANE.on = false; }`);
  await page.evaluate(() => { SPEEDER.startBoss(); SPEEDER.G.invuln = 1e9; });
  await IN(`() => { bossDown(WP.boss || { x: 0, d: G.d + 40 }); }`);
  await page.waitForFunction(() => SPEEDER.ST.player.song.name === 'Sunset Drive (punchy)', null, { timeout: 12000 }).catch(() => {});
  s = await IN(`() => ({ name: ST.player.song.name, song: ST.song, best: LM.best, key: AU.key })`);
  ok('lab: after the Warden it hands off to the loop-2 song', s.name === 'Sunset Drive (punchy)' && s.song === 1 && s.best === 2 && Math.abs(s.key - Math.pow(2, 2 / 12)) < 1e-6, s);
  await page.evaluate(() => { SPEEDER.G.invuln = 0; SPEEDER.die(); });
  await page.waitForTimeout(1500);
  ok('lab: a crash fades it out', await IN(`() => !ST.player || !ST.player.playing`));
  await page.waitForFunction(() => SPEEDER.G.state === 'over', null, { timeout: 8000 }).catch(() => {});
  ok('lab: game-over names the song', await page.evaluate(() => /Sunset Drive \(punchy\)/.test(document.getElementById('over').innerHTML)));
  ok('lab: the Lab panel does not link to the Studio', await page.evaluate(() => { SPEEDER.openPanel('lab'); return !document.querySelector('#lab a[href*="studio"]'); }));
  ok('lab: no script errors', errors.length === 0, errors.slice(0, 3));
  await page.context().close();
}

await browser.close();
server.close();
console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed ? failed + ' FAILED' : 'ALL ' + results.length + ' PASSED');
process.exit(failed ? 1 : 0);
