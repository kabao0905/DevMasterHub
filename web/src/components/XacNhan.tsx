import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useT } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type CauHoi = { noiDung: string; nutDongY: string };

export function useXacNhan(): [(noiDung: string, nutDongY?: string) => Promise<boolean>, ReactNode] {
  const { t } = useT();
  const [cauHoi, datCauHoi] = useState<CauHoi | null>(null);
  const traLoiRef = useRef<((dongY: boolean) => void) | null>(null);

  const hoi = useCallback((noiDung: string, nutDongY?: string) => new Promise<boolean>(tra => {
    traLoiRef.current?.(false);
    traLoiRef.current = tra;
    datCauHoi({ noiDung, nutDongY: nutDongY ?? t('confirmBtn') });
  }), [t]);

  const dong = (dongY: boolean) => {
    traLoiRef.current?.(dongY);
    traLoiRef.current = null;
    datCauHoi(null);
  };

  const hop = (
    <Dialog open={!!cauHoi} onOpenChange={mo => { if (!mo) dong(false); }}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-base leading-relaxed">{cauHoi?.noiDung}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => dong(false)}>{t('cancelBtn')}</Button>
          <Button variant="destructive" onClick={() => dong(true)}>{cauHoi?.nutDongY}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  return [hoi, hop];
}
