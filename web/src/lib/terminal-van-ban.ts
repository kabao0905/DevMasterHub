// Lenh xu ly van ban cua terminal gia lap (cat, head, grep, awk, sed...). Thuan: khong cham he thong tep,
// doc tep qua docTep do terminal.ts truyen vao; dau vao tu pipe nam o stdin; cau goi y dich qua t.
import type { HamDich } from './terminal-ban-dich';

export type DocTep = { noiDung: string } | { loi: string };
export type NguCanhLenh = {
  /** Ket qua cua lenh dung truoc trong pipe (hoac < tep); null khi khong co */
  stdin: string | null;
  docTep: (duong: string) => DocTep;
  /** Moi tep (de quy) trong thu muc, ten hien thi bat dau bang duong da go; null neu khong phai thu muc */
  tepDeQuy: (duong: string) => string[] | null;
  /** Dich cau goi y theo ngon ngu dang chon (loi chuan Linux giu tieng Anh) */
  t: HamDich;
};
// Mo ta lenh cho "help" nam o terminal-mo-ta-lenh.ts (du 8 ngon ngu)
export type LenhThuan = { usage: string; chay: (args: string[], nc: NguCanhLenh) => string };

/** Tach dong; bo dong rong cuoi do ky tu xuong dong ket thuc */
export function tachDong(s: string): string[] {
  const d = s.split('\n');
  if (d.length && d[d.length - 1] === '') d.pop();
  return d;
}

/** Doc dau vao tu cac tep (noi lai) hoac tu stdin */
export function docNguon(ten: string, tep: string[], nc: NguCanhLenh): { text: string } | { loi: string } {
  if (!tep.length) {
    if (nc.stdin !== null) return { text: nc.stdin };
    return { loi: `${ten}: ${nc.t('loi.thieuTepPipe', { vd: `cat file | ${ten}` })}` };
  }
  const phan: string[] = [];
  for (const t of tep) {
    const r = nc.docTep(t);
    if ('loi' in r) return { loi: `${ten}: ${t}: ${r.loi}` };
    phan.push(r.noiDung.replace(/\n$/, ''));
  }
  return { text: phan.join('\n') };
}

/**
 * Tach co dang -abc / -n 5 / -n5. coGiaTri: cac co nhan gia tri (vd 'ndft').
 * Doi so khong bat dau bang '-' (hoac sau '--') vao conLai.
 */
export function tachCo(args: string[], coGiaTri = ''): { co: Record<string, string | true>; conLai: string[] } {
  const co: Record<string, string | true> = {};
  const conLai: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--') { conLai.push(...args.slice(i + 1)); break; }
    if (!a.startsWith('-') || a === '-') { conLai.push(a); continue; }
    for (let j = 1; j < a.length; j++) {
      const c = a[j];
      if (coGiaTri.includes(c)) {
        co[c] = j + 1 < a.length ? a.slice(j + 1) : (args[++i] ?? '');
        break;
      }
      co[c] = true;
    }
  }
  return { co, conLai };
}

const danhSo = (dong: string[]) => dong.map((l, i) => `${String(i + 1).padStart(6)}\t${l}`).join('\n');

function lenhCat(ten: string): LenhThuan['chay'] {
  return (args, nc) => {
    const { co, conLai } = tachCo(args);
    const r = docNguon(ten, conLai, nc);
    if ('loi' in r) return r.loi;
    return co.n ? danhSo(tachDong(r.text)) : r.text;
  };
}

/** head/tail: -n N, -N; tail con nhan +N (tu dong N tro di) */
function lenhDauCuoi(ten: 'head' | 'tail'): LenhThuan['chay'] {
  return (args, nc) => {
    let so = '10';
    const tep: string[] = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (/^-\d+$/.test(a)) so = a.slice(1);
      else if (a === '-n') so = args[++i] ?? '';
      else if (a.startsWith('-n')) so = a.slice(2);
      else tep.push(a);
    }
    if (!/^\+?\d+$/.test(so)) return `${ten}: ${nc.t('loi.soDong', { gt: so })}`;
    const r = docNguon(ten, tep, nc);
    if ('loi' in r) return r.loi;
    const dong = tachDong(r.text);
    const n = Number(so.replace('+', ''));
    if (ten === 'head') return dong.slice(0, n).join('\n');
    return (so.startsWith('+') ? dong.slice(Math.max(0, n - 1)) : dong.slice(Math.max(0, dong.length - n))).join('\n');
  };
}

const wc: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args);
  const r = docNguon('wc', conLai, nc);
  if ('loi' in r) return r.loi;
  const so = { l: tachDong(r.text).length, w: r.text.split(/\s+/).filter(Boolean).length, c: new TextEncoder().encode(r.text).length };
  const chon = (['l', 'w', 'c'] as const).filter(k => co[k]);
  const ten = conLai.length === 1 ? ' ' + conLai[0] : '';
  if (chon.length === 1) return `${so[chon[0]]}${ten}`;
  return (chon.length ? chon : (['l', 'w', 'c'] as const)).map(k => String(so[k]).padStart(7)).join(' ') + ten;
};

const sortLenh: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args, 'kt');
  const r = docNguon('sort', conLai, nc);
  if ('loi' in r) return r.loi;
  const sep = typeof co.t === 'string' ? co.t : null;
  const k = typeof co.k === 'string' ? parseInt(co.k, 10) : 0;
  const khoa = (l: string) => {
    let s = l;
    if (k > 0) s = sep !== null ? l.split(sep).slice(k - 1).join(sep) : l.trim().split(/\s+/).slice(k - 1).join(' ');
    return co.f ? s.toLowerCase() : s;
  };
  const soSanhChu = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
  const soSanh = (a: string, b: string) => {
    const ka = khoa(a), kb = khoa(b);
    const kq = co.n ? (parseFloat(ka) || 0) - (parseFloat(kb) || 0) || soSanhChu(ka, kb) : soSanhChu(ka, kb);
    return co.r ? -kq : kq;
  };
  const dong = [...tachDong(r.text)].sort(soSanh);
  return (co.u ? dong.filter((l, i) => i === 0 || khoa(l) !== khoa(dong[i - 1])) : dong).join('\n');
};

const uniq: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args);
  const r = docNguon('uniq', conLai, nc);
  if ('loi' in r) return r.loi;
  const nhom: { l: string; n: number }[] = [];
  const bang = (a: string, b: string) => (co.i ? a.toLowerCase() === b.toLowerCase() : a === b);
  for (const l of tachDong(r.text)) {
    const cuoi = nhom[nhom.length - 1];
    if (cuoi && bang(cuoi.l, l)) cuoi.n++;
    else nhom.push({ l, n: 1 });
  }
  return nhom
    .filter(g => (co.d ? g.n > 1 : co.u ? g.n === 1 : true))
    .map(g => (co.c ? `${String(g.n).padStart(7)} ${g.l}` : g.l))
    .join('\n');
};

/** "1,3" / "2-4" / "3-" / "-2" -> ham kiem vi tri (dem tu 1) */
function danhSachViTri(ds: string): ((i: number) => boolean) | null {
  const khoang: [number, number][] = [];
  for (const p of ds.split(',')) {
    const m = p.match(/^(\d*)(-?)(\d*)$/);
    if (!m || (!m[1] && !m[3])) return null;
    const dau = m[1] ? +m[1] : 1;
    const cuoi = m[2] ? (m[3] ? +m[3] : Infinity) : dau;
    khoang.push([dau, cuoi]);
  }
  return i => khoang.some(([a, b]) => i >= a && i <= b);
}

const cut: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args, 'dfc');
  const ds = typeof co.f === 'string' ? co.f : typeof co.c === 'string' ? co.c : null;
  if (!ds) return `cut: ${nc.t('loi.cutCan')}`;
  const chon = danhSachViTri(ds);
  if (!chon) return `cut: ${nc.t('loi.danhSach', { gt: ds })}`;
  const r = docNguon('cut', conLai, nc);
  if ('loi' in r) return r.loi;
  const sep = typeof co.d === 'string' ? co.d.replace('\\t', '\t') || '\t' : '\t';
  return tachDong(r.text).map(l => {
    if (typeof co.c === 'string') return Array.from(l).filter((_, i) => chon(i + 1)).join('');
    if (!l.includes(sep)) return l;
    return l.split(sep).filter((_, i) => chon(i + 1)).join(sep);
  }).join('\n');
};

/** Bung tap ky tu cua tr: a-z, [:upper:], \n \t */
function bungTap(s: string): string[] {
  const lop: Record<string, string> = {
    '[:upper:]': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '[:lower:]': 'abcdefghijklmnopqrstuvwxyz',
    '[:digit:]': '0123456789', '[:space:]': ' \t\n\r', '[:punct:]': '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
  };
  let t = s;
  for (const [k, v] of Object.entries(lop)) t = t.split(k).join(v);
  t = t.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
  const kq: string[] = [];
  const kt = Array.from(t);
  for (let i = 0; i < kt.length; i++) {
    if (kt[i + 1] === '-' && kt[i + 2] !== undefined) {
      for (let c = kt[i].codePointAt(0)!; c <= kt[i + 2].codePointAt(0)!; c++) kq.push(String.fromCodePoint(c));
      i += 2;
    } else kq.push(kt[i]);
  }
  return kq;
}

const tr: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args);
  if (!conLai[0]) return `tr: ${nc.t('loi.thieuTap', { vd: 'tr a-z A-Z, tr -d 0-9' })}`;
  if (nc.stdin === null) return `tr: ${nc.t('loi.chiPipe', { vd: 'cat file | tr a-z A-Z' })}`;
  const t1 = bungTap(conLai[0]);
  const t2 = conLai[1] ? bungTap(conLai[1]) : [];
  let ra = Array.from(nc.stdin).flatMap(c => {
    const i = t1.indexOf(c);
    if (i < 0) return [c];
    if (co.d) return [];
    return t2.length ? [t2[Math.min(i, t2.length - 1)]] : [c];
  }).join('');
  if (co.s) {
    const gop = new Set(t2.length ? t2 : t1);
    ra = Array.from(ra).filter((c, i, a) => !(i > 0 && c === a[i - 1] && gop.has(c))).join('');
  }
  return ra;
};

function theoDong(ten: string, bien: (dong: string[]) => string[]): LenhThuan['chay'] {
  return (args, nc) => {
    const r = docNguon(ten, tachCo(args).conLai, nc);
    return 'loi' in r ? r.loi : bien(tachDong(r.text)).join('\n');
  };
}

/** Regex co ban (BRE) cua grep/sed -> regex JS: \| \( \) \+ \? \{ \} la toan tu, con | ( ) + ? { } la chu */
function breSangJs(p: string): string {
  let kq = '';
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === '\\' && '+?|(){}'.includes(p[i + 1] ?? 'x')) { kq += p[++i]; continue; }
    if (c === '\\') { kq += c + (p[++i] ?? ''); continue; }
    kq += '+?|(){}'.includes(c) ? '\\' + c : c;
  }
  return kq;
}

const thoatRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Tao regex; sai cu phap thi coi mau la chuoi thuong (nguoi moi hay go ky tu dac biet) */
function taoRegex(mau: string, { ere = false, coDinh = false, khongHoaThuong = false, tron = false, toanCuc = false } = {}): RegExp {
  let nguon = coDinh ? thoatRegex(mau) : ere ? mau : breSangJs(mau);
  if (tron) nguon = `(?<![\\w])(?:${nguon})(?![\\w])`;
  const co = (khongHoaThuong ? 'i' : '') + (toanCuc ? 'g' : '');
  try { return new RegExp(nguon, co); } catch { return new RegExp(thoatRegex(mau), co); }
}

const grep: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args, 'e');
  const mau = typeof co.e === 'string' ? co.e : conLai.shift();
  if (mau === undefined) return `grep: ${nc.t('loi.cachDung', { cu: 'grep [-i -v -n -c -o -E -r -l] <pattern> [file...]' })}`;
  const tuyChon = { ere: !!co.E, coDinh: !!co.F, khongHoaThuong: !!co.i, tron: !!co.w };
  const re = taoRegex(mau, tuyChon);
  const deQuy = co.r || co.R;
  const nguon: { ten: string; text: string }[] = [];
  const loi: string[] = [];
  const dsDuong = conLai.length ? conLai : deQuy ? ['.'] : [];
  for (const d of dsDuong) {
    const ds = deQuy ? nc.tepDeQuy(d) : null;
    for (const p of ds ?? [d]) {
      const r = nc.docTep(p);
      if ('loi' in r) loi.push(`grep: ${p}: ${r.loi}`);
      else nguon.push({ ten: p, text: r.noiDung });
    }
  }
  if (!dsDuong.length) {
    if (nc.stdin === null) return `grep: ${nc.t('loi.thieuTepPipe', { vd: 'cat file | grep pattern' })}`;
    nguon.push({ ten: '(standard input)', text: nc.stdin });
  }
  const ghiTen = (deQuy || nguon.length > 1) && !co.h;
  const ra: string[] = [];
  for (const { ten, text } of nguon) {
    const truoc = ghiTen ? ten + ':' : '';
    const khop = tachDong(text).map((l, i) => ({ l, i })).filter(({ l }) => re.test(l) !== !!co.v);
    if (co.l) { if (khop.length) ra.push(ten); continue; }
    if (co.c) { ra.push(truoc + khop.length); continue; }
    for (const { l, i } of khop) {
      const so = co.n ? `${i + 1}:` : '';
      if (co.o && !co.v) {
        for (const m of l.matchAll(taoRegex(mau, { ...tuyChon, toanCuc: true }))) if (m[0]) ra.push(truoc + so + m[0]);
      } else ra.push(truoc + so + l);
    }
  }
  return [...loi, ...ra].join('\n');
};

// ---------- awk (tap con hay dung: -F, /mau/, so sanh truong, print, BEGIN/END) ----------

type GiaTriAwk = (truong: string[], nr: number) => string;

/** Bieu thuc don: $N, $NF, $(NF-1), $0, NR, NF, so, "chuoi" */
function bieuThucAwk(s: string): GiaTriAwk | null {
  const t = s.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^"((?:[^"\\]|\\.)*)"$/))) {
    const chu = m[1].replace(/\\t/g, '\t').replace(/\\n/g, '\n').replace(/\\"/g, '"');
    return () => chu;
  }
  if (t === '$0') return f => f[0];
  if (t === '$NF') return f => (f.length > 1 ? f[f.length - 1] : '');
  if ((m = t.match(/^\$\(NF-(\d+)\)$/))) { const k = +m[1]; return f => (f.length - 1 - k >= 1 ? f[f.length - 1 - k] : ''); }
  if ((m = t.match(/^\$(\d+)$/))) { const k = +m[1]; return f => f[k] ?? ''; }
  if (t === 'NR') return (_f, nr) => String(nr);
  if (t === 'NF') return f => String(f.length - 1);
  if (/^-?\d+(\.\d+)?$/.test(t)) return () => t;
  return null;
}

/** print a, b "x" c -> cac muc cach bang dau phay (noi bang dau cach), moi muc la chuoi ghep */
function lenhPrintAwk(s: string): GiaTriAwk | null {
  const than = s.trim().replace(/^print\b/, '').trim();
  if (!than) return f => f[0];
  const muc = than.match(/("(?:[^"\\]|\\.)*"|[^,"]+)+/g)?.map(x => x.trim()) ?? [];
  const ham: GiaTriAwk[][] = [];
  for (const mu of muc) {
    const ds = (mu.match(/"(?:[^"\\]|\\.)*"|\S+/g) ?? []).map(bieuThucAwk);
    if (ds.some(x => !x)) return null;
    ham.push(ds as GiaTriAwk[]);
  }
  return (f, nr) => ham.map(ds => ds.map(h => h(f, nr)).join('')).join(' ');
}

const laSo = (s: string) => s.trim() !== '' && Number.isFinite(Number(s));

function dieuKienAwk(s: string): ((f: string[], nr: number) => boolean) | null {
  const t = s.trim();
  if (!t) return () => true;
  if (t.includes('||')) {
    const ds = t.split('||').map(dieuKienAwk);
    return ds.some(x => !x) ? null : (f, nr) => ds.some(d => d!(f, nr));
  }
  if (t.includes('&&')) {
    const ds = t.split('&&').map(dieuKienAwk);
    return ds.some(x => !x) ? null : (f, nr) => ds.every(d => d!(f, nr));
  }
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^(!?)\/(.*)\/$/))) {
    const re = taoRegex(m[2], { ere: true });
    const phu = m[1] === '!';
    return f => re.test(f[0]) !== phu;
  }
  if ((m = t.match(/^(\S+)\s*(!?~)\s*\/(.*)\/$/))) {
    const trai = bieuThucAwk(m[1]);
    const re = taoRegex(m[3], { ere: true });
    const phu = m[2] === '!~';
    return trai ? (f, nr) => re.test(trai(f, nr)) !== phu : null;
  }
  if ((m = t.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/))) {
    const trai = bieuThucAwk(m[1]);
    const phai = bieuThucAwk(m[3]);
    const op = m[2];
    if (!trai || !phai) return null;
    return (f, nr) => {
      const a = trai(f, nr), b = phai(f, nr);
      const kq = laSo(a) && laSo(b) ? Number(a) - Number(b) : a < b ? -1 : a > b ? 1 : 0;
      return { '==': kq === 0, '!=': kq !== 0, '>=': kq >= 0, '<=': kq <= 0, '>': kq > 0, '<': kq < 0 }[op]!;
    };
  }
  return null;
}

type LuatAwk = { dk: (f: string[], nr: number) => boolean; lam: GiaTriAwk[] };

/** Tach chuong trinh awk thanh BEGIN / cac luat / END; khong ho tro thi null */
function phanTichAwk(ct: string): { begin: GiaTriAwk[]; luat: LuatAwk[]; end: GiaTriAwk[] } | null {
  const kq = { begin: [] as GiaTriAwk[], luat: [] as LuatAwk[], end: [] as GiaTriAwk[] };
  const khoi = (s: string) => {
    const ds = s.split(';').map(x => x.trim()).filter(Boolean).map(x => (x.startsWith('print') ? lenhPrintAwk(x) : null));
    return ds.some(x => !x) ? null : (ds as GiaTriAwk[]);
  };
  let con = ct.trim();
  while (con) {
    // [BEGIN|END] [dieu kien] [{ lenh }] [phan con lai]; dieu kien an tham den dau '{' dau tien
    const m = con.match(/^(BEGIN|END)?\s*([^{]*)(?:\{([^}]*)\})?\s*(.*)$/s);
    if (!m || (!m[1] && !m[2].trim() && m[3] === undefined)) return null;
    const lam = m[3] !== undefined ? khoi(m[3]) : [((f: string[]) => f[0]) as GiaTriAwk];
    if (!lam) return null;
    if (m[1] === 'BEGIN') kq.begin.push(...lam);
    else if (m[1] === 'END') kq.end.push(...lam);
    else {
      const dk = dieuKienAwk(m[2]);
      if (!dk) return null;
      kq.luat.push({ dk, lam });
    }
    if (m[4] === con) return null;
    con = m[4];
  }
  return kq;
}

const awk: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args, 'Fv');
  const ct = conLai.shift();
  if (!ct) return `awk: ${nc.t('loi.cachDung', { cu: "awk [-F sep] '/pattern/ {print $1, $3}' [file]" })}`;
  const p = phanTichAwk(ct);
  if (!p) return `awk: ${nc.t('loi.chiHoTro', { ds: "'{print $1, $NF}', '/pattern/ {print}', '$3 > 100 {print $1}', 'END {print NR}', -F" })}`;
  const r = docNguon('awk', conLai, nc);
  if ('loi' in r) return r.loi;
  const sepGoc = typeof co.F === 'string' ? co.F.replace('\\t', '\t') : ' ';
  const tach = (l: string) => {
    if (sepGoc === ' ') return l.trim().split(/\s+/).filter(Boolean);
    if (sepGoc.length === 1) return l.split(sepGoc);
    try { return l.split(new RegExp(sepGoc)); } catch { return l.split(sepGoc); }
  };
  const ra: string[] = p.begin.map(h => h([''], 0));
  let nr = 0;
  let cuoi: string[] = [''];
  for (const l of tachDong(r.text)) {
    nr++;
    const f = [l, ...tach(l)];
    cuoi = f;
    for (const luat of p.luat) if (luat.dk(f, nr)) ra.push(...luat.lam.map(h => h(f, nr)));
  }
  ra.push(...p.end.map(h => h(cuoi, nr)));
  return ra.join('\n');
};

// ---------- sed (s///, d, p voi dia chi N, N,M, /re/, $) ----------

type DiaChi = { loai: 'so'; n: number } | { loai: 'cuoi' } | { loai: 're'; re: RegExp };
type LenhSed = { tu?: DiaChi; den?: DiaChi; lenh: 's' | 'd' | 'p'; re?: RegExp; thay?: string; p?: boolean };

/** Phan thay the cua sed -> chuoi thay cua JS: & la ca chuoi khop, \1 la nhom 1 */
const thaySed = (s: string) =>
  s.replace(/\$/g, '$$$$').replace(/\\(\d)/g, '$$$1').replace(/(^|[^\\])&/g, '$1$$&').replace(/\\&/g, '&');

function phanTichSed(script: string, ere: boolean): LenhSed[] | null {
  const ds: LenhSed[] = [];
  let i = 0;
  const diaChi = (): DiaChi | undefined => {
    if (script[i] === '$') { i++; return { loai: 'cuoi' }; }
    const so = script.slice(i).match(/^\d+/);
    if (so) { i += so[0].length; return { loai: 'so', n: +so[0] }; }
    if (script[i] === '/') {
      const ket = script.indexOf('/', i + 1);
      if (ket < 0) return undefined;
      const re = taoRegex(script.slice(i + 1, ket), { ere });
      i = ket + 1;
      return { loai: 're', re };
    }
    return undefined;
  };
  while (i < script.length) {
    while (script[i] === ';' || script[i] === ' ') i++;
    if (i >= script.length) break;
    const l: Partial<LenhSed> = { tu: diaChi() };
    if (l.tu && script[i] === ',') { i++; l.den = diaChi(); }
    const c = script[i++];
    if (c === 'd' || c === 'p') { ds.push({ ...l, lenh: c } as LenhSed); continue; }
    if (c !== 's') return null;
    const sep = script[i];
    const phan: string[] = [];
    let cur = '';
    for (i++; i < script.length && phan.length < 2; i++) {
      if (script[i] === '\\' && script[i + 1] === sep) { cur += sep; i++; continue; }
      if (script[i] === sep) { phan.push(cur); cur = ''; continue; }
      cur += script[i];
    }
    if (phan.length < 2) return null;
    const coMuc = script.slice(i).match(/^[gip]*/)![0];
    i += coMuc.length;
    const re = taoRegex(phan[0], { ere, khongHoaThuong: coMuc.includes('i'), toanCuc: coMuc.includes('g') });
    ds.push({ ...l, lenh: 's', re, thay: thaySed(phan[1]), p: coMuc.includes('p') } as LenhSed);
  }
  return ds;
}

const sed: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args, 'e');
  const script = typeof co.e === 'string' ? co.e : conLai.shift();
  if (!script) return `sed: ${nc.t('loi.cachDung', { cu: "sed 's/old/new/g' [file]  |  sed -n '2p'  |  sed '/pattern/d'" })}`;
  const ds = phanTichSed(script, !!(co.E || co.r));
  if (!ds) return `sed: ${nc.t('loi.chiHoTro', { ds: 's/old/new/[g], [addr]d, [addr]p (addr: N, N,M, /pattern/, $)' })}`;
  const r = docNguon('sed', conLai, nc);
  if ('loi' in r) return r.loi;
  const dong = tachDong(r.text);
  const trongKhoang = new Map<LenhSed, boolean>();
  const khop = (d: DiaChi, l: string, n: number) => (d.loai === 'so' ? n === d.n : d.loai === 'cuoi' ? n === dong.length : d.re.test(l));
  const apDung = (lenh: LenhSed, l: string, n: number) => {
    if (!lenh.tu) return true;
    if (!lenh.den) return khop(lenh.tu, l, n);
    const den = lenh.den;
    if (trongKhoang.get(lenh)) {
      if (khop(den, l, n) || (den.loai === 'so' && n >= den.n)) trongKhoang.set(lenh, false);
      return true;
    }
    if (khop(lenh.tu, l, n)) { trongKhoang.set(lenh, !(den.loai === 'so' && n >= den.n)); return true; }
    return false;
  };
  const ra: string[] = [];
  dong.forEach((goc, idx) => {
    let l = goc;
    let xoa = false;
    for (const lenh of ds) {
      if (!apDung(lenh, l, idx + 1)) continue;
      if (lenh.lenh === 'd') { xoa = true; break; }
      if (lenh.lenh === 'p') { ra.push(l); continue; }
      const moi = l.replace(lenh.re!, lenh.thay!);
      if (moi !== l && lenh.p) ra.push(moi);
      l = moi;
    }
    if (!xoa && !co.n) ra.push(l);
  });
  return ra.join('\n');
};

/** diff dang thuong (2c2 / < cu / --- / > moi) dua tren day con chung dai nhat */
const diff: LenhThuan['chay'] = (args, nc) => {
  const { conLai } = tachCo(args);
  if (conLai.length < 2) return `diff: ${nc.t('loi.cachDung', { cu: 'diff <file1> <file2>' })}`;
  const doc = (t: string) => { const r = nc.docTep(t); return 'loi' in r ? r : { dong: tachDong(r.noiDung) }; };
  const a = doc(conLai[0]), b = doc(conLai[1]);
  if ('loi' in a) return `diff: ${conLai[0]}: ${a.loi}`;
  if ('loi' in b) return `diff: ${conLai[1]}: ${b.loi}`;
  const x = a.dong, y = b.dong;
  const L = Array.from({ length: x.length + 1 }, () => new Array<number>(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) {
    L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  }
  const ra: string[] = [];
  const khoang = (s: number, e: number) => (e - s === 1 ? `${s + 1}` : `${s + 1},${e}`);
  const bang = (i: number, j: number) => i < x.length && j < y.length && x[i] === y[j];
  let i = 0, j = 0;
  while (i < x.length || j < y.length) {
    if (bang(i, j)) { i++; j++; continue; }
    const i0 = i, j0 = j;
    while ((i < x.length || j < y.length) && !bang(i, j)) {
      if (j >= y.length || (i < x.length && L[i + 1][j] >= L[i][j + 1])) i++; else j++;
    }
    const xoa = x.slice(i0, i), them = y.slice(j0, j);
    if (xoa.length && them.length) ra.push(`${khoang(i0, i)}c${khoang(j0, j)}`, ...xoa.map(l => '< ' + l), '---', ...them.map(l => '> ' + l));
    else if (xoa.length) ra.push(`${khoang(i0, i)}d${j0}`, ...xoa.map(l => '< ' + l));
    else ra.push(`${i0}a${khoang(j0, j)}`, ...them.map(l => '> ' + l));
  }
  return ra.join('\n');
};

export const LENH_VAN_BAN: Record<string, LenhThuan> = {
  cat: { usage: 'cat [-n] <file...>', chay: lenhCat('cat') },
  less: { usage: 'less <file>', chay: lenhCat('less') },
  more: { usage: 'more <file>', chay: lenhCat('more') },
  strings: { usage: 'strings <file>', chay: lenhCat('strings') },
  head: { usage: 'head [-n N] <file>', chay: lenhDauCuoi('head') },
  tail: { usage: 'tail [-n N|+N] <file>', chay: lenhDauCuoi('tail') },
  grep: { usage: 'grep [-ivncoErl] <pattern> [file]', chay: grep },
  wc: { usage: 'wc [-l -w -c] [file]', chay: wc },
  sort: { usage: 'sort [-r -n -u -k N -t X]', chay: sortLenh },
  uniq: { usage: 'uniq [-c -d -u]', chay: uniq },
  cut: { usage: 'cut -d X -f N[,M]', chay: cut },
  tr: { usage: 'tr [-d -s] <set1> [set2]', chay: tr },
  awk: { usage: "awk [-F X] '/pattern/ {print $1}'", chay: awk },
  sed: { usage: "sed 's/old/new/g' | sed -n '2p'", chay: sed },
  rev: { usage: 'rev [file]', chay: theoDong('rev', d => d.map(l => Array.from(l).reverse().join(''))) },
  tac: { usage: 'tac [file]', chay: theoDong('tac', d => [...d].reverse()) },
  nl: { usage: 'nl [file]', chay: theoDong('nl', d => { let n = 0; return d.map(l => (l ? `${String(++n).padStart(6)}\t${l}` : l)); }) },
  diff: { usage: 'diff <file1> <file2>', chay: diff }
};
