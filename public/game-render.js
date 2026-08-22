/**
 * GameRender — thu vien ve, de code game cua hoc vien goi lai.
 *
 * Tach rieng khoi studio vi doan code nay duoc CHEN VAO khung chay game
 * cua hoc vien. Hoc vien goi Game.drawTiles(...) giong nhu goi Phaser,
 * hoac tu viet lai bang ctx.fillRect neu muon.
 */
const GameRender = (() => {
  'use strict';

  /** Troi chuyen mau + sao + nui, chay cham hon camera de tao chieu sau */
  function drawBackground(ctx, cam, world, stars) {
    const W = ctx.canvas.width, H = ctx.canvas.height;

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0b1026');
    g.addColorStop(0.55, '#141c3a');
    g.addColorStop(1, '#1e2a4a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    if (stars) {
      ctx.fillStyle = '#c9d6ff';
      for (const s of stars) {
        const x = s.x - cam.x * s.d;
        const y = s.y - cam.y * s.d * 0.5;
        if (x < -4 || x > W + 4) continue;
        ctx.globalAlpha = 0.25 + s.d;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = 'rgba(40,55,95,.55)';
    ctx.beginPath();
    ctx.moveTo(-cam.x * 0.25, H);
    for (let i = 0; i <= 16; i++) {
      ctx.lineTo(i * 120 - cam.x * 0.25, H - 90 - Math.sin(i * 1.7) * 55);
    }
    ctx.lineTo(W + 240, H);
    ctx.closePath();
    ctx.fill();
  }

  /** Tao truong sao cho lop parallax */
  function makeStars(world, n) {
    return Array.from({ length: n || 90 }, () => ({
      x: Math.random() * world.w * 1.3,
      y: Math.random() * world.h,
      r: Math.random() * 1.6 + 0.4,
      d: Math.random() * 0.5 + 0.15
    }));
  }

  function drawTiles(ctx, cam, world, engine) {
    const T = engine.TILE;
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const cols = (world.map[0] || []).length;
    const x0 = Math.max(0, Math.floor(cam.x / T) - 1);
    const x1 = Math.min(cols - 1, Math.ceil((cam.x + W) / T));
    const y0 = Math.max(0, Math.floor(cam.y / T) - 1);
    const y1 = Math.min(world.map.length - 1, Math.ceil((cam.y + H) / T));

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const v = world.map[y] && world.map[y][x];
        if (v !== 1 && v !== 2) continue;
        const px = x * T, py = y * T;
        const top = !engine.isSolid(world.map, x, y - 1);

        ctx.fillStyle = v === 1 ? '#3d4653' : '#4a3b2a';
        ctx.fillRect(px, py, T, T);
        if (top) {
          ctx.fillStyle = v === 1 ? '#5b6675' : '#5f8c2a';
          ctx.fillRect(px, py, T, 6);
          ctx.fillStyle = v === 1 ? '#6f7c8d' : '#7ab02f';
          ctx.fillRect(px, py, T, 2);
        }
        ctx.fillStyle = 'rgba(0,0,0,.22)';
        ctx.fillRect(px, py + T - 4, T, 4);
        ctx.strokeStyle = 'rgba(0,0,0,.3)';
        ctx.strokeRect(px + .5, py + .5, T - 1, T - 1);
      }
    }
  }

  function drawSpikes(ctx, world, engine) {
    const T = engine.TILE;
    ctx.fillStyle = '#f97316';
    for (const s of world.spikes) {
      for (let i = 0; i < 4; i++) {
        const bx = s.x + i * (T / 4);
        ctx.beginPath();
        ctx.moveTo(bx, s.y + s.h);
        ctx.lineTo(bx + T / 8, s.y);
        ctx.lineTo(bx + T / 4, s.y + s.h);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function drawExit(ctx, world, engine) {
    if (!world.exit) return;
    const T = engine.TILE;
    const done = world.coins.every(c => c.taken);
    const pulse = 0.5 + Math.sin(world.time * 3) * 0.3;
    ctx.save();
    ctx.shadowBlur = 22;
    ctx.shadowColor = done ? '#22c55e' : '#64748b';
    ctx.fillStyle = done ? `rgba(34,197,94,${0.55 + pulse * 0.3})` : 'rgba(100,116,139,.35)';
    ctx.fillRect(world.exit.x + 4, world.exit.y + 2, T - 8, T - 2);
    ctx.restore();
    ctx.fillStyle = done ? '#dcfce7' : '#94a3b8';
    ctx.font = '17px serif';
    ctx.textAlign = 'center';
    ctx.fillText(done ? '🚪' : '🔒', world.exit.x + T / 2, world.exit.y + T - 8);
  }

  function drawCoins(ctx, world) {
    for (const c of world.coins) {
      if (c.taken) continue;
      const bob = Math.sin(world.time * 4 + c.bob) * 3;
      const squash = Math.abs(Math.cos(world.time * 2.6 + c.bob));
      ctx.save();
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#eab308';
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(c.x, c.y + bob, Math.max(1.6, c.r * squash), c.r, 0, 0, 6.283);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawEnemies(ctx, world) {
    for (const e of world.enemies) {
      if (!e.alive) continue;
      const wob = Math.sin(e.animTime * 9) * 1.6;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(e.x, e.y + wob, e.w, e.h, 6);
      else ctx.rect(e.x, e.y + wob, e.w, e.h);
      ctx.fill();
      ctx.fillStyle = '#fff';
      const eo = e.vx > 0 ? 4 : -4;
      ctx.beginPath(); ctx.arc(e.x + e.w / 2 - 4 + eo, e.y + 8 + wob, 2.6, 0, 6.283); ctx.fill();
      ctx.beginPath(); ctx.arc(e.x + e.w / 2 + 4 + eo, e.y + 8 + wob, 2.6, 0, 6.283); ctx.fill();
    }
  }

  function drawPlayer(ctx, world, engine, sprite, sheet) {
    const p = world.player;
    if (!p.alive) return;
    if (sprite && sheet) {
      const f = sprite.frameFor(sheet, p.anim, p.animTime);
      if (f) {
        const scale = engine.TILE / sprite.SIZE;
        sprite.drawFrame(ctx, f, p.x - 4, p.y - 2, scale * 1.06, p.facing < 0);
        return;
      }
    }
    ctx.fillStyle = '#58a6ff';
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }

  function drawParticles(ctx, world) {
    for (const q of world.particles) {
      ctx.globalAlpha = Math.max(0, 1 - q.age / q.life);
      ctx.fillStyle = q.color;
      ctx.fillRect(q.x, q.y, q.size, q.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawOverlay(ctx, world) {
    if (world.state === 'playing') return;
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const won = world.state === 'won';
    ctx.fillStyle = won ? 'rgba(6,40,20,.62)' : 'rgba(40,6,6,.62)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '700 34px Inter, sans-serif';
    ctx.fillText(won ? '🏆 Hoàn thành!' : '💀 Thua rồi', W / 2, H / 2 - 6);
    ctx.font = '15px Inter, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(won ? `Điểm: ${world.score} — bấm R để chơi lại` : 'Bấm R để thử lại',
                 W / 2, H / 2 + 26);
  }

  function drawHud(ctx, world) {
    ctx.save();
    ctx.font = '600 15px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#facc15';
    ctx.fillText('🪙 ' + world.score, 14, 26);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText('Còn ' + world.coins.filter(c => !c.taken).length + ' xu', 14, 46);
    ctx.restore();
  }

  /** Ve tat ca trong mot lenh, danh cho nguoi moi bat dau */
  function drawAll(ctx, cam, world, engine, sprite, sheet, stars) {
    drawBackground(ctx, cam, world, stars);
    ctx.save();
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));
    drawTiles(ctx, cam, world, engine);
    drawSpikes(ctx, world, engine);
    drawExit(ctx, world, engine);
    drawCoins(ctx, world);
    drawEnemies(ctx, world);
    drawPlayer(ctx, world, engine, sprite, sheet);
    drawParticles(ctx, world);
    ctx.restore();
    drawHud(ctx, world);
    drawOverlay(ctx, world);
  }

  return { makeStars, drawBackground, drawTiles, drawSpikes, drawExit, drawCoins,
           drawEnemies, drawPlayer, drawParticles, drawOverlay, drawHud, drawAll };
})();

if (typeof window !== 'undefined') window.GameRender = GameRender;
if (typeof module !== 'undefined' && module.exports) module.exports = GameRender;
