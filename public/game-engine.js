/**
 * GameEngine — vat ly platformer 2D, tach hoan toan khoi giao dien.
 *
 * Vi tri tinh theo pixel (so thuc), khong phai theo o luoi, nen nhan vat
 * di chuyen muot va va cham chinh xac tung pixel.
 *
 * Va cham giai theo TUNG TRUC MOT: di truc X roi day ra khoi tuong, sau do
 * di truc Y roi day ra. Neu giai ca hai truc cung luc se khong biet nen day
 * theo huong nao — day la loi kinh dien lam nhan vat dinh tuong hoac xuyen san.
 *
 * Chay duoc ca trong Node (de kiem thu bang so) lan trinh duyet.
 */
const GameEngine = (() => {
  'use strict';

  const TILE = 32;

  // Loai o. Chi SOLID moi chan duoc.
  const T = {
    EMPTY: 0, WALL: 1, GROUND: 2, COIN: 3, PLAYER: 4,
    ENEMY: 5, EXIT: 6, SPIKE: 7, PLATFORM: 8
  };
  const SOLID = new Set([T.WALL, T.GROUND]);

  // Thong so vat ly. Don vi: pixel/giay va pixel/giay^2.
  const CFG = {
    gravity: 2000,
    maxFall: 900,
    moveSpeed: 210,
    accel: 1800,
    friction: 1700,
    jumpSpeed: 620,
    coyoteTime: 0.10,     // van nhay duoc 0.1s sau khi roi khoi mep
    jumpBuffer: 0.12,     // bam nhay som 0.12s truoc khi cham dat van an
    cutJump: 0.45,        // nha phim som thi cat bot da nhay
    enemySpeed: 60
  };

  // ─── Truy van ban do ───
  function tileAt(map, tx, ty) {
    // Ngoai bien theo chieu NGANG coi nhu tuong: giu nhan vat trong man choi.
    // Ngoai bien theo chieu DOC phai la khoang trong, neu khong nhan vat roi
    // xuong ho se dung lo lung tren hu khong va khong bao gio chet duoc.
    const cols = (map[0] || []).length;
    if (tx < 0 || tx >= cols) return T.WALL;
    if (ty < 0 || ty >= map.length) return T.EMPTY;
    return map[ty][tx];
  }
  const isSolid = (map, tx, ty) => SOLID.has(tileAt(map, tx, ty));

  /** Hop chu nhat co cham o dac nao khong */
  function hitsSolid(map, x, y, w, h) {
    const x0 = Math.floor(x / TILE);
    const x1 = Math.floor((x + w - 0.001) / TILE);
    const y0 = Math.floor(y / TILE);
    const y1 = Math.floor((y + h - 0.001) / TILE);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (isSolid(map, tx, ty)) return true;
      }
    }
    return false;
  }

  /**
   * Di chuyen theo mot truc va day ra khoi tuong.
   * Chia nho buoc di neu qua nhanh de khong xuyen qua tuong mong.
   */
  function moveAxis(ent, map, dx, dy) {
    let hit = false;
    const dist = Math.abs(dx || dy);
    const steps = Math.max(1, Math.ceil(dist / (TILE / 2)));
    const sx = (dx || 0) / steps;
    const sy = (dy || 0) / steps;

    for (let i = 0; i < steps; i++) {
      const nx = ent.x + sx;
      const ny = ent.y + sy;
      if (hitsSolid(map, nx, ny, ent.w, ent.h)) {
        // lui ve sat mep o
        if (sx > 0) ent.x = Math.floor((nx + ent.w) / TILE) * TILE - ent.w;
        else if (sx < 0) ent.x = Math.floor(nx / TILE) * TILE + TILE;
        if (sy > 0) ent.y = Math.floor((ny + ent.h) / TILE) * TILE - ent.h;
        else if (sy < 0) ent.y = Math.floor(ny / TILE) * TILE + TILE;
        hit = true;
        break;
      }
      ent.x = nx;
      ent.y = ny;
    }
    return hit;
  }

  // ─── Tao the gioi tu ma tran o ───
  function createWorld(map, cfg) {
    const conf = Object.assign({}, CFG, cfg || {});
    const world = {
      map: map.map(r => r.slice()),
      cfg: conf,
      tile: TILE,
      w: (map[0] || []).length * TILE,
      h: map.length * TILE,
      player: null,
      enemies: [],
      coins: [],
      spikes: [],
      exit: null,
      score: 0,
      state: 'playing',       // playing | won | dead
      time: 0,
      particles: []
    };

    for (let ty = 0; ty < map.length; ty++) {
      for (let tx = 0; tx < map[ty].length; tx++) {
        const v = map[ty][tx];
        const cx = tx * TILE, cy = ty * TILE;
        if (v === T.PLAYER) {
          world.player = {
            x: cx + 4, y: cy + 2, w: TILE - 8, h: TILE - 2,
            vx: 0, vy: 0, onGround: false, facing: 1,
            coyote: 0, buffer: 0, anim: 'idle', animTime: 0, alive: true
          };
          world.map[ty][tx] = T.EMPTY;
        } else if (v === T.ENEMY) {
          world.enemies.push({
            x: cx + 4, y: cy + 4, w: TILE - 8, h: TILE - 4,
            vx: conf.enemySpeed, vy: 0, alive: true, anim: 'run', animTime: 0
          });
          world.map[ty][tx] = T.EMPTY;
        } else if (v === T.COIN) {
          world.coins.push({ x: cx + TILE / 2, y: cy + TILE / 2, r: 7, taken: false, bob: Math.random() * 6 });
          world.map[ty][tx] = T.EMPTY;
        } else if (v === T.SPIKE) {
          world.spikes.push({ x: cx, y: cy + TILE / 2, w: TILE, h: TILE / 2 });
          world.map[ty][tx] = T.EMPTY;
        } else if (v === T.EXIT) {
          world.exit = { x: cx, y: cy, w: TILE, h: TILE };
          world.map[ty][tx] = T.EMPTY;
        }
      }
    }

    if (!world.player) {
      world.player = {
        x: TILE, y: TILE, w: TILE - 8, h: TILE - 2,
        vx: 0, vy: 0, onGround: false, facing: 1,
        coyote: 0, buffer: 0, anim: 'idle', animTime: 0, alive: true
      };
    }
    return world;
  }

  const overlap = (a, b) =>
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  /**
   * Tien mot buoc thoi gian.
   * @param {object} world
   * @param {object} input { left, right, jump, jumpPressed }
   * @param {number} dt giay (nen ket <= 1/30 de vat ly on dinh)
   */
  function step(world, input, dt) {
    if (world.state !== 'playing') return world;
    dt = Math.min(dt, 1 / 30);
    world.time += dt;

    const p = world.player;
    const c = world.cfg;

    // ── di chuyen ngang co gia toc, khong bat/tat dot ngot ──
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir !== 0) {
      p.vx += dir * c.accel * dt;
      p.vx = Math.max(-c.moveSpeed, Math.min(c.moveSpeed, p.vx));
      p.facing = dir;
    } else {
      const f = c.friction * dt;
      p.vx = p.vx > 0 ? Math.max(0, p.vx - f) : Math.min(0, p.vx + f);
    }

    // ── nhay: coyote time + dem truoc ──
    p.coyote = p.onGround ? c.coyoteTime : Math.max(0, p.coyote - dt);
    p.buffer = input.jumpPressed ? c.jumpBuffer : Math.max(0, p.buffer - dt);

    if (p.buffer > 0 && p.coyote > 0) {
      p.vy = -c.jumpSpeed;
      p.onGround = false;
      p.coyote = 0;
      p.buffer = 0;
      spawnDust(world, p.x + p.w / 2, p.y + p.h, 6);
    }
    // nha phim som -> nhay thap hon (do cao nhay dieu khien duoc)
    if (!input.jump && p.vy < 0) p.vy *= Math.pow(c.cutJump, dt * 60);

    // ── trong luc ──
    p.vy = Math.min(c.maxFall, p.vy + c.gravity * dt);

    // ── di chuyen + va cham, tung truc mot ──
    if (moveAxis(p, world.map, p.vx * dt, 0)) p.vx = 0;
    const wasFalling = p.vy > 0;
    const hitY = moveAxis(p, world.map, 0, p.vy * dt);
    if (hitY) {
      if (wasFalling) {
        if (!p.onGround && p.vy > 200) spawnDust(world, p.x + p.w / 2, p.y + p.h, 4);
        p.onGround = true;
      }
      p.vy = 0;
    } else {
      p.onGround = false;
    }

    // ── trang thai hoat anh ──
    const prev = p.anim;
    if (!p.onGround) p.anim = p.vy < 0 ? 'jump' : 'fall';
    else if (Math.abs(p.vx) > 12) p.anim = 'run';
    else p.anim = 'idle';
    p.animTime = p.anim === prev ? p.animTime + dt : 0;

    // ── quai vat: di qua lai, quay dau khi cham tuong hoac toi mep ──
    for (const e of world.enemies) {
      if (!e.alive) continue;
      e.vy = Math.min(c.maxFall, e.vy + c.gravity * dt);
      if (moveAxis(e, world.map, e.vx * dt, 0)) e.vx = -e.vx;
      if (moveAxis(e, world.map, 0, e.vy * dt)) e.vy = 0;

      // sap roi khoi mep -> quay dau
      const footX = e.vx > 0 ? e.x + e.w + 2 : e.x - 2;
      const footY = e.y + e.h + 2;
      if (!isSolid(world.map, Math.floor(footX / TILE), Math.floor(footY / TILE))) {
        e.vx = -e.vx;
      }
      e.animTime += dt;

      if (overlap(p, e)) {
        // dam tu tren xuong thi diet quai, cham ngang thi chet
        if (p.vy > 60 && p.y + p.h - e.y < 16) {
          e.alive = false;
          p.vy = -c.jumpSpeed * 0.6;
          world.score += 50;
          spawnDust(world, e.x + e.w / 2, e.y + e.h / 2, 10, '#f85149');
        } else {
          world.state = 'dead';
          p.alive = false;
        }
      }
    }

    // ── dong xu ──
    for (const coin of world.coins) {
      if (coin.taken) continue;
      const box = { x: coin.x - coin.r, y: coin.y - coin.r, w: coin.r * 2, h: coin.r * 2 };
      if (overlap(p, box)) {
        coin.taken = true;
        world.score += 10;
        spawnDust(world, coin.x, coin.y, 8, '#d29922');
      }
    }

    // ── bay gai ──
    for (const s of world.spikes) {
      if (overlap(p, s)) { world.state = 'dead'; p.alive = false; }
    }

    // ── roi ra ngoai ban do ──
    if (p.y > world.h + TILE * 2) { world.state = 'dead'; p.alive = false; }

    // ── ve dich: phai an het xu ──
    if (world.exit && overlap(p, world.exit)) {
      const left = world.coins.filter(x => !x.taken).length;
      if (left === 0) world.state = 'won';
    }

    updateParticles(world, dt);
    return world;
  }

  // ─── Hat hieu ung ───
  function spawnDust(world, x, y, n, color) {
    for (let i = 0; i < n; i++) {
      world.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 130,
        vy: -Math.random() * 130,
        life: 0.4 + Math.random() * 0.35,
        age: 0,
        color: color || '#8b949e',
        size: 1.5 + Math.random() * 2.5
      });
    }
    if (world.particles.length > 220) world.particles.splice(0, world.particles.length - 220);
  }

  function updateParticles(world, dt) {
    for (let i = world.particles.length - 1; i >= 0; i--) {
      const q = world.particles[i];
      q.age += dt;
      if (q.age >= q.life) { world.particles.splice(i, 1); continue; }
      q.vy += 620 * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
  }

  /** Camera bam theo nhan vat, co do tre va khong loi ra ngoai ban do */
  function updateCamera(cam, world, viewW, viewH, dt) {
    const p = world.player;
    const tx = p.x + p.w / 2 - viewW / 2;
    const ty = p.y + p.h / 2 - viewH / 2;
    const k = 1 - Math.pow(0.0016, dt);     // bam muot, khong phu thuoc fps
    cam.x += (tx - cam.x) * k;
    cam.y += (ty - cam.y) * k;
    cam.x = Math.max(0, Math.min(cam.x, Math.max(0, world.w - viewW)));
    cam.y = Math.max(0, Math.min(cam.y, Math.max(0, world.h - viewH)));
    return cam;
  }

  return { TILE, T, SOLID, CFG, createWorld, step, updateCamera,
           tileAt, isSolid, hitsSolid, moveAxis, overlap };
})();

if (typeof window !== 'undefined') window.GameEngine = GameEngine;
if (typeof module !== 'undefined' && module.exports) module.exports = GameEngine;
