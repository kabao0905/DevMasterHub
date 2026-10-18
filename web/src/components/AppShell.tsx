import { Outlet, ScrollRestoration, type Location } from 'react-router';
import { useDongHoHoc } from '@/lib/use-thoi-gian-hoc';
import { ChaoMung } from '@/components/ChaoMung';
import { TopNav } from '@/components/TopNav';
import { useT } from '@/lib/i18n';

const khoaCuon = (loc: Location) => (loc.key === 'default' ? loc.pathname + loc.search : loc.key);

export function AppShell() {
  const { t } = useT();
  useDongHoHoc();
  return (
    <div className="min-h-dvh px-2 pb-4 sm:px-4 sm:pb-6">
      <a href="#noi-dung"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:font-semibold focus-visible:shadow-soft">
        {t('skipToContent')}
      </a>
      <ScrollRestoration getKey={khoaCuon} />
      <ChaoMung />
      <TopNav />
      <main id="noi-dung" tabIndex={-1}
        className="mx-auto w-full max-w-7xl rounded-[1.75rem] bg-canvas px-4 py-6 shadow-soft focus:outline-none sm:rounded-[2rem] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
