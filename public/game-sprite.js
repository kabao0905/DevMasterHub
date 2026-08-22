/**
 * GameSprite — du lieu nhan vat pixel-art va bo ve.
 *
 * Moi khung hinh la luoi 16x16, moi o la mot chi so bang mau (0 = trong suot).
 * Luu duoi dang chuoi cho gon va de doc/sua bang tay.
 */
const GameSprite = (() => {
  'use strict';

  const SIZE = 16;

  // 0 trong suot, 1 vien, 2 da, 3 ao, 4 ao toi, 5 quan, 6 mat, 7 diem sang
  const PALETTE = [
    'transparent', '#0b1020', '#f2c9a0', '#58a6ff', '#2f6fbf',
    '#3d4a63', '#ffffff', '#9fd0ff'
  ];

  const PALETTE_NAMES = [
    'Trong suốt', 'Viền', 'Da', 'Áo', 'Áo tối', 'Quần', 'Mắt', 'Sáng'
  ];

  // Nhan vat mac dinh. Moi dong 16 ky tu.
  const DEFAULT = {
    idle: [
      [
        '................',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '.....133331.....',
        '...1333333331...',
        '..133333333331..',
        '..134333333431..',
        '...1333333331...',
        '.....133331.....',
        '.....155551.....',
        '.....15..51.....',
        '....111..111....',
        '................',
      ],
      [
        '................',
        '................',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '.....133331.....',
        '...1333333331...',
        '..133333333331..',
        '..134333333431..',
        '...1333333331...',
        '.....155551.....',
        '.....15..51.....',
        '....111..111....',
        '................',
      ],
    ],
    run: [
      [
        '................',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '....1333331.....',
        '.1113333333311..',
        '.1343333333341..',
        '..11333333331...',
        '....13333331....',
        '....1555551.....',
        '...15551.15551..',
        '...1551....1551.',
        '...11........11.',
        '................',
      ],
      [
        '................',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '.....133331.....',
        '...1333333331...',
        '..134333333431..',
        '...1333333331...',
        '.....133331.....',
        '.....155551.....',
        '....155..551....',
        '....15....51....',
        '...111....111...',
        '................',
      ],
      [
        '................',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '.....1333311....',
        '..1133333333111.',
        '..1343333333431.',
        '...1333333331...',
        '....13333331....',
        '.....1555551....',
        '..15551.15551...',
        '.1551....1551...',
        '.11........11...',
        '................',
      ],
      [
        '................',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '.....133331.....',
        '...1333333331...',
        '..134333333431..',
        '...1333333331...',
        '.....133331.....',
        '.....155551.....',
        '.....155551.....',
        '....155..551....',
        '...111..111.....',
        '................',
      ],
    ],
    jump: [
      [
        '.......11.......',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '.11..133331..11.',
        '.134133333314311',
        '.113333333333111',
        '...1333333331...',
        '....13443341....',
        '.....133331.....',
        '.....155551.....',
        '....1551..1551..',
        '....11......11..',
        '................',
      ],
    ],
    fall: [
      [
        '................',
        '.....111111.....',
        '....12222221....',
        '....12262621....',
        '....12222221....',
        '....11222211....',
        '.11..133331..11.',
        '.134133333314311',
        '..13333333331...',
        '...1333333331...',
        '....13443341....',
        '.....133331.....',
        '....1555551.....',
        '...1551..1551...',
        '...11......11...',
        '................',
      ],
    ],
  };

  // ─── Doi qua lai giua chuoi va mang so ───
  function toGrid(rows) {
    return rows.map(r => {
      const line = (r + '................').slice(0, SIZE);
      return line.split('').map(ch => (ch === '.' ? 0 : parseInt(ch, 10) || 0));
    });
  }
  function toRows(grid) {
    return grid.map(row => row.map(v => (v === 0 ? '.' : String(v))).join(''));
  }

  function cloneSheet(sheet) {
    const out = {};
    for (const k of Object.keys(sheet)) out[k] = sheet[k].map(f => f.map(r => r.slice()));
    return out;
  }

  /** Tao bo khung hinh dang mang so tu du lieu mac dinh */
  function defaultSheet() {
    const out = {};
    for (const anim of Object.keys(DEFAULT)) out[anim] = DEFAULT[anim].map(toGrid);
    return out;
  }

  /** Ve mot khung hinh len canvas tai (x, y) voi ti le scale */
  function drawFrame(ctx, frame, x, y, scale, flip) {
    ctx.save();
    if (flip) {
      ctx.translate(x + SIZE * scale, y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(x, y);
    }
    for (let r = 0; r < SIZE; r++) {
      const row = frame[r];
      if (!row) continue;
      for (let c = 0; c < SIZE; c++) {
        const v = row[c];
        if (!v) continue;
        ctx.fillStyle = PALETTE[v] || '#fff';
        ctx.fillRect(c * scale, r * scale, scale, scale);
      }
    }
    ctx.restore();
  }

  /** Toc do khung hinh cua tung hoat anh (giay moi khung) */
  const FRAME_TIME = { idle: 0.45, run: 0.10, jump: 1, fall: 1 };

  function frameFor(sheet, anim, animTime) {
    const frames = sheet[anim] || sheet.idle;
    if (!frames || !frames.length) return null;
    const ft = FRAME_TIME[anim] || 0.2;
    return frames[Math.floor(animTime / ft) % frames.length];
  }

  /** Xuat ra code JS de hoc vien dan vao game cua minh */
  function exportCode(sheet) {
    const lines = ['const SPRITE = {'];
    for (const anim of Object.keys(sheet)) {
      lines.push(`  ${anim}: [`);
      for (const f of sheet[anim]) {
        lines.push('    [');
        for (const r of toRows(f)) lines.push(`      '${r}',`);
        lines.push('    ],');
      }
      lines.push('  ],');
    }
    lines.push('};');
    return lines.join('\n');
  }

  return { SIZE, PALETTE, PALETTE_NAMES, DEFAULT, FRAME_TIME,
           toGrid, toRows, cloneSheet, defaultSheet, drawFrame, frameFor, exportCode };
})();

if (typeof window !== 'undefined') window.GameSprite = GameSprite;
if (typeof module !== 'undefined' && module.exports) module.exports = GameSprite;
