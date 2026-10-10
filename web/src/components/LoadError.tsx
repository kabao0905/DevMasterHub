import { useT } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

/** Tai du lieu loi: noi ro va cho thu lai, khong de nguoi dung nhin trang rong */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useT();
  return (
    <div role="alert" className="flex flex-col items-start gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p>{t('loadFailed')}</p>
      <Button variant="outline" size="sm" className="shrink-0" onClick={onRetry}>{t('retry')}</Button>
    </div>
  );
}
