// Thanh dieu huong tren cung cua kieu giao dien Pastel: nen den bo tron, muc dang vien thuoc,
// menu "Lo trinh" (cong nghe theo nhom) va menu "Tai khoan" (giao dien, ngon ngu, dang xuat).
import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { Briefcase, ChevronDown, FlaskConical, FolderKanban, LayoutDashboard, LogOut, Map as MapIcon, Menu } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useGiaoDien, type GiaoDien } from '@/lib/giao-dien';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { nhomCongNghe, THU_TU_NHOM, type CongNgheTomTat, type Nhom } from '@/lib/curriculum';
import { tienDoCongNghe } from '@/lib/progress';
import { useXacNhan } from '@/components/XacNhan';
import { BrandMark } from '@/components/BrandMark';
import { Sidebar, TEN_NHOM } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/** Nhan muc: muc dang mo hien chu, muc khac chi icon (van co ten cho trinh doc man hinh) — nhu mau thiet ke */
const Nhan = ({ mo, children }: { mo: boolean; children: React.ReactNode }) => (
  <span className={mo ? 'whitespace-nowrap' : 'sr-only 2xl:not-sr-only 2xl:whitespace-nowrap'}>{children}</span>
);

const vien = (dangMo: boolean) => cn(
  'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
  dangMo ? 'bg-white font-medium text-neutral-950' : 'text-white/70 hover:bg-white/10 hover:text-white'
);

export function TopNav() {
  const { t, lang, setLang, languages } = useT();
  const { profile, user, logout } = useAuth();
  const { data: ds = [] } = useCurriculumIndex();
  const { done } = useProgress();
  const [giaoDien, datGiaoDien] = useGiaoDien();
  const [hoi, hopXacNhan] = useXacNhan();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [moMenu, datMoMenu] = useState(false);
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
    <header className="sticky top-3 z-30 mx-auto flex h-16 w-full max-w-7xl items-center gap-2 rounded-[1.75rem] bg-neutral-950 px-3 text-white shadow-lg shadow-black/10 sm:px-5">
      <Sheet open={moMenu} onOpenChange={datMoMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label={t('openMenu')}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-sidebar-border p-0">
          <SheetTitle className="sr-only">DevMaster Hub</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
      <Link to="/" className="rounded-full focus-visible:outline-2 focus-visible:outline-white"><BrandMark nho className="whitespace-nowrap" /></Link>

      <nav aria-label="DevMaster Hub" className="mx-auto hidden items-center gap-1 lg:flex">
        <NavLink to="/" end className={({ isActive }) => vien(isActive)}>
          {({ isActive }) => <><LayoutDashboard className="size-4" aria-hidden="true" /> <Nhan mo={isActive}>{t('dashboard')}</Nhan></>}
        </NavLink>
        <DropdownMenu>
          <DropdownMenuTrigger className={vien(laLoTrinh)}>
            <MapIcon className="size-4" aria-hidden="true" /> <Nhan mo={laLoTrinh}>{t('roadmapsMenu')}</Nhan> <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[70vh] w-64 overflow-y-auto rounded-2xl p-2">
            {nhom.map(([n, techs], i) => (
              <div key={n}>
                {i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="text-xs text-muted-foreground">{t(TEN_NHOM[n])}</DropdownMenuLabel>
                {techs.map(tech => {
                  const { phanTram } = tienDoCongNghe(tech, done);
                  return (
                    <DropdownMenuItem key={tech.id} asChild className="rounded-xl">
                      <Link to={`/roadmap/${tech.id}`}>
                        <span className="w-5 text-center" aria-hidden="true">{tech.icon}</span>
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
          <FlaskConical className="size-4" aria-hidden="true" /> <Nhan mo={laTrangDuAn}>{t('projectLab')}</Nhan>
        </Link>
        <NavLink to="/my-projects" className={({ isActive }) => vien(isActive)}>
          {({ isActive }) => <><FolderKanban className="size-4" aria-hidden="true" /> <Nhan mo={isActive}>{t('myProjects')}</Nhan></>}
        </NavLink>
        <NavLink to="/career" className={({ isActive }) => vien(isActive)}>
          {({ isActive }) => <><Briefcase className="size-4" aria-hidden="true" /> <Nhan mo={isActive}>{t('careerAdvisor')}</Nhan></>}
        </NavLink>
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger aria-label={t('accountMenu')}
          className="ml-auto flex items-center gap-2 rounded-full py-1 pr-2 pl-1 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white lg:ml-0">
          <span className="grid size-9 place-items-center rounded-full bg-pastel-lavender font-semibold text-neutral-900" aria-hidden="true">
            {(ten[0] || '?').toUpperCase()}
          </span>
          <span className="hidden max-w-32 truncate xl:inline">{ten}</span>
          <ChevronDown className="size-4 opacity-70" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
          <DropdownMenuLabel className="truncate">{ten}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">{t('themeLabel')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={giaoDien} onValueChange={g => datGiaoDien(g as GiaoDien)}>
            <DropdownMenuRadioItem value="co-dien" className="rounded-xl">{t('themeClassic')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pastel" className="rounded-xl">{t('themePastel')}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">{t('langSwitch')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
            {Object.values(languages).map(l => (
              <DropdownMenuRadioItem key={l.code} value={l.code} className="rounded-xl">{l.flag} {l.name}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-xl" onSelect={() => { void dangXuat(); }}>
            <LogOut aria-hidden="true" /> {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {hopXacNhan}
    </header>
  );
}
