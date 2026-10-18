import type { SupabaseLike } from './auth';
import type { TinNhan } from './ai';
import type { DuAnTomTat, ThongKe } from './career';

type Dong = Record<string, unknown>;

function capCaoNhat(caps: string[]): string {
  for (const c of ['master', 'senior', 'mid', 'junior', 'newbie']) if (caps.includes(c)) return c;
  return caps[0] || 'newbie';
}

export async function taiThongKe(client: SupabaseLike, uid: string): Promise<ThongKe> {
  const [tienDo, phien, duAn] = await Promise.all([
    client.from('lesson_progress').select('tech_id, level_id, lesson_id, completed, time_spent_seconds').eq('user_id', uid),
    client.from('learning_sessions').select('tech_id, duration_seconds').eq('user_id', uid),
    client.from('project_submissions')
      .select('project_name, project_description, difficulty_level, topic, score_overall, score_code_quality, score_functionality, score_best_practices, score_creativity, ai_feedback, ai_strengths, ai_improvements, languages_used, submitted_at')
      .eq('user_id', uid).order('submitted_at', { ascending: false })
  ]);
  const daXong = ((tienDo.data as Dong[] | null) ?? []).filter(p => p.completed);
  const theoCongNghe = new Map<string, { completed: number; caps: Set<string> }>();
  for (const p of daXong) {
    const id = String(p.tech_id);
    const muc = theoCongNghe.get(id) ?? { completed: 0, caps: new Set<string>() };
    muc.completed++;
    muc.caps.add(String(p.level_id));
    theoCongNghe.set(id, muc);
  }
  const giay = ((phien.data as Dong[] | null) ?? []).reduce((s, x) => s + (Number(x.duration_seconds) || 0), 0);
  const projects = ((duAn.data as DuAnTomTat[] | null) ?? []);
  return {
    totalLessonsCompleted: daXong.length,
    totalTimeHours: Math.round(giay / 3600 * 10) / 10,
    techBreakdown: [...theoCongNghe].map(([tech, m]) => ({ tech, completed: m.completed, highestLevel: capCaoNhat([...m.caps]) })),
    projects,
    averageProjectScore: projects.length > 0 ? Math.round(projects.reduce((s, p) => s + (p.score_overall || 0), 0) / projects.length) : null
  };
}

export async function taiChat(client: SupabaseLike, uid: string): Promise<TinNhan[]> {
  const { data, error } = await client.from('career_chats').select('messages').eq('user_id', uid)
    .order('updated_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  const ds = (data as { messages?: unknown } | null)?.messages;
  return (Array.isArray(ds) ? ds : []).filter((m): m is TinNhan =>
    !!m && typeof m === 'object' && ((m as Dong).role === 'user' || (m as Dong).role === 'assistant') && typeof (m as Dong).content === 'string');
}

export async function luuChat(client: SupabaseLike, uid: string, messages: TinNhan[]): Promise<void> {
  const { error } = await client.from('career_chats').upsert({ user_id: uid, messages, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
}
