import { docJson, goiAi, hoiGiaSu, nguCanhBai, taoQuiz } from './ai';
import type { SupabaseLike } from './auth';

const client = { auth: { getSession: async () => ({ data: { session: { access_token: 'tk' } } }) } } as unknown as SupabaseLike;
const khongCho = vi.fn(async () => {});

type GoiFetch = { url: string; init: RequestInit };
function giaFetch(...traLoi: (Response | Error | DOMException)[]) {
  const goi: GoiFetch[] = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
    goi.push({ url, init });
    const r = traLoi.shift();
    if (!r) throw new Error('het tra loi gia');
    if (!(r instanceof Response)) throw r;
    return r;
  }));
  return goi;
}
const traText = (text: string) => new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { status: 200 });
const body = (g: GoiFetch) => JSON.parse(String(g.init.body));

afterEach(() => { vi.unstubAllGlobals(); khongCho.mockClear(); });

test('goi /api/ai kem token, taskType va chi thi ngon ngu cua nguoi hoc', async () => {
  const goi = giaFetch(traText('xin chao'));
  expect(await goiAi(client, { system: 'He thong', user: 'Hoi', taskType: 'tutor', lang: 'en', temperature: 0.7, maxTokens: 1000 })).toBe('xin chao');
  expect(goi[0].url).toBe('/api/ai');
  expect((goi[0].init.headers as Record<string, string>).Authorization).toBe('Bearer tk');
  const b = body(goi[0]);
  expect(b).toMatchObject({ messages: [{ role: 'user', content: 'Hoi' }], taskType: 'tutor', temperature: 0.7, max_tokens: 1000 });
  expect(b.system).toMatch(/^He thong/);
  expect(b.system).toContain('respond 100% completely and naturally in English');
});

test('may chu qua tai (429) thi cho theo Retry-After roi thu lai', async () => {
  const goi = giaFetch(new Response('{}', { status: 429, headers: { 'Retry-After': '3' } }), traText('ok'));
  expect(await goiAi(client, { system: 's', user: 'u', taskType: 'quiz', lang: 'vi', cho: khongCho })).toBe('ok');
  expect(goi).toHaveLength(2);
  expect(khongCho).toHaveBeenCalledWith(3000);
});

test('qua tai mai thi bo cuoc sau 2 lan thu lai; 401 bao dang nhap', async () => {
  giaFetch(...[1, 2, 3].map(() => new Response('{"error":"Quá nhiều yêu cầu"}', { status: 429 })));
  await expect(goiAi(client, { system: 's', user: 'u', taskType: 'quiz', lang: 'vi', cho: khongCho })).rejects.toThrow('Quá nhiều yêu cầu');
  giaFetch(new Response('{}', { status: 401 }));
  await expect(goiAi(client, { system: 's', user: 'u', taskType: 'quiz', lang: 'vi' })).rejects.toThrow('Bạn cần đăng nhập để dùng tính năng AI.');
});

test('doc JSON ca khi AI boc trong ``` hoac them chu thua', () => {
  expect(docJson('```json\n[1,2]\n```')).toEqual([1, 2]);
  expect(docJson('Day la quiz: [{"a":1}] het')).toEqual([{ a: 1 }]);
  expect(() => docJson('khong co json')).toThrow();
});

const BAI = {
  tech: { name: 'Python' }, level: { name: 'Newbie' },
  lesson: { id: 'a', title: 'Biến', theory: '<p>Biến <strong>lưu</strong> giá trị</p>', keyPoints: ['Dùng <code>=</code> để gán'], code: 'x = 1', lang: 'python' }
};
const cau = (them: Record<string, unknown> = {}) => ({ question: 'Q?', options: ['a', 'b', 'c', 'd'], correct: 1, explanation: 'vi b', ...them });

test('tao quiz: bo cau hong (dap an ngoai khoang, it hon 3 lua chon, lua chon khong phai chu), cat dung so cau', async () => {
  const ds = [cau(), cau({ correct: 7 }), cau({ options: ['a', 'b'] }), cau({ options: ['a', 2, 'c'] }), cau({ explanation: '' }), cau({ correct: 1.5 }), cau(), cau(), cau(), cau()];
  const goi = giaFetch(traText(JSON.stringify(ds)));
  const q = await taoQuiz(client, { ...BAI, lang: 'vi', soCau: 4 });
  expect(q).toHaveLength(4);
  expect(q.every(x => x.correct === 1)).toBe(true);
  const b = body(goi[0]);
  expect(b.taskType).toBe('quiz');
  expect(b.messages[0].content).toContain('Biến lưu giá trị');
  expect(b.messages[0].content).not.toContain('<strong>');
});

test('tao quiz: khong con cau nao hop le hoac khong phai JSON thi bao loi', async () => {
  giaFetch(traText(JSON.stringify([cau({ correct: 9 })])));
  await expect(taoQuiz(client, { ...BAI, lang: 'vi' })).rejects.toThrow('AI trả về quiz không hợp lệ');
  giaFetch(traText('Xin loi, toi khong the'));
  await expect(taoQuiz(client, { ...BAI, lang: 'vi' })).rejects.toThrow('AI trả về quiz không hợp lệ');
});

test('ngu canh tab quiz: chua nop thi khong lo dap an, nop roi thi co dap an va lua chon cua hoc vien', () => {
  const quiz = { questions: [cau()], answers: { 0: 0 }, submitted: false };
  const truoc = nguCanhBai({ ...BAI, tab: 'quiz', quiz });
  expect(truoc).toContain('Câu 1: Q?');
  expect(truoc).toContain('CHƯA NỘP');
  expect(truoc).not.toContain('Đáp án đúng');
  const sau = nguCanhBai({ ...BAI, tab: 'quiz', quiz: { ...quiz, submitted: true } });
  expect(sau).toContain('→ Đáp án đúng: B');
  expect(sau).toContain('→ Học viên chọn: A (sai)');
});

test('ngu canh theo tab dang mo: ly thuyet bo the HTML, tab code co khoi code', () => {
  const lyThuyet = nguCanhBai({ ...BAI, tab: 'theory' });
  expect(lyThuyet).toContain('Biến lưu giá trị');
  expect(lyThuyet).toContain('1. Dùng = để gán');
  expect(nguCanhBai({ ...BAI, tab: 'code' })).toContain('```python\nx = 1\n```');
});

test('hoi gia su: chi gui 10 tin gan nhat, nhan theo vai, quy tac khong lo dap an khi chua nop quiz', async () => {
  const goi = giaFetch(traText('tra loi'));
  const lichSu = Array.from({ length: 12 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: `tin ${i}` } as const));
  await hoiGiaSu(client, { nguCanh: 'NC', lichSu, cauHoi: 'Cau moi?', tab: 'quiz', daNopQuiz: false, lang: 'vi' });
  const b = body(goi[0]);
  const noiDung: string = b.messages[0].content;
  expect(noiDung).not.toContain('tin 1\n');
  expect(noiDung).toContain('Học viên: tin 2');
  expect(noiDung).toContain('Gia sư: tin 11');
  expect(noiDung.endsWith('Cau moi?')).toBe(true);
  expect(b.taskType).toBe('tutor');
  expect(b.system).toContain('NGHIÊM CẤM nói đáp án đúng');
  expect(b.system).toContain('NC');
});

test('tao quiz: AI ghi "code": null cho cau khong co code thi van nhan cau do', async () => {
  giaFetch(traText(JSON.stringify([cau({ code: null }), cau({ code: '' }), cau({ code: 'x = 1' })])));
  const q = await taoQuiz(client, { ...BAI, lang: 'vi' });
  expect(q).toHaveLength(3);
  expect(q.map(x => x.code)).toEqual([undefined, undefined, 'x = 1']);
});

test('loi mang/het gio hien bang loi de hieu, khong phai "Failed to fetch" hay "signal timed out"', async () => {
  giaFetch(new TypeError('Failed to fetch'), new TypeError('Failed to fetch'));
  await expect(goiAi(client, { system: 's', user: 'u', taskType: 'tutor', lang: 'vi', cho: khongCho }))
    .rejects.toThrow('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
  giaFetch(new DOMException('signal timed out', 'TimeoutError'));
  await expect(goiAi(client, { system: 's', user: 'u', taskType: 'tutor', lang: 'vi', cho: khongCho }))
    .rejects.toThrow('AI phản hồi quá lâu. Thử lại sau ít phút.');
});
