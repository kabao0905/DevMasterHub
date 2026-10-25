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
  private choMonCu: { mon: Mon; giay: number }[] = [];
  private dong: { id: number; ngay: string; tong: number; mon: Mon } | null = null;
  private mon: Mon = { techId: 'ai', lessonId: 'ai' };
  private dangGhi: Promise<void> | null = null;

  constructor(private readonly o: {
    bayGio: () => number;
    ghi: CongCuGhi;
    daGhi: (ngay: string, giay: number) => void;
  }) {}

  get giayChoGhi() { return Math.floor(this.choGhi + this.choMonCu.reduce((s, x) => s + x.giay, 0)); }

  batDau(mon: Mon) {
    const now = this.o.bayGio();
    if (!this.dangHoc) {
      this.dangHoc = true;
      this.mon = mon;
      this.lanDem = now;
    } else if (mon.techId !== 'ai' && !cungMon(mon, this.mon)) {
      this.dem(true);
      if (this.choGhi > 0) this.choMonCu.push({ mon: this.mon, giay: this.choGhi });
      this.choGhi = 0;
      this.mon = mon;
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
    const ghiMonHienTai = giay > 0 && (epBuoc || giay >= GHI_SAU_GIAY);
    if (!this.choMonCu.length && !ghiMonHienTai) return Promise.resolve();
    this.dangGhi = this.ghiHet(ghiMonHienTai ? giay : 0).finally(() => { this.dangGhi = null; });
    return this.dangGhi;
  }

  private async ghiHet(giayHienTai: number) {
    while (this.choMonCu.length) {
      const cu = this.choMonCu[0];
      const giay = Math.floor(cu.giay);
      if (giay > 0 && !(await this.ghiDoan(cu.mon, giay))) return;
      this.choMonCu.shift();
    }
    if (giayHienTai > 0 && (await this.ghiDoan(this.mon, giayHienTai))) this.choGhi -= giayHienTai;
  }

  private async ghiDoan(mon: Mon, giay: number): Promise<boolean> {
    const now = this.o.bayGio();
    const batDau = now - giay * 1000;
    const ketThuc = new Date(now).toISOString();
    const d = this.dong;
    if (d && cungMon(d.mon, mon) && d.ngay === ngayDiaPhuong(new Date(now))) {
      const tong = d.tong + giay;
      if (!(await this.o.ghi.capNhat(d.id, { ended_at: ketThuc, duration_seconds: tong }))) return false;
      this.dong = { ...d, tong };
      this.o.daGhi(d.ngay, giay);
      return true;
    }
    const ngay = ngayDiaPhuong(new Date(batDau));
    const id = await this.o.ghi.chen({
      tech_id: mon.techId, lesson_id: mon.lessonId,
      started_at: new Date(batDau).toISOString(), ended_at: ketThuc, duration_seconds: giay
    });
    if (id == null) return false;
    this.dong = { id, ngay, tong: giay, mon };
    this.o.daGhi(ngay, giay);
    return true;
  }
}

const cungMon = (a: Mon, b: Mon) => a.techId === b.techId && a.lessonId === b.lessonId;

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
