// Tinh tien do hoc tu tap cac bai da xong. Khoa bai giong app cu: "<tech>.<level>.<lesson>".
import type { BaiTomTat, CapTomTat, CongNgheTomTat } from './curriculum';

export const khoaBai = (tech: string, level: string, lesson: string) => `${tech}.${level}.${lesson}`;

const phanTram = (xong: number, tong: number) => (tong ? Math.round((xong / tong) * 100) : 0);

export function tienDoCongNghe(tech: CongNgheTomTat, done: Set<string>) {
  const theoCap = tech.levels.map(l => ({
    capId: l.id,
    xong: l.lessons.filter(b => done.has(khoaBai(tech.id, l.id, b.id))).length,
    tong: l.lessons.length
  }));
  const xong = theoCap.reduce((s, c) => s + c.xong, 0);
  const tong = theoCap.reduce((s, c) => s + c.tong, 0);
  return { xong, tong, phanTram: phanTram(xong, tong), theoCap };
}

export function tienDoTong(ds: CongNgheTomTat[], done: Set<string>) {
  let xong = 0;
  let tong = 0;
  for (const t of ds) {
    const td = tienDoCongNghe(t, done);
    xong += td.xong;
    tong += td.tong;
  }
  return { xong, tong, phanTram: phanTram(xong, tong) };
}

export type ViTriBai = { tech: CongNgheTomTat; level: CapTomTat; lesson: BaiTomTat };

/**
 * Bai nen hoc tiep: trong cac cong nghe da bat dau nhung chua xong, chon cai co
 * nhieu bai xong nhat, roi lay bai dau tien chua xong theo thu tu giao trinh.
 */
export function baiKeTiep(ds: CongNgheTomTat[], done: Set<string>): ViTriBai | null {
  let tot: { tech: CongNgheTomTat; xong: number } | null = null;
  for (const tech of ds) {
    const { xong, tong } = tienDoCongNghe(tech, done);
    if (xong > 0 && xong < tong && (!tot || xong > tot.xong)) tot = { tech, xong };
  }
  if (!tot) return null;
  for (const level of tot.tech.levels) {
    for (const lesson of level.lessons) {
      if (!done.has(khoaBai(tot.tech.id, level.id, lesson.id))) return { tech: tot.tech, level, lesson };
    }
  }
  return null;
}
