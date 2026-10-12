// Phan tich mot dong lenh shell cho terminal gia lap: dau nhay, \ , pipe |, ; && ||, chuyen huong < > >> 2>.
// Khong chay gi o day — chi tach thanh cau truc de terminal.ts chay.

/** Mot tu cua lenh. coNhay: co phan nam trong dau nhay -> khong bung glob (giong bash) */
export type Tu = { v: string; coNhay: boolean };
export type DoanLenh = {
  tu: Tu[];
  /** < tep: doc stdin tu tep */
  vao?: string;
  /** > tep / >> tep */
  ra?: { tep: string; noiThem: boolean };
};
/** Mot cau lenh = mot pipeline; noi: cach noi voi cau sau (; && ||) */
export type CauLenh = { ong: DoanLenh[]; noi: ';' | '&&' | '||' | null };

type Token = { loai: 'tu'; tu: Tu } | { loai: 'toan-tu'; v: string };

const TOAN_TU = ['&&', '||', '>>', '2>', '|', ';', '>', '<'];
const LA_KHOANG_TRANG = /\s/;
// Trong dau nhay kep, \ chi thoat cac ky tu nay (nhu bash); con lai giu nguyen \ (vd regex "\.")
const THOAT_TRONG_NHAY_KEP = new Set(['"', '\\', '$', '`']);

function tachToken(dong: string): Token[] | { loi: string } {
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
      if (ket < 0) return { loi: "thiếu dấu nháy đóng '" };
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
      if (j >= dong.length) return { loi: 'thiếu dấu nháy đóng "' };
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
    // "2>" chi la toan tu khi dung dau mot tu (con "a2>b" la tu thuong)
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

/** Tach dong lenh thanh cac cau lenh; tra ve { loi } khi sai cu phap */
export function phanTichDong(dong: string): CauLenh[] | { loi: string } {
  const token = tachToken(dong);
  if (!Array.isArray(token)) return token;

  const cau: CauLenh[] = [];
  let ong: DoanLenh[] = [];
  let doan: DoanLenh = { tu: [] };
  const loiGan = (t: string) => ({ loi: `lỗi cú pháp gần "${t}"` });

  for (let i = 0; i < token.length; i++) {
    const t = token[i];
    if (t.loai === 'tu') { doan.tu.push(t.tu); continue; }
    if (t.v === '>' || t.v === '>>' || t.v === '<' || t.v === '2>') {
      const sau = token[i + 1];
      if (!sau || sau.loai !== 'tu') return loiGan(t.v);
      i++;
      if (t.v === '<') doan.vao = sau.tu.v;
      else if (t.v !== '2>') doan.ra = { tep: sau.tu.v, noiThem: t.v === '>>' };
      // 2> tep: terminal gia lap khong tach stderr — bo qua (hay gap: find / -name x 2>/dev/null)
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
