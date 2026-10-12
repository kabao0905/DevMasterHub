// Goi AI qua /api/ai cua server (server giu khoa API, kiem dang nhap va gioi han luot).
import type { SupabaseLike } from './auth';
import type { BaiDayDu } from './curriculum';
import { baoDaHoiAi } from './dong-ho-hoc';
import {
  BAI_TAP_SYSTEM, CHAM_BAI_SYSTEM, chiThiNgonNgu, promptBaiTap, promptChamBai, promptGiaSu, promptQuiz, promptThietKe,
  promptThuThach, QUIZ_SYSTEM, type TabBai
} from './ai-prompts';
import { parseJsonLoose } from './json-loose';
import { setProperties } from './css-patch';

export type { TabBai } from './ai-prompts';

type ThamSoGoi = {
  system: string;
  user: string;
  taskType: string;
  lang: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  /** Cho giua cac lan thu lai; bai kiem truyen ham khong cho */
  cho?: (ms: number) => Promise<void>;
};

const choThat = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const HET_GIO_MS = 100_000;

function tinHieu(signal?: AbortSignal): AbortSignal {
  const hetGio = AbortSignal.timeout(HET_GIO_MS);
  return signal && typeof AbortSignal.any === 'function' ? AbortSignal.any([signal, hetGio]) : signal ?? hetGio;
}

/** "Failed to fetch", "signal timed out" la loi cua trinh duyet: doi thanh cau nguoi hoc hieu duoc */
function loiDeHieu(e: unknown, signalNguoiDung?: AbortSignal): unknown {
  if (signalNguoiDung?.aborted) return e; // nguoi dung tu huy (roi trang...): de nguyen cho noi goi bo qua
  const ten = e instanceof Error || e instanceof DOMException ? e.name : '';
  if (ten === 'TimeoutError' || ten === 'AbortError') return new Error('AI phản hồi quá lâu. Thử lại sau ít phút.');
  if (e instanceof TypeError) return new Error('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
  return e;
}

export async function goiAi(client: SupabaseLike, p: ThamSoGoi): Promise<string> {
  const cho = p.cho ?? choThat;
  // Hoi AI cung la dang hoc: bat dong ho hoc (lich tren Dashboard)
  baoDaHoiAi();
  const { data } = await client.auth.getSession();
  const token = data.session?.access_token;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const body = JSON.stringify({
    system: p.system + chiThiNgonNgu(p.lang),
    messages: [{ role: 'user', content: p.user }],
    temperature: p.temperature ?? 0.7,
    max_tokens: p.maxTokens ?? 4096,
    taskType: p.taskType
  });
  const signal = tinHieu(p.signal);

  let quaTai = 0;
  let loiMang = 0;
  for (;;) {
    let r: Response;
    try {
      r = await fetch('/api/ai', { method: 'POST', headers, body, signal });
    } catch (e) {
      // Mat mang thoang qua: thu lai mot lan (khong thu khi nguoi dung huy)
      if (e instanceof TypeError && loiMang++ < 1 && !signal.aborted) { await cho(2000); continue; }
      throw loiDeHieu(e, p.signal);
    }
    if ((r.status === 429 || r.status === 529) && quaTai < 2) {
      const sau = Number(r.headers.get('Retry-After'));
      await cho(Math.min(sau > 0 ? sau * 1000 : 2000 * 2 ** quaTai, 8000));
      quaTai++;
      continue;
    }
    const json = (await r.json().catch(() => null)) as { error?: string; content?: { text?: string }[] } | null;
    if (r.status === 401) throw new Error(json?.error || 'Bạn cần đăng nhập để dùng tính năng AI.');
    if (!r.ok) throw new Error(json?.error || `AI API Error: ${r.status}`);
    const text = json?.content?.[0]?.text;
    if (!text) throw new Error('AI không trả lời. Thử lại nhé.');
    return text;
  }
}

/** AI hay boc JSON trong ``` hoac them chu thua: thu lan luot tung cach doc */
export function docJson(text: string): unknown {
  const sach = text.trim().replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  try { return JSON.parse(sach); } catch { /* thu cach khac */ }
  const mang = sach.match(/\[[\s\S]*\]/);
  if (mang) { try { return JSON.parse(mang[0]); } catch { /* thu cach khac */ } }
  const doiTuong = sach.match(/\{[\s\S]*\}/);
  if (doiTuong) { try { return JSON.parse(doiTuong[0]); } catch { /* het cach */ } }
  throw new Error('Cannot parse AI response as JSON');
}

export const boThe = (html: string | undefined) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export type CauHoi = { question: string; code?: string; options: string[]; correct: number; explanation: string };
export type TrangThaiQuiz = { questions: CauHoi[]; answers: Record<number, number>; submitted: boolean };

const chuoiCoChu = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

/** Cau hoi AI tao chi dung duoc khi du truong va dap an dung nam trong danh sach lua chon */
function laCauHopLe(x: unknown): x is CauHoi {
  if (!x || typeof x !== 'object') return false;
  const q = x as Record<string, unknown>;
  const opts = q.options;
  return chuoiCoChu(q.question) && chuoiCoChu(q.explanation)
    && Array.isArray(opts) && opts.length >= 3 && opts.length <= 6 && opts.every(o => typeof o === 'string')
    && Number.isInteger(q.correct) && (q.correct as number) >= 0 && (q.correct as number) < opts.length;
}

/** AI hay ghi "code": null (hoac "") cho cau khong co code: coi nhu khong co */
const codeHopLe = (x: unknown) => (typeof x === 'string' && x.trim() !== '' ? x : undefined);

type BaiChoAi = { tech: { name: string }; level: { name: string }; lesson: BaiDayDu };

export async function taoQuiz(client: SupabaseLike, { tech, level, lesson, lang, soCau = 4, signal, cho }:
  BaiChoAi & { lang: string; soCau?: number; signal?: AbortSignal; cho?: ThamSoGoi['cho'] }): Promise<CauHoi[]> {
  const text = await goiAi(client, {
    system: QUIZ_SYSTEM,
    user: promptQuiz({ congNghe: tech.name, capDo: level.name, baiHoc: lesson.title, lyThuyet: boThe(lesson.theory), soCau }),
    temperature: 0.85, maxTokens: 4096, taskType: 'quiz', lang, signal, cho
  });
  let ds: unknown;
  try { ds = docJson(text); } catch { ds = null; }
  const hopLe = Array.isArray(ds) ? ds.filter(laCauHopLe).slice(0, soCau) : [];
  if (!hopLe.length) throw new Error('AI trả về quiz không hợp lệ');
  return hopLe.map(q => ({ question: q.question, code: codeHopLe(q.code), options: q.options, correct: q.correct, explanation: q.explanation }));
}

const chuCai = (i: number) => String.fromCharCode(65 + i);

/** Noi dung bai gui kem cau hoi cho gia su, theo tab hoc vien DANG mo (app cu ket o tab ly thuyet) */
export function nguCanhBai({ tech, level, lesson, tab, quiz, baiTap }: BaiChoAi & {
  tab: TabBai; quiz?: TrangThaiQuiz; baiTap?: { hienTai?: BaiTapAi | null; code?: string };
}): string {
  let s = `Công nghệ: ${tech.name}\nCấp độ: ${level.name}\nBài học: ${lesson.title}`;
  const lyThuyet = (n: number) => (lesson.theory ? `\n\n--- Lý thuyết tham khảo (phụ) ---\n${boThe(lesson.theory).substring(0, n)}` : '');

  if (tab === 'quiz') {
    if (quiz?.questions.length) {
      s += '\n\n★★★ CÂU HỎI QUIZ MÀ HỌC VIÊN ĐANG LÀM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★';
      s += `\nTrạng thái: ${quiz.submitted ? 'ĐÃ NỘP BÀI' : 'CHƯA NỘP'}`;
      s += '\n' + quiz.questions.map((q, i) => {
        let t = `Câu ${i + 1}: ${q.question}`;
        if (q.code) t += `\n${q.code}`;
        t += '\n' + q.options.map((o, j) => `  ${chuCai(j)}. ${o}`).join('\n');
        if (quiz.submitted) {
          t += `\n  → Đáp án đúng: ${chuCai(q.correct)}`;
          const chonCua = quiz.answers[i];
          if (chonCua !== undefined) t += `\n  → Học viên chọn: ${chuCai(chonCua)} (${chonCua === q.correct ? 'đúng' : 'sai'})`;
          t += `\n  → Giải thích: ${q.explanation}`;
        }
        return t;
      }).join('\n\n');
    }
    return s + lyThuyet(1000);
  }
  if (tab === 'code') {
    if (lesson.code) s += `\n\n★★★ CODE EXAMPLE MÀ HỌC VIÊN ĐANG XEM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n\`\`\`${lesson.lang || 'javascript'}\n${lesson.code}\n\`\`\``;
    return s + lyThuyet(1500);
  }
  if (tab === 'exercise') {
    const bt = baiTap?.hienTai;
    if (bt) {
      s += `\n\n★★★ BÀI TẬP MÀ HỌC VIÊN ĐANG LÀM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\nTiêu đề: ${bt.title}\nMô tả chi tiết: ${bt.description}`;
      if (bt.hints.length) s += `\nGợi ý: ${bt.hints.join(', ')}`;
    } else if (lesson.exercise) {
      s += `\n\n★★★ BÀI TẬP GỐC MÀ HỌC VIÊN ĐANG LÀM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n${boThe(lesson.exercise).substring(0, 1500)}`;
    }
    if (baiTap?.code) s += `\n\n=== CODE HỌC VIÊN ĐÃ VIẾT ===\n${baiTap.code.substring(0, 1500)}`;
    return s + lyThuyet(1000);
  }
  if (lesson.theory) s += `\n\n★★★ NỘI DUNG LÝ THUYẾT (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n${boThe(lesson.theory).substring(0, 3000)}`;
  if (lesson.keyPoints?.length) s += `\n\n=== ĐIỂM CHÍNH ===\n${lesson.keyPoints.map((kp, i) => `${i + 1}. ${boThe(kp)}`).join('\n')}`;
  return s;
}

export type TinNhan = { role: 'user' | 'assistant'; content: string };

export async function hoiGiaSu(client: SupabaseLike, { nguCanh, lichSu, cauHoi, tab, daNopQuiz, lang, signal, cho }: {
  nguCanh: string; lichSu: TinNhan[]; cauHoi: string; tab: TabBai; daNopQuiz: boolean; lang: string;
  signal?: AbortSignal; cho?: ThamSoGoi['cho'];
}): Promise<string> {
  const gan = lichSu.slice(-10);
  const truoc = gan.length
    ? 'Lịch sử hội thoại:\n' + gan.map(m => `${m.role === 'user' ? 'Học viên' : 'Gia sư'}: ${m.content}`).join('\n') + '\n\n'
    : '';
  return goiAi(client, { system: promptGiaSu(nguCanh, tab, daNopQuiz), user: truoc + cauHoi, temperature: 0.7, maxTokens: 4096, taskType: 'tutor', lang, signal, cho });
}

// ── Bai tap AI, cham bai, che do Thiet ke, de thu thach ──

const chuoi = (x: unknown): string => (typeof x === 'string' ? x.trim() : '');
const dsChuoi = (x: unknown, toiDa = 10): string[] => (Array.isArray(x) ? x.map(chuoi).filter(Boolean).slice(0, toiDa) : []);
const tuyChonChuoi = (x: unknown): string | undefined => chuoi(x) || undefined;

export type BaiTapAi = {
  title: string;
  description: string;
  /** Bai AI tao them cho loai nao (tieu de bai tap soan san, vd "Linear Search"); khong co = bai chung cua bai hoc */
  loai?: string;
  hints: string[];
  sampleInput?: string;
  expectedOutput?: string;
  solution?: string;
  /** Ten ngon ngu de to mau loi giai — chi nhan ten hop le (ban cu chen thang vao thuoc tinh class) */
  solutionLang?: string;
};

export async function taoBaiTap(client: SupabaseLike, { tech, level, lesson, cu, chuDe, lang, signal, cho }:
  BaiChoAi & { cu?: string; chuDe?: string; lang: string; signal?: AbortSignal; cho?: ThamSoGoi['cho'] }): Promise<BaiTapAi> {
  const text = await goiAi(client, {
    system: BAI_TAP_SYSTEM,
    user: promptBaiTap({
      congNghe: tech.name, capDo: level.name, baiHoc: lesson.title, lyThuyet: boThe(lesson.theory), cu: cu || '', chuDe, ngonNgu: lesson.lang
    }),
    temperature: 0.85, maxTokens: 4096, taskType: 'exercise', lang, signal, cho
  });
  const o = parseJsonLoose(text);
  // AI hay doi ten truong mo ta; khong co mo ta thi bai tap vo dung
  const description = o ? [o.description, o.content, o.task, o.exercise].map(chuoi).find(Boolean) : undefined;
  if (!o || !description) throw new Error('AI trả về bài tập không hợp lệ');
  const ngon = chuoi(o.solutionLang);
  return {
    title: chuoi(o.title) || 'Bài tập AI',
    description,
    hints: dsChuoi(o.hints, 6),
    sampleInput: tuyChonChuoi(o.sampleInput),
    expectedOutput: tuyChonChuoi(o.expectedOutput),
    solution: tuyChonChuoi(o.solution),
    solutionLang: /^[a-z0-9+#.-]{1,20}$/i.test(ngon) ? ngon : undefined
  };
}

export type NhanXet = {
  score: number;
  status: 'correct' | 'partial' | 'incorrect';
  feedback: string;
  errors: string[];
  suggestions: string[];
  correctedCode?: string;
};

const TRANG_THAI = ['correct', 'partial', 'incorrect'] as const;
const theoDiem = (diem: number): NhanXet['status'] => (diem >= 80 ? 'correct' : diem >= 40 ? 'partial' : 'incorrect');

export async function chamBai(client: SupabaseLike, { tech, deBai, baiLam, ngonNgu, lang, signal, cho }: {
  tech: { name: string }; deBai: string; baiLam: string; ngonNgu: string; lang: string;
  signal?: AbortSignal; cho?: ThamSoGoi['cho'];
}): Promise<NhanXet> {
  const text = await goiAi(client, {
    system: CHAM_BAI_SYSTEM,
    user: promptChamBai({ congNghe: tech.name, deBai: boThe(deBai), baiLam, ngonNgu }),
    temperature: 0.3, maxTokens: 4096, taskType: 'checkAnswer', lang, signal, cho
  });
  const o = parseJsonLoose(text);
  const so = Number(o?.score);
  const status = TRANG_THAI.find(s => s === o?.status);
  if (!o || (!Number.isFinite(so) && !status)) throw new Error('AI chấm bài không hợp lệ, thử lại nhé.');
  const coDiem = Number.isFinite(so) && o.score !== null && o.score !== '';
  const score = coDiem ? Math.round(Math.min(100, Math.max(0, so))) : status === 'correct' ? 100 : status === 'partial' ? 50 : 0;
  return {
    score,
    status: status ?? theoDiem(score),
    feedback: chuoi(o.feedback),
    errors: dsChuoi(o.errors),
    suggestions: dsChuoi(o.suggestions),
    correctedCode: tuyChonChuoi(o.correctedCode)
  };
}

/** JSON doi tuong doc chat: bo ``` boc ngoai, thu ca chuoi roi doan {...} ngoai cung; hong thi null */
function docJsonChat(text: string): Record<string, unknown> | null {
  const s = text.trim().replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  for (const ung of [s, s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)]) {
    try {
      const o: unknown = JSON.parse(ung);
      if (o && typeof o === 'object' && !Array.isArray(o)) return o as Record<string, unknown>;
    } catch { /* thu cach sau */ }
  }
  return null;
}

export type SuaThietKe =
  | { type: 'css'; selector: string; props: Record<string, string> }
  | { type: 'file'; file: string; content: string };

export async function suaThietKe(client: SupabaseLike, { yeuCau, chon, files, lang, signal, cho }: {
  yeuCau: string; chon: { tag: string; selector: string } | null; files: Record<string, string>; lang: string;
  signal?: AbortSignal; cho?: ThamSoGoi['cho'];
}): Promise<{ edits: SuaThietKe[]; explain: string }> {
  const tenFile = Object.keys(files);
  const nguCanh = chon
    ? `Người dùng đang chọn phần tử <${chon.tag}> có selector "${chon.selector}".`
    : 'Người dùng chưa chọn phần tử nào cụ thể.';
  // Gui DUNG bo file dang mo: bai React co App.jsx, bai Vue co App.js
  const user = [nguCanh, '', 'YÊU CẦU CỦA NGƯỜI DÙNG: ' + yeuCau, '', ...tenFile.flatMap(ten => [`--- ${ten} ---`, files[ten] || ''])].join('\n');
  const text = await goiAi(client, { system: promptThietKe(tenFile), user, temperature: 0.3, maxTokens: 2000, taskType: 'general', lang, signal, cho });
  // Doc CHAT, khong va JSON hong: ban va lui diem cat se lay mot phan noi dung tep (bi cat, hoac rong)
  // roi ghi de tep cua hoc vien — o soan duoc dieu khien nen Ctrl+Z khong cuu duoc.
  const o = docJsonChat(text);
  if (!o) throw new Error('AI trả về không đúng định dạng, hãy diễn đạt lại yêu cầu.');
  const edits: SuaThietKe[] = [];
  for (const e of Array.isArray(o.edits) ? o.edits : []) {
    if (!e || typeof e !== 'object') continue;
    const x = e as Record<string, unknown>;
    if (x.type === 'css' && chuoi(x.selector) && x.props && typeof x.props === 'object' && !Array.isArray(x.props)) {
      const props = Object.fromEntries(Object.entries(x.props)
        .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
        .map(([k, v]) => [k, String(v)]));
      if (Object.keys(props).length) edits.push({ type: 'css', selector: chuoi(x.selector), props });
    } else if (x.type === 'file' && typeof x.file === 'string' && tenFile.includes(x.file) && typeof x.content === 'string' && x.content.trim()) {
      // Chi sua tep dang co, va khong bao gio xoa trang tep — khong de AI tao tep la
      edits.push({ type: 'file', file: x.file, content: x.content });
    }
  }
  if (!edits.length) throw new Error('AI không đề xuất thay đổi nào.');
  return { edits, explain: chuoi(o.explain) };
}

/** Ap chinh sua thiet ke vao bo tep moi (khong sua bo cu): CSS qua CssPatch vao style.css, tep thay ca noi dung */
export function apDungThietKe(files: Record<string, string>, edits: SuaThietKe[]): { files: Record<string, string>; soThayDoi: number } {
  const moi = { ...files };
  let soThayDoi = 0;
  for (const e of edits) {
    if (e.type === 'css') {
      const r = setProperties(moi['style.css'] || '', e.selector, e.props);
      if (r.changed) {
        moi['style.css'] = r.css;
        soThayDoi++;
      }
    } else if (Object.hasOwn(moi, e.file)) {
      moi[e.file] = e.content;
      soThayDoi++;
    }
  }
  return { files: moi, soThayDoi };
}

export type ThuThachAi = {
  title: string; level: string; scenario: string; steps: string[]; hint: string;
  /** Cau hoi hoc vien tra loi bang cach tim tren terminal; answer co nguyen van trong du lieu cua may */
  question: string; answer: string;
};

/** So dap an: khong phan biet hoa thuong, bo khoang trang va dau nhay bao ngoai */
const chuanDapAn = (s: string) => s.trim().replace(/^["'`]+|["'`]+$/g, '').trim().replace(/\s+/g, ' ').toLowerCase();
export const khopDapAn = (dapAn: string, nhap: string) => !!chuanDapAn(nhap) && chuanDapAn(nhap) === chuanDapAn(dapAn);

const SO_LAN_RA_DE = 2;
const DAP_AN_TOI_DA = 120;

/**
 * Ra de tren DU LIEU THAT cua terminal (noi dung tep + ket qua lenh). AI bia du lieu thi de khong lam duoc,
 * nen chi nhan de co dap an xuat hien nguyen van trong du lieu va khong lo san trong de; khong dat thi ra lai.
 */
export async function taoThuThach(client: SupabaseLike, { lenh, tep, dauRa, lang, signal, cho }: {
  lenh: string[]; tep: Record<string, string>; dauRa: Record<string, string>; lang: string; signal?: AbortSignal; cho?: ThamSoGoi['cho'];
}): Promise<ThuThachAi> {
  const khoDuLieu = [...Object.values(tep), ...Object.values(dauRa)].join('\n').toLowerCase();
  for (let lan = 0; lan < SO_LAN_RA_DE; lan++) {
    const text = await goiAi(client, {
      system: promptThuThach(lenh, tep, dauRa),
      user: lan === 0
        ? 'Ra một thử thách mới, khác các đề trước đó.'
        : 'Đề trước không hợp lệ: answer phải có NGUYÊN VĂN trong dữ liệu và không được lộ trong đề. Ra một đề khác, đúng quy tắc.',
      temperature: 1.0, maxTokens: 1100, taskType: 'general', lang, signal, cho
    });
    // AI hay cham tran token o giua de: van giu phan da kip sinh ra
    const o = parseJsonLoose(text);
    if (!o || !chuoi(o.title)) continue;
    const de: ThuThachAi = {
      title: chuoi(o.title), level: chuoi(o.level), scenario: chuoi(o.scenario), steps: dsChuoi(o.steps, 6), hint: chuoi(o.hint),
      question: chuoi(o.question), answer: chuoi(o.answer).trim()
    };
    const dapAn = de.answer.toLowerCase();
    const hienThi = [de.title, de.scenario, ...de.steps, de.hint, de.question].join('\n').toLowerCase();
    const coThat = !!dapAn && dapAn.length <= DAP_AN_TOI_DA && khoDuLieu.includes(dapAn);
    if (de.question && coThat && !hienThi.includes(dapAn)) return de;
  }
  throw new Error('AI ra đề không hợp lệ, thử lại nhé.');
}
