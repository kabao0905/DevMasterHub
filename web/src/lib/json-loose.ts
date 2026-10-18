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
  } catch {}

  for (let end = s.length; end > 1; end--) {
    const ch = s[end - 1];
    if (end !== s.length && ch !== ',' && ch !== '"' && ch !== '}' && ch !== ']') continue;
    const ung = dongNgoacJson(s.slice(0, end));
    if (!ung) continue;
    try {
      const kq = JSON.parse(ung);
      if (kq && typeof kq === 'object' && !Array.isArray(kq)) return kq;
    } catch {}
  }
  return null;
}
