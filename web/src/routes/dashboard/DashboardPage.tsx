import { useDeferredValue, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Play, Search } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { nhomCongNghe, THU_TU_NHOM, type CongNgheTomTat, type Nhom } from '@/lib/curriculum';
import { baiKeTiep, dangHocDo, tienDoCongNghe, tienDoTong, type ViTriBai } from '@/lib/progress';
import { TEN_NHOM } from '@/components/Sidebar';
import { TechCard } from '@/components/TechCard';
import { LevelLadder } from '@/components/LevelLadder';
import { BienTuyen } from '@/components/BienTuyen';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadError } from '@/components/LoadError';
import { SearchResults } from './SearchResults';
import { LichHoc } from './LichHoc';
import { cn } from '@/lib/utils';

const duongDanBai = ({ tech, level, lesson }: ViTriBai) => `/lesson/${tech.id}/${level.id}/${lesson.id}`;

/**
 * "Hoc tiep": bai can lam ngay, nhu to giay nho duoc rut ra khoi lo trinh — the oai huong nghieng nhe, noi len,
 * re chuot thi thang lai. Kem doan lo trinh da di cua cong nghe do.
 */
function HocTiep({ viTri, done }: { viTri: ViTriBai | null; done: Set<string> }) {
  const { t, translateTitle } = useT();
  // Chua hoc bai nao: cot "Goi y bat dau" ben phai va luoi lo trinh ben duoi da la loi moi
  if (!viTri) return null;
  const { tech, level, lesson } = viTri;
  const td = tienDoCongNghe(tech, done);
  return (
    <section aria-labelledby="hoc-tiep"
      className="rounded-[1.75rem] bg-lavender p-6 shadow-lift transition-transform duration-300 sm:p-7 xl:-rotate-[0.6deg] xl:hover:rotate-0 motion-reduce:transition-none">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          {/* Nhan "Hoc tiep" chi cho trinh doc man hinh: the oai huong nghieng da noi ro day la bai can lam ngay */}
          <h2 id="hoc-tiep" className="sr-only">{t('continueLearning')}</h2>
          <p className="font-display text-3xl leading-tight font-extrabold text-balance">{translateTitle(lesson.title)}</p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <BienTuyen tech={tech} co="nho" />
            <span className="font-medium">{tech.name}</span>
            <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-lavender-ink">{level.name}</span>
          </p>
        </div>
        <Link to={duongDanBai(viTri)}
          className="nut-noi inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-signal py-2 pr-5 pl-2 font-semibold text-signal-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <span className="vong-nhip grid size-8 place-items-center rounded-full bg-white/45" aria-hidden="true">
            <Play className="size-4 translate-x-px fill-current" />
          </span>
          {t('openLesson')}
        </Link>
      </div>
      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-card/75 px-4 py-3">
        <LevelLadder levels={tech.levels} theoCap={td.theoCap} className="flex-1" />
        <p className="shrink-0 text-xs tabular-nums">{td.xong}/{td.tong} {t('lessonsUnit')}</p>
      </div>
    </section>
  );
}

/** Mau nen cho the "Sap toi" — moi the mot mang pastel, xoay vong */
const NEN_SAP_TOI = ['bg-sky', 'bg-butter', 'bg-pink', 'bg-peach'];

/** Hang "Sap toi": bai ke tiep cua cac cong nghe khac dang hoc do; chua hoc gi thi goi y bai dau cua vai cong nghe */
function SapToi({ ds, done, boQua }: { ds: CongNgheTomTat[]; done: Set<string>; boQua?: string }) {
  const { t, translateTitle } = useT();
  const dangHoc = useMemo(() => dangHocDo(ds, done).filter(v => v.tech.id !== boQua).slice(0, 3), [ds, done, boQua]);
  const goiY = useMemo<ViTriBai[]>(() => (dangHoc.length || boQua ? [] : ds
    .filter(tech => tienDoCongNghe(tech, done).xong === 0 && tech.levels[0]?.lessons[0])
    .slice(0, 3)
    .map(tech => ({ tech, level: tech.levels[0], lesson: tech.levels[0].lessons[0] }))), [ds, done, dangHoc.length, boQua]);
  const ds2 = dangHoc.length ? dangHoc : goiY;
  if (!ds2.length) return null;
  return (
    <section aria-labelledby="sap-toi" className="space-y-3">
      <h2 id="sap-toi" className="px-1 font-display text-xl font-extrabold">{dangHoc.length ? t('upcomingTitle') : t('suggestStartTitle')}</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {ds2.map((v, i) => (
          <li key={v.tech.id} className="min-w-0">
            <Link to={duongDanBai(v)} aria-label={`${translateTitle(v.lesson.title)} (${v.tech.name}, ${v.level.name})`}
              className={cn('the-noi block h-full rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring', NEN_SAP_TOI[i % NEN_SAP_TOI.length])}>
              <span className="flex items-center gap-2">
                <BienTuyen tech={v.tech} co="nho" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{v.tech.name}</span>
                <span className="shrink-0 text-xs font-medium text-foreground/75">{v.level.name}</span>
              </span>
              <span className="mt-2 block font-display text-base leading-snug font-bold">{translateTitle(v.lesson.title)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DashboardPage() {
  const { t } = useT();
  const { data: ds = [], isLoading, isError, refetch } = useCurriculumIndex();
  const { done } = useProgress();
  // Tu khoa tim kiem nam tren URL (?q=): tai lai / quay lai / chia se link van giu ket qua
  const [thamSo, datThamSo] = useSearchParams();
  const q = thamSo.get('q') ?? '';
  const qTre = useDeferredValue(q);
  const datQ = (v: string) => datThamSo(cu => {
    const moi = new URLSearchParams(cu);
    if (v) moi.set('q', v); else moi.delete('q');
    return moi;
  }, { replace: true });

  usePageMeta({ title: `${t('dashboard')} | DevMaster Hub`, description: t('dashboardSubtitle') });

  const tong = useMemo(() => tienDoTong(ds, done), [ds, done]);
  const keTiep = useMemo(() => baiKeTiep(ds, done), [ds, done]);
  const nhom = useMemo(() => {
    const m = new Map<Nhom, CongNgheTomTat[]>(THU_TU_NHOM.map(n => [n, []]));
    for (const tech of ds) m.get(nhomCongNghe(tech))!.push(tech);
    return [...m].filter(([, x]) => x.length);
  }, [ds]);

  const tieuDe = (
    <header className="min-w-0">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('dashboardTitle')}</h1>
      <p className="mt-1 text-muted-foreground">{t('dashboardSubtitle')}</p>
    </header>
  );

  if (isError) {
    return (
      <div className="space-y-8">
        {tieuDe}
        <LoadError onRetry={() => refetch()} />
      </div>
    );
  }

  // So lieu: bon o gon nhu ban truoc nguoi dung thich — so cong nghe, tong so bai, bai da xong, tien do %
  const soLieu: [string, number | string, string][] = [
    [t('statTech'), ds.length, 'bg-sky text-sky-ink'],
    [t('statLessons'), tong.tong, 'bg-lavender text-lavender-ink'],
    [t('statCompleted'), tong.xong, 'bg-mint text-mint-ink'],
    [t('statProgress'), `${tong.phanTram}%`, 'border-2 border-dashed border-border']
  ];

  return (
    <div className="space-y-8">
      {/* Tieu de + so lieu ben trai, lich hoc ben phai cao bang ca khoi do; man hep thi xep doc */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
        <div className="flex shrink-0 flex-col justify-between gap-6">
          {tieuDe}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {soLieu.map(([nhan, so, mau]) => (
              <div key={nhan} className={cn('flex min-w-28 flex-col-reverse items-center rounded-3xl px-4 py-4 text-center', mau)}>
                <dt className="mt-0.5 text-xs font-medium">{nhan}</dt>
                <dd className="font-display text-3xl leading-none font-extrabold tabular-nums">{so}</dd>
              </div>
            ))}
          </dl>
        </div>
        <LichHoc className="xl:flex-1" />
      </div>
      {isLoading ? <Skeleton className="h-52 w-full rounded-[1.75rem]" /> : <HocTiep viTri={keTiep} done={done} />}
      {!isLoading && <SapToi ds={ds} done={done} boQua={keTiep?.tech.id} />}

      <div className="kich-dong relative">
        <Search data-dong="kinh" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          name="q"
          autoComplete="off"
          spellCheck={false}
          value={q}
          onChange={e => datQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="h-11 rounded-full border-transparent bg-card pl-10 shadow-soft"
        />
      </div>

      <div className="min-w-0 space-y-10 pt-2">
        {qTre.trim() ? (
          <SearchResults q={qTre} ds={ds} />
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)}
          </div>
        ) : (
          nhom.map(([n, techs]) => (
            <section key={n} className="space-y-4">
              <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold">
                {t(TEN_NHOM[n])}
                <span aria-hidden="true" className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-sm font-semibold text-muted-foreground tabular-nums">{techs.length}</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {techs.map(tech => <TechCard key={tech.id} tech={tech} done={done} />)}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
