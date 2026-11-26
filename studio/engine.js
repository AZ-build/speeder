// Speeder Studio engine (v0.20.0)
// A small live synth and step sequencer, shared by the Studio page (studio/index.html) and the
// Lab's MUSIC experiment (index.html, "Studio" songs). A song is plain JSON (see PRESETS and
// cleanSong()). Guardrails: every note is a step of the song's scale and every hit sits on a
// 16-step grid, so whatever is drawn stays in key and on the beat.
//
// Worlds: a song has one arrangement of layers per world (World 1-5) plus one for a hyperlane.
// The player keeps its own beat clock; a change of world waits for the next bar line, and
// handoff() plays a two-bar build-up and starts the next song on its first beat.

export const KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
export const MOODS = [
  { id: 'bright', name: 'Bright', hint: 'Happy chords only (major key, no minor chords)' },
  { id: 'mixed', name: 'Mixed', hint: 'Major key, with a few minor chords for colour' },
  { id: 'moody', name: 'Moody', hint: 'Minor key: darker, more dramatic' },
];
// which chords (scale degree 0-6) each mood may use
const CHORDS_OK = { bright: [0, 3, 4], mixed: [0, 1, 2, 3, 4, 5], moody: [0, 2, 3, 4, 5, 6] };
export const LAYERS = [
  { id: 'pads', name: 'Pads' }, { id: 'bass', name: 'Bass' }, { id: 'kick', name: 'Kick' },
  { id: 'snare', name: 'Snare & clap' }, { id: 'hats', name: 'Hi-hats' }, { id: 'perc', name: 'Shaker' },
  { id: 'arp', name: 'Sparkle' }, { id: 'melody', name: 'Melody' }, { id: 'twin', name: 'Melody, high' },
];
export const WORLDS = ['W1', 'W2', 'W3', 'W4', 'W5', 'Lane'];
export const DRUMS = [
  { id: 'kick', name: 'Kick', layer: 'kick' }, { id: 'snare', name: 'Snare', layer: 'snare' },
  { id: 'clap', name: 'Clap', layer: 'snare' }, { id: 'hat', name: 'Hat', layer: 'hats' },
  { id: 'open', name: 'Open hat', layer: 'hats' }, { id: 'shaker', name: 'Shaker', layer: 'perc' },
];
const P = (s) => s.split('').map((c) => (c === 'X' ? 2 : c === 'x' ? 1 : 0));   // 'x...' -> [1,0,0,0]
export const DRUM_PRESETS = {
  'Four on the floor': { kick: P('x...x...x...x...'), snare: P('....x.......x...'), clap: P('....x.......x...'), hat: P('xxXxxxXxxxXxxxXx'), open: P('..x...x...x...x.'), shaker: P('.x.x.x.x.x.x.x.x') },
  'Half-time': { kick: P('x.........x.....'), snare: P('........x.......'), clap: P('........x.......'), hat: P('x.x.x.x.x.x.x.x.'), open: P('......x.........'), shaker: P('..x...x...x...x.') },
  'Disco': { kick: P('x...x...x...x...'), snare: P('....x.......x...'), clap: P('................'), hat: P('x.x.x.x.x.x.x.x.'), open: P('..X...X...X...X.'), shaker: P('xxxxxxxxxxxxxxxx') },
  'Breakbeat': { kick: P('x.....x...x.....'), snare: P('....x..x.x..x...'), clap: P('....x.......x...'), hat: P('x.x.x.x.x.x.x.xx'), open: P('..............x.'), shaker: P('.x.x.x.x.x.x.x.x') },
  'Driving': { kick: P('x.x.x.x.x.x.x.x.'), snare: P('....x.......x...'), clap: P('............x...'), hat: P('.x.x.x.x.x.x.x.x'), open: P('..x...x...x...x.'), shaker: P('xxxxxxxxxxxxxxxx') },
  'Sunset (old)': { kick: P('x.........x.....'), snare: P('........x.......'), clap: P('........x.......'), hat: P('x.x.x.x.x.x.x.x.'), open: P('................'), shaker: P('....x.......x...') },
};
export const CHORD_PRESETS = {
  bright: { 'Anthem (I V IV V)': [0, 4, 3, 4], 'Drive (I IV V IV)': [0, 3, 4, 3], 'Lift (IV V I I)': [3, 4, 0, 0], 'Sunny (I I IV V)': [0, 0, 3, 4] },
  mixed: { 'Pop (I V vi IV)': [0, 4, 5, 3], 'Sunset (IV iii ii V)': [3, 2, 1, 4], 'Dreamy (I iii IV V)': [0, 2, 3, 4], 'Journey (vi IV I V)': [5, 3, 0, 4] },
  moody: { 'Epic (i VI III VII)': [0, 5, 2, 6], 'Chase (i VII VI VII)': [0, 6, 5, 6], 'Night (i iv VI V)': [0, 3, 5, 4], 'Storm (i III VII iv)': [0, 2, 6, 3] },
};
export const BASS_STYLES = [
  { id: 'offbeat', name: 'House offbeat' }, { id: 'pulse', name: 'Pulse 8ths' }, { id: 'octave', name: 'Octave bounce' },
  { id: 'rolling', name: 'Rolling 16ths' }, { id: 'sunset', name: 'Sunset groove' }, { id: 'long', name: 'Long notes' },
];
export const ARP_STYLES = [{ id: 'up', name: 'Up' }, { id: 'updown', name: 'Up & down' }, { id: 'bounce', name: 'Bounce' }, { id: 'random', name: 'Random' }];
export const ARP_SOUNDS = [{ id: 'pluck', name: 'Pluck' }, { id: 'marimba', name: 'Marimba' }, { id: 'bell', name: 'Bell' }];
export const LEAD_SOUNDS = [{ id: 'soft', name: 'Soft synth' }, { id: 'flute', name: 'Flute' }, { id: 'square', name: 'Bright square' }];
export const PAD_SOUNDS = [{ id: 'warm', name: 'Warm' }, { id: 'glass', name: 'Glass' }];
export const BUILDS = {
  'Punchy': { pads: '111111', bass: '111110', kick: '111110', snare: '011110', hats: '011111', perc: '001110', arp: '001111', melody: '000110', twin: '000010' },
  'Slow burn': { pads: '111111', bass: '011110', kick: '001110', snare: '001110', hats: '011111', perc: '000110', arp: '011111', melody: '000110', twin: '000010' },
  'All in': { pads: '111111', bass: '111110', kick: '111110', snare: '111110', hats: '111111', perc: '111110', arp: '111111', melody: '111110', twin: '000010' },
};
const buildOf = (name) => Object.fromEntries(Object.entries(BUILDS[name]).map(([k, v]) => [k, v.split('').map((c) => c === '1')]));

// ---------- theory ----------
export function scaleOf(song) { return song.mood === 'moody' ? MINOR : MAJOR; }
const rootMidi = (song) => 48 + song.key;                     // C3..B3
export function stepMidi(song, step) {                       // scale step (0 = the key's root) -> MIDI note
  const sc = scaleOf(song), o = Math.floor(step / 7), d = ((step % 7) + 7) % 7;
  return rootMidi(song) + sc[d] + 12 * o;
}
export function chordsAllowed(song) { return CHORDS_OK[song.mood] || CHORDS_OK.mixed; }
export function chordName(song, deg) {
  const r = stepMidi(song, deg), third = stepMidi(song, deg + 2) - r, fifth = stepMidi(song, deg + 4) - r;
  return KEYS[r % 12] + (third === 3 ? (fifth === 6 ? 'dim' : 'm') : '');
}
// pad voicing: chord tones squeezed into G3..F#5
export function chordNotes(song, deg) {
  const tones = [0, 2, 4].concat(song.rich ? [6] : []).map((i) => stepMidi(song, deg + i));
  const pad = tones.map((m) => { while (m < 55) m += 12; while (m > 74) m -= 12; return m; }).sort((a, b) => a - b);
  let bass = stepMidi(song, deg);
  while (bass < 36) bass += 12;
  while (bass > 47) bass -= 12;
  return { pad, bass, tones };
}
// melody rows: scale steps from the key's root (octave 4) up two octaves; "safe notes" keeps the five-note (pentatonic) scale
const PENTA = { major: [0, 1, 2, 4, 5], minor: [0, 2, 3, 4, 6] };
export function melodyRows(song) {
  const ok = PENTA[song.mood === 'moody' ? 'minor' : 'major'];
  const rows = [];
  for (let s = 0; s <= 14; s++) if (!song.safe || ok.includes(s % 7)) rows.push(s);
  return rows.reverse();          // high notes at the top
}
export function melodyMidi(song, step) { return stepMidi(song, step) + 12; }
export function noteName(song, step) { const m = melodyMidi(song, step); return KEYS[m % 12] + (Math.floor(m / 12) - 1); }

// ---------- songs ----------
const empty16 = () => new Array(16).fill(-1);
function melodyFrom(list) {        // [[bar, step, scaleStep], ...] -> 8 bars x 16 steps
  const m = Array.from({ length: 8 }, empty16);
  for (const [b, s, n] of list) m[b][s] = n;
  return m;
}
const SUNSET_THEME = melodyFrom([[0, 0, 5], [0, 6, 4], [0, 8, 2], [1, 0, 4], [1, 4, 6], [1, 8, 8], [2, 0, 7], [2, 6, 5], [2, 8, 3], [2, 12, 4],
  [3, 0, 4], [3, 8, 5], [3, 10, 6], [4, 0, 5], [4, 6, 4], [4, 8, 2], [5, 0, 4], [5, 4, 6], [5, 8, 8], [5, 12, 9], [6, 0, 10], [6, 6, 9], [6, 8, 7],
  [7, 0, 8], [7, 8, 6], [7, 12, 4]]);
function base(name, o) {
  return Object.assign({
    v: 1, id: 'preset-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, preset: true,
    bpm: 104, key: 2, mood: 'bright', swing: 0.08, rich: true, safe: true, fills: true,
    drums: JSON.parse(JSON.stringify(DRUM_PRESETS['Four on the floor'])),
    chords: [0, 4, 3, 4], bass: 'offbeat', bassTone: 0.4,
    arp: { style: 'up', rate: 8, sound: 'pluck' }, lead: 'soft', pad: 'warm',
    melody: Array.from({ length: 8 }, empty16), melodySeed: 1,
    build: buildOf('Punchy'),
    mix: { reverb: 0.35, punch: 0.6, drums: 0.8, melody: 0.7, bright: 0.55 },
  }, o);
}
export const PRESETS = [
  base('Sunset Drive (punchy)', { bpm: 104, key: 2, mood: 'bright', safe: false, chords: [3, 4, 0, 4], melody: SUNSET_THEME, bass: 'offbeat', arp: { style: 'up', rate: 8, sound: 'pluck' } }),
  base('Neon Pulse', { bpm: 112, key: 4, mood: 'bright', chords: [0, 4, 3, 3], drums: JSON.parse(JSON.stringify(DRUM_PRESETS['Disco'])), bass: 'octave', arp: { style: 'updown', rate: 16, sound: 'marimba' }, melodySeed: 7 }),
  base('Night Cruise', { bpm: 100, key: 7, mood: 'mixed', chords: [0, 4, 5, 3], drums: JSON.parse(JSON.stringify(DRUM_PRESETS['Half-time'])), bass: 'sunset', lead: 'flute', arp: { style: 'bounce', rate: 8, sound: 'bell' }, melodySeed: 23, build: buildOf('Slow burn') }),
  base('Sky Rush', { bpm: 120, key: 9, mood: 'bright', chords: [0, 3, 4, 3], drums: JSON.parse(JSON.stringify(DRUM_PRESETS['Breakbeat'])), bass: 'rolling', arp: { style: 'up', rate: 16, sound: 'bell' }, lead: 'square', melodySeed: 41 }),
  base('Final Lap', { bpm: 126, key: 5, mood: 'bright', chords: [3, 4, 0, 0], drums: JSON.parse(JSON.stringify(DRUM_PRESETS['Driving'])), bass: 'pulse', arp: { style: 'updown', rate: 16, sound: 'pluck' }, lead: 'square', melodySeed: 77, build: buildOf('All in') }),
];
export function presetBuild(name) { return buildOf(name); }

// make any song safe to play: missing fields filled from the first preset, numbers clamped,
// chords moved into the mood, melody notes kept on the grid and in range (the guardrails)
export function cleanSong(src) {
  const d = PRESETS[0];
  const s = Object.assign({}, JSON.parse(JSON.stringify(d)), JSON.parse(JSON.stringify(src || {})));
  s.bpm = Math.round(Math.min(140, Math.max(80, +s.bpm || 104)));
  s.key = ((Math.round(+s.key) || 0) % 12 + 12) % 12;
  if (!MOODS.some((m) => m.id === s.mood)) s.mood = 'bright';
  s.swing = Math.min(0.5, Math.max(0, +s.swing || 0));
  const ok = chordsAllowed(s);
  s.chords = (Array.isArray(s.chords) ? s.chords : d.chords).slice(0, 4);
  while (s.chords.length < 4) s.chords.push(0);
  s.chords = s.chords.map((c) => (ok.includes(c) ? c : ok.reduce((a, b) => (Math.abs(b - c) < Math.abs(a - c) ? b : a))));
  for (const dr of DRUMS) {
    const a = s.drums && Array.isArray(s.drums[dr.id]) ? s.drums[dr.id] : [];
    s.drums[dr.id] = Array.from({ length: 16 }, (_, i) => Math.min(2, Math.max(0, a[i] | 0)));
  }
  s.melody = Array.from({ length: 8 }, (_, b) => Array.from({ length: 16 }, (_, i) => {
    const v = s.melody && s.melody[b] ? s.melody[b][i] : -1;
    return Number.isInteger(v) && v >= 0 && v <= 14 ? v : -1;
  }));
  for (const L of LAYERS) {
    const a = s.build && Array.isArray(s.build[L.id]) ? s.build[L.id] : d.build[L.id];
    s.build[L.id] = Array.from({ length: 6 }, (_, i) => !!a[i]);
  }
  if (!BASS_STYLES.some((b) => b.id === s.bass)) s.bass = 'offbeat';
  s.arp = Object.assign({ style: 'up', rate: 8, sound: 'pluck' }, s.arp);
  if (s.arp.rate !== 16) s.arp.rate = 8;
  for (const k of ['reverb', 'punch', 'drums', 'melody', 'bright']) s.mix[k] = Math.min(1, Math.max(0, s.mix[k] == null ? d.mix[k] : +s.mix[k]));
  s.bassTone = Math.min(1, Math.max(0, s.bassTone == null ? 0.4 : +s.bassTone));
  s.name = String(s.name || 'My song').slice(0, 40);
  return s;
}

// "Surprise me": a new 8-bar melody that stays in key, leans on the chord on strong beats and
// moves mostly by step, shaped A A' B A'' so it sounds like a tune
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const RHYTHMS = [[0, 6, 8], [0, 4, 8, 12], [0, 3, 6, 8, 12], [0, 8, 10, 12], [0, 2, 4, 8], [0, 6, 8, 10, 12], [0, 4, 6, 8]];
export function surpriseMelody(song, seed) {
  const r = rng(seed || Date.now()), rows = melodyRows(Object.assign({}, song, { safe: true })).slice().reverse();
  const lo = rows[0], hi = Math.min(rows[rows.length - 1], 11);
  const near = (target, from) => rows.filter((x) => x >= lo && x <= hi).reduce((a, b) => (Math.abs(b - target) + Math.abs(b - from) * 0.3 < Math.abs(a - target) + Math.abs(a - from) * 0.3 ? b : a));
  const bar = (bi, rhythm, start) => {
    const out = empty16();
    let cur = start;
    const deg = song.chords[bi % 4];
    rhythm.forEach((st, i) => {
      if (st === 0 || st === 8) cur = near(deg + [0, 2, 4][(r() * 3) | 0] + (r() < 0.5 ? 7 : 0), cur);
      else cur = near(cur + (r() < 0.5 ? -1 : 1) * (1 + ((r() * 2) | 0)), cur);
      out[st] = cur;
    });
    return out;
  };
  const A = [0, 1, 2, 3].map((b) => RHYTHMS[(r() * RHYTHMS.length) | 0]);
  const m = [];
  let start = 4;
  for (let b = 0; b < 8; b++) {
    const rh = b < 4 ? A[b] : b === 4 || b === 5 ? A[b - 4] : RHYTHMS[(r() * RHYTHMS.length) | 0];
    m.push(bar(b, rh, start));
    const last = m[b].filter((x) => x >= 0).pop();
    if (last != null) start = last;
  }
  // end on the home note (or its fifth) so the loop resolves
  const end = m[7], li = end.reduce((a, v, i) => (v >= 0 ? i : a), -1);
  if (li >= 0) end[li] = near(r() < 0.6 ? 7 : 4, end[li]);
  return m;
}

// the presets without a hand-written melody get a generated one
for (const p of PRESETS) if (p.melody.every((b) => b.every((n) => n < 0))) p.melody = surpriseMelody(p, p.melodySeed);

// ---------- the player ----------
let NOISE = null;
function noiseBuf(ctx) {
  if (NOISE && NOISE.sampleRate === ctx.sampleRate) return NOISE;
  const n = ctx.sampleRate;
  NOISE = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = NOISE.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return NOISE;
}
function impulse(ctx, sec) {
  const n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    for (let i = 0; i < n; i++) { const t = i / n; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3) * (0.6 + 0.4 * Math.exp(-t * 8)); }
  }
  return b;
}
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class Player {
  // ctx: an AudioContext; dest: where the music goes (the Studio's speakers, or the game's Lab music bus)
  // level: the output gain. 0.36 puts World 5 at about -15.5 dBFS RMS, the level of the Sunset Drive files.
  constructor(ctx, dest, level = 0.36) {
    this.ctx = ctx;
    const g = (v) => { const x = ctx.createGain(); x.gain.value = v; return x; };
    this.level = level;
    this.out = g(level);
    this.comp = ctx.createDynamicsCompressor();
    this.comp.threshold.value = -16; this.comp.ratio.value = 3; this.comp.attack.value = 0.01; this.comp.release.value = 0.2;
    this.cut = ctx.createBiquadFilter(); this.cut.type = 'lowpass'; this.cut.frequency.value = 18000;
    this.comp.connect(this.cut); this.cut.connect(this.out); this.out.connect(dest);
    this.mix = g(1); this.mix.connect(this.comp);
    // buses
    this.drumBus = g(0.8);
    this.shaper = ctx.createWaveShaper(); this.drumBus.connect(this.shaper); this.shaper.connect(this.mix);
    this.pump = g(1); this.pump.connect(this.mix);                  // pads + bass, ducked by the kick
    this.padBus = g(0.5); this.padBus.connect(this.pump);
    this.bassBus = g(0.75); this.bassBus.connect(this.pump);
    this.arpBus = g(0.32); this.arpBus.connect(this.mix);
    this.leadBus = g(0.42); this.leadBus.connect(this.mix);
    // reverb and a dotted-eighth echo
    this.rev = ctx.createConvolver(); this.rev.buffer = impulse(ctx, 2.6);
    this.revIn = g(0.35); this.revIn.connect(this.rev); this.rev.connect(this.mix);
    this.dly = ctx.createDelay(1.5); this.fb = g(0.38); this.dlyLp = ctx.createBiquadFilter(); this.dlyLp.type = 'lowpass'; this.dlyLp.frequency.value = 2800;
    this.dlyIn = g(0.35); this.dlyIn.connect(this.dly); this.dly.connect(this.dlyLp); this.dlyLp.connect(this.fb); this.fb.connect(this.dly); this.dlyLp.connect(this.mix);
    for (const b of [this.padBus, this.arpBus, this.leadBus]) b.connect(this.revIn);
    for (const b of [this.arpBus, this.leadBus]) b.connect(this.dlyIn);
    this.snareRev = g(0.3); this.snareRev.connect(this.revIn);
    this.song = null; this.world = 0; this.boss = false; this.next = null; this.handoffTo = null;
    this.timer = null; this.playing = false; this.listeners = [];
    this.applyMix();
  }
  setSong(song) { this.song = cleanSong(song); this.applyMix(); }
  applyMix() {
    if (!this.song) return;
    const m = this.song.mix;
    this.revIn.gain.value = 0.15 + 0.6 * m.reverb;
    this.drumBus.gain.value = 0.35 + 0.65 * m.drums;
    this.leadBus.gain.value = 0.15 + 0.5 * m.melody;
    const k = 1 + m.punch * 6, n = 512, c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); }
    this.shaper.curve = c;
    this.dly.delayTime.value = Math.min(1.4, (60 / this.song.bpm) * 0.75);
  }
  on(fn) { this.listeners.push(fn); }
  emit(e) { for (const f of this.listeners) try { f(e); } catch (x) { /* a listener's problem, not the music's */ } }
  get stepDur() { return 60 / this.song.bpm / 4; }
  // start playing `world` (0-4, or 5 for a hyperlane) at `when`
  start(world = 0, when) {
    this.stop();
    this.world = world; this.next = null; this.handoffTo = null; this.gate = 0;
    this.step = 0; this.t = Math.max(this.ctx.currentTime + 0.05, when || 0);
    this.out.gain.cancelScheduledValues(this.ctx.currentTime);
    this.out.gain.setValueAtTime(this.level, this.ctx.currentTime);
    this.playing = true;
    this.timer = setInterval(() => this.pumpSteps(), 25);
    this.pumpSteps();
  }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; this.playing = false; }
  // fade out and stop (a crash in the game)
  fadeOut(sec = 0.9) {
    const t = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(t); this.out.gain.setValueAtTime(this.out.gain.value, t); this.out.gain.linearRampToValueAtTime(0, t + sec);
    this.cut.frequency.cancelScheduledValues(t); this.cut.frequency.setValueAtTime(this.cut.frequency.value, t); this.cut.frequency.exponentialRampToValueAtTime(220, t + sec);
    setTimeout(() => { this.stop(); this.cut.frequency.value = 18000; }, sec * 1000 + 100);
  }
  // world changes wait for the next bar line
  setWorld(w, boss) { if (w !== this.world || !!boss !== this.boss) this.next = { w, boss: !!boss }; }
  // after the Warden: two bars of build-up, then `song` from its first beat
  handoff(song) { this.handoffTo = cleanSong(song); }
  pumpSteps() {
    const ahead = this.ctx.currentTime + 0.14;
    while (this.playing && this.t < ahead) {
      const s = this.step % 16;
      if (s === 0) this.barStart();
      const dur = this.stepDur;
      const swing = s % 2 === 1 ? this.song.swing * dur * 0.6 : 0;
      if (this.gate > 0) this.gateStep(s, this.t + swing);
      else this.playStep(this.step, this.t + swing);
      this.emit({ type: 'step', step: this.step, s, bar: Math.floor(this.step / 16), time: this.t, world: this.world, gate: this.gate > 0 });
      this.t += dur;
      this.step++;
    }
  }
  barStart() {
    const t = this.t;
    if (this.gate > 0) {
      this.gate--;
      if (this.gate === 0) {             // build-up over: the next song, from its first beat
        this.song = this.handoffTo; this.handoffTo = null; this.applyMix();
        this.step = 0; this.world = this.next ? this.next.w : 0; this.boss = this.next ? this.next.boss : false; this.next = null;
        this.crash(t, 0.8); this.kick(t, 1.2);
        this.emit({ type: 'song', song: this.song, time: t });
      }
    } else if (this.handoffTo) {
      this.gate = 2; this.gateBar = 0;
      this.emit({ type: 'handoff', time: t });
    } else if (this.next) {
      this.world = this.next.w; this.boss = this.next.boss; this.next = null;
      this.emit({ type: 'world', world: this.world, time: t });
    }
    if (this.gate === 0) {
      const bar = Math.floor(this.step / 16), deg = this.song.chords[bar % 4];
      if (this.has('pads')) this.pad(t, chordNotes(this.song, deg).pad, 16 * this.stepDur);
      if (this.boss && bar % 8 === 0) this.crash(t, 0.5);
    }
  }
  has(layer) { const b = this.song.build[layer]; return !!(b && b[this.world]); }
  playStep(step, t) {
    const S = this.song, s = step % 16, bar = Math.floor(step / 16), b8 = bar % 8, dur = this.stepDur;
    const ch = chordNotes(S, S.chords[bar % 4]);
    const fill = S.fills && b8 === 7 && s >= 12 && this.has('snare');
    // drums
    for (const d of DRUMS) {
      const v = S.drums[d.id][s];
      if (!v || !this.has(d.layer)) continue;
      if (fill && (d.id === 'snare' || d.id === 'kick')) continue;
      const vel = v === 2 ? 1 : 0.7;
      if (d.id === 'kick') this.kick(t, vel);
      else if (d.id === 'snare') this.snare(t, vel);
      else if (d.id === 'clap') this.clap(t, vel);
      else if (d.id === 'hat') this.hat(t, vel, false);
      else if (d.id === 'open') this.hat(t, vel, true);
      else this.shaker(t, vel);
    }
    if (fill) this.snare(t, 0.35 + 0.15 * (s - 12));
    // bass
    if (this.has('bass')) {
      const r = ch.bass, pat = BASS_PAT[S.bass] || BASS_PAT.offbeat;
      for (const [st, len, iv] of pat) if (st === s) this.bass(t, r + iv, len * dur);
    }
    // sparkle (arpeggio)
    if (this.has('arp')) {
      const every = S.arp.rate === 16 ? 1 : 2;
      if (s % every === 0) {
        const tones = ch.tones.slice(0, 3).map((m) => { while (m < 62) m += 12; while (m > 78) m -= 12; return m; }).sort((a, b) => a - b);
        tones.push(tones[0] + 12);
        const i = s / every;
        const n = arpIndex(S.arp.style, i, tones.length, bar);
        this.pluck(t, tones[n], i % 2 ? 0.6 : 0.8);
      }
    }
    // melody
    const m = S.melody[b8][s];
    if (m >= 0 && (this.has('melody') || this.has('twin'))) {
      const len = melodyLen(S, b8, s) * dur;
      if (this.has('melody')) this.lead(t, melodyMidi(S, m), len, 0.9);
      if (this.has('twin')) this.lead(t, melodyMidi(S, m) + 12, len, 0.45);
    }
  }
  // the two bars after the Warden: chord held, riser, snare roll into the next song
  gateStep(s, t) {
    const dur = this.stepDur;
    if (this.gateBar === 0 && s === 0) {
      const S = this.song, ch = chordNotes(S, S.chords[3]);
      this.pad(t, ch.pad, 32 * dur);
      this.bass(t, ch.bass, 16 * dur);
      this.riser(t, 32 * dur);
    }
    if (this.gate === 1) this.snare(t, 0.15 + 0.6 * Math.pow(s / 15, 2));
    if (s === 15) this.gateBar++;
  }
  setCut(freq, time) { this.cut.frequency.setTargetAtTime(freq, time || this.ctx.currentTime, 0.12); }

  // ---------- instruments ----------
  env(gain, t, a, peak, d, sustain, rel, end) {
    const p = gain.gain;
    p.setValueAtTime(0.0001, t);
    p.linearRampToValueAtTime(peak, t + a);
    if (d) p.setTargetAtTime(peak * sustain, t + a, d);
    if (end != null) { p.setValueAtTime(peak * (d ? sustain : 1), end); p.setTargetAtTime(0.0001, end, rel); }
  }
  noise(t, len, filterType, freq, q, dest, gainCurve) {
    const c = this.ctx, src = c.createBufferSource();
    src.buffer = noiseBuf(c);
    src.loopStart = 0; src.loop = true;
    const f = c.createBiquadFilter(); f.type = filterType; f.frequency.value = freq; f.Q.value = q || 0.7;
    const g = c.createGain();
    src.connect(f); f.connect(g); g.connect(dest);
    gainCurve(g.gain, f);
    src.start(t, Math.random() * 0.5); src.stop(t + len);
    return g;
  }
  duck(t) {
    const p = this.pump.gain, beat = 60 / this.song.bpm;
    p.cancelScheduledValues(t);
    p.setValueAtTime(0.45, t);
    p.linearRampToValueAtTime(1, t + beat * 0.55);
  }
  kick(t, v) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(155, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.11);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(1.1 * v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    o.connect(g); g.connect(this.drumBus); o.start(t); o.stop(t + 0.45);
    this.noise(t, 0.02, 'highpass', 2500, 0.7, this.drumBus, (p) => { p.setValueAtTime(0.35 * v * (0.5 + this.song.mix.punch), t); p.exponentialRampToValueAtTime(0.001, t + 0.012); });
    this.duck(t);
  }
  snare(t, v) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(170, t + 0.05);
    g.gain.setValueAtTime(0.5 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(g); g.connect(this.drumBus); o.start(t); o.stop(t + 0.1);
    const n = this.noise(t, 0.25, 'bandpass', 2400, 0.6, this.drumBus, (p) => { p.setValueAtTime(0.75 * v, t); p.exponentialRampToValueAtTime(0.001, t + 0.2); });
    n.connect(this.snareRev);
  }
  clap(t, v) {
    const n = this.noise(t, 0.3, 'bandpass', 1300, 1.2, this.drumBus, (p) => {
      p.setValueAtTime(0.0001, t);
      for (const d of [0, 0.011, 0.022]) { p.setValueAtTime(0.8 * v, t + d); p.exponentialRampToValueAtTime(0.08, t + d + 0.009); }
      p.setValueAtTime(0.55 * v, t + 0.032); p.exponentialRampToValueAtTime(0.001, t + 0.22);
    });
    n.connect(this.snareRev);
  }
  hat(t, v, open) {
    const len = open ? 0.28 : 0.05;
    this.noise(t, len + 0.02, 'highpass', open ? 7000 : 8000, 0.8, this.drumBus, (p) => { p.setValueAtTime(0.32 * v, t); p.exponentialRampToValueAtTime(0.001, t + len); });
  }
  shaker(t, v) {
    this.noise(t, 0.1, 'bandpass', 7500, 1, this.drumBus, (p) => { p.setValueAtTime(0.0001, t); p.linearRampToValueAtTime(0.2 * v, t + 0.018); p.exponentialRampToValueAtTime(0.001, t + 0.08); });
  }
  crash(t, v) {
    this.noise(t, 1.8, 'highpass', 5000, 0.5, this.drumBus, (p) => { p.setValueAtTime(0.3 * v, t); p.exponentialRampToValueAtTime(0.001, t + 1.7); }).connect(this.revIn);
  }
  riser(t, len) {
    this.noise(t, len, 'bandpass', 300, 2, this.mix, (p, f) => {
      p.setValueAtTime(0.0001, t); p.exponentialRampToValueAtTime(0.25, t + len);
      f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(7000, t + len);
    });
  }
  bass(t, m, len) {
    const c = this.ctx, f = mtof(m), g = c.createGain(), lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 260 + 1100 * this.song.bassTone; lp.Q.value = 1.5;
    const o1 = c.createOscillator(), o2 = c.createOscillator();
    o1.type = 'sine'; o1.frequency.value = f; o2.type = 'sawtooth'; o2.frequency.value = f;
    const g2 = c.createGain(); g2.gain.value = 0.35 + 0.4 * this.song.bassTone;
    o1.connect(g); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(this.bassBus);
    const end = t + Math.max(0.08, len * 0.92);
    this.env(g, t, 0.006, 0.9, 0.15, 0.7, 0.04, end);
    o1.start(t); o2.start(t); o1.stop(end + 0.25); o2.stop(end + 0.25);
  }
  pad(t, notes, len) {
    const c = this.ctx, lp = c.createBiquadFilter(), g = c.createGain();
    const glass = this.song.pad === 'glass';
    lp.type = 'lowpass'; lp.frequency.value = 600 + 3600 * this.song.mix.bright; lp.Q.value = 0.5;
    lp.connect(g); g.connect(this.padBus);
    const end = t + len;
    this.env(g, t, 0.25, 0.22 / Math.sqrt(notes.length), 0, 1, 0.45, end);
    for (const m of notes) for (const cents of glass ? [-5, 5] : [-9, 0, 9]) {
      const o = c.createOscillator();
      o.type = glass ? 'triangle' : 'sawtooth';
      o.frequency.value = mtof(glass ? m + 12 : m);
      o.detune.value = cents;
      o.connect(lp); o.start(t); o.stop(end + 2.2);
    }
  }
  pluck(t, m, v) {
    const c = this.ctx, f = mtof(m), g = c.createGain(), snd = this.song.arp.sound;
    g.connect(this.arpBus);
    if (snd === 'pluck') {
      const o = c.createOscillator(), lp = c.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = f;
      lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.setValueAtTime(3500, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.18);
      o.connect(lp); lp.connect(g);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.5 * v, t + 0.003); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.4);
    } else {
      const parts = snd === 'marimba' ? [[1, 1, 0.45], [3.93, 0.35, 0.07], [9.2, 0.1, 0.02]] : [[1, 1, 0.9], [2.76, 0.4, 0.25], [5.4, 0.15, 0.08]];
      for (const [mult, amp, dec] of parts) {
        const o = c.createOscillator(), pg = c.createGain();
        o.type = 'sine'; o.frequency.value = f * mult;
        pg.gain.setValueAtTime(0.0001, t); pg.gain.linearRampToValueAtTime(0.55 * v * amp, t + 0.002); pg.gain.exponentialRampToValueAtTime(0.0005, t + dec * 3);
        o.connect(pg); pg.connect(g); o.start(t); o.stop(t + dec * 3 + 0.05);
      }
      g.gain.value = 1;
    }
  }
  lead(t, m, len, v) {
    const c = this.ctx, f = mtof(m), g = c.createGain(), lp = c.createBiquadFilter(), snd = this.song.lead;
    lp.type = 'lowpass'; lp.frequency.value = snd === 'square' ? 3000 : snd === 'flute' ? 2600 : 2200;
    lp.connect(g); g.connect(this.leadBus);
    const end = t + Math.max(0.1, len * 0.95);
    this.env(g, t, snd === 'flute' ? 0.05 : 0.025, 0.4 * v, 0, 1, 0.12, end);
    const lfo = c.createOscillator(), lg = c.createGain();
    lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(12, t + 0.35);
    lfo.connect(lg);
    const types = snd === 'square' ? [['square', -6], ['square', 6]] : snd === 'flute' ? [['sine', 0], ['triangle', 3]] : [['sawtooth', -7], ['sawtooth', 7], ['sine', 0]];
    for (const [type, cents] of types) {
      const o = c.createOscillator();
      o.type = type; o.frequency.value = f; o.detune.value = cents;
      lg.connect(o.detune);
      const og = c.createGain(); og.gain.value = type === 'sine' ? 0.6 : 0.4;
      o.connect(og); og.connect(lp);
      o.start(t); o.stop(end + 0.8);
    }
    lfo.start(t); lfo.stop(end + 0.8);
  }
}
// bass patterns: [step, length in steps, interval above the chord's root]
const BASS_PAT = {
  offbeat: [[2, 2, 0], [6, 2, 0], [10, 2, 0], [14, 1, 0], [15, 1, 12]],
  pulse: [[0, 2, 0], [2, 2, 0], [4, 2, 0], [6, 2, 0], [8, 2, 0], [10, 2, 0], [12, 2, 0], [14, 2, 0]],
  octave: [[0, 2, 0], [2, 2, 12], [4, 2, 0], [6, 2, 12], [8, 2, 0], [10, 2, 12], [12, 2, 0], [14, 2, 12]],
  rolling: Array.from({ length: 16 }, (_, i) => [i, 1, i % 4 === 2 ? 12 : i % 8 === 7 ? 7 : 0]),
  sunset: [[0, 6, 0], [6, 2, 0], [10, 4, 12], [14, 2, 7]],
  long: [[0, 16, 0]],
};
function arpIndex(style, i, n, bar) {
  if (style === 'updown') { const p = 2 * (n - 1); const k = i % p; return k < n ? k : p - k; }
  if (style === 'bounce') return i % 2 ? n - 1 - ((i >> 1) % n) : (i >> 1) % n;
  if (style === 'random') { const x = Math.sin((i + 1) * 12.9898 + bar * 78.233) * 43758.5453; return Math.floor((x - Math.floor(x)) * n); }
  return i % n;
}
// a melody note lasts until the next one starts (at most 6 steps)
function melodyLen(S, b8, s) {
  for (let k = 1; k <= 6; k++) {
    const st = s + k, b = (b8 + Math.floor(st / 16)) % 8;
    if (S.melody[b][st % 16] >= 0) return k;
  }
  return 6;
}
