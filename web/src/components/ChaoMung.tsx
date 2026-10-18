import { useState } from 'react';
import { Bot, Loader2, Map, Rocket } from 'lucide-react';
import { RadioGroup } from 'radix-ui';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { CHON_MUC_TIEU, MUC_TIEU_MAC_DINH, useMucTieu } from '@/lib/use-thoi-gian-hoc';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const DIEM_NOI_BAT = [
  { Icon: Map, khoa: 'welcomePoint1', nen: 'bg-mint', muc: 'text-mint-ink' },
  { Icon: Bot, khoa: 'welcomePoint2', nen: 'bg-lavender', muc: 'text-lavender-ink' },
  { Icon: Rocket, khoa: 'welcomePoint3', nen: 'bg-butter', muc: 'text-butter-ink' }
] as const;

export function HopMucTieu({ mo, onDong, chaoMung = false }: { mo: boolean; onDong: () => void; chaoMung?: boolean }) {
  const { t } = useT();
  const { profile, user } = useAuth();
  const { phut, luu } = useMucTieu();
  const [chon, datChon] = useState<number>(phut ?? MUC_TIEU_MAC_DINH);
  const [dangLuu, datDangLuu] = useState(false);
  const ten = profile?.display_name || profile?.username || user?.email?.split('@')[0] || '';

  async function xacNhan() {
    datDangLuu(true);
    try {
      await luu(chon);
      onDong();
    } catch {
      toast.error(t('goalSaveFailed'));
    } finally {
      datDangLuu(false);
    }
  }

  return (
    <Dialog open={mo} onOpenChange={m => { if (!m && !chaoMung) onDong(); }}>
      <DialogContent className="gap-5 rounded-3xl bg-card p-6 shadow-soft ring-0 sm:max-w-md" showCloseButton={!chaoMung}
        {...(chaoMung ? {} : { 'aria-describedby': undefined })}
        onEscapeKeyDown={e => { if (chaoMung) e.preventDefault(); }}
        onPointerDownOutside={e => { if (chaoMung) e.preventDefault(); }}>
        <DialogHeader>
          <DialogTitle className="pr-8 font-display text-2xl leading-tight font-extrabold tracking-tight text-balance">
            {chaoMung ? t('welcomeTitle', { name: ten }) : t('changeGoalTitle')}
          </DialogTitle>
          {chaoMung && <DialogDescription>{t('welcomeIntro')}</DialogDescription>}
        </DialogHeader>

        {chaoMung && (
          <ul className="grid gap-2">
            {DIEM_NOI_BAT.map(({ Icon, khoa, nen, muc }) => (
              <li key={khoa} className={cn('flex items-start gap-3 rounded-2xl p-3 text-sm text-foreground', nen)}>
                <span className={cn('grid size-8 shrink-0 place-items-center rounded-xl bg-card/70', muc)} aria-hidden="true"><Icon className="size-4" /></span>
                <span className="pt-1.5">{t(khoa)}</span>
              </li>
            ))}
          </ul>
        )}

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold">{t('dailyGoalQuestion')}</legend>
          <RadioGroup.Root value={String(chon)} onValueChange={v => datChon(Number(v))} orientation="horizontal" loop
            aria-label={t('dailyGoalQuestion')} className="mt-3 grid grid-cols-5 gap-2">
            {CHON_MUC_TIEU.map(n => (
              <RadioGroup.Item key={n} value={String(n)}
                className={cn(
                  'rounded-2xl border px-1 py-2.5 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  chon === n ? 'border-transparent bg-lavender text-lavender-ink' : 'bg-card hover:bg-muted'
                )}>
                {t('minutesN', { n })}
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </fieldset>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t-0 bg-transparent p-0">
          <Button className="h-10 w-full rounded-full bg-signal px-5 text-signal-foreground hover:bg-signal hover:brightness-105 sm:w-auto" onClick={() => { void xacNhan(); }} disabled={dangLuu}>
            {dangLuu && <Loader2 className="motion-safe:animate-spin" aria-hidden="true" />}
            {chaoMung ? t('startLearningBtn') : t('saveGoalBtn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ChaoMung() {
  const { daChon } = useMucTieu();
  const [daDong, datDaDong] = useState(false);
  return <HopMucTieu mo={!daChon && !daDong} onDong={() => datDaDong(true)} chaoMung />;
}
