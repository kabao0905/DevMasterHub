// Career Advisor: bat y dinh tim viec, cham do phu hop viec lam, Supabase.
import { giaSupabase } from '@/test/gia-supabase';
import { taoCoVan, type ThongKe } from './career';
import { luuChat, taiChat, taiThongKe } from './career-db';

const t = (k: string) => k;
const thongKe = (tongBai = 0, kyNang: string[] = []): ThongKe => ({
  totalLessonsCompleted: tongBai, totalTimeHours: 0,
  techBreakdown: kyNang.map(tech => ({ tech, completed: 1, highestLevel: 'newbie' })),
  projects: [], averageProjectScore: null
});
const client = giaSupabase({ nguoiDung: { id: 'u1' } }).client;

type Goi = { url: string; body?: Record<string, unknown>; headers?: Record<string, string> };
function giaFetch(traAi: string, jobs: unknown[] = []) {
  const goi: Goi[] = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    goi.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined, headers: init?.headers as Record<string, string> });
    if (url === '/api/ai') return new Response(JSON.stringify({ content: [{ text: traAi }] }), { status: 200 });
    if (url === '/api/crawl') return new Response(JSON.stringify({ url: 'https://x.vn/job', pageTitle: 'Tuyển React', content: 'Mô tả' }), { status: 200 });
    return new Response(JSON.stringify({ jobs }), { status: 200 });
  }));
  return goi;
}
afterEach(() => vi.unstubAllGlobals());

test('nguoi moi chua hoc bai nao van nhan duoc danh sach viec lam', async () => {
  giaFetch('', [{ title: 'Senior Java Developer', tags: ['java'], description_snippet: 'spring' }]);
  const ds = await taoCoVan(client, { t, lang: 'vi', thongKe: thongKe() }).timViec('java');
  expect(ds).toHaveLength(1);
  expect(ds[0].status).toBe('target');
});

test('tin nhan tim viec o "đà nẵng" gan dung dia diem vao tu khoa tim kiem', async () => {
  const goi = giaFetch('Bạn nên học thêm.');
  const kq = await taoCoVan(client, { t, lang: 'vi', thongKe: thongKe() }).gui([], 'tìm việc react ở đà nẵng');
  const tim = goi.filter(g => g.url.startsWith('/api/jobs'));
  expect(tim).toHaveLength(1);
  expect(new URL(tim[0].url, 'http://x').searchParams.get('search')).toMatch(/Đà Nẵng$/);
  expect(kq?.text).toBe('Bạn nên học thêm.');
});

test('mot viec khong khop ky nang khong lam mat ca danh sach; xep theo do phu hop', async () => {
  giaFetch('', [{ title: 'Golang Engineer', tags: ['go'], description_snippet: 'kubernetes' }, { title: 'Python Intern', tags: ['python'], description_snippet: '' }]);
  const ds = await taoCoVan(client, { t, lang: 'vi', thongKe: thongKe(20, ['python']) }).timViec('developer');
  expect(ds.map(j => j.title)).toEqual(['Python Intern', 'Golang Engineer']);
  expect(ds[0].matchRate).toBeGreaterThan(ds[1].matchRate);
});

test('AI bao [SEARCH_JOBS: ...]: bo the khoi cau tra loi, tim theo tu khoa, bo dia diem nguoi hoc khong hoi', async () => {
  const goi = giaFetch('[SEARCH_JOBS: React Developer TP.HCM]\nBạn hợp vị trí intern.', [{ title: 'React Intern', url: 'javascript:alert(1)', company_logo: 'https://cdn.x/logo.png', tags: ['react'] }]);
  const kq = await taoCoVan(client, { t, lang: 'vi', thongKe: thongKe(3, ['react']) }).gui([], 'mình nên làm gì?');
  expect(kq?.text).toBe('Bạn hợp vị trí intern.');
  expect(kq?.searchKeyword).toBe('React Developer');
  expect(new URL(goi.find(g => g.url.startsWith('/api/jobs'))!.url, 'http://x').searchParams.get('search')).toBe('React Developer');
  // Link viec lam chi http/https
  expect(kq?.jobs?.[0].url).toBe('#');
  expect(kq?.jobs?.[0].company_logo).toBe('https://cdn.x/logo.png');
});

test('tin nhan co link: cao link qua /api/crawl kem token, noi dung vao prompt; lich su gui toi da 8 tin, tin AI dai bi cat', async () => {
  const goi = giaFetch('Nên ứng tuyển.');
  const dai = 'x'.repeat(400);
  const lichSu = Array.from({ length: 10 }, (_, i) => ({ role: (i % 2 ? 'assistant' : 'user') as 'user' | 'assistant', content: i % 2 ? dai : `hỏi ${i}` }));
  await taoCoVan(client, { t, lang: 'vi', thongKe: thongKe() }).gui(lichSu, 'xem https://x.vn/job giúp');
  expect(goi[0].url).toBe('/api/crawl');
  const ai = goi.find(g => g.url === '/api/ai')!.body!;
  expect(ai.system).toContain('Tiêu đề: Tuyển React');
  const msgs = ai.messages as { role: string; content: string }[];
  expect(msgs).toHaveLength(9);
  expect(msgs.find(m => m.role === 'assistant')!.content).toHaveLength(253);
});

test('huy giua chung (sua cau hoi, xoa chat): tra null, khong tim viec', async () => {
  let tha!: () => void;
  vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) => new Promise<Response>((ok, loi) => {
    // Nhu fetch that: signal da huy san thi tu choi ngay
    if (init?.signal?.aborted) return loi(new DOMException('huy', 'AbortError'));
    init?.signal?.addEventListener('abort', () => loi(new DOMException('huy', 'AbortError')));
    tha = () => ok(new Response(JSON.stringify({ content: [{ text: 'muộn' }] }), { status: 200 }));
    void url;
  })));
  const cv = taoCoVan(client, { t, lang: 'vi', thongKe: thongKe() });
  const p = cv.gui([], 'chào');
  await Promise.resolve();
  cv.huy();
  tha?.();
  expect(await p).toBeNull();
});

// ── Supabase ──

test('thong ke hoc vien: bai da xong theo cong nghe, gio hoc, du an va diem trung binh', async () => {
  const g = giaSupabase({ nguoiDung: { id: 'u1' }, bang: {
    lesson_progress: [
      { tech_id: 'python', level_id: 'newbie', lesson_id: 'a', completed: true },
      { tech_id: 'python', level_id: 'junior', lesson_id: 'b', completed: true },
      { tech_id: 'react', level_id: 'newbie', lesson_id: 'c', completed: false }
    ],
    learning_sessions: [{ tech_id: 'python', duration_seconds: 5400 }],
    project_submissions: [{ project_name: 'A', score_overall: 80 }, { project_name: 'B', score_overall: 61 }]
  } });
  const tk = await taiThongKe(g.client, 'u1');
  expect(tk).toMatchObject({ totalLessonsCompleted: 2, totalTimeHours: 1.5, averageProjectScore: 71 });
  expect(tk.techBreakdown).toEqual([{ tech: 'python', completed: 2, highestLevel: 'junior' }]);
  expect(tk.projects).toHaveLength(2);
});

test('lich su chat: doc ban moi nhat, luu upsert theo user_id; dong hong thi bo', async () => {
  const g = giaSupabase({ nguoiDung: { id: 'u1' }, bang: { career_chats: [{ messages: [{ role: 'user', content: 'Hi' }, { role: 'x', content: 1 }, { role: 'assistant', content: 'Chào' }] }] } });
  expect(await taiChat(g.client, 'u1')).toEqual([{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Chào' }]);
  await luuChat(g.client, 'u1', [{ role: 'user', content: 'Hỏi' }]);
  const ghi = g.truyVan.find(q => q.op === 'upsert')!;
  expect(ghi.bang).toBe('career_chats');
  expect(ghi.payload).toMatchObject({ user_id: 'u1', messages: [{ role: 'user', content: 'Hỏi' }] });
  expect(ghi.tuyChon).toEqual({ onConflict: 'user_id' });
});
