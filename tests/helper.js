// Cac file trong public/ la script trinh duyet, khong phai module Node.
// Nap chung vao hop cat vm de bo kiem chay duoc ngoai trinh duyet.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const PUB = path.join(__dirname, '..', 'public');

function hopCat() {
  const sb = {
    console,
    URL,
    URLSearchParams,
    atob: s => Buffer.from(s, 'base64').toString('utf8'),
    btoa: s => Buffer.from(s, 'utf8').toString('base64'),
    setTimeout: () => 0,
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, classList: { add() {}, remove() {} }, appendChild() {}, remove() {} }),
      body: { appendChild() {} }
    },
    localStorage: (() => {
      const kho = {};
      return {
        getItem: k => (k in kho ? kho[k] : null),
        setItem: (k, v) => { kho[k] = String(v); },
        removeItem: k => { delete kho[k]; }
      };
    })()
  };
  sb.window = sb;
  sb.globalThis = sb;
  vm.createContext(sb);
  return sb;
}

/** Nap mot file trong public/ vao hop cat, tra ve bien toan cuc no khai bao */
function napFile(sb, tenFile, tenBien) {
  const src = fs.readFileSync(path.join(PUB, tenFile), 'utf8');
  vm.runInContext(src + '\n;globalThis.__KQ = ' + tenBien + ';', sb);
  return sb.__KQ;
}

/** Moi lan goi tra ve mot terminal doc lap, khong dinh trang thai bai kiem truoc */
function napTerminal() {
  const sb = hopCat();
  return napFile(sb, 'cyber-terminal.js', 'CyberTerminal');
}

/** Doc ma nguon tho cua mot file trong public/ */
function docNguon(tenFile) {
  return fs.readFileSync(path.join(PUB, tenFile), 'utf8');
}

/**
 * Supabase gia du dung cho auth-service.js: ghi lai moi lenh ghi vao `ghi`,
 * lenh doc tra du lieu lay tu `duLieu[tenBang]` (mang, hoac ham nhan trang thai truy van).
 */
function giaSupabase(duLieu = {}) {
  const ghi = [];
  const doc = [];   // moi truy van select da chay, de dem so lan goi
  let goiLai = null;
  let phien = null;

  function truyVan(bang) {
    const tt = { bang, op: 'select', payload: null, dieuKien: [], motDong: false };
    const b = {
      select() { return b; },
      eq(k, v) { tt.dieuKien.push([k, v]); return b; },
      order() { return b; },
      limit() { return b; },
      single() { tt.motDong = true; return b; },
      maybeSingle() { tt.motDong = true; return b; },
      insert(p) { tt.op = 'insert'; tt.payload = p; ghi.push(tt); return b; },
      upsert(p, o) { tt.op = 'upsert'; tt.payload = p; tt.tuyChon = o; ghi.push(tt); return b; },
      update(p) { tt.op = 'update'; tt.payload = p; ghi.push(tt); return b; },
      delete() { tt.op = 'delete'; ghi.push(tt); return b; },
      // Giong PostgrestBuilder that: chi co then, KHONG co catch
      then(ok, loi) {
        let data;
        if (tt.op === 'select') {
          doc.push(tt);
          const v = typeof duLieu[bang] === 'function' ? duLieu[bang](tt) : duLieu[bang];
          data = tt.motDong ? (Array.isArray(v) ? (v[0] ?? null) : (v ?? null)) : (v ?? []);
        } else {
          data = tt.motDong && Array.isArray(tt.payload) ? tt.payload[0] : tt.payload;
        }
        // Tra ve o luot su kien sau nhu mang that; vong lap goi lai vo han se
        // hien ra thanh so lan goi tang dan thay vi treo ca tien trinh kiem
        return new Promise(r => setImmediate(() => r({ data, error: null }))).then(ok, loi);
      }
    };
    return b;
  }

  const client = {
    auth: {
      onAuthStateChange(cb) { goiLai = cb; },
      getSession: async () => ({ data: { session: phien } }),
      signOut: async () => { phien = null; if (goiLai) goiLai('SIGNED_OUT', null); }
    },
    from: truyVan,
    rpc: () => truyVan('rpc')
  };

  return {
    client,
    ghi,
    doc,
    dangNhap(user) {
      phien = { user, access_token: 'tok' };
      if (goiLai) goiLai('SIGNED_IN', phien);
    }
  };
}

/** Phan tu DOM gia: du thuoc tinh ma app.js doc/ghi, khong phan tich HTML */
function phanTuGia(id) {
  const lop = new Set();
  return {
    id, innerHTML: '', textContent: '', value: '', disabled: false, className: '',
    style: {}, dataset: {}, scrollTop: 0, scrollHeight: 0,
    classList: {
      add: c => lop.add(c), remove: c => lop.delete(c), contains: c => lop.has(c),
      toggle: (c, bat) => ((bat ?? !lop.has(c)) ? lop.add(c) : lop.delete(c))
    },
    addEventListener() {}, setAttribute() {}, focus() {}, blur() {}, scrollIntoView() {}, remove() {},
    setSelectionRange() {}, dispatchEvent() {},
    querySelector: () => null, querySelectorAll: () => [], closest: () => null
  };
}

/**
 * Nap app.js that vao hop cat. Cac dich vu (AuthService, AIService...) truyen qua
 * `dichVu`; neu muon dung AuthService that thi truyen `supabase` (giaSupabase().client).
 * setTimeout/requestAnimationFrame chi xep hang; goi chayHenGio() de chay het.
 */
function napApp({ curriculum = {}, dichVu = {}, supabase = null, luuTru = {}, duongDan = '/' } = {}) {
  const sb = hopCat();
  const henGio = [];
  const phanTu = {};
  const canhBao = [];

  sb.setTimeout = fn => henGio.push(fn);
  sb.clearTimeout = () => {};
  sb.requestAnimationFrame = fn => henGio.push(fn);
  sb.history = { pushState() {}, replaceState() {} };
  sb.location = { pathname: duongDan, hash: '' };
  sb.addEventListener = () => {};
  sb.innerWidth = 1280;
  sb.alert = m => canhBao.push(String(m));
  sb.confirm = () => true;
  sb.prompt = () => null;
  sb.navigator = { clipboard: { writeText: async () => {} } };
  sb.document = {
    getElementById: id => phanTu[id] || null,
    querySelector: sel => (sel[0] === '#' ? phanTu[sel.slice(1)] || null : null),
    querySelectorAll: () => [],
    addEventListener() {},
    createElement: () => phanTuGia(''),
    body: { appendChild() {} },
    activeElement: { tagName: 'BODY' }
  };
  sb.I18n = {
    t: k => k, getLang: () => 'vi', translateTitle: t => t, getTechDesc: (id, d) => d || '',
    setLanguage() {}, translateDynamic: async t => t
  };
  sb.CURRICULUM = curriculum;
  for (const [k, v] of Object.entries(luuTru)) sb.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));

  napFile(sb, 'html-utils.js', 'HtmlUtils');
  let Auth = null;
  if (supabase) {
    sb.supabase = { createClient: () => supabase };
    Auth = napFile(sb, 'auth-service.js', 'AuthService');
  }
  Object.assign(sb, dichVu);

  const App = napFile(sb, 'app.js', 'App');
  const tao = id => (phanTu[id] = phanTu[id] || phanTuGia(id));
  tao('main-content');

  return {
    App, Auth, sb, phanTu, tao, canhBao,
    main: phanTu['main-content'],
    chayHenGio() { let n = 0; while (henGio.length && n++ < 1000) henGio.shift()(); }
  };
}

/** Cho cac Promise/setImmediate dang treo chay xong `vong` luot */
async function choXong(vong = 10) {
  for (let i = 0; i < vong; i++) await new Promise(r => setImmediate(r));
}

module.exports = { hopCat, napFile, napTerminal, docNguon, giaSupabase, napApp, choXong, PUB };
