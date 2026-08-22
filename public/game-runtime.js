/**
 * GameRuntime — chay BEN TRONG khung game cua hoc vien.
 *
 * Gop GameEngine + GameRender + GameSprite thanh mot doi tuong `Game` duy nhat,
 * lo luon vong lap va ban phim, de code cua hoc vien chi can viet update/draw.
 *
 * Hoc vien van co the bo qua `Game` va tu viet bang ctx thuan.
 */
(function () {
  'use strict';

  var TOKEN = window.__TOKEN__ || '';
  // Origin cua trang cha duoc chen vao luc dung khung game. Khung nay chay o
  // origin rieng (sandbox khong co allow-same-origin) nen tu no khong doc duoc
  // parent.location — phai truyen vao. Nho vay postMessage gui dung mot dich,
  // khong phat cho moi origin.
  var PARENT_ORIGIN = window.__PARENT_ORIGIN__ || '';

  function post(obj) {
    if (!PARENT_ORIGIN) return;
    try {
      obj.__game = TOKEN;
      parent.postMessage(obj, PARENT_ORIGIN);
    } catch (e) { /* khung da dong */ }
  }

  // ─── Chuyen console va loi ve trang cha de hoc vien nhin thay ───
  ['log', 'warn', 'error', 'info'].forEach(function (lv) {
    var orig = console[lv];
    console[lv] = function () {
      var text = [].slice.call(arguments).map(function (a) {
        try {
          if (a instanceof Error) return a.name + ': ' + a.message;
          return typeof a === 'object' ? JSON.stringify(a) : String(a);
        } catch (e) { return String(a); }
      }).join(' ');
      post({ type: 'log', level: lv, text: text });
      orig.apply(console, arguments);
    };
  });

  window.addEventListener('error', function (e) {
    post({ type: 'log', level: 'error', text: e.message + ' (dòng ' + e.lineno + ')' });
  });
  window.addEventListener('unhandledrejection', function (e) {
    post({ type: 'log', level: 'error', text: 'Promise bị từ chối: ' + e.reason });
  });

  // ─── Ban phim ───
  var input = { left: false, right: false, jump: false, jumpPressed: false };
  var onRestart = null;

  window.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a') input.left = true;
    else if (k === 'ArrowRight' || k === 'd') input.right = true;
    else if (k === ' ' || k === 'ArrowUp' || k === 'w') {
      if (!input.jump) input.jumpPressed = true;
      input.jump = true;
    } else if (k === 'r' || k === 'R') {
      if (onRestart) onRestart();
      return;
    } else return;
    e.preventDefault();
  });
  window.addEventListener('keyup', function (e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a') input.left = false;
    else if (k === 'ArrowRight' || k === 'd') input.right = false;
    else if (k === ' ' || k === 'ArrowUp' || k === 'w') input.jump = false;
  });

  // ─── Doi SPRITE dang chuoi sang dang luoi so, chi lam mot lan ───
  var sheetCache = null, sheetSrc = null;
  function sheetOf(SPRITE) {
    if (!SPRITE || !Object.keys(SPRITE).length) return null;
    if (sheetCache && sheetSrc === SPRITE) return sheetCache;
    sheetCache = {};
    for (var k in SPRITE) {
      if (!Object.prototype.hasOwnProperty.call(SPRITE, k)) continue;
      sheetCache[k] = SPRITE[k].map(function (f) {
        // ho tro ca dang chuoi lan dang mang so
        return (typeof f[0] === 'string') ? GameSprite.toGrid(f) : f;
      });
    }
    sheetSrc = SPRITE;
    return sheetCache;
  }

  var E = window.GameEngine, R = window.GameRender, S = window.GameSprite;
  var loopId = null, lastState = null;

  window.Game = {
    TILE: E.TILE,
    TILES: E.T,
    CFG: E.CFG,

    createWorld: function (map, cfg) { return E.createWorld(map, cfg); },
    step: function (world, inp, dt) { return E.step(world, inp, dt); },
    updateCamera: function (cam, world, w, h, dt) { return E.updateCamera(cam, world, w, h, dt); },
    isSolid: function (map, tx, ty) { return E.isSolid(map, tx, ty); },

    makeStars: function (world, n) { return R.makeStars(world, n); },
    drawBackground: function (ctx, cam, world, stars) { return R.drawBackground(ctx, cam, world, stars); },
    drawTiles: function (ctx, cam, world) { return R.drawTiles(ctx, cam, world, E); },
    drawSpikes: function (ctx, world) { return R.drawSpikes(ctx, world, E); },
    drawExit: function (ctx, world) { return R.drawExit(ctx, world, E); },
    drawCoins: function (ctx, world) { return R.drawCoins(ctx, world); },
    drawEnemies: function (ctx, world) { return R.drawEnemies(ctx, world); },
    drawParticles: function (ctx, world) { return R.drawParticles(ctx, world); },
    drawHud: function (ctx, world) { return R.drawHud(ctx, world); },
    drawOverlay: function (ctx, world) { return R.drawOverlay(ctx, world); },
    drawPlayer: function (ctx, world, SPRITE) {
      return R.drawPlayer(ctx, world, E, S, sheetOf(SPRITE));
    },
    drawAll: function (ctx, cam, world, SPRITE, stars) {
      return R.drawAll(ctx, cam, world, E, S, sheetOf(SPRITE), stars);
    },

    /**
     * Vong lap chinh. Goi update(dt, input) roi draw() moi khung hinh.
     * dt bi chot toi da 0.05s: neu doi tab roi quay lai, mot buoc thoi gian
     * qua lon se lam nhan vat bay xuyen tuong.
     */
    start: function (update, draw) {
      var last = performance.now();
      cancelAnimationFrame(loopId);

      function tick(now) {
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        try {
          if (update) update(dt, input);
          input.jumpPressed = false;
          if (draw) draw();
        } catch (err) {
          post({ type: 'log', level: 'error', text: 'Lỗi trong vòng lặp: ' + err.message });
          return;                       // dung han thay vi bao loi 60 lan moi giay
        }
        loopId = requestAnimationFrame(tick);
      }
      loopId = requestAnimationFrame(tick);
    },

    stop: function () { cancelAnimationFrame(loopId); },
    onRestart: function (fn) { onRestart = fn; },

    /** Bao trang thai len thanh HUD ben ngoai */
    report: function (world) {
      var key = world.state + ':' + world.score;
      if (key === lastState) return;
      lastState = key;
      post({ type: 'state', state: world.state, score: world.score });
    },

    __reportError: function (e) {
      post({ type: 'log', level: 'error', text: (e && e.message) || String(e) });
    }
  };

  post({ type: 'log', level: 'info', text: 'Game runtime sẵn sàng — thư viện Game đã nạp.' });
})();
