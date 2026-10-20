import { SquareTerminal } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { BaiDayDu } from '@/lib/curriculum';
import { CodeBlock } from '@/components/CodeBlock';
import { ChayCode } from '@/components/tools/ChayCode';
import { ngonNguChay } from '@/lib/chay-code';

export function CodeTab({ lesson }: { lesson: BaiDayDu }) {
  const { t } = useT();
  if (!lesson.code) return <p className="text-muted-foreground">{t('noCodeExample')}</p>;
  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-extrabold tracking-tight">{t('codeExample')}</h2>
      <CodeBlock code={lesson.code} lang={lesson.lang || 'javascript'} />
      {lesson.output && (
        <section aria-labelledby="ket-qua-code" className="overflow-hidden rounded-2xl bg-code shadow-soft">
          <h3 id="ket-qua-code" className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs font-semibold text-[#7ee787]">
            <SquareTerminal className="size-3.5" aria-hidden="true" /> {t('codeOutputTitle')}
          </h3>
          <pre className="max-h-80 overflow-auto px-4 py-3 font-mono text-[13px] leading-6 whitespace-pre-wrap text-[#e6edf3]">{lesson.output}</pre>
        </section>
      )}
      {ngonNguChay(lesson.lang) && <ChayCode key={lesson.code} lang={lesson.lang ?? ''} code={lesson.code} nhacCanhBao />}
    </div>
  );
}
