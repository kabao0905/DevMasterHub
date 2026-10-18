export type BaiTomTat = { id: string; title: string };
export type CapTomTat = { id: string; name: string; desc?: string; badge?: string; lessons: BaiTomTat[] };
export type CongNgheTomTat = {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  category: string;
  description: string;
  levels: CapTomTat[];
};
export type MucTimKiem = { t: string; l: string; s: string; title: string; text: string };

export type Nhom = 'language' | 'frontend' | 'backend' | 'mobile' | 'tool';
export const THU_TU_NHOM: Nhom[] = ['language', 'frontend', 'backend', 'mobile', 'tool'];

export function nhomCongNghe(tech: { id: string; category?: string }): Nhom {
  const cat = (tech.category || '').toLowerCase();
  if (tech.id === 'dart' || tech.id === 'flutter') return 'mobile';
  if (tech.id === 'dsa') return 'tool';
  if (cat === 'framework' || cat === 'frontend') return 'frontend';
  if (cat === 'database' || cat === 'backend') return 'backend';
  if (cat === 'devops' || cat === 'cloud' || cat === 'concept' || cat === 'tool') return 'tool';
  if (cat === 'mobile') return 'mobile';
  return 'language';
}

export function boDau(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
}

export function timBaiHoc(ds: MucTimKiem[], q: string, gioiHan = 50): MucTimKiem[] {
  const k = boDau(q.trim());
  if (!k) return [];
  const ra: MucTimKiem[] = [];
  for (const m of ds) {
    if (boDau(m.title).includes(k) || boDau(m.text).includes(k)) {
      ra.push(m);
      if (ra.length >= gioiHan) break;
    }
  }
  return ra;
}

export type BaiTapCoSan = { title: string; description: string; starter?: string };

export type BaiDayDu = BaiTomTat & {
  theory?: string; code?: string; lang?: string; keyPoints?: string[]; exercise?: string;
  output?: string;
  exercises?: BaiTapCoSan[];
  playground?: { files: Record<string, string>; libs?: string[] };
};
export type CapDayDu = Omit<CapTomTat, 'lessons'> & { lessons: BaiDayDu[] };
export type CongNgheDayDu = Omit<CongNgheTomTat, 'levels'> & { levels: CapDayDu[] };

export function timCongNghe<T extends { id: string }>(ds: T[], id: string): T | undefined {
  return ds.find(x => x.id === id);
}

type ViTri<C extends { lessons: unknown[] }> = { level: C; lesson: C['lessons'][number] };

export function viTriBai<C extends { id: string; lessons: { id: string }[] }>(
  tech: { levels: C[] }, levelId: string, lessonId: string
): (ViTri<C> & { truoc: ViTri<C> | null; sau: ViTri<C> | null }) | null {
  const phang = tech.levels.flatMap(level => level.lessons.map(lesson => ({ level, lesson })));
  const i = phang.findIndex(x => x.level.id === levelId && x.lesson.id === lessonId);
  if (i < 0) return null;
  return { ...phang[i], truoc: phang[i - 1] ?? null, sau: phang[i + 1] ?? null };
}
