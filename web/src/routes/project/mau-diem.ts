export type MucDiem = 'cao' | 'vua' | 'thap' | 'kem' | 'chua';

export const mucDiem = (d: number | null | undefined): MucDiem =>
  d == null ? 'chua' : d >= 80 ? 'cao' : d >= 60 ? 'vua' : d >= 40 ? 'thap' : 'kem';

export const CHIP_DIEM: Record<MucDiem, string> = {
  cao: 'bg-mint text-mint-ink',
  vua: 'bg-butter text-butter-ink',
  thap: 'bg-peach text-peach-ink',
  kem: 'bg-destructive/10 text-destructive',
  chua: 'bg-muted text-muted-foreground'
};

export const CHU_DIEM: Record<MucDiem, string> = {
  cao: 'text-mint-ink',
  vua: 'text-butter-ink',
  thap: 'text-peach-ink',
  kem: 'text-destructive',
  chua: 'text-muted-foreground'
};

export const NEN_DIEM: Record<MucDiem, string> = {
  cao: 'bg-mint-ink',
  vua: 'bg-butter-ink',
  thap: 'bg-peach-ink',
  kem: 'bg-destructive',
  chua: 'bg-muted'
};

export const CHIP = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
