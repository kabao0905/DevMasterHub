import { DongHoHoc, NGHI_MS, type CongCuGhi } from './dong-ho-hoc';

const PHUT = 60_000;

function taoDongHo({ loiGhi = false } = {}) {
  let bayGio = new Date(2026, 9, 12, 9, 0).getTime();
  const chen: unknown[] = [];
  const capNhat: [number, unknown][] = [];
  const daGhi: [string, number][] = [];
  const ghi: CongCuGhi = {
    chen: async d => { if (loiGhi) return null; chen.push(d); return 7; },
    capNhat: async (id, d) => { if (loiGhi) return false; capNhat.push([id, d]); return true; }
  };
  const dh = new DongHoHoc({ bayGio: () => bayGio, ghi, daGhi: (ngay, giay) => daGhi.push([ngay, giay]) });
  const troi = (ms: number, { hien = true, thaoTac = true } = {}) => {
    for (let t = 0; t < ms; t += 15_000) {
      bayGio += 15_000;
      if (thaoTac) dh.thaoTac();
      dh.dem(hien);
    }
  };
  return { dh, troi, chen, capNhat, daGhi, datGio: (ms: number) => { bayGio = ms; } };
}

test('chua mo mon hoc hay hoi AI thi khong dem gi', async () => {
  const { dh, troi, chen } = taoDongHo();
  troi(5 * PHUT);
  await dh.ghi(true);
  expect(chen).toHaveLength(0);
});

test('mo mon hoc roi hoc 2 phut: ghi mot dong 120 giay cho mon do', async () => {
  const { dh, troi, chen, daGhi } = taoDongHo();
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(2 * PHUT);
  await dh.ghi(true);
  expect(chen).toEqual([expect.objectContaining({ tech_id: 'python', lesson_id: 'a', duration_seconds: 120 })]);
  expect(daGhi).toEqual([['2026-10-12', 120]]);
});

test('ghi lan sau cap nhat cung dong voi tong cong don, khong chen dong moi', async () => {
  const { dh, troi, chen, capNhat } = taoDongHo();
  dh.batDau({ techId: 'ai', lessonId: 'ai' });
  troi(PHUT);
  await dh.ghi(true);
  troi(PHUT);
  await dh.ghi(true);
  expect(chen).toHaveLength(1);
  expect(capNhat).toEqual([[7, expect.objectContaining({ duration_seconds: 120 })]]);
});

test('chua du 30 giay thi chua ghi (tru khi ep ghi luc roi trang)', async () => {
  const { dh, troi, chen } = taoDongHo();
  dh.batDau({ techId: 'ai', lessonId: 'ai' });
  troi(15_000);
  await dh.ghi();
  expect(chen).toHaveLength(0);
  await dh.ghi(true);
  expect(chen).toHaveLength(1);
});

test('roi may qua 5 phut thi chi tinh toi moc 5 phut sau thao tac cuoi', async () => {
  const { dh, troi, chen } = taoDongHo();
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(20 * PHUT, { thaoTac: false });
  await dh.ghi(true);
  expect(chen).toEqual([expect.objectContaining({ duration_seconds: NGHI_MS / 1000 })]);
});

test('tab bi an thi khong dem', async () => {
  const { dh, troi, chen } = taoDongHo();
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(10 * PHUT, { hien: false });
  await dh.ghi(true);
  expect(chen).toHaveLength(0);
});

test('ghi loi thi giu lai so giay, lan sau ghi duoc se ghi du', async () => {
  const loi = taoDongHo({ loiGhi: true });
  loi.dh.batDau({ techId: 'python', lessonId: 'a' });
  loi.troi(PHUT);
  await loi.dh.ghi(true);
  expect(loi.dh.giayChoGhi).toBe(60);
});

test('doi mon giua chung: thoi gian moi mon ghi vao dong rieng cua mon do', async () => {
  const { dh, troi, chen, capNhat } = taoDongHo();
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(35_000);
  dh.batDau({ techId: 'go', lessonId: 'b' });
  troi(35_000);
  await dh.ghi(true);
  await dh.ghi(true);
  const theoMon: Record<string, number> = {};
  for (const d of chen as { tech_id: string; duration_seconds: number }[]) theoMon[d.tech_id] = d.duration_seconds;
  expect(theoMon).toEqual({ python: 45, go: 45 });
  expect(capNhat).toHaveLength(0);
});

test('dang hoc bai ma hoi AI (gia su trong bai) thi van tinh cho bai, khong doi sang muc "ai"', async () => {
  const { dh, troi, chen } = taoDongHo();
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(PHUT);
  dh.batDau({ techId: 'ai', lessonId: 'ai' });
  troi(PHUT);
  await dh.ghi(true);
  expect(chen).toEqual([expect.objectContaining({ tech_id: 'python', duration_seconds: 120 })]);
});

test('doi mon roi quay lai mon cu: van mo dong moi, khong cong vao dong cua mon kia', async () => {
  const { dh, troi, chen } = taoDongHo();
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(PHUT);
  await dh.ghi(true);
  dh.batDau({ techId: 'go', lessonId: 'b' });
  troi(PHUT);
  await dh.ghi(true);
  expect((chen as { tech_id: string }[]).map(d => d.tech_id)).toEqual(['python', 'go']);
});

test('hoc qua nua dem: ngay hien thi trung voi ngay doc lai tu started_at', async () => {
  const { dh, troi, chen, daGhi, datGio } = taoDongHo();
  datGio(new Date(2026, 9, 12, 23, 59, 30).getTime());
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(PHUT);
  await dh.ghi(true);
  const dong = chen[0] as { started_at: string };
  const ngayDocLai = new Date(dong.started_at);
  const khoa = `${ngayDocLai.getFullYear()}-${String(ngayDocLai.getMonth() + 1).padStart(2, '0')}-${String(ngayDocLai.getDate()).padStart(2, '0')}`;
  expect(daGhi.map(([ngay]) => ngay)).toEqual([khoa]);
});

test('sang ngay moi thi chen dong moi cho ngay do', async () => {
  const { dh, troi, chen, datGio } = taoDongHo();
  dh.batDau({ techId: 'python', lessonId: 'a' });
  troi(PHUT);
  await dh.ghi(true);
  datGio(new Date(2026, 9, 13, 8, 0).getTime());
  dh.thaoTac();
  dh.dem(false);
  troi(PHUT);
  await dh.ghi(true);
  expect(chen).toHaveLength(2);
});
