export function ngayDiaPhuong(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const luiNgay = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - n);

export type DongThoiGian = { started_at: string | null; duration_seconds: number | null };

export function tongTheoNgay(ds: readonly DongThoiGian[]): Record<string, number> {
  const kq: Record<string, number> = {};
  for (const r of ds) {
    const giay = Number(r.duration_seconds) || 0;
    if (!r.started_at || giay <= 0) continue;
    const ngay = ngayDiaPhuong(new Date(r.started_at));
    kq[ngay] = (kq[ngay] ?? 0) + giay;
  }
  return kq;
}

export function ngayDatMucTieu(giayTheoNgay: Readonly<Record<string, number>>, mucTieuPhut: number): Set<string> {
  return new Set(Object.keys(giayTheoNgay).filter(ngay => giayTheoNgay[ngay] >= mucTieuPhut * 60));
}

export function tinhStreak(ngay: ReadonlySet<string>, homNay: Date): { hienTai: number; daiNhat: number } {
  let lui = ngay.has(ngayDiaPhuong(homNay)) ? 0 : 1;
  let hienTai = 0;
  while (ngay.has(ngayDiaPhuong(luiNgay(homNay, lui)))) { hienTai++; lui++; }

  let daiNhat = 0;
  let chay = 0;
  let truoc = '';
  for (const s of [...ngay].sort()) {
    const [y, m, d] = s.split('-').map(Number);
    chay = ngayDiaPhuong(new Date(y, m - 1, d - 1)) === truoc ? chay + 1 : 1;
    daiNhat = Math.max(daiNhat, chay);
    truoc = s;
  }
  return { hienTai, daiNhat };
}
