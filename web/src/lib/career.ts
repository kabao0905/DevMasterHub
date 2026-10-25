import type { SupabaseLike } from './auth';
import type { TinNhan } from './ai';
import { taoCoVanGoc } from './career-goc';

export type DuAnTomTat = { project_name?: string; topic?: string; languages_used?: string[]; score_overall?: number | null };
export type ThongKe = {
  totalLessonsCompleted: number;
  totalTimeHours: number;
  techBreakdown: { tech: string; completed: number; highestLevel: string }[];
  projects: DuAnTomTat[];
  averageProjectScore: number | null;
};

export type ViecLam = {
  title: string; company_name: string; company_logo: string; source: string; location: string;
  is_remote: boolean; employment_type: string; salary: string; tags: string[]; url: string;
  matchRate: number; status: 'ready' | 'gap' | 'target'; badgeText: string; fitRecommendation: string;
};
export type KetQuaLink = {
  url: string; ok: boolean; title?: string; loi?: string;
  soTrang?: number; tongViec?: number;
};
export type KetQuaTraLoi = { text: string; jobs: ViecLam[] | null; searchKeyword: string; link?: KetQuaLink | null; choViec?: Promise<ViecLam[] | null> };

type DichVuGoc = {
  sendMessage(tin: string): Promise<{ text: string; jobs: unknown[] | null; searchKeyword: string; link?: KetQuaLink | null; choViec?: Promise<unknown[] | null> | null } | null>;
  searchJobs(tuKhoa: string): Promise<unknown[]>;
  abortMessage(): void;
  datLichSu(lichSu: TinNhan[]): void;
};
const taoGoc = taoCoVanGoc as unknown as (dv: Record<string, unknown>) => DichVuGoc;

export function urlAnToan(x: unknown): string {
  try {
    const u = new URL(String(x ?? '').trim());
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : '#';
  } catch {
    return '#';
  }
}

const chu = (x: unknown) => (typeof x === 'string' ? x : typeof x === 'number' ? String(x) : '');

function chuanHoaViec(x: unknown): ViecLam {
  const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
  const logo = urlAnToan(o.company_logo);
  return {
    title: chu(o.title), company_name: chu(o.company_name), company_logo: logo === '#' ? '' : logo,
    source: chu(o.source), location: chu(o.location), is_remote: o.is_remote === true,
    employment_type: chu(o.employment_type), salary: chu(o.salary),
    tags: Array.isArray(o.tags) ? o.tags.map(chu).filter(Boolean) : [],
    url: urlAnToan(o.url),
    matchRate: typeof o.matchRate === 'number' ? o.matchRate : 0,
    status: o.status === 'ready' || o.status === 'gap' ? o.status : 'target',
    badgeText: chu(o.badgeText), fitRecommendation: chu(o.fitRecommendation)
  };
}

export type CoVan = {
  gui(lichSu: TinNhan[], tin: string): Promise<KetQuaTraLoi | null>;
  timViec(tuKhoa: string): Promise<ViecLam[]>;
  huy(): void;
};

export function taoCoVan(client: SupabaseLike, { t, lang, thongKe, tenCongNghe = {} }: {
  t: (khoa: string, bien?: Record<string, string | number>) => string;
  lang: string;
  thongKe: ThongKe | null;
  tenCongNghe?: Record<string, string>;
}): CoVan {
  const AuthService = {
    isConfigured: () => true,
    getUserStats: async () => thongKe,
    authHeaders: async () => {
      const { data } = await client.auth.getSession();
      const token = data.session?.access_token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  };
  const CURRICULUM = Object.fromEntries(Object.entries(tenCongNghe).map(([id, name]) => [id, { name }]));
  const goc = taoGoc({ AuthService, I18n: { t, getLang: () => lang }, CURRICULUM });
  return {
    async gui(lichSu, tin) {
      goc.datLichSu(lichSu);
      const kq = await goc.sendMessage(tin);
      if (!kq) return null;
      return {
        text: kq.text, jobs: kq.jobs ? kq.jobs.map(chuanHoaViec) : null, searchKeyword: kq.searchKeyword || '', link: kq.link ?? null,
        ...(kq.choViec ? { choViec: kq.choViec.then(ds => (ds ? ds.map(chuanHoaViec) : null)) } : {})
      };
    },
    async timViec(tuKhoa) {
      return (await goc.searchJobs(tuKhoa)).map(chuanHoaViec);
    },
    huy: () => goc.abortMessage()
  };
}
