import { docThan } from '@/test/doc-than';
import { act, fireEvent, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';
import type { CongNgheDayDu, CongNgheTomTat } from '@/lib/curriculum';
import BANK_SEED from '../../../../data/quiz-bank/python/newbie/intro.vi.json';
import type { QuestionBank } from '../../../../shared/quiz-bank.mjs';

const PY: CongNgheDayDu = {
  id: 'python', name: 'Python', icon: '🐍', color: '#3776AB', gradient: '', category: 'language', description: 'Ngôn ngữ đa năng',
  levels: [
    {
      id: 'newbie', name: 'Newbie', lessons: [
        { id: 'a', title: 'Biến', theory: '<p>Biến <strong>lưu</strong> giá trị<img src=x onerror="alert(1)"></p>', keyPoints: ['#include <iostream> để dùng cout'], code: 'x = 1\nprint(x)', output: '1', lang: 'python', exercise: 'Viết lớp Stack<T> có push và pop' },
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
const DSA_T: CongNgheDayDu = {
  id: 'dsa', name: 'DSA', icon: '🧮', color: '#888', gradient: '', category: 'tool', description: 'Giải thuật',
  levels: [{ id: 'newbie', name: 'Newbie', lessons: [{
    id: 'sorting', title: 'Sắp xếp', theory: '<p>sort</p>', code: 'int main() {}', lang: 'cpp', exercise: 'Luyện các thuật toán sắp xếp',
    exercises: [
      { title: 'Bubble Sort', description: 'Cài đặt bubbleSort tăng dần', starter: 'void bubbleSort(vector<int>& a) {}' },
      { title: 'Selection Sort', description: 'Cài đặt selectionSort tăng dần', starter: 'void selectionSort(vector<int>& a) {}' }
    ]
  }] }]
};
const VUE_T: CongNgheDayDu = {
  id: 'vue', name: 'Vue.js', icon: '💚', color: '#42b883', gradient: '', category: 'frontend', description: 'Framework UI',
  levels: [{ id: 'newbie', name: 'Newbie', lessons: [{
    id: 'intro', title: 'Vue', theory: '<p>Vue</p>', code: '<template><p>chi de doc</p></template>', lang: 'markup', exercise: 'Làm bộ đếm',
    playground: {
      files: { 'index.html': '<div id="app"></div>', 'style.css': '.box {}', 'App.js': "Vue.createApp({ template: '<p>Tu playground</p>' }).mount('#app');" },
      libs: ['https://unpkg.com/vue@3.5.43/dist/vue.global.js']
    }
  }] }]
};
const TECHS = [PY, REACT_T, CYB, NGX, DSA_T, VUE_T];
const INDEX: CongNgheTomTat[] = TECHS.map(t => ({ ...t, levels: t.levels.map(l => ({ ...l, lessons: l.lessons.map(b => ({ id: b.id, title: b.title })) })) }));

type ThanAi = { system: string; messages: { content: string }[]; taskType: string };
type TuyChon = {
  bank?: QuestionBank | Response;
  ai?: (b: ThanAi) => Response | Promise<Response>; dich?: (url: string) => Response; aiEnabled?: boolean;
  chay?: (b: { code: string; stdin: string }) => unknown;
};
const traText = (text: string) => new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { status: 200 });

function mo(duongDan: string, { ai, dich, chay, bank, aiEnabled = true, lang = 'vi', bang = {}, loiDoc }: TuyChon & { lang?: string; bang?: Record<string, unknown[]>; loiDoc?: Record<string, string> } = {}) {
  const json: Record<string, unknown> = { '/curriculum/index.json': INDEX, '/api/health': { aiEnabled } };
  for (const t of TECHS) json[`/curriculum/${t.id}.json`] = t;
  if (bank) {
    const py = structuredClone(PY);
    py.levels[0].lessons[0].quizBanks = { vi: { url: '/test-bank.json', sourceHash: BANK_SEED.sourceHash, count: 80 } };
    json['/curriculum/python.json'] = py;
  }
  const goiAi: ThanAi[] = [];
  const thanChay: { lang: string; code: string; stdin: string }[] = [];
  const gia = giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }], ...bang }, loiDoc });
  const kq = veApp(duongDan, {
    gia, json, lang,
    fetch: async (url: string, init?: RequestInit) => {
      if (url === '/test-bank.json' && bank) return bank instanceof Response ? bank : new Response(JSON.stringify(bank));
      if (url === '/api/ai') {
        const b = docThan(init?.body) as ThanAi;
        goiAi.push(b);
        return ai ? ai(b) : new Response('{"error":"AI tắt"}', { status: 500 });
      }
      if (url === '/api/run') {
        const b = docThan(init?.body) as { lang: string; code: string; stdin: string };
        thanChay.push(b);
        return chay ? new Response(JSON.stringify(chay(b)), { status: 200 }) : new Response('{"error":"Không chạy được"}', { status: 502 });
      }
      if (url.startsWith('https://translate.googleapis.com/')) return dich ? dich(url) : new Response('', { status: 500 });
      return Object.hasOwn(json, url) ? new Response(JSON.stringify(json[url]), { status: 200 }) : new Response('null', { status: 404 });
    }
  });
  return { ...kq, gia, goiAi, thanChay };
}

beforeAll(async () => { await import('./LessonPage'); }, 30000);
beforeEach(() => { window.scrollTo = vi.fn() as unknown as typeof window.scrollTo; });
afterEach(() => vi.unstubAllGlobals());

const tieuDe = () => screen.findByRole('heading', { level: 1 });
const XONG_PY = (...bai: string[]) => ({ lesson_progress: bai.map(id => ({ tech_id: 'python', level_id: id === 'c' ? 'junior' : 'newbie', lesson_id: id, completed: true })) });

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
  const { router } = mo('/lesson/python/newbie/b', { bang: XONG_PY('a', 'b') });
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

const daGhiXong = (gia: ReturnType<typeof mo>['gia']) =>
  gia.truyVan.some(q => q.bang === 'lesson_progress' && q.op === 'upsert' && (q.payload as { completed?: boolean }).completed === true);
const traCham = (score: number) => traText(JSON.stringify({ score, status: score >= 80 ? 'correct' : 'partial', feedback: 'Nhận xét', errors: [], suggestions: [] }));

test('khong tu tich hoan thanh duoc: chi co nut dua sang tab Bai tap', async () => {
  const u = userEvent.setup();
  const { gia, router } = mo('/lesson/python/newbie/a', { bang: { lesson_progress: [] } });
  await tieuDe();
  expect(screen.queryByRole('button', { name: /Đánh dấu hoàn thành/ })).not.toBeInTheDocument();
  await u.click(await screen.findByRole('button', { name: /Làm bài tập để hoàn thành/ }));
  expect(router.state.location.search).toBe('?tab=exercise');
  expect(daGhiXong(gia)).toBe(false);
});

test('AI cham Gan dung thi chua tich; cham Dung thi bai tu duoc tich hoan thanh', async () => {
  const u = userEvent.setup();
  let diem = 70;
  const { gia } = mo('/lesson/python/newbie/a?tab=exercise', { bang: { lesson_progress: [] }, ai: () => traCham(diem) });
  await u.type(await screen.findByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' }), 'class Stack: push pop');
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText('70/100 điểm')).toBeInTheDocument();
  expect(daGhiXong(gia)).toBe(false);
  diem = 90;
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText('90/100 điểm')).toBeInTheDocument();
  expect(await screen.findByText('Đã hoàn thành')).toBeInTheDocument();
  await waitFor(() => expect(daGhiXong(gia)).toBe(true));
});

test('IDE React: nop ca bo tep dang soan cho AI cham; dat thi bai duoc tich', async () => {
  const u = userEvent.setup();
  const { gia, goiAi } = mo('/lesson/react/newbie/jsx?tab=exercise', { bang: { lesson_progress: [] }, ai: () => traCham(85) });
  await screen.findByRole('textbox', { name: 'Soạn App.jsx' });
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText('85/100 điểm')).toBeInTheDocument();
  expect(goiAi[0].messages[0].content).toContain('Xin chao JSX');
  await waitFor(() => expect(daGhiXong(gia)).toBe(true));
});

test('an ninh mang: dan lenh da chay va ket qua de AI cham; dat thi bai duoc tich', async () => {
  const u = userEvent.setup();
  const { gia, goiAi } = mo('/lesson/cybersecurity/newbie/linux?tab=exercise', { bang: { lesson_progress: [] }, ai: () => traCham(95) });
  await u.type(await screen.findByRole('textbox', { name: 'Dán các lệnh bạn đã chạy và kết quả' }), 'ls -la{enter}flag.txt');
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText('95/100 điểm')).toBeInTheDocument();
  expect(goiAi[0].messages[0].content).toContain('flag.txt');
  await waitFor(() => expect(daGhiXong(gia)).toBe(true));
});

const nutBaiTap = () => within(screen.getByRole('tabpanel')).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed')).map(b => b.textContent?.trim());

test('DSA: moi thuat toan mot bai tap rieng; o soan de trong, bam "Dung code khung" moi chen; cau tra loi giu rieng tung bai', async () => {
  const u = userEvent.setup();
  mo('/lesson/dsa/newbie/sorting?tab=exercise');
  const soan = () => screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' });
  expect(await screen.findByRole('button', { name: /Bubble Sort/, pressed: true })).toBeInTheDocument();
  expect(screen.queryByRole('textbox', { name: /Soạn main/ })).not.toBeInTheDocument();
  expect(screen.getByText('Cài đặt bubbleSort tăng dần')).toBeInTheDocument();
  expect(soan()).toHaveValue('');
  await u.click(screen.getByRole('button', { name: /Dùng code khung/ }));
  expect(soan()).toHaveValue('void bubbleSort(vector<int>& a) {}');
  expect(screen.queryByRole('button', { name: /Dùng code khung/ })).not.toBeInTheDocument();
  await u.type(soan(), ' // xong');
  await u.click(screen.getByRole('button', { name: /Selection Sort/ }));
  expect(screen.getByText('Cài đặt selectionSort tăng dần')).toBeInTheDocument();
  expect(soan()).toHaveValue('');
  await u.click(screen.getByRole('button', { name: /Bubble Sort/ }));
  expect(soan()).toHaveValue('void bubbleSort(vector<int>& a) {} // xong');
});

test('DSA: dang o bai nao thi "AI tao bai tap moi" tao them bai cung loai, nut nam ngay sau bai do', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/dsa/newbie/sorting?tab=exercise', {
    ai: () => traText(JSON.stringify({ title: 'Biến thể', description: 'Một biến thể mới', hints: [], solution: '', solutionLang: 'cpp' }))
  });
  await u.click(await screen.findByRole('button', { name: /Selection Sort/ }));
  await u.click(screen.getByRole('button', { name: /AI tạo bài tập mới/ }));
  expect(await screen.findByRole('button', { name: 'Selection Sort · AI #1', pressed: true })).toBeInTheDocument();
  expect(goiAi[0].taskType).toBe('exercise');
  expect(goiAi[0].messages[0].content).toContain('CHỦ ĐỀ BẮT BUỘC: Selection Sort');
  expect(goiAi[0].messages[0].content).toContain('NGÔN NGỮ: cpp');
  await u.click(screen.getByRole('button', { name: /AI tạo bài tập mới/ }));
  expect(await screen.findByRole('button', { name: 'Selection Sort · AI #2', pressed: true })).toBeInTheDocument();
  expect(goiAi[1].messages[0].content).toContain('CHỦ ĐỀ BẮT BUỘC: Selection Sort');
  await u.click(screen.getByRole('button', { name: /^Bubble Sort$/ }));
  await u.click(screen.getByRole('button', { name: /AI tạo bài tập mới/ }));
  expect(await screen.findByRole('button', { name: 'Bubble Sort · AI #1', pressed: true })).toBeInTheDocument();
  expect(nutBaiTap()).toEqual(['Bubble Sort', 'Bubble Sort · AI #1', 'Selection Sort', 'Selection Sort · AI #1', 'Selection Sort · AI #2']);
});

test('DSA: AI cham dung bai tap soan san dang mo (de + code C++), dat thi bai duoc tich', async () => {
  const u = userEvent.setup();
  const { gia, goiAi } = mo('/lesson/dsa/newbie/sorting?tab=exercise', { bang: { lesson_progress: [] }, ai: () => traCham(90) });
  await u.click(await screen.findByRole('button', { name: /Selection Sort/ }));
  await u.click(screen.getByRole('button', { name: /Dùng code khung/ }));
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText('90/100 điểm')).toBeInTheDocument();
  expect(goiAi[0].messages[0].content).toContain('Cài đặt selectionSort tăng dần');
  expect(goiAi[0].messages[0].content).toContain('void selectionSort');
  await waitFor(() => expect(daGhiXong(gia)).toBe(true));
});

test('C++: chay code ngay trong tab Bai tap (qua /api/run): hien ket qua; loi bien dich thi bao ro', async () => {
  const u = userEvent.setup();
  let lan = 0;
  const { thanChay } = mo('/lesson/dsa/newbie/sorting?tab=exercise', {
    chay: () => (lan++ === 0
      ? { stdout: 'Sắp xếp đúng rồi', stderr: '', maThoat: 0, dichVu: 'godbolt' }
      : { bienDichLoi: 'error: expected semicolon', dichVu: 'godbolt' })
  });
  await u.click(await screen.findByRole('button', { name: /Dùng code khung/ }));
  await u.click(screen.getByRole('button', { name: /Chạy Code/ }));
  expect(await screen.findByText('Sắp xếp đúng rồi')).toBeInTheDocument();
  expect(thanChay[0]).toMatchObject({ lang: 'cpp', code: 'void bubbleSort(vector<int>& a) {}' });
  await u.click(screen.getByRole('button', { name: /Chạy Code/ }));
  expect(await screen.findByText('error: expected semicolon')).toBeInTheDocument();
  expect(screen.getByText('Lỗi biên dịch')).toBeInTheDocument();
});

test('C++: tab Code Lab chay duoc code mau cua bai', async () => {
  const u = userEvent.setup();
  const { thanChay } = mo('/lesson/dsa/newbie/sorting?tab=code', {
    chay: () => ({ stdout: 'Code mẫu chạy xong', stderr: '', maThoat: 0, dichVu: 'godbolt' })
  });
  await u.click(await screen.findByRole('button', { name: /Chạy Code/ }));
  expect(await screen.findByText('Code mẫu chạy xong')).toBeInTheDocument();
  expect(thanChay[0]).toMatchObject({ lang: 'cpp', code: 'int main() {}' });
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
  await waitFor(() => expect(lanDich).toBeGreaterThan(0));
  await waitFor(() => expect(screen.queryByText('Đang dịch…')).not.toBeInTheDocument());
  expect(within(panel).getByText(/giá trị/)).toBeInTheDocument();
  expect(within(panel).getByText('#include <iostream> để dùng cout')).toBeInTheDocument();
});

test('tab Code: to mau, co nut chep, tab nam tren URL; bai khong co code thi noi ro', async () => {
  const u = userEvent.setup();
  const { router } = mo('/lesson/python/newbie/a', { bang: XONG_PY('a') });
  await u.click(await screen.findByRole('tab', { name: /Code Lab/ }));
  await waitFor(() => expect(router.state.location.search).toBe('?tab=code'));
  const panel = screen.getByRole('tabpanel');
  expect(panel.querySelector('pre code .token')).not.toBeNull();
  expect(within(panel).getByRole('button', { name: /Sao chép/ })).toBeInTheDocument();
  const ketQua = within(panel).getByRole('region', { name: 'Kết quả khi chạy' });
  expect(ketQua).toHaveTextContent(/^Kết quả khi chạy\s*1$/);
  await act(() => router.navigate('/lesson/python/newbie/b?tab=code'));
  expect(await screen.findByText('Chưa có mã ví dụ cho bài học này.')).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Kết quả khi chạy' })).not.toBeInTheDocument();
});

const QUIZ = [
  { question: 'Gán biến dùng dấu gì?', options: ['=', '==', ':='], correct: 0, explanation: 'Dấu = để gán' },
  { question: 'In ra màn hình?', code: 'print(1)', options: ['echo', 'print', 'say'], correct: 1, explanation: 'Gọi `print(1)` $\\rightarrow$ in **1**' }
];

test('quiz tren dien thoai: cau hoi khong bi code dai day rong trang; giai thich hien code/LaTeX dung', async () => {
  const u = userEvent.setup();
  mo('/lesson/python/newbie/a?tab=quiz', { ai: () => traText(JSON.stringify(QUIZ)) });
  await u.click(await screen.findByRole('button', { name: /Tạo Quiz với AI/ }));
  const cau2 = await screen.findByRole('group', { name: /Câu 2/ });
  expect(cau2).toHaveClass('min-w-0');
  await u.click(within(screen.getByRole('group', { name: /Câu 1/ })).getByRole('radio', { name: /^A/ }));
  await u.click(within(cau2).getByRole('radio', { name: /print/ }));
  await u.click(screen.getByRole('button', { name: 'Nộp bài (2/2)' }));
  await screen.findByText('Đúng 2/2 câu (100%)');
  expect(within(cau2).getByText('print(1)', { selector: 'code' })).toBeInTheDocument();
  expect(within(cau2).getByText('1', { selector: 'strong' })).toBeInTheDocument();
  expect(cau2.textContent).toContain('→ in');
  expect(cau2.textContent).not.toMatch(/`|\\rightarrow|\*\*/);
});

test('quiz di du vong: tao, chon, nop khi tra loi du, cham diem, giai thich, quiz moi', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=quiz', { ai: () => traText(JSON.stringify(QUIZ)) });
  await u.click(await screen.findByRole('button', { name: /Tạo Quiz với AI/ }));
  const nop = await screen.findByRole('button', { name: 'Nộp bài (0/2)' });
  expect(goiAi[0].taskType).toBe('quiz');

  const cau1 = screen.getByRole('group', { name: /Câu 1/ });
  const cau2 = screen.getByRole('group', { name: /Câu 2/ });
  expect(nop).toBeEnabled();
  await u.click(nop);
  expect(screen.getByText('Còn 2 câu chưa trả lời')).toHaveAttribute('role', 'alert');
  expect(within(cau1).getAllByRole('radio')[0]).toHaveFocus();
  expect(screen.queryByText(/Đúng \d\/2 câu/)).not.toBeInTheDocument();
  await u.click(within(cau1).getByRole('radio', { name: /==/ }));
  await u.click(within(cau2).getByRole('radio', { name: /print/ }));
  await u.click(screen.getByRole('button', { name: 'Nộp bài (2/2)' }));

  expect(await screen.findByText('Đúng 1/2 câu (50%)')).toBeInTheDocument();
  expect(screen.getByText('Khá tốt!')).toBeInTheDocument();
  expect(within(cau1).getByText('Sai')).toBeInTheDocument();
  expect(within(cau2).getByText('Đúng')).toBeInTheDocument();
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

const BANK = { ...BANK_SEED, lesson: 'a' } as QuestionBank;

test('ngan hang: AI tat van boc dung 1 de/2 trung binh/1 kho; cham, doi de khong lap, quay lai giu lua chon', async () => {
  const u = userEvent.setup();
  const { goiAi, router, qc } = mo('/lesson/python/newbie/a?tab=quiz', { bank: BANK, aiEnabled: false, bang: XONG_PY('a') });
  expect(await screen.findByText(/Ngân hàng 80 câu/)).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Bắt đầu quiz' }));
  await screen.findByRole('button', { name: 'Nộp bài (0/4)' });
  const groups = screen.getAllByRole('group', { name: /Câu \d/ });
  expect(groups).toHaveLength(4);
  expect(screen.getAllByText('Dễ')).toHaveLength(1);
  expect(screen.getAllByText('Trung bình')).toHaveLength(2);
  expect(screen.getAllByText('Khó')).toHaveLength(1);
  const originalIds: string[] = [];
  const drawn = qc.getQueryData<{ questions: { id: string }[] }>(['quiz', 'u1', 'python.newbie.a', 'vi', '/test-bank.json'])!.questions;
  for (const [i, group] of groups.entries()) {
    const original = BANK.questions.find(q => q.id === drawn[i].id);
    expect(original).toBeDefined();
    originalIds.push(original!.id);
    const labels = within(group).getAllByRole('radio');
    const correct = labels.find(radio => radio.parentElement?.querySelector('span:last-child')?.textContent?.trim() === original!.options[original!.correct]);
    expect(correct).toBeDefined();
    await u.click(correct!);
  }
  await act(() => router.navigate('/lesson/python/newbie/b?tab=quiz'));
  await screen.findByRole('heading', { level: 1, name: 'Vòng lặp' });
  await act(() => router.navigate('/lesson/python/newbie/a?tab=quiz'));
  await u.click(await screen.findByRole('button', { name: 'Nộp bài (4/4)' }));
  expect(await screen.findByText('Đúng 4/4 câu (100%)')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Làm quiz mới' }));
  await screen.findByRole('button', { name: 'Nộp bài (0/4)' });
  const nextIds = qc.getQueryData<{ questions: { id: string }[] }>(['quiz', 'u1', 'python.newbie.a', 'vi', '/test-bank.json'])!.questions.map(q => q.id);
  expect(nextIds.every(id => !originalIds.includes(id))).toBe(true);
  expect(goiAi).toHaveLength(0);
});

test('ngan hang hong hoac thieu cau: bao loi, khong tu goi AI mat phi', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=quiz', { bank: { ...BANK, questions: BANK.questions.slice(0, 4) } });
  await u.click(await screen.findByRole('button', { name: 'Bắt đầu quiz' }));
  expect((await screen.findByText(/Không tạo được quiz: Ngân hàng câu hỏi chưa hợp lệ/)).closest('[role="alert"]')).toBeInTheDocument();
  expect(screen.queryByRole('group', { name: /Câu 1/ })).not.toBeInTheDocument();
  expect(goiAi).toHaveLength(0);
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

test('gia su stream: hien dan cau tra loi khi AI dang viet, xong thi thanh tin nhan that', async () => {
  const u = userEvent.setup();
  let ghi!: (s: string) => void;
  let dong!: () => void;
  const { goiAi } = mo('/lesson/python/newbie/a', {
    ai: () => new Response(new ReadableStream({
      start(c) {
        ghi = s => c.enqueue(new TextEncoder().encode(s));
        dong = () => c.close();
      }
    }), { status: 200, headers: { 'content-type': 'text/event-stream' } })
  });
  const chat = await screen.findByRole('region', { name: /Hỏi Gia sư AI/ });
  await u.type(within(chat).getByRole('textbox'), 'Biến là gì?{Enter}');
  await waitFor(() => expect(goiAi).toHaveLength(1));
  expect((goiAi[0] as unknown as { stream?: boolean }).stream).toBe(true);
  await act(async () => { ghi('data: {"t":"Biến là "}\n\n'); });
  expect(await within(chat).findByText('Biến là')).toBeInTheDocument();
  expect(within(chat).getByRole('button', { name: 'Gửi' })).toBeDisabled();
  await act(async () => { ghi('data: {"t":"**hộp**"}\n\ndata: {"xong":true,"provider":"x"}\n\n'); dong(); });
  expect(await within(chat).findByText('hộp', { selector: 'strong' })).toBeInTheDocument();
  await waitFor(() => expect(within(chat).getByRole('button', { name: 'Gửi' })).toBeEnabled());
  expect(within(chat).getAllByText('hộp', { selector: 'strong' })).toHaveLength(1);
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
  const { router } = mo('/lesson/python/newbie/a', { bang: XONG_PY('a'), ai: () => new Promise(r => { tha = () => r(traText('Trả lời cho bài Biến')); }) });
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
  await u.click(await screen.findByRole('button', { name: 'Hủy' }));
  expect(within(chat).getByText('Chào bạn')).toBeInTheDocument();
  await u.click(within(chat).getByRole('button', { name: /Xóa hội thoại/ }));
  await u.click(await screen.findByRole('button', { name: 'Xóa' }));
  expect(await within(chat).findByText('Hỏi AI bất cứ điều gì về phần này!')).toBeInTheDocument();
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

test('bai tap co playground: IDE dung dung bo file cua bai (khong tron file mau), mo san file code chinh', async () => {
  const u = userEvent.setup();
  mo('/lesson/vue/newbie/intro');
  await moTabBaiTap(u);
  const soan = await screen.findByRole('textbox', { name: 'Soạn App.js' }) as HTMLTextAreaElement;
  expect(soan.value).toContain('Tu playground');
  const tab = screen.getAllByRole('tab').map(t => t.textContent);
  expect(tab).toEqual(expect.arrayContaining(['index.html', 'style.css', 'App.js']));
  expect(tab.filter(t => /\.(html|css|js|jsx)$/.test(t ?? ''))).toHaveLength(3);
});

test('bai tap Python: de goc hien nguyen van (Stack<T>); AI tao bai moi thanh tab AI #1; cau tra loi giu rieng tung bai', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=exercise', {
    ai: () => traText(JSON.stringify({ title: 'Tong hai so', description: 'Viết hàm **tong**', hints: ['Dùng +'], solution: 'def tong(a, b):\n    return a + b', solutionLang: 'python' }))
  });
  expect(await screen.findByText('Viết lớp Stack<T> có push và pop')).toBeInTheDocument();
  const soan = screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' });
  await u.type(soan, 'class Stack');
  expect(screen.queryByRole('button', { name: /Xem gợi ý/ })).not.toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /AI tạo bài tập mới/ }));
  expect(await screen.findByRole('button', { name: 'AI #1', pressed: true })).toBeInTheDocument();
  expect(goiAi[0].taskType).toBe('exercise');
  expect(goiAi[0].messages[0].content).toContain('Viết lớp Stack<T>');
  expect(screen.getByText('tong', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' })).toHaveValue('');
  await u.click(screen.getByRole('button', { name: /Xem gợi ý/ }));
  expect(screen.getByText('Dùng +')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /Xem solution mẫu/ }));
  expect(screen.getByRole('tabpanel').textContent).toMatch(/return a \+ b/);
  await u.click(screen.getByRole('button', { name: /Bài tập gốc/ }));
  expect(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' })).toHaveValue('class Stack');
});

test('cham bai: hien diem va nhan xet; HTML trong nhan xet hien nhu chu; loi AI co the cham lai', async () => {
  const u = userEvent.setup();
  let lan = 0;
  mo('/lesson/python/newbie/a?tab=exercise', {
    ai: () => (lan++ === 0 ? new Response('{"error":"AI bận"}', { status: 500 })
      : traText(JSON.stringify({ score: 70, status: 'partial', feedback: 'Thiếu pop <img src=x onerror=alert(1)>', errors: ['Chưa có pop'], suggestions: ['Thêm pop'], correctedCode: 'class Stack: pass' })))
  });
  await u.type(await screen.findByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' }), 'class Stack: push');
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText(/Không chấm được bài: AI bận/)).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /AI chấm bài/ }));
  expect(await screen.findByText('70/100 điểm')).toBeInTheDocument();
  expect(screen.getByText('Gần đúng')).toBeInTheDocument();
  expect(screen.getByText(/Thiếu pop <img src=x onerror=alert\(1\)>/)).toBeInTheDocument();
  expect(document.querySelector('[role=tabpanel] img')).toBeNull();
  expect(screen.getByText('Chưa có pop')).toBeInTheDocument();
});

test('o soan giu cau tra loi khi doi tab roi quay lai; gia su o tab Bai tap thay code hoc vien', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo('/lesson/python/newbie/a?tab=exercise', { ai: () => traText('ok') });
  await u.type(await screen.findByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' }), 'print(42)');
  await u.click(screen.getByRole('tab', { name: /Lý thuyết/ }));
  await moTabBaiTap(u);
  expect(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' })).toHaveValue('print(42)');
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
  await u.type(soan, ' // da sua', { initialSelectionStart: cu.length, initialSelectionEnd: cu.length });
  expect(soan.value).toBe(cu + ' // da sua');
  await u.click(screen.getByRole('tab', { name: /Lý thuyết/ }));
  await moTabBaiTap(u);
  expect(screen.getByRole('textbox', { name: 'Soạn App.jsx' })).toHaveValue(cu + ' // da sua');
});

test('sang trang app cu (tai trang moi) roi quay lai: cau tra loi, hoi thoai gia su, quiz da chon van con; khong treo "dang soan"', async () => {
  const u = userEvent.setup();
  const a = mo('/lesson/python/newbie/a?tab=exercise', {
    ai: b => (b.taskType === 'quiz' ? traText(JSON.stringify(QUIZ))
      : b.taskType === 'exercise' ? new Promise<Response>(() => {})
        : traText('Biến là **hộp** chứa giá trị'))
  });
  await u.type(await screen.findByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' }), 'class Stack');
  await u.click(screen.getByRole('button', { name: /AI tạo bài tập mới/ }));
  const chat = screen.getByRole('region', { name: /Hỏi Gia sư AI/ });
  await u.click(within(chat).getByRole('button', { name: 'Giải thích đơn giản' }));
  expect(await within(chat).findByText('hộp', { selector: 'strong' })).toBeInTheDocument();
  await u.click(screen.getByRole('tab', { name: /Trắc nghiệm Quiz/ }));
  await u.click(await screen.findByRole('button', { name: /Tạo Quiz với AI/ }));
  await u.click(within(await screen.findByRole('group', { name: /Câu 1/ })).getByRole('radio', { name: /==/ }));

  act(() => { window.dispatchEvent(new PageTransitionEvent('pagehide')); });
  a.unmount();

  mo('/lesson/python/newbie/a?tab=exercise');
  expect(await screen.findByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' })).toHaveValue('class Stack');
  expect(screen.getByRole('button', { name: /AI tạo bài tập mới/ })).toBeEnabled();
  expect(within(screen.getByRole('region', { name: /Hỏi Gia sư AI/ })).getByText('hộp', { selector: 'strong' })).toBeInTheDocument();
  await u.click(screen.getByRole('tab', { name: /Trắc nghiệm Quiz/ }));
  expect(within(await screen.findByRole('group', { name: /Câu 1/ })).getByRole('radio', { name: /==/ })).toBeChecked();
});

test('AI dang tao bai tap thi doi sang bai khac roi quay lai: van thay dang tao, xong thi hien AI #1, go tiep khong nhay bai', async () => {
  const u = userEvent.setup();
  let tha!: () => void;
  const { router, goiAi } = mo('/lesson/python/newbie/a?tab=exercise', {
    ai: () => new Promise(r => { tha = () => r(traText(JSON.stringify({ title: 'Tong', description: 'Viết hàm tong' }))); })
  });
  await u.click(await screen.findByRole('button', { name: /AI tạo bài tập mới/ }));
  await waitFor(() => expect(goiAi).toHaveLength(1));
  await act(() => router.navigate('/lesson/python/newbie/b?tab=exercise'));
  await act(() => router.navigate('/lesson/python/newbie/a?tab=exercise'));
  expect(await screen.findByRole('button', { name: /AI đang soạn bài tập/ })).toBeDisabled();
  await act(async () => { tha(); });
  expect(await screen.findByRole('button', { name: 'AI #1', pressed: true })).toBeInTheDocument();
  await u.type(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' }), 'x');
  expect(screen.getByRole('button', { name: 'AI #1', pressed: true })).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: /Bài tập gốc/ }));
  expect(screen.getByRole('textbox', { name: 'Viết code hoặc đáp án ở đây…' })).toHaveValue('');
  expect(goiAi).toHaveLength(1);
});

test('hoc theo thu tu: chua xong bai truoc thi bai nay bi khoa, chi duong ve bai can hoc', async () => {
  mo('/lesson/python/junior/c', { bang: XONG_PY('a') });
  expect(await screen.findByRole('heading', { level: 1, name: 'Bài này đang khoá' })).toBeInTheDocument();
  expect(screen.getByText(/Hoàn thành bài trước để mở khoá/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Vòng lặp/ })).toHaveAttribute('href', '/lesson/python/newbie/b');
  expect(screen.queryByRole('tab', { name: /Lý thuyết/ })).not.toBeInTheDocument();
});

test('hoc theo thu tu: tai tien do loi (mat mang) thi van hien bang khoa, khong xoay skeleton mai', async () => {
  mo('/lesson/python/junior/c', { loiDoc: { lesson_progress: 'Failed to fetch' } });
  expect(await screen.findByRole('heading', { level: 1, name: 'Bài này đang khoá' }, { timeout: 4000 })).toBeInTheDocument();
});

test('hoc theo thu tu: bai chua xong thi nut Bai tiep theo bi khoa, xong roi moi bam duoc', async () => {
  const { unmount } = mo('/lesson/python/newbie/a', { bang: { lesson_progress: [] } });
  expect(await tieuDe()).toHaveTextContent('Biến');
  expect(await screen.findByText(/Làm đạt bài tập để mở bài tiếp theo/)).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Bài tiếp theo/ })).not.toBeInTheDocument();
  unmount();
  mo('/lesson/python/newbie/a', { bang: XONG_PY('a') });
  expect(await screen.findByRole('link', { name: /Bài tiếp theo.*Vòng lặp/ })).toHaveAttribute('href', '/lesson/python/newbie/b');
});
