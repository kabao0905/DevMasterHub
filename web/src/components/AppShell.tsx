import { useState } from 'react';
import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { Sidebar } from '@/components/Sidebar';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function AppShell() {
  const { t } = useT();
  const [moMenu, datMoMenu] = useState(false);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-sidebar-border lg:block">
        <Sidebar />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur lg:hidden">
          <Sheet open={moMenu} onOpenChange={datMoMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('openMenu')}>
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
