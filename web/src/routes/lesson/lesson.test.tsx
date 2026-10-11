import { act, fireEvent, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';
import type { CongNgheDayDu, CongNgheTomTat } from '@/lib/curriculum';

const PY: CongNgheDayDu = {
  id: 'python', name: 'Python', icon: '🐍', color: '#3776AB', gradient: '', category: 'language', description: 'Ngôn ngữ đa năng',
  levels: [
    {
      id: 'newbie', name: 'Newbie', lessons: [
        { id: 'a', title: 'Biến', theory: '<p>Biến <strong>lưu</strong> giá trị<img src=x onerror="alert(1)"></p>', keyPoints: ['#include <iostream> để dùng cout'], code: 'x = 1\nprint(x)', lang: 'python', exercise: 'Viết lớp Stack<T> có push và pop' },
        { id: 'b', title: 'Vòng lặp', theory: '<p>for và while</p>' }
      ]
    },
    { id: 'junior', name: 'Junior', lessons: [{ id: 'c', title: 'Hàm', theory: '<p>def</p>' }] }
  ]
};
const REACT_T: CongNgheDayDu = {
  id: 'react', name: 'React', icon: '⚛️', color: '#61dafb', gradient: '', category: 'framework', description: 'Thư viện UI',
  levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'jsx', title: 'JSX', theory: '<p>JSX</p>', code: 'function App() { return <h1>Xin chao JSX</h1>; }', lang: 'jsx', exercise: 'Đổi lời chào' }] }]
};
const CYB: CongNgheDayDu = {
  id: 'cybersecurity', name: 'An ninh mạng', icon: '🛡️', color: '#f00', gradient: '', category: 'concept', description: 'Bảo mật',
  levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'linux', title: 'Linux', theory: '<p>ls</p>', exercise: 'Tìm tệp cờ trong thư mục nhà' }] }]
};
const NGX: CongNgheDayDu = {
  id: 'nginx', name: 'Nginx', icon: '🟩', color: '#090', gradient: '', category: 'devops', description: 'Web server',
  levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'intro', title: 'Giới thiệu', theory: '<p>nginx</p>' }] }]
};
const TECHS = [PY, REACT_T, CYB, NGX];
const INDEX: CongNgheTomTat[] = TECHS.map(t => ({ ...t, levels: t.levels.map(l => ({ ...l, lessons: l.lessons.map(b => ({ id: b.id, title: b.title })) })) }));

type ThanAi = { system: string; messages: { content: string }[]; taskType: string };
type TuyChon = { ai?: (b: ThanAi) => Response | Promise<Response>; dich?: (url: string) => Response; aiEnabled?: boolean };
const traText = (text: string) => new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { status: 200 });

/** Mang gia: JSON giao trinh, /api/ai va may dich; tra ve danh sach than cac lan goi AI */
function mo(duongDan: string, { ai, dich, aiEnabled = true, lang = 'vi', bang = {} }: TuyChon & { lang?: string; bang?: Record<string, unknown[]> } = {}) {
  const json: Record<string, unknown> = { '/curriculum/index.json': INDEX, '/api/health': { aiEnabled } };
  for (const t of TECHS) json[`/curriculum/${t.id}.json`] = t;
  const goiAi: ThanAi[] = [];
  const gia = giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }], ...bang } });
  const kq = veApp(duongDan, {
    gia, json, lang,
    fetch: async (url: string, init?: RequestInit) => {
      if (url === '/api/ai') {
        const b = JSON.parse(String(init?.body)) as ThanAi;
        goiAi.push(b);
        return ai ? ai(b) : new Response('{"error":"AI tắt"}', { status: 500 });
      }
      if (url.startsWith('https://translate.googleapis.com/')) return dich ? dich(url) : new Response('', { status: 500 });
      return Object.hasOwn(json, url) ? new Response(JSON.stringify(json[url]), { status: 200 }) : new Response('null', { status: 404 });
    }
  });
  return { ...kq, gia, goiAi };
}

beforeEach(() => { window.scrollTo = vi.fn() as unknown as typeof window.scrollTo; });
afterEach(() => vi.unstubAllGlobals());

const tieuDe = () => screen.findByRole('heading', { level: 1 });

test('bai hoac cong nghe la: bao khong tim thay kem duong quay ve', async () => {
  const { unmount } = mo('/lesson/python/newbie/zzz');
  expect(await screen.findByRole('heading', { name: 'Không tìm thấy trang này' })).toBeInTheDocument();
  expect(within(screen.getByRole('main')).getByRole('link', { name: 'Python' })).toHaveAttribute('href', '/roadmap/python');
  unmount();
  mo('/lesson/constructor/newbie/a');
  expect(await screen.findByRole('heading', { name: 'Không tìm thấy trang này' })).toBeInTheDocument();
});

test('breadcrumb, bai truoc/sau qua ranh gioi cap, doi bai thi cuon len dau', async () => {
  const u = userEvent.setup();
  const { router } = mo('/lesson/python/newbie/b');
  expect(await tieuDe()).toHaveTextContent('Vòng lặp');
  const vet = screen.getByRole('navigation', { name: 'breadcrumb' });
  expect(within(vet).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
  expect(within(vet).getByRole('link', { name: /Python/ })).toHaveAttribute('href', '/roadmap/python');
  expect(within(vet).getByText('Newbie')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Bài trước.*Biến/ })).toHaveAttribute('href', '/lesson/python/newbie/a');
  await u.click(screen.getByRole('link', { name: /Bài tiếp theo.*Hàm/ }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/lesson/python/junior/c'));
  expect(await tieuDe()).toHaveTextContent('Hàm');
  expect(window.scrollTo).toHaveBeenCalled();
  expect(screen.queryByRole('link', { name: /Bài tiếp theo/ })).not.toBeInTheDocument();
});

test('danh dau hoan thanh tu trang bai', async () => {
  const u = userEvent.setup();
  const { gia } = mo('/lesson/python/newbie/a', { bang: { lesson_progress: [] } });
  const nut = await screen.findByRole('button', { name: /Đánh dấu hoàn thành/ });
  await waitFor(() => expect(nut).toBeEnabled());
  await u.click(nut);
  expect(await screen.findByRole('button', { name: /Đã hoàn thành/ })).toHaveAttribute('aria-pressed', 'true');
  await waitFor(() => expect(gia.truyVan.some(q => q.bang === 'lesson_progress' && q.op === 'upsert')).toBe(true));
});

test('ly thuyet da lam sach; diem chinh hien nguyen van, ke ca #include <iostream>', async () => {
  mo('/lesson/python/newbie/a');
  const panel = await screen.findByRole('tabpanel');
  expect(await within(panel).findByText(/giá trị/)).toBeInTheDocument();
  expect(panel.querySelector('[onerror]')).toBeNull();
  expect(within(panel).getByText('#include <iostream> để dùng cout')).toBeInTheDocument();
});

test('nguoi hoc tieng Anh: ly thuyet duoc dich may va ban dich cung duoc lam sach', async () => {
  const urls: string[] = [];
  mo('/lesson/python/newbie/a', {
    lang: 'en',
    dich: url => {
      urls.push(url);
      const ban = url.includes('iostream') ? '<ul><li>#include &lt;iostream&gt; to use cout</li></ul>' : '<p>Variables store values<img src=x onerror=alert(2)></p>';
      return new Response(JSON.stringify([[[ban, 'x']]]));
    }
  });
  const panel = await screen.findByRole('tabpanel');
  expect(await within(panel).findByText(/Variables store values/)).toBeInTheDocument();
  expect(await within(panel).findByText('#include <iostream> to use cout')).toBeInTheDocument();
  expect(panel.querySelector('[onerror]')).toBeNull();
  expect(urls.every(u => u.includes('tl=en'))).toBe(true);
});

test('may dich loi thi giu ban goc', async () => {
  let lanDich = 0;
  mo('/lesson/python/newbie/a', { lang: 'en', dich: () => { lanDich++; return new Response('', { status: 429 }); } });
  const panel = await screen.findByRole('tabpanel');
  // Doi may dich tra loi loi xong (het "Dang dich") roi moi kiem — khong phai luc chua kip goi
  await waitFor(() => expect(lanDich).toBeGreaterThan(0));
  await waitFor(() => expect(screen.queryByText('Đang dịch…')).not.toBeInTheDocument());
  expect(within(panel).getByText(/giá trị/)).toBeInTheDocument();
  expect(within(panel).getByText('#include <iostream> để dùng cout')).toBeInTheDocument();
});

test('tab Code: to mau, co nut chep, tab nam tren URL; bai khong co code thi noi ro', async () => {
  const u = userEvent.setup();
  const { router } = mo('/lesson/python/newbie/a');
  await u.click(await screen.findByRole('tab', { name: /Code Lab/ }));
  await waitFor(() => expect(router.state.location.search).toBe('?tab=code'));
  const panel = screen.getByRole('tabpanel');
  expect(panel.querySelector('pre code .token')).not.toBeNull();
  expect(within(panel).getByRole('button', { name: /Sao chép/ })).toBeInTheDocument();
  await act(() => router.navigate('/lesson/python/newbie/b?tab=code'));
  expect(await screen.findByText('Chưa có mã ví dụ cho bài học này.')).toBeInTheDocument();
});

const QUIZ = [
  { question: 'Gán biến dùng dấu gì?', options: ['=', '==', ':='], correct: 0, explanation: 'Dấu = để gán' },
  { question: 'In ra màn hình?', code: 'print(1)', options: ['echo', 'print', 'say'], correct: 1, explanation: 'Dùng print' }
];

test('quiz di du vong: tao, chon, nop khi tra loi du, cham diem, giai thich, quiz moi', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=quiz', { ai: () => traText(JSON.stringify(QUIZ)) });
  await u.click(await screen.findByRole('button', { name: /Tạo Quiz với AI/ }));
  const nop = await screen.findByRole('button', { name: 'Nộp bài (0/2)' });
  expect(nop).toBeDisabled();
  expect(goiAi[0].taskType).toBe('quiz');

  const cau1 = screen.getByRole('group', { name: /Câu 1/ });
  const cau2 = screen.getByRole('group', { name: /Câu 2/ });
  await u.click(within(cau1).getByRole('radio', { name: /==/ }));
  await u.click(within(cau2).getByRole('radio', { name: /print/ }));
  await u.click(screen.getByRole('button', { name: 'Nộp bài (2/2)' }));

  expect(await screen.findByText('Đúng 1/2 câu (50%)')).toBeInTheDocument();
  expect(screen.getByText('Khá tốt!')).toBeInTheDocument();
  expect(within(cau1).getByText('❌ Sai')).toBeInTheDocument();
  expect(within(cau2).getByText('✅ Đúng')).toBeInTheDocument();
  expect(within(cau1).getByText('Dấu = để gán')).toBeInTheDocument();
  expect(within(cau1).getByRole('radio', { name: /==/ })).toBeDisabled();

  await u.click(screen.getByRole('button', { name: 'Làm quiz mới' }));
  expect(await screen.findByRole('button', { name: 'Nộp bài (0/2)' })).toBeInTheDocument();
  expect(goiAi).toHaveLength(2);
});

test('quiz: AI loi thi bao loi kem Thu lai', async () => {
  const u = userEvent.setup();
  let lan = 0;
  mo('/lesson/python/newbie/a?tab=quiz', { ai: () => (lan++ === 0 ? traText('khong phai json') : traText(JSON.stringify(QUIZ))) });
  await u.click(await screen.findByRole('button', { name: /Tạo Quiz với AI/ }));
  expect(await screen.findByText(/Không tạo được quiz: AI trả về quiz không hợp lệ/)).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Thử lại' }));
  expect(await screen.findByRole('button', { name: 'Nộp bài (0/2)' })).toBeInTheDocument();
});

test('quiz: AI tat tren may chu thi noi ro, khong co nut tao', async () => {
  mo('/lesson/python/newbie/a?tab=quiz', { aiEnabled: false });
  expect(await screen.findByText('Tính năng AI đang tắt trên máy chủ.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Tạo Quiz với AI/ })).not.toBeInTheDocument();
});

test('gia su: goi y gui dung cau, cau tra loi hien markdown, dang gui thi khong gui them', async () => {
  const u = userEvent.setup();
  let tha!: () => void;
  const { goiAi } = mo('/lesson/python/newbie/a', { ai: () => new Promise(r => { tha = () => r(traText('Biến là **hộp** chứa giá trị')); }) });
  const chat = await screen.findByRole('region', { name: /Hỏi Gia sư AI/ });
  await u.click(within(chat).getByRole('button', { name: 'Giải thích đơn giản' }));
  await waitFor(() => expect(goiAi).toHaveLength(1));
  expect(goiAi[0].messages[0].content).toBe('Giải thích đơn giản phần này cho mình');
  expect(goiAi[0].taskType).toBe('tutor');
  expect(within(chat).getByRole('button', { name: 'Gửi' })).toBeDisabled();
  await u.type(within(chat).getByRole('textbox'), 'Hỏi thêm{Enter}');
  expect(goiAi).toHaveLength(1);
  await act(async () => { tha(); });
  expect(await within(chat).findByText('hộp', { selector: 'strong' })).toBeInTheDocument();
});

test('gia su: loi thi hien kem Gui lai, loi khong lot vao lich su gui AI', async () => {
  const u = userEvent.setup();
  let lan = 0;
  const { goiAi } = mo('/lesson/python/newbie/a', {
    ai: () => (lan++ === 0 ? new Response('{"error":"Quá nhiều yêu cầu"}', { status: 500 }) : traText('Được rồi'))
  });
  const chat = await screen.findByRole('region', { name: /Hỏi Gia sư AI/ });
  await u.type(within(chat).getByRole('textbox'), 'Vì sao?{Enter}');
  expect(await within(chat).findByText('Không gửi được: Quá nhiều yêu cầu')).toBeInTheDocument();
  await u.click(within(chat).getByRole('button', { name: 'Gửi lại' }));
  expect(await within(chat).findByText('Được rồi')).toBeInTheDocument();
  expect(goiAi[1].messages[0].content).toBe('Vì sao?');
  expect(within(chat).getAllByText('Vì sao?')).toHaveLength(1);
});

test('gia su o tab Quiz: ngu canh co cau hoi quiz nhung chua lo dap an khi chua nop', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=quiz', {
    ai: b => (b.taskType === 'quiz' ? traText(JSON.stringify(QUIZ)) : traText('ok'))
  });
  await u.click(await screen.findByRole('button', { name: /Tạo Quiz với AI/ }));
  await screen.findByRole('button', { name: 'Nộp bài (0/2)' });
  const chat = screen.getByRole('region', { name: /Hỏi Gia sư AI/ });
  expect(chat).toHaveTextContent('Bài trắc nghiệm');
  await u.type(within(chat).getByRole('textbox'), 'Gợi ý câu 1?{Enter}');
  await waitFor(() => expect(goiAi).toHaveLength(2));
  expect(goiAi[1].system).toContain('Câu 1: Gán biến dùng dấu gì?');
  expect(goiAi[1].system).not.toContain('Đáp án đúng');
  expect(goiAi[1].system).toContain('NGHIÊM CẤM nói đáp án đúng');
});

test('doi sang bai khac khi AI chua tra loi: cau tra loi nam o bai da hoi', async () => {
  const u = userEvent.setup();
  let tha!: () => void;
  const { router } = mo('/lesson/python/newbie/a', { ai: () => new Promise(r => { tha = () => r(traText('Trả lời cho bài Biến')); }) });
  const chat = await screen.findByRole('region', { name: /Hỏi Gia sư AI/ });
  await u.type(within(chat).getByRole('textbox'), 'Hỏi bài A{Enter}');
  await act(() => router.navigate('/lesson/python/newbie/b'));
  expect(await tieuDe()).toHaveTextContent('Vòng lặp');
  await act(async () => { tha(); });
  expect(screen.queryByText('Trả lời cho bài Biến')).not.toBeInTheDocument();
  await act(() => router.navigate('/lesson/python/newbie/a'));
  expect(await screen.findByText('Trả lời cho bài Biến')).toBeInTheDocument();
});

test('xoa hoi thoai thi ve man chao', async () => {
  const u = userEvent.setup();
  mo('/lesson/python/newbie/a', { ai: () => traText('Chào bạn') });
  const chat = await screen.findByRole('region', { name: /Hỏi Gia sư AI/ });
  await u.type(within(chat).getByRole('textbox'), 'Xin chào{Enter}');
  await within(chat).findByText('Chào bạn');
  await u.click(within(chat).getByRole('button', { name: /Xóa hội thoại/ }));
  expect(within(chat).getByText('Hỏi AI bất cứ điều gì về phần này!')).toBeInTheDocument();
  expect(within(chat).queryByText('Chào bạn')).not.toBeInTheDocument();
});

test('doi tab bai hoc khong cuon trang len dau', async () => {
  const u = userEvent.setup();
  mo('/lesson/python/newbie/a');
  await tieuDe();
  await waitFor(() => expect(window.scrollTo).toHaveBeenCalled());
  vi.mocked(window.scrollTo).mockClear();
  await u.click(screen.getByRole('tab', { name: /Code Lab/ }));
  await screen.findByRole('button', { name: /Sao chép/ });
  expect(window.scrollTo).not.toHaveBeenCalled();
});

test('gia su: Enter luc dang go chu co dau tren Safari (keyCode 229) khong gui', async () => {
  const { goiAi } = mo('/lesson/python/newbie/a', { ai: () => traText('ok') });
  const chat = await screen.findByRole('region', { name: /Hỏi Gia sư AI/ });
  const o = within(chat).getByRole('textbox');
  fireEvent.change(o, { target: { value: 'Vòng lặ' } });
  fireEvent.keyDown(o, { key: 'Enter', keyCode: 229 });
  await new Promise(r => setTimeout(r, 30));
  expect(goiAi).toHaveLength(0);
  expect(o).toHaveValue('Vòng lặ');
});

// ── Tab Bai tap ──

const moTabBaiTap = async (u: ReturnType<typeof userEvent.setup>) => u.click(await screen.findByRole('tab', { name: /Bài tập/ }));

test('bai tap: React hien IDE truc tiep seed tu code bai hoc; an ninh mang hien terminal (khong CTF); nginx intro hien lab', async () => {
  const u = userEvent.setup();
  const a = mo('/lesson/react/newbie/jsx');
  await moTabBaiTap(u);
  expect((await screen.findByRole('textbox', { name: 'Soạn App.jsx' }) as HTMLTextAreaElement).value).toContain('Xin chao JSX');
  expect(screen.getByText('Đổi lời chào')).toBeInTheDocument();
  a.unmount();

  const b = mo('/lesson/cybersecurity/newbie/linux?tab=exercise');
  expect(await screen.findByRole('textbox', { name: 'Lệnh terminal' })).toBeInTheDocument();
  expect(screen.getByText('Tìm tệp cờ trong thư mục nhà')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Nộp cờ' })).not.toBeInTheDocument();
  b.unmount();

  mo('/lesson/nginx/newbie/intro?tab=exercise');
  expect(await screen.findByText(/Làm quen máy chủ Nginx/)).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Lệnh terminal' })).toBeInTheDocument();
});

test('bai tap Python: de goc hien nguyen van (Stack<T>); AI tao bai moi thanh tab AI #1; cau tra loi giu rieng tung bai', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=exercise', {
    ai: () => traText(JSON.stringify({ title: 'Tong hai so', description: 'Viết hàm **tong**', hints: ['Dùng +'], solution: 'def tong(a, b):\n    return a + b', solutionLang: 'python' }))
  });
  expect(await screen.findByText('Viết lớp Stack<T> có push và pop')).toBeInTheDocument();
  const soan = screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây...' });
  await u.type(soan, 'class Stack');
  expect(screen.queryByRole('button', { name: /Xem gợi ý/ })).not.toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /AI tạo bài tập mới/ }));
  expect(await screen.findByRole('button', { name: 'AI #1', pressed: true })).toBeInTheDocument();
  expect(goiAi[0].taskType).toBe('exercise');
  expect(goiAi[0].messages[0].content).toContain('Viết lớp Stack<T>');
  expect(screen.getByText('tong', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây...' })).toHaveValue('');
  await u.click(screen.getByRole('button', { name: /Xem gợi ý/ }));
  expect(screen.getByText('Dùng +')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /Xem solution mẫu/ }));
  expect(screen.getByRole('tabpanel').textContent).toMatch(/return a \+ b/);
  await u.click(screen.getByRole('button', { name: /Bài tập gốc/ }));
  expect(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây...' })).toHaveValue('class Stack');
});

test('cham bai: hien diem va nhan xet; HTML trong nhan xet hien nhu chu; loi AI co the cham lai', async () => {
  const u = userEvent.setup();
  let lan = 0;
  mo('/lesson/python/newbie/a?tab=exercise', {
    ai: () => (lan++ === 0 ? new Response('{"error":"AI bận"}', { status: 500 })
      : traText(JSON.stringify({ score: 70, status: 'partial', feedback: 'Thiếu pop <img src=x onerror=alert(1)>', errors: ['Chưa có pop'], suggestions: ['Thêm pop'], correctedCode: 'class Stack: pass' })))
  });
  await u.type(await screen.findByRole('textbox', { name: 'Viết code hoặc đáp án ở đây...' }), 'class Stack: push');
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText(/Không chấm được bài: AI bận/)).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText('70/100 điểm')).toBeInTheDocument();
  expect(screen.getByText('🟡 Gần đúng')).toBeInTheDocument();
  expect(screen.getByText(/Thiếu pop <img src=x onerror=alert\(1\)>/)).toBeInTheDocument();
  expect(document.querySelector('[role=tabpanel] img')).toBeNull();
  expect(screen.getByText('Chưa có pop')).toBeInTheDocument();
});

test('o soan giu cau tra loi khi doi tab roi quay lai; gia su o tab Bai tap thay code hoc vien', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=exercise', { ai: () => traText('ok') });
  await u.type(await screen.findByRole('textbox', { name: 'Viết code hoặc đáp án ở đây...' }), 'print(42)');
  await u.click(screen.getByRole('tab', { name: /Lý thuyết/ }));
  await moTabBaiTap(u);
  expect(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây...' })).toHaveValue('print(42)');
  const chat = screen.getByRole('region', { name: /Hỏi Gia sư AI/ });
  expect(chat).toHaveTextContent('Bài tập thực hành');
  await u.type(within(chat).getByRole('textbox'), 'Sai o dau?{Enter}');
  await waitFor(() => expect(goiAi).toHaveLength(1));
  expect(goiAi[0].system).toContain('=== CODE HỌC VIÊN ĐÃ VIẾT ===\nprint(42)');
  expect(goiAi[0].system).toContain('NGHIÊM CẤM đưa code đáp án');
});

test('IDE React: sua code, doi sang Ly thuyet roi quay lai van con', async () => {
  const u = userEvent.setup();
  mo('/lesson/react/newbie/jsx');
  await moTabBaiTap(u);
  const soan = await screen.findByRole('textbox', { name: 'Soạn App.jsx' }) as HTMLTextAreaElement;
  const cu = soan.value;
  // Go that tung phim (truoc day o nhap dieu khien bang cache bat dong bo lam mat chu khi go)
  await u.type(soan, ' // da sua', { initialSelectionStart: cu.length, initialSelectionEnd: cu.length });
  expect(soan.value).toBe(cu + ' // da sua');
  await u.click(screen.getByRole('tab', { name: /Lý thuyết/ }));
  await moTabBaiTap(u);
  expect(screen.getByRole('textbox', { name: 'Soạn App.jsx' })).toHaveValue(cu + ' // da sua');
});
