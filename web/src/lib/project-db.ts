// Supabase cho Project Lab (bang saved_ideas, project_submissions) — cot giong auth-service.js cu.
// Khac ban cu: loi ghi/doc duoc nem ra de giao dien bao, khong nuot im lang.
import type { SupabaseLike } from './auth';
import { chuanHoaYTuong, laCapDo, type BanNop, type CapDo, type TepDuAn, type YTuong } from './project-ai';

export type YTuongDaLuu = {
  id: string; idea: YTuong; savedAt: string;
  /** Tao tu trang theo chu de hay theo cap do (mo lai dung trang do) */
  source: 'topic' | 'level'; topic: string | null; level: CapDo | null;
};

export type BaiNop = {
  id: string; project_name: string; project_description: string; difficulty_level: string; topic: string;
  files: TepDuAn[]; submitted_at: string;
  score_overall: number | null; score_code_quality: number | null; score_functionality: number | null;
  score_best_practices: number | null; score_creativity: number | null;
  ai_feedback: string; ai_strengths: string[]; ai_improvements: string[]; languages_used: string[];
};

type Dong = Record<string, unknown>;
const chu = (x: unknown) => (typeof x === 'string' ? x : typeof x === 'number' ? String(x) : '');
const dsChu = (x: unknown) => (Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string') : []);
const soHoacNull = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : null);

function nemNeuLoi(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function sangYTuong(d: Dong): YTuongDaLuu | null {
  let idea: YTuong;
  try { idea = chuanHoaYTuong(d.idea, laCapDo(d.level) ? d.level : null); } catch { return null; }
  return {
    id: chu(d.id),
    idea,
    savedAt: chu(d.saved_at ?? d.savedAt),
    source: d.source === 'topic' ? 'topic' : 'level',
    topic: typeof d.topic === 'string' && d.topic ? d.topic : null,
    level: laCapDo(d.level) ? d.level : null
  };
}

export async function taiYTuong(client: SupabaseLike, uid: string): Promise<YTuongDaLuu[]> {
  const { data, error } = await client.from('saved_ideas').select('*').eq('user_id', uid).order('saved_at', { ascending: false });
  nemNeuLoi(error);
  return ((data as Dong[] | null) ?? []).map(sangYTuong).filter((x): x is YTuongDaLuu => !!x);
}

export async function luuYTuong(client: SupabaseLike, uid: string, yt: YTuongDaLuu): Promise<void> {
  const { error } = await client.from('saved_ideas').upsert({
    id: yt.id, user_id: uid, idea: yt.idea, source: yt.source, topic: yt.topic, level: yt.level, saved_at: yt.savedAt
  });
  nemNeuLoi(error);
}

export async function xoaYTuong(client: SupabaseLike, uid: string, id: string): Promise<void> {
  const { error } = await client.from('saved_ideas').delete().eq('id', id).eq('user_id', uid);
  nemNeuLoi(error);
}

export async function luuBaiNop(client: SupabaseLike, uid: string, b: BanNop): Promise<void> {
  const { error } = await client.from('project_submissions').insert({
    user_id: uid,
    project_name: b.projectName,
    project_description: b.projectDescription,
    difficulty_level: b.difficultyLevel,
    topic: b.topic,
    files: b.files,
    review: b.review,
    score_overall: b.scoreOverall,
    score_code_quality: b.scoreCodeQuality,
    score_functionality: b.scoreFunctionality,
    score_best_practices: b.scoreBestPractices,
    score_creativity: b.scoreCreativity,
    ai_feedback: b.aiFeedback,
    ai_strengths: b.aiStrengths || [],
    ai_improvements: b.aiImprovements || [],
    languages_used: b.languagesUsed || []
  }).select().single();
  nemNeuLoi(error);
}

function sangBaiNop(d: Dong): BaiNop {
  const files = (Array.isArray(d.files) ? d.files : [])
    .filter((f): f is Dong => !!f && typeof f === 'object')
    .map(f => ({ name: chu(f.name), lang: chu(f.lang), code: chu(f.code) }));
  return {
    id: chu(d.id),
    project_name: chu(d.project_name),
    project_description: chu(d.project_description),
    difficulty_level: chu(d.difficulty_level),
    topic: chu(d.topic),
    files,
    submitted_at: chu(d.submitted_at),
    score_overall: soHoacNull(d.score_overall),
    score_code_quality: soHoacNull(d.score_code_quality),
    score_functionality: soHoacNull(d.score_functionality),
    score_best_practices: soHoacNull(d.score_best_practices),
    score_creativity: soHoacNull(d.score_creativity),
    ai_feedback: chu(d.ai_feedback),
    ai_strengths: dsChu(d.ai_strengths),
    ai_improvements: dsChu(d.ai_improvements),
    languages_used: dsChu(d.languages_used)
  };
}

export async function taiBaiNop(client: SupabaseLike, uid: string): Promise<BaiNop[]> {
  const { data, error } = await client.from('project_submissions').select('*').eq('user_id', uid).order('submitted_at', { ascending: false });
  nemNeuLoi(error);
  return ((data as Dong[] | null) ?? []).map(sangBaiNop);
}
