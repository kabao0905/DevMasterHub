// Mau diem /100 theo the gioi pastel (cung nguong voi app cu): cao = mint, vua = butter, thap = peach, kem = do.
// Dung token nen sang/toi deu doc ro, khong dung mau cung (amber-300, emerald-400...).
export type MucDiem = 'cao' | 'vua' | 'thap' | 'kem' | 'chua';

export const mucDiem = (d: number | null | undefined): MucDiem =>
  d == null ? 'chua' : d >= 80 ? 'cao' : d >= 60 ? 'vua' : d >= 40 ? 'thap' : 'kem';

/** Chip diem: nen pastel + chu cung mau */
export const CHIP_DIEM: Record<MucDiem, string> = {
  cao: 'bg-mint text-mint-ink',
  vua: 'bg-butter text-butter-ink',
  thap: 'bg-peach text-peach-ink',
  kem: 'bg-destructive/10 text-destructive',
  chua: 'bg-muted text-muted-foreground'
};

/** Chu diem tren nen trang */
export const CHU_DIEM: Record<MucDiem, string> = {
  cao: 'text-mint-ink',
  vua: 'text-butter-ink',
  thap: 'text-peach-ink',
  kem: 'text-destructive',
  chua: 'text-muted-foreground'
};

/** Phan da dat cua thanh diem */
export const NEN_DIEM: Record<MucDiem, string> = {
  cao: 'bg-mint-ink',
  vua: 'bg-butter-ink',
  thap: 'bg-peach-ink',
  kem: 'bg-destructive',
  chua: 'bg-muted'
};

/** Lop chip tron dung chung */
export const CHIP = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
