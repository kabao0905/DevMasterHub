// Doc JSON doi tuong tu cau tra loi cua AI, chiu duoc cau tra loi bi cat ngang (chep tu public/app.js).

/**
 * Dong lai chuoi va cac ngoac con dang mo trong mot doan JSON bi cat ngang.
 */
function dongNgoacJson(doan: string): string | null {
  let trongChuoi = false, thoat = false;
  const chong: string[] = [];
  for (let i = 0; i < doan.length; i++) {
    const c = doan[i];
    if (thoat) { thoat = false; continue; }
    if (c === '\\') { if (trongChuoi) thoat = true; continue; }
    if (c === '"') { trongChuoi = !trongChuoi; continue; }
    if (trongChuoi) continue;
    if (c === '{' || c === '[') chong.push(c);
    else if (c === '}' || c === ']') chong.pop();
  }
  if (thoat) return null;

  let out = doan;
  if (trongChuoi) out += '"';

  // Bo phan thua o duoi: dau phay le, hoac cap "khoa": chua kip co gia tri
  let truoc: string;
  do {
    truoc = out;
    out = out.replace(/[\s,]+$/, '');
    out = out.replace(/"(?:[^"\\]|\\.)*"\s*:\s*$/, '');
    out = out.replace(/[\s,]+$/, '');
  } while (out !== truoc);

  for (let i = chong.length - 1; i >= 0; i--) out += chong[i] === '{' ? '}' : ']';
  return out;
}

/**
 * Doc JSON tu cau tra loi cua AI. Khi AI cham tran so token, cau tra loi bi
 * cat ngang giua dau nhay va JSON.parse nem "Unterminated string in JSON".
 * Ham nay va lai bang cach dong cac ngoac con mo, lui dan diem cat cho toi
 * khi doc duoc — nen van giu lai duoc phan de bai da kip sinh ra.
 */
export function parseJsonLoose(raw: unknown): Record<string, unknown> | null {
  let s = String(raw || '')
    .replace(/^\uFEFF/, '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  const dau = s.indexOf('{');
  if (dau === -1) return null;
  s = s.slice(dau);

  try {
    const kq = JSON.parse(s);
    if (kq && typeof kq === 'object' && !Array.isArray(kq)) return kq;
  } catch { /* roi xuong phan va lai ben duoi */ }

  for (let end = s.length; end > 1; end--) {
    const ch = s[end - 1];
    if (end !== s.length && ch !== ',' && ch !== '"' && ch !== '}' && ch !== ']') continue;
    const ung = dongNgoacJson(s.slice(0, end));
    if (!ung) continue;
    try {
      const kq = JSON.parse(ung);
      if (kq && typeof kq === 'object' && !Array.isArray(kq)) return kq;
    } catch { /* thu diem cat ngan hon */ }
  }
  return null;
}
