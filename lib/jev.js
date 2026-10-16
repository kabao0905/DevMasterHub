// Goi Jev (TypeSafe, model "System One") qua OpenRouter: tra ve quyet dinh co kieu (choice / noul / score)
// thay vi chu. Dung cho cac buoc chon link va cham viec cua nhen tim viec (lib/nhen-viec.js).
// Endpoint tuong thich TypeSafe: body { model, state, questions } -> { answers, usage }.

const DIA_CHI = 'https://openrouter.ai/api/v1/systemone';
/** Ghim phien ban: nguong xac suat chinh theo tung phien ban model */
const MO_HINH = 'typesafe/jev-1.13';
const THU_LAI = new Set([429, 500, 502, 503, 504, 529]);
const SO_LAN_THU = 2;
const HET_GIO_MS = 15000;

const loiJev = (thongBao, status) => Object.assign(new Error(thongBao), { code: 'EJEV', status });
const choThat = ms => new Promise(r => setTimeout(r, ms));

/**
 * @param {{ khoa: string, fetch?: typeof fetch, cho?: (ms: number) => Promise<void>, model?: string }} tuyChon
 */
function taoJev({ khoa, fetch: goiMang = globalThis.fetch, cho = choThat, model = MO_HINH } = {}) {
  async function hoi(state, questions) {
    if (!khoa) throw loiJev('Chưa cấu hình OPENROUTER_API_KEY cho Jev');
    for (let lan = 0; ; lan++) {
      const r = await goiMang(DIA_CHI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${khoa}`,
          'HTTP-Referer': 'https://devmaster-hub.onrender.com',
          'X-OpenRouter-Title': 'DevMaster Hub'
        },
        body: JSON.stringify({ model, state, questions }),
        signal: AbortSignal.timeout(HET_GIO_MS)
      });
      if (r.ok) {
        const data = await r.json();
        return data.answers || {};
      }
      if (!THU_LAI.has(r.status) || lan >= SO_LAN_THU) {
        const chiTiet = await r.text().catch(() => '');
        throw loiJev(`Jev lỗi HTTP ${r.status}: ${chiTiet.slice(0, 200)}`, r.status);
      }
      const sau = Number(r.headers.get('retry-after'));
      await cho(Math.min(sau > 0 ? sau * 1000 : 500 * 2 ** lan, 8000));
    }
  }
  return { hoi, sanSang: !!khoa };
}

module.exports = { taoJev, MO_HINH };
