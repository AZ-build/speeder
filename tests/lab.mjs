import { open } from './lib.mjs';
import { mkdirSync } from 'node:fs';
const dir = process.argv[2] || process.cwd();
mkdirSync('tests/shots', { recursive: true });
const results = [];
const ok = (name, cond, extra) => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  [' + JSON.stringify(extra) + ']' : '')); };

{
  const { browser, page, errors } = await open(dir);
  const S = (fn, arg) => page.evaluate(fn, arg);
  await S(() => { SPEEDER.step(1 / 60, 30); SPEEDER.render(); });
  await page.screenshot({ path: 'tests/shots/01-title.png' });
  ok('title: Lab button exists, not selected', await S(() => !!document.getElementById('titleLabBtn') && !document.getElementById('titleLabBtn').classList.contains('sel')));
  ok('title: version line on screen', await S(() => { const r = document.getElementById('versionTag').getBoundingClientRect(); return r.bottom <= innerHeight && r.height > 0; }));

  await page.tap('#titleLabBtn');
  ok('lab panel opens', await S(() => !document.getElementById('lab').classList.contains('hidden')));
  await page.screenshot({ path: 'tests/shots/02-lab-panel.png' });
  await page.tap('#labOpt_jump_gesture');
  ok('gesture chip cycles to tap and saves', await S(() => SPEEDER.LAB.cfg.jump.gesture === 'tap' && JSON.parse(localStorage.getItem('speeder.lab.cfg')).jump.gesture === 'tap'));
  await page.tap('#labOpt_jump_gesture');
  ok('gesture chip cycles back to flick', await S(() => SPEEDER.LAB.cfg.jump.gesture === 'flick'));
  await page.tap('#labOn_jump');
  ok('switch off hides options', await S(() => SPEEDER.LAB.cfg.jump.on === false && !document.getElementById('labOpt_jump_gesture')));
  await page.screenshot({ path: 'tests/shots/03-lab-panel-off.png' });
  await page.tap('#labOn_jump');
  await page.tap('#labBack');
  ok('back returns to title, mode unchanged', await S(() => !document.getElementById('title').classList.contains('hidden') && SPEEDER.SET.mode === 'warp'));

  await page.tap('#titleLabBtn');
  await page.tap('#labRide');
  ok('lab run starts on Warp rules', await S(() => SPEEDER.G.state === 'play' && SPEEDER.G.mode === 'lab' && SPEEDER.LAB.on && SPEEDER.WP.on && SPEEDER.labOn('jump')));
  ok('lab is not the saved mode', await S(() => JSON.parse(localStorage.getItem('speeder.settings')).mode === 'warp'));

  // --- hop physics and charges ---
  const hop = await S(() => {
    const P = SPEEDER.player, J = SPEEDER.JUMP;
    SPEEDER.G.invuln = 0; SPEEDER.objs.length = 0; SPEEDER.G.nextSpawn = 1e9; SPEEDER.G.nextGate = 1e9;
    SPEEDER.step(1 / 60, 30);
    const a = SPEEDER.tryHop('key');
    let peak = 0, frames = 0;
    const second = SPEEDER.tryHop('key');      // already in the air: must refuse
    do { SPEEDER.step(1 / 60, 1); peak = Math.max(peak, P.y); frames++; } while ((P.y > 0 || P.vy > 0) && frames < 200);
    return { a, second, peak, secs: frames / 60, n: J.n, hop: P.hop, hops: J.hops };
  });
  ok('hop: leaves the ground, about 1.5 high for 0.7 s, costs one charge', hop.a && !hop.second && Math.abs(hop.peak - 1.5) < 0.1 && Math.abs(hop.secs - 0.7) < 0.06 && hop.n === 1 && hop.hop === false, hop);
  const fuel = await S(() => {
    const J = SPEEDER.JUMP;
    SPEEDER.tryHop('key'); SPEEDER.step(1 / 60, 60);
    const empty = J.n, refused = SPEEDER.tryHop('key'), denied = J.denied;
    SPEEDER.nearMiss(); const half = J.n; SPEEDER.nearMiss(); const one = J.n;
    for (let i = 0; i < 6; i++) SPEEDER.nearMiss();
    return { empty, refused, denied, half, one, cap: J.n };
  });
  ok('charges: empty refuses, 2 close calls earn 1, capped at 2', fuel.empty === 0 && fuel.refused === false && fuel.denied === 1 && fuel.half === 0.5 && fuel.one === 1 && fuel.cap === 2, fuel);

  // --- what a hop clears ---
  const clear = await S(() => {
    const G = SPEEDER.G, P = SPEEDER.player, out = {};
    const tryOver = (make) => {
      SPEEDER.objs.length = 0; SPEEDER.enemies.length = 0; SPEEDER.eshots.length = 0;
      G.invuln = 0; G.hull = 3; G.shield = 0; SPEEDER.JUMP.n = 2; P.x = 0; P.tx = 0;
      SPEEDER.step(1 / 60, 50);                      // settle on the ground, mid-track
      make(G.d + G.speed * 0.35);                    // 0.35 s ahead: the top of a 0.7 s hop
      SPEEDER.tryHop('key');
      SPEEDER.step(1 / 60, 50);
      return G.hull;
    };
    out.mine = tryOver((d) => SPEEDER.addMine(0, d));
    out.wall = tryOver((d) => SPEEDER.addWallSpan(-2, 2, d));
    out.pylon = tryOver((d) => SPEEDER.addPylon(0, d));
    out.laser = tryOver((d) => SPEEDER.addLaserFence(d, 2.8, 0, 0));
    out.truck = tryOver((d) => SPEEDER.addObj('traffic', 0, d, 1.7, { h: 1.5, dep: 4.4, mv: 0.38 }));
    out.crystal = tryOver((d) => SPEEDER.addObj('spike', 0, d, 1.0, { h: 3.4, dep: 0.9, hp: 3, pts: 100, grow: 1 }));
    out.ram = tryOver((d) => SPEEDER.addEnemy('ram', { x: 0, d, y: 0.42, vd: 0, hp: 99, pts: 150, w: 0.8, steer: 0 }));
    // the laser fence's gap might have been where we were: put the speeder under a beam for sure
    return out;
  });
  ok('hop clears a mine', clear.mine === 3, clear);
  ok('hop clears a wall', clear.wall === 3);
  ok('hop clears a ram bike', clear.ram === 3);
  ok('hop does NOT clear a pylon', clear.pylon === 2);
  ok('hop does NOT clear a truck', clear.truck === 2);
  ok('hop does NOT clear a crystal', clear.crystal === 2);
  const laser = await S(() => {
    const G = SPEEDER.G, P = SPEEDER.player;
    SPEEDER.objs.length = 0; G.invuln = 0; G.hull = 3; G.shield = 0; SPEEDER.JUMP.n = 2;
    P.x = 3.5; P.tx = 3.5; SPEEDER.step(1 / 60, 50);
    const f = SPEEDER.addLaserFence(G.d + G.speed * 0.35, 2.8, 0, 0);
    f.base = -2.5; f.amp = 0;                         // gap far to the left, we are on the right
    SPEEDER.tryHop('key'); SPEEDER.step(1 / 60, 50);
    const hopHull = G.hull;
    // a ramp jump must still clear the same laser (the main game's rule)
    SPEEDER.objs.length = 0; G.invuln = 0; G.hull = 3; P.x = 0; P.tx = 0; SPEEDER.step(1 / 60, 50);
    const r = SPEEDER.addObj('ramp', 0, G.d + 8, 3.6, { h: 0.8, dep: 6 });
    const f2 = SPEEDER.addLaserFence(G.d + 8 + 6 + G.speed * 0.4, 2.8, 0, 0); f2.base = -3.4; f2.amp = 0;
    SPEEDER.step(1 / 60, 90);
    return { hopHull, rampHull: G.hull, air: SPEEDER.stats.jumps };
  });
  ok('hop does NOT clear a laser fence', laser.hopHull === 2, laser);
  ok('ramp jump still clears a laser fence in the Lab', laser.rampHull === 3, laser);

  await S(() => { SPEEDER.objs.length = 0; SPEEDER.G.hull = 3; SPEEDER.JUMP.n = 1.5; SPEEDER.G.runT = 3; SPEEDER.G.dragged = true; SPEEDER.JUMP.hops = 0; SPEEDER.step(1 / 60, 20); SPEEDER.render(); });
  await page.screenshot({ path: 'tests/shots/04-lab-run-hud.png' });
  await S(() => { SPEEDER.tryHop('key'); SPEEDER.step(1 / 60, 20); SPEEDER.render(); });
  await page.screenshot({ path: 'tests/shots/05-lab-run-midhop.png' });

  // --- gestures (real pointer events, real timing) ---
  const gesture = async (kind) => S(async (kind) => {
    const fire = (type, id, x, y) => window.dispatchEvent(new PointerEvent(type, { pointerId: id, clientX: x, clientY: y, bubbles: true, pointerType: 'touch', isPrimary: id === 1 }));
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const J = SPEEDER.JUMP, P = SPEEDER.player;
    SPEEDER.objs.length = 0; SPEEDER.enemies.length = 0; SPEEDER.G.invuln = 999; SPEEDER.G.runT = 5;
    SPEEDER.step(1 / 60, 60); J.n = 2;
    const before = J.hops;
    if (kind === 'flick') { fire('pointerdown', 1, 200, 600); for (let i = 1; i <= 6; i++) { await wait(12); fire('pointermove', 1, 200 + i, 600 - i * 10); } fire('pointerup', 1, 206, 540); }
    if (kind === 'steer') { fire('pointerdown', 1, 200, 600); for (let i = 1; i <= 12; i++) { await wait(12); fire('pointermove', 1, 200 + i * 12, 600 - i * 2); } fire('pointerup', 1, 344, 576); }
    if (kind === 'diagonal') { fire('pointerdown', 1, 200, 600); for (let i = 1; i <= 8; i++) { await wait(12); fire('pointermove', 1, 200 + i * 9, 600 - i * 9); } fire('pointerup', 1, 272, 528); }
    if (kind === 'slowup') { fire('pointerdown', 1, 200, 600); for (let i = 1; i <= 20; i++) { await wait(25); fire('pointermove', 1, 200, 600 - i * 3); } fire('pointerup', 1, 200, 540); }
    if (kind === 'second') { fire('pointerdown', 1, 200, 600); await wait(30); fire('pointermove', 1, 230, 600); await wait(30); fire('pointerdown', 2, 320, 500); await wait(20); fire('pointerup', 2, 320, 500); await wait(20); fire('pointermove', 1, 260, 600); fire('pointerup', 1, 260, 600); }
    if (kind === 'onetap') { fire('pointerdown', 1, 200, 600); await wait(60); fire('pointerup', 1, 201, 600); }
    const tx = P.tx;
    SPEEDER.step(1 / 60, 60);
    return { hops: J.hops - before, by: Object.assign({}, J.by), tx };
  }, kind);
  const g1 = await gesture('flick'); ok('flick mode: flick up jumps', g1.hops === 1 && g1.by.flick >= 1, g1);
  const g2 = await gesture('steer'); ok('flick mode: sideways steering does not jump (and steers)', g2.hops === 0 && g2.tx > 1, g2);
  const g3 = await gesture('diagonal'); ok('flick mode: fast diagonal drag does not jump', g3.hops === 0, g3);
  const g4 = await gesture('slowup'); ok('flick mode: slow upward drift does not jump', g4.hops === 0, g4);
  const g5 = await gesture('second'); ok('flick mode: second finger does not jump', g5.hops === 0, g5);
  await S(() => { SPEEDER.LAB.run.jump.gesture = 'tap'; });
  const t1 = await gesture('second'); ok('tap mode: second finger jumps and steering finger keeps steering', t1.hops === 1 && t1.by.tap >= 1 && t1.tx > 0.5, t1);
  const t2 = await gesture('onetap'); ok('tap mode: quick one-finger tap jumps', t2.hops === 1, t2);
  const t3 = await gesture('flick'); ok('tap mode: flick does not jump', t3.hops === 0, t3);
  const t4 = await gesture('steer'); ok('tap mode: steering does not jump', t4.hops === 0, t4);
  const k = await S(() => { const J = SPEEDER.JUMP; J.n = 2; const b = J.hops; window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); SPEEDER.step(1 / 60, 60); return J.hops - b; });
  ok('keyboard: Space jumps', k === 1);

  // --- game over: no leaderboard, votes ---
  const before = await S(() => ({ local: localStorage.getItem('speeder.w.local'), localC: localStorage.getItem('speeder.local'), pend: localStorage.getItem('speeder.pendingRuns'), wbest: localStorage.getItem('speeder.w.best'), cbest: localStorage.getItem('speeder.best'), my: localStorage.getItem('speeder.w.myRuns') }));
  await S(() => { SPEEDER.G.invuln = 0; SPEEDER.G.score = 54321; SPEEDER.die(); for (let i = 0; i < 200 && SPEEDER.G.state !== 'over'; i++) SPEEDER.step(1 / 60, 1); SPEEDER.render(); });
  await page.waitForTimeout(400);
  const over = await S(() => ({
    state: SPEEDER.G.state,
    vote: !document.getElementById('labVote').classList.contains('hidden'), rows: document.querySelectorAll('.labvote').length,
    share: document.getElementById('shareBtn').classList.contains('hidden'), name: document.getElementById('nameBox').classList.contains('hidden'),
    status: document.getElementById('saveStatus').textContent, mode: document.getElementById('overMode').textContent,
    labBtn: !document.getElementById('overLabBtn').classList.contains('hidden'), other: document.getElementById('overModeBtn').textContent,
    stats: document.getElementById('stats').textContent,
    local: localStorage.getItem('speeder.w.local'), localC: localStorage.getItem('speeder.local'), pend: localStorage.getItem('speeder.pendingRuns'), wbest: localStorage.getItem('speeder.w.best'), cbest: localStorage.getItem('speeder.best'), my: localStorage.getItem('speeder.w.myRuns'),
    labBest: localStorage.getItem('speeder.lab.best'),
  }));
  ok('game over: vote box shown, share and name hidden', over.state === 'over' && over.vote && over.rows === 1 && over.share && over.name && over.labBtn, over);
  ok('game over: nothing written to any leaderboard store', ['local', 'localC', 'pend', 'wbest', 'cbest', 'my'].every((k2) => over[k2] === before[k2]) && over.labBest === '54321');
  await page.screenshot({ path: 'tests/shots/06-lab-over.png' });
  await page.tap('.labvote button[data-vote="up"]');
  ok('vote is stored per variant', await S(() => JSON.parse(localStorage.getItem('speeder.lab.votes'))['jump.tap.charges'] === 'up' && document.querySelector('.labvote button[data-vote="up"]').classList.contains('sel')));
  await page.screenshot({ path: 'tests/shots/07-lab-over-voted.png' });
  await page.tap('#overLabBtn');
  ok('"Change the experiments" opens the Lab panel', await S(() => !document.getElementById('lab').classList.contains('hidden')));
  await page.tap('#labBack');
  ok('back returns to game over', await S(() => !document.getElementById('over').classList.contains('hidden')));
  await page.tap('#overModeBtn');
  ok('"Play WARP RUN instead" leaves the Lab completely', await S(() => SPEEDER.G.mode === 'warp' && SPEEDER.G.state === 'play' && !SPEEDER.LAB.on && SPEEDER.WP.on && SPEEDER.tryHop('key') === false && SPEEDER.player.hop === false));
  const warpKeys = await S(() => { const y0 = SPEEDER.player.y; window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); SPEEDER.step(1 / 60, 5); return SPEEDER.player.y === y0; });
  ok('Warp Run: Space does nothing', warpKeys);
  ok('no page errors', errors.length === 0, errors);
  await browser.close();
}

// small phone, and the ?lab link
for (const [w, h, name] of [[320, 568, 'small'], [390, 664, 'short']]) {
  const { browser, page, errors } = await open(dir, { viewport: { width: w, height: h } });
  await page.evaluate(() => { SPEEDER.step(1 / 60, 30); SPEEDER.render(); });
  await page.screenshot({ path: 'tests/shots/08-title-' + name + '.png' });
  ok(name + ' phone: version line and Lab button on screen', await page.evaluate(() => { const r = document.getElementById('versionTag').getBoundingClientRect(), b = document.getElementById('titleLabBtn').getBoundingClientRect(); return r.bottom <= innerHeight && b.right <= innerWidth && b.left >= 0 && b.top > 0; }));
  await page.tap('#titleLabBtn');
  await page.screenshot({ path: 'tests/shots/09-lab-panel-' + name + '.png' });
  ok(name + ' phone: no errors', errors.length === 0, errors);
  await browser.close();
}
{
  const { browser, page, errors } = await open(dir, { query: '?lab' });
  ok('?lab link opens the Lab panel and tidies the address', await page.evaluate(() => !document.getElementById('lab').classList.contains('hidden') && location.search === ''));
  await browser.close();
}
console.log(results.join('\n'));
console.log(results.some((r) => r.startsWith('FAIL')) ? '\nSOME FAILED' : '\nALL PASSED');
