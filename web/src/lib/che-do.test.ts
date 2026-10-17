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

test('trinh duyet co View Transitions: trang moi lan ra thanh vong tron tu diem bam', async () => {
  giaHeThong(false);
  const gia = giaViewTransition();
  const { result } = renderHook(() => useCheDo());
  await act(async () => result.current[1]('toi', { x: 10, y: 20 }));
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(gia.hieuUng).toHaveLength(1);
  const { khung, tuyChon } = gia.hieuUng[0];
  expect(String((khung as PropertyIndexedKeyframes).clipPath)).toContain('circle(0px at 10px 20px)');
  expect(tuyChon).toMatchObject({ pseudoElement: '::view-transition-new(root)' });
  gia.don();
});

test('may bat giam chuyen dong: khong lan tron ma mo dan nhe (van co chuyen tiep, khong doi dot ngot)', async () => {
  giaHeThong(false, true);
  const gia = giaViewTransition();
  const { result } = renderHook(() => useCheDo());
  await act(async () => result.current[1]('toi', { x: 10, y: 20 }));
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(gia.hieuUng).toHaveLength(1);
  const { khung, tuyChon } = gia.hieuUng[0];
  expect(khung).toEqual({ opacity: [0, 1] });
  expect(khung).not.toHaveProperty('clipPath');
  expect(tuyChon).toMatchObject({ pseudoElement: '::view-transition-new(root)' });
  gia.don();
});
