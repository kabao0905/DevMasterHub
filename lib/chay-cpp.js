// Bien dich & chay C++ cho bai hoc qua dich vu ben ngoai: Compiler Explorer (godbolt.org), du phong Wandbox.
// Server KHONG tu chay code nguoi dung: Render khong co sandbox an toan cho code tuy y.

const GIOI_HAN = Object.freeze({
  code: 50000,       // ky tu ma nguon
  stdin: 10000,      // ky tu du lieu vao
  dauRa: 20000,      // ky tu stdout/stderr tra ve trinh duyet
  thoiGianMs: 25000  // moi dich vu
});

const GODBOLT = 'https://godbolt.org/api/compiler/g132/compile';
const WANDBOX = 'https://wandbox.org/api/compile.json';

// Godbolt to mau loi bien dich bang ma ANSI: bo di de hien chu thuong
const boMauAnsi = s => String(s || '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
const cat = s => (s.length > GIOI_HAN.dauRa ? s.slice(0, GIOI_HAN.dauRa) + '\n…(đã cắt bớt)' : s);
const noiDong = ds => (Array.isArray(ds) ? ds.map(d => (d && typeof d.text === 'string' ? d.text : '')).join('\n') : '');

/** @returns {{ loi: string } | { code: string, stdin: string }} */
function chuanHoaYeuCauChay(body) {
  const b = body && typeof body === 'object' ? body : {};
  if (typeof b.code !== 'string' || !b.code.trim()) return { loi: 'Thiếu code C++ để chạy' };
  if (b.code.length > GIOI_HAN.code) return { loi: `Code quá dài (tối đa ${GIOI_HAN.code} ký tự)` };
  const stdin = b.stdin == null ? '' : b.stdin;
  if (typeof stdin !== 'string') return { loi: 'stdin phải là chuỗi' };
  if (stdin.length > GIOI_HAN.stdin) return { loi: `Dữ liệu vào quá dài (tối đa ${GIOI_HAN.stdin} ký tự)` };
  return { code: b.code, stdin };
}

async function quaGodbolt({ code, stdin }, fetchFn) {
  const r = await fetchFn(GODBOLT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      source: code,
      options: {
        userArguments: '-std=c++17 -O2 -fdiagnostics-color=never',
        executeParameters: { args: [], stdin },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
        tools: [],
        libraries: []
      },
      lang: 'c++',
      allowStoreCodeDebug: false
    }),
    signal: AbortSignal.timeout(GIOI_HAN.thoiGianMs)
  });
  if (!r.ok) throw new Error(`Compiler Explorer ${r.status}`);
  const j = await r.json();
  const bd = j.buildResult || {};
  if (!j.didExecute) {
    const loiBienDich = boMauAnsi(noiDong(bd.stderr) || noiDong(bd.stdout)).trim();
    if (bd.code !== 0 && loiBienDich) return { bienDichLoi: cat(loiBienDich) };
    throw new Error('Compiler Explorer không chạy được chương trình');
  }
  return { stdout: cat(noiDong(j.stdout)), stderr: cat(boMauAnsi(noiDong(j.stderr))), maThoat: Number(j.code) };
}

async function quaWandbox({ code, stdin }, fetchFn) {
  const r = await fetchFn(WANDBOX, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, stdin, compiler: 'gcc-head', options: 'c++17', 'compiler-option-raw': '-O2' }),
    signal: AbortSignal.timeout(GIOI_HAN.thoiGianMs)
  });
  if (!r.ok) throw new Error(`Wandbox ${r.status}`);
  const j = await r.json();
  // Loi bien dich: khong co phan chuong trinh chay (program_output / program_error)
  const daChay = 'program_output' in j || 'program_error' in j;
  if (!daChay) {
    const loiBienDich = String(j.compiler_error || j.compiler_message || '').trim();
    if (loiBienDich) return { bienDichLoi: cat(loiBienDich) };
    throw new Error('Wandbox không chạy được chương trình');
  }
  return { stdout: cat(String(j.program_output || '')), stderr: cat(String(j.program_error || '')), maThoat: Number(j.status) || 0 };
}

/**
 * Chay qua Godbolt; Godbolt loi (mang, 5xx, qua tai) thi thu Wandbox.
 * fetchFn mac dinh doc globalThis.fetch luc goi (bai kiem thay fetch toan cuc).
 */
async function chayCpp(yc, fetchFn = (...a) => globalThis.fetch(...a)) {
  let loiCuoi;
  for (const [ten, chay] of [['godbolt', quaGodbolt], ['wandbox', quaWandbox]]) {
    try {
      return { ...(await chay(yc, fetchFn)), dichVu: ten };
    } catch (e) {
      loiCuoi = e;
      console.warn(`[run-cpp] ${ten} lỗi:`, e && e.message);
    }
  }
  throw loiCuoi || new Error('Không chạy được code');
}

module.exports = { chuanHoaYeuCauChay, chayCpp, GIOI_HAN };
