import { Outlet, ScrollRestoration, type Location } from 'react-router';
import { useDongHoHoc } from '@/lib/use-thoi-gian-hoc';
import { ChaoMung } from '@/components/ChaoMung';
import { TopNav } from '@/components/TopNav';

/**
 * Khoa luu vi tri cuon. Muc lich su dau cua moi lan tai trang (vao tu app cu, go URL) luon co khoa "default":
 * neu giu khoa do, trang moi se nhan vi tri cuon cua mot trang "default" khac da roi di. Luu theo URL thi
 * tai lai dung trang van tra lai cho cu, con trang khac bat dau tu dau.
 */
const khoaCuon = (loc: Location) => (loc.key === 'default' ? loc.pathname + loc.search : loc.key);

/** Khung app: bang chi dan tren cung + noi dung dat thang tren nen ban do */
export function AppShell() {
  // Dem thoi gian hoc (mo mon hoc / hoi AI) cho lich tren Dashboard
  useDongHoHoc();
  return (
    <div className="min-h-dvh">
      {/* Trang moi bat dau tu dau; Back/Forward tra lai vi tri cu */}
      <ScrollRestoration getKey={khoaCuon} />
      <ChaoMung />
      <TopNav />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
