import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { useDanhDauXong } from '@/lib/use-progress';
import type { NhanXet } from '@/lib/ai';
import { timLab } from '@/lib/lab';
import { escapeHtml } from '@/lib/highlight';
import { presetFor, PRESETS } from '@/lib/sandpack-doc';
import { seedFilesFromLesson, TECH_FRONTEND } from '@/lib/exercise-seed';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { LabPanel } from '@/components/tools/LabPanel';
import { LiveIde } from '@/components/tools/LiveIde';
import { Terminal } from '@/components/tools/Terminal';
import { ChayThuJs } from '@/components/tools/ChayThuJs';
import { useTerminal } from '@/components/tools/use-terminal';
import { cn } from '@/lib/utils';
import { CodeArea } from './CodeArea';
import { useDichNoiDung } from './use-dich-noi-dung';
import type { BaiTapBai } from './use-bai-tap';
import type { BaiDangMo } from './use-quiz-bai';

type Props = { bai: BaiDangMo; baiTap: BaiTapBai; aiEnabled: boolean | undefined };

/**
 * Tab Bai tap, theo dung thu tu cua app cu: phong lab -> terminal (An ninh mang) ->
 * IDE truc tiep (cong nghe frontend) -> o soan + bai tap AI + AI cham.
 */
export function ExerciseTab({ bai, baiTap, aiEnabled }: Props) {
  const danhDauXong = useDanhDauXong();
  const lab = timLab(khoaBai(bai.tech.id, bai.level.id, bai.lesson.id));
  if (lab) return <LabPanel lab={lab} onHoanThanh={() => danhDauXong(bai.tech.id, bai.level.id, bai.lesson.id)} />;
  if (bai.tech.id === 'cybersecurity') return <TerminalBaiHoc bai={bai} baiTap={baiTap} aiEnabled={aiEnabled} />;
  if (TECH_FRONTEND.includes(bai.tech.id)) return <IdeBaiHoc bai={bai} baiTap={baiTap} aiEnabled={aiEnabled} />;
  return <BaiTapSoan bai={bai} baiTap={baiTap} aiEnabled={aiEnabled} />;
}

/** De bai goc cua giao trinh la chu thuong (co "Stack<T>"): escape truoc roi moi dich/hien nhu HTML */
function DeBaiGoc({ text }: { text?: string }) {
  const { t, lang } = useT();
  const html = useMemo(() => (text ? `<p>${escapeHtml(text)}</p>` : ''), [text]);
  const dich = useDichNoiDung(html, lang);
  if (!text) return <p className="text-muted-foreground">{t('noExerciseYet')}</p>;
  // Noi dung da escape (va ban dich da qua lamSachHtml)
  return <div className="noi-dung-bai whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: dich.html }} />;
}

/** Terminal mo phong khong tu cham duoc: hoc vien dan lenh da chay + ket qua de AI cham */
function TerminalBaiHoc({ bai, baiTap, aiEnabled }: Props) {
  const { t } = useT();
  const kenh = useTerminal();
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-2 font-semibold">{t('practiceTerminal')}</h2>
        <DeBaiGoc text={bai.lesson.exercise} />
      </div>
      <Terminal kenh={kenh} />
      <CodeArea value={baiTap.traLoi} onChange={baiTap.datTraLoi} label={t('terminalAnswerLabel')} />
      <NopChamAi baiTap={baiTap} aiEnabled={aiEnabled} baiLam={baiTap.traLoi} lang={bai.lesson.lang} />
    </div>
  );
}

function IdeBaiHoc({ bai, baiTap, aiEnabled }: Props) {
  const { t } = useT();
  const { tech, lesson } = bai;
  const seed = useMemo(() => seedFilesFromLesson(lesson, tech.id), [lesson, tech.id]);
  // Tep khoi tao = bo tep cua preset, ghi de bang code mau cua bai hoc
  const macDinh = useMemo(() => {
    const p = PRESETS[presetFor(tech.id)] ?? PRESETS.html;
    return { ...p.files, ...Object.fromEntries((seed ?? []).map(f => [f.name, f.code])) };
  }, [seed, tech.id]);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-2 font-semibold">{t('practiceLive')}</h2>
        <DeBaiGoc text={lesson.exercise} />
      </div>
      <LiveIde techId={tech.id} files={baiTap.kho.files ?? macDinh} macDinh={macDinh} onFilesChange={baiTap.datFiles} tepDau={seed?.[0]?.name} />
      <NopChamAi baiTap={baiTap} aiEnabled={aiEnabled} baiLam={gopTep(baiTap.kho.files ?? macDinh)} lang={lesson.lang} />
    </div>
  );
}

/** Bo tep IDE thanh mot bai lam de AI cham (giong codeDangLam gui gia su) */
const gopTep = (files: Record<string, string>) => Object.entries(files).map(([ten, code]) => `--- ${ten} ---\n${code}`).join('\n');

/** Nut AI cham + loi + ket qua, cho bai tap khong co o soan rieng (IDE, terminal) */
function NopChamAi({ baiTap, aiEnabled, baiLam, lang }: { baiTap: BaiTapBai; aiEnabled: boolean | undefined; baiLam: string; lang?: string }) {
  const { t } = useT();
  if (aiEnabled === false) return null;
  return (
    <div className="space-y-4">
      <Button className="bg-brand text-white hover:opacity-90" onClick={() => baiTap.cham(baiLam)} disabled={!baiLam.trim() || baiTap.dangCham}>
        {baiTap.dangCham ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t('grading')}</> : t('gradeWithAi')}
      </Button>
      {baiTap.loiCham && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">{t('gradeFailed', { error: baiTap.loiCham.message })}</p>}
      {baiTap.nhanXet && <KetQuaCham nhanXet={baiTap.nhanXet} lang={lang} />}
    </div>
  );
}

function BaiTapSoan({ bai, baiTap, aiEnabled }: Props) {
  const { t } = useT();
  const { kho, deHienTai, traLoi, nhanXet } = baiTap;
  const idx = kho.activeExIdx;
  const laJs = /^(javascript|js)$/i.test(bai.lesson.lang || '');

  return (
    <div className="space-y-5">
      {kho.aiExercises.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label={t('tabLabelExercise')}>
          <Button size="sm" variant={idx === 0 ? 'secondary' : 'outline'} aria-pressed={idx === 0} onClick={() => baiTap.chon(0)}>
            📝 {t('originalExercise')}
          </Button>
          {kho.aiExercises.map((_, i) => (
            <Button key={i} size="sm" variant={idx === i + 1 ? 'secondary' : 'outline'} aria-pressed={idx === i + 1} onClick={() => baiTap.chon(i + 1)}>
              {t('aiExerciseTab', { n: i + 1 })}
            </Button>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-card p-5">
        {deHienTai ? (
          <div className="space-y-3">
            <h2 className="font-semibold">{deHienTai.title}</h2>
            <div className="leading-relaxed"><ChatMarkdown text={deHienTai.description} /></div>
            {deHienTai.sampleInput && (
              <div><p className="text-xs text-muted-foreground">{t('sampleInputLabel')}</p><pre className="mt-1 whitespace-pre-wrap rounded-lg bg-code p-3 font-mono text-xs">{deHienTai.sampleInput}</pre></div>
            )}
            {deHienTai.expectedOutput && (
              <div><p className="text-xs text-muted-foreground">{t('expectedOutputLabel')}</p><pre className="mt-1 whitespace-pre-wrap rounded-lg bg-code p-3 font-mono text-xs">{deHienTai.expectedOutput}</pre></div>
            )}
          </div>
        ) : (
          <DeBaiGoc text={bai.lesson.exercise} />
        )}
      </div>

      {deHienTai && (deHienTai.hints.length > 0 || deHienTai.solution) && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {deHienTai.hints.length > 0 && (
              <Button variant="outline" size="sm" onClick={baiTap.doiGoiY}>
                {kho.hienGoiY[idx] ? t('hideHints') : `${t('showHintsBtn')} (${deHienTai.hints.length})`}
              </Button>
            )}
            {deHienTai.solution && (
              <Button variant="outline" size="sm" onClick={baiTap.doiLoiGiai}>{kho.hienLoiGiai[idx] ? t('hideSolution') : t('showSolutionBtn')}</Button>
            )}
          </div>
          {kho.hienGoiY[idx] && (
            <ul className="space-y-1.5 rounded-xl border bg-card p-4 text-sm">
              {deHienTai.hints.map(h => <li key={h} className="flex gap-2"><span aria-hidden="true">💡</span><span><ChatMarkdown text={h} /></span></li>)}
            </ul>
          )}
          {kho.hienLoiGiai[idx] && deHienTai.solution && <CodeBlock code={deHienTai.solution} lang={deHienTai.solutionLang || bai.lesson.lang} />}
        </div>
      )}

      <CodeArea value={traLoi} onChange={baiTap.datTraLoi} label={t('answerPlaceholder')} />

      <div className="flex flex-wrap items-center gap-2">
        {aiEnabled !== false && (
          <Button className="bg-brand text-white hover:opacity-90" onClick={() => baiTap.cham()} disabled={!traLoi.trim() || baiTap.dangCham}>
            {baiTap.dangCham ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t('grading')}</> : t('gradeWithAi')}
          </Button>
        )}
        <Button variant="ghost" onClick={baiTap.xoaTraLoi} disabled={!traLoi}>{t('clearAnswer')}</Button>
        {aiEnabled !== false && (
          <Button variant="outline" className="ml-auto" onClick={baiTap.taoMoi} disabled={baiTap.dangTao}>
            {baiTap.dangTao ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t('generatingExercise')}</> : t('newAiExercise')}
          </Button>
        )}
      </div>
      {laJs && <ChayThuJs code={traLoi} nhan={t('runCode')} />}

      {baiTap.loiTao && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">{t('exerciseFailed', { error: baiTap.loiTao.message })}</p>}
      {baiTap.loiCham && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">{t('gradeFailed', { error: baiTap.loiCham.message })}</p>}

      {nhanXet && <KetQuaCham nhanXet={nhanXet} lang={bai.lesson.lang} />}
    </div>
  );
}

function KetQuaCham({ nhanXet, lang }: { nhanXet: NhanXet; lang?: string }) {
  const { t } = useT();
  return (
    <section aria-label={t('scoreOutOf', { score: nhanXet.score })} className={cn('space-y-3 rounded-xl border p-5',
      nhanXet.status === 'correct' ? 'border-level-newbie/50 bg-level-newbie/5' : nhanXet.status === 'partial' ? 'border-[#d29922]/50' : 'border-destructive/50')}>
      <div className="flex flex-wrap items-baseline gap-3">
        <p className="text-2xl font-semibold tabular-nums">{t('scoreOutOf', { score: nhanXet.score })}</p>
        <p>{t(nhanXet.status === 'correct' ? 'answerCorrect' : nhanXet.status === 'partial' ? 'answerPartial' : 'answerWrong')}</p>
      </div>
      {nhanXet.feedback && <div className="leading-relaxed"><ChatMarkdown text={nhanXet.feedback} /></div>}
      {nhanXet.errors.length > 0 && (
        <div><p className="text-sm font-medium">{t('errorsLabel')}</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{nhanXet.errors.map(x => <li key={x}><ChatMarkdown text={x} /></li>)}</ul></div>
      )}
      {nhanXet.suggestions.length > 0 && (
        <div><p className="text-sm font-medium">{t('suggestionsLabel')}</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{nhanXet.suggestions.map(x => <li key={x}><ChatMarkdown text={x} /></li>)}</ul></div>
      )}
      {nhanXet.correctedCode && (
        <div className="space-y-1"><p className="text-sm font-medium">{t('correctedCodeLabel')}</p><CodeBlock code={nhanXet.correctedCode} lang={lang} /></div>
      )}
    </section>
  );
}
