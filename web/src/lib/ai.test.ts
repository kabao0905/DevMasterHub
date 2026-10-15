import { docThan } from '@/test/doc-than';
import { apDungThietKe, chamBai, docJson, goiAi, hoiGiaSu, khopDapAn, nguCanhBai, suaThietKe, taoBaiTap, taoQuiz, taoThuThach } from './ai';
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
const body = (g: GoiFetch) => docThan(g.init.body);

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

test('body gui AI duoc boc base64: tuong lua Cloudflare khong chan vi lich su chat co "../../" hay "${..."', async () => {
  const goi = giaFetch(traText('ok'));
  await goiAi(client, { system: 's', user: 'mở ../../data rồi in `${ten}`', taskType: 'tutor', lang: 'vi' });
  const tho = String(goi[0].init.body);
  expect(Object.keys(JSON.parse(tho))).toEqual(['b64']);
  expect(tho).not.toContain('../');
  expect(body(goi[0]).messages[0].content).toBe('mở ../../data rồi in `${ten}`');
});

test('tuong lua chan (403 trang HTML, khong phai JSON cua server) thi bao cau de hieu, khong chi "403"', async () => {
  giaFetch(new Response('<html>Forbidden</html>', { status: 403, headers: { 'Content-Type': 'text/html' } }));
  await expect(goiAi(client, { system: 's', user: 'u', taskType: 'tutor', lang: 'vi' })).rejects.toThrow(/bị chặn/);
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

describe('bai tap AI', () => {
  test('tao bai tap: gui taskType exercise, ly thuyet da bo the, bai cu de tranh trung; chuan hoa ket qua', async () => {
    const goi = giaFetch(traText('Day: {"title":"Tong hai so","content":"Viet ham tong(a,b)","hints":["dung +",3,""],"solution":"def tong(a,b): return a+b","solutionLang":"python\\" onclick=x"}'));
    const bt = await taoBaiTap(client, { ...BAI, cu: 'Bai goc: in ra man hinh', lang: 'vi' });
    expect(bt).toMatchObject({ title: 'Tong hai so', description: 'Viet ham tong(a,b)', hints: ['dung +'], solution: 'def tong(a,b): return a+b' });
    expect(bt.solutionLang).toBeUndefined();
    const b = body(goi[0]);
    expect(b.taskType).toBe('exercise');
    expect(b.messages[0].content).toContain('Biến lưu giá trị');
    expect(b.messages[0].content).toContain('Bai goc: in ra man hinh');
  });

  test('tao bai tap: khong co mo ta hoac khong phai JSON thi bao loi', async () => {
    giaFetch(traText('{"title":"X"}'));
    await expect(taoBaiTap(client, { ...BAI, lang: 'vi' })).rejects.toThrow('AI trả về bài tập không hợp lệ');
    giaFetch(traText('xin loi'));
    await expect(taoBaiTap(client, { ...BAI, lang: 'vi' })).rejects.toThrow('AI trả về bài tập không hợp lệ');
  });

  test('cham bai: diem kep 0..100, status la thi suy theo diem, mang chi giu chuoi', async () => {
    const goi = giaFetch(traText('{"score":"150","status":"tuyet","feedback":"Tot","errors":["thieu return",{}],"suggestions":"khong phai mang"}'));
    const nx = await chamBai(client, { tech: { name: 'Python' }, deBai: 'Viet ham tong', baiLam: 'def tong(a,b): a+b', ngonNgu: 'python', lang: 'vi' });
    expect(nx).toEqual({ score: 100, status: 'correct', feedback: 'Tot', errors: ['thieu return'], suggestions: [], correctedCode: undefined });
    const b = body(goi[0]);
    expect(b).toMatchObject({ taskType: 'checkAnswer', temperature: 0.3 });
    expect(b.messages[0].content).toContain('```python\ndef tong(a,b): a+b\n```');
    giaFetch(traText('{"score":30,"status":"partial"}'));
    expect((await chamBai(client, { tech: { name: 'Python' }, deBai: 'x', baiLam: 'y', ngonNgu: 'python', lang: 'vi' })).status).toBe('partial');
    giaFetch(traText('{"feedback":"khong co diem"}'));
    await expect(chamBai(client, { tech: { name: 'Python' }, deBai: 'x', baiLam: 'y', ngonNgu: 'python', lang: 'vi' })).rejects.toThrow('AI chấm bài không hợp lệ');
  });

  test('sua thiet ke: JSON hong (xuong dong tho trong chuoi) hay bi cat ngang thi bao loi, KHONG sua tep nao', async () => {
    const files = { 'index.html': '<div class="card">x</div>' };
    giaFetch(traText('{"edits":[{"type":"file","file":"index.html","content":"<main>\ndong 2</main>"}],"explain":"x"}'.replace('\\n', '\n')));
    await expect(suaThietKe(client, { yeuCau: 'x', chon: null, files, lang: 'vi' })).rejects.toThrow('AI trả về không đúng định dạng');
    giaFetch(traText('{"edits":[{"type":"file","file":"index.html","content":"<main class=\\"card\\">bi cat'));
    await expect(suaThietKe(client, { yeuCau: 'x', chon: null, files, lang: 'vi' })).rejects.toThrow('AI trả về không đúng định dạng');
    giaFetch(traText('{"edits":[{"type":"file","file":"index.html","content":""}],"explain":"xoa"}'));
    await expect(suaThietKe(client, { yeuCau: 'x', chon: null, files, lang: 'vi' })).rejects.toThrow('AI không đề xuất thay đổi nào.');
  });

  test('sua thiet ke: chi giu chinh sua hop le, tep phai dang co; ap dung vao style.css va tep', async () => {
    const files = { 'index.html': '<div class="card">x</div>', 'style.css': '.card { color: red; }' };
    giaFetch(traText(JSON.stringify({ edits: [
      { type: 'css', selector: '.card', props: { color: 'blue', padding: 12 } },
      { type: 'file', file: 'hack.js', content: 'x' },
      { type: 'css', selector: '.a' },
      { type: 'file', file: 'index.html', content: '<main class="card">y</main>' }
    ], explain: 'Đổi màu chữ' })));
    const kq = await suaThietKe(client, { yeuCau: 'đổi màu chữ', chon: { tag: 'div', selector: '.card' }, files, lang: 'vi' });
    expect(kq.edits).toHaveLength(2);
    expect(kq.explain).toBe('Đổi màu chữ');
    const ap = apDungThietKe(files, kq.edits);
    expect(ap.soThayDoi).toBe(2);
    expect(ap.files['style.css']).toContain('color: blue');
    expect(ap.files['index.html']).toBe('<main class="card">y</main>');
    expect(files['style.css']).toBe('.card { color: red; }');
    giaFetch(traText('{"edits":[{"type":"file","file":"khac.js","content":"x"}]}'));
    await expect(suaThietKe(client, { yeuCau: 'x', chon: null, files, lang: 'vi' })).rejects.toThrow('AI không đề xuất thay đổi nào.');
  });

  const MAY = {
    lenh: ['ls', 'cat', 'grep'],
    tep: { '/var/log/auth.log': 'Failed password for root from 10.0.0.66 port 22' },
    dauRa: { 'ps aux': 'root 1 init' }
  };
  const deThuThach = (o: object) => traText(JSON.stringify({
    title: 'Tim IP do mat khau', level: 'Dễ', scenario: 'Có kẻ dò mật khẩu SSH', steps: ['Đọc log đăng nhập'],
    hint: 'dùng grep Failed', question: 'IP nào đang dò mật khẩu?', ...o
  }));

  test('ra de thu thach: gui noi dung tep va ket qua lenh that; dap an co that trong du lieu thi nhan', async () => {
    const goi = giaFetch(deThuThach({ answer: '10.0.0.66' }));
    const tt = await taoThuThach(client, { ...MAY, lang: 'vi', cho: khongCho });
    expect(tt).toMatchObject({ title: 'Tim IP do mat khau', question: 'IP nào đang dò mật khẩu?', answer: '10.0.0.66', steps: ['Đọc log đăng nhập'] });
    const b = body(goi[0]);
    expect(b.system).toContain('ls, cat, grep');
    expect(b.system).toContain('Failed password for root from 10.0.0.66 port 22');
    expect(b.system).toContain('root 1 init');
  });

  test('ra de thu thach: dap an bia (khong co trong du lieu) hoac lo ngay trong de thi tu ra lai; hai lan deu hong thi bao loi', async () => {
    let goi = giaFetch(deThuThach({ answer: '1.2.3.4' }), deThuThach({ answer: '10.0.0.66' }));
    expect((await taoThuThach(client, { ...MAY, lang: 'vi', cho: khongCho })).answer).toBe('10.0.0.66');
    expect(goi).toHaveLength(2);
    goi = giaFetch(deThuThach({ answer: '10.0.0.66', hint: 'IP là 10.0.0.66' }), traText('khong phai json'));
    await expect(taoThuThach(client, { ...MAY, lang: 'vi', cho: khongCho })).rejects.toThrow('AI ra đề không hợp lệ');
    expect(goi).toHaveLength(2);
  });

  test('ra de thu thach: AI tu them tep vao terminal; tep hop le duoc giu, duong dan xau / ghi de tep co san bi bo', async () => {
    giaFetch(deThuThach({
      question: 'Mật khẩu bị lộ là gì?', answer: 'S3cr3t!99',
      files: [
        { path: '/home/hacker/backup/.env', content: 'DB_USER=admin\nDB_PASS=S3cr3t!99\n' },
        { path: '/var/log/app/error.log', content: 'ERROR ket noi DB that bai' },
        { path: '../../thoat.txt', content: 'x' },
        { path: '/bin/ls', content: 'x' },
        { path: '/var/log/auth.log', content: 'ghi de log cu' },
        { path: '/home/hacker/rong.txt', content: 42 }
      ]
    }));
    const tt = await taoThuThach(client, { ...MAY, lang: 'vi', cho: khongCho });
    expect(tt.answer).toBe('S3cr3t!99');
    expect(tt.files).toEqual([
      { path: '/home/hacker/backup/.env', content: 'DB_USER=admin\nDB_PASS=S3cr3t!99\n' },
      { path: '/var/log/app/error.log', content: 'ERROR ket noi DB that bai' }
    ]);
  });

  test('ra de thu thach: dap an chi nam trong tep bi bo (ghi de tep co san) thi ra lai', async () => {
    const goi = giaFetch(
      deThuThach({ answer: 'khoa-bi-mat', files: [{ path: '/var/log/auth.log', content: 'khoa-bi-mat' }] }),
      deThuThach({ answer: 'khoa-bi-mat', files: [{ path: '/tmp/ghichu.txt', content: 'khoa-bi-mat' }] })
    );
    const tt = await taoThuThach(client, { ...MAY, lang: 'vi', cho: khongCho });
    expect(goi).toHaveLength(2);
    expect(tt.files).toEqual([{ path: '/tmp/ghichu.txt', content: 'khoa-bi-mat' }]);
    expect(body(goi[0]).system).toContain('"files"');
  });

  test('so dap an: khong phan biet hoa thuong, bo khoang trang va dau nhay bao ngoai', () => {
    expect(khopDapAn('10.0.0.66', ' 10.0.0.66 ')).toBe(true);
    expect(khopDapAn('FLAG{abc}', '"flag{ABC}"')).toBe(true);
    expect(khopDapAn('4444', '444')).toBe(false);
    expect(khopDapAn('4444', '')).toBe(false);
  });

  test('ngu canh tab Bai tap: bai AI dang lam, code hoc vien, ly thuyet phu', () => {
    const nc = nguCanhBai({ ...BAI, tab: 'exercise', baiTap: { hienTai: { title: 'Tong', description: 'Viet ham tong', hints: ['dung +'] }, code: 'def tong(): pass' } });
    expect(nc).toContain('Tiêu đề: Tong');
    expect(nc).toContain('Gợi ý: dung +');
    expect(nc).toContain('=== CODE HỌC VIÊN ĐÃ VIẾT ===\ndef tong(): pass');
    expect(nc).toContain('Lý thuyết tham khảo (phụ)');
  });
});
