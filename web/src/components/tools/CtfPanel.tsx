import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Flag, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useT } from '@/lib/i18n';
import { dichThuThach } from '@/lib/terminal-ban-dich';
import { cn } from '@/lib/utils';
import type { KenhTerminal } from './use-terminal';

type KetQuaNop = { loai: 'dung' | 'trung' | 'sai'; text: string };

const MAU_KET_QUA: Record<KetQuaNop['loai'], string> = {
  dung: 'bg-mint text-mint-ink',
  trung: 'bg-butter text-butter-ink',
  sai: 'bg-destructive/10 text-destructive'
};

export function CtfPanel({ kenh }: { kenh: KenhTerminal }) {
  const { may, nghe } = kenh;
  const { t, lang } = useT();
  const [, veLai] = useState(0);
  const [co, datCo] = useState('');
  const [ketQua, datKetQua] = useState<KetQuaNop | null>(null);
  const oRef = useRef<HTMLInputElement>(null);
  useEffect(() => nghe('diem', () => veLai(v => v + 1)), [nghe]);

  const daGiai = may.coDaGiai();

  function nop(e: FormEvent) {
    e.preventDefault();
    if (!co.trim()) {
      datKetQua({ loai: 'sai', text: t('emptyInputHint') });
      oRef.current?.focus();
      return;
    }
    const truoc = may.coDaGiai().size;
    const kq = may.checkFlag(co);
    if (may.coDaGiai().size > truoc) {
      datKetQua({ loai: 'dung', text: kq });
      datCo('');
    } else {
      datKetQua({ loai: may.CHALLENGES.some(c => c.flag === co.trim()) ? 'trung' : 'sai', text: kq });
      oRef.current?.focus();
    }
  }

  return (
    <section aria-label={t('ctfRegion')} className="space-y-4">
      <div className="space-y-3 rounded-3xl bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-butter text-butter-ink" aria-hidden="true"><Trophy className="size-5" /></span>
            <div>
              <p className="text-sm text-muted-foreground">{t('ctfScore')}</p>
              <p className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{may.diem()}&nbsp;XP</p>
            </div>
          </div>
          <p className="rounded-full bg-sky px-2.5 py-0.5 text-xs font-semibold text-sky-ink tabular-nums">{t('ctfFlagCount', { n: daGiai.size, total: may.CHALLENGES.length })}</p>
        </div>
        <form onSubmit={nop} className="flex w-full gap-2">
          <Input ref={oRef} value={co} onChange={e => datCo(e.target.value)} aria-label={t('ctfFlagLabel')} placeholder="FLAG{…}"
            name="flag" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} translate="no"
            aria-describedby="ctf-ket-qua" className="flex-1 font-mono" />
          <Button type="submit" className="rounded-full"><Flag aria-hidden="true" /> {t('ctfSubmitBtn')}</Button>
        </form>
        <p id="ctf-ket-qua" role="status" className={cn('rounded-2xl px-4 py-2.5 text-sm font-medium empty:hidden', ketQua && MAU_KET_QUA[ketQua.loai])}>{ketQua?.text ?? ''}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {may.CHALLENGES.map(goc => {
          const c = dichThuThach(goc, lang);
          const xong = daGiai.has(c.id);
          return (
            <article key={c.id} aria-label={c.title} className={cn('rounded-2xl p-4 shadow-soft', xong ? 'bg-mint' : 'bg-card')}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{c.title}</h3>
                <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums', xong ? 'bg-card text-mint-ink' : 'bg-butter text-butter-ink')}>
                  {xong ? t('ctfSolved') : `+${c.points} XP`}
                </span>
              </div>
              <p className={cn('mt-1.5 text-sm', xong ? 'text-foreground' : 'text-muted-foreground')}>{c.desc}</p>
              <details className="mt-2 text-sm">
                <summary className={cn('cursor-pointer font-medium', xong ? 'text-mint-ink' : 'text-primary')}>{t('showHints')}</summary>
                <p className={cn('mt-1', xong ? 'text-foreground' : 'text-muted-foreground')}>{c.hint}</p>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
