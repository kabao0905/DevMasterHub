import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { Menu, PanelLeftOpen } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { Sidebar } from '@/components/Sidebar';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

/** Moi lan sang app cu roi quay lai la tai trang moi, nen lua chon thu gon phai luu tren may */
const KHOA_THU_GON = 'devmaster_hub_sidebar_collapsed';
function docThuGon() {
  try { return localStorage.getItem(KHOA_THU_GON) === '1'; } catch { return false; }
}

export function AppShell() {
  const { t } = useT();
  const [moMenu, datMoMenu] = useState(false);
  const { pathname } = useLocation();
  // Di trang bang router khong tai lai trang: tu dong menu tren dien thoai
  useEffect(() => { datMoMenu(false); }, [pathname]);
  const [thuGon, datThuGon] = useState(docThuGon);
  const doiThuGon = (v: boolean) => {
    datThuGon(v);
    try { localStorage.setItem(KHOA_THU_GON, v ? '1' : '0'); } catch { /* che do rieng tu */ }
  };

  return (
    <div className={cn('min-h-dvh', !thuGon && 'lg:grid lg:grid-cols-[17rem_1fr]')}>
      {/* Trang moi bat dau tu dau; Back/Forward tra lai vi tri cu */}
      <ScrollRestoration />
      {!thuGon && (
        <aside className="sticky top-0 hidden h-dvh border-r border-sidebar-border lg:block">
          <Sidebar onCollapse={() => doiThuGon(true)} />
        </aside>
      )}

      <div className="min-w-0">
        <header className={cn('sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur', !thuGon && 'lg:hidden')}>
          {thuGon && (
            <Button variant="ghost" size="icon" className="hidden lg:inline-flex" aria-label={t('expandSidebar')} title={t('expandSidebar')} onClick={() => doiThuGon(false)}>
              <PanelLeftOpen />
            </Button>
          )}
          <Sheet open={moMenu} onOpenChange={datMoMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t('openMenu')}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border p-0">
              <SheetTitle className="sr-only">DevMaster Hub</SheetTitle>
              <Sidebar />
            </SheetContent>
          </Sheet>
          <BrandMark nho />
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
