import { useCallback, useEffect, useRef, useState } from 'react';
import { hashKey, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';

export function useKho<T>(khoa: QueryKey, rong: T) {
  const qc = useQueryClient();
  const { data: trongCache } = useQuery({ queryKey: khoa, queryFn: () => rong, initialData: rong, enabled: false, staleTime: Infinity, gcTime: Infinity });
  const [kho, datKho] = useState<T>(() => qc.getQueryData<T>(khoa) ?? rong);
  const khoaRef = useRef(khoa);
  const conGanRef = useRef(true);
  useEffect(() => {
    khoaRef.current = khoa;
    conGanRef.current = true;
    return () => { conGanRef.current = false; };
  }, [khoa]);
  useEffect(() => { if (trongCache) datKho(trongCache); }, [trongCache]);

  const dat = useCallback((k: QueryKey, f: (s: T) => T) => {
    if (!qc.getQueryState(k)) return;
    const moi = f(qc.getQueryData<T>(k) ?? rong);
    qc.setQueryData<T>(k, moi);
    if (conGanRef.current && hashKey(k) === hashKey(khoaRef.current)) datKho(moi);
  }, [qc, rong]);

  const doc = useCallback((k: QueryKey) => qc.getQueryData<T>(k) ?? rong, [qc, rong]);

  return { kho, dat, doc };
}
