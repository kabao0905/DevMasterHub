import { ngayDiaPhuong } from './ngay-hoc';

export const NGHI_MS = 5 * 60_000;
export const NHIP_MS = 15_000;
const GHI_SAU_GIAY = 30;

export type Mon = { techId: string; lessonId: string };
export type DongMoi = { tech_id: string; lesson_id: string; started_at: string; ended_at: string; duration_seconds: number };
export type CongCuGhi = {
  chen: (d: DongMoi) => Promise<number | null>;
  capNhat: (id: number, d: { ended_at: string; duration_seconds: number }) => Promise<boolean>;
};

export class DongHoHoc {
  private dangHoc = false;
  private lanThaoTac = 0;
  private lanDem = 0;
  private choGhi = 0;
  private dong: { id: number; ngay: string; tong: number } | null = null;
  private mon: Mon = { techId: 'ai', lessonId: 'ai' };
  private dangGhi: Promise<void> | null = null;

  constructor(private readonly o: {
    bayGio: () => number;
    ghi: CongCuGhi;
    daGhi: (ngay: string, giay: number) => void;
  }) {}

  get giayChoGhi() { return Math.floor(this.choGhi); }

  batDau(mon: Mon) {
    const now = this.o.bayGio();
    if (!this.dangHoc) {
      this.dangHoc = true;
      this.mon = mon;
      this.lanDem = now;
    }
    this.lanThaoTac = now;
  }

  thaoTac() { this.lanThaoTac = this.o.bayGio(); }

  dem(dangHien: boolean) {
    const now = this.o.bayGio();
    if (this.dangHoc && dangHien) {
      const ketThuc = Math.min(now, this.lanThaoTac + NGHI_MS);
      if (ketThuc > this.lanDem) this.choGhi += (ketThuc - this.lanDem) / 1000;
    }
    this.lanDem = now;
  }

  ghi(epBuoc = false): Promise<void> {
    if (this.dangGhi) return this.dangGhi;
    const giay = Math.floor(this.choGhi);
    if (giay <= 0 || (!epBuoc && giay < GHI_SAU_GIAY)) return Promise.resolve();
    this.dangGhi = this.ghiNgay(giay).finally(() => { this.dangGhi = null; });
    return this.dangGhi;
  }

  private async ghiNgay(giay: number) {
    const now = this.o.bayGio();
    const ngay = ngayDiaPhuong(new Date(now));
    const ketThuc = new Date(now).toISOString();
    let daGhi = false;
    if (this.dong && this.dong.ngay === ngay) {
      const tong = this.dong.tong + giay;
      daGhi = await this.o.ghi.capNhat(this.dong.id, { ended_at: ketThuc, duration_seconds: tong });
      if (daGhi) this.dong = { ...this.dong, tong };
    } else {
      const id = await this.o.ghi.chen({
        tech_id: this.mon.techId, lesson_id: this.mon.lessonId,
        started_at: new Date(now - giay * 1000).toISOString(), ended_at: ketThuc, duration_seconds: giay
      });
      daGhi = id != null;
      if (id != null) this.dong = { id, ngay, tong: giay };
    }
    if (!daGhi) return;
    this.choGhi -= giay;
    this.o.daGhi(ngay, giay);
  }
}

export const SU_KIEN_BAT_DAU_HOC = 'dmh:bat-dau-hoc';
let yeuCauCho: Mon | null = null;

export function batDauHoc(mon: Mon) {
  yeuCauCho = mon;
  window.dispatchEvent(new CustomEvent<Mon>(SU_KIEN_BAT_DAU_HOC, { detail: mon }));
}

export const baoDaHoiAi = () => batDauHoc({ techId: 'ai', lessonId: 'ai' });

export function layYeuCauCho(): Mon | null {
  const m = yeuCauCho;
  yeuCauCho = null;
  return m;
}
