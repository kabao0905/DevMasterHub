// Thanh dieu huong tren cung: thanh trang bo tron noi tren nen troi (nhu mau Dei), muc dang mo la vien thuoc xanh troi, menu "Lo trinh" (cong nghe theo nhom),
// cong tac sang / toi va menu "Tai khoan" (ngon ngu, dang xuat). Dien thoai: nut mo menu ben.
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { Briefcase, ChevronDown, FlaskConical, FolderKanban, LogOut, Map as MapIcon, Menu } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { nhomCongNghe, THU_TU_NHOM, type CongNgheTomTat, type Nhom } from '@/lib/curriculum';
import { tienDoCongNghe } from '@/lib/progress';
import { useXacNhan } from '@/components/XacNhan';
import { BrandMark } from '@/components/BrandMark';
import { BienTuyen } from '@/components/BienTuyen';
import { CongTacSangToi } from '@/components/CongTacSangToi';
import { Sidebar, TEN_NHOM } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/** Nhan muc: man rong hien chu moi muc; man vua chi muc dang mo hien chu, muc khac chi icon (van co ten cho trinh doc man hinh) */
const Nhan = ({ mo, children }: { mo: boolean; children: React.ReactNode }) => (
  <span className={mo ? 'whitespace-nowrap' : 'sr-only xl:not-sr-only xl:whitespace-nowrap'}>{children}</span>
);

/** Muc dang mo: vien thuoc xanh troi tren thanh trang (nhu tab dang chon), muc khac chu dam vua, re chuot nen xam nhat */
const DANG_MO = 'bg-sky font-semibold text-sky-ink';
const vien = (dangMo: boolean) => cn(
  'kich-dong flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  dangMo ? DANG_MO : 'text-foreground/75 hover:bg-muted hover:text-foreground'
);

export function TopNav() {
  const { t, lang, setLang, languages } = useT();
  const { profile, user, logout } = useAuth();
  const { data: ds = [] } = useCurriculumIndex();
  const { done } = useProgress();
  const [hoi, hopXacNhan] = useXacNhan();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [moMenu, datMoMenu] = useState(false);
  // Di trang bang router khong tai lai trang: tu dong menu ben tren dien thoai
  useEffect(() => { datMoMenu(false); }, [pathname]);
  const laTrangDuAn = /^\/(project|project-level|project-topic|saved-ideas)(\/|$)/.test(pathname);
  const laLoTrinh = /^\/(roadmap|lesson)\//.test(pathname);
  const ten = profile?.display_name || profile?.username || user?.email?.split('@')[0] || '';

  const nhom = useMemo(() => {
    const m = new Map<Nhom, CongNgheTomTat[]>(THU_TU_NHOM.map(n => [n, []]));
    for (const tech of ds) m.get(nhomCongNghe(tech))!.push(tech);
    return [...m].filter(([, x]) => x.length);
  }, [ds]);

  async function dangXuat() {
    if (!(await hoi(t('logoutConfirm'), t('logout')))) return;
    await logout();
    navigate('/auth', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 -mx-2 bg-background px-2 pt-2 pb-3 text-foreground sm:-mx-4 sm:px-4 sm:pt-3">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 rounded-full bg-card px-2 shadow-soft sm:px-3">
      <Sheet open={moMenu} onOpenChange={datMoMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label={t('openMenu')}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-sidebar-border p-0">
          <SheetTitle className="sr-only">DevMaster Hub</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
      {/* Logo kiem luon loi vao Dashboard (khong con muc Dashboard rieng tren thanh): dang o Dashboard thi vien thuoc xanh troi */}
      <NavLink to="/" end title={t('dashboard')}
        className={({ isActive }) => cn(
          'kich-dong rounded-full py-1 pr-3.5 pl-1 transition-colors focus-visible:outline-2 focus-visible:outline-ring',
          isActive ? DANG_MO : 'hover:bg-muted'
        )}>
        <BrandMark nho className="whitespace-nowrap" />
        <span className="sr-only"> – {t('dashboard')}</span>
      </NavLink>

      <nav aria-label="DevMaster Hub" className="mx-auto hidden items-center gap-1 lg:flex">
        <DropdownMenu>
          <DropdownMenuTrigger className={vien(laLoTrinh)}>
            <MapIcon data-dong="ban-do" className="size-4" aria-hidden="true" /> <Nhan mo={laLoTrinh}>{t('roadmapsMenu')}</Nhan> <ChevronDown data-dong="mo" className="size-3.5 opacity-70" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[70vh] w-64 overflow-y-auto overscroll-contain rounded-2xl p-2">
            {nhom.map(([n, techs], i) => (
              <div key={n}>
                {i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="text-xs text-muted-foreground">{t(TEN_NHOM[n])}</DropdownMenuLabel>
                {techs.map(tech => {
                  const { phanTram } = tienDoCongNghe(tech, done);
                  return (
                    <DropdownMenuItem key={tech.id} asChild className="rounded-xl">
                      <Link to={`/roadmap/${tech.id}`}>
                        <BienTuyen tech={tech} co="nho" />
                        <span className="flex-1 truncate">{tech.name}</span>
                        {phanTram > 0 && <span className="text-xs tabular-nums text-muted-foreground">{phanTram}%</span>}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to="/project" aria-current={laTrangDuAn ? 'page' : undefined} className={vien(laTrangDuAn)}>
          <FlaskConical data-dong="binh" className="size-4" aria-hidden="true" /> <Nhan mo={laTrangDuAn}>{t('projectLab')}</Nhan>
        </Link>
        <NavLink to="/my-projects" className={({ isActive }) => vien(isActive)}>
          {({ isActive }) => <><FolderKanban data-dong="nay" className="size-4" aria-hidden="true" /> <Nhan mo={isActive}>{t('myProjects')}</Nhan></>}
        </NavLink>
        <NavLink to="/career" className={({ isActive }) => vien(isActive)}>
          {({ isActive }) => <><Briefcase data-dong="cap" className="size-4" aria-hidden="true" /> <Nhan mo={isActive}>{t('careerAdvisor')}</Nhan></>}
        </NavLink>
      </nav>

      <CongTacSangToi className="ml-auto lg:ml-0" />
      <DropdownMenu>
        {/* Ten tai khoan nam trong nhan (WCAG 2.5.3): nguoi doc bang giong noi goi dung chu dang thay */}
        <DropdownMenuTrigger aria-label={ten ? `${t('accountMenu')}: ${ten}` : t('accountMenu')}
          className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
          <span className="grid size-9 place-items-center rounded-full bg-lavender font-display font-extrabold text-lavender-ink" aria-hidden="true">
            {(ten[0] || '?').toUpperCase()}
          </span>
          <span className="hidden max-w-32 truncate xl:inline">{ten}</span>
          <ChevronDown data-dong="mo" className="size-4 opacity-70" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
          <DropdownMenuLabel className="truncate">{ten}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">{t('langSwitch')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
            {Object.values(languages).map(l => (
              <DropdownMenuRadioItem key={l.code} value={l.code} className="rounded-xl">
                <span aria-hidden="true">{l.flag}</span> <span lang={l.code}>{l.name}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-xl" onSelect={() => { void dangXuat(); }}>
            <LogOut aria-hidden="true" /> {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      {hopXacNhan}
    </header>
  );
}
