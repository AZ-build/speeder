// The Lab's HYPERLANE experiment (v0.12): the lane between worlds, its steering, the speeder's
// roll, what can hit you, what you can pick up, and getting in and out of it.
// Usage: node tests/lane.mjs "$PWD"     (screenshots go to tests/shots/)
import { open } from './lib.mjs';
import { mkdirSync } from 'node:fs';
const dir = process.argv[2] || process.cwd();
mkdirSync('tests/shots', { recursive: true });
const results = [];
const ok = (name, cond, extra) => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  [' + JSON.stringify(extra) + ']' : '')); };
const shot = (page, name) => page.screenshot({ path: 'tests/shots/' + name + '.png' });

const { browser, page, errors } = await open(dir);
const S = (fn, arg) => page.evaluate(fn, arg);

// --- the Lab panel ---
await S(() => { SPEEDER.step(1 / 60, 30); SPEEDER.render(); });
await page.tap('#titleLabBtn');
ok('panel: HYPERLANE is listed and on for a first-timer', await S(() => !!document.getElementById('labOn_lane') && SPEEDER.LAB.cfg.lane.on === true && SPEEDER.LAB.cfg.lane.feel === 'roll'));
ok('panel: "Start in a hyperlane" is offered while HYPERLANE is on', await S(() => !!document.getElementById('labLane')));
await page.tap('#labOpt_lane_feel');
ok('panel: flying style cycles to Smooth banks and saves', await S(() => SPEEDER.LAB.cfg.lane.feel === 'bank' && JSON.parse(localStorage.getItem('speeder.lab.cfg')).lane.feel === 'bank'));
await page.tap('#labOpt_lane_feel');
await page.tap('#labOn_lane');
ok('panel: switching HYPERLANE off hides its options and the start-in-lane switch', await S(() => !document.getElementById('labOpt_lane_feel') && !document.getElementById('labLane')));
await page.tap('#labOn_lane');
await page.tap('#labLane');
ok('panel: start-in-lane switch saves', await S(() => JSON.parse(localStorage.getItem('speeder.lab.setup')).lane === true));
await page.locator('#labList').evaluate((e) => e.scrollIntoView());
await shot(page, '20-lab-panel-hyperlane');

// --- a run that starts in a lane ---
const start = await S(() => {
  const P = SPEEDER;
  P.labSet('jump', 'on', true); P.labSet('ramps', 'on', true);
  P.setMode('lab'); P.startGame();
  const hz = P.LANE.hz0;
  P.step(1 / 60, 50); P.render();
  return { on: P.LANE.on, then: P.LANE.then, runs: P.LANE.runs, speed: Math.round(P.G.speed), hz, d: P.G.d, theme: P.WP.theme, sec: P.WP.sec };
});
ok('start in a lane: the run begins inside one, at hyperlane speed, with the road waiting', start.on && start.then === 'resume' && start.runs === 1 && start.speed >= 55 && start.d === 0, start);
await shot(page, '21-lane-start');
ok('no jumping in a lane (jump is on)', await S(() => SPEEDER.tryHop('key') === false && SPEEDER.JUMP.hops === 0));

// --- steering: drag in two directions, kept inside the tunnel ---
const steer = await S(() => {
  const P = SPEEDER, L = P.LANE;
  const ev = (type, x, y) => window.dispatchEvent(new PointerEvent(type, { pointerId: 7, clientX: x, clientY: y, bubbles: true }));
  ev('pointerdown', 200, 600);
  ev('pointermove', 260, 560);                // right and up
  const t1 = { tx: L.tx - L.atx, ty: L.ty - L.aty };
  const ax = L.atx, ay = L.aty;
  P.step(1 / 60, 40);
  const at = { x: L.x, y: L.y };
  ev('pointermove', 900, -400);               // far past the edge: held at the tunnel wall
  const edge = Math.hypot(L.tx, L.ty);
  ev('pointermove', 860, -400);               // pulling back responds at once
  const back = Math.hypot(L.tx, L.ty);
  ev('pointerup', 860, -400);
  return { dx: t1.tx, dy: t1.ty, sens: 60 * 11 / 390, at, edge, back, ax, ay };
});
ok('steer: dragging right and up moves the target right and up, at road steering speed', Math.abs(steer.dx - steer.sens) < 0.01 && Math.abs(steer.dy - 40 * 11 / 390) < 0.01, steer);
ok('steer: the speeder glides to the thumb', Math.abs(steer.at.x - (steer.ax + steer.dx)) < 0.05 && Math.abs(steer.at.y - (steer.ay + steer.dy)) < 0.05, steer);
ok('steer: held inside the tunnel, and pulling back responds at once', Math.abs(steer.edge - (4 - 0.7)) < 0.001 && steer.back < steer.edge - 0.3, steer);

// --- how the speeder rolls ---
const attitude = (feel) => S((feel) => {
  const P = SPEEDER, L = P.LANE;
  P.LAB.run.lane.feel = feel;
  const out = {};
  const move = (vx, vy, frames) => { L.tx = L.x; L.ty = L.y; for (let i = 0; i < frames; i++) { L.tx += vx / 60; L.ty += vy / 60; P.step(1 / 60, 1); } };   // (steadily, not a swipe)
  L.tx = -2.4; L.ty = 0; P.step(1 / 60, 90);
  out.restRoll = L.roll;
  move(9, 0, 30); out.right = L.roll + L.spin;      // sideways
  L.tx = L.x; L.ty = L.y; P.step(1 / 60, 90); out.settled = L.roll;
  L.tx = 0; L.ty = 2.4; P.step(1 / 60, 90);
  move(0, -9, 32); out.dive = L.roll;                // straight down, fast
  L.tx = L.x; L.ty = L.y; P.step(1 / 60, 90); out.after = L.roll;
  const r0 = L.rolls;
  L.tx = L.ptx = -2; L.ty = 0; P.step(1 / 60, 60);      // (placed there, not swiped)
  L.tx = 2; P.step(1 / 60, 1);                         // a very fast swipe
  let maxSpin = 0;
  for (let i = 0; i < 40; i++) { P.step(1 / 60, 1); maxSpin = Math.max(maxSpin, Math.abs(L.spin)); }
  out.rolls = L.rolls - r0; out.maxSpin = maxSpin; out.spinAfter = L.spin;
  return out;
}, feel);
await S(() => { const L = SPEEDER.LANE; SPEEDER.G.invuln = 999; L.objs = L.objs.filter((o) => o.type === 'exit'); L.exit.d = L.d + 1e6; L.nextD = 1e9; });
const roll = await attitude('roll');
ok('barrel rolls: upright at rest, banks right over (top to the right) moving right', Math.abs(roll.restRoll) < 0.05 && roll.right < -1.3 && roll.right > -1.8, roll);
ok('barrel rolls: settles back upright, flips over on a fast dive, rights itself after', Math.abs(roll.settled) < 0.05 && Math.abs(roll.dive) > 2.6 && Math.abs(roll.after) < 0.05, roll);
ok('barrel rolls: a fast swipe throws in one full barrel roll', roll.rolls === 1 && roll.maxSpin > 5 && roll.spinAfter === 0, roll);
const bank = await attitude('bank');
ok('smooth banks: banks into the move, never past 1 radian, never flips on a dive, no barrel rolls', bank.right < -0.5 && bank.right >= -1.0 && Math.abs(bank.dive) < 0.05 && bank.rolls === 0, bank);
await S(() => { SPEEDER.LAB.run.lane.feel = 'roll'; });

// a picture mid-roll
await S(() => { const L = SPEEDER.LANE; L.tx = -1.5; L.ty = -0.5; SPEEDER.step(1 / 60, 50); L.tx = 1.8; L.ty = 0.6; SPEEDER.step(1 / 60, 4); SPEEDER.render(); });
await shot(page, '22-lane-banking');

// --- what can hit you, and what you can pick up ---
// (page.evaluate can't take functions, so each case is written out in full instead)
const hitCase = (src, noGuns) => S(([src, noGuns]) => {
  const P = SPEEDER, L = P.LANE, G = P.G;
  L.objs.splice(0, L.objs.length, L.exit); L.shots.length = 0; L.nextD = 1e9;
  L.exit.d = L.d + 1e5;
  L.tx = L.x = 0.5; L.ty = L.y = -0.5;
  P.step(1 / 60, 30);
  G.invuln = 0; G.hull = 3; G.shield = 0; G.rapid = 0; G.mult = 0; G.weapon = 1; P.WP.od = 0; P.WP.odT = 0; P.WP.nm = 0; L.fireT = 0.1;
  const before = { score: G.score, rings: L.rings, orbs: L.orbs };
  const spec = (new Function('L', 'return ' + src))(L);
  L.objs.push(Object.assign({ kind: 'lane', d: L.d + 30, t: 0, _z: 0 }, spec));
  for (let i = 0; i < 60; i++) { if (noGuns) L.fireT = 999; P.step(1 / 60, 1); }
  return { hull: G.hull, scored: Math.round(G.score - before.score), rings: L.rings - before.rings, od: P.WP.od, orbs: L.orbs - before.orbs, nm: P.WP.nm, shield: G.shield, rapid: G.rapid > 0, left: L.objs.filter((q) => q.type !== 'exit').length };
}, [src, !!noGuns]);

let r = await hitCase("{ type: 'rock', x: 0.5, y: -0.5, r: 0.7, hp: 999, vx: 0, vy: 0, rot: 0, spin: 0, flashT: 0 }", true);
ok('rock dead ahead: a hit, and the rock breaks', r.hull === 2 && r.left === 0, r);
r = await hitCase("{ type: 'rock', x: 0.5 + 0.7 + 0.3 + 0.2, y: -0.5, r: 0.7, hp: 999, vx: 0, vy: 0, rot: 0, spin: 0, flashT: 0 }", true);
ok('rock just missed: no hit, a close call', r.hull === 3 && r.nm === 1, r);
r = await hitCase("{ type: 'rock', x: 0.5, y: -0.5, r: 0.7, hp: 3, vx: 0, vy: 0, rot: 0, spin: 0, flashT: 0 }", false);
ok('rock dead ahead with guns firing: shot to pieces before it reaches you (+60)', r.hull === 3 && r.scored >= 60, r);
r = await hitCase("{ type: 'laser', ang: 0, w: 0, off: -0.5 }", true);
ok('laser through you: a hit', r.hull === 2, r);
r = await hitCase("{ type: 'laser', ang: 1.5708, w: 0, off: -0.5 + 1.2 }", true);
ok('laser well to one side: no hit', r.hull === 3, r);
r = await hitCase("{ type: 'iris', x: 0.3, y: -0.3, hr: 1.2 }", true);
ok('iris wall, flown through the hole: no hit', r.hull === 3, r);
r = await hitCase("{ type: 'iris', x: -1.5, y: 1, hr: 1.2 }", true);
ok('iris wall, missed the hole: a hit', r.hull === 2, r);
r = await hitCase("{ type: 'ring', x: 0.6, y: -0.4, i: 0, set: { n: 1, got: 0, passed: 0 }, done: false }", true);
ok('ring flown through: counted, +150 and the perfect-line bonus (a set of one)', r.rings === 1 && r.scored >= 150 + 800 && r.od === 2, r);
r = await hitCase("{ type: 'ring', x: 2, y: 1, i: 0, set: { n: 6, got: 0, passed: 0 }, done: false }", true);
ok('ring missed: nothing', r.rings === 0, r);
r = await hitCase("{ type: 'cell', x: 0.9, y: -0.2 }", true);
ok('cell: picked up, charges OVERDRIVE', r.od === 1 && r.left === 0, r);
r = await hitCase("{ type: 'orb', x: 0.5, y: -0.5, power: 'shield' }", true);
ok('orb: picked up, the power-up applies', r.orbs === 1 && r.shield === 1, r);

// --- pictures of each thing, coming at you ---
const picture = async (name, src, steps) => {
  await S(([src, steps]) => {
    const P = SPEEDER, L = P.LANE;
    L.objs.splice(0, L.objs.length, L.exit); L.shots.length = 0; L.nextD = 1e9; P.G.invuln = 999;
    L.tx = 0.4; L.ty = -0.6; P.step(1 / 60, 30);
    for (const sp of (new Function('L', 'return ' + src))(L)) L.objs.push(Object.assign({ kind: 'lane', t: 0, _z: 0 }, sp));
    P.step(1 / 60, steps); P.render();
  }, [src, steps]);
  await shot(page, name);
};
await picture('23-lane-rocks', "[0,1,2,3,4,5,6,7].map((i) => ({ type: 'rock', d: L.d + 22 + i * 9, x: Math.cos(i * 2.3) * 1.8, y: Math.sin(i * 2.3) * 1.8, r: 0.6 + (i % 3) * 0.12, hp: 99, vx: 0, vy: 0, rot: i, spin: 1, flashT: 0 }))", 3);
await picture('24-lane-iris', "[{ type: 'iris', d: L.d + 26, x: -1.2, y: 0.9, hr: 1.2 }, { type: 'iris', d: L.d + 90, x: 1.3, y: 0.6, hr: 1.2 }]", 2);
await picture('25-lane-rings-orb', "[0,1,2,3,4,5].map((i) => ({ type: 'ring', d: L.d + 20 + i * 30, x: Math.cos(i * 0.7) * 1.6, y: Math.sin(i * 0.7) * 1.6, i, set: { n: 6, got: 0, passed: 0 }, done: false })).concat([{ type: 'orb', d: L.d + 60, x: -1.6, y: -0.8, power: 'weapon' }])", 2);
await picture('26-lane-cross', "[{ type: 'laser', d: L.d + 30, ang: 0.4, w: 0.8, off: 0 }, { type: 'laser', d: L.d + 30, ang: 0.4 + 1.5708, w: 0.8, off: 0 }]", 2);

// --- out through the exit: back on the road in the same world (test setup start) ---
const out = await S(() => {
  const P = SPEEDER, L = P.LANE;
  L.objs.splice(0, L.objs.length, L.exit); L.nextD = 1e9; P.G.invuln = 999;
  L.exit.d = L.d + 60;
  let frames = 0, pic = false;
  while (L.on && frames < 400) { P.step(1 / 60, 1); frames++; if (!pic && L.exit.d - L.d < 25) { P.render(); pic = true; return { pause: true }; } }
  return {};
});
await shot(page, '27-lane-exit');
const back = await S(() => {
  const P = SPEEDER, L = P.LANE, G = P.G;
  let frames = 0;
  while (L.on && frames < 400) { P.step(1 / 60, 1); frames++; }
  const at = { on: L.on, frames, d: G.d, sec: P.WP.sec, theme: P.WP.theme, rez: P.WP.rez };
  P.step(1 / 60, 60); P.render();
  return Object.assign(at, { d1: G.d, state: G.state, x: P.player.x, hz0: L.hz0 });
});
ok('exit (test start): back on the road in the world it started in, and the road moves on', !back.on && back.sec === 0 && back.theme === 0 && back.d === 0 && back.d1 > 30 && back.state === 'play', back);
await shot(page, '28-back-on-the-road');

// --- the real thing: a Lab run reaches a world gate, flies the lane, comes out in the next world ---
const full = await S(() => {
  const P = SPEEDER, G = P.G, L = P.LANE;
  P.labSet('setup', 'lane', false);
  window.__seed(42); P.setMode('lab'); P.startGame();
  // drive up to the world gate, then stop for a picture of it
  for (let frames = 0; frames < 60 * 140 && !L.on; frames++) {
    G.invuln = 999;
    P.player.tx = 2 * Math.sin(frames * 0.01);
    if (P.WP.portal && !P.WP.portal.dead && P.WP.portal.d - G.d < 60) { P.render(); return { gatePic: true }; }
    P.step(1 / 60, 1);
  }
  return { gatePic: false };
});
await shot(page, '29-gate-opens-onto-the-lane');
const flown = await S(() => {
  const P = SPEEDER, G = P.G, L = P.LANE;
  let frames = 0, entered = -1, entryD = 0, laneFrames = 0, enterPic = false, midPic = false, sec0 = P.WP.sec, theme0 = P.WP.theme;
  const seen = {};
  for (; frames < 60 * 100; frames++) {
    G.invuln = 999;
    if (!L.on) P.player.tx = 0;
    else {
      laneFrames++;
      const next = L.objs.filter((o) => (o.type === 'ring' || o.type === 'cell' || o.type === 'orb') && o.d > L.d && !o.done).sort((a, b) => a.d - b.d)[0];
      L.tx = next ? next.x : 0; L.ty = next ? next.y : 0;
      for (const o of L.objs) if (!o.counted) { o.counted = true; seen[o.type] = (seen[o.type] || 0) + 1; }
      if (!enterPic && laneFrames === 8) { P.render(); enterPic = true; window.__mid = { frames, entered, entryD, laneFrames, seen, sec0, theme0 }; return { enterPic: true }; }
    }
    P.step(1 / 60, 1);
    if (L.on && entered < 0) { entered = frames; entryD = G.d; }
    if (entered >= 0 && !L.on) break;
  }
  return { frames };
});
await shot(page, '30-into-the-lane');
const flown2 = await S(() => {
  const P = SPEEDER, G = P.G, L = P.LANE, m = window.__mid;
  const seen = m.seen;
  let frames = 0, laneFrames = m.laneFrames, midPic = false;
  const entryD = m.entryD;
  for (; frames < 60 * 40; frames++) {
    G.invuln = 999;
    if (!L.on) break;
    laneFrames++;
    const next = L.objs.filter((o) => (o.type === 'ring' || o.type === 'cell' || o.type === 'orb') && o.d > L.d && !o.done).sort((a, b) => a.d - b.d)[0];
    L.tx = next ? next.x : 0; L.ty = next ? next.y : 0;
    for (const o of L.objs) if (!o.counted) { o.counted = true; seen[o.type] = (seen[o.type] || 0) + 1; }
    if (!midPic && laneFrames === 420) { P.render(); midPic = true; window.__mid.laneFrames = laneFrames; return { midPic: true }; }
    P.step(1 / 60, 1);
  }
  return {};
});
await shot(page, '31-in-the-lane');
const res = await S(() => {
  const P = SPEEDER, G = P.G, L = P.LANE, m = window.__mid;
  const seen = m.seen;
  let laneFrames = m.laneFrames;
  while (L.on && laneFrames < 60 * 40) {
    G.invuln = 999;
    laneFrames++;
    const next = L.objs.filter((o) => (o.type === 'ring' || o.type === 'cell' || o.type === 'orb') && o.d > L.d && !o.done).sort((a, b) => a.d - b.d)[0];
    L.tx = next ? next.x : 0; L.ty = next ? next.y : 0;
    for (const o of L.objs) if (!o.counted) { o.counted = true; seen[o.type] = (seen[o.type] || 0) + 1; }
    P.step(1 / 60, 1);
  }
  const after = { on: L.on, secs: laneFrames / 60, gD: G.d - m.entryD, sec: P.WP.sec, sec0: m.sec0, theme: P.WP.theme, rez: P.WP.rez, runs: L.runs, rings: L.rings, ringsSeen: L.ringsSeen, orbs: L.orbs, seen, hz: P.G && window.innerHeight };
  P.step(1 / 60, 30); P.render();
  after.roadD = G.d - m.entryD; after.state = G.state;
  return after;
});
ok('a world gate leads into a hyperlane that lasts about 16 s', res.runs === 1 && !res.on && res.secs > 14.5 && res.secs < 18, res);
ok('the road waits while you are in the lane, then carries on', res.gD === 0 && res.roadD > 20, res);
ok('out of the lane into the next world (+1 world, new world loads in)', res.sec === res.sec0 + 1 && res.theme === 1 && res.rez < 1, res);
ok('a lane has rings, an orb, and hazards', res.seen.ring >= 6 && res.seen.orb === 1 && (res.seen.rock || 0) + (res.seen.laser || 0) + (res.seen.iris || 0) >= 3, res.seen);
ok('the simple pilot threads most rings', res.rings >= res.ringsSeen * 0.6 && res.ringsSeen >= 6, res);
await shot(page, '32-out-into-the-next-world');

// --- with HYPERLANE off, a gate goes straight to the next world as in Warp Run ---
const off = await S(() => {
  const P = SPEEDER, G = P.G;
  P.labSet('lane', 'on', false);
  window.__seed(42); P.setMode('lab'); P.startGame();
  let frames = 0, lane = false;
  for (; frames < 60 * 90 && P.WP.sec === 0; frames++) { G.invuln = 999; P.step(1 / 60, 1); if (P.LANE.on) lane = true; }
  return { sec: P.WP.sec, lane, runs: P.LANE.runs };
});
ok('HYPERLANE off: the gate takes you straight into the next world', off.sec === 1 && !off.lane && off.runs === 0, off);

// --- dying in a lane, the game-over line, and the road camera coming back ---
const death = await S(() => {
  const P = SPEEDER, G = P.G, L = P.LANE;
  P.labSet('lane', 'on', true); P.labSet('setup', 'lane', true);
  P.setMode('lab'); P.startGame();
  const hz0 = L.hz0;
  P.step(1 / 60, 30);
  G.invuln = 0; G.hull = 1; G.shield = 0;
  L.objs.push({ kind: 'lane', type: 'laser', d: L.d + 20, t: 0, _z: 0, ang: 0, w: 0, off: L.y });
  let i = 0;
  for (; i < 600 && G.state !== 'over'; i++) P.step(1 / 60, 1);
  P.render();
  return { state: G.state, diedIn: L.diedIn, laneStill: L.on, hz0, stats: document.getElementById('stats').textContent };
});
ok('dying in a lane ends the run there, and game over lists the lanes', death.state === 'over' && death.diedIn && /Hyperlanes 1/.test(death.stats) && /started in a hyperlane/.test(death.stats), death);
await shot(page, '33-game-over-in-lane');
const quit = await S(() => {
  const P = SPEEDER, L = P.LANE;
  const hz0 = L.hz0;
  P.startGame();                                          // ride again: the lane starts afresh
  const again = { on: L.on, runs: L.runs };
  P.labSet('setup', 'lane', false);
  return { again };
});
ok('ride again from a lane: a fresh run, counters reset', quit.again.on && quit.again.runs === 1, quit);

// --- coming out upside down: in the air, rights itself, lands (v0.12.5) ---
const landing = await S(() => {
  const P = SPEEDER, L = P.LANE, G = P.G;
  P.labSet('setup', 'lane', true); P.setMode('lab'); P.startGame();
  G.invuln = 999; P.step(1 / 60, 30);
  L.objs.splice(0, L.objs.length, L.exit); L.nextD = 1e9; L.exit.d = L.d + 40;
  L.roll = 3.0;                                    // upside down
  L.tx = L.x; L.ty = L.y;
  let n = 0;
  while (L.on && n < 300) { L.roll = 3.0; P.step(1 / 60, 1); n++; }
  const out = { y: P.player.y, land: !!L.land, roll0: L.land && L.land.roll };
  let peakShake = 0, frames = 0;
  while ((P.player.y > 0 || L.land) && frames < 120) { P.step(1 / 60, 1); frames++; peakShake = Math.max(peakShake, G.shake); }
  return Object.assign(out, { secs: frames / 60, yAfter: P.player.y, landAfter: !!L.land, peakShake });
});
ok('out of a lane upside down: you come out in the air, still rolled, right yourself and land with a bump', landing.y > 0.8 && landing.land && Math.abs(landing.roll0) > 2.5 && landing.yAfter === 0 && !landing.landAfter && landing.secs < 1.2 && landing.peakShake > 0.1, landing);
await S(() => SPEEDER.labSet('setup', 'lane', false));

ok('v0.12 lane tests: no page errors', errors.length === 0, errors);
await browser.close();
console.log(results.join('\n'));
console.log(results.some((x) => x.startsWith('FAIL')) ? '\nSOME FAILED' : '\nALL PASSED');
