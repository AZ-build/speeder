// Renders a listening preview of REDLINE (audio/redline.js) offline in headless Chrome: a whole run
// squeezed into a few minutes (each world a few bars, a Warden, a loop handoff, a hyperlane, then
// top speed with its riff and fill variations). Writes a WAV and prints the loudness of each part.
//   node sound-picker/tools/redline/preview.mjs "$PWD" out.wav
import http from 'node:http';
import { readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
let chromium;
try { ({ chromium } = await import('playwright')); } catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }
const dir = process.argv[2] || process.cwd(), outFile = process.argv[3] || 'redline-preview.wav';
const server = http.createServer((req, res) => {
  const p = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const f = existsSync(p) && statSync(p).isDirectory() ? join(p, 'index.html') : p;
  if (!existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': extname(f) === '.js' ? 'text/javascript' : 'text/html' });
  res.end(readFileSync(f));
});
await new Promise((ok) => server.listen(0, ok));
const base = 'http://localhost:' + server.address().port;
const exe = '/usr/bin/google-chrome';
const browser = await chromium.launch(Object.assign({ args: ['--no-sandbox'] }, existsSync(exe) ? { executablePath: exe } : {}));
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('pageerror', e.message));
page.on('console', (m) => console.log('[page]', m.text()));
await page.goto(base + '/sound-picker/tools/redline/blank.html').catch(() => {});
const plan = JSON.parse(process.env.PLAN || 'null');
const res = await page.evaluate(async (plan) => {
  const R = await import('/audio/redline.js');
  const sr = 44100;
  // the journey: [bars, state, label]
  const J = plan || [
    [12, { loop: 1, world: 0, speed: [32, 52] }, 'Loop 1, world 1 (level 1: drone, pad, heartbeat)'],
    [8, { loop: 1, world: 1, speed: [56, 66] }, 'World 2 (level 2: kick, bass, hats)'],
    [8, { loop: 1, world: 2, speed: [68, 76] }, 'World 3 (level 3: claps, rolling bass)'],
    [8, { loop: 1, world: 3, speed: [78, 84] }, 'World 4 (level 4: arpeggio)'],
    [8, { loop: 1, world: 4, speed: [85, 89] }, 'World 5 (level 5: the hook)'],
    [8, { loop: 1, world: 4, boss: true, speed: [90, 90] }, 'The Warden (level 6)'],
    [10, { loop: 2, world: 0, speed: [92, 96] }, 'Handoff, loop 2 in E (level 4)'],
    [8, { loop: 2, world: 1, speed: [96, 99] }, 'Loop 2, world 2 (level 5)'],
    [8, { loop: 2, world: 2, speed: [100, 102] }, 'Loop 2, world 3 (level 6)'],
    [6, { loop: 2, world: 2, lane: true, speed: [102, 102] }, 'A hyperlane'],
    [26, { loop: 5, world: 1, speed: [130, 130] }, 'Handoff to loop 5 in E: top speed, riffs and fills vary'],
  ];
  const total = J.reduce((a, j) => a + j[0], 0);
  // first pass on a throwaway context to learn the length (tempo varies)
  const OC = OfflineAudioContext;
  const keys = [...new Set(J.map((j) => R.keyOfLoop(j[1].loop)))];
  const make = async (len) => {
    const oc = new OC(2, Math.ceil(len * sr), sr);
    const P = new R.Redline(oc, oc.destination, undefined, true);
    for (const k of keys) await P.prepare(k);
    return { oc, P };
  };
  const stateAt = (bars) => {
    let i = 0, acc = 0;
    return (b) => {
      while (i < J.length - 1 && b >= acc + J[i][0]) { acc += J[i][0]; i++; }
      const [n, s] = J[i], f = (b - acc) / Math.max(1, n - 1);
      const sp = s.speed[0] + (s.speed[1] - s.speed[0]) * Math.min(1, (b - acc) / Math.max(1, n));
      const last = b - acc === n - 1 && i < J.length - 1 && !J[i + 1][1].boss_noeta;
      return { loop: s.loop, world: s.world, boss: !!s.boss, lane: !!s.lane, frac: f, speed: sp, gateEta: last ? 240 / R.bpmFor(sp) * 0.6 : Infinity };
    };
  };
  const ev = [];
  let { oc, P } = await make(600);
  P.on((e) => ev.push(e));
  P.st.loop = J[0][1].loop; P.st.speed = J[0][1].speed[0];
  P.start(0.05);
  P.renderBars(total, stateAt(total));
  const len = P.T + 3;
  ({ oc, P } = await make(len));
  const ev2 = [];
  P.on((e) => ev2.push(e));
  P.st.loop = J[0][1].loop; P.st.speed = J[0][1].speed[0];
  P.start(0.05);
  // schedule as the game does: a bar at a time, just ahead of the render (suspend/resume), so
  // only the notes near "now" exist and the render time reflects the real cost
  const sa = stateAt(total);
  let b = 0;
  const feed = () => { while (b < total && P.T < oc.currentTime + 0.6) { P.set(sa(b)); P.st.at = P.T; P.bar(); b++; } };
  feed();
  for (let t = 0.5; t < len - 0.5; t += 0.5) oc.suspend(t).then(() => { feed(); oc.resume(); });
  const t0 = performance.now();
  const buf = await oc.startRendering();
  const cpu = (performance.now() - t0) / 1000 / len;
  // loudness per part
  const L = buf.getChannelData(0), Rr = buf.getChannelData(1);
  const bars = ev2.filter((e) => e.type === 'bar');
  const parts = [];
  let acc = 0;
  for (const [n, , label] of J) {
    const a = bars[acc] ? bars[acc].time : 0, bEnd = bars[acc + n] ? bars[acc + n].time : buf.duration;
    let sum = 0, peak = 0, cnt = 0;
    for (let i = Math.floor(a * sr); i < Math.floor(bEnd * sr); i++) { const x = L[i], y = Rr[i]; sum += x * x + y * y; cnt += 2; peak = Math.max(peak, Math.abs(x), Math.abs(y)); }
    parts.push({ label, from: +a.toFixed(1), rms: +(10 * Math.log10(sum / cnt)).toFixed(1), peak: +(20 * Math.log10(peak)).toFixed(1), bpm: bars[acc] ? +bars[acc].bpm.toFixed(1) : 0 });
    acc += n;
  }
  // pack as 16-bit PCM
  const n = buf.length, pcm = new Int16Array(n * 2);
  for (let i = 0; i < n; i++) { pcm[2 * i] = Math.max(-1, Math.min(1, L[i])) * 32767; pcm[2 * i + 1] = Math.max(-1, Math.min(1, Rr[i])) * 32767; }
  let bin = '';
  const u8 = new Uint8Array(pcm.buffer);
  for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return { cpu, parts, dur: buf.duration, pcm: btoa(bin), sr, fills: bars.filter((b) => b.fill).map((b) => b.fill + '@' + b.level), riffs: [...new Set(bars.map((b) => b.riff + '/' + b.prog))], events: ev2.filter((e) => e.type !== 'bar').map((e) => e.type + (e.level != null ? e.level : '') + '@' + e.time.toFixed(1)) };
}, plan);
const raw = Buffer.from(res.pcm, 'base64');
const hdr = Buffer.alloc(44);
hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + raw.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12);
hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22); hdr.writeUInt32LE(res.sr, 24); hdr.writeUInt32LE(res.sr * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34);
hdr.write('data', 36); hdr.writeUInt32LE(raw.length, 40);
writeFileSync(outFile, Buffer.concat([hdr, raw]));
console.log('length', res.dur.toFixed(1), 's; render time per second of music', res.cpu.toFixed(3), 's');
for (const p of res.parts) console.log(String(p.from).padStart(6), 's', String(p.bpm).padStart(6), 'BPM', String(p.rms).padStart(6), 'dB RMS', String(p.peak).padStart(6), 'dB peak ', p.label);
console.log('fills', res.fills.join(' '));
console.log('riffs', res.riffs.join(' '));
console.log('events', res.events.join(' '));
await browser.close(); server.close();
