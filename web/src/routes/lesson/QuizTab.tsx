import { useState } from 'react';
import { CircleCheck, CircleX, ListChecks, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { BaiDayDu } from '@/lib/curriculum';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { QuizBai } from './use-quiz-bai';

const SO_CAU = 4;
const chuCai = (i: number) => String.fromCharCode(65 + i);

const mauDiem = (pt: number) => (pt >= 80 ? 'bg-mint text-mint-ink' : pt >= 50 ? 'bg-butter text-butter-ink' : 'bg-destructive/10 text-destructive');
const nhanXetDiem = (pt: number) => (pt >= 80 ? 'scoreExcellent' : pt >= 50 ? 'scoreGood' : 'scoreNeedsReview');

export function QuizTab({ lesson, quizBai, aiEnabled }: { lesson: BaiDayDu; quizBai: QuizBai; aiEnabled: boolean | undefined }) {
  const { t } = useT();
  const { quiz, dangTao, tuNganHang } = quizBai;
  let thongBao = '';
  if (dangTao) thongBao = t(tuNganHang ? 'loadingBankQuiz' : 'generatingQuiz');
  else if (quiz?.submitted) {
    const diem = quiz.questions.filter((q, i) => quiz.answers[i] === q.correct).length;
    const pct = Math.round((diem / quiz.questions.length) * 100);
    thongBao = `${t('quizScore', { score: diem, total: quiz.questions.length, pct })}. ${t(nhanXetDiem(pct))}`;
  }
  return (
    <>
      <p className="sr-only" aria-live="polite">{thongBao}</p>
      <NoiDungQuiz lesson={lesson} quizBai={quizBai} aiEnabled={aiEnabled} />
    </>
  );
}

function NoiDungQuiz({ lesson, quizBai, aiEnabled }: { lesson: BaiDayDu; quizBai: QuizBai; aiEnabled: boolean | undefined }) {
  const { t, translateTitle } = useT();
  const { quiz, dangTao, loi, tao, chon, nop, tuNganHang } = quizBai;
  const [nhacThieu, datNhacThieu] = useState(false);

  if (dangTao) {
    return (
      <div aria-hidden="true" className="flex items-center gap-3 rounded-3xl bg-lavender p-6 font-medium text-lavender-ink">
        <Loader2 className="size-5 motion-safe:animate-spin" aria-hidden="true" /> {t(tuNganHang ? 'loadingBankQuiz' : 'generatingQuiz')}
      </div>
    );
  }

  const baoLoi = loi && (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-2xl bg-destructive/10 p-5 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
      <p className="min-w-0 break-words">{t('quizFailed', { error: loi.message })}</p>
      <Button variant="outline" size="sm" className="rounded-full" onClick={tao}>{t('retry')}</Button>
    </div>
  );

  if (!quiz) {
    return (
      <div className="space-y-4">
        {baoLoi}
        <div className="rounded-3xl bg-card p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-pink text-pink-ink" aria-hidden="true"><ListChecks className="size-5" /></span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-extrabold tracking-tight">{t('knowledgeCheck')}</h2>
              <p className="mt-1 text-muted-foreground">{t(tuNganHang ? 'bankQuizIntro' : 'quizIntro', { n: SO_CAU, title: translateTitle(lesson.title) })}</p>
            </div>
          </div>
          {!tuNganHang && aiEnabled === false
            ? <p className="mt-4 rounded-2xl bg-butter px-4 py-2.5 text-sm text-butter-ink">{t('aiDisabled')}</p>
            : !loi && (
              <Button className="mt-5 rounded-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" onClick={tao}>
                <Sparkles aria-hidden="true" /> {t(tuNganHang ? 'startBankQuiz' : 'generateQuizAi')}
              </Button>
            )}
        </div>
      </div>
    );
  }

  const tong = quiz.questions.length;
  const daTraLoi = Object.keys(quiz.answers).length;
  const diem = quiz.questions.filter((q, i) => quiz.answers[i] === q.correct).length;
  const phanTram = Math.round((diem / tong) * 100);

  function bamNop() {
    if (!quiz) return;
    const thieu = quiz.questions.findIndex((_, i) => quiz.answers[i] === undefined);
    if (thieu >= 0) {
      datNhacThieu(true);
      document.querySelector<HTMLInputElement>(`input[name="cau-${thieu}"]`)?.focus();
      return;
    }
    datNhacThieu(false);
    nop();
  }

  return (
    <div className="space-y-5">
      {baoLoi}
      {quiz.questions.map((q, i) => {
        const daChon = quiz.answers[i];
        const dung = daChon === q.correct;
        return (
          <fieldset key={i} className="min-w-0 rounded-3xl bg-card p-5 shadow-soft">
            <legend className="float-left mb-3 w-full">
              <span className="rounded-full bg-sky px-2.5 py-0.5 text-xs font-semibold text-sky-ink">{t('quizQuestion', { n: i + 1 })}</span>
              {q.difficulty && <span className="ml-2 text-xs font-medium text-muted-foreground">{t(`quizDifficulty_${q.difficulty}`)}</span>}
            </legend>
            <div className="clear-both font-medium leading-relaxed"><ChatMarkdown text={q.question} /></div>
            {q.code && <CodeBlock code={q.code} lang={lesson.lang} className="mt-3" />}
            <div className="mt-4 space-y-2">
              {q.options.map((o, j) => {
                const laDapAnDung = quiz.submitted && j === q.correct;
                const chonSai = quiz.submitted && j === daChon && !dung;
                return (
                  <label key={j} className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-2xl border border-transparent bg-muted px-3 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    !quiz.submitted && 'hover:border-border',
                    !quiz.submitted && daChon === j && 'border-lavender-ink/40 bg-lavender text-lavender-ink',
                    laDapAnDung && 'bg-mint text-mint-ink',
                    chonSai && 'bg-destructive/10 text-destructive',
                    quiz.submitted && 'cursor-default'
                  )}>
                    <input type="radio" name={`cau-${i}`} className="sr-only" checked={daChon === j} disabled={quiz.submitted} onChange={() => { chon(i, j); }} />
                    <span className="font-mono text-sm font-semibold">{chuCai(j)}.</span>
                    <span className="min-w-0 flex-1 text-foreground"><ChatMarkdown text={o} /></span>
                  </label>
                );
              })}
            </div>
            {quiz.submitted && (
              <div className="mt-4 space-y-2 text-sm">
                <p className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', dung ? 'bg-mint text-mint-ink' : 'bg-destructive/10 text-destructive')}>
                  {dung ? <CircleCheck className="size-4" aria-hidden="true" /> : <CircleX className="size-4" aria-hidden="true" />}
                  {t(dung ? 'answerCorrect' : 'answerWrong')}
                </p>
                <div className="rounded-2xl bg-sky px-4 py-3 text-foreground"><span className="font-semibold text-sky-ink">{t('explanation')}:</span> <ChatMarkdown text={q.explanation} /></div>
              </div>
            )}
          </fieldset>
        );
      })}

      {quiz.submitted ? (
        <div className={cn('flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between', mauDiem(phanTram))}>
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{t('quizScore', { score: diem, total: tong, pct: phanTram })}</p>
            <p className="text-foreground">{t(nhanXetDiem(phanTram))}</p>
          </div>
          <Button variant="outline" className="rounded-full bg-card" onClick={tao}><RotateCcw aria-hidden="true" /> {t('newQuiz')}</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button size="lg" className="rounded-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" aria-describedby="quiz-thieu" onClick={bamNop}>
            {t('submitQuizCount', { done: daTraLoi, total: tong })}
          </Button>
          <p id="quiz-thieu" role="alert" className="text-sm font-medium text-destructive empty:hidden">
            {nhacThieu && daTraLoi < tong ? t('quizUnanswered', { n: tong - daTraLoi }) : ''}
          </p>
        </div>
      )}
    </div>
  );
}
