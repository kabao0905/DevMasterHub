import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider, useT, chuanHoaKhoa, ngonNguBanDau, type BanDich } from './i18n';

test('chuan hoa khoa giong normalizeKey cua app cu', () => {
  expect(chuanHoaKhoa('Biến & Kiểu dữ liệu')).toBe('bien-kieu-du-lieu');
  expect(chuanHoaKhoa('Đường dẫn')).toBe('duong-dan');
  expect(chuanHoaKhoa('  React Hooks: useState()  ')).toBe('react-hooks-usestate');
});

const NGON_NGU = { vi: { name: 'Tiếng Việt', flag: '🇻🇳', code: 'vi' }, en: { name: 'English', flag: '🇬🇧', code: 'en' } };
const BAN: Record<string, BanDich> = {
  vi: { ui: { chao: 'Xin chào {ten}' }, titles: {}, techDesc: { cpp: 'Lập trình hệ thống' }, languages: NGON_NGU },
  en: { ui: { chao: 'Hello {ten}' }, titles: { 'bien-kieu-du-lieu': 'Variables & Types' }, techDesc: {}, languages: NGON_NGU }
};

function Hien() {
  const { t, translateTitle, techDesc, setLang } = useT();
  return (
    <div>
      <p>{t('chao', { ten: 'An' })}</p>
      <p>{t('khongCoKhoaNay')}</p>
      <p>{translateTitle('Biến & Kiểu dữ liệu')}</p>
      <p>{techDesc('cpp', 'mô tả gốc')}</p>
      <p>{techDesc('rust', 'mô tả gốc rust')}</p>
      <button onClick={() => setLang('en')}>đổi</button>
    </div>
  );
}

test('dich, thay bien, thieu khoa tra ve khoa; doi ngon ngu ghi dung khoa localStorage cua app cu', async () => {
  localStorage.setItem('devmaster_hub_lang', 'vi');
  veI18n(async l => BAN[l]);
  expect(await screen.findByText('Xin chào An')).toBeInTheDocument();
  expect(screen.getByText('khongCoKhoaNay')).toBeInTheDocument();
  expect(screen.getByText('Biến & Kiểu dữ liệu')).toBeInTheDocument();
  expect(screen.getByText('Lập trình hệ thống')).toBeInTheDocument();
  expect(screen.getByText('mô tả gốc rust')).toBeInTheDocument();

  await userEvent.click(screen.getByText('đổi'));
  expect(await screen.findByText('Hello An')).toBeInTheDocument();
  expect(screen.getByText('Variables & Types')).toBeInTheDocument();
  expect(localStorage.getItem('devmaster_hub_lang')).toBe('en');
  expect(document.documentElement.lang).toBe('en');
});

test('ngon ngu ban dau: localStorage cua app cu, roi trinh duyet, ma la thi tieng Viet', () => {
  localStorage.setItem('devmaster_hub_lang', 'ja');
  expect(ngonNguBanDau('en-US')).toBe('ja');
  localStorage.setItem('devmaster_hub_lang', 'xx');
  expect(ngonNguBanDau('fr-FR')).toBe('fr');
  localStorage.removeItem('devmaster_hub_lang');
  expect(ngonNguBanDau('pt-BR')).toBe('vi');
});

const veI18n = (tai: (l: string) => Promise<BanDich>) => render(
  <QueryClientProvider client={new QueryClient()}>
    <I18nProvider taiBanDich={tai}><Hien /></I18nProvider>
  </QueryClientProvider>
);

test('tai ban dich loi thoang qua (mang chap chon) thi tu thu lai roi hien binh thuong', async () => {
  localStorage.setItem('devmaster_hub_lang', 'vi');
  let lan = 0;
  veI18n(async l => { if (lan++ === 0) throw new Error('mang chap chon'); return BAN[l]; });
  expect(await screen.findByText('Xin chào An', {}, { timeout: 3000 })).toBeInTheDocument();
});

test('tai ban dich loi han thi bao loi kem nut Thu lai, khong de trang trang', async () => {
  localStorage.setItem('devmaster_hub_lang', 'vi');
  let hong = true;
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  veI18n(async l => { if (hong) throw new Error('mat mang'); return BAN[l]; });
  const nut = await screen.findByRole('button', { name: /Thử lại/ }, { timeout: 4000 });
  expect(screen.getByRole('alert')).toHaveTextContent('Không tải được giao diện');
  hong = false;
  await userEvent.click(nut);
  expect(await screen.findByText('Xin chào An')).toBeInTheDocument();
});
