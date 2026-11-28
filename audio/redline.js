// REDLINE (v0.22.0): a soundtrack for the Lab's MUSIC experiment, played live (synthesised in the
// browser, no audio files). Adrian's brief (2026-11-27): a slow-building, big electronic synth sound
// that starts low, with a beat that builds slowly and speeds up with the run; once the speeder hits
// top speed it stops getting faster and keeps itself fresh with different riffs and effects.
//
// How it follows the game (the game calls set() every frame with what's going on):
//   level   which layers play. Loop 1 climbs one level per world (1 = a dark pad, a deep drone and a
//           heartbeat kick ... 5 = the hook on top), the Warden is level 6 (everything). Loop 2 comes
//           back in at level 4 and is at 6 from its third world; loop 3 on stays at 6.
//   frac    how far through the world you are: the pad, bass and arpeggio filters open slowly across
//           each world, so it keeps building between the steps.
//   speed   the speed the road is pulling you to (not your actual speed, so a hit doesn't wobble the
//           tempo): 96 BPM at 160 km/h, about 117 at 450 (loop 1's top), 128 at 655 km/h, and never
//           faster. The tempo moves at most 1 BPM a bar.
//   gateEta seconds to the next world gate, the boss or a hyperlane's exit: the bar the gate falls in
//           gets a riser and a snare roll, and the new level lands on the bar line after it.
//   loop    a new loop (after the Warden) plays a two-bar handoff into the next key (D, E, F#, then
//           D again with the next loop's riffs).
//   lane    in a hyperlane: drums and bass drop out, the pad opens up and the arpeggio floats.
// At level 6 every 8-bar phrase picks a riff (hook, answer, soaring line, staccato lead, chord stabs)
// and an end-of-phrase fill (snare roll, reverse cymbal, toms, laser zaps, stutter, drop-out), from a
// pool that grows each loop, so the longest runs keep hearing new combinations.
//
// Cheap on phones: drums, effects and the big detuned pads and stabs are rendered once into buffers
// (an OfflineAudioContext) and played back; only the bass, arpeggio and lead are live oscillators.
// Nothing here calls Math.random (the game's random numbers stay exactly as they were).

export const NAME = 'Redline';
export const BPM_MIN = 96, BPM_MAX = 128;
const LIFT = [0.62, 0.6, 0.74, 0.84, 0.92, 1, 1.15];   // output level by level (0 = hyperlane)
// key offsets from D by loop: D, E, F#, then round again. Each handoff holds the old key's V chord,
// which is the new key's IV (A -> E, B -> F#), or a half step under its root (C# -> D): it always leads in.
export const LOOP_KEYS = [0, 2, 4];
export const keyOfLoop = (loop) => LOOP_KEYS[(Math.max(1, loop | 0) - 1) % LOOP_KEYS.length];
// the key as semitones from C, folded into -6..+6 (the game retunes its C-major pickups by it)
export const keySemis = (off) => { const k = (2 + off) % 12; return k > 6 ? k - 12 : k; };

// which layers play: by loop and world (0-4), the Warden = 6, a hyperlane = 0
export function levelFor(loop, world, boss) {
  if (boss) return 6;
  const w = Math.max(0, Math.min(4, world | 0));
  if (loop <= 1) return w + 1;
  if (loop === 2) return [4, 5, 6, 6, 6][w];
  return 6;
}
// tempo for a road speed (world units a second: 32 = 160 km/h ... 130 = 655 km/h)
export function bpmFor(speed) {
  const k = Math.min(1, Math.max(0, (speed - 32) / 98));
  return BPM_MIN + (BPM_MAX - BPM_MIN) * Math.pow(k, 0.85);
}

// ---------- the song ----------
// chords as semitones above the key's root: [pad voicing (around D4), bass root (around D2)]
const CHORDS = {
  I: { pad: [-5, 0, 4, 7], bass: 0, tones: [0, 4, 7] },
  V: { pad: [-5, -1, 2, 7], bass: -5, tones: [7, 11, 14] },
  vi: { pad: [-3, 0, 4, 9], bass: -3, tones: [9, 12, 16] },
  IV: { pad: [-3, 2, 5, 9], bass: -7, tones: [5, 9, 12] },
};
const PROG_A = ['I', 'V', 'vi', 'IV'];        // the anthem: D A Bm G
const PROG_B = ['IV', 'V', 'I', 'V'];         // the lift: G A D A (unlocked from loop 3)
// melodies: [bar, step, semitones above D5, length in steps]
const N = (list) => list.map(([b, s, n, l]) => ({ b, s, n, l }));
const RIFFS = {
  // the hook
  A: N([[0, 0, 4, 3], [0, 3, 7, 3], [0, 6, 12, 2], [0, 8, 11, 3], [0, 11, 7, 3], [0, 14, 4, 2],
    [1, 0, 2, 3], [1, 3, 9, 3], [1, 6, 11, 2], [1, 8, 14, 6], [1, 14, 11, 2],
    [2, 0, 12, 3], [2, 3, 9, 3], [2, 6, 4, 2], [2, 8, 9, 3], [2, 11, 12, 3], [2, 14, 16, 2],
    [3, 0, 14, 6], [3, 6, 12, 2], [3, 8, 9, 4], [3, 12, 7, 4]]),
  // the answer: driving eighths, then a held note
  B: N([[0, 0, 12, 2], [0, 2, 7, 2], [0, 4, 4, 2], [0, 6, 7, 2], [0, 8, 12, 6], [0, 14, 14, 2],
    [1, 0, 11, 2], [1, 2, 9, 2], [1, 4, 2, 2], [1, 6, 9, 2], [1, 8, 11, 4], [1, 12, 14, 4],
    [2, 0, 12, 2], [2, 2, 9, 2], [2, 4, 4, 2], [2, 6, 9, 2], [2, 8, 12, 4], [2, 12, 16, 4],
    [3, 0, 12, 4], [3, 4, 9, 4], [3, 8, 5, 4], [3, 12, 7, 4]]),
  // the soaring line: long notes
  D: N([[0, 0, 7, 16], [1, 0, 11, 8], [1, 8, 14, 8], [2, 0, 12, 16], [3, 0, 9, 8], [3, 8, 7, 8]]),
};
const C_STEPS = [0, 3, 6, 8, 10, 12, 14];      // the staccato lead's rhythm (riff C, made from the chord)
const STAB_STEPS = [0, 3, 6, 10];             // chord stabs (riff S)
// what can come up at level 6, by loop (the pool grows; loop 5 on: everything)
const POOL = [
  null,
  { riffs: ['A', 'B'], fills: ['roll', 'rev'], fx: [], progB: false, breaks: false },
  { riffs: ['A', 'B', 'D'], fills: ['roll', 'rev', 'tom', 'zap'], fx: ['zap', 'ping'], progB: false, breaks: false },
  { riffs: ['A', 'B', 'D', 'C'], fills: ['roll', 'rev', 'tom', 'zap', 'stutter'], fx: ['zap', 'ping', 'swish'], progB: true, breaks: true },
  { riffs: ['A', 'B', 'D', 'C', 'S'], fills: ['roll', 'rev', 'tom', 'zap', 'stutter', 'drop'], fx: ['zap', 'ping', 'swish'], progB: true, breaks: true },
  { riffs: ['A', 'B', 'D', 'C', 'S'], fills: ['roll', 'rev', 'tom', 'zap', 'stutter', 'drop'], fx: ['zap', 'ping', 'swish', 'arpUp'], progB: true, breaks: true },
];
const poolOf = (loop) => POOL[Math.min(POOL.length - 1, Math.max(1, loop | 0))];
// how open each layer's filter is at each level (Hz), [start of the world, end of the world]
const OPEN = {
  pad: [[7000, 7000], [320, 750], [900, 1700], [1800, 3200], [3300, 5200], [6000, 7500], [9000, 11000]],
  bass: [[300, 300], [180, 260], [380, 750], [750, 1300], [1300, 1900], [2100, 2500], [2700, 3200]],
  arp: [[3200, 4200], [900, 900], [900, 900], [1400, 2200], [1600, 3600], [4200, 5500], [6500, 8000]],
};
const PUMP = [0, 0, 0.22, 0.32, 0.4, 0.45, 0.5];  // how hard the kick ducks the pad and bass

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pickR = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

// ---------- one-shots rendered once ----------
let NOISE = null;
function noise(ctx) {
  if (NOISE && NOISE.sampleRate === ctx.sampleRate) return NOISE;
  const n = ctx.sampleRate * 2, r = rng(777);
  NOISE = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = NOISE.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = r() * 2 - 1;
  return NOISE;
}
function noiseHit(c, dest, t, len, type, freq, q, shape) {
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = noise(c); s.loop = true;
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  s.connect(f); f.connect(g); g.connect(dest);
  shape(g.gain, f.frequency);
  s.start(t); s.stop(t + len);
}
// the drum kit and effects: name -> [seconds, stereo?, draw(ctx, out)]
const KIT = {
  kick: [0.55, false, (c, o) => {
    const s = c.createOscillator(), g = c.createGain();
    s.frequency.setValueAtTime(170, 0); s.frequency.exponentialRampToValueAtTime(52, 0.09); s.frequency.exponentialRampToValueAtTime(44, 0.4);
    g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(1, 0.003); g.gain.setTargetAtTime(0, 0.12, 0.11);
    const sh = c.createWaveShaper(), cv = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 127.5 - 1; cv[i] = Math.tanh(2.2 * x) / Math.tanh(2.2); }
    sh.curve = cv;
    s.connect(g); g.connect(sh); sh.connect(o); s.start(0); s.stop(0.55);
    noiseHit(c, o, 0, 0.02, 'highpass', 3000, 0.7, (p) => { p.setValueAtTime(0.35, 0); p.exponentialRampToValueAtTime(0.001, 0.012); });
  }],
  // the heartbeat: a soft, round, muffled kick
  beat: [0.6, false, (c, o) => {
    const s = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 220;
    s.frequency.setValueAtTime(110, 0); s.frequency.exponentialRampToValueAtTime(46, 0.12);
    g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(1, 0.012); g.gain.setTargetAtTime(0, 0.1, 0.13);
    s.connect(lp); lp.connect(g); g.connect(o); s.start(0); s.stop(0.6);
  }],
  clap: [0.45, true, (c, o) => {
    const p = c.createStereoPanner(); p.pan.value = 0; p.connect(o);
    noiseHit(c, p, 0, 0.45, 'bandpass', 1500, 1.1, (g) => {
      g.setValueAtTime(0, 0);
      for (const d of [0, 0.01, 0.021]) { g.setValueAtTime(0.9, d); g.exponentialRampToValueAtTime(0.1, d + 0.008); }
      g.setValueAtTime(0.7, 0.03); g.setTargetAtTime(0.0001, 0.035, 0.07);
    });
    noiseHit(c, p, 0, 0.2, 'highpass', 5000, 0.7, (g) => { g.setValueAtTime(0.25, 0); g.exponentialRampToValueAtTime(0.001, 0.12); });
  }],
  snare: [0.3, false, (c, o) => {
    const s = c.createOscillator(), g = c.createGain();
    s.type = 'triangle'; s.frequency.setValueAtTime(240, 0); s.frequency.exponentialRampToValueAtTime(180, 0.05);
    g.gain.setValueAtTime(0.55, 0); g.gain.exponentialRampToValueAtTime(0.001, 0.1);
    s.connect(g); g.connect(o); s.start(0); s.stop(0.12);
    noiseHit(c, o, 0, 0.3, 'bandpass', 3200, 0.5, (p) => { p.setValueAtTime(0.7, 0); p.exponentialRampToValueAtTime(0.001, 0.22); });
  }],
  hat: [0.08, false, (c, o) => { noiseHit(c, o, 0, 0.08, 'highpass', 8500, 0.9, (p) => { p.setValueAtTime(0.4, 0); p.exponentialRampToValueAtTime(0.001, 0.05); }); }],
  open: [0.4, false, (c, o) => { noiseHit(c, o, 0, 0.4, 'highpass', 7200, 0.8, (p) => { p.setValueAtTime(0.0001, 0); p.linearRampToValueAtTime(0.32, 0.006); p.exponentialRampToValueAtTime(0.001, 0.32); }); }],
  shaker: [0.12, false, (c, o) => { noiseHit(c, o, 0, 0.12, 'bandpass', 7800, 1.2, (p) => { p.setValueAtTime(0.0001, 0); p.linearRampToValueAtTime(0.25, 0.02); p.exponentialRampToValueAtTime(0.001, 0.09); }); }],
  crash: [2.4, true, (c, o) => {
    for (const [pan, f] of [[-0.5, 5200], [0.5, 6100]]) {
      const p = c.createStereoPanner(); p.pan.value = pan; p.connect(o);
      noiseHit(c, p, 0, 2.4, 'highpass', f, 0.5, (g) => { g.setValueAtTime(0.0001, 0); g.linearRampToValueAtTime(0.3, 0.004); g.setTargetAtTime(0.0001, 0.02, 0.6); });
    }
  }],
  // a drop: deep boom with a burst of noise on top
  impact: [2.0, true, (c, o) => {
    const s = c.createOscillator(), g = c.createGain();
    s.frequency.setValueAtTime(120, 0); s.frequency.exponentialRampToValueAtTime(34, 0.7);
    g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(0.9, 0.005); g.gain.setTargetAtTime(0, 0.15, 0.4);
    s.connect(g); g.connect(o); s.start(0); s.stop(2);
    noiseHit(c, o, 0, 1.5, 'lowpass', 2500, 0.6, (p, f) => { p.setValueAtTime(0.5, 0); p.setTargetAtTime(0.0001, 0.01, 0.25); f.setValueAtTime(5000, 0); f.exponentialRampToValueAtTime(300, 1.2); });
  }],
  tom: [0.5, false, (c, o) => {
    const s = c.createOscillator(), g = c.createGain();
    s.frequency.setValueAtTime(190, 0); s.frequency.exponentialRampToValueAtTime(95, 0.25);
    g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(0.8, 0.003); g.gain.setTargetAtTime(0, 0.05, 0.12);
    s.connect(g); g.connect(o); s.start(0); s.stop(0.5);
    noiseHit(c, o, 0, 0.05, 'bandpass', 1800, 1, (p) => { p.setValueAtTime(0.2, 0); p.exponentialRampToValueAtTime(0.001, 0.04); });
  }],
  // a laser zap (the echo comes from the effects bus)
  zap: [0.4, true, (c, o) => {
    const s = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter(), p = c.createStereoPanner();
    s.type = 'sawtooth'; s.frequency.setValueAtTime(2400, 0); s.frequency.exponentialRampToValueAtTime(160, 0.28);
    f.type = 'bandpass'; f.Q.value = 3; f.frequency.setValueAtTime(3000, 0); f.frequency.exponentialRampToValueAtTime(400, 0.28);
    g.gain.setValueAtTime(0.5, 0); g.gain.exponentialRampToValueAtTime(0.001, 0.32);
    p.pan.setValueAtTime(-0.6, 0); p.pan.linearRampToValueAtTime(0.6, 0.3);
    s.connect(f); f.connect(g); g.connect(p); p.connect(o); s.start(0); s.stop(0.4);
  }],
  // air rushing past
  // pre-mixed pairs, so a busy step plays one sound instead of two (v0.23.2: cheaper)
  shOpen: [0.4, false, (c, o) => { const a = c.createGain(), b = c.createGain(); a.gain.value = 0.55; b.gain.value = 0.42; a.connect(o); b.connect(o); KIT.open[2](c, a); KIT.shaker[2](c, b); }],
  shHat: [0.12, false, (c, o) => { const a = c.createGain(), b = c.createGain(); a.gain.value = 0.3; b.gain.value = 0.28; a.connect(o); b.connect(o); KIT.hat[2](c, a); KIT.shaker[2](c, b); }],
  swish: [1.2, true, (c, o) => {
    const p = c.createStereoPanner(); p.pan.setValueAtTime(0.8, 0); p.pan.linearRampToValueAtTime(-0.8, 1.1); p.connect(o);
    noiseHit(c, p, 0, 1.2, 'bandpass', 800, 1.5, (g, f) => { g.setValueAtTime(0.0001, 0); g.linearRampToValueAtTime(0.35, 0.5); g.linearRampToValueAtTime(0.0001, 1.15); f.setValueAtTime(600, 0); f.exponentialRampToValueAtTime(6000, 0.6); f.exponentialRampToValueAtTime(1500, 1.15); });
  }],
};
function impulseFor(c, sec, seed) {
  const n = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, n, c.sampleRate), r = rng(seed);
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    for (let i = 0; i < n; i++) { const t = i / n; d[i] = (r() * 2 - 1) * Math.pow(1 - t, 2.6) * (0.5 + 0.5 * Math.exp(-t * 6)); }
  }
  return b;
}
// a one-shot with its reverb rendered in (no live reverb since v0.23.2)
function withVerb(draw, sec, wet, seed) {
  return (c, o) => {
    const dry = c.createGain(), rv = c.createConvolver(), w = c.createGain();
    rv.buffer = impulseFor(c, sec, seed); w.gain.value = wet;
    dry.connect(o); dry.connect(rv); rv.connect(w); w.connect(o);
    draw(c, dry);
  };
}
// a cymbal swelling up backwards into the next bar (made from the crash)
function reverseOf(buf, ctx) {
  const b = ctx.createBuffer(buf.numberOfChannels, Math.floor(buf.sampleRate * 1.5), buf.sampleRate);
  for (let ch = 0; ch < b.numberOfChannels; ch++) {
    const src = buf.getChannelData(ch), d = b.getChannelData(ch), n = d.length;
    for (let i = 0; i < n; i++) d[i] = src[n - 1 - i] * Math.min(1, (n - i) / 200);
  }
  return b;
}

for (const [name, len, sec, wet] of [['clap', 1.3, 1.1, 0.4], ['snare', 1.0, 0.9, 0.3], ['tom', 1.1, 0.9, 0.3], ['zap', 1.2, 1.0, 0.45], ['swish', 2.0, 1.2, 0.4], ['crash', 3.0, 1.6, 0.25]]) {
  const k = KIT[name];
  KIT[name] = [len, true, withVerb(k[2], sec, wet, 7 + len * 13)];
}

// supersaw chord pads and stabs for one key: rendered once per key
function drawChord(c, o, notes, len, stab) {
  const lp = c.createBiquadFilter(), g = c.createGain();
  // the reverb is rendered into the pads and stabs here, once, instead of running live (v0.23.2: cheaper)
  const rv = c.createConvolver(), wet = c.createGain();
  rv.buffer = impulseFor(c, stab ? 1.2 : 2.2, 41 + notes[0]); wet.gain.value = stab ? 0.22 : 0.34;
  g.connect(rv); rv.connect(wet); wet.connect(o);
  lp.type = 'lowpass'; lp.Q.value = stab ? 1.2 : 0.4;
  if (stab) { lp.frequency.setValueAtTime(7000, 0); lp.frequency.exponentialRampToValueAtTime(900, 0.3); }
  else lp.frequency.value = 9000;
  lp.connect(g); g.connect(o);
  g.gain.setValueAtTime(0, 0);
  g.gain.linearRampToValueAtTime(stab ? 0.5 : 0.32, stab ? 0.004 : 0.06);
  if (stab) g.gain.setTargetAtTime(0, 0.05, 0.12);
  else { g.gain.setValueAtTime(0.32, len - 0.6); g.gain.linearRampToValueAtTime(0, len); }
  const det = stab ? [-11, 0, 11] : [-17, -8, 0, 8, 17];
  notes.forEach((m, i) => det.forEach((cents, j) => {
    const s = c.createOscillator(), p = c.createStereoPanner(), sg = c.createGain();
    s.type = 'sawtooth'; s.frequency.value = mtof(m); s.detune.value = cents + (i * 3 - 4);
    p.pan.value = det.length > 1 ? (j / (det.length - 1)) * 1.4 - 0.7 : 0;
    sg.gain.value = 1 / Math.sqrt(notes.length * det.length);
    s.connect(sg); sg.connect(p); p.connect(lp); s.start(0); s.stop(len);
  }));
}
// the arpeggio's notes over a chord: its pad voicing an octave up, plus the next two notes above
function arpTones(ch, keyOff) {
  const t = ch.pad.map((x) => 62 + keyOff - (keyOff > 4 ? 12 : 0) + x).sort((a, b) => a - b);
  t.push(t[0] + 12, t[1] + 12);
  return t;
}
// one bass note: a saw and a square an octave down through a plucky filter
function drawBass(c, o, m) {
  const f = mtof(m), lp = c.createBiquadFilter(), g = c.createGain();
  lp.type = 'lowpass'; lp.Q.value = 3; lp.frequency.setValueAtTime(5200, 0); lp.frequency.exponentialRampToValueAtTime(700, 0.16);
  const o1 = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain();
  o1.type = 'sawtooth'; o1.frequency.value = f; o2.type = 'square'; o2.frequency.value = f / 2; o2.detune.value = 4; g2.gain.value = 0.45;
  o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(o);
  g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(0.7, 0.004); g.gain.setTargetAtTime(0.42, 0.01, 0.06); g.gain.setTargetAtTime(0, 0.3, 0.05);
  o1.start(0); o2.start(0); o1.stop(0.5); o2.stop(0.5);
}
// one arpeggio note: a square pluck
function drawArp(c, o, m) {
  const s = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
  s.type = 'square'; s.frequency.value = mtof(m);
  lp.type = 'lowpass'; lp.Q.value = 4; lp.frequency.setValueAtTime(5200, 0); lp.frequency.exponentialRampToValueAtTime(700, 0.14);
  g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(0.42, 0.003); g.gain.setTargetAtTime(0, 0.01, 0.07);
  s.connect(lp); lp.connect(g); g.connect(o); s.start(0); s.stop(0.5);
}
// one lead note, 2.4 s long (longer notes are cut by the player): two detuned saws and a square an
// octave down, a gentle filter, vibrato creeping in after a third of a second. thin = the octave-up twin
const LEAD_LEN = 2.4;
function drawLead(c, o, m, thin) {
  const g = c.createGain(), lp = c.createBiquadFilter(), end = LEAD_LEN - 0.08;
  lp.type = 'lowpass'; lp.Q.value = 0.8; lp.frequency.setValueAtTime(4800, 0); lp.frequency.setTargetAtTime(3000, 0.03, 0.2);
  lp.connect(g); g.connect(o);
  g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(0.34, 0.008); g.gain.setTargetAtTime(0.27, 0.02, 0.15);
  g.gain.setValueAtTime(0.27, end); g.gain.linearRampToValueAtTime(0, LEAD_LEN);
  const vib = c.createOscillator(), vg = c.createGain();
  vib.frequency.value = 5.4; vg.gain.setValueAtTime(0, 0); vg.gain.setValueAtTime(0, 0.3); vg.gain.linearRampToValueAtTime(thin ? 8 : 14, 0.7);
  vib.connect(vg); vib.start(0); vib.stop(LEAD_LEN);
  for (const [type, cents, amp] of thin ? [['sawtooth', 7, 0.6]] : [['sawtooth', -10, 0.5], ['sawtooth', 10, 0.5], ['square', -1200, 0.2]]) {
    const x = c.createOscillator(), xg = c.createGain();
    x.type = type; x.frequency.value = mtof(m); x.detune.value = cents; vg.connect(x.detune); xg.gain.value = amp;
    x.connect(xg); xg.connect(lp); x.start(0); x.stop(LEAD_LEN);
  }
}
// every pitch the lead can play in a key (the riffs, and riff C's chord tones), and its twin an octave up
function leadPitches(keyOff) {
  const base = 74 + keyOff - (keyOff > 4 ? 12 : 0), set = new Set();
  for (const r of Object.values(RIFFS)) for (const n of r) set.add(base + n.n);
  for (const ch of Object.values(CHORDS)) for (const x of ch.tones) set.add(base + x);
  return [...set];
}
// render each one-shot on its own small OfflineAudioContext: items [[name, seconds, stereo, draw]] -> { name: AudioBuffer }
function renderBank(sampleRate, items) {
  const OC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  return Promise.all(items.map(([name, len, stereo, draw]) => {
    const oc = new OC(stereo ? 2 : 1, Math.ceil(len * sampleRate), sampleRate);
    draw(oc, oc.destination);
    return oc.startRendering().then((b) => [name, b]);
  })).then((list) => Object.fromEntries(list));
}

// ---------- the player ----------
export class Redline {
  // ctx: an AudioContext (or OfflineAudioContext); dest: where the music goes (the Lab's music filter)
  // level: output gain, set so level 5 sits at about -15.5 dBFS RMS, like the Sunset Drive files
  constructor(ctx, dest, level = 0.4, offline = false) {
    this.ctx = ctx;
    this.offline = offline;
    const c = ctx, g = (v, to) => { const x = c.createGain(); x.gain.value = v; if (to) x.connect(to); return x; };
    const lp = (f, to) => { const x = c.createBiquadFilter(); x.type = 'lowpass'; x.frequency.value = f; x.Q.value = 0.6; if (to) x.connect(to); return x; };
    this.level = level;
    this.out = g(level, dest);
    this.cut = lp(18000, this.out);                   // fade-out sweep
    this.comp = c.createDynamicsCompressor();
    this.comp.threshold.value = -14; this.comp.knee.value = 8; this.comp.ratio.value = 3; this.comp.attack.value = 0.008; this.comp.release.value = 0.18;
    this.lift = g(1, this.cut);                      // the build gets louder as well as fuller (after the compressor, so it isn't squashed flat)
    this.comp.connect(this.lift);
    this.mix = g(1, this.comp);
    this.drums = g(0.9, this.mix);
    this.pump = g(1, this.mix);                       // pad, drone, bass and arpeggio duck under the kick
    this.padF = lp(400, null); this.pad = g(0.55, this.padF); this.padF.connect(this.pump);
    this.bassF = lp(300, null); this.bassF.Q.value = 2.2; this.bass = g(0.62, this.bassF); this.bassF.connect(this.pump);
    this.drone = g(0.5, this.pump);
    this.arpF = lp(1000, null); this.arpF.Q.value = 1.4; this.arp = g(0.3, this.arpF); this.arpF.connect(this.pump);
    this.lead = g(0.36, this.mix);
    this.fx = g(0.55, this.mix);
    // space: a tempo-synced dotted-eighth echo; the reverb is rendered into the sounds themselves
    // (pads, stabs, claps, toms, effects) when they're made, so none runs live (v0.23.2: battery)
    this.dly = c.createDelay(2); this.dlyFb = g(0.36); this.dlyF = lp(3200, null);
    this.dlyIn = g(0.3, this.dly); this.dly.connect(this.dlyF); this.dlyF.connect(this.dlyFb); this.dlyFb.connect(this.dly); this.dlyF.connect(this.mix);
    for (const b of [this.arpF, this.lead, this.fx]) b.connect(this.dlyIn);
    this.kit = null; this.banks = {}; this.ready = false;
    this.st = { loop: 1, world: 0, boss: false, lane: false, frac: 0, speed: 32, gateEta: Infinity, at: 0 };
    this.playing = false; this.timer = null; this.listeners = [];
    this.bpm = BPM_MIN; this.key = 0; this.sec = null; this.hand = 0; this.loopNow = 1; this.barN = 0;
  }
  on(fn) { this.listeners.push(fn); }
  emit(e) { for (const f of this.listeners) try { f(e); } catch (x) { /* a listener's problem, not the music's */ } }
  // render the drum kit (once) and the pads and stabs for a key offset; resolves when ready
  prepare(keyOff) {
    const sr = this.ctx.sampleRate, jobs = [];
    if (!this.kitP) {
      this.kitP = renderBank(sr, Object.entries(KIT).map(([n, [len, st, draw]]) => [n, len, st, draw])).then((k) => { k.rev = reverseOf(k.crash, this.ctx); this.kit = k; });
    }
    jobs.push(this.kitP);
    if (!this.banks[keyOff] && !(this['bankP' + keyOff])) {
      const down = keyOff > 4 ? 12 : 0, items = [];
      const bassN = new Set(), arpN = new Set();
      for (const [id, ch] of Object.entries(CHORDS)) {
        const notes = ch.pad.map((x) => 62 + keyOff - down + x);
        items.push(['pad' + id, 4.4, true, (c, o) => drawChord(c, o, notes, 3.6, false)]);
        items.push(['stab' + id, 1.1, true, (c, o) => drawChord(c, o, notes.map((m) => m + 12), 0.5, true)]);
        const r = 38 + keyOff - down + ch.bass;
        for (const x of [0, 7, 12]) bassN.add(r + x);
        for (const m of arpTones(ch, keyOff)) arpN.add(m);
      }
      for (const m of bassN) items.push(['bass' + m, 0.5, false, (c, o) => drawBass(c, o, m)]);
      for (const m of arpN) items.push(['arp' + m, 0.5, false, (c, o) => drawArp(c, o, m)]);
      for (const m of leadPitches(keyOff)) {
        items.push(['lead' + m, LEAD_LEN, false, (c, o) => drawLead(c, o, m, false)]);
        items.push(['twin' + m, LEAD_LEN, false, (c, o) => drawLead(c, o, m + 12, true)]);
      }
      this['bankP' + keyOff] = renderBank(sr, items).then((b) => { this.banks[keyOff] = b; });
    }
    jobs.push(this['bankP' + keyOff]);
    return Promise.all(jobs).then(() => { this.ready = true; });
  }
  isReady(keyOff) { return !!(this.kit && this.banks[keyOff]); }
  // what the game is doing: { loop, world, boss, lane, frac, speed, gateEta }
  set(s) { Object.assign(this.st, s); this.st.at = this.ctx.currentTime; }
  start(when) {
    this.stop();
    const c = this.ctx;
    this.loopNow = Math.max(1, this.st.loop | 0);
    this.key = keyOfLoop(this.loopNow);
    this.bpm = bpmFor(this.st.speed);
    this.T = Math.max(c.currentTime + 0.05, when || 0);
    this.sec = null; this.hand = 0; this.barN = 0;
    this.out.gain.cancelScheduledValues(c.currentTime); this.out.gain.setValueAtTime(this.level, c.currentTime);
    this.cut.frequency.cancelScheduledValues(c.currentTime); this.cut.frequency.setValueAtTime(18000, c.currentTime);
    this.playing = true;
    if (!this.offline) { this.timer = setInterval(() => this.tick(), 100); this.tick(); }
  }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; this.playing = false; }
  fadeOut(sec = 1.2) {
    const c = this.ctx, t = c.currentTime;
    this.out.gain.cancelScheduledValues(t); this.out.gain.setValueAtTime(this.out.gain.value, t); this.out.gain.linearRampToValueAtTime(0, t + sec);
    this.cut.frequency.cancelScheduledValues(t); this.cut.frequency.setValueAtTime(this.cut.frequency.value, t); this.cut.frequency.exponentialRampToValueAtTime(160, t + sec);
    // a power-down: one long falling tone under the fade
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(mtof(50 + this.key), t); o.frequency.exponentialRampToValueAtTime(30, t + sec);
    g.gain.setValueAtTime(0.12, t); g.gain.linearRampToValueAtTime(0, t + sec);
    o.connect(g); g.connect(this.bassF); o.start(t); o.stop(t + sec + 0.05);
    this.stop();
  }
  // schedule bars until `until` (real time: called every 50 ms; offline: called once with stateAt)
  tick(until) {
    const c = this.ctx;
    if (!this.playing || !this.kit) return;
    const now = c.currentTime;
    if (until == null) {
      if (now > this.T + 0.05) this.T += Math.ceil((now + 0.05 - this.T) / (240 / this.bpm)) * (240 / this.bpm);   // fell behind (a sleeping tab): skip ahead on the grid
      until = now + 0.4;
    }
    while (this.playing && this.T < until) this.bar();
  }
  // offline (previews and tests): stateAt(bar, time) -> the game's state for each bar
  renderBars(n, stateAt) {
    for (let i = 0; i < n && this.playing; i++) { this.set(stateAt(i, this.T)); this.st.at = this.T; this.bar(); }
  }

  // ---------- one bar ----------
  bar() {
    const st = this.st, T = this.T;
    // tempo follows the road's speed, at most 1 BPM a bar, never above BPM_MAX
    const want = bpmFor(st.speed);
    this.bpm = Math.max(BPM_MIN, Math.min(BPM_MAX, this.bpm + Math.max(-1, Math.min(1, want - this.bpm))));
    const D = 240 / this.bpm, S = D / 16;
    this.dly.delayTime.setValueAtTime(Math.min(1.9, 0.75 * D / 4), T);
    const loop = Math.max(1, st.loop | 0);
    if (st.world >= 2 || st.boss) this.prepare(keyOfLoop(this.loopNow + 1));   // the next key, well before the Warden
    // a new loop: two bars of handoff, then up a key
    if (this.hand === 0 && loop > this.loopNow) {
      const nk = keyOfLoop(loop);
      if (this.isReady(nk)) this.hand = 2;
      else { this.prepare(nk); }
    }
    if (this.hand > 0) {
      this.handBar(T, D, S, 2 - this.hand);
      this.hand--;
      if (this.hand === 0) { this.loopNow = loop; this.key = keyOfLoop(loop); this.sec = null; this.emit({ type: 'song', loop, key: this.key, time: T + D }); }
      this.T += D; this.barN++;
      return;
    }
    // the section: a new one starts whenever the level changes (or a lane starts or ends)
    const lvl = st.lane ? 0 : levelFor(this.loopNow, st.world, st.boss);
    let entering = false;
    if (!this.sec || this.sec.lvl !== lvl || this.sec.boss !== !!st.boss) {
      const prev = this.sec ? this.sec.lvl : -1;
      this.sec = { lvl, boss: !!st.boss, k: 0, seed: (this.loopNow * 7919 + lvl * 131 + this.barN) >>> 0, plan: null };
      entering = true;
      this.emit({ type: 'level', level: lvl, from: prev, time: T });
    }
    const sec = this.sec, k = sec.k++, p = k % 8;
    if (p === 0) sec.plan = this.phrase(sec, Math.floor(k / 8));
    const plan = sec.plan;
    // the bar the gate (or the boss, or a lane's exit) falls in builds into it
    const eta = st.gateEta - (T - st.at);
    const gateBar = eta > D * 0.2 && eta <= D * 1.15;
    const fill = gateBar ? 'riser' : p === 7 ? plan.fill : null;
    const brk = plan.brk && p < 4;                     // a breakdown: four bars without the kick
    const chord = CHORDS[plan.prog[p % 4]];
    const bank = this.banks[this.key] || this.banks[Object.keys(this.banks)[0]];
    const e = Math.min(1, Math.max(0, st.frac));       // how far through the world: the filters open as it goes
    this.open(lvl, e, T, D);
    // pump depth
    this.pumpDepth = brk ? 0 : PUMP[lvl];
    // section start: a crash and a boom going up, a swish going into a lane
    if (entering && k === 0 && this.barN > 0) {
      if (lvl === 0) this.hit('swish', T - 0.3, 0.8, this.fx);
      else { this.hit('crash', T, 0.7); this.hit('impact', T, lvl >= 3 ? 0.9 : 0.6); }
    } else if (p === 0 && lvl >= 5 && !brk) this.hit('crash', T, 0.45);
    this.emit({ type: 'bar', time: T, bpm: this.bpm, level: lvl, p, fill, riff: plan.riff, prog: plan.prog === PROG_B ? 'B' : 'A', key: this.key, loop: this.loopNow });

    // ---- harmony ----
    const padLen = Math.min(4.3, D + 0.45);
    this.padChord(bank, plan.prog[p % 4], T, D, padLen, lvl === 1 ? 0.9 : lvl === 0 ? 0.6 : 0.05, lvl === 0 ? 0.75 : 1);
    const root = 38 + this.key - (this.key > 4 ? 12 : 0) + chord.bass;
    if (lvl <= 2) this.droneNote(root, T, D, lvl === 0 ? 0.35 : lvl === 1 ? 0.75 : 0.45);

    // ---- drums ----
    const cut = fill === 'drop' || fill === 'stutter';
    for (let s = 0; s < 16; s++) {
      const t = T + s * S, late = s >= 12;
      if (cut && late) continue;
      if (lvl === 1) {
        // the heartbeat: lub-dub on beat one, and a second one later in the world
        if (s === 0) this.kickHit(t, 0.85, 'beat');
        if (s === 3) this.kickHit(t, 0.5, 'beat');
        if (e > 0.5 && s === 8) this.kickHit(t, 0.7, 'beat');
        if (e > 0.5 && s === 11) this.kickHit(t, 0.4, 'beat');
        if (e > 0.25 && s % 4 === 2) this.hit('shaker', t, 0.25 + 0.3 * e);
      } else if (lvl >= 2 && !brk) {
        if (s % 4 === 0 && !(fill === 'roll' && s >= 8) && !(fill === 'tom' && s >= 10)) this.kickHit(t, s === 0 ? 1 : 0.92, 'kick');
        if (lvl >= 6 && s === 14 && p % 2 === 1 && !fill) this.kickHit(t, 0.6, 'kick');
      }
      if (lvl >= 2) {
        const hatOn = lvl === 2 ? s % 4 === 2 : true;
        if (hatOn && lvl === 2) this.hit('hat', t, 0.45 + 0.25 * e);
        if (lvl >= 3) {
          const k = lvl >= 4 ? 1 : 0.8;
          if (s % 4 === 2) this.hit('shOpen', t, lvl >= 5 ? 1 : 0.78 * k);
          else if (lvl >= 5 && s % 2 === 1) this.hit('shHat', t, 1);
          else this.hit('shaker', t, (s % 2 ? 0.28 : 0.42) * k);
        }
        if (lvl >= 3 && !brk && (s === 4 || s === 12) && !(fill === 'roll' && s >= 8)) { this.hit('clap', t, lvl >= 5 ? 0.95 : 0.8); if (lvl >= 5) this.hit('snare', t, 0.45); }
        if (lvl === 2 && e > 0.6 && s === 12) this.hit('clap', t, 0.4);   // a hint of what's coming
      }
      if (lvl === 0 && s % 2 === 0) this.hit('shaker', t, s % 4 ? 0.16 : 0.24);
    }

    // ---- bass ----
    if (lvl >= 2 && !(brk && p < 2)) {
      for (let s = 0; s < 16; s++) {
        const t = T + s * S;
        if (cut && s >= 12) continue;
        if (lvl === 2) { if (s % 2 === 0) this.bassNote(t, root + (s % 4 === 2 ? 12 : 0), S * 1.6, s % 4 === 0 ? 0.8 : 0.6, lvl); }
        else if (lvl === 3) { if (s % 4 !== 0) this.bassNote(t, root + (s % 4 === 2 ? 12 : 0), S * 0.9, s % 4 === 2 ? 0.85 : 0.6, lvl); }
        else { if (s % 4 !== 0 || lvl >= 5) this.bassNote(t, root + (s % 4 === 2 ? 12 : s % 8 === 7 ? 7 : 0), S * 0.85, s % 4 === 2 ? 0.9 : s % 4 === 0 ? 0.55 : 0.65, lvl); }
      }
    }

    // ---- arpeggio ----
    if (lvl >= 4 || lvl === 0) {
      const tones = arpTones(chord, this.key);
      const every = lvl === 0 ? 2 : 1;
      for (let s = 0; s < 16; s += every) {
        if (cut && s >= 12) continue;
        if (plan.arp === 'skip' && (s % 4 === 1)) continue;
        const i = s / every;
        const n = this.arpIndex(plan.arp, i, tones.length, p);
        this.arpNote(T + s * S, tones[n], (i % 4 === 0 ? 0.85 : 0.6) * (lvl === 0 ? 0.8 : 1), S * (lvl === 0 ? 1.8 : 0.9));
      }
    }
    // the sonar ping: low levels and lanes, every other bar
    if ((lvl <= 3 || lvl === 0) && p % 2 === 0) {
      const top = 74 + this.key - (this.key > 4 ? 12 : 0) + chord.tones[(p >> 1) % 3];
      this.ping(T + (lvl === 1 ? 0 : 8 * S), top, lvl === 1 ? 0.5 : 0.4);
    }

    // ---- lead ----
    if (lvl >= 5 && !(brk && p < 2)) {
      const twin = lvl >= 6 || this.key > 4 || plan.twin;
      this.riffBar(plan.riff, p, T, S, plan.prog, twin, cut);
    }
    // ---- fills and effects ----
    if (fill) this.fillBar(fill, T, D, S, lvl, plan.prog[p % 4], bank);
    if (p === 3 && plan.fx && lvl >= 5) this.fxHit(plan.fx, T + 8 * S, S);
    if (brk && p === 3) this.riser(T, D, 0.7);
    this.T += D;
    this.barN++;
  }
  // what an 8-bar phrase plays (level 6 varies from phrase to phrase)
  phrase(sec, n) {
    const lvl = sec.lvl, pool = poolOf(this.loopNow), r = rng(sec.seed + n * 104729);
    const plan = { prog: PROG_A, riff: null, fill: 'roll', fx: null, arp: 'up', brk: false, twin: false };
    if (lvl === 5) { plan.riff = n % 2 ? 'B' : 'A'; plan.twin = n % 2 === 1; plan.fill = n % 2 ? 'rev' : 'roll'; plan.arp = 'up'; }
    else if (lvl >= 6) {
      if (sec.boss && n === 0) { plan.riff = 'A'; plan.twin = true; plan.fill = 'roll'; }
      else {
        if (pool.progB && r() < 0.35) plan.prog = PROG_B;
        const riffs = plan.prog === PROG_B ? pool.riffs.filter((x) => x === 'C' || x === 'S' || x === 'D') : pool.riffs;
        plan.riff = pickR(r, riffs.length ? riffs : ['C']);
        if (plan.prog === PROG_B && plan.riff === 'D') plan.riff = 'C';
        plan.fill = pickR(r, pool.fills);
        plan.fx = pool.fx.length && r() < 0.6 ? pickR(r, pool.fx) : null;
        plan.arp = pickR(r, ['up', 'updown', 'oct', 'skip']);
        plan.brk = pool.breaks && !sec.boss && n > 0 && r() < 0.2;
      }
    } else if (lvl === 0) { plan.arp = 'updown'; plan.fill = null; }
    else { plan.fill = lvl >= 3 ? (n % 2 ? 'rev' : 'roll') : lvl === 2 ? 'rev' : null; plan.arp = 'up'; }
    return plan;
  }
  open(lvl, e, T, D) {
    const at = (tab) => { const [a, b] = OPEN[tab][lvl]; return a * Math.pow(b / a, e); };
    this.padF.frequency.setTargetAtTime(at('pad'), T, D / 3);
    this.bassF.frequency.setTargetAtTime(at('bass'), T, D / 3);
    this.arpF.frequency.setTargetAtTime(at('arp'), T, D / 3);
    this.drums.gain.setTargetAtTime(lvl === 1 ? 0.75 : lvl === 0 ? 0.6 : 0.9, T, 0.2);
    this.lift.gain.setTargetAtTime(LIFT[lvl] * (lvl ? 1 + 0.06 * e : 1), T, D / 2);
  }
  arpIndex(style, i, n, bar) {
    if (style === 'updown') { const q = 2 * (n - 1), m = i % q; return m < n ? m : q - m; }
    if (style === 'oct') return [0, n - 2, 1, n - 1, 2, n - 2, 1, n - 1][i % 8];
    if (style === 'skip') return (i * 2 + bar) % n;
    return i % n;
  }

  // ---------- playing things ----------
  hit(name, t, v, dest) {
    const b = this.kit[name];
    if (!b) return;
    const c = this.ctx, s = c.createBufferSource(), g = c.createGain();
    s.buffer = b; g.gain.value = v;
    s.connect(g); g.connect(dest || this.drums);
    if (name === 'zap' || name === 'swish') g.connect(this.dlyIn);
    s.start(t);
  }
  kickHit(t, v, kind) {
    this.hit(kind, t, v);
    const d = this.pumpDepth || 0;
    if (d > 0) {
      const p = this.pump.gain, beat = 60 / this.bpm;
      p.setTargetAtTime(1 - d, t, 0.003);          // (a quick slope, not a step: a step clicks)
      p.setTargetAtTime(1, t + 0.025, beat * 0.22);
    }
  }
  padChord(bank, id, t, D, len, attack, vol) {
    const b = bank && bank['pad' + id];
    if (!b) return;
    const c = this.ctx, s = c.createBufferSource(), g = c.createGain();
    s.buffer = b;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.max(0.02, attack));
    g.gain.setValueAtTime(vol, t + D - 0.05);
    g.gain.linearRampToValueAtTime(0, t + Math.min(len, D + 0.4));
    s.connect(g); g.connect(this.pad);
    s.start(t); s.stop(t + Math.min(len, D + 0.45));
  }
  stab(bank, id, t, v) {
    const b = bank && bank['stab' + id];
    if (!b) return;
    const c = this.ctx, s = c.createBufferSource(), g = c.createGain();
    s.buffer = b; g.gain.value = v;
    s.connect(g); g.connect(this.lead); s.start(t);
  }
  droneNote(m, t, D, v) {
    const c = this.ctx, g = c.createGain(), end = t + D;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * 0.5, t + 0.08); g.gain.setValueAtTime(v * 0.5, end - 0.06); g.gain.linearRampToValueAtTime(0, end + 0.04);
    g.connect(this.drone);
    for (const [type, mult, amp] of [['sine', 1, 1], ['triangle', 2, 0.35], ['sine', 3, 0.12]]) {
      const o = c.createOscillator(), og = c.createGain();
      o.type = type; o.frequency.value = mtof(m) * mult; og.gain.value = amp;
      o.connect(og); og.connect(g); o.start(t); o.stop(end + 0.06);
    }
  }
  // a rendered note (bass or arpeggio), cut to length
  note(kind, m, t, len, v, dest) {
    const bank = this.banks[this.key], b = bank && bank[kind + m];
    if (!b) return;
    const c = this.ctx, s = c.createBufferSource(), g = c.createGain(), end = t + Math.min(0.48, Math.max(0.04, len));
    s.buffer = b;
    g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, end); g.gain.linearRampToValueAtTime(0, end + 0.025);
    s.connect(g); g.connect(dest); s.start(t); s.stop(end + 0.03);
  }
  bassNote(t, m, len, v) { this.note('bass', m, t, len, v, this.bass); }
  arpNote(t, m, v, len) { this.note('arp', m, t, Math.max(len * 2.5, 0.2), v, this.arp); }
  ping(t, m, v) {
    const c = this.ctx, g = c.createGain();
    g.connect(this.fx); g.connect(this.dlyIn);
    for (const [mult, amp, dec] of [[1, 1, 0.9], [2.76, 0.25, 0.25], [5.4, 0.08, 0.1]]) {
      const o = c.createOscillator(), og = c.createGain();
      o.type = 'sine'; o.frequency.value = mtof(m) * mult;
      og.gain.setValueAtTime(0.0001, t); og.gain.linearRampToValueAtTime(0.32 * v * amp, t + 0.004); og.gain.setTargetAtTime(0.0001, t + 0.01, dec / 3);
      o.connect(og); og.connect(g); o.start(t); o.stop(t + dec * 2.5);
    }
  }
  leadNote(t, m, len, v, thin) {
    const bank = this.banks[this.key], b = bank && bank[(thin ? 'twin' : 'lead') + (thin ? m - 12 : m)];
    if (b) {
      const c = this.ctx, s = c.createBufferSource(), g = c.createGain(), end = t + Math.min(LEAD_LEN - 0.1, Math.max(0.06, len * 0.92));
      s.buffer = b;
      g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, end); g.gain.setTargetAtTime(0, end, 0.05);
      s.connect(g); g.connect(this.lead); s.start(t); s.stop(Math.min(t + LEAD_LEN, end + 0.3));
      return;
    }
    this.leadLive(t, m, len, v, thin);
  }
  leadLive(t, m, len, v, thin) {
    const c = this.ctx, g = c.createGain(), lp = c.createBiquadFilter(), end = t + Math.max(0.06, len * 0.92);
    lp.type = 'lowpass'; lp.Q.value = 0.8; lp.frequency.setValueAtTime(4800, t); lp.frequency.setTargetAtTime(3000, t + 0.03, 0.2);
    lp.connect(g); g.connect(this.lead);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.34 * v, t + 0.008); g.gain.setTargetAtTime(0.27 * v, t + 0.02, 0.15);
    g.gain.setValueAtTime(0.27 * v, end); g.gain.setTargetAtTime(0.0001, end, 0.05);
    const voices = thin ? [['sawtooth', 7, 0.6]] : [['sawtooth', -10, 0.5], ['sawtooth', 10, 0.5], ['square', -1200, 0.2]];
    let vg = null;
    if (len > 0.45 && !thin) {                    // long notes get a little vibrato
      const vib = c.createOscillator();
      vg = c.createGain(); vib.frequency.value = 5.4; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(14, t + 0.4);
      vib.connect(vg); vib.start(t); vib.stop(end + 0.3);
    }
    for (const [type, cents, amp] of voices) {
      const o = c.createOscillator(), og = c.createGain();
      o.type = type; o.frequency.value = mtof(m); o.detune.value = cents; if (vg) vg.connect(o.detune);
      og.gain.value = amp;
      o.connect(og); og.connect(lp); o.start(t); o.stop(end + 0.3);
    }
  }
  riffBar(riff, p, T, S, prog, twin, cut) {
    const base = 74 + this.key - (this.key > 4 ? 12 : 0), b4 = p % 4, ch = CHORDS[prog[b4]];
    const bank = this.banks[this.key] || this.banks[Object.keys(this.banks)[0]];
    if (riff === 'S') {
      for (const s of STAB_STEPS.concat(b4 === 3 ? [12, 14] : [])) if (!(cut && s >= 12)) this.stab(bank, prog[b4], T + s * S, s === 0 ? 0.9 : 0.7);
      return;
    }
    if (riff === 'C') {
      const tones = ch.tones.map((x) => base + x).sort((a, b) => a - b);
      C_STEPS.forEach((s, i) => { if (!(cut && s >= 12)) this.leadNote(T + s * S, tones[[2, 1, 2, 0, 2, 1, 2][i]], S * 1.2, 0.8); });
      if (b4 === 1 || b4 === 3) this.stab(bank, prog[b4], T + 4 * S, 0.5);
      return;
    }
    const notes = RIFFS[riff] || RIFFS.A;
    for (const n of notes) {
      if (n.b !== b4) continue;
      if (p === 7 && n.s >= 12) continue;           // leave room for the fill
      if (cut && n.s >= 12) continue;
      const len = n.l * S, t = T + n.s * S;
      this.leadNote(t, base + n.n, len, 0.95);
      if (twin) this.leadNote(t, base + n.n + 12, len, 0.42, true);
    }
    if (riff === 'A' && twin && (b4 === 1 || b4 === 3)) this.stab(bank, prog[b4], T + 12 * S, 0.45);
  }
  riser(T, len, v) {
    const c = this.ctx;
    noiseHit(c, this.fx, T, len + 0.05, 'bandpass', 400, 2.5, (g, f) => {
      g.setValueAtTime(0.0001, T); g.exponentialRampToValueAtTime(0.5 * v, T + len);
      f.setValueAtTime(400, T); f.exponentialRampToValueAtTime(9000, T + len);
    });
    const o = c.createOscillator(), og = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(mtof(50 + this.key), T); o.frequency.exponentialRampToValueAtTime(mtof(74 + this.key), T + len);
    og.gain.setValueAtTime(0.0001, T); og.gain.exponentialRampToValueAtTime(0.05 * v, T + len);
    o.connect(og); og.connect(this.fx); o.start(T); o.stop(T + len + 0.02);
  }
  fillBar(fill, T, D, S, lvl, chordId, bank) {
    if (fill === 'riser') {
      this.riser(T, D, lvl >= 4 ? 1 : 0.7);
      if (lvl >= 2) for (let s = 8; s < 16; s++) this.hit('snare', T + s * S, 0.15 + 0.06 * (s - 8));
      return;
    }
    if (fill === 'roll') { for (let s = 8; s < 16; s++) this.hit('snare', T + s * S, 0.2 + 0.07 * (s - 8)); return; }
    if (fill === 'rev') { const b = this.kit.rev; this.hit('rev', T + D - b.duration, 0.9); return; }
    if (fill === 'tom') { [10, 11, 12, 13, 14, 15].forEach((s, i) => this.tom(T + s * S, 1.25 - i * 0.08, 0.75)); return; }
    if (fill === 'zap') { for (const s of [12, 14]) this.hit('zap', T + s * S, 0.6, this.fx); return; }
    if (fill === 'stutter') { for (let i = 0; i < 8; i++) this.stab(bank, chordId, T + 12 * S + i * S / 2, 0.25 + i * 0.07); return; }
    if (fill === 'drop') { const b = this.kit.rev; this.hit('rev', T + D - b.duration, 0.7); }
  }
  tom(t, rate, v) {
    const c = this.ctx, s = c.createBufferSource(), g = c.createGain();
    s.buffer = this.kit.tom; s.playbackRate.value = rate; g.gain.value = v;
    s.connect(g); g.connect(this.drums); s.start(t);
  }
  fxHit(kind, t, S) {
    if (kind === 'zap') this.hit('zap', t, 0.45, this.fx);
    else if (kind === 'swish') this.hit('swish', t - 4 * S, 0.6, this.fx);
    else if (kind === 'ping') this.ping(t, 86 + this.key - (this.key > 4 ? 12 : 0), 0.6);
    else if (kind === 'arpUp') { const tn = arpTones(CHORDS.I, this.key); for (let i = 0; i < 8; i++) this.arpNote(t + i * S / 2, tn[i % tn.length], 0.4 + 0.06 * i, S * 0.5); }
  }
  // after the Warden: hold the V chord, a two-bar riser, a snare roll, then the new key's downbeat
  handBar(T, D, S, i) {
    const bank = this.banks[this.key];
    if (i === 0) {
      this.padChord(bank, 'V', T, 2 * D - 0.1, Math.min(4.3, 2 * D), 0.3, 1);
      this.padF.frequency.setTargetAtTime(3000, T, D);
      this.riser(T, 2 * D, 1.1);
      this.bassNote(T, 38 + this.key - (this.key > 4 ? 12 : 0) - 5, D * 1.5, 0.8, 4);
      this.pumpDepth = 0;
      for (let s = 0; s < 16; s += 4) this.hit('snare', T + s * S, 0.25);
      this.emit({ type: 'handoff', time: T });
    } else {
      for (let s = 0; s < 16; s++) this.hit('snare', T + s * S, 0.2 + 0.05 * s);
      this.hit('rev', T + D - this.kit.rev.duration, 0.8);
    }
  }
}
