// Logic Project Lab: ban nop, phan tich tinh, cham nhieu tang, chuan hoa du lieu AI, prompt trung ban cu.
import NGUON_AI_CU from '../../../public/ai-service.js?raw';
import {
  chamDuAn, chuanHoaKetQua, chuanHoaYTuong, hoiMentor, nguCanhDuAn, nhomModule, phanTichTatCa, phanTichTinh, taoBanNop, taoYTuong,
  type TepDuAn, type TienDoCham, type YTuong
} from './project-ai';
import type { SupabaseLike } from './auth';

const client = { auth: { getSession: async () => ({ data: { session: null } }) } } as unknown as SupabaseLike;
const khongCho = async () => {};

type ThanGui = { system: string; messages: { role: string; content: string }[]; temperature: number; max_tokens: number; taskType: string };

/** fetch gia cho /api/ai: ghi lai body, tra loi theo ham `traLoi` */
function giaAi(traLoi: (b: ThanGui) => string | Error) {
  const goi: ThanGui[] = [];
  vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) => {
    const b = JSON.parse(String(init?.body)) as ThanGui;
    goi.push(b);
    const r = traLoi(b);
    if (r instanceof Error) return new Response(JSON.stringify({ error: r.message }), { status: 500 });
    return new Response(JSON.stringify({ content: [{ type: 'text', text: r }] }), { status: 200 });
  }));
  return goi;
}
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const IDEA: YTuong = {
  name: 'Todo App', description: 'Quản lý việc cần làm', difficulty: 'mid', techStack: ['JS'],
  requirements: ['Thêm việc', 'Xóa việc'], steps: [], bonusFeatures: [], estimatedTime: '6-10 giờ'
};

const REVIEW = {
  score: 78, status: 'good', summary: 'Code gọn, thiếu xử lý lỗi.',
  criteria: [
    { name: 'Cấu trúc project', score: 14, comment: '' },
    { name: 'Code quality', score: 16, comment: '' },
    { name: 'Logic & Algorithm', score: 15, comment: '' },
    { name: 'Error handling', score: 10, comment: '' },
    { name: 'Bonus & Creativity', score: 12, comment: '' }
  ],
  strengths: ['Đặt tên rõ ràng'], improvements: ['Thêm try/catch'], tips: []
};

// ── Ban nop (chep tu tests/project-submission.test.js cua app cu) ──

test('ban nop mang dung diem/nhan xet tu ket qua cham', () => {
  const b = taoBanNop({
    review: chuanHoaKetQua(REVIEW), idea: IDEA,
    files: [{ name: 'app.js', lang: 'javascript', code: 'let a = 1;' }, { name: 'index.html', lang: 'html', code: '<p>' }],
    difficulty: 'mid', topic: 'web'
  });
  expect(b).toMatchObject({
    projectName: 'Todo App', projectDescription: 'Quản lý việc cần làm', difficultyLevel: 'mid', topic: 'web',
    scoreOverall: 78, scoreCodeQuality: 80, scoreFunctionality: 75, scoreBestPractices: 60, scoreCreativity: 60,
    aiFeedback: 'Code gọn, thiếu xử lý lỗi.', aiStrengths: ['Đặt tên rõ ràng'], aiImprovements: ['Thêm try/catch'],
    languagesUsed: ['javascript', 'html']
  });
  expect(b.files).toHaveLength(2);
});

test('AI doi ten tieu chi thi van map theo vi tri, khong de null', () => {
  const review = chuanHoaKetQua({ ...REVIEW, criteria: REVIEW.criteria.map((c, i) => ({ ...c, name: 'Tiêu chí ' + i })) });
  const b = taoBanNop({ review, idea: { ...IDEA, name: 'X' }, files: [] });
  expect(b.scoreCodeQuality).toBe(80);
  expect(b.scoreCreativity).toBe(60);
});

// ── Phan tich tinh ──

test('phan tich tinh JS: var, ==, eval, catch rong; diem tru theo muc do', () => {
  const kq = phanTichTinh('var x = 1;\nif (x == 2) {}\neval("1");\ntry { a() } catch (e) {}\n', 'app.js');
  const loai = kq.issues.map(i => i.severity);
  expect(kq.errorCount).toBe(2); // eval, catch rong
  expect(loai.filter(s => s === 'warning').length).toBeGreaterThanOrEqual(2); // var, ==
  expect(kq.score).toBeLessThan(80);
  expect(kq.grade).toMatch(/[A-F]/);
  expect(kq.issues.find(i => /eval/.test(i.message))?.line).toBe(3);
});

test('phan tich tinh HTML va Python', () => {
  const html = phanTichTinh('<html><body><h1>a</h1><h1>b</h1></body></html>', 'index.html');
  expect(html.issues.map(i => i.message).join(' ')).toMatch(/viewport.*title|title.*viewport/s);
  const py = phanTichTinh('try:\n    x()\nexcept:\n    pass\n', 'main.py');
  expect(py.issues.some(i => i.severity === 'error' && /except/.test(i.message))).toBe(true);
  const tatCa = phanTichTatCa([{ name: 'a.js', lang: 'javascript', code: 'const a = 1;' }, { name: 'b.js', lang: 'javascript', code: '   ' }]);
  expect(tatCa.files).toHaveLength(1);
});

test('nhom file theo module; ngon ngu la vao nhom logic', () => {
  const m = nhomModule([
    { name: 'index.html', lang: 'html', code: 'x' }, { name: 'a.css', lang: 'css', code: 'x' },
    { name: 'a.js', lang: 'javascript', code: 'x' }, { name: 'x.lua', lang: 'lua', code: 'x' }, { name: 'p.json', lang: 'json', code: 'x' }
  ]);
  expect(m.map(x => x.id)).toEqual(['markup', 'styles', 'logic', 'config']);
  expect(m.find(x => x.id === 'logic')?.files.map(f => f.name)).toEqual(['a.js', 'x.lua']);
});

// ── Chuan hoa du lieu AI: React nem loi neu ve object lam con, nen phai loc truoc ──

test('idea AI sai kieu: loc mang chi con chu, thieu ten thi bao khong hop le', () => {
  const y = chuanHoaYTuong({ name: 'Game', description: 5, difficulty: 'xyz', techStack: ['JS', { a: 1 }, 3], requirements: 'khong phai mang' }, 'junior');
  expect(y).toEqual({ name: 'Game', description: '5', difficulty: 'junior', techStack: ['JS', '3'], requirements: [], steps: [], bonusFeatures: [], estimatedTime: '' });
  expect(() => chuanHoaYTuong({ description: 'x' }, 'mid')).toThrow(/không hợp lệ/);
  expect(() => chuanHoaYTuong(['x'], 'mid')).toThrow(/không hợp lệ/);
});

test('ket qua cham sai kieu: diem kep 0..100, trang thai suy tu diem, tieu chi kep 0..20', () => {
  const k = chuanHoaKetQua({ score: '250', status: 'tuyet', summary: { x: 1 }, criteria: [{ name: 'A', score: 99 }, 'rac'], strengths: [{ a: 1 }, 'Tốt'] });
  expect(k.score).toBe(100);
  expect(k.status).toBe('excellent');
  expect(k.summary).toBe('');
  expect(k.criteria).toEqual([{ name: 'A', score: 20, comment: '' }]);
  expect(k.strengths).toEqual(['Tốt']);
  expect(chuanHoaKetQua({ score: 40 }).status).toBe('needs_work');
});

// ── Goi AI ──

test('tao idea: gui taskType projectIdea, chuan hoa ket qua; AI tra rac thi bao loi', async () => {
  const goi = giaAi(() => JSON.stringify({ name: 'Snake', description: 'Rắn săn mồi', difficulty: 'newbie', techStack: ['Canvas'] }));
  const y = await taoYTuong(client, { level: 'newbie', topic: null, lang: 'vi', cho: khongCho, ngauNhien: () => 0 });
  expect(y.name).toBe('Snake');
  expect(goi[0].taskType).toBe('projectIdea');
  expect(goi[0].temperature).toBe(0.95);
  giaAi(() => 'xin loi toi khong biet');
  await expect(taoYTuong(client, { level: 'mid', topic: 'Game', lang: 'vi', cho: khongCho })).rejects.toThrow();
});

test('ngu canh mentor: co ten/mo ta/yeu cau va code tung file; file dai bi cat giua', () => {
  const dai = 'a'.repeat(9000);
  const s = nguCanhDuAn(IDEA, [{ name: 'app.js', lang: 'javascript', code: 'let x = 1;' }, { name: 'big.js', lang: 'javascript', code: dai }, { name: 'rong.js', lang: 'javascript', code: '  ' }]);
  expect(s).toContain('Project: Todo App');
  expect(s).toContain('Yêu cầu: Thêm việc, Xóa việc');
  expect(s).toContain('--- File: app.js (javascript, 1 lines) ---');
  expect(s).toContain('middle section omitted');
  expect(s).not.toContain('rong.js');
  expect(nguCanhDuAn(IDEA, [{ name: 'a.js', lang: 'javascript', code: '' }])).not.toContain('Code hiện tại');
});

test('chat mentor gui lich su va cau hoi, taskType projectChat', async () => {
  const goi = giaAi(() => 'Dùng **map**');
  const tl = await hoiMentor(client, { nguCanh: 'Project: X', lichSu: [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Chào' }], cauHoi: 'Làm sao?', lang: 'vi', cho: khongCho });
  expect(tl).toBe('Dùng **map**');
  expect(goi[0].taskType).toBe('projectChat');
  expect(goi[0].messages[0].content).toBe('Lịch sử hội thoại:\nHọc viên: Hi\nMentor: Chào\n\nLàm sao?');
  expect(goi[0].system).toContain('Project: X');
});

const TRA_CAU_TRUC = JSON.stringify({ structureScore: 70, naming: 'Ổn', organization: 'Gọn', completeness: 'Đủ', missingFiles: [], suggestions: ['Thêm README'] });
const traModule = (b: ThanGui) => JSON.stringify({
  moduleId: /MODULE "📄/.test(b.messages[0].content) ? 'markup' : 'logic', moduleLabel: 'M', score: 80, codeQuality: 8, logic: 8, errorHandling: 6, relevance: 9, cohesion: 7,
  summary: 'Tốt', fileScores: [{ file: 'app.js', score: 81 }], issues: ['Thiếu test'], positives: ['Rõ ràng']
});
const TRA_TONG = JSON.stringify(REVIEW);
const traLoiCham = (b: ThanGui) => (/CẤU TRÚC project/.test(b.system) ? TRA_CAU_TRUC : /MODULE/.test(b.system) ? traModule(b) : TRA_TONG);

const FILES: TepDuAn[] = [
  { name: 'index.html', lang: 'html', code: '<html lang="vi"><title>a</title></html>' },
  { name: 'app.js', lang: 'javascript', code: 'const tong = (a, b) => a + b;' },
  { name: 'rong.css', lang: 'css', code: '' }
];

test('cham project: 1 lan cau truc + 1 lan moi module + 1 lan tong hop, bao tien do tung buoc', async () => {
  const goi = giaAi(traLoiCham);
  const buoc: TienDoCham[] = [];
  const kq = await chamDuAn(client, { idea: IDEA, files: FILES, lang: 'vi', khiTienDo: b => buoc.push(b), cho: khongCho });
  expect(goi).toHaveLength(4); // cau truc, markup, logic, tong hop (file rong khong cham)
  expect(goi.slice(1).every(b => b.taskType === 'projectReview')).toBe(true);
  expect(buoc.map(b => b.buoc)).toEqual(['tinh', 'cauTruc', 'module', 'module', 'tongHop']);
  expect(buoc[2]).toMatchObject({ i: 1, n: 2 });
  expect(kq.score).toBe(78);
  expect(kq.structureReview?.structureScore).toBe(70);
  expect(kq.moduleReviews).toHaveLength(2);
  expect(kq.perFileReviews[0]).toMatchObject({ fileName: 'app.js', score: 81, summary: 'Tốt' });
  expect(kq.localAnalysis?.files.map(f => f.fileName)).toEqual(['index.html', 'app.js']);
});

test('cham project: cau truc / mot module loi thi van cham tiep; tong hop loi thi bao loi', async () => {
  giaAi(b => (/CẤU TRÚC project/.test(b.system) ? new Error('AI bận') : /MODULE/.test(b.system) && /📄/.test(b.messages[0].content) ? new Error('quá tải') : traLoiCham(b)));
  const kq = await chamDuAn(client, { idea: IDEA, files: FILES, lang: 'vi', cho: khongCho });
  expect(kq.structureReview).toMatchObject({ structureScore: 0, suggestions: ['Lỗi: AI bận'] });
  const hong = kq.moduleReviews.find(m => m.moduleId === 'markup');
  expect(hong).toMatchObject({ score: 0, issues: ['Không thể đánh giá'] });
  expect(hong?.summary).toContain('quá tải');

  giaAi(b => (/Tổng hợp/.test(b.system) ? new Error('hết lượt') : traLoiCham(b)));
  await expect(chamDuAn(client, { idea: IDEA, files: FILES, lang: 'vi', cho: khongCho })).rejects.toThrow('hết lượt');
  await expect(chamDuAn(client, { idea: IDEA, files: [{ name: 'a.js', lang: 'javascript', code: ' ' }], lang: 'vi', cho: khongCho })).rejects.toThrow(/Không có file code/);
});

test('huy giua chung (roi trang): dung ngay, khong cham tiep cac module con lai', async () => {
  const ac = new AbortController();
  const goi = giaAi(b => { if (/CẤU TRÚC project/.test(b.system)) ac.abort(); return traLoiCham(b); });
  await expect(chamDuAn(client, { idea: IDEA, files: FILES, lang: 'vi', signal: ac.signal, cho: khongCho })).rejects.toThrow();
  expect(goi.length).toBeLessThanOrEqual(2);
});

// ── Prompt trung nguyen van ban cu ──

/** Nap public/ai-service.js voi I18n/AuthService/fetch gia, ghi lai body gui /api/ai */
function napCu(lang: string, traLoi: (b: ThanGui) => string) {
  const goi: ThanGui[] = [];
  const fetchCu = async (_u: string, init: RequestInit) => {
    const b = JSON.parse(String(init.body)) as ThanGui;
    goi.push(b);
    return new Response(JSON.stringify({ content: [{ text: traLoi(b) }] }), { status: 200 });
  };
  const AIService = new Function('I18n', 'AuthService', 'fetch', NGUON_AI_CU + '\nreturn AIService;')(
    { getLang: () => lang }, { isConfigured: () => false }, fetchCu
  ) as Record<string, (...a: unknown[]) => Promise<unknown>>;
  return { AIService, goi };
}

test.each(['vi', 'en'])('prompt tao idea (cap do va chu de) trung ban cu — %s', async lang => {
  const tra = () => JSON.stringify({ name: 'X', description: 'Y' });
  vi.spyOn(Math, 'random').mockReturnValue(0.42);
  const { AIService, goi: cu } = napCu(lang, tra);
  await AIService.generateProjectIdea('senior');
  await AIService.generateProjectIdea(null, 'Game');
  const moi = giaAi(tra);
  await taoYTuong(client, { level: 'senior', topic: null, lang, cho: khongCho, ngauNhien: () => 0.42 });
  await taoYTuong(client, { level: null, topic: 'Game', lang, cho: khongCho, ngauNhien: () => 0.42 });
  const boViec = (b: ThanGui) => ({ ...b, taskType: undefined });
  expect(moi.map(boViec)).toEqual(cu.map(boViec));
});

test('prompt chat mentor va ca chuoi cham project trung ban cu', async () => {
  const { AIService, goi: cu } = napCu('vi', traLoiCham);
  await AIService.chatAboutProject('Project: X', [{ role: 'user', content: 'a' }], 'b');
  await AIService.reviewProject(IDEA, FILES, () => {});
  const moi = giaAi(traLoiCham);
  await hoiMentor(client, { nguCanh: 'Project: X', lichSu: [{ role: 'user', content: 'a' }], cauHoi: 'b', lang: 'vi', cho: khongCho });
  await chamDuAn(client, { idea: IDEA, files: FILES, lang: 'vi', cho: khongCho });
  expect(moi).toEqual(cu);
});

test('tong hop thieu diem tong: tinh tu 5 tieu chi; khong co gi thi de trong (khong luu 0)', () => {
  const k = chuanHoaKetQua({ overall: 78, criteria: [{ name: 'A', score: 16 }, { name: 'B', score: 14 }] });
  expect(k.score).toBe(30);
  const rong = chuanHoaKetQua({ summary: 'x' });
  expect(rong.score).toBeNull();
  expect(taoBanNop({ review: rong, idea: IDEA, files: [] }).scoreOverall).toBeNull();
});
