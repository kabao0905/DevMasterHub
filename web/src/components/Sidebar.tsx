import { useMemo } from 'react';
import { useXacNhan } from '@/components/XacNhan';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, FolderKanban, FlaskConical, LayoutDashboard, LogOut } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useCurriculumIndex, taiJson } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { nhomCongNghe, THU_TU_NHOM, type CongNgheTomTat, type Nhom } from '@/lib/curriculum';
import { tienDoCongNghe } from '@/lib/progress';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BienTuyen } from '@/components/BienTuyen';

export const TEN_NHOM: Record<Nhom, string> = {
  language: 'catLanguages',
  frontend: 'catFrontend',
  backend: 'catBackend',
  mobile: 'catMobile',
  tool: 'catTools'
};

const lopMuc = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring';

export function Sidebar() {
  const { t, lang, setLang, languages } = useT();
  const { profile, user, logout } = useAuth();
  const { data: ds = [] } = useCurriculumIndex();
  const { done } = useProgress();
  const navigate = useNavigate();
  const [hoi, hopXacNhan] = useXacNhan();
  const { pathname } = useLocation();
  const laTrangDuAn = /^\/(project|project-level|project-topic|saved-ideas)(\/|$)/.test(pathname);
  const { data: suc, isPending: dangKiemTraAi } = useQuery({
    queryKey: ['health'],
    queryFn: () => taiJson<{ aiEnabled: boolean }>('/api/health'),
    staleTime: 5 * 60_000
  });

  const nhom = useMemo(() => {
    const m = new Map<Nhom, CongNgheTomTat[]>(THU_TU_NHOM.map(n => [n, []]));
    for (const tech of ds) m.get(nhomCongNghe(tech))!.push(tech);
    return [...m].filter(([, ds]) => ds.length);
  }, [ds]);

  const trangThaiAi = dangKiemTraAi
    ? { cham: 'bg-muted-foreground/40', khoa: 'aiChecking' }
    : suc?.aiEnabled
      ? { cham: 'bg-level-newbie', khoa: 'aiOnline' }
      : { cham: 'bg-destructive', khoa: 'aiOffline' };
  const ten = profile?.display_name || profile?.username || user?.email?.split('@')[0] || '';

  async function dangXuat() {
    if (!(await hoi(t('logoutConfirm'), t('logout')))) return;
    await logout();
    navigate('/auth', { replace: true });
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 pt-5 pr-3 pb-4 pl-5">
        <BrandMark />
      </div>

      <div className="mx-3 flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 font-semibold text-primary" aria-hidden="true">
          {(ten[0] || '?').toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{ten}</p>
          <select
            aria-label={t('langSwitch')}
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="mt-0.5 w-full cursor-pointer rounded-md bg-sidebar text-xs text-sidebar-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Object.values(languages).map(l => (
              <option key={l.code} value={l.code} lang={l.code} className="bg-popover text-popover-foreground">{l.name}</option>
            ))}
          </select>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label={t('logout')} title={t('logout')} onClick={dangXuat}>
          <LogOut />
        </Button>
        {hopXacNhan}
      </div>

      <ScrollArea className="mt-4 min-h-0 flex-1">
        <nav aria-label="DevMaster Hub" className="px-3 pb-4">
          <NavLink to="/" end className={({ isActive }) => cn(lopMuc, isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground')}>
            <LayoutDashboard className="size-4" /> {t('dashboard')}
          </NavLink>
          <Link to="/project" aria-current={laTrangDuAn ? 'page' : undefined}
            className={cn(lopMuc, laTrangDuAn && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground')}>
            <FlaskConical className="size-4" /> {t('projectLab')}
          </Link>
          <NavLink to="/my-projects" className={({ isActive }) => cn(lopMuc, isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground')}>
            <FolderKanban className="size-4" /> {t('myProjects')}
          </NavLink>
          <NavLink to="/career" className={({ isActive }) => cn(lopMuc, isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground')}>
            <Briefcase className="size-4" /> {t('careerAdvisor')}
          </NavLink>

          {nhom.map(([n, techs]) => (
            <div key={n} className="mt-5">
              <h3 className="px-3 pb-1.5 text-xs font-medium text-muted-foreground">{t(TEN_NHOM[n])}</h3>
              {techs.map(tech => {
                const { phanTram } = tienDoCongNghe(tech, done);
                return (
                  <NavLink key={tech.id} to={`/roadmap/${tech.id}`}
                    className={({ isActive }) => cn(lopMuc, 'py-1.5', isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground')}>
                    <BienTuyen tech={tech} co="nho" />
                    <span className="flex-1 truncate">{tech.name}</span>
                    {phanTram > 0 && <span className="text-xs tabular-nums text-muted-foreground">{phanTram}%</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="flex items-center gap-2 border-t border-sidebar-border px-5 py-3 text-xs text-muted-foreground">
        <span className={cn('size-2 rounded-full', trangThaiAi.cham)} aria-hidden="true" />
        {t(trangThaiAi.khoa)}
      </div>
    </div>
  );
}
