import { useMemo } from 'react';
import { Link } from 'react-router';
import { useT } from '@/lib/i18n';
import { useSearchIndex } from '@/lib/use-curriculum';
import { timBaiHoc, type CongNgheTomTat } from '@/lib/curriculum';
import { CHU_CAP } from '@/components/LevelLadder';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadError } from '@/components/LoadError';
import { cn } from '@/lib/utils';
import { BienTuyen } from '@/components/BienTuyen';

export function SearchResults({ q, ds }: { q: string; ds: CongNgheTomTat[] }) {
  const { t, translateTitle } = useT();
  const { data, isLoading, isError, refetch } = useSearchIndex(true);
  const ketQua = useMemo(() => timBaiHoc(data ?? [], q), [data, q]);
  const theoId = useMemo(() => new Map(ds.map(x => [x.id, x])), [ds]);

  if (isError) return <LoadError onRetry={() => refetch()} />;
  if (isLoading) {
    return <div className="space-y-2" aria-busy="true">{[0, 1, 2].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>;
  }
  if (!ketQua.length) {
    return <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">{t('noSearchResults', { q })}</p>;
  }

  return (
    <section aria-live="polite">
      <p className="mb-3 text-sm text-muted-foreground">{t('searchFound', { n: ketQua.length })}</p>
      <ul className="divide-y rounded-xl border bg-card">
        {ketQua.map(m => {
          const tech = theoId.get(m.t);
          const cap = tech?.levels.find(l => l.id === m.l);
          return (
            <li key={`${m.t}.${m.l}.${m.s}`}>
              <Link to={`/lesson/${m.t}/${m.l}/${m.s}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring">
                {tech && <BienTuyen tech={tech} co="nho" className="h-6 min-w-9 text-xs" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{translateTitle(m.title)}</span>
                  <span className="block truncate text-xs text-muted-foreground">{tech?.name}</span>
                </span>
                <span className={cn('text-xs font-medium', CHU_CAP[m.l] ?? 'text-primary')}>{cap?.name ?? m.l}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
