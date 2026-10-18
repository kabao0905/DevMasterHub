const Y_DINH = ['mot_tin', 'danh_sach', 'ca_web'];
const THEO_LOAI_TRANG = { mot_tin: 'mot_tin', danh_sach: 'danh_sach', khac: 'ca_web' };

const HE_THONG = `Bạn phân loại ý định của học viên khi họ gửi một link trang tuyển dụng kèm câu hỏi.
Chỉ trả về JSON dạng {"y_dinh": "<giá trị>"} với một trong 3 giá trị:
- "mot_tin": hỏi về MỘT tin tuyển dụng cụ thể (đánh giá tin này, có nên ứng tuyển, yêu cầu là gì).
- "danh_sach": muốn xem / lọc các việc trong danh sách ở chính trang được gửi.
- "ca_web": muốn xem toàn bộ việc làm (ví dụ toàn bộ việc IT) trên website đó, không chỉ trang được gửi.
Không giải thích gì thêm.`;

async function doanYDinh({ cauHoi, loaiTrang, hoiAi }) {
  const duPhong = { yDinh: THEO_LOAI_TRANG[loaiTrang] || 'mot_tin', nguon: 'code' };
  try {
    const tra = await hoiAi(HE_THONG, `Loại trang (do hệ thống nhận ra): ${loaiTrang}\nCâu hỏi của học viên: ${String(cauHoi).slice(0, 1000)}`);
    const m = String(tra).match(/"y_dinh"\s*:\s*"([a-z_]+)"/);
    return m && Y_DINH.includes(m[1]) ? { yDinh: m[1], nguon: 'gemini' } : duPhong;
  } catch {
    return duPhong;
  }
}

module.exports = { doanYDinh };
