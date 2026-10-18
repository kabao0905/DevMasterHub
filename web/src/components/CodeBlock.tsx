import { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useT } from '@/lib/i18n';
import { tenNgonNgu, toMauCode } from '@/lib/highlight';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CodeBlock({ code, lang, className }: { code: string; lang?: string; className?: string }) {
  const { t } = useT();
  const [daChep, datDaChep] = useState(false);
  const html = useMemo(() => toMauCode(code, lang), [code, lang]);
  const nhan = lang ? `${t('codeBlockLabel')} (${lang})` : t('codeBlockLabel');

  useEffect(() => {
    if (!daChep) return;
    const h = setTimeout(() => datDaChep(false), 2000);
    return () => clearTimeout(h);
  }, [daChep]);

  async function chep() {
    try {
      await navigator.clipboard.writeText(code);
      datDaChep(true);
    } catch {
      toast.error(t('copyFailed'));
    }
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl border bg-code', className)}>
      <Button variant="ghost" size="sm" onClick={chep}
        className="absolute top-2 right-2 h-7 bg-background/90 px-2 text-xs text-muted-foreground hover:text-foreground">
        {daChep ? <><Check aria-hidden="true" />{t('copied')}</> : t('copyCode')}
      </Button>
      <span role="status" className="sr-only">{daChep ? t('copied') : ''}</span>
      <pre tabIndex={0} translate="no" aria-label={nhan}
        className="overflow-x-auto rounded-xl p-4 pr-28 font-mono text-[13px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
        <code className={`language-${tenNgonNgu(lang) || 'plaintext'}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
