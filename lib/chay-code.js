const GIOI_HAN = Object.freeze({
  code: 50000,
  stdin: 10000,
  dauRa: 20000,
  thoiGianMs: 25000,
  danhSachMs: 10000
});

const GODBOLT = 'https://godbolt.org/api';
const WANDBOX = 'https://wandbox.org/api';
const NHO_TOT_MS = 6 * 3600 * 1000;
const NHO_LOI_MS = 2 * 60 * 1000;

const boPublicJava = code => code.replace(/^public\s+((?:(?:final|abstract|sealed|non-sealed|strictfp)\s+)*)(class|interface|enum|record)\b/gm, '$1$2');

const NGON_NGU = Object.freeze({
  cpp: { ten: 'C++', godbolt: { lang: 'c++', compiler: 'g132', tenTrinh: 'x86-64 gcc 13.2', thamSo: '-std=c++17 -O2 -fdiagnostics-color=never' }, wandbox: { ngonNgu: 'C++', compiler: 'gcc-head', options: 'c++17', raw: '-O2' } },
  c: { ten: 'C', godbolt: { lang: 'c', uuTien: /x86-64 gcc/i, thamSo: '-std=c17 -O2 -fdiagnostics-color=never' }, wandbox: { ngonNgu: 'C', uuTien: /^gcc-/ } },
  java: { ten: 'Java', chuanBi: boPublicJava, godbolt: { lang: 'java' }, wandbox: { ngonNgu: 'Java' } },
  go: { ten: 'Go', godbolt: { lang: 'go', uuTien: /x86-64 gc|amd64/i }, wandbox: { ngonNgu: 'Go' } },
  rust: { ten: 'Rust', godbolt: { lang: 'rust', thamSo: '--edition 2021 -C opt-level=1', uuTien: /^rustc/i }, wandbox: { ngonNgu: 'Rust' } },
  csharp: { ten: 'C#', godbolt: { lang: 'csharp' }, wandbox: { ngonNgu: 'C#' } },
  kotlin: { ten: 'Kotlin', godbolt: { lang: 'kotlin' }, wandbox: { ngonNgu: 'Kotlin' } },
  swift: { ten: 'Swift', godbolt: { lang: 'swift' }, wandbox: { ngonNgu: 'Swift' } },
  dart: { ten: 'Dart', godbolt: { lang: 'dart' }, wandbox: { ngonNgu: 'Dart' } },
  scala: { ten: 'Scala', godbolt: { lang: 'scala' }, wandbox: { ngonNgu: 'Scala' } },
  zig: { ten: 'Zig', godbolt: { lang: 'zig' }, wandbox: { ngonNgu: 'Zig' } },
  python: { ten: 'Python', wandbox: { ngonNgu: 'Python', uuTien: /^cpython/ }, godbolt: { lang: 'python' } },
  ruby: { ten: 'Ruby', wandbox: { ngonNgu: 'Ruby', uuTien: /^ruby-/ }, godbolt: { lang: 'ruby' } },
  php: { ten: 'PHP', wandbox: { ngonNgu: 'PHP' } },
  lua: { ten: 'Lua', wandbox: { ngonNgu: 'Lua', uuTien: /^lua-/ } },
  bash: { ten: 'Bash', wandbox: { ngonNgu: 'Bash script' } },
  r: { ten: 'R', wandbox: { ngonNgu: 'R' } },
  haskell: { ten: 'Haskell', godbolt: { lang: 'haskell' }, wandbox: { ngonNgu: 'Haskell' } },
  perl: { ten: 'Perl', wandbox: { ngonNgu: 'Perl' } },
  elixir: { ten: 'Elixir', wandbox: { ngonNgu: 'Elixir' } }
});

const BI_DANH = Object.freeze({
  'c++': 'cpp', cc: 'cpp', cxx: 'cpp', h: 'c', 'c#': 'csharp', cs: 'csharp', py: 'python', python3: 'python',
  golang: 'go', rs: 'rust', kt: 'kotlin', kts: 'kotlin', rb: 'ruby', sh: 'bash', shell: 'bash', zsh: 'bash', hs: 'haskell', pl: 'perl', ex: 'elixir', exs: 'elixir'
});

const MAU_TU_KIEM = Object.freeze({
  cpp: '#include <iostream>\nint main() { std::cout << "ok " << 6 * 7 << std::endl; }',
  c: '#include <stdio.h>\nint main(void) { printf("ok %d\\n", 6 * 7); return 0; }',
  java: 'public class Main {\n  public static void main(String[] args) { System.out.println("ok " + 6 * 7); }\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() { fmt.Println("ok", 6*7) }',
  rust: 'fn main() { println!("ok {}", 6 * 7); }',
  csharp: 'using System;\nclass Program { static void Main() { Console.WriteLine("ok " + 6 * 7); } }',
  kotlin: 'fun main() { println("ok ${6 * 7}") }',
  swift: 'print("ok \\(6 * 7)")',
  dart: 'void main() { print("ok ${6 * 7}"); }',
  scala: 'object Main extends App { println("ok " + 6 * 7) }',
  zig: 'const std = @import("std");\npub fn main() void { std.debug.print("ok {d}\\n", .{6 * 7}); }',
  python: 'print("ok", 6 * 7)',
  ruby: 'puts "ok #{6 * 7}"',
  php: '<?php echo "ok " . 6 * 7 . "\\n";',
  lua: 'print("ok " .. 6 * 7)',
  bash: 'echo "ok $((6 * 7))"',
  r: 'cat("ok", 6 * 7, "\\n")',
  haskell: 'main = putStrLn ("ok " ++ show (6 * 7))',
  perl: 'print "ok ", 6 * 7, "\\n";',
  elixir: 'IO.puts("ok #{6 * 7}")'
});

const boMauAnsi = s => String(s || '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
const cat = s => (s.length > GIOI_HAN.dauRa ? s.slice(0, GIOI_HAN.dauRa) + '\n…(đã cắt bớt)' : s);
const noiDong = ds => (Array.isArray(ds) ? ds.map(d => (d && typeof d.text === 'string' ? d.text : '')).join('\n') : '');

function chuanHoaNgonNgu(lang) {
  const k = String(lang || '').trim().toLowerCase();
  const id = BI_DANH[k] || k;
  return Object.prototype.hasOwnProperty.call(NGON_NGU, id) ? id : null;
}

function chuanHoaYeuCauChay(body, langMacDinh) {
  const b = body && typeof body === 'object' ? body : {};
  const lang = chuanHoaNgonNgu(b.lang == null ? langMacDinh : b.lang);
  if (!lang) return { loi: 'Ngôn ngữ này chưa hỗ trợ chạy trên máy chủ' };
  if (typeof b.code !== 'string' || !b.code.trim()) return { loi: `Thiếu code ${NGON_NGU[lang].ten} để chạy` };
  if (b.code.length > GIOI_HAN.code) return { loi: `Code quá dài (tối đa ${GIOI_HAN.code} ký tự)` };
  const stdin = b.stdin == null ? '' : b.stdin;
  if (typeof stdin !== 'string') return { loi: 'stdin phải là chuỗi' };
  if (stdin.length > GIOI_HAN.stdin) return { loi: `Dữ liệu vào quá dài (tối đa ${GIOI_HAN.stdin} ký tự)` };
  return { lang, code: b.code, stdin };
}

const soPhienBan = s => (String(s || '').match(/\d+/g) || []).map(Number);
function soSanhPhienBan(a, b) {
  const x = soPhienBan(a), y = soPhienBan(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return d;
  }
  return 0;
}

const KHONG_ON_DINH = /trunk|nightly|beta|snapshot|preview|experimental|\bhead\b|\bdev\b|\brc\d*\b|\(.*branch.*\)/i;

function chonTrinhGodbolt(ds, uuTien) {
  const chay = (Array.isArray(ds) ? ds : []).filter(c => c && c.id && c.supportsExecute === true);
  const onDinh = chay.filter(c => !KHONG_ON_DINH.test(`${c.name || ''} ${c.semver || ''}`));
  let ung = onDinh.length ? onDinh : chay;
  if (uuTien) {
    const hop = ung.filter(c => uuTien.test(c.name || '') || uuTien.test(c.id));
    if (hop.length) ung = hop;
  }
  const sx = [...ung].sort((a, b) => soSanhPhienBan(b.semver || b.name, a.semver || a.name));
  return sx[0] ? { id: sx[0].id, ten: sx[0].name || sx[0].id } : null;
}

function chonTrinhWandbox(ds, { ngonNgu, uuTien }) {
  const cung = (Array.isArray(ds) ? ds : []).filter(c => c && c.name && String(c.language || '').toLowerCase() === ngonNgu.toLowerCase());
  const onDinh = cung.filter(c => !/head|dev|nightly|snapshot|preview/i.test(c.name));
  let ung = onDinh.length ? onDinh : cung;
  if (uuTien) {
    const hop = ung.filter(c => uuTien.test(c.name));
    if (hop.length) ung = hop;
  }
  const sx = [...ung].sort((a, b) => soSanhPhienBan(b.version || b.name, a.version || a.name));
  return sx[0] ? { id: sx[0].name, ten: `${sx[0]['display-name'] || sx[0].language} ${sx[0].version || ''}`.trim() } : null;
}

function taoBoChay(fetchFn = (...a) => globalThis.fetch(...a)) {
  const boNho = new Map();

  async function nho(khoa, lay) {
    const co = boNho.get(khoa);
    if (co && co.het > Date.now()) {
      if (co.loi) throw co.loi;
      return co.giaTri;
    }
    const dangCho = co && co.dangCho;
    if (dangCho) return dangCho;
    const p = (async () => {
      try {
        const giaTri = await lay();
        boNho.set(khoa, { giaTri, het: Date.now() + NHO_TOT_MS });
        return giaTri;
      } catch (e) {
        boNho.set(khoa, { loi: e, het: Date.now() + NHO_LOI_MS });
        throw e;
      }
    })();
    boNho.set(khoa, { dangCho: p, het: 0 });
    return p;
  }

  async function layJson(url) {
    const r = await fetchFn(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(GIOI_HAN.danhSachMs) });
    if (!r.ok) throw new Error(`${new URL(url).host} ${r.status}`);
    return r.json();
  }

  async function trinhGodbolt(lang) {
    const cauHinh = NGON_NGU[lang].godbolt;
    if (cauHinh.compiler) return { id: cauHinh.compiler, ten: cauHinh.tenTrinh || cauHinh.compiler };
    const chon = await nho('godbolt:' + lang, async () =>
      chonTrinhGodbolt(await layJson(`${GODBOLT}/compilers/${encodeURIComponent(cauHinh.lang)}?fields=id,name,semver,supportsExecute`), cauHinh.uuTien));
    if (!chon) throw new Error(`Compiler Explorer không có trình chạy được ${NGON_NGU[lang].ten}`);
    return chon;
  }

  async function trinhWandbox(lang) {
    const cauHinh = NGON_NGU[lang].wandbox;
    if (cauHinh.compiler) return { id: cauHinh.compiler, ten: cauHinh.compiler };
    const ds = await nho('wandbox:list', () => layJson(`${WANDBOX}/list.json`));
    const chon = chonTrinhWandbox(ds, cauHinh);
    if (!chon) throw new Error(`Wandbox không có trình chạy ${NGON_NGU[lang].ten}`);
    return chon;
  }

  async function quaGodbolt({ lang, code, stdin }) {
    const cauHinh = NGON_NGU[lang].godbolt;
    const trinh = await trinhGodbolt(lang);
    const r = await fetchFn(`${GODBOLT}/compiler/${encodeURIComponent(trinh.id)}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: code,
        options: {
          userArguments: cauHinh.thamSo || '',
          executeParameters: { args: [], stdin },
          compilerOptions: { executorRequest: true },
          filters: { execute: true },
          tools: [],
          libraries: []
        },
        lang: cauHinh.lang,
        allowStoreCodeDebug: false
      }),
      signal: AbortSignal.timeout(GIOI_HAN.thoiGianMs)
    });
    if (!r.ok) throw new Error(`Compiler Explorer ${r.status}`);
    const j = await r.json();
    const bd = j.buildResult || {};
    if (!j.didExecute) {
      const loiBienDich = boMauAnsi(noiDong(bd.stderr) || noiDong(bd.stdout)).trim();
      if (bd.code !== 0 && loiBienDich) return { bienDichLoi: cat(loiBienDich), trinhBienDich: trinh.ten };
      throw new Error('Compiler Explorer không chạy được chương trình');
    }
    return { stdout: cat(noiDong(j.stdout)), stderr: cat(boMauAnsi(noiDong(j.stderr))), maThoat: Number(j.code), trinhBienDich: trinh.ten };
  }

  async function quaWandbox({ lang, code, stdin }) {
    const cauHinh = NGON_NGU[lang].wandbox;
    const trinh = await trinhWandbox(lang);
    const than = { code, stdin, compiler: trinh.id };
    if (cauHinh.options) than.options = cauHinh.options;
    if (cauHinh.raw) than['compiler-option-raw'] = cauHinh.raw;
    const r = await fetchFn(`${WANDBOX}/compile.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(than),
      signal: AbortSignal.timeout(GIOI_HAN.thoiGianMs)
    });
    if (!r.ok) throw new Error(`Wandbox ${r.status}`);
    const j = await r.json();
    const daChay = 'program_output' in j || 'program_error' in j;
    if (!daChay) {
      const loiBienDich = boMauAnsi(j.compiler_error || j.compiler_message || '').trim();
      if (loiBienDich) return { bienDichLoi: cat(loiBienDich), trinhBienDich: trinh.ten };
      if (j.signal) return { stdout: '', stderr: `Chương trình bị dừng (${j.signal})`, maThoat: Number(j.status) || 1, trinhBienDich: trinh.ten };
      throw new Error('Wandbox không chạy được chương trình');
    }
    const loi = boMauAnsi(j.program_error || '') + (j.signal ? `\nChương trình bị dừng (${j.signal})` : '');
    return { stdout: cat(String(j.program_output || '')), stderr: cat(loi), maThoat: Number(j.status) || 0, trinhBienDich: trinh.ten };
  }

  async function chayCode(yc) {
    const ngonNgu = NGON_NGU[yc.lang];
    const vao = { ...yc, code: ngonNgu.chuanBi ? ngonNgu.chuanBi(yc.code) : yc.code };
    const thuTu = [['godbolt', ngonNgu.godbolt && quaGodbolt], ['wandbox', ngonNgu.wandbox && quaWandbox]].filter(([, f]) => f);
    let loiCuoi;
    for (const [ten, chay] of thuTu) {
      try {
        return { ...(await chay(vao)), dichVu: ten };
      } catch (e) {
        loiCuoi = e;
        console.warn(`[run:${yc.lang}] ${ten} lỗi:`, e && e.message);
      }
    }
    throw loiCuoi || new Error('Không chạy được code');
  }

  async function tuKiem(dsNgonNgu = Object.keys(MAU_TU_KIEM)) {
    const ketQua = {};
    const hang = [...dsNgonNgu];
    const tho = async () => {
      while (hang.length) {
        const lang = hang.shift();
        const t0 = Date.now();
        try {
          const kq = await chayCode({ lang, code: MAU_TU_KIEM[lang], stdin: '' });
          const ra = kq.stdout ?? '';
          ketQua[lang] = { ok: /ok\s*42/.test(ra), dichVu: kq.dichVu, trinhBienDich: kq.trinhBienDich, ms: Date.now() - t0, ra: (ra || kq.bienDichLoi || kq.stderr || '').slice(0, 300) };
        } catch (e) {
          ketQua[lang] = { ok: false, ms: Date.now() - t0, loi: String(e && e.message || e).slice(0, 300) };
        }
      }
    };
    await Promise.all([tho(), tho(), tho(), tho()]);
    return ketQua;
  }

  return { chayCode, tuKiem };
}

module.exports = { chuanHoaYeuCauChay, chuanHoaNgonNgu, taoBoChay, chonTrinhGodbolt, chonTrinhWandbox, boPublicJava, NGON_NGU, MAU_TU_KIEM, GIOI_HAN };
