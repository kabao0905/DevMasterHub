const MO_HINH_THEO_VIEC = Object.freeze({
  tutor: 'google/gemini-3.8-flash',
  quiz: 'google/gemini-3.8-flash',
  exercise: 'google/gemini-3.8-flash',
  checkCode: 'deepseek/deepseek-v4-pro-0813',
  checkAnswer: 'deepseek/deepseek-v4-pro-0813',
  projectIdea: 'deepseek/deepseek-v4-pro-0813',
  projectChat: 'deepseek/deepseek-v4-pro-0813',
  projectReview: 'deepseek/deepseek-v4-pro-0813',
  career: 'anthropic/claude-sonnet-5.5',
  crawlIntent: 'google/gemini-3.8-flash',
  general: 'google/gemini-3.8-flash'
});

const SUY_NGHI_GEMINI = Object.freeze({ muc: 'high', themToken: 16384 });
const SUY_NGHI_RIENG = Object.freeze({ crawlIntent: Object.freeze({ muc: 'low', themToken: 2048 }) });
const suyNghiCho = taskType => SUY_NGHI_RIENG[taskType] || SUY_NGHI_GEMINI;
const laGemini3 = model => /(^|\/)gemini-3\./.test(model);

const GIOI_HAN = Object.freeze({
  maxTokens: 8192,
  temperature: 1.5,
  soTinNhan: 40,
  tongKyTu: 300000
});

const kep = (x, thap, cao) => Math.min(cao, Math.max(thap, x));

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

module.exports = { chuanHoaYeuCauAi, MO_HINH_THEO_VIEC, GIOI_HAN, SUY_NGHI_GEMINI, suyNghiCho, laGemini3 };
