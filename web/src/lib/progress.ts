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

function baiTheoThuTu(tech: CongNgheTomTat): ViTriBai[] {
  return tech.levels.flatMap(level => level.lessons.map(lesson => ({ tech, level, lesson })));
}

export function baiCanHocTruoc(tech: CongNgheTomTat, levelId: string, lessonId: string): ViTriBai | null {
  const ds = baiTheoThuTu(tech);
  const i = ds.findIndex(b => b.level.id === levelId && b.lesson.id === lessonId);
  return i > 0 ? ds[i - 1] : null;
}

export function baiDaMo(tech: CongNgheTomTat, levelId: string, lessonId: string, done: Set<string>): boolean {
  if (done.has(khoaBai(tech.id, levelId, lessonId))) return true;
  const truoc = baiCanHocTruoc(tech, levelId, lessonId);
  return !truoc || done.has(khoaBai(tech.id, truoc.level.id, truoc.lesson.id));
}

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

export function dangHocDo(ds: CongNgheTomTat[], done: Set<string>): ViTriBai[] {
  const ra: { vt: ViTriBai; xong: number }[] = [];
  for (const tech of ds) {
    const { xong, tong } = tienDoCongNghe(tech, done);
    if (xong === 0 || xong >= tong) continue;
    const level = tech.levels.find(l => l.lessons.some(b => !done.has(khoaBai(tech.id, l.id, b.id))));
    const lesson = level?.lessons.find(b => !done.has(khoaBai(tech.id, level.id, b.id)));
    if (level && lesson) ra.push({ vt: { tech, level, lesson }, xong });
  }
  return ra.sort((a, b) => b.xong - a.xong).map(x => x.vt);
}
