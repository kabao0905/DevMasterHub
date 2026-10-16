// Tach emoji o dau mot chuoi (vd. "🚀 Dashboard" trong ban dich) ra rieng de ve no thanh hoat anh.
// Dung Extended_Pictographic chu khong phai \p{Emoji}: chu so "3" cung la Emoji nhung khong phai hinh.
const BIEU_TUONG_DAU = /^(\p{Extended_Pictographic}️?)\s*(.*)$/su;

/** [emoji dau chuoi (rong neu khong co), phan con lai] */
export function tachBieuTuong(chuoi: string): [string, string] {
  const m = BIEU_TUONG_DAU.exec(chuoi);
  return m ? [m[1], m[2]] : ['', chuoi];
}
