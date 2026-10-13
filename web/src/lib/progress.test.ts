import { baiCanHocTruoc, baiDaMo, baiKeTiep, khoaBai, tienDoCongNghe, tienDoTong } from './progress';
import type { CongNgheTomTat } from './curriculum';

const cn = (id: string, cap: Record<string, string[]>): CongNgheTomTat => ({
  id, name: id, icon: '', color: '', gradient: '', category: 'language', description: '',
  levels: Object.entries(cap).map(([capId, bai]) => ({ id: capId, name: capId, lessons: bai.map(b => ({ id: b, title: b })) }))
});

const PY = cn('python', { newbie: ['a', 'b'], junior: ['c', 'd'] });
const JS = cn('js', { newbie: ['x', 'y'] });

test('tien do theo cong nghe va theo tung cap', () => {
  const done = new Set([khoaBai('python', 'newbie', 'a'), khoaBai('python', 'newbie', 'b'), khoaBai('python', 'junior', 'c')]);
  const td = tienDoCongNghe(PY, done);
  expect(td).toMatchObject({ xong: 3, tong: 4, phanTram: 75 });
  expect(td.theoCap).toEqual([
    { capId: 'newbie', xong: 2, tong: 2 },
    { capId: 'junior', xong: 1, tong: 2 }
  ]);
});

test('khoa tien do cua cong nghe khac khong bi tinh nham', () => {
  const done = new Set([khoaBai('js', 'newbie', 'a')]);
  expect(tienDoCongNghe(PY, done).xong).toBe(0);
});

test('tien do tong cong don moi cong nghe; khong co bai thi 0%', () => {
  const done = new Set([khoaBai('js', 'newbie', 'x')]);
  expect(tienDoTong([PY, JS], done)).toEqual({ xong: 1, tong: 6, phanTram: 17 });
  expect(tienDoTong([], done)).toEqual({ xong: 0, tong: 0, phanTram: 0 });
});

test('bai ke tiep: lay cong nghe dang hoc do nhat, bai dau tien chua xong', () => {
  const done = new Set([khoaBai('python', 'newbie', 'a'), khoaBai('python', 'newbie', 'b'), khoaBai('js', 'newbie', 'x')]);
  expect(baiKeTiep([PY, JS], done)).toMatchObject({ tech: { id: 'python' }, level: { id: 'junior' }, lesson: { id: 'c' } });
});

test('bai ke tiep: chua hoc gi hoac da xong het thi null', () => {
  expect(baiKeTiep([PY, JS], new Set())).toBeNull();
  const xongHet = new Set(['x', 'y'].map(b => khoaBai('js', 'newbie', b)));
  expect(baiKeTiep([JS], xongHet)).toBeNull();
});

// Hoc theo thu tu: xong bai truoc moi mo bai sau, noi lien qua cac cap (xong bai cuoi Newbie thi mo bai dau Junior)
test('khoa bai: chi bai dau mo; xong bai nao thi mo bai ngay sau, ke ca sang cap moi', () => {
  const chuaHoc = new Set<string>();
  expect(baiDaMo(PY, 'newbie', 'a', chuaHoc)).toBe(true);
  expect(baiDaMo(PY, 'newbie', 'b', chuaHoc)).toBe(false);
  expect(baiDaMo(PY, 'junior', 'c', chuaHoc)).toBe(false);
  const xongA = new Set([khoaBai('python', 'newbie', 'a')]);
  expect(baiDaMo(PY, 'newbie', 'b', xongA)).toBe(true);
  expect(baiDaMo(PY, 'junior', 'c', xongA)).toBe(false);
  const xongAB = new Set([...xongA, khoaBai('python', 'newbie', 'b')]);
  expect(baiDaMo(PY, 'junior', 'c', xongAB)).toBe(true);
  expect(baiDaMo(PY, 'junior', 'd', xongAB)).toBe(false);
});

test('khoa bai: bai da xong tu truoc luon mo; bai la khong khoa; bai can hoc truoc la bai ngay truoc', () => {
  const xongD = new Set([khoaBai('python', 'junior', 'd')]);
  expect(baiDaMo(PY, 'junior', 'd', xongD)).toBe(true);
  expect(baiDaMo(PY, 'newbie', 'khong-co', xongD)).toBe(true);
  expect(baiCanHocTruoc(PY, 'junior', 'c')).toMatchObject({ level: { id: 'newbie' }, lesson: { id: 'b' } });
  expect(baiCanHocTruoc(PY, 'newbie', 'a')).toBeNull();
});
