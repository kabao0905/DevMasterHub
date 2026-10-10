// Kiem va lam sach body cua /api/ai truoc khi goi nha cung cap AI tra phi.
// Client khong duoc tu chon model hay so token: moi thu deu tinh tien vao khoa cua server.

// Model do SERVER chon theo loai viec. Client chi gui taskType, khong gui ten model.
const MO_HINH_THEO_VIEC = Object.freeze({
  tutor: 'google/gemini-3.7-flash',
  quiz: 'google/gemini-3.7-flash',
  exercise: 'google/gemini-3.7-flash',
  checkCode: 'deepseek/deepseek-v4-pro-0813',
  checkAnswer: 'deepseek/deepseek-v4-pro-0813',
  projectIdea: 'deepseek/deepseek-v4-pro-0813',
  projectChat: 'deepseek/deepseek-v4-pro-0813',
  projectReview: 'deepseek/deepseek-v4-pro-0813',
  career: 'anthropic/claude-sonnet-4.5',
  general: 'google/gemini-3.7-flash'
});

const GIOI_HAN = Object.freeze({
  maxTokens: 8192,      // synthesizeReview cua Project Lab can 8192, khong ai can hon
  temperature: 1.5,
  soTinNhan: 40,
  tongKyTu: 300000      // chamProject gui ca code nhieu file nen phai rong tay
});

const kep = (x, thap, cao) => Math.min(cao, Math.max(thap, x));

/**
 * @returns {{ loi: string }} khi body sai dang, hoac
 *          {{ system, messages, temperature, maxTokens, taskType }} da lam sach
 */
function chuanHoaYeuCauAi(body) {
  const b = body && typeof body === 'object' ? body : {};

  if (b.system != null && typeof b.system !== 'string') return { loi: 'system phải là chuỗi' };
  const system = b.system || '';

  if (!Array.isArray(b.messages) || b.messages.length === 0) return { loi: 'messages phải là mảng không rỗng' };
  if (b.messages.length > GIOI_HAN.soTinNhan) return { loi: 'Quá nhiều tin nhắn trong một yêu cầu' };

  const messages = [];
  let tongKyTu = system.length;
  for (const m of b.messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || !m.content) {
      return { loi: 'Mỗi tin nhắn phải có role user/assistant và content là chuỗi' };
    }
    tongKyTu += m.content.length;
    messages.push({ role: m.role, content: m.content });
  }
  if (tongKyTu > GIOI_HAN.tongKyTu) return { loi: 'Nội dung gửi AI quá dài' };

  const nhietDo = Number(b.temperature);
  const soToken = Math.floor(Number(b.max_tokens));
  const taskType = Object.prototype.hasOwnProperty.call(MO_HINH_THEO_VIEC, b.taskType) ? b.taskType : 'general';

  return {
    system,
    messages,
    temperature: Number.isFinite(nhietDo) ? kep(nhietDo, 0, GIOI_HAN.temperature) : 0.7,
    maxTokens: Number.isFinite(soToken) ? kep(soToken, 1, GIOI_HAN.maxTokens) : 4096,
    taskType
  };
}

module.exports = { chuanHoaYeuCauAi, MO_HINH_THEO_VIEC, GIOI_HAN };
