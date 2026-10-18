import { act, renderHook } from '@testing-library/react';
import { apCheDo, docCheDo, KHOA_CHE_DO, tiLePhuKin, useCheDo } from './che-do';

const giaHeThong = (toi: boolean, giamChuyenDong = false) => vi.stubGlobal('matchMedia', (q: string) => ({
  matches: q.includes('dark') ? toi : q.includes('reduced-motion') ? giamChuyenDong : false,
  media: q, addEventListener() {}, removeEventListener() {}
}));

/** Gia View Transitions: chay ham doi ngay, ghi lai hieu ung duoc gan vao trang moi */
function giaViewTransition() {
  const hieuUng: { khung: Keyframe[] | PropertyIndexedKeyframes | null; tuyChon?: number | KeyframeAnimationOptions }[] = [];
  Object.assign(document, { startViewTransition: (f: () => void) => { f(); return { ready: Promise.resolve(), finished: Promise.resolve() }; } });
  const animate = vi.fn((khung: Keyframe[] | PropertyIndexedKeyframes | null, tuyChon?: number | KeyframeAnimationOptions) => {
    hieuUng.push({ khung, tuyChon });
    return {} as Animation;
  });
  Object.assign(document.documentElement, { animate });
  return {
    hieuUng,
    don() {
      delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
      delete (document.documentElement as unknown as { animate?: unknown }).animate;
    }
  };
}

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  apCheDo('sang');
});

test('chua chon gi thi theo may (he dieu hanh dang toi -> toi); da chon thi theo lua chon; gia tri la bo qua', () => {
  giaHeThong(true);
  expect(docCheDo()).toBe('toi');
  giaHeThong(false);
  expect(docCheDo()).toBe('sang');
  localStorage.setItem(KHOA_CHE_DO, 'toi');
  expect(docCheDo()).toBe('toi');
  localStorage.setItem(KHOA_CHE_DO, 'hack');
  expect(docCheDo()).toBe('sang');
});

test('ap che do: lop dark tren <html> va mau thanh trinh duyet', () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  document.head.appendChild(meta);
  apCheDo('toi');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(meta.content).toBe('#121922');
  apCheDo('sang');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  expect(meta.content).toBe('#ffffff');
  meta.remove();
});

test('useCheDo: gat sang toi thi luu, ap ngay, moi noi dung hook cap nhat (khong co View Transitions van doi)', () => {
  giaHeThong(false);
  const a = renderHook(() => useCheDo());
  const b = renderHook(() => useCheDo());
  expect(a.result.current[0]).toBe('sang');
  act(() => a.result.current[1]('toi'));
  expect(localStorage.getItem(KHOA_CHE_DO)).toBe('toi');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(b.result.current[0]).toBe('toi');
});

/** Cong tac 60x32 o (10, 20): bat dau dung bang no, ket thuc la chinh no phong to deu s lan quanh tam (40, 36) */
function vienThuocMongDoi() {
  const s = tiLePhuKin(10, 20, 60, 32, innerWidth, innerHeight);
  return [
    `inset(20px ${innerWidth - 70}px ${innerHeight - 52}px 10px round 16px)`,
    `inset(${36 - 16 * s}px ${innerWidth - 40 - 30 * s}px ${innerHeight - 36 - 16 * s}px ${40 - 30 * s}px round ${16 * s}px)`
  ];
}

/** Diem (x, y) co nam trong vien thuoc tam (cx, cy), nua rong a, nua cao b (hai dau tron ban kinh b) */
function trongVienThuoc(x: number, y: number, cx: number, cy: number, a: number, b: number) {
  const dx = Math.abs(x - cx), dy = Math.abs(y - cy), thang = a - b;
  return dy <= b && (dx <= thang || (dx - thang) ** 2 + dy ** 2 <= b ** 2);
}

test('tiLePhuKin: vien thuoc phong to phu du 4 goc man hinh, nho hon mot chut thi khong phu', () => {
  for (const [left, top, W, H] of [[1180, 24, 1280, 720], [10, 20, 1024, 768], [300, 12, 375, 812]]) {
    const s = tiLePhuKin(left, top, 60, 32, W, H);
    const cx = left + 30, cy = top + 16;
    for (const [x, y] of [[0, 0], [W, 0], [0, H], [W, H]]) expect(trongVienThuoc(x, y, cx, cy, 30 * s, 16 * s)).toBe(true);
    const nho = (s / 1.02) * 0.98;
    expect([[0, 0], [W, 0], [0, H], [W, H]].every(([x, y]) => trongVienThuoc(x, y, cx, cy, 30 * nho, 16 * nho))).toBe(false);
  }
});

test('trinh duyet co View Transitions: vien thuoc cua cong tac phong to deu toi khi phu kin man hinh', async () => {
  giaHeThong(false);
  const gia = giaViewTransition();
  const { result } = renderHook(() => useCheDo());
  await act(async () => result.current[1]('toi', { left: 10, top: 20, width: 60, height: 32 }));
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(gia.hieuUng).toHaveLength(1);
  const { khung, tuyChon } = gia.hieuUng[0];
  expect((khung as PropertyIndexedKeyframes).clipPath).toEqual(vienThuocMongDoi());
  expect(tuyChon).toMatchObject({ pseudoElement: '::view-transition-new(root)' });
  gia.don();
});

test('may bat giam chuyen dong: van lan ra tu cong tac cham nhu thuong (nguoi dung tu gat)', async () => {
  giaHeThong(false, true);
  const gia = giaViewTransition();
  const { result } = renderHook(() => useCheDo());
  await act(async () => result.current[1]('toi', { left: 10, top: 20, width: 60, height: 32 }));
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(gia.hieuUng).toHaveLength(1);
  const { khung, tuyChon } = gia.hieuUng[0];
  expect((khung as PropertyIndexedKeyframes).clipPath).toEqual(vienThuocMongDoi());
  expect(tuyChon).toMatchObject({ duration: 900, pseudoElement: '::view-transition-new(root)' });
  gia.don();
});
