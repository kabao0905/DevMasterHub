export type LoiCuPhap = { loi: { khoa: 'loi.thieuNhay' | 'loi.cuPhap'; bien: Record<string, string> } };

export type Tu = { v: string; coNhay: boolean };
export type DoanLenh = {
  tu: Tu[];
  vao?: string;
  ra?: { tep: string; noiThem: boolean };
};
export type CauLenh = { ong: DoanLenh[]; noi: ';' | '&&' | '||' | null };

type Token = { loai: 'tu'; tu: Tu } | { loai: 'toan-tu'; v: string };

const TOAN_TU = ['&&', '||', '>>', '2>', '|', ';', '>', '<'];
const LA_KHOANG_TRANG = /\s/;
const THOAT_TRONG_NHAY_KEP = new Set(['"', '\\', '$', '`']);

function tachToken(dong: string): Token[] | LoiCuPhap {
  const ra: Token[] = [];
  let v = '';
  let coTu = false;
  let coNhay = false;
  const dayTu = () => {
    if (coTu) ra.push({ loai: 'tu', tu: { v, coNhay } });
    v = ''; coTu = false; coNhay = false;
  };

  for (let i = 0; i < dong.length; i++) {
    const c = dong[i];
    if (c === "'") {
      const ket = dong.indexOf("'", i + 1);
      if (ket < 0) return { loi: { khoa: 'loi.thieuNhay', bien: { kt: "'" } } };
      v += dong.slice(i + 1, ket);
      i = ket;
      coTu = true; coNhay = true;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      for (; j < dong.length && dong[j] !== '"'; j++) {
        if (dong[j] === '\\' && THOAT_TRONG_NHAY_KEP.has(dong[j + 1])) j++;
        v += dong[j];
      }
      if (j >= dong.length) return { loi: { khoa: 'loi.thieuNhay', bien: { kt: '"' } } };
      i = j;
      coTu = true; coNhay = true;
      continue;
    }
    if (c === '\\' && i + 1 < dong.length) {
      v += dong[++i]; coTu = true; coNhay = true;
      continue;
    }
    if (LA_KHOANG_TRANG.test(c)) { dayTu(); continue; }
    const tt = TOAN_TU.find(t => dong.startsWith(t, i));
    if (tt && !(tt === '2>' && coTu)) {
      dayTu();
      ra.push({ loai: 'toan-tu', v: tt });
      i += tt.length - 1;
      continue;
    }
    v += c; coTu = true;
  }
  dayTu();
  return ra;
}

export function phanTichDong(dong: string): CauLenh[] | LoiCuPhap {
  const token = tachToken(dong);
  if (!Array.isArray(token)) return token;

  const cau: CauLenh[] = [];
  let ong: DoanLenh[] = [];
  let doan: DoanLenh = { tu: [] };
  const loiGan = (t: string): LoiCuPhap => ({ loi: { khoa: 'loi.cuPhap', bien: { t } } });

  for (let i = 0; i < token.length; i++) {
    const t = token[i];
    if (t.loai === 'tu') { doan.tu.push(t.tu); continue; }
    if (t.v === '>' || t.v === '>>' || t.v === '<' || t.v === '2>') {
      const sau = token[i + 1];
      if (!sau || sau.loai !== 'tu') return loiGan(t.v);
      i++;
      if (t.v === '<') doan.vao = sau.tu.v;
      else if (t.v !== '2>') doan.ra = { tep: sau.tu.v, noiThem: t.v === '>>' };
      continue;
    }
    if (!doan.tu.length) return loiGan(t.v);
    ong.push(doan);
    doan = { tu: [] };
    if (t.v !== '|') {
      cau.push({ ong, noi: t.v as CauLenh['noi'] });
      ong = [];
    }
  }
  if (doan.tu.length) ong.push(doan);
  else if (ong.length) return loiGan('|');
  if (ong.length) cau.push({ ong, noi: null });
  return cau;
}
