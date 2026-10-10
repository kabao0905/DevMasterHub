import { useT } from '@/lib/i18n';
import type { BaiDayDu } from '@/lib/curriculum';
import { CodeBlock } from '@/components/CodeBlock';

export function CodeTab({ lesson }: { lesson: BaiDayDu }) {
  const { t } = useT();
  if (!lesson.code) return <p className="text-muted-foreground">{t('noCodeExample')}</p>;
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">{t('codeExample')}</h2>
      <CodeBlock code={lesson.code} lang={lesson.lang || 'javascript'} />
    </div>
  );
}
