/**
 * Game Studio — ve ban do, ve nhan vat, choi thu.
 *
 * Vat ly nam trong GameEngine (da kiem thu 22/22 bang so), hinh anh nhan vat
 * nam trong GameSprite. File nay chi lo giao dien va ve len canvas.
 */
const GameBuilder = (() => {
  'use strict';

  const COLS = 26, ROWS = 15;
  const E = () => window.GameEngine;
  const S = () => window.GameSprite;

  const TILES = [
    { id: 0, name: 'Tẩy', color: 'transparent', icon: '⌫' },
    { id: 1, name: 'Tường', color: '#4b5563', icon: '🧱' },
    { id: 2, name: 'Nền đất', color: '#3f6212', icon: '🟫' },
    { id: 3, name: 'Đồng xu', color: '#eab308', icon: '🪙' },
    { id: 4, name: 'Người chơi', color: '#58a6ff', icon: '🧍' },
    { id: 5, name: 'Quái vật', color: '#ef4444', icon: '👾' },
    { id: 6, name: 'Cổng đích', color: '#22c55e', icon: '🚪' },
    { id: 7, name: 'Bẫy gai', color: '#f97316', icon: '🔺' }
  ];

  let map = [];
  let sheet = null;
  let tab = 'map';
  let brush = 1;
  let painting = false;
  let hostId = null;

  // trang thai trinh ve nhan vat
  let spAnim = 'idle', spFrame = 0, spColor = 3, spDrawing = false;

  // code game cua hoc vien (nguon su that)
  let code = null;
  let codeLoaded = false;
  let runToken = 0;

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // ─── Ban do mac dinh: mot man platformer choi duoc ngay ───
  function defaultMap() {
    const m = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
    for (let x = 0; x < COLS; x++) m[ROWS - 1][x] = 2;
    for (let y = 0; y < ROWS; y++) { m[y][0] = 1; m[y][COLS - 1] = 1; }

    // buc thang va be
    [[5, 11], [6, 11], [7, 11], [10, 9], [11, 9], [14, 7], [15, 7], [16, 7], [20, 9], [21, 9]]
      .forEach(([x, y]) => { if (m[y]) m[y][x] = 2; });
    // ho
    for (let x = 17; x <= 18; x++) m[ROWS - 1][x] = 0;

    m[ROWS - 2][2] = 4;                        // nguoi choi
    m[ROWS - 2][23] = 6;                       // cong dich
    [[6, 10], [11, 8], [15, 6], [21, 8], [12, 13]].forEach(([x, y]) => { if (m[y]) m[y][x] = 3; });
    m[ROWS - 2][9] = 5;
    m[ROWS - 2][20] = 5;
    m[ROWS - 2][13] = 7;
    return m;
  }

  // ═════════════════════════════ GIAO DIEN ═════════════════════════════
  function renderStudio(id, initialMatrix) {
    hostId = id;
    const el = document.getElementById(id);
    if (!el) return;

    if (!map.length) map = (Array.isArray(initialMatrix) && initialMatrix.length)
      ? initialMatrix.map(r => r.slice()) : defaultMap();
    if (!sheet && S()) sheet = S().defaultSheet();

    el.innerHTML = `
      <div class="gs">
        <div class="gs-tabs" role="tablist">
          <button class="gs-tab${tab === 'map' ? ' active' : ''}" onclick="GameBuilder.setTab('map')">🗺️ Bản đồ</button>
          <button class="gs-tab${tab === 'sprite' ? ' active' : ''}" onclick="GameBuilder.setTab('sprite')">🎨 Nhân vật</button>
          <button class="gs-tab${tab === 'code' ? ' active' : ''}" onclick="GameBuilder.setTab('code')">📝 Code</button>
          <button class="gs-tab${tab === 'play' ? ' active' : ''}" onclick="GameBuilder.setTab('play')">▶️ Chơi thử</button>
        </div>
        <div class="gs-body" id="gs-body"></div>
      </div>`;
    paintTab();
  }

  function setTab(t) {
    if (t === tab) return;
    stopGame();
    tab = t;
    const LABEL = { map: 'Bản đồ', sprite: 'Nhân vật', code: 'Code', play: 'Chơi thử' };
    document.querySelectorAll('.gs-tab').forEach(b =>
      b.classList.toggle('active', b.textContent.includes(LABEL[t])));
    paintTab();
  }

  function paintTab() {
    const body = document.getElementById('gs-body');
    if (!body) return;
    if (tab === 'map') { body.innerHTML = mapUI(); drawMapGrid(); }
    else if (tab === 'sprite') { body.innerHTML = spriteUI(); drawSpriteGrid(); drawSpritePreview(); }
    else if (tab === 'code') { body.innerHTML = codeUI(); syncGutter(); }
    else { body.innerHTML = playUI(); startGame(); }
  }

  // ───────────────────────── TAB BAN DO ─────────────────────────
  function mapUI() {
    return `
      <div class="gs-pane">
        <div class="gs-toolbar">
          <div class="gs-palette">
            ${TILES.map(t => `
              <button class="gs-tile${brush === t.id ? ' active' : ''}"
                      onclick="GameBuilder.setBrush(${t.id})" title="${esc(t.name)}">
                <span>${t.icon}</span><em>${esc(t.name)}</em>
              </button>`).join('')}
          </div>
          <div class="gs-actions">
            <button class="gs-btn" onclick="GameBuilder.clearMap()">Xóa hết</button>
            <button class="gs-btn" onclick="GameBuilder.resetMap()">Mẫu</button>
            <button class="gs-btn primary" onclick="GameBuilder.setTab('play')">Chơi thử →</button>
          </div>
        </div>
        <div class="gs-canvas-wrap">
          <canvas id="gs-map" width="${COLS * 26}" height="${ROWS * 26}"
                  onmousedown="GameBuilder.mapDown(event)"
                  onmousemove="GameBuilder.mapMove(event)"
                  onmouseup="GameBuilder.mapUp()" onmouseleave="GameBuilder.mapUp()"></canvas>
        </div>
        <p class="gs-hint">Kéo chuột để vẽ. Chỉ được có <strong>một người chơi</strong> và <strong>một cổng đích</strong> — đặt cái mới sẽ tự xóa cái cũ.</p>
      </div>`;
  }

  function drawMapGrid() {
    const cv = document.getElementById('gs-map');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const s = 26;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, cv.width, cv.height);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const v = map[y][x];
        const px = x * s, py = y * s;
        if (v === 1 || v === 2) {
          ctx.fillStyle = v === 1 ? '#4b5563' : '#3f6212';
          ctx.fillRect(px, py, s, s);
          ctx.fillStyle = v === 1 ? '#6b7280' : '#4d7c0f';
          ctx.fillRect(px, py, s, 4);
        } else if (v) {
          const t = TILES.find(t => t.id === v);
          ctx.fillStyle = (t ? t.color : '#fff') + '33';
          ctx.fillRect(px, py, s, s);
          ctx.font = '15px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t ? t.icon : '?', px + s / 2, py + s / 2 + 1);
        }
        ctx.strokeStyle = '#161b22';
        ctx.strokeRect(px + .5, py + .5, s, s);
      }
    }
  }

  function cellFrom(ev) {
    const cv = ev.currentTarget;
    const r = cv.getBoundingClientRect();
    const x = Math.floor((ev.clientX - r.left) / r.width * COLS);
    const y = Math.floor((ev.clientY - r.top) / r.height * ROWS);
    return (x >= 0 && x < COLS && y >= 0 && y < ROWS) ? { x, y } : null;
  }

  function paintCell(ev) {
    const c = cellFrom(ev);
    if (!c) return;
    if (map[c.y][c.x] === brush) return;
    // nguoi choi va cong dich chi duoc co mot
    if (brush === 4 || brush === 6) {
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++)
          if (map[y][x] === brush) map[y][x] = 0;
    }
    map[c.y][c.x] = brush;
    drawMapGrid();
    if (codeLoaded) syncDataIntoCode();
  }

  const setBrush = id => { brush = id; paintTab(); };
  const mapDown = ev => { painting = true; paintCell(ev); };
  const mapMove = ev => { if (painting) paintCell(ev); };
  const mapUp = () => { painting = false; };
  const clearMap = () => {
    map = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
    drawMapGrid();
    if (codeLoaded) syncDataIntoCode();
  };
  const resetMap = () => { map = defaultMap(); drawMapGrid(); if (codeLoaded) syncDataIntoCode(); };

  // ───────────────────────── TAB NHAN VAT ─────────────────────────
  function spriteUI() {
    const sp = S();
    if (!sp) return '<p class="gs-hint">Chưa nạp được GameSprite.</p>';
    const frames = sheet[spAnim] || [];
    return `
      <div class="gs-pane gs-sprite">
        <div class="gs-sp-left">
          <div class="gs-sp-anims">
            ${['idle', 'run', 'jump', 'fall'].map(a => `
              <button class="gs-chip${spAnim === a ? ' active' : ''}"
                      onclick="GameBuilder.setAnim('${a}')">${a}</button>`).join('')}
          </div>
          <div class="gs-sp-frames">
            ${frames.map((_, i) => `
              <button class="gs-frame${spFrame === i ? ' active' : ''}"
                      onclick="GameBuilder.setFrame(${i})">${i + 1}</button>`).join('')}
            <button class="gs-frame add" onclick="GameBuilder.addFrame()" title="Thêm khung hình">+</button>
            ${frames.length > 1 ? `<button class="gs-frame del" onclick="GameBuilder.delFrame()" title="Xóa khung này">×</button>` : ''}
          </div>
          <canvas id="gs-sp" width="384" height="384"
                  onmousedown="GameBuilder.spDown(event)"
                  onmousemove="GameBuilder.spMove(event)"
                  onmouseup="GameBuilder.spUp()" onmouseleave="GameBuilder.spUp()"></canvas>
        </div>
        <div class="gs-sp-right">
          <h4>Bảng màu</h4>
          <div class="gs-colors">
            ${sp.PALETTE.map((c, i) => `
              <button class="gs-color${spColor === i ? ' active' : ''}${i === 0 ? ' clear' : ''}"
                      style="${i ? `background:${c}` : ''}"
                      onclick="GameBuilder.setColor(${i})"
                      title="${esc(sp.PALETTE_NAMES[i] || '')}"></button>`).join('')}
          </div>
          <h4>Xem trước</h4>
          <canvas id="gs-sp-prev" width="160" height="120"></canvas>
          <p class="gs-hint">Chuyển động chạy đúng tốc độ thật trong game.</p>
          <button class="gs-btn" onclick="GameBuilder.resetSprite()">Khôi phục mẫu</button>
          <button class="gs-btn primary" onclick="GameBuilder.setTab('play')">Chơi thử →</button>
        </div>
      </div>`;
  }

  function drawSpriteGrid() {
    const cv = document.getElementById('gs-sp');
    const sp = S();
    if (!cv || !sp) return;
    const ctx = cv.getContext('2d');
    const s = cv.width / sp.SIZE;
    const frame = (sheet[spAnim] || [])[spFrame];
    if (!frame) return;

    for (let r = 0; r < sp.SIZE; r++) {
      for (let c = 0; c < sp.SIZE; c++) {
        // nen ca ro de thay vung trong suot
        ctx.fillStyle = (r + c) % 2 ? '#161b22' : '#1c2128';
        ctx.fillRect(c * s, r * s, s, s);
        const v = frame[r][c];
        if (v) { ctx.fillStyle = sp.PALETTE[v]; ctx.fillRect(c * s, r * s, s, s); }
      }
    }
    ctx.strokeStyle = 'rgba(255,255,255,.05)';
    for (let i = 0; i <= sp.SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * s, 0); ctx.lineTo(i * s, cv.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * s); ctx.lineTo(cv.width, i * s); ctx.stroke();
    }
  }

  let prevRaf = null;
  function drawSpritePreview() {
    const cv = document.getElementById('gs-sp-prev');
    const sp = S();
    if (!cv || !sp) return;
    const ctx = cv.getContext('2d');
    cancelAnimationFrame(prevRaf);
    const t0 = performance.now();
    (function loop(now) {
      if (!document.getElementById('gs-sp-prev')) return;
      const t = (now - t0) / 1000;
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, cv.width, cv.height);
      const f = sp.frameFor(sheet, spAnim, t);
      if (f) sp.drawFrame(ctx, f, cv.width / 2 - 48, 12, 6, false);
      prevRaf = requestAnimationFrame(loop);
    })(t0);
  }

  function spCell(ev) {
    const cv = ev.currentTarget;
    const sp = S();
    const r = cv.getBoundingClientRect();
    const c = Math.floor((ev.clientX - r.left) / r.width * sp.SIZE);
    const rr = Math.floor((ev.clientY - r.top) / r.height * sp.SIZE);
    return (c >= 0 && c < sp.SIZE && rr >= 0 && rr < sp.SIZE) ? { c, r: rr } : null;
  }
  function spPaint(ev) {
    const p = spCell(ev);
    if (!p) return;
    const frame = (sheet[spAnim] || [])[spFrame];
    if (!frame || frame[p.r][p.c] === spColor) return;
    frame[p.r][p.c] = spColor;
    drawSpriteGrid();
    if (codeLoaded) syncDataIntoCode();
  }
  const spDown = ev => { spDrawing = true; spPaint(ev); };
  const spMove = ev => { if (spDrawing) spPaint(ev); };
  const spUp = () => { spDrawing = false; };
  const setColor = i => { spColor = i; paintTab(); };
  const setAnim = a => { spAnim = a; spFrame = 0; paintTab(); };
  const setFrame = i => { spFrame = i; paintTab(); };

  function addFrame() {
    const sp = S();
    const frames = sheet[spAnim];
    const src = frames[spFrame] || Array.from({ length: sp.SIZE }, () => new Array(sp.SIZE).fill(0));
    frames.splice(spFrame + 1, 0, src.map(r => r.slice()));
    spFrame++;
    paintTab();
  }
  function delFrame() {
    const frames = sheet[spAnim];
    if (frames.length <= 1) return;
    frames.splice(spFrame, 1);
    spFrame = Math.max(0, spFrame - 1);
    paintTab();
  }
  function resetSprite() { sheet = S().defaultSheet(); spFrame = 0; paintTab(); }

  // ───────────────────────── TAB CODE ─────────────────────────
  // Code game cua hoc vien. Day moi la nguon su that: hai trinh ve chi
  // va du lieu MAP va SPRITE vao day, con logic game do hoc vien viet.
  function defaultCode() {
    return [
      '// ═══ Dữ liệu bạn vẽ ở hai tab bên cạnh ═══',
      '// Hai hằng số này tự cập nhật mỗi khi bạn vẽ lại.',
      'const MAP = [];',
      'const SPRITE = {};',
      '',
      '// ═══ Code game của bạn ═══',
      'const canvas = document.getElementById("game");',
      'const ctx = canvas.getContext("2d");',
      '',
      'const world = Game.createWorld(MAP);',
      'const cam = { x: 0, y: 0 };',
      'const stars = Game.makeStars(world, 90);',
      '',
      '// Thử đổi số này rồi bấm Chạy lại xem nhân vật nhảy khác thế nào',
      'world.cfg.jumpSpeed = 620;',
      '',
      '// Chạy 60 lần mỗi giây. dt = số giây trôi qua từ khung hình trước.',
      'function update(dt, input) {',
      '  Game.step(world, input, dt);',
      '  Game.updateCamera(cam, world, canvas.width, canvas.height, dt);',
      '  Game.report(world);',
      '}',
      '',
      'function draw() {',
      '  // Vẽ tất cả trong một lệnh:',
      '  Game.drawAll(ctx, cam, world, SPRITE, stars);',
      '',
      '  // Hoặc tự vẽ từng lớp — bỏ dấu // ở các dòng dưới và xóa dòng trên:',
      '  // Game.drawBackground(ctx, cam, world, stars);',
      '  // ctx.save(); ctx.translate(-cam.x, -cam.y);',
      '  // Game.drawTiles(ctx, cam, world);',
      '  // Game.drawCoins(ctx, world);',
      '  // Game.drawEnemies(ctx, world);',
      '  // Game.drawPlayer(ctx, world, SPRITE);',
      '  // ctx.restore();',
      '}',
      '',
      'Game.start(update, draw);'
    ].join('\n');
  }

  /**
   * Thay gia tri cua mot hang so trong code, giu nguyen phan con lai.
   * Dem ngoac va bo qua chuoi de khong cat nham giua du lieu.
   */
  function replaceConst(src, name, valueText) {
    const re = new RegExp('const\\s+' + name + '\\s*=\\s*', 'm');
    const m = re.exec(src);
    if (!m) return null;

    const open = m.index + m[0].length;
    const openCh = src[open];
    if (openCh !== '[' && openCh !== '{') return null;
    const closeCh = openCh === '[' ? ']' : '}';

    let depth = 0, i = open;
    while (i < src.length) {
      const c = src[i];
      if (c === '"' || c === "'" || c === '`') {
        const q = c; i++;
        while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
      } else if (c === openCh) depth++;
      else if (c === closeCh) { depth--; if (depth === 0) break; }
      i++;
    }
    if (i >= src.length) return null;
    return src.slice(0, open) + valueText + src.slice(i + 1);
  }

  /** Ghi du lieu vua ve vao code cua hoc vien */
  function syncDataIntoCode() {
    if (!codeLoaded) { code = defaultCode(); codeLoaded = true; }

    const mapText = '[\n' + map.map(r => '  [' + r.join(',') + ']').join(',\n') + '\n]';

    const sp = S();
    let spriteText = '{}';
    if (sp && sheet) {
      const parts = [];
      for (const anim of Object.keys(sheet)) {
        const frames = sheet[anim].map(f =>
          '    [\n' + sp.toRows(f).map(r => "      '" + r + "'").join(',\n') + '\n    ]');
        parts.push('  ' + anim + ': [\n' + frames.join(',\n') + '\n  ]');
      }
      spriteText = '{\n' + parts.join(',\n') + '\n}';
    }

    let next = replaceConst(code, 'MAP', mapText);
    if (next) code = next;
    next = replaceConst(code, 'SPRITE', spriteText);
    if (next) code = next;

    const ta = document.getElementById('gs-code');
    if (ta) { ta.value = code; syncGutter(); }
  }

  function codeUI() {
    if (!codeLoaded) syncDataIntoCode();
    return `
      <div class="gs-pane">
        <div class="gs-toolbar">
          <span class="gs-hint">Đây là code game của bạn — tab Chơi thử chạy đúng file này.</span>
          <div class="gs-actions">
            <button class="gs-btn" onclick="GameBuilder.resetCode()">Khôi phục mẫu</button>
            <button class="gs-btn primary" onclick="GameBuilder.setTab('play')">Chạy thử →</button>
          </div>
        </div>
        <div class="gs-code-wrap">
          <div class="gs-gutter" id="gs-gutter"></div>
          <textarea class="gs-code" id="gs-code" spellcheck="false"
                    aria-label="Code game của bạn"
                    oninput="GameBuilder.onCodeInput()"
                    onscroll="GameBuilder.syncScroll()"
                    onkeydown="GameBuilder.codeKey(event)">${esc(code)}</textarea>
        </div>
        <p class="gs-hint">
          Thư viện <code>Game</code> có sẵn: <code>createWorld</code>, <code>step</code>,
          <code>updateCamera</code>, <code>drawAll</code>, <code>drawTiles</code>,
          <code>drawPlayer</code>, <code>makeStars</code>, <code>start</code>, <code>report</code>.
          Bạn cũng có thể bỏ hết và tự vẽ bằng <code>ctx</code> thuần.
        </p>
      </div>`;
  }

  function onCodeInput() {
    const ta = document.getElementById('gs-code');
    if (ta) code = ta.value;
    syncGutter();
  }
  function syncGutter() {
    const ta = document.getElementById('gs-code');
    const g = document.getElementById('gs-gutter');
    if (!ta || !g) return;
    const n = ta.value.split('\n').length;
    g.innerHTML = Array.from({ length: n }, (_, i) => i + 1).join('<br>');
    g.scrollTop = ta.scrollTop;
  }
  function syncScroll() {
    const ta = document.getElementById('gs-code');
    const g = document.getElementById('gs-gutter');
    if (ta && g) g.scrollTop = ta.scrollTop;
  }
  function codeKey(e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.target;
    const st = ta.selectionStart;
    ta.value = ta.value.slice(0, st) + '  ' + ta.value.slice(ta.selectionEnd);
    ta.selectionStart = ta.selectionEnd = st + 2;
    onCodeInput();
  }
  function resetCode() { code = defaultCode(); codeLoaded = true; syncDataIntoCode(); paintTab(); }

  // ───────────────────────── TAB CHOI THU ─────────────────────────
  function playUI() {
    return `
      <div class="gs-pane">
        <div class="gs-hud">
          <span class="gs-hud-state" id="gs-state">Đang nạp code của bạn…</span>
          <div class="gs-actions">
            <button class="gs-btn" onclick="GameBuilder.restart()">↻ Chạy lại</button>
            <button class="gs-btn" onclick="GameBuilder.setTab('code')">← Sửa code</button>
          </div>
        </div>
        <div class="gs-canvas-wrap">
          <iframe id="gs-frame" class="gs-frame" title="Game của bạn"
                  sandbox="allow-scripts allow-modals"></iframe>
        </div>
        <details class="gs-console-box" open>
          <summary>Console <span class="gs-count" id="gs-log-count"></span></summary>
          <div class="gs-console" id="gs-console"></div>
        </details>
        <p class="gs-hint">
          <kbd>←</kbd><kbd>→</kbd> di chuyển · <kbd>Space</kbd> nhảy · <kbd>R</kbd> chơi lại
          — bấm vào khung game trước để nhận phím.
        </p>
      </div>`;
  }

  let logs = [];

  function onFrameMessage(ev) {
    const f = document.getElementById('gs-frame');
    if (!f || ev.source !== f.contentWindow) return;
    const d = ev.data;
    if (!d || d.__game !== runToken) return;

    if (d.type === 'log') {
      logs.push({ level: d.level, text: d.text });
      if (logs.length > 60) logs = logs.slice(-60);
      paintConsole();
    } else if (d.type === 'state') {
      const el = document.getElementById('gs-state');
      if (!el) return;
      el.textContent = d.state === 'won' ? '🏆 Thắng! Điểm ' + d.score
        : d.state === 'dead' ? '💀 Thua — bấm R để chơi lại'
        : 'Đang chơi · 🪙 ' + d.score;
      el.className = 'gs-hud-state ' + d.state;
    }
  }

  function paintConsole() {
    const box = document.getElementById('gs-console');
    const badge = document.getElementById('gs-log-count');
    if (!box) return;
    const errs = logs.filter(l => l.level === 'error').length;
    if (badge) {
      badge.textContent = logs.length || '';
      badge.className = 'gs-count' + (errs ? ' has-err' : '');
    }
    box.innerHTML = logs.length
      ? logs.map(l => `<div class="gs-log ${l.level}">${esc(l.text)}</div>`).join('')
      : '<div class="gs-log-empty">console.log() và lỗi trong code sẽ hiện ở đây</div>';
    box.scrollTop = box.scrollHeight;
  }

  /**
   * Dung trang HTML chay code hoc vien.
   * Thu vien nap qua the <script src> tuyet doi: khung nay o origin rieng
   * (sandbox khong co allow-same-origin) nen duong dan tuong doi khong chac chan.
   */
  function buildDoc(token, userCode) {
    const O = location.origin;
    return [
      '<!doctype html><html><head><meta charset="utf-8"><style>',
      'html,body{margin:0;height:100%;background:#0b1026;overflow:hidden}',
      'canvas{display:block;width:100%;height:100%;image-rendering:pixelated}',
      '</style></head><body>',
      '<canvas id="game" width="832" height="468"></canvas>',
      '<scr' + 'ipt>window.__TOKEN__=' + JSON.stringify(token) +
        ';window.__PARENT_ORIGIN__=' + JSON.stringify(O) + ';</scr' + 'ipt>',
      '<scr' + 'ipt src="' + O + '/game-engine.js"></scr' + 'ipt>',
      '<scr' + 'ipt src="' + O + '/game-sprite.js"></scr' + 'ipt>',
      '<scr' + 'ipt src="' + O + '/game-render.js"></scr' + 'ipt>',
      '<scr' + 'ipt src="' + O + '/game-runtime.js"></scr' + 'ipt>',
      '<scr' + 'ipt>',
      'try {',
      userCode,
      '} catch (e) { if (window.Game) Game.__reportError(e); else throw e; }',
      '</scr' + 'ipt></body></html>'
    ].join('\n');
  }

  function startGame() {
    if (!codeLoaded) syncDataIntoCode();
    const frame = document.getElementById('gs-frame');
    if (!frame) return;

    logs = [];
    paintConsole();
    runToken = 'g' + Date.now();

    window.removeEventListener('message', onFrameMessage);
    window.addEventListener('message', onFrameMessage);

    frame.srcdoc = buildDoc(runToken, code);
  }

  function stopGame() {
    window.removeEventListener('message', onFrameMessage);
    cancelAnimationFrame(prevRaf);
    const frame = document.getElementById('gs-frame');
    if (frame) frame.srcdoc = '';
  }

  function restart() { startGame(); }

  // ─── Xuat code ───
  // Xuat ra chinh file hoc vien dang viet, khong phai code do may sinh rieng.
  function exportCode() {
    if (!codeLoaded) syncDataIntoCode();
    return code;
  }

  return {
    renderStudio, setTab, setBrush, mapDown, mapMove, mapUp, clearMap, resetMap,
    setColor, setAnim, setFrame, addFrame, delFrame, resetSprite,
    spDown, spMove, spUp, restart, stopGame, exportCode,
    onCodeInput, syncScroll, codeKey, resetCode,
    getMap: () => map.map(r => r.slice()),
    getSheet: () => sheet,
    getCode: () => code,
    // giu ten cu de cho goi trong app.js khong vo
    init: (m) => { if (Array.isArray(m) && m.length) map = m.map(r => r.slice()); },
    runPlayableGame: () => setTab('play')
  };
})();

if (typeof window !== 'undefined') window.GameBuilder = GameBuilder;
