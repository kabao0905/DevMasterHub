import { Outlet, ScrollRestoration, type Location } from 'react-router';
import { useDongHoHoc } from '@/lib/use-thoi-gian-hoc';
import { ChaoMung } from '@/components/ChaoMung';
import { TopNav } from '@/components/TopNav';
import { useT } from '@/lib/i18n';

/**
 * Khoa luu vi tri cuon. Muc lich su dau cua moi lan tai trang (vao tu app cu, go URL) luon co khoa "default":
 * neu giu khoa do, trang moi se nhan vi tri cuon cua mot trang "default" khac da roi di. Luu theo URL thi
 * tai lai dung trang van tra lai cho cu, con trang khac bat dau tu dau.
 */
const khoaCuon = (loc: Location) => (loc.key === 'default' ? loc.pathname + loc.search : loc.key);

/** Khung app: thanh tren nam tren nen troi nhat, noi dung trang dat trong mot canvas sang bo goc lon (nhu mau Dei) */
export function AppShell() {
  const { t } = useT();
  // Dem thoi gian hoc (mo mon hoc / hoi AI) cho lich tren Dashboard
  useDongHoHoc();
  return (
    <div className="min-h-dvh px-2 pb-4 sm:px-4 sm:pb-6">
      {/* Nguoi dung ban phim bo qua thanh dieu huong: hien khi duoc focus */}
      <a href="#noi-dung"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:font-semibold focus-visible:shadow-soft">
        {t('skipToContent')}
      </a>
      {/* Trang moi bat dau tu dau; Back/Forward tra lai vi tri cu */}
      <ScrollRestoration getKey={khoaCuon} />
      <ChaoMung />
      <TopNav />
      {/* tabIndex -1: dich cua skip link nhan focus duoc; vung noi dung khong phai nut nen khong can vien focus */}
      <main id="noi-dung" tabIndex={-1}
        className="mx-auto w-full max-w-7xl rounded-[1.75rem] bg-canvas px-4 py-6 shadow-soft focus:outline-none sm:rounded-[2rem] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
