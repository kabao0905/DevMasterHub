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
        const b = JSON.parse(String(init?.body)) as ThanAi;
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
