import { useQuery } from '@tanstack/react-query';
import type { CongNgheTomTat, MucTimKiem } from './curriculum';

export async function taiJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Không tải được ${url} (HTTP ${r.status})`);
  return r.json() as Promise<T>;
}

/** Danh sach cong nghe kem ten bai (khong co noi dung bai) — du cho Dashboard va sidebar */
export function useCurriculumIndex() {
  return useQuery({
    queryKey: ['curriculum', 'index'],
    queryFn: () => taiJson<CongNgheTomTat[]>('/curriculum/index.json'),
    staleTime: Infinity
  });
}

/** Chi muc tim kiem (~100KB) chi tai khi nguoi dung bat dau go vao o tim */
export function useSearchIndex(bat: boolean) {
  return useQuery({
    queryKey: ['curriculum', 'search'],
    queryFn: () => taiJson<MucTimKiem[]>('/curriculum/search.json'),
    enabled: bat,
    staleTime: Infinity
  });
}
