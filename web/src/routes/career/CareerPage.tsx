// AI Career Advisor: chat tu van nghe nghiep theo ho so hoc that, tu tim viec va danh gia do phu hop.
import { useXacNhan } from '@/components/XacNhan';
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { ChevronDown, Pencil, RefreshCw, Search, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { baoDaHoiAi } from '@/lib/dong-ho-hoc';
import { useKho } from '@/lib/use-kho';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import type { TinNhan } from '@/lib/ai';
import { taoCoVan, type CoVan, type ViecLam } from '@/lib/career';
import { luuChat, taiChat, taiThongKe } from '@/lib/career-db';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type KhoCareer = {
  chat: TinNhan[]; jobs: ViecLam[]; keyword: string; moViec: boolean; nhap: string;
  dangGui?: boolean; loi?: string;
  /** Da tai lich su tu server (moi duoc ghi len server, tranh ghi de lich su chua tai) */
  daNap?: boolean;
  /** Tai lich su loi: van chat duoc trong phien nhung khong ghi len server */
  loiNap?: boolean;
  /** Tang khi sua cau hoi / tra loi lai / xoa chat: tra loi cu ve muon thi bo */
  phien?: number;
};
const RONG: KhoCareer = { chat: [], jobs: [], keyword: '', moViec: false, nhap: '' };
const loiChu = (e: unknown) => (e instanceof Error ? e.message : String(e));

export function CareerPage() {
  const { t, lang } = useT();
  const { client, user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;
  const khoa = useMemo<QueryKey>(() => ['career', uid], [uid]);
  const { kho, dat, doc } = useKho<KhoCareer>(khoa, RONG);
  const { data: congNghe = [] } = useCurriculumIndex();
  const tenCongNghe = useMemo(() => Object.fromEntries(congNghe.map(c => [c.id, c.name])), [congNghe]);
  const cvRef = useRef<CoVan | null>(null);
  const [hoi, hopXacNhan] = useXacNhan();
  const oNhapRef = useRef<HTMLTextAreaElement>(null);
  const dsRef = useRef<HTMLOListElement>(null);
  const [moTim, datMoTim] = useState(false);
  const [tuKhoaTim, datTuKhoaTim] = useState('');
  usePageMeta({ title: `${t('careerTitle').replace(/^\S+\s/u, '')} | DevMaster Hub`, description: t('careerSubtitle') });

  // Lan dau mo trang trong phien: nap lich su chat da luu (chi khi chua co gi)
  useEffect(() => {
    if (!uid || doc(khoa).daNap) return;
    taiChat(client, uid)
      // Tin vua chat khi lan tai truoc bi loi chua tung duoc luu: ghep sau lich su that
      .then(ds => dat(khoa, x => (x.daNap ? x : { ...x, daNap: true, loiNap: false, chat: [...ds, ...x.chat] })))
      .catch(() => dat(khoa, x => ({ ...x, loiNap: true })));
  }, [uid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = dsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [kho.chat.length, kho.dangGui]);

  const luu = (k: QueryKey, chat: TinNhan[]) => {
    // Chua tai duoc lich su (hoac da dang xuat: kho bi xoa) thi khong ghi — ghi la xoa mat lich su that
    if (!uid || !doc(k).daNap) return;
    luuChat(client, uid, chat).catch((e: unknown) => toast.error(t('careerChatSaveFailed', { error: loiChu(e) })));
  };

  async function coVanMoi(): Promise<CoVan> {
    // Ho so hoc tap moi nhat (ban cu tinh lai moi lan gui); loi thi tu van nhu nguoi moi
    const thongKe = uid
      ? await qc.fetchQuery({ queryKey: ['careerStats', uid], queryFn: () => taiThongKe(client, uid), staleTime: 60_000 }).catch(() => null)
      : null;
    const cv = taoCoVan(client, { t, lang, thongKe, tenCongNghe });
    cvRef.current = cv;
    return cv;
  }

  /** Hoi AI voi lich su `truoc` + cau `tin` (tin nguoi hoc da nam cuoi chat) */
  async function chay(k: QueryKey, truoc: TinNhan[], tin: string, xoaViecNeuRong: boolean) {
    dat(k, x => ({ ...x, dangGui: true, loi: undefined }));
    baoDaHoiAi();
    const phien = doc(k).phien;
    try {
      const kq = await (await coVanMoi()).gui(truoc, tin);
      if (!kq || doc(k).phien !== phien) return;
      // Tin co link: bao doc duoc trang hay khong (truoc day loi thi im lang, tuong nhu mat chuc nang)
      if (kq.link?.ok && kq.link.soTrang) toast.success(t('careerListRead', { pages: kq.link.soTrang, jobs: kq.link.tongViec ?? 0 }));
      else if (kq.link?.ok) toast.success(t('careerLinkRead', { title: kq.link.title || kq.link.url }));
      else if (kq.link) toast.warning(t('careerLinkFailed', { error: kq.link.loi || kq.link.url }));
      let chat: TinNhan[] = [];
      dat(k, x => {
        chat = [...x.chat, { role: 'assistant', content: kq.text }];
        const jobs = kq.jobs && kq.jobs.length > 0 ? kq.jobs : kq.searchKeyword && xoaViecNeuRong ? [] : x.jobs;
        return { ...x, chat, dangGui: false, jobs, keyword: kq.searchKeyword || x.keyword };
      });
      luu(k, chat);
    } catch (e) {
      if (doc(k).phien === phien) dat(k, x => ({ ...x, dangGui: false, loi: loiChu(e) }));
    }
  }

  function gui() {
    const s = doc(khoa);
    const tin = s.nhap.trim();
    if (!tin || s.dangGui || !(s.daNap || s.loiNap)) return;
    dat(khoa, x => ({ ...x, chat: [...x.chat, { role: 'user', content: tin }], nhap: '' }));
    void chay(khoa, s.chat, tin, true);
  }

  function guiLai() {
    const s = doc(khoa);
    const cuoi = s.chat.at(-1);
    if (s.dangGui || cuoi?.role !== 'user') return;
    void chay(khoa, s.chat.slice(0, -1), cuoi.content, true);
  }

  /** Dung cau tra loi dang cho, bat dau phien moi */
  const dungLai = (x: KhoCareer): KhoCareer => ({ ...x, dangGui: false, loi: undefined, phien: (x.phien ?? 0) + 1 });

  function suaCauHoi(i: number) {
    cvRef.current?.huy();
    const s = doc(khoa);
    const cau = s.chat[i];
    if (!cau) return;
    const chat = s.chat.slice(0, i);
    dat(khoa, x => ({ ...dungLai(x), chat, nhap: cau.content }));
    luu(khoa, chat);
    setTimeout(() => {
      const o = oNhapRef.current;
      if (o) { o.focus(); o.setSelectionRange(o.value.length, o.value.length); }
    }, 0);
  }

  function traLoiLai(i: number) {
    cvRef.current?.huy();
    const s = doc(khoa);
    let j = i - 1;
    while (j >= 0 && s.chat[j].role !== 'user') j--;
    if (j < 0) return;
    const chat = s.chat.slice(0, j + 1);
    dat(khoa, x => ({ ...dungLai(x), chat }));
    void chay(khoa, chat.slice(0, -1), chat[j].content, false);
  }

  async function xoaChat() {
    if (!(await hoi(t('clearCareerChatConfirm'), t('clearChat')))) return;
    cvRef.current?.huy();
    dat(khoa, x => ({ ...dungLai(x), ...RONG, daNap: true, phien: (x.phien ?? 0) + 1 }));
    luu(khoa, []);
  }

  async function timTay(e: FormEvent) {
    e.preventDefault();
    const q = tuKhoaTim.trim();
    if (!q) return;
    datMoTim(false);
    datTuKhoaTim('');
    const k = khoa;
    try {
      const jobs = await (await coVanMoi()).timViec(q);
      dat(k, x => ({ ...x, jobs, keyword: q }));
    } catch (err) {
      toast.error(t('careerJobSearchFailed', { error: loiChu(err) }));
    }
  }

  function khiGo(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      gui();
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{t('careerTitle')}</h1>
        <p className="text-muted-foreground">{t('careerSubtitle')}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => datMoTim(true)}><Search aria-hidden="true" /> {t('careerSearchJobsBtn')}</Button>
          <Button variant="ghost" className="text-muted-foreground" onClick={() => { void xoaChat(); }}><Trash2 aria-hidden="true" /> {t('clearChat')}</Button>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <ol ref={dsRef} aria-live="polite" className="max-h-[32rem] min-h-48 space-y-4 overflow-y-auto px-5 py-5">
          {kho.chat.length === 0 && !kho.dangGui && <li className="text-muted-foreground">💬 {t('careerGreeting')}</li>}
          {kho.chat.map((m, i) => (
            <li key={i} className={cn('flex flex-col gap-1', m.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={cn('max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                m.role === 'user' ? 'whitespace-pre-wrap bg-primary text-primary-foreground' : 'bg-muted')}>
                {m.role === 'user' ? m.content : <ChatMarkdown text={m.content} />}
              </div>
              {m.role === 'user'
                ? <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => suaCauHoi(i)}><Pencil aria-hidden="true" /> {t('editQuestion').replace(/^\S+\s/u, '')}</Button>
                : <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => traLoiLai(i)}><RefreshCw aria-hidden="true" /> {t('regenerateAnswer').replace(/^\S+\s/u, '')}</Button>}
            </li>
          ))}
          {kho.dangGui && <li className="text-sm text-muted-foreground motion-safe:animate-pulse">💼 {t('thinkingShort')}…</li>}
          {kho.loi && !kho.dangGui && (
            <li role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">
              <span>{t('careerFailed', { error: kho.loi })}</span>
              <Button variant="outline" size="sm" onClick={guiLai}>{t('resend')}</Button>
            </li>
          )}
        </ol>
        <form onSubmit={e => { e.preventDefault(); gui(); }} className="flex items-end gap-2 border-t p-3">
          <textarea
            ref={oNhapRef}
            value={kho.nhap}
            onChange={e => dat(khoa, x => ({ ...x, nhap: e.target.value }))}
            onKeyDown={khiGo}
            rows={2}
            aria-label={t('searchJobsPlaceholder')}
            placeholder={t('searchJobsPlaceholder')}
            className="max-h-40 min-h-12 flex-1 resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" disabled={!!kho.dangGui || !kho.nhap.trim() || !(kho.daNap || kho.loiNap)}><Send aria-hidden="true" /> {t('sendMsg')}</Button>
        </form>
      </section>

      <ViecLamGoiY kho={kho} doiMo={() => dat(khoa, x => ({ ...x, moViec: !x.moViec }))} />

      {hopXacNhan}
      <Dialog open={moTim} onOpenChange={datMoTim}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('careerSearchJobsBtn')}</DialogTitle></DialogHeader>
          <form onSubmit={e => { void timTay(e); }} className="flex gap-2">
            <input autoFocus value={tuKhoaTim} onChange={e => datTuKhoaTim(e.target.value)} aria-label={t('jobSearchPlaceholder2')} placeholder={t('jobSearchPlaceholder2')}
              className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <Button type="submit" disabled={!tuKhoaTim.trim()}><Search aria-hidden="true" /></Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const LOAI_VIEC: Record<string, string> = { FULLTIME: 'Full-time', PARTTIME: 'Part-time', CONTRACTOR: 'Contract', INTERN: 'Intern/Fresher' };
const MAU_TRANG_THAI: Record<ViecLam['status'], string> = {
  ready: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  gap: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  target: 'border-red-500/40 text-red-400 bg-red-500/10'
};
const VN = /vietnam|việt nam|\bvn\b|hồ chí minh|hà nội|đà nẵng/i;

function ViecLamGoiY({ kho, doiMo }: { kho: KhoCareer; doiMo: () => void }) {
  const { t } = useT();
  if (kho.jobs.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
        <span>💼 {t('jobsSuggestedBar')} (0): <em>{kho.keyword ? t('careerNoJobsFor', { keyword: kho.keyword }) : t('noJobsFound')}</em></span>
        <span className="text-xs">{t('autoTriggerChat')}</span>
      </div>
    );
  }
  return (
    <section className="space-y-3">
      <button type="button" aria-expanded={kho.moViec} aria-controls="ds-viec-lam" onClick={doiMo}
        className={cn('flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-primary/60',
          kho.moViec && 'border-primary')}>
        <span className="flex items-center gap-2 font-medium">
          <ChevronDown className={cn('size-4 text-primary transition-transform', !kho.moViec && '-rotate-90')} aria-hidden="true" />
          💼 {t('jobsSuggestedBar')} (<strong className="text-primary">{kho.jobs.length}</strong>): <span className="text-primary">"{kho.keyword}"</span>
        </span>
        <span className="text-xs text-primary">{kho.moViec ? t('collapseJobList') : `${t('openJobList')} (${kho.jobs.length})`}</span>
      </button>
      {kho.moViec && (
        <ul id="ds-viec-lam" className="grid gap-3 md:grid-cols-2">
          {kho.jobs.map((j, i) => (
            <li key={i}>
              <a href={j.url} target="_blank" rel="noopener noreferrer"
                className={cn('flex h-full flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40', MAU_TRANG_THAI[j.status].split(' ')[0])}>
                {j.badgeText && <span className={cn('self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold', MAU_TRANG_THAI[j.status])}>{j.badgeText}</span>}
                <span className="flex items-center gap-3">
                  {j.company_logo ? <img src={j.company_logo} alt="" className="size-9 rounded-md bg-white object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} /> : <span aria-hidden="true" className="grid size-9 place-items-center rounded-md bg-muted">🏢</span>}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{j.company_name}</span>
                    <span className="block text-xs text-muted-foreground">{j.source}</span>
                  </span>
                </span>
                <span className="font-semibold">{j.title}</span>
                {j.fitRecommendation && (
                  <span className="rounded-md bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">💡 <strong>{t('careerSkillAssessment')}</strong> {j.fitRecommendation}</span>
                )}
                <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{VN.test(j.location) ? '🇻🇳' : j.is_remote ? '🌍' : '📍'} {j.location || 'Remote'}</span>
                  {(LOAI_VIEC[j.employment_type] ?? j.employment_type) && <span>⏰ {LOAI_VIEC[j.employment_type] ?? j.employment_type}</span>}
                  {j.salary && <span>💰 {j.salary}</span>}
                </span>
                {j.tags.length > 0 && (
                  <span className="flex flex-wrap gap-1.5">{j.tags.slice(0, 3).map((x, k) => <span key={k} className="rounded-md border px-2 py-0.5 font-mono text-xs">{x}</span>)}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
