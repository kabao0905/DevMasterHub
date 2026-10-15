import { docThan } from '@/test/doc-than';
// Project Lab: hub, theo cap do, theo chu de — tao idea, luu idea, chat mentor, soan file, cham project.
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';

type ThanAi = { system: string; messages: { role: string; content: string }[]; taskType: string };
const traText = (text: string) => new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { status: 200 });

const IDEA = { name: 'Rắn săn mồi', description: 'Game rắn trên Canvas', difficulty: 'mid', techStack: ['JavaScript', 'Canvas'], requirements: ['Điều khiển bằng phím'], steps: ['Vẽ lưới'], bonusFeatures: ['Bảng xếp hạng'], estimatedTime: '6-10 giờ' };
const REVIEW = {
  score: 78, status: 'good', summary: 'Code gọn, thiếu xử lý lỗi.',
  criteria: [{ name: 'Cấu trúc project', score: 14, comment: 'Ổn' }, { name: 'Code quality', score: 16, comment: 'Gọn' }],
  strengths: ['Đặt tên rõ ràng'], improvements: ['Thêm try/catch'], tips: ['Viết test']
};
/** AI gia: tra loi theo loai viec */
function aiMacDinh(b: ThanAi): Response | Promise<Response> {
  if (b.taskType === 'projectIdea') return traText(JSON.stringify(IDEA));
  if (b.taskType === 'projectChat') return traText('Dùng **requestAnimationFrame**');
  if (/CẤU TRÚC project/.test(b.system)) return traText(JSON.stringify({ structureScore: 70, naming: 'Ổn', organization: 'Gọn', completeness: 'Đủ', missingFiles: ['README.md'], suggestions: [] }));
  if (/MODULE/.test(b.system)) return traText(JSON.stringify({ moduleId: 'logic', moduleLabel: '⚙️ Logic', score: 80, codeQuality: 8, logic: 8, errorHandling: 6, relevance: 9, summary: 'Logic ổn', fileScores: [{ file: 'main.js', score: 81 }], issues: ['Thiếu test'], positives: ['Rõ ràng'] }));
  return traText(JSON.stringify(REVIEW));
}

function mo(duongDan: string, { ai = aiMacDinh, aiEnabled = true, bang = {} }: {
  ai?: (b: ThanAi) => Response | Promise<Response>; aiEnabled?: boolean; bang?: Record<string, unknown[]>;
} = {}) {
  const goiAi: ThanAi[] = [];
  const gia = giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }], ...bang } });
  const json: Record<string, unknown> = { '/api/health': { aiEnabled }, '/curriculum/index.json': [] };
  const kq = veApp(duongDan, {
    gia, json,
    fetch: async (url: string, init?: RequestInit) => {
      if (url === '/api/ai') {
        const b = docThan(init?.body) as ThanAi;
        goiAi.push(b);
        return ai(b);
      }
      return Object.hasOwn(json, url) ? new Response(JSON.stringify(json[url]), { status: 200 }) : new Response('null', { status: 404 });
    }
  });
  return { ...kq, gia, goiAi };
}

beforeAll(async () => { await import('./ProjectLevelPage'); await import('./ProjectTopicPage'); }, 30000);
beforeEach(() => { window.scrollTo = vi.fn() as unknown as typeof window.scrollTo; });
afterEach(() => vi.unstubAllGlobals());

const IDEA_DA_LUU = (id: string, ten: string) => ({ id, user_id: 'u1', idea: { ...IDEA, name: ten }, source: 'level', level: 'mid', topic: null, saved_at: '2026-10-11T08:30:00Z' });

test('hub: 3 loi vao va so idea da luu', async () => {
  mo('/project', { bang: { saved_ideas: [IDEA_DA_LUU('a', 'A'), IDEA_DA_LUU('b', 'B')] } });
  expect(await screen.findByRole('heading', { level: 1, name: /Project Lab/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Theo Cấp Độ/ })).toHaveAttribute('href', '/project-level');
  expect(screen.getByRole('link', { name: /Theo Chủ Đề/ })).toHaveAttribute('href', '/project-topic');
  const daLuu = screen.getByRole('link', { name: /Idea Đã Lưu/ });
  expect(daLuu).toHaveAttribute('href', '/saved-ideas');
  await waitFor(() => expect(daLuu.textContent).toMatch(/Bạn có 2 idea đã lưu/));
});

test('theo cap do: chon cap, tao idea, luu (trung thi bao), doi cap thi bat dau lai', async () => {
  const u = userEvent.setup();
  const { goiAi, gia } = mo('/project-level');
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  expect(screen.getByRole('button', { name: /Mid/ })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('Sẵn sàng!')).toBeInTheDocument();
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  expect(await screen.findByRole('heading', { name: 'Rắn săn mồi' })).toBeInTheDocument();
  expect(goiAi[0].taskType).toBe('projectIdea');
  expect(goiAi[0].messages[0].content).toContain('DIFFICULTY LEVEL: mid');
  expect(screen.getByText('Điều khiển bằng phím')).toBeInTheDocument();

  await u.click(screen.getByRole('button', { name: /Lưu Idea/ }));
  await waitFor(() => expect(gia.truyVan.some(q => q.bang === 'saved_ideas' && q.op === 'upsert')).toBe(true));
  const dong = gia.truyVan.find(q => q.op === 'upsert')!.payload as Record<string, unknown>;
  expect(dong).toMatchObject({ user_id: 'u1', source: 'level', level: 'mid', topic: null });
  await u.click(screen.getByRole('button', { name: /Lưu Idea|Đã lưu/ }));
  expect(await screen.findByText(/Idea này đã được lưu trước đó rồi/)).toBeInTheDocument();

  await u.click(screen.getByRole('button', { name: /Senior/ }));
  expect(screen.queryByRole('heading', { name: 'Rắn săn mồi' })).not.toBeInTheDocument();
});

test('theo chu de: Enter de tao, goi y dien san, chon cap; noi dung AI hien nhu chu (khong chen HTML)', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/project-topic', { ai: b => (b.taskType === 'projectIdea' ? traText(JSON.stringify({ ...IDEA, name: '<img src=x onerror=alert(1)>' })) : aiMacDinh(b)) });
  const o = await screen.findByRole('textbox', { name: /chủ đề/i });
  await u.click(screen.getByRole('button', { name: /Game/ }));
  expect(o).toHaveValue('Game');
  await u.click(screen.getByRole('button', { name: /Junior/ }));
  await u.clear(o);
  await u.type(o, 'Blog cá nhân{Enter}');
  expect(await screen.findByRole('heading', { name: '<img src=x onerror=alert(1)>' })).toBeInTheDocument();
  expect(document.querySelector('img[src="x"]')).toBeNull();
  expect(goiAi[0].messages[0].content).toContain('TOPIC (MANDATORY): "Blog cá nhân"');
  expect(goiAi[0].messages[0].content).toContain('DIFFICULTY LEVEL: junior');
});

test('chat mentor gui kem code dang soan; tra loi hien markdown', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/project-level');
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await screen.findByRole('heading', { name: 'Rắn săn mồi' });
  await u.click(screen.getByRole('textbox', { name: 'Code của main.js' }));
  await u.paste('const ran = [];');
  const chat = screen.getByRole('region', { name: /Chat với AI Mentor/ });
  await u.type(within(chat).getByRole('textbox'), 'Vẽ rắn sao?{Enter}');
  expect(await within(chat).findByText('requestAnimationFrame', { selector: 'strong' })).toBeInTheDocument();
  const hoi = goiAi.find(b => b.taskType === 'projectChat')!;
  expect(hoi.system).toContain('--- File: main.js (javascript, 1 lines) ---');
  expect(hoi.messages[0].content).toBe('Vẽ rắn sao?');
});

test('xoa tat ca file hoi bang hop trong app; Huy thi giu nguyen', async () => {
  const u = userEvent.setup();
  vi.stubGlobal('confirm', () => false);
  mo('/project-level');
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await screen.findByRole('heading', { name: 'Rắn săn mồi' });
  await u.click(screen.getByRole('textbox', { name: 'Code của main.js' }));
  await u.paste('let x = 1;');
  await u.click(screen.getByRole('button', { name: /Xóa tất cả/ }));
  await u.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Hủy' }));
  expect(screen.getByRole('textbox', { name: 'Code của main.js' })).toHaveValue('let x = 1;');
  await u.click(screen.getByRole('button', { name: /Xóa tất cả/ }));
  await u.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Đồng ý' }));
  expect(screen.getByRole('textbox', { name: 'Code của main.js' })).toHaveValue('');
});

test('soan nhieu file: them, doi ten theo duoi doi ngon ngu, xoa', async () => {
  const u = userEvent.setup();
  mo('/project-level');
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await screen.findByRole('heading', { name: 'Rắn săn mồi' });
  await u.click(screen.getByRole('button', { name: 'Thêm file' }));
  expect(screen.getByRole('tab', { name: /file2\.js/, selected: true })).toBeInTheDocument();
  const ten = screen.getByRole('textbox', { name: 'Tên file' });
  await u.clear(ten);
  await u.type(ten, 'style.css{Enter}');
  expect(screen.getByRole('tab', { name: /style\.css/ })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: 'Ngôn ngữ của file' })).toHaveValue('css');
  await u.click(screen.getByRole('button', { name: 'Xóa file style.css' }));
  expect(screen.queryByRole('tab', { name: /style\.css/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Xóa file main\.js/ })).not.toBeInTheDocument(); // con 1 file thi khong xoa duoc
});

test('cham project: bao tien do, hien ket qua tung tang, luu vao project_submissions', async () => {
  const u = userEvent.setup();
  let tha!: () => void;
  const { gia } = mo('/project-level', {
    ai: b => (/Tổng hợp/.test(b.system) ? new Promise(r => { tha = () => r(aiMacDinh(b) as Response); }) : aiMacDinh(b))
  });
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await screen.findByRole('heading', { name: 'Rắn săn mồi' });
  await u.click(screen.getByRole('textbox', { name: 'Code của main.js' }));
  await u.paste('var diem = 0;');
  await u.click(screen.getByRole('button', { name: /AI chấm toàn diện project \(1 file\)/ }));
  expect(await screen.findByText(/Tổng hợp đánh giá cuối cùng/)).toBeInTheDocument();
  await act(async () => { tha(); });
  expect(await screen.findByRole('heading', { name: /Tốt! — 78\/100/ })).toBeInTheDocument();
  expect(screen.getByText('Code gọn, thiếu xử lý lỗi.')).toBeInTheDocument();
  expect(screen.getByText('README.md', { exact: false })).toBeInTheDocument();
  expect(screen.getByText(/Dùng "var"/)).toBeInTheDocument(); // phan tich tinh
  expect(screen.getByText('Viết test')).toBeInTheDocument();
  await waitFor(() => expect(gia.truyVan.some(q => q.bang === 'project_submissions' && q.op === 'insert')).toBe(true));
  const dong = gia.truyVan.find(q => q.bang === 'project_submissions')!.payload as Record<string, unknown>;
  expect(dong).toMatchObject({ user_id: 'u1', project_name: 'Rắn săn mồi', difficulty_level: 'mid', score_overall: 78 });
  expect(await screen.findByText('Đã lưu vào Dự án của tôi')).toBeInTheDocument();
});

test('AI tat: khong co nut tao idea; loi AI thi bao kem Thu lai', async () => {
  const u = userEvent.setup();
  const a = mo('/project-level', { aiEnabled: false });
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  expect(await screen.findByText(/Tính năng AI đang tắt/)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Tạo Idea/ })).not.toBeInTheDocument();
  a.unmount();

  let lan = 0;
  mo('/project-level', { ai: b => (lan++ === 0 ? new Response('{"error":"AI bận"}', { status: 500 }) : aiMacDinh(b)) });
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  expect(await screen.findByText(/Không tạo được idea: AI bận/)).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Thử lại' }));
  expect(await screen.findByRole('heading', { name: 'Rắn săn mồi' })).toBeInTheDocument();
});

test('roi trang roi quay lai: idea, code va chat van con', async () => {
  const u = userEvent.setup();
  const { router } = mo('/project-level');
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await screen.findByRole('heading', { name: 'Rắn săn mồi' });
  await u.click(screen.getByRole('textbox', { name: 'Code của main.js' }));
  await u.paste('let x = 1;');
  await act(() => router.navigate('/project'));
  await screen.findByRole('heading', { level: 1, name: /Project Lab/ });
  await act(() => router.navigate('/project-level'));
  expect(await screen.findByRole('heading', { name: 'Rắn săn mồi' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Code của main.js' })).toHaveValue('let x = 1;');
});

// ── Idea da luu ──

test('idea da luu: ngay gio, nguon, xoa co xac nhan, Bat dau lam mo dung trang voi idea', async () => {
  const u = userEvent.setup();
  const ideas = [
    { id: 'a', user_id: 'u1', idea: { ...IDEA, name: 'Blog cá nhân', techStack: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] }, source: 'topic', topic: 'Blog', level: null, saved_at: '2026-10-11T08:30:00Z' },
    { id: 'b', user_id: 'u1', idea: { ...IDEA, name: 'Máy tính' }, source: 'level', level: 'senior', topic: null, saved_at: '2026-10-10T01:00:00Z' }
  ];
  const { gia } = mo('/saved-ideas', { bang: { saved_ideas: ideas } });
  const theBlog = (await screen.findByRole('heading', { name: 'Blog cá nhân' })).closest('article')!;
  expect(within(theBlog).getByText(/📝 Blog/)).toBeInTheDocument();
  expect(within(theBlog).getByText('+2')).toBeInTheDocument();
  expect(theBlog.textContent).toMatch(/11\/10\/2026/);
  const theMay = screen.getByRole('heading', { name: 'Máy tính' }).closest('article')!;
  expect(within(theMay).getByText(/📊 senior/)).toBeInTheDocument();

  vi.stubGlobal('confirm', () => false);
  await u.click(within(theMay).getByRole('button', { name: 'Xóa idea Máy tính' }));
  await u.click(within(await screen.findByRole('dialog', { name: 'Xóa idea này?' })).getByRole('button', { name: 'Hủy' }));
  expect(screen.getByRole('heading', { name: 'Máy tính' })).toBeInTheDocument();
  await u.click(within(theMay).getByRole('button', { name: 'Xóa idea Máy tính' }));
  await u.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Đồng ý' }));
  expect(screen.queryByRole('heading', { name: 'Máy tính' })).not.toBeInTheDocument();
  await waitFor(() => expect(gia.truyVan.some(q => q.bang === 'saved_ideas' && q.op === 'delete')).toBe(true));

  await u.click(within(theBlog).getByRole('button', { name: /Bắt đầu làm/ }));
  expect(await screen.findByRole('heading', { level: 1, name: /Project theo Chủ Đề/ })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Blog cá nhân' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /chủ đề/i })).toHaveValue('Blog');
});

test('idea da luu: rong thi moi tao theo chu de; xoa loi thi tra lai va bao', async () => {
  const u = userEvent.setup();
  const a = mo('/saved-ideas');
  expect(await screen.findByText('Chưa có idea nào được lưu.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Tạo Idea theo chủ đề/ })).toHaveAttribute('href', '/project-topic');
  a.unmount();

  const gia = giaSupabase({ nguoiDung: { id: 'u1' }, loiGhi: { saved_ideas: 'mất mạng' }, bang: { profiles: [{ id: 'u1', username: 'an' }], saved_ideas: [IDEA_DA_LUU('a', 'Snake')] } });
  veApp('/saved-ideas', { gia, json: { '/api/health': { aiEnabled: true }, '/curriculum/index.json': [] } });
  await u.click(await screen.findByRole('button', { name: 'Xóa idea Snake' }));
  await u.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Đồng ý' }));
  expect(await screen.findByText(/Không xóa được idea: mất mạng/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Snake' })).toBeInTheDocument();
});

// ── My Projects ──

const BAI_NOP = {
  id: 7, user_id: 'u1', project_name: '<img src=x onerror=alert(1)>Todo', project_description: 'Quản lý việc', difficulty_level: 'mid', topic: 'web',
  files: [{ name: 'app.js', lang: 'javascript', code: 'const a = 1;' }], score_overall: 78, score_code_quality: 80, score_functionality: 75,
  score_best_practices: 60, score_creativity: 55, ai_feedback: 'Code **gọn**', ai_strengths: ['Đặt tên rõ'], ai_improvements: ['Thêm test'],
  languages_used: ['javascript', 'html'], submitted_at: '2026-10-11T08:00:00Z'
};

test('my projects: danh sach (HTML hien nhu chu), chi tai mot lan, mo chi tiet co diem va code', async () => {
  const u = userEvent.setup();
  const { gia } = mo('/my-projects', { bang: { project_submissions: [BAI_NOP] } });
  const the = await screen.findByRole('link', { name: /Todo/ });
  expect(the).toHaveAttribute('href', '/my-projects/7');
  expect(the.textContent).toContain('<img src=x onerror=alert(1)>Todo');
  expect(document.querySelector('img[src="x"]')).toBeNull();
  expect(the.textContent).toMatch(/78/);
  expect(the.textContent).toMatch(/javascript, html/);
  await new Promise(r => setTimeout(r, 50));
  expect(gia.truyVan.filter(q => q.bang === 'project_submissions')).toHaveLength(1);

  await u.click(the);
  expect(await screen.findByRole('heading', { level: 1, name: /Todo/ })).toBeInTheDocument();
  const diem = screen.getByRole('list', { name: /điểm/i });
  expect(within(diem).getByText('Chất lượng code').parentElement!.textContent).toMatch(/80/);
  expect(screen.getByText('gọn', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.getByText('Đặt tên rõ')).toBeInTheDocument();
  expect(screen.getByText('app.js')).toBeInTheDocument();
});

test('my projects: rong, loi tai co Thu lai, id la thi bao khong tim thay', async () => {
  const a = mo('/my-projects');
  expect(await screen.findByText(/Chưa có project nào được nộp/)).toBeInTheDocument();
  a.unmount();
  const b = mo('/my-projects/999', { bang: { project_submissions: [BAI_NOP] } });
  expect(await screen.findByText('Không tìm thấy project này')).toBeInTheDocument();
  b.unmount();
  const gia = giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an' }] } });
  gia.client.from = vi.fn((bang: string) => {
    if (bang !== 'project_submissions') return giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an' }] } }).client.from(bang);
    const loi = { select: () => loi, eq: () => loi, order: () => Promise.resolve({ data: null, error: { message: 'down' } }) };
    return loi;
  }) as unknown as typeof gia.client.from;
  veApp('/my-projects', { gia, json: { '/api/health': { aiEnabled: true }, '/curriculum/index.json': [] } });
  expect(await screen.findByRole('button', { name: 'Thử lại' })).toBeInTheDocument();
});

test('thanh ben: Project Lab va Du an cua toi la link trong app, danh dau trang dang mo', async () => {
  mo('/project-level/senior');
  const nav = (await screen.findAllByRole('navigation', { name: 'DevMaster Hub' }))[0];
  expect(within(nav).getByRole('link', { name: /Project Lab/ })).toHaveAttribute('aria-current', 'page');
  expect(within(nav).getByRole('link', { name: /Dự án của tôi/ })).not.toHaveAttribute('aria-current');
  // Link chia se /project-level/<cap> chon san cap do
  expect(await screen.findByRole('button', { name: /Senior/, pressed: true })).toBeInTheDocument();
});

// ── Sua sau review ──

test('doi cap khi AI dang tao idea: idea cua cap cu khong roi vao cap moi', async () => {
  const u = userEvent.setup();
  let tha!: () => void;
  mo('/project-level', { ai: b => (b.taskType === 'projectIdea' ? new Promise(r => { tha = () => r(traText(JSON.stringify(IDEA))); }) : aiMacDinh(b)) });
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await u.click(screen.getByRole('button', { name: /Senior/ }));
  await act(async () => { tha(); });
  await new Promise(r => setTimeout(r, 30));
  expect(screen.queryByRole('heading', { name: 'Rắn săn mồi' })).not.toBeInTheDocument();
  expect(screen.getByText('Sẵn sàng!')).toBeInTheDocument();
});

test('dang cham thi bam Idea moi: diem cua project cu khong hien duoi idea moi', async () => {
  const u = userEvent.setup();
  let tha!: () => void;
  let soIdea = 0;
  mo('/project-level', {
    ai: b => (b.taskType === 'projectIdea' ? traText(JSON.stringify({ ...IDEA, name: soIdea++ === 0 ? 'Rắn săn mồi' : 'Cờ vua' }))
      : /Tổng hợp/.test(b.system) ? new Promise(r => { tha = () => r(aiMacDinh(b) as Response); }) : aiMacDinh(b))
  });
  await u.click(await screen.findByRole('button', { name: /Mid/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await screen.findByRole('heading', { name: 'Rắn săn mồi' });
  await u.click(screen.getByRole('textbox', { name: 'Code của main.js' }));
  await u.paste('let x = 1;');
  await u.click(screen.getByRole('button', { name: /AI chấm toàn diện/ }));
  await screen.findByText(/Tổng hợp đánh giá cuối cùng/);
  await u.click(screen.getByRole('button', { name: /Idea mới/ }));
  expect(await screen.findByRole('heading', { name: 'Cờ vua' })).toBeInTheDocument();
  await act(async () => { tha(); });
  await new Promise(r => setTimeout(r, 30));
  expect(screen.queryByRole('heading', { name: /78\/100/ })).not.toBeInTheDocument();
});

test('link /project-level/<cap khac> (Back/Forward) khong xoa project dang lam', async () => {
  const u = userEvent.setup();
  const { router } = mo('/project-level/mid');
  await u.click(await screen.findByRole('button', { name: /Tạo Idea/ }));
  await screen.findByRole('heading', { name: 'Rắn săn mồi' });
  await act(() => router.navigate('/project-level/senior'));
  await new Promise(r => setTimeout(r, 30));
  expect(screen.getByRole('heading', { name: 'Rắn săn mồi' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Mid/ })).toHaveAttribute('aria-pressed', 'true');
  expect(router.state.location.pathname).toBe('/project-level/mid');
});
