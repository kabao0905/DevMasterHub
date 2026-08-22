/**
 * SQL Studio — so do ERD ve tu schema + trinh chay SQL that (dua tren SqlEngine).
 *
 * Khac ban cu: khong co bang ket qua viet cung. Moi ket qua deu do SqlEngine
 * thuc thi tren du lieu that, nen doi cau lenh la doi ket qua.
 */
const SqlStudio = (() => {
  'use strict';

  // ─── Schema: nguon su that duy nhat, dung cho ca ERD lan engine ───
  const SCHEMA = {
    users: {
      label: 'Người dùng',
      columns: [
        { name: 'id', type: 'INT', pk: true },
        { name: 'name', type: 'VARCHAR(60)' },
        { name: 'email', type: 'VARCHAR(120)', unique: true },
        { name: 'city', type: 'VARCHAR(40)' },
        { name: 'age', type: 'INT' }
      ],
      rows: [
        { id: 1, name: 'Nguyễn Văn An', email: 'an@devmaster.vn', city: 'Hà Nội', age: 25 },
        { id: 2, name: 'Trần Thị Bình', email: 'binh@devmaster.vn', city: 'Đà Nẵng', age: 31 },
        { id: 3, name: 'Lê Hoàng Cường', email: 'cuong@devmaster.vn', city: 'Hà Nội', age: 19 },
        { id: 4, name: 'Phạm Thùy Dung', email: 'dung@devmaster.vn', city: 'TP.HCM', age: 42 },
        { id: 5, name: 'Vũ Quốc Em', email: 'em@devmaster.vn', city: 'TP.HCM', age: 28 }
      ]
    },
    products: {
      label: 'Sản phẩm',
      columns: [
        { name: 'id', type: 'INT', pk: true },
        { name: 'title', type: 'VARCHAR(80)' },
        { name: 'category', type: 'VARCHAR(40)' },
        { name: 'price', type: 'DECIMAL' }
      ],
      rows: [
        { id: 10, title: 'Bàn phím cơ', category: 'Phụ kiện', price: 1200000 },
        { id: 11, title: 'Chuột không dây', category: 'Phụ kiện', price: 450000 },
        { id: 12, title: 'Màn hình 27"', category: 'Màn hình', price: 5400000 },
        { id: 13, title: 'Tai nghe chống ồn', category: 'Âm thanh', price: 2100000 }
      ]
    },
    orders: {
      label: 'Đơn hàng',
      columns: [
        { name: 'id', type: 'INT', pk: true },
        { name: 'user_id', type: 'INT', fk: 'users.id' },
        { name: 'product_id', type: 'INT', fk: 'products.id' },
        { name: 'quantity', type: 'INT' },
        { name: 'status', type: 'VARCHAR(20)' }
      ],
      rows: [
        { id: 101, user_id: 1, product_id: 10, quantity: 1, status: 'completed' },
        { id: 102, user_id: 1, product_id: 12, quantity: 2, status: 'pending' },
        { id: 103, user_id: 2, product_id: 11, quantity: 3, status: 'completed' },
        { id: 104, user_id: 4, product_id: 13, quantity: 1, status: 'completed' },
        { id: 105, user_id: 4, product_id: 10, quantity: 2, status: 'cancelled' },
        { id: 106, user_id: 5, product_id: 12, quantity: 1, status: 'completed' }
      ]
    }
  };

  const EXAMPLES = [
    { label: 'Xem toàn bộ bảng', sql: 'SELECT * FROM users;' },
    { label: 'Lọc WHERE', sql: "SELECT name, city, age\nFROM users\nWHERE age > 25 AND city = 'Hà Nội';" },
    { label: 'JOIN 2 bảng', sql: 'SELECT u.name, o.id AS ma_don, o.status\nFROM users u\nJOIN orders o ON u.id = o.user_id;' },
    { label: 'LEFT JOIN', sql: 'SELECT u.name, o.id AS ma_don\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;' },
    { label: 'GROUP BY + SUM', sql: 'SELECT u.name, COUNT(o.id) AS so_don\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.name\nORDER BY so_don DESC;' },
    { label: 'JOIN 3 bảng', sql: 'SELECT u.name, p.title, o.quantity, p.price\nFROM orders o\nJOIN users u ON o.user_id = u.id\nJOIN products p ON o.product_id = p.id\nWHERE o.status = \'completed\';' },
    { label: 'HAVING', sql: 'SELECT category, COUNT(*) AS so_sp, AVG(price) AS gia_tb\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 1;' }
  ];

  let containerId = null;
  let lastResult = null;

  // ─────────────────────────────────────────────────────────
  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtCell(v) {
    if (v === null || v === undefined) return '<span class="sqls-null">NULL</span>';
    if (typeof v === 'number') {
      const s = Number.isInteger(v) ? v.toLocaleString('vi-VN') : v.toFixed(2);
      return `<span class="sqls-num">${s}</span>`;
    }
    return esc(v);
  }

  // ─── ERD: ve bang SVG, duong noi tinh tu vi tri that cua cot ───
  function renderERD() {
    const names = Object.keys(SCHEMA);
    const CARD_W = 210, ROW_H = 26, HEAD_H = 38, GAP_X = 90, PAD = 16;

    // xep 3 bang: users va products cot trai, orders cot phai
    const layout = {};
    const left = names.filter(n => n !== 'orders');
    let y = PAD;
    left.forEach(n => {
      layout[n] = { x: PAD, y, w: CARD_W, h: HEAD_H + SCHEMA[n].columns.length * ROW_H };
      y += layout[n].h + 28;
    });
    const rightX = PAD + CARD_W + GAP_X;
    const ordersH = HEAD_H + SCHEMA.orders.columns.length * ROW_H;
    layout.orders = { x: rightX, y: PAD + (y - PAD - 28 - ordersH) / 2, w: CARD_W, h: ordersH };

    const totalH = Math.max(y, layout.orders.y + ordersH + PAD);
    const totalW = rightX + CARD_W + PAD;

    const colY = (table, colName) => {
      const idx = SCHEMA[table].columns.findIndex(c => c.name === colName);
      return layout[table].y + HEAD_H + idx * ROW_H + ROW_H / 2;
    };

    // duong noi khoa ngoai
    let links = '';
    for (const [tName, t] of Object.entries(SCHEMA)) {
      for (const col of t.columns) {
        if (!col.fk) continue;
        const [refTable, refCol] = col.fk.split('.');
        const x1 = layout[refTable].x + layout[refTable].w;
        const y1 = colY(refTable, refCol);
        const x2 = layout[tName].x;
        const y2 = colY(tName, col.name);
        const mx = (x1 + x2) / 2;
        links += `
          <path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}"
                fill="none" stroke="#58a6ff" stroke-width="1.6" opacity="0.75"/>
          <circle cx="${x1}" cy="${y1}" r="3.5" fill="#e3b341"/>
          <circle cx="${x2}" cy="${y2}" r="3.5" fill="#58a6ff"/>
          <text x="${mx}" y="${(y1 + y2) / 2 - 7}" text-anchor="middle"
                font-size="10" fill="#8b949e" font-family="var(--font-mono)">1 : N</text>`;
      }
    }

    // the bang
    let cards = '';
    for (const [tName, t] of Object.entries(SCHEMA)) {
      const L = layout[tName];
      let rowsSvg = '';
      t.columns.forEach((c, i) => {
        const cy = L.y + HEAD_H + i * ROW_H;
        const icon = c.pk ? '🔑' : c.fk ? '🔗' : '';
        const nameColor = c.pk ? '#e3b341' : c.fk ? '#58a6ff' : '#e6edf3';
        const weight = (c.pk || c.fk) ? '600' : '400';
        rowsSvg += `
          <rect x="${L.x}" y="${cy}" width="${L.w}" height="${ROW_H}" fill="transparent"/>
          <text x="${L.x + 12}" y="${cy + 17}" font-size="11.5" font-family="var(--font-mono)"
                fill="${nameColor}" font-weight="${weight}">${icon} ${esc(c.name)}</text>
          <text x="${L.x + L.w - 12}" y="${cy + 17}" font-size="10" text-anchor="end"
                font-family="var(--font-mono)" fill="#6e7681">${esc(c.type)}</text>
          ${i < t.columns.length - 1 ? `<line x1="${L.x + 8}" y1="${cy + ROW_H}" x2="${L.x + L.w - 8}" y2="${cy + ROW_H}" stroke="#21262d" stroke-width="1"/>` : ''}`;
      });

      cards += `
        <g class="sqls-erd-card">
          <rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="10"
                fill="#161b22" stroke="#30363d" stroke-width="1.5"/>
          <rect x="${L.x}" y="${L.y}" width="${L.w}" height="${HEAD_H}" rx="10" fill="#1f2937"/>
          <rect x="${L.x}" y="${L.y + HEAD_H - 10}" width="${L.w}" height="10" fill="#1f2937"/>
          <line x1="${L.x}" y1="${L.y + HEAD_H}" x2="${L.x + L.w}" y2="${L.y + HEAD_H}" stroke="#30363d" stroke-width="1.5"/>
          <text x="${L.x + 12}" y="${L.y + 24}" font-size="13" font-weight="700" fill="#e6edf3">${esc(tName)}</text>
          <text x="${L.x + L.w - 12}" y="${L.y + 24}" font-size="10" text-anchor="end" fill="#6e7681">${esc(t.rows.length)} dòng</text>
          ${rowsSvg}
        </g>`;
    }

    return `<svg viewBox="0 0 ${totalW} ${totalH}" width="100%" style="max-height:340px" role="img"
                 aria-label="Sơ đồ quan hệ giữa các bảng">${links}${cards}</svg>`;
  }

  // ─────────────────────────────────────────────────────────
  function renderStudio(id) {
    containerId = id;
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = `
      <div class="sqls">
        <section class="sqls-panel">
          <header class="sqls-head">
            <h3>Sơ đồ quan hệ</h3>
            <div class="sqls-legend">
              <span><i class="sqls-dot pk"></i>Khóa chính</span>
              <span><i class="sqls-dot fk"></i>Khóa ngoại</span>
            </div>
          </header>
          <div class="sqls-erd">${renderERD()}</div>
        </section>

        <section class="sqls-panel">
          <header class="sqls-head">
            <h3>Câu truy vấn</h3>
            <button class="sqls-run" onclick="SqlStudio.run()">
              <span>Chạy</span><kbd>Ctrl↵</kbd>
            </button>
          </header>

          <div class="sqls-examples" role="group" aria-label="Ví dụ truy vấn">
            ${EXAMPLES.map((e, i) =>
              `<button class="sqls-chip" onclick="SqlStudio.loadExample(${i})">${esc(e.label)}</button>`
            ).join('')}
          </div>

          <div class="sqls-editor-wrap">
            <div class="sqls-gutter" id="sqls-gutter">1</div>
            <textarea class="sqls-editor" id="sqls-input" spellcheck="false"
                      aria-label="Trình soạn thảo SQL"
                      oninput="SqlStudio.syncGutter()"
                      onkeydown="SqlStudio.onKey(event)">${esc(EXAMPLES[4].sql)}</textarea>
          </div>
        </section>

        <section class="sqls-panel">
          <header class="sqls-head">
            <h3>Kết quả</h3>
            <div class="sqls-stats" id="sqls-stats"></div>
          </header>
          <div class="sqls-result" id="sqls-result">
            <p class="sqls-hint">Bấm <strong>Chạy</strong> để thực thi câu lệnh.</p>
          </div>
        </section>
      </div>`;

    syncGutter();
    run();
  }

  function syncGutter() {
    const ta = document.getElementById('sqls-input');
    const g = document.getElementById('sqls-gutter');
    if (!ta || !g) return;
    const n = ta.value.split('\n').length;
    g.innerHTML = Array.from({ length: n }, (_, i) => i + 1).join('<br>');
    g.scrollTop = ta.scrollTop;
  }

  function onKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart;
      ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = s + 2;
      syncGutter();
    }
  }

  function loadExample(i) {
    const ta = document.getElementById('sqls-input');
    if (!ta) return;
    ta.value = EXAMPLES[i].sql;
    syncGutter();
    run();
  }

  function run() {
    const ta = document.getElementById('sqls-input');
    const out = document.getElementById('sqls-result');
    const stats = document.getElementById('sqls-stats');
    if (!ta || !out) return;

    let res;
    try {
      res = SqlEngine.execute(ta.value, SCHEMA);
    } catch (err) {
      stats.innerHTML = '<span class="sqls-badge err">Lỗi</span>';
      out.innerHTML = renderError(err, ta.value);
      lastResult = null;
      return;
    }

    lastResult = res;
    stats.innerHTML =
      `<span class="sqls-badge ok">${res.rowCount} dòng</span>` +
      `<span class="sqls-badge">${res.ms.toFixed(2)} ms</span>` +
      `<span class="sqls-badge">quét ${res.scanned} dòng</span>`;

    if (!res.rowCount) {
      out.innerHTML = `<p class="sqls-hint">Truy vấn chạy đúng nhưng <strong>không có dòng nào khớp</strong>. Thử nới lỏng điều kiện WHERE.</p>`;
      return;
    }

    out.innerHTML = `
      <div class="sqls-table-scroll">
        <table class="sqls-table">
          <thead><tr>${res.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${res.rows.map(r =>
            `<tr>${r.map(v => `<td>${fmtCell(v)}</td>`).join('')}</tr>`
          ).join('')}</tbody>
        </table>
      </div>`;
  }

  // Loi kem vi tri: chi thang vao ky tu gay loi de nguoi hoc tu sua
  function renderError(err, sql) {
    let pointer = '';
    if (typeof err.position === 'number') {
      const before = sql.slice(0, err.position);
      const line = before.split('\n').length;
      const col = err.position - before.lastIndexOf('\n');
      const src = sql.split('\n')[line - 1] || '';
      pointer = `
        <div class="sqls-err-pos">
          <div class="sqls-err-line"><span>${line}</span>${esc(src)}</div>
          <div class="sqls-err-caret">${' '.repeat(Math.max(0, col - 1))}▲</div>
          <small>dòng ${line}, cột ${col}</small>
        </div>`;
    }
    return `<div class="sqls-err"><strong>${esc(err.message)}</strong>${pointer}</div>`;
  }

  return { renderStudio, run, loadExample, syncGutter, onKey, getSchema: () => SCHEMA };
})();

if (typeof window !== 'undefined') window.SqlStudio = SqlStudio;
