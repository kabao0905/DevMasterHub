// Hop xac nhan trong app thay cho window.confirm: trinh duyet nhung (webview, che do chan hop thoai)
// tu tra "khong" cho confirm nen nut dang xuat/xoa bam khong an. Dung:
//   const [hoi, hop] = useXacNhan();  ...  if (await hoi(t('logoutConfirm'), t('logout'))) ...;  return <>{hop}...</>;
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useT } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type CauHoi = { noiDung: string; nutDongY: string };

export function useXacNhan(): [(noiDung: string, nutDongY?: string) => Promise<boolean>, ReactNode] {
  const { t } = useT();
  const [cauHoi, datCauHoi] = useState<CauHoi | null>(null);
  const traLoiRef = useRef<((dongY: boolean) => void) | null>(null);

  const hoi = useCallback((noiDung: string, nutDongY?: string) => new Promise<boolean>(tra => {
    // Hoi chong len cau dang cho: cau cu coi nhu Huy
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
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-base leading-relaxed">{cauHoi?.noiDung}</DialogTitle>
          <DialogDescription className="sr-only">{cauHoi?.noiDung}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => dong(false)}>{t('cancelBtn')}</Button>
          <Button variant="destructive" autoFocus onClick={() => dong(true)}>{cauHoi?.nutDongY}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  return [hoi, hop];
}
