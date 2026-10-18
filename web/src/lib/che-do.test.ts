import { act, renderHook } from '@testing-library/react';
import { apCheDo, docCheDo, KHOA_CHE_DO, useCheDo } from './che-do';

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

test('trinh duyet co View Transitions: trang moi lan ra tu hinh vien thuoc cua cong tac toi ca man hinh', async () => {
  giaHeThong(false);
  const gia = giaViewTransition();
  const { result } = renderHook(() => useCheDo());
  await act(async () => result.current[1]('toi', { left: 10, top: 20, width: 60, height: 32 }));
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(gia.hieuUng).toHaveLength(1);
  const { khung, tuyChon } = gia.hieuUng[0];
  expect((khung as PropertyIndexedKeyframes).clipPath).toEqual([
    `inset(20px ${innerWidth - 70}px ${innerHeight - 52}px 10px round 16px)`,
    `inset(10px ${(innerWidth - 70) / 2}px ${(innerHeight - 52) / 2}px 5px round 48px)`,
    'inset(0px 0px 0px 0px round 0px)'
  ]);
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
  expect((khung as PropertyIndexedKeyframes).clipPath).toEqual([
    `inset(20px ${innerWidth - 70}px ${innerHeight - 52}px 10px round 16px)`,
    `inset(10px ${(innerWidth - 70) / 2}px ${(innerHeight - 52) / 2}px 5px round 48px)`,
    'inset(0px 0px 0px 0px round 0px)'
  ]);
  expect(tuyChon).toMatchObject({ duration: 900, pseudoElement: '::view-transition-new(root)' });
  gia.don();
});
