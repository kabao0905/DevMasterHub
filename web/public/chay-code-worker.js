const CDN = 'https://cdn.jsdelivr.net/npm/';
const PYODIDE = CDN + 'pyodide@0.29.5/';
const PGLITE = CDN + '@electric-sql/pglite@0.5.8/dist/index.js';
const WASMOON = CDN + 'wasmoon@1.16.0/dist/';
const GIOI_HAN_RA = 200000;

const giaiMa = new TextDecoder();
let pyodide = null;
let luaNhaMay = null;
let PGlite = null;
let csdl = null;

function boGhi() {
  const kq = { ra: '', loi: '' };
  const them = (khoa, s) => {
    if (kq[khoa].length < GIOI_HAN_RA) kq[khoa] += s;
  };
  return { kq, ra: s => them('ra', s), loi: s => them('loi', s) };
}

function docTungDong(stdin) {
  const dong = stdin.length ? stdin.replace(/\r\n/g, '\n').split('\n') : [];
  if (dong.length && dong[dong.length - 1] === '') dong.pop();
  let i = 0;
  return { tiep: () => (i < dong.length ? dong[i++] : null), conLai: () => { const s = dong.slice(i).join('\n'); i = dong.length; return s; } };
}

async function taiPyodide() {
  if (pyodide) return pyodide;
  const { loadPyodide } = await import(PYODIDE + 'pyodide.mjs');
  pyodide = await loadPyodide({ indexURL: PYODIDE, stdout: () => {}, stderr: () => {} });
  return pyodide;
}

function lamGonTraceback(s) {
  const dong = s.replace(/File "<exec>"/g, 'File "main.py"').split('\n');
  const ra = [];
  let giu = true;
  let trongKhung = false;
  for (const d of dong) {
    if (/^Traceback \(most recent call last\):/.test(d)) { ra.push(d); trongKhung = true; giu = true; continue; }
    if (trongKhung && /^  File "/.test(d)) { giu = /^  File "main\.py"/.test(d); if (giu) ra.push(d); continue; }
    if (trongKhung && /^ {4}/.test(d)) { if (giu) ra.push(d); continue; }
    trongKhung = false;
    ra.push(d);
  }
  return ra.join('\n');
}

async function chayPython(code, stdin) {
  const py = await taiPyodide();
  const g = boGhi();
  const vao = docTungDong(stdin);
  py.setStdout({ write: b => { g.ra(giaiMa.decode(b)); return b.length; } });
  py.setStderr({ write: b => { g.loi(giaiMa.decode(b)); return b.length; } });
  py.setStdin({ stdin: () => { const d = vao.tiep(); return d === null ? null : d + '\n'; } });
  const bien = py.runPython("import sys, types\n__dm_m = types.ModuleType('__main__')\nsys.modules['__main__'] = __dm_m\n__dm_m.__dict__");
  let maThoat = 0;
  try {
    await py.runPythonAsync(code, { globals: bien, filename: 'main.py' });
  } catch (e) {
    const tin = String(e && e.message || e);
    const m = /SystemExit: ?(\d*)\s*$/.exec(tin.trim());
    if (m) maThoat = m[1] ? Number(m[1]) : 0;
    else {
      g.loi(lamGonTraceback(tin).trimEnd() + '\n');
      maThoat = 1;
    }
  } finally {
    try { py.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()'); } catch {}
    bien.destroy();
  }
  return { stdout: g.kq.ra, stderr: g.kq.loi, maThoat };
}

async function taiLua() {
  if (luaNhaMay) return luaNhaMay;
  const nguon = await (await fetch(WASMOON + 'index.js')).text();
  const mod = { exports: {} };
  new Function('exports', 'module', nguon)(mod.exports, mod);
  luaNhaMay = new mod.exports.LuaFactory(WASMOON + 'glue.wasm');
  return luaNhaMay;
}

const LUA_DAU = `
local __ghi, __doc, __docHet = __dm_ghi, __dm_doc, __dm_doc_het
__dm_ghi, __dm_doc, __dm_doc_het = nil, nil, nil
print = function(...)
  local n = select('#', ...)
  local t = {}
  for i = 1, n do t[i] = tostring((select(i, ...))) end
  __ghi(table.concat(t, '\\t') .. '\\n')
end
local function viet(...)
  for i = 1, select('#', ...) do
    local v = select(i, ...)
    __ghi(type(v) == 'number' and tostring(v) or v)
  end
end
io.write = function(...) viet(...) return io.stdout end
local function docMot(f)
  f = f or 'l'
  if type(f) == 'string' then f = f:gsub('^%*', '') end
  if f == 'n' then local d = __doc() return d and tonumber((d:gsub('^%s+', ''):gsub('%s+$', ''))) end
  if f == 'a' then return __docHet() or '' end
  if f == 'L' then local d = __doc() return d and d .. '\\n' end
  return __doc()
end
io.read = function(...)
  local n = select('#', ...)
  if n == 0 then return docMot('l') end
  local r = {}
  for i = 1, n do r[i] = docMot((select(i, ...))) end
  return table.unpack(r, 1, n)
end
io.lines = function() return function() return __doc() end end
local cu = io.stdout
io.stdout = setmetatable({ write = function(self, ...) viet(...) return self end }, { __index = cu })
`;

async function chayLua(code, stdin) {
  const nhaMay = await taiLua();
  const lua = await nhaMay.createEngine();
  const g = boGhi();
  const vao = docTungDong(stdin);
  let maThoat = 0;
  try {
    lua.global.set('__dm_ghi', s => g.ra(String(s)));
    lua.global.set('__dm_doc', () => { const d = vao.tiep(); return d === null ? undefined : d; });
    lua.global.set('__dm_doc_het', () => vao.conLai());
    await lua.doString(LUA_DAU);
    await lua.doString(code);
  } catch (e) {
    g.loi(String(e && e.message || e).replace(/\[string "[^"]*"\]/g, 'main.lua') + '\n');
    maThoat = 1;
  } finally {
    lua.global.close();
  }
  return { stdout: g.kq.ra, stderr: g.kq.loi, maThoat };
}

const SQL_MAU = `
CREATE TABLE customers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, city TEXT, created_at TIMESTAMP DEFAULT NOW());
INSERT INTO customers (name, email, city, created_at) VALUES
 ('An', 'an@mail.com', 'Hà Nội', '2024-11-02'), ('Bình', 'binh@mail.com', 'Đà Nẵng', '2024-12-15'),
 ('Chi', 'chi@mail.com', 'TP.HCM', '2025-01-08'), ('Dũng', 'dung@mail.com', 'Hà Nội', '2025-02-20'),
 ('Hà', 'ha@mail.com', 'Cần Thơ', '2025-03-11');
CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT, price NUMERIC(10,2), quantity INTEGER DEFAULT 0, stock INTEGER DEFAULT 0, discount NUMERIC(5,2), created_at TIMESTAMP DEFAULT NOW());
INSERT INTO products (name, category, price, quantity, stock, discount, created_at) VALUES
 ('Smartphone X', 'Electronics', 45, 30, 12, 5, '2025-01-05'), ('Headphone Pro', 'Electronics', 25, 50, 40, NULL, '2025-02-10'),
 ('SQL căn bản', 'Books', 15, 80, 70, 10, '2025-03-01'), ('Clean Code', 'Books', 32, 40, 25, NULL, '2025-04-12'),
 ('Bàn phím cơ', 'Electronics', 60, 20, 8, 15, '2025-05-20'), ('Phone case', 'Accessories', 12, 100, 90, 2, '2025-05-28');
CREATE TABLE orders (id SERIAL PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), user_id INTEGER, status TEXT DEFAULT 'pending', total NUMERIC(10,2) DEFAULT 0, notes TEXT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
INSERT INTO orders (customer_id, status, total, created_at) VALUES
 (1, 'delivered', 90, '2025-01-12'), (2, 'shipped', 47, '2025-01-25'), (1, 'delivered', 120, '2025-02-03'),
 (3, 'pending', 15, '2025-02-18'), (4, 'delivered', 64, '2025-03-07'), (2, 'delivered', 150, '2025-03-21'),
 (3, 'confirmed', 32, '2025-04-02'), (1, 'shipped', 60, '2025-04-15');
UPDATE orders SET user_id = customer_id;
CREATE TABLE order_items (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, product_id INTEGER REFERENCES products(id), quantity INTEGER NOT NULL DEFAULT 1, price NUMERIC(10,2) NOT NULL);
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
 (1, 1, 2, 45), (2, 2, 1, 25), (2, 6, 1, 12), (3, 5, 2, 60), (4, 3, 1, 15), (5, 4, 2, 32),
 (6, 1, 2, 45), (6, 5, 1, 60), (7, 4, 1, 32), (8, 5, 1, 60);
CREATE TABLE students (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, gpa REAL DEFAULT 0, major TEXT, created_at TIMESTAMP DEFAULT NOW());
INSERT INTO students (name, email, gpa, major) VALUES
 ('An', 'an@mail.com', 8.5, 'CS'), ('Bảo', 'bao@mail.com', 9.1, 'CS'), ('Chi', 'chi@mail.com', 7.2, 'Math'),
 ('Duy', 'duy@mail.com', 6.8, 'CS'), ('Giang', 'giang@mail.com', 4.5, 'Physics');
CREATE TABLE employees (id SERIAL PRIMARY KEY, name TEXT NOT NULL, department TEXT, salary NUMERIC(12,2), manager_id INTEGER, hired_at DATE);
INSERT INTO employees (name, department, salary, manager_id, hired_at) VALUES
 ('Lan', 'Engineering', 3500, NULL, '2020-03-01'), ('Minh', 'Engineering', 2800, 1, '2022-06-15'),
 ('Ngọc', 'Engineering', 2800, 1, '2023-01-10'), ('Phúc', 'Sales', 2200, NULL, '2021-09-01'),
 ('Quân', 'Sales', 1900, 4, '2024-02-01'), ('Trang', 'Marketing', 2100, NULL, '2022-11-20');
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW());
INSERT INTO users (name, email, active) VALUES ('An', 'an@mail.com', true), ('Bình', 'binh@mail.com', false), ('Chi', 'chi@mail.com', true);
CREATE TABLE accounts (id SERIAL PRIMARY KEY, owner TEXT NOT NULL, balance NUMERIC(14,2) NOT NULL DEFAULT 0);
INSERT INTO accounts (owner, balance) VALUES ('An', 5000), ('Bình', 1200);
CREATE TABLE transfers (id SERIAL PRIMARY KEY, from_id INTEGER, to_id INTEGER, amount NUMERIC(14,2), created_at TIMESTAMP DEFAULT NOW());
`;

const SQL_HAM = `
CREATE OR REPLACE FUNCTION strftime(fmt TEXT, ts TIMESTAMP) RETURNS TEXT LANGUAGE sql IMMUTABLE AS
$f$ SELECT to_char(ts, replace(replace(replace(replace(replace(replace(fmt, '%Y', 'YYYY'), '%m', 'MM'), '%d', 'DD'), '%H', 'HH24'), '%M', 'MI'), '%S', 'SS')) $f$;
`;

function bangMauCanTao(code) {
  const sach = code.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, ' ');
  const daTao = new Set([...sach.matchAll(/create\s+(?:temp(?:orary)?\s+)?(?:table|view|materialized\s+view)\s+(?:if\s+not\s+exists\s+)?"?(\w+)/gi)].map(m => m[1].toLowerCase()));
  const lenh = SQL_MAU.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
  return lenh.filter(s => {
    const m = /^(?:CREATE TABLE|INSERT INTO|UPDATE)\s+(\w+)/i.exec(s);
    return !m || !daTao.has(m[1].toLowerCase());
  }).join(';\n') + ';';
}

const hienGiaTri = v => {
  if (v === null || v === undefined) return 'NULL';
  if (v instanceof Date) return isNaN(v) ? String(v) : v.toISOString().replace('T', ' ').replace(/\.000Z$|Z$/, '');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
};

function veBang(cot, hang) {
  const o = hang.map(h => cot.map(c => hienGiaTri(h[c]).replace(/\n/g, ' ')));
  const rong = cot.map((c, i) => Math.min(cot.length === 1 ? 120 : 40, Math.max(c.length, ...o.map(r => r[i].length))));
  const cat = (s, w) => (s.length > w ? s.slice(0, w - 1) + '…' : s.padEnd(w));
  const dong = [cot.map((c, i) => cat(c, rong[i])).join(' | '), rong.map(w => '-'.repeat(w)).join('-+-')];
  for (const r of o.slice(0, 200)) dong.push(r.map((x, i) => cat(x, rong[i])).join(' | '));
  if (o.length > 200) dong.push(`… (còn ${o.length - 200} dòng)`);
  dong.push(`(${hang.length} dòng)`);
  return dong.join('\n');
}

function tachLenh(sql) {
  const ra = [];
  let bd = 0, i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (c === '-' && sql[i + 1] === '-') { const h = sql.indexOf('\n', i); i = h < 0 ? sql.length : h; continue; }
    if (c === '/' && sql[i + 1] === '*') { const h = sql.indexOf('*/', i + 2); i = h < 0 ? sql.length : h + 2; continue; }
    if (c === "'" || c === '"') { const h = sql.indexOf(c, i + 1); i = h < 0 ? sql.length : h + 1; continue; }
    if (c === '$') {
      const m = /^\$\w*\$/.exec(sql.slice(i));
      if (m) { const h = sql.indexOf(m[0], i + m[0].length); i = h < 0 ? sql.length : h + m[0].length; continue; }
    }
    if (c === ';') { ra.push(sql.slice(bd, i + 1)); bd = i + 1; }
    i++;
  }
  ra.push(sql.slice(bd));
  return ra.filter(s => s.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim());
}

const tomTatLenh = s => {
  const sach = s.replace(/--[^\n]*/g, '').replace(/\s+/g, ' ').trim();
  return sach.length > 72 ? sach.slice(0, 71) + '…' : sach;
};

const chuanHoaSqlite = s => s.replace(/\bINTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT\b/gi, 'SERIAL PRIMARY KEY');

async function chaySql(code) {
  const db = csdl;
  await db.exec('ROLLBACK').catch(() => {});
  await db.exec('DISCARD ALL');
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  const g = boGhi();
  let maThoat = 0;
  try {
    await db.exec(SQL_HAM + bangMauCanTao(code));
    for (const lenh of tachLenh(code)) {
      g.ra('› ' + tomTatLenh(lenh) + '\n');
      try {
        const kq = await db.query(chuanHoaSqlite(lenh));
        if (kq.fields && kq.fields.length) {
          const cot = kq.fields.map(f => f.name);
          g.ra(veBang(cot, kq.rows) + '\n\n');
        } else {
          g.ra((kq.affectedRows ? `OK, ${kq.affectedRows} dòng bị ảnh hưởng` : 'OK') + '\n\n');
        }
      } catch (e) {
        g.ra('LỖI: ' + String(e && e.message || e) + '\n\n');
        g.loi(tomTatLenh(lenh) + '\n  → ' + String(e && e.message || e) + '\n');
        maThoat = 1;
      }
    }
  } finally {
    await db.exec('ROLLBACK').catch(() => {});
  }
  return { stdout: g.kq.ra, stderr: g.kq.loi, maThoat };
}

const BO_CHAY = {
  python: [taiPyodide, chayPython],
  lua: [taiLua, chayLua],
  sql: [async () => { if (!PGlite) PGlite = (await import(PGLITE)).PGlite; if (!csdl) csdl = await PGlite.create(); }, chaySql]
};

self.onmessage = async ev => {
  const { id, lang, code, stdin = '' } = ev.data || {};
  const bo = BO_CHAY[lang];
  if (!bo) { self.postMessage({ id, loiTai: 'Ngôn ngữ không hỗ trợ: ' + lang }); return; }
  try {
    await bo[0]();
  } catch (e) {
    self.postMessage({ id, loiTai: String(e && e.message || e) });
    return;
  }
  self.postMessage({ id, giaiDoan: 'chay' });
  try {
    self.postMessage({ id, ...(await bo[1](code, stdin)) });
  } catch (e) {
    self.postMessage({ id, stdout: '', stderr: String(e && e.message || e), maThoat: 1 });
  }
};
