import type { SupabaseLike } from './auth';
import type { TinNhan } from './ai';
import { taoDichVuDuAn as taoGoc } from './project-ai-goc';

export type CapDo = 'newbie' | 'junior' | 'mid' | 'senior' | 'master';
export const CAP_DO: CapDo[] = ['newbie', 'junior', 'mid', 'senior', 'master'];
export const laCapDo = (x: unknown): x is CapDo => typeof x === 'string' && (CAP_DO as string[]).includes(x);

export type YTuong = {
  name: string; description: string; difficulty: CapDo; techStack: string[];
  requirements: string[]; steps: string[]; bonusFeatures: string[]; estimatedTime: string;
};
export type TepDuAn = { name: string; lang: string; code: string };

export type VanDeTinh = { severity: 'error' | 'warning' | 'info'; message: string; line?: number };
export type KetQuaTep = {
  fileName: string; score: number; issues: VanDeTinh[]; errorCount: number; warnCount: number; infoCount: number; grade: string;
  stats: { totalLines: number; codeLines: number; commentLines: number; blankLines: number; longestLine: number; functions: number; classes: number };
};
export type PhanTichTinh = { files: KetQuaTep[]; avgScore: number; totalIssues: number; totalErrors: number; totalWarnings: number };
export type DanhGiaCauTruc = { structureScore: number; naming: string; organization: string; completeness: string; missingFiles: string[]; suggestions: string[] };
export type DanhGiaModule = {
  moduleId: string; moduleLabel: string; score: number; codeQuality: number; logic: number; errorHandling: number; relevance: number; cohesion: number;
  summary: string; fileScores: { file: string; score: number }[]; issues: string[]; positives: string[];
};
export type TieuChi = { name: string; score: number; comment: string };
export type TrangThaiCham = 'excellent' | 'good' | 'partial' | 'needs_work';
export type KetQuaCham = {
  score: number | null; status: TrangThaiCham; summary: string; criteria: TieuChi[];
  strengths: string[]; improvements: string[]; tips: string[];
  perFileReviews: { fileName: string; score: number; summary: string }[];
  moduleReviews: DanhGiaModule[]; structureReview: DanhGiaCauTruc | null; localAnalysis: PhanTichTinh | null;
};
export type TienDoCham = { buoc: 'tinh' | 'cauTruc' | 'module' | 'tongHop'; i?: number; n?: number; nhan?: string };
export type ModuleDuAn = { id: string; label: string; files: TepDuAn[] };

export type BanNop = {
  projectName: string; projectDescription: string; difficultyLevel: string; topic: string;
  files: TepDuAn[]; review: KetQuaCham;
  scoreOverall: number | null; scoreCodeQuality: number | null; scoreFunctionality: number | null;
  scoreBestPractices: number | null; scoreCreativity: number | null;
  aiFeedback: string; aiStrengths: string[]; aiImprovements: string[]; languagesUsed: string[];
};

type TuyChonGoi = { lang: string; signal?: AbortSignal; cho?: (ms: number) => Promise<void> };

type DichVuGoc = {
  generateProjectIdea(level: CapDo | null, topic: string | null): Promise<unknown>;
  chatAboutProject(nguCanh: string, lichSu: TinNhan[], cauHoi: string): Promise<string>;
  localAnalyze(code: string, tenTep: string): KetQuaTep;
  localAnalyzeAll(files: TepDuAn[]): PhanTichTinh;
  smartTruncateCode(code: string, soDong: number): string;
  groupFilesIntoModules(files: TepDuAn[]): ModuleDuAn[];
  reviewStructure(files: TepDuAn[], idea: YTuong): Promise<unknown>;
  reviewModule(m: ModuleDuAn, idea: YTuong, tinh: PhanTichTinh): Promise<unknown>;
  synthesizeReview(cauTruc: DanhGiaCauTruc, modules: DanhGiaModule[], tinh: PhanTichTinh, idea: YTuong, soTep: number): Promise<unknown>;
  buildSubmission(p: { review: KetQuaCham; idea: YTuong; files: TepDuAn[]; difficulty?: string | null; topic?: string | null }): BanNop;
};
const taoDichVuDuAn = taoGoc as unknown as (client: unknown, tc: TuyChonGoi & { ngauNhien?: () => number }) => DichVuGoc;

const chu = (x: unknown): string => (typeof x === 'string' ? x : typeof x === 'number' || typeof x === 'boolean' ? String(x) : '');
const so = (x: unknown, thap: number, cao: number): number => {
  const n = typeof x === 'number' ? x : typeof x === 'string' && x.trim() ? Number(x) : NaN;
  return Number.isFinite(n) ? Math.min(cao, Math.max(thap, Math.round(n))) : 0;
};
const dsChu = (x: unknown): string[] => (Array.isArray(x) ? x.map(chu).filter(Boolean) : []);
const laDoiTuong = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

export function chuanHoaYTuong(x: unknown, capMacDinh: CapDo | null): YTuong {
  if (!laDoiTuong(x) || !chu(x.name).trim()) throw new Error('AI trả về idea không hợp lệ. Thử lại nhé.');
  return {
    name: chu(x.name).trim(),
    description: chu(x.description),
    difficulty: laCapDo(x.difficulty) ? x.difficulty : (capMacDinh ?? 'mid'),
    techStack: dsChu(x.techStack),
    requirements: dsChu(x.requirements),
    steps: dsChu(x.steps),
    bonusFeatures: dsChu(x.bonusFeatures),
    estimatedTime: chu(x.estimatedTime)
  };
}

const TRANG_THAI: TrangThaiCham[] = ['excellent', 'good', 'partial', 'needs_work'];
const trangThaiTheoDiem = (d: number | null): TrangThaiCham => d == null ? 'partial' : (d >= 85 ? 'excellent' : d >= 70 ? 'good' : d >= 50 ? 'partial' : 'needs_work');

function chuanHoaCauTruc(x: unknown): DanhGiaCauTruc {
  const o = laDoiTuong(x) ? x : {};
  return {
    structureScore: so(o.structureScore, 0, 100), naming: chu(o.naming), organization: chu(o.organization),
    completeness: chu(o.completeness), missingFiles: dsChu(o.missingFiles), suggestions: dsChu(o.suggestions)
  };
}

function chuanHoaModule(x: unknown): DanhGiaModule {
  const o = laDoiTuong(x) ? x : {};
  return {
    moduleId: chu(o.moduleId), moduleLabel: chu(o.moduleLabel), score: so(o.score, 0, 100),
    codeQuality: so(o.codeQuality, 0, 10), logic: so(o.logic, 0, 10), errorHandling: so(o.errorHandling, 0, 10),
    relevance: so(o.relevance, 0, 10), cohesion: so(o.cohesion, 0, 10), summary: chu(o.summary),
    fileScores: (Array.isArray(o.fileScores) ? o.fileScores : []).filter(laDoiTuong).map(f => ({ file: chu(f.file), score: so(f.score, 0, 100) })),
    issues: dsChu(o.issues), positives: dsChu(o.positives)
  };
}

export function chuanHoaKetQua(x: unknown): KetQuaCham {
  const o = laDoiTuong(x) ? x : {};
  const criteria = (Array.isArray(o.criteria) ? o.criteria : []).filter(laDoiTuong).map(c => ({ name: chu(c.name), score: so(c.score, 0, 20), comment: chu(c.comment) }));
  const coDiem = typeof o.score === 'number' || (typeof o.score === 'string' && o.score.trim() !== '' && Number.isFinite(Number(o.score)));
  const score = coDiem ? so(o.score, 0, 100) : criteria.length ? Math.min(100, criteria.reduce((s, c) => s + c.score, 0)) : null;
  return {
    score,
    status: TRANG_THAI.includes(o.status as TrangThaiCham) ? (o.status as TrangThaiCham) : trangThaiTheoDiem(score),
    summary: chu(o.summary),
    criteria,
    strengths: dsChu(o.strengths), improvements: dsChu(o.improvements), tips: dsChu(o.tips),
    perFileReviews: (Array.isArray(o.perFileReviews) ? o.perFileReviews : []).filter(laDoiTuong)
      .map(p => ({ fileName: chu(p.fileName), score: so(p.score, 0, 100), summary: chu(p.summary) })),
    moduleReviews: (Array.isArray(o.moduleReviews) ? o.moduleReviews : []).map(chuanHoaModule),
    structureReview: laDoiTuong(o.structureReview) ? chuanHoaCauTruc(o.structureReview) : null,
    localAnalysis: laDoiTuong(o.localAnalysis) ? (o.localAnalysis as unknown as PhanTichTinh) : null
  };
}

const thuan = taoDichVuDuAn({ auth: { getSession: async () => ({ data: { session: null } }) } }, { lang: 'vi' });

export const phanTichTinh = (code: string, tenTep: string): KetQuaTep => thuan.localAnalyze(code, tenTep);
export const phanTichTatCa = (files: TepDuAn[]): PhanTichTinh => thuan.localAnalyzeAll(files);
export const nhomModule = (files: TepDuAn[]): ModuleDuAn[] => thuan.groupFilesIntoModules(files);
export const catGonCode = (code: string, soDong = 300): string => thuan.smartTruncateCode(code, soDong);

export function taoBanNop(p: { review: KetQuaCham; idea: YTuong; files: TepDuAn[]; difficulty?: string | null; topic?: string | null }): BanNop {
  return thuan.buildSubmission(p.review.score == null ? { ...p, review: { ...p.review, score: undefined as unknown as number } } : p);
}

export function nguCanhDuAn(idea: YTuong, files: TepDuAn[]): string {
  const codeContext = files
    .filter(f => f.code.trim())
    .map(f => {
      let code = f.code;
      if (code.length > 8000) {
        const half = 3800;
        code = code.slice(0, half) + '\n\n// ... (middle section omitted for brevity) ...\n\n' + code.slice(-half);
      }
      return `\n--- File: ${f.name} (${f.lang}, ${f.code.split('\n').length} lines) ---\n${code}`;
    }).join('\n');
  return `Project: ${idea.name}\nMô tả: ${idea.description}\nYêu cầu: ${(idea.requirements || []).join(', ')}${codeContext ? '\n\n📁 Code hiện tại của học viên:' + codeContext : ''}`;
}

export async function taoYTuong(client: SupabaseLike, { level, topic, ngauNhien, ...tc }: TuyChonGoi & {
  level: CapDo | null; topic: string | null; ngauNhien?: () => number;
}): Promise<YTuong> {
  const dv = taoDichVuDuAn(client, { ...tc, ngauNhien });
  return chuanHoaYTuong(await dv.generateProjectIdea(level, topic || null), level);
}

export async function hoiMentor(client: SupabaseLike, { nguCanh, lichSu, cauHoi, ...tc }: TuyChonGoi & {
  nguCanh: string; lichSu: TinNhan[]; cauHoi: string;
}): Promise<string> {
  return taoDichVuDuAn(client, tc).chatAboutProject(nguCanh, lichSu, cauHoi);
}

const thongBao = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function chamDuAn(client: SupabaseLike, { idea, files, khiTienDo, ...tc }: TuyChonGoi & {
  idea: YTuong; files: TepDuAn[]; khiTienDo?: (b: TienDoCham) => void;
}): Promise<KetQuaCham> {
  const dv = taoDichVuDuAn(client, tc);
  const codeFiles = files.filter(f => f.code.trim());
  if (codeFiles.length === 0) throw new Error('Không có file code nào để chấm');
  const dungNeuHuy = () => { if (tc.signal?.aborted) throw new DOMException('Đã hủy', 'AbortError'); };

  khiTienDo?.({ buoc: 'tinh' });
  const localResults = dv.localAnalyzeAll(files);

  khiTienDo?.({ buoc: 'cauTruc' });
  let structureReview: DanhGiaCauTruc;
  try {
    structureReview = chuanHoaCauTruc(await dv.reviewStructure(codeFiles, idea));
  } catch (err) {
    dungNeuHuy();
    structureReview = { structureScore: 0, naming: 'Lỗi', organization: 'Lỗi', completeness: 'Lỗi', missingFiles: [], suggestions: [`Lỗi: ${thongBao(err)}`] };
  }
  dungNeuHuy();

  const modules: ModuleDuAn[] = dv.groupFilesIntoModules(codeFiles);
  const moduleReviews: DanhGiaModule[] = [];
  for (let i = 0; i < modules.length; i++) {
    khiTienDo?.({ buoc: 'module', i: i + 1, n: modules.length, nhan: modules[i].label });
    try {
      moduleReviews.push(chuanHoaModule(await dv.reviewModule(modules[i], idea, localResults)));
    } catch (err) {
      dungNeuHuy();
      moduleReviews.push({
        moduleId: modules[i].id, moduleLabel: modules[i].label,
        score: 0, codeQuality: 0, logic: 0, errorHandling: 0, relevance: 0, cohesion: 0,
        summary: `Lỗi khi chấm module: ${thongBao(err)}`,
        fileScores: modules[i].files.map(f => ({ file: f.name, score: 0 })),
        issues: ['Không thể đánh giá'],
        positives: []
      });
    }
    dungNeuHuy();
  }

  khiTienDo?.({ buoc: 'tongHop' });
  const tong = await dv.synthesizeReview(structureReview, moduleReviews, localResults, idea, files.length);
  const perFileReviews = moduleReviews.flatMap(m => m.fileScores.map(fs => ({ fileName: fs.file, score: fs.score, summary: m.summary })));
  return chuanHoaKetQua({ ...(laDoiTuong(tong) ? tong : {}), perFileReviews, moduleReviews, structureReview, localAnalysis: localResults });
}
