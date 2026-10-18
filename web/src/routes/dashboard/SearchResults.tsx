import { useMemo } from 'react';
import { Link } from 'react-router';
import { ChevronRight, SearchX } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { useSearchIndex } from '@/lib/use-curriculum';
import { timBaiHoc, type CongNgheTomTat } from '@/lib/curriculum';
import { MAU_CAP } from '@/components/LevelLadder';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadError } from '@/components/LoadError';
import { cn } from '@/lib/utils';
import { BienTuyen } from '@/components/BienTuyen';

const GIOI_HAN = 50;

export function SearchResults({ q, ds }: { q: string; ds: CongNgheTomTat[] }) {
  const { t, translateTitle } = useT();
  const { data, isLoading, isError, refetch } = useSearchIndex(true);
  const ketQua = useMemo(() => timBaiHoc(data ?? [], q, GIOI_HAN), [data, q]);
  const theoId = useMemo(() => new Map(ds.map(x => [x.id, x])), [ds]);

  if (isError) return <LoadError onRetry={() => refetch()} />;

  const thongBao = isLoading ? ''
    : !ketQua.length ? t('noSearchResults', { q })
      : ketQua.length >= GIOI_HAN ? t('searchResultsCapped', { n: GIOI_HAN }) : t('searchFound', { n: ketQua.length });

  return (
    <section className="space-y-3">
      <p role="status" className={cn(!isLoading && !ketQua.length
        ? 'flex flex-col items-center gap-3 rounded-3xl bg-sky px-6 py-10 text-center font-medium text-balance break-words text-sky-ink'
        : 'text-sm text-muted-foreground')}>
        {!isLoading && !ketQua.length && <SearchX className="size-8" aria-hidden="true" />}
        {thongBao}
      </p>
      {isLoading ? (
        <div className="space-y-2" aria-busy="true">{[0, 1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}</div>
      ) : !ketQua.length ? null : (
        <ul className="space-y-2">
          {ketQua.map(m => {
            const tech = theoId.get(m.t);
            const cap = tech?.levels.find(l => l.id === m.l);
            return (
              <li key={`${m.t}.${m.l}.${m.s}`}>
                <Link to={`/lesson/${m.t}/${m.l}/${m.s}`}
                  className="the-noi flex items-center gap-4 rounded-2xl bg-card px-4 py-3 shadow-soft focus-visible:outline-2 focus-visible:outline-ring">
                  {tech && <BienTuyen tech={tech} co="vua" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{translateTitle(m.title)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{tech?.name}</span>
                  </span>
                  <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white dark:text-background', MAU_CAP[m.l] ?? 'bg-primary')}>{cap?.name ?? m.l}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
