import { useQuery } from '@tanstack/react-query';
import type { CongNgheDayDu, CongNgheTomTat, MucTimKiem } from './curriculum';
import { duongTinh } from './duong-tinh';

export async function taiJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Không tải được ${url} (HTTP ${r.status})`);
  return r.json() as Promise<T>;
}

export function useCurriculumIndex() {
  return useQuery({
    queryKey: ['curriculum', 'index'],
    queryFn: () => taiJson<CongNgheTomTat[]>(duongTinh('/curriculum/index.json')),
    staleTime: Infinity
  });
}

export function useSearchIndex(bat: boolean) {
  return useQuery({
    queryKey: ['curriculum', 'search'],
    queryFn: () => taiJson<MucTimKiem[]>(duongTinh('/curriculum/search.json')),
    enabled: bat,
    staleTime: Infinity
  });
}

export function useTech(id: string | undefined) {
  return useQuery({
    queryKey: ['curriculum', 'tech', id],
    queryFn: () => taiJson<CongNgheDayDu>(duongTinh(`/curriculum/${id}.json`)),
    enabled: !!id && /^[a-z0-9-]+$/.test(id),
    staleTime: Infinity
  });
}
