// Career Advisor: chat, viec lam tu goi y, sua cau hoi, tra loi lai, xoa chat, tim viec, loi AI.
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';

type ThanAi = { system: string; messages: { role: string; content: string }[] };
const traText = (text: string) => new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { status: 200 });
const VIEC = [
  { title: 'React Intern', company_name: '<b>ACME</b>', source: 'Indeed', location: 'Hà Nội', url: 'https://jobs.x/1', company_logo: 'javascript:alert(1)', tags: ['react'], employment_type: 'INTERN' },
  { title: 'Senior Go Engineer', company_name: 'Beta', source: 'LinkedIn', location: 'Remote', url: 'javascript:alert(2)', tags: ['go'], is_remote: true }
];

function mo({ ai = (_b: ThanAi): Response => traText('[SEARCH_JOBS: React Intern]\nBạn hợp **thực tập**.'), chat = [] as unknown[], jobs = VIEC } = {}) {
  const goiAi: ThanAi[] = [];
  const timViec: string[] = [];
  const gia = giaSupabase({ nguoiDung: { id: 'u1' }, bang: {
    profiles: [{ id: 'u1', username: 'an', display_name: 'An' }],
    career_chats: chat.length ? [{ user_id: 'u1', messages: chat }] : [],
    lesson_progress: [{ tech_id: 'react', level_id: 'newbie', lesson_id: 'a', completed: true }]
  } });
  const json: Record<string, unknown> = { '/api/health': { aiEnabled: true }, '/curriculum/index.json': [] };
  const kq = veApp('/career', {
    gia, json,
    fetch: async (url: string, init?: RequestInit) => {
      if (url === '/api/ai') { const b = JSON.parse(String(init?.body)) as ThanAi; goiAi.push(b); return ai(b); }
      if (url.startsWith('/api/jobs')) { timViec.push(new URL(url, 'http://x').searchParams.get('search') ?? ''); return new Response(JSON.stringify({ jobs }), { status: 200 }); }
      return Object.hasOwn(json, url) ? new Response(JSON.stringify(json[url]), { status: 200 }) : new Response('null', { status: 404 });
    }
  });
  const daLuu = () => gia.truyVan.filter(q => q.bang === 'career_chats' && q.op === 'upsert').map(q => (q.payload as { messages: unknown[] }).messages);
  return { ...kq, gia, goiAi, timViec, daLuu };
}

beforeAll(async () => { await import('./CareerPage'); }, 30000);
beforeEach(() => { window.scrollTo = vi.fn() as unknown as typeof window.scrollTo; });
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const oNhap = () => screen.getByRole('textbox', { name: /Nhập câu hỏi/ });

test('nap lich su da luu; hoi -> tra loi markdown, tu tim viec, danh sach thu gon roi mo; luu lich su', async () => {
  const u = userEvent.setup();
  const { goiAi, timViec, daLuu } = mo({ chat: [{ role: 'user', content: 'Chào' }, { role: 'assistant', content: 'Chào bạn' }] });
  expect(await screen.findByText('Chào bạn')).toBeInTheDocument();
  await u.type(oNhap(), 'mình nên làm gì?{Enter}');
  expect(await screen.findByText('thực tập', { selector: 'strong' })).toBeInTheDocument();
  expect(goiAi[0].messages.map(m => m.content)).toEqual(['Chào', 'Chào bạn', 'mình nên làm gì?']);
  expect(timViec).toEqual(['React Intern']);
  const thanh = screen.getByRole('button', { name: /Việc làm AI gợi ý/ });
  expect(thanh).toHaveAttribute('aria-expanded', 'false');
  expect(thanh.textContent).toMatch(/2/);
  await u.click(thanh);
  const the = screen.getByRole('link', { name: /React Intern/ });
  expect(the).toHaveAttribute('href', 'https://jobs.x/1');
  expect(the).toHaveAttribute('target', '_blank');
  expect(the.textContent).toContain('<b>ACME</b>');
  expect(the.querySelector('img')).toBeNull(); // logo javascript: bi bo
  expect(screen.getByRole('link', { name: /Senior Go Engineer/ })).toHaveAttribute('href', '#');
  await waitFor(() => expect(daLuu().at(-1)).toHaveLength(4));
});

test('sua cau hoi: dua cau vao o nhap, cat lich su tu do; tra loi lai: hoi lai dung cau, khong lap tin', async () => {
  const u = userEvent.setup();
  let lan = 0;
  const { goiAi, daLuu } = mo({ ai: () => traText(`Trả lời ${++lan}`), chat: [{ role: 'user', content: 'Câu A' }, { role: 'assistant', content: 'Đáp A' }] });
  await screen.findByText('Đáp A');
  await u.click(screen.getByRole('button', { name: /Trả lời lại/ }));
  expect(await screen.findByText('Trả lời 1')).toBeInTheDocument();
  expect(screen.queryByText('Đáp A')).not.toBeInTheDocument();
  expect(goiAi[0].messages.map(m => m.content)).toEqual(['Câu A']);
  expect(screen.getAllByText('Câu A')).toHaveLength(1);

  await u.click(screen.getByRole('button', { name: /Sửa câu hỏi/ }));
  expect(oNhap()).toHaveValue('Câu A');
  expect(screen.queryByText('Trả lời 1')).not.toBeInTheDocument();
  await waitFor(() => expect(daLuu().at(-1)).toEqual([]));
});

test('loi AI: bao kem Gui lai, loi khong luu vao lich su tren server', async () => {
  const u = userEvent.setup();
  let lan = 0;
  const { daLuu } = mo({ ai: () => (lan++ === 0 ? new Response('{"error":"AI bận"}', { status: 500 }) : traText('Ổn rồi')) });
  await u.type(await screen.findByRole('textbox', { name: /Nhập câu hỏi/ }), 'hỏi{Enter}');
  expect(await screen.findByText(/Cố vấn chưa trả lời được/)).toBeInTheDocument();
  expect(daLuu().flat().some(m => /Lỗi/.test(JSON.stringify(m)))).toBe(false);
  await u.click(screen.getByRole('button', { name: 'Gửi lại' }));
  expect(await screen.findByText('Ổn rồi')).toBeInTheDocument();
  expect(screen.getAllByText('hỏi')).toHaveLength(1);
});

test('xoa chat co xac nhan; tim viec thu cong', async () => {
  const u = userEvent.setup();
  const { timViec, daLuu } = mo({ chat: [{ role: 'user', content: 'Chào' }, { role: 'assistant', content: 'Chào bạn' }] });
  await screen.findByText('Chào bạn');
  vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
  await u.click(screen.getByRole('button', { name: /Xóa chat/ }));
  expect(screen.getByText('Chào bạn')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /Xóa chat/ }));
  expect(screen.queryByText('Chào bạn')).not.toBeInTheDocument();
  expect(screen.getByText(/Mình là AI Career Advisor/)).toBeInTheDocument();
  await waitFor(() => expect(daLuu().at(-1)).toEqual([]));

  await u.click(screen.getByRole('button', { name: /Tìm việc làm/ }));
  const hop = await screen.findByRole('dialog');
  await u.type(within(hop).getByRole('textbox'), 'Python backend{Enter}');
  expect(timViec).toEqual(['Python backend']);
  expect(await screen.findByRole('button', { name: /Việc làm AI gợi ý/ })).toHaveTextContent('Python backend');
});

test('roi trang roi quay lai: chat va cau dang go van con', async () => {
  const u = userEvent.setup();
  const { router } = mo();
  await u.type(await screen.findByRole('textbox', { name: /Nhập câu hỏi/ }), 'hỏi{Enter}');
  await screen.findByText('thực tập', { selector: 'strong' });
  await u.type(oNhap(), 'đang gõ dở');
  await act(() => router.navigate('/'));
  await act(() => router.navigate('/career'));
  expect(await screen.findByText('thực tập', { selector: 'strong' })).toBeInTheDocument();
  expect(oNhap()).toHaveValue('đang gõ dở');
});
