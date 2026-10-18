export type DoManh = 'yeu' | 'trungBinh' | 'manh';

const DO_DAI_TOI_THIEU = 8;
const DO_DAI_TOT = 12;

export function doManhMatKhau(mk: string): DoManh | null {
  if (!mk) return null;
  if (mk.length < DO_DAI_TOI_THIEU) return 'yeu';
  const diem = [
    true,
    mk.length >= DO_DAI_TOT,
    /[a-z]/.test(mk) && /[A-Z]/.test(mk),
    /\d/.test(mk),
    /[^A-Za-z0-9]/.test(mk)
  ].filter(Boolean).length;
  return diem >= 4 ? 'manh' : diem >= 2 ? 'trungBinh' : 'yeu';
}
