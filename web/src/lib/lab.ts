import type { HeThongTep } from './terminal';
import { LABS_NGINX } from './labs-nginx';

export type KetQuaKiem = { dat: boolean; nhan?: string };
type NhiemVuChung = { id: string; cau: string; diem: number; goiY: string[] };
export type NhiemVu =
  | (NhiemVuChung & { kieu: 'traLoi'; dapAn: string | string[] })
  | (NhiemVuChung & { kieu: 'trangThai'; kiem: (fs: HeThongTep) => KetQuaKiem });
export type BuocGiai = string | { nano: string; noiDung: string };
export type Lab = { lessonKey: string; tenLab: string; fs: HeThongTep; tasks: NhiemVu[]; loiGiai?: BuocGiai[] };

export const KHOA_TIEN_DO_LAB = 'dmh_lab_progress';

export function chuanHoa(s: unknown): string {
  return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function soKhop(dapAn: string | string[], nhap: string): boolean {
  const sach = chuanHoa(nhap);
  if (!sach) return false;
  return (Array.isArray(dapAn) ? dapAn : [dapAn]).some(x => chuanHoa(x) === sach);
}

export function tinhDiem(lab: { tasks?: { id: string; diem?: number }[] }, danhSachXong: string[]) {
  const tasks = lab.tasks || [];
  const xongThat = tasks.filter(t => danhSachXong.includes(t.id));
  return {
    xong: xongThat.length,
    tong: tasks.length,
    diem: xongThat.reduce((s, t) => s + (t.diem || 0), 0),
    tongDiem: tasks.reduce((s, t) => s + (t.diem || 0), 0)
  };
}

function docTatCa(): Record<string, unknown> {
  try {
    const o: unknown = JSON.parse(localStorage.getItem(KHOA_TIEN_DO_LAB) || '{}');
    return o && typeof o === 'object' ? (o as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function docTienDo(lessonKey: string): string[] {
  const t = docTatCa()[lessonKey];
  return Array.isArray(t) ? t.filter((x): x is string => typeof x === 'string') : [];
}

export function luuTienDo(lessonKey: string, danhSach: string[]): void {
  const tatCa = docTatCa();
  tatCa[lessonKey] = danhSach;
  try { localStorage.setItem(KHOA_TIEN_DO_LAB, JSON.stringify(tatCa)); } catch {}
}

export function timLab(lessonKey: string): Lab | null {
  return Object.hasOwn(LABS_NGINX, lessonKey) ? LABS_NGINX[lessonKey] : null;
}

export function kiemNhiemVu(nv: NhiemVu, fs: HeThongTep, nhap: string): KetQuaKiem {
  if (nv.kieu === 'trangThai') return nv.kiem(fs) || { dat: false };
  return soKhop(nv.dapAn, nhap) ? { dat: true } : { dat: false, nhan: 'Chưa đúng. Thử tìm kỹ hơn trong terminal.' };
}
