// Bang chao mung sau khi tao tai khoan: gioi thieu nen tang va hoi muc tieu hoc moi ngay.
// HopMucTieu dung lai de doi muc tieu tu lich hoc tren Dashboard.
import { useState } from 'react';
import { Bot, Loader2, Map, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { CHON_MUC_TIEU, MUC_TIEU_MAC_DINH, useMucTieu } from '@/lib/use-thoi-gian-hoc';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const DIEM_NOI_BAT = [
  { Icon: Map, khoa: 'welcomePoint1' },
  { Icon: Bot, khoa: 'welcomePoint2' },
  { Icon: Rocket, khoa: 'welcomePoint3' }
] as const;

/**
 * chaoMung: lan dau (co gioi thieu, bat buoc chon — khong dong bang Esc/bam ra ngoai).
 * Khong chaoMung: doi muc tieu, dong duoc.
 */
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
      {/* Bang doi muc tieu khong co dong mo ta: aria-describedby={undefined} bao Radix khoi canh bao thieu Description */}
      <DialogContent className="sm:max-w-md" showCloseButton={!chaoMung} {...(chaoMung ? {} : { 'aria-describedby': undefined })}
        onEscapeKeyDown={e => { if (chaoMung) e.preventDefault(); }}
        onPointerDownOutside={e => { if (chaoMung) e.preventDefault(); }}>
        <DialogHeader>
          <DialogTitle className="text-xl">{chaoMung ? t('welcomeTitle', { name: ten }) : t('changeGoalTitle')}</DialogTitle>
          {chaoMung && <DialogDescription>{t('welcomeIntro')}</DialogDescription>}
        </DialogHeader>

        {chaoMung && (
          <ul className="space-y-2.5">
            {DIEM_NOI_BAT.map(({ Icon, khoa }) => (
              <li key={khoa} className="flex items-start gap-3 text-sm">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary" aria-hidden="true"><Icon className="size-4" /></span>
                <span className="pt-1.5">{t(khoa)}</span>
              </li>
            ))}
          </ul>
        )}

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">{t('dailyGoalQuestion')}</legend>
          <div role="radiogroup" aria-label={t('dailyGoalQuestion')} className="mt-3 grid grid-cols-5 gap-2">
            {CHON_MUC_TIEU.map(n => (
              <button key={n} type="button" role="radio" aria-checked={chon === n} onClick={() => datChon(n)}
                className={cn(
                  'rounded-lg border px-1 py-2.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                  chon === n ? 'border-primary bg-primary/15 text-primary' : 'hover:bg-muted'
                )}>
                {t('minutesN', { n })}
              </button>
            ))}
          </div>
        </fieldset>

        <DialogFooter>
          <Button className="w-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105 sm:w-auto" onClick={() => { void xacNhan(); }} disabled={dangLuu}>
            {dangLuu && <Loader2 className="animate-spin" aria-hidden="true" />}
            {chaoMung ? t('startLearningBtn') : t('saveGoalBtn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Dat o khung app: nguoi chua chon muc tieu (vua tao tai khoan) thi hien bang chao mung */
export function ChaoMung() {
  const { daChon } = useMucTieu();
  const [daDong, datDaDong] = useState(false);
  return <HopMucTieu mo={!daChon && !daDong} onDong={() => datDaDong(true)} chaoMung />;
}
