import { useMemo } from 'react';
import { useQuery, useQueryClient, type QueryClient, type QueryKey } from '@tanstack/react-query';
import { taiJson } from '@/lib/use-curriculum';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { useKho } from '@/lib/use-kho';
import type { TinNhan } from '@/lib/ai';
import {
  chamDuAn, hoiMentor, nguCanhDuAn, taoBanNop, taoYTuong,
  type CapDo, type KetQuaCham, type TepDuAn, type TienDoCham, type YTuong
} from '@/lib/project-ai';
import { luuBaiNop, type YTuongDaLuu } from '@/lib/project-db';

export type CheDo = 'level' | 'topic';

export type KhoDuAn = {
  level: CapDo | null;
  topic: string;
  idea: YTuong | null;
  chat: TinNhan[];
  files: TepDuAn[];
  tepDangMo: number;
  ketQua: KetQuaCham | null;
  dangTao?: boolean; loiTao?: string;
  dangGui?: boolean; loiChat?: string;
  dangCham?: boolean; tienDo?: TienDoCham | null; loiCham?: string;
  phien?: number; phienCham?: number;
};

export const TEP_MAC_DINH: TepDuAn = { name: 'main.js', lang: 'javascript', code: '' };
export const KHO_RONG: KhoDuAn = { level: null, topic: '', idea: null, chat: [], files: [TEP_MAC_DINH], tepDangMo: 0, ketQua: null };

const lamMoi = (s: KhoDuAn, level = s.level): KhoDuAn => ({ ...KHO_RONG, level, topic: s.topic, phien: (s.phien ?? 0) + 1, phienCham: s.phienCham });

export const DUOI_THEO_NGON_NGU: Record<string, string> = {
  javascript: 'js', python: 'py', java: 'java', cpp: 'cpp', csharp: 'cs', go: 'go', rust: 'rs', php: 'php', html: 'html', css: 'css', typescript: 'ts', json: 'json'
};
const NGON_NGU_THEO_DUOI: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python', java: 'java', cpp: 'cpp', cs: 'csharp', go: 'go', rs: 'rust', php: 'php', html: 'html', css: 'css', json: 'json'
};

export const khoaDuAn = (uid: string | undefined, cheDo: CheDo): QueryKey => ['project', uid, cheDo];

export function moYTuongDaLuu(qc: QueryClient, uid: string | undefined, yt: YTuongDaLuu): CheDo {
  const cheDo: CheDo = yt.source === 'topic' ? 'topic' : 'level';
  const level = cheDo === 'level' ? (yt.level ?? yt.idea.difficulty ?? 'mid') : yt.level;
  const cu = qc.getQueryData<KhoDuAn>(khoaDuAn(uid, cheDo)) ?? KHO_RONG;
  qc.setQueryData<KhoDuAn>(khoaDuAn(uid, cheDo), { ...lamMoi(cu, level), topic: yt.topic ?? '', idea: { ...yt.idea } });
  return cheDo;
}

const loiChu = (e: unknown) => (e instanceof Error ? e.message : String(e));

export function useAiBat(): boolean | undefined {
  const { data, isError } = useQuery({ queryKey: ['health'], queryFn: () => taiJson<{ aiEnabled: boolean }>('/api/health'), staleTime: 5 * 60_000 });
  if (isError) return false;
  return data ? !!data.aiEnabled : undefined;
}

export const CAP_HIEN: { id: CapDo; ten: string; moTa: string }[] = [
  { id: 'newbie', ten: 'Newbie', moTa: 'levelNewbie' },
  { id: 'junior', ten: 'Junior', moTa: 'levelJunior' },
  { id: 'mid', ten: 'Mid', moTa: 'levelMid' },
  { id: 'senior', ten: 'Senior', moTa: 'levelSenior' },
  { id: 'master', ten: 'Master', moTa: 'levelMaster' }
];

export function useDuAn(cheDo: CheDo) {
  const { client, user } = useAuth();
  const { t, lang } = useT();
  const qc = useQueryClient();
  const uid = user?.id;
  const khoa = useMemo(() => khoaDuAn(uid, cheDo), [uid, cheDo]);
  const { kho, dat, doc } = useKho<KhoDuAn>(khoa, KHO_RONG);
  const tepMo = kho.files[kho.tepDangMo] ?? kho.files[0] ?? TEP_MAC_DINH;

  async function taoIdea() {
    const s = doc(khoa);
    if (s.dangTao) return;
    const level = s.level;
    const topic = cheDo === 'topic' ? s.topic.trim() : null;
    if (cheDo === 'level' ? !level : !topic) return;
    const k = khoa;
    dat(k, x => ({ ...lamMoi(x), dangTao: true }));
    const phien = doc(k).phien;
    try {
      const idea = await taoYTuong(client, { level, topic, lang });
      dat(k, x => (x.phien !== phien ? x : { ...x, idea, dangTao: false }));
    } catch (e) {
      dat(k, x => (x.phien !== phien ? x : { ...x, dangTao: false, loiTao: loiChu(e) }));
    }
  }

  async function guiMentor(k: QueryKey, cauHoi: string, lichSu: TinNhan[], idea: YTuong, files: TepDuAn[]) {
    dat(k, x => ({ ...x, dangGui: true, loiChat: undefined }));
    const phien = doc(k).phien;
    try {
      const traLoi = await hoiMentor(client, { nguCanh: nguCanhDuAn(idea, files), lichSu, cauHoi, lang });
      dat(k, x => (x.phien !== phien ? x : { ...x, chat: [...x.chat, { role: 'assistant', content: traLoi }], dangGui: false }));
    } catch (e) {
      dat(k, x => (x.phien !== phien ? x : { ...x, dangGui: false, loiChat: loiChu(e) }));
    }
  }

  async function cham() {
    const s = doc(khoa);
    if (s.dangCham || !s.idea || !s.files.some(f => f.code.trim())) return;
    const k = khoa;
    const { idea, files } = s;
    dat(k, x => ({ ...x, dangCham: true, loiCham: undefined, tienDo: null }));
    const { phien, phienCham } = doc(k);
    const cung = (x: KhoDuAn) => x.phien === phien && x.phienCham === phienCham;
    let ketQua: KetQuaCham;
    try {
      ketQua = await chamDuAn(client, { idea, files, lang, khiTienDo: b => dat(k, x => (cung(x) ? { ...x, tienDo: b } : x)) });
    } catch (e) {
      dat(k, x => (cung(x) ? { ...x, dangCham: false, tienDo: null, loiCham: loiChu(e) } : x));
      return;
    }
    dat(k, x => (cung(x) ? { ...x, ketQua, dangCham: false, tienDo: null } : x));
    if (!uid) return;
    try {
      await luuBaiNop(client, uid, taoBanNop({ review: ketQua, idea, files, difficulty: s.level ?? idea.difficulty, topic: s.topic }));
      void qc.invalidateQueries({ queryKey: ['submissions', uid] });
      toast.success(t('submissionSaved'));
    } catch (e) {
      toast.error(t('submissionSaveFailed', { error: loiChu(e) }));
    }
  }

  const datTep = (f: (files: TepDuAn[], i: number) => TepDuAn[]) =>
    dat(khoa, x => ({ ...x, files: f(x.files, Math.min(x.tepDangMo, x.files.length - 1)) }));

  return {
    kho,
    tepMo,
    chonCap: (level: CapDo | null) => dat(khoa, x => (cheDo === 'level' ? (x.level === level ? x : lamMoi(x, level)) : { ...x, level })),
    datChuDe: (topic: string) => dat(khoa, x => ({ ...x, topic })),
    taoIdea: () => { void taoIdea(); },
    hoi: (cauHoi: string) => {
      const s = doc(khoa);
      const cau = cauHoi.trim();
      if (!cau || s.dangGui || !s.idea) return;
      dat(khoa, x => ({ ...x, chat: [...x.chat, { role: 'user', content: cau }] }));
      void guiMentor(khoa, cau, s.chat, s.idea, s.files);
    },
    guiLai: () => {
      const s = doc(khoa);
      const cuoi = s.chat.at(-1);
      if (s.dangGui || !s.idea || cuoi?.role !== 'user') return;
      void guiMentor(khoa, cuoi.content, s.chat.slice(0, -1), s.idea, s.files);
    },
    chonTep: (i: number) => dat(khoa, x => (i >= 0 && i < x.files.length ? { ...x, tepDangMo: i } : x)),
    themTep: () => dat(khoa, x => {
      const lang = (x.files[x.tepDangMo] ?? TEP_MAC_DINH).lang || 'javascript';
      const files = [...x.files, { name: `file${x.files.length + 1}.${DUOI_THEO_NGON_NGU[lang] ?? 'js'}`, lang, code: '' }];
      return { ...x, files, tepDangMo: files.length - 1 };
    }),
    xoaTep: (i: number) => dat(khoa, x => {
      if (x.files.length <= 1) return x;
      const files = x.files.filter((_, j) => j !== i);
      return { ...x, files, tepDangMo: Math.min(x.tepDangMo > i ? x.tepDangMo - 1 : x.tepDangMo, files.length - 1) };
    }),
    doiTenTep: (ten: string) => {
      const moi = ten.trim();
      if (!moi) return;
      const lang = NGON_NGU_THEO_DUOI[moi.split('.').pop()?.toLowerCase() ?? ''];
      datTep((files, i) => files.map((f, j) => (j === i ? { ...f, name: moi, lang: lang ?? f.lang } : f)));
    },
    doiNgonNgu: (lang: string) => datTep((files, i) => files.map((f, j) => (j === i ? { ...f, lang } : f))),
    datCode: (code: string) => datTep((files, i) => files.map((f, j) => (j === i ? { ...f, code } : f))),
    xoaHet: () => dat(khoa, x => ({ ...x, files: [TEP_MAC_DINH], tepDangMo: 0, ketQua: null, dangCham: false, tienDo: null, phienCham: (x.phienCham ?? 0) + 1 })),
    cham: () => { void cham(); }
  };
}

export type DuAn = ReturnType<typeof useDuAn>;
