// Dong ho dem thoi gian hoc that su trong ngay.
// Bat dau khi mo mot mon hoc hoac hoi AI; chi chay khi tab dang hien va nguoi dung con thao tac
// (mo may roi bo di thi khong tinh). Ghi dan vao learning_sessions: moi ngay mot dong, cap nhat tong giay.
import { ngayDiaPhuong } from './ngay-hoc';

/** Khong thao tac qua lau thi coi nhu da roi may: chi tinh toi moc nay sau lan thao tac cuoi */
export const NGHI_MS = 5 * 60_000;
/** Moi nhip dem cua interval */
export const NHIP_MS = 15_000;
/** Gom du chung nay giay moi ghi mot lan (tru luc roi trang / an tab thi ghi ngay) */
const GHI_SAU_GIAY = 30;

export type Mon = { techId: string; lessonId: string };
export type DongMoi = { tech_id: string; lesson_id: string; started_at: string; ended_at: string; duration_seconds: number };
export type CongCuGhi = {
  /** Chen dong moi, tra id (null neu loi) */
  chen: (d: DongMoi) => Promise<number | null>;
  /** Cap nhat tong giay cua dong, tra true neu ghi duoc */
  capNhat: (id: number, d: { ended_at: string; duration_seconds: number }) => Promise<boolean>;
};

export class DongHoHoc {
  private dangHoc = false;
  private lanThaoTac = 0;
  private lanDem = 0;
  /** Giay da dem nhung chua ghi duoc len server */
  private choGhi = 0;
  private dong: { id: number; ngay: string; tong: number } | null = null;
  private mon: Mon = { techId: 'ai', lessonId: 'ai' };
  private dangGhi: Promise<void> | null = null;

  constructor(private readonly o: {
    bayGio: () => number;
    ghi: CongCuGhi;
    /** Bao ngay + so giay vua ghi xong (de lich cap nhat ngay ma khong tai lai) */
    daGhi: (ngay: string, giay: number) => void;
  }) {}

  get giayChoGhi() { return Math.floor(this.choGhi); }

  /** Mo mon hoc / hoi AI: bat dau dem neu chua dem */
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

  /** Goi moi nhip va luc an/hien tab. dangHien: tab co hien suot tu lan dem truoc toi gio khong */
  dem(dangHien: boolean) {
    const now = this.o.bayGio();
    if (this.dangHoc && dangHien) {
      const ketThuc = Math.min(now, this.lanThaoTac + NGHI_MS);
      if (ketThuc > this.lanDem) this.choGhi += (ketThuc - this.lanDem) / 1000;
    }
    this.lanDem = now;
  }

  /** Ghi so giay dang cho; epBuoc: ghi ca khi chua du GHI_SAU_GIAY (roi trang, an tab) */
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
    // Ghi loi (mat mang...): giu lai so giay, nhip sau ghi tiep. Trong luc cho ghi co the da dem them: chi tru phan da ghi
    if (!daGhi) return;
    this.choGhi -= giay;
    this.o.daGhi(ngay, giay);
  }
}

// ── Bao cho dong ho tu bat ky dau trong app (lib/ai.ts khong dung duoc hook) ──
export const SU_KIEN_BAT_DAU_HOC = 'dmh:bat-dau-hoc';
/** Trang con chay effect truoc khung app: giu lai lan bao cuoi de dong ho tao sau van nhan duoc */
let yeuCauCho: Mon | null = null;

export function batDauHoc(mon: Mon) {
  yeuCauCho = mon;
  window.dispatchEvent(new CustomEvent<Mon>(SU_KIEN_BAT_DAU_HOC, { detail: mon }));
}

export const baoDaHoiAi = () => batDauHoc({ techId: 'ai', lessonId: 'ai' });

/** Lay (va xoa) lan bao dang cho */
export function layYeuCauCho(): Mon | null {
  const m = yeuCauCho;
  yeuCauCho = null;
  return m;
}
