import { Fragment } from 'react';
import { useT } from '@/lib/i18n';

/**
 * Chuoi dich co <strong>…</strong> (vd "Bạn có <strong>{n}</strong> idea đã lưu."): ve phan dam bang JSX.
 * Tach mau TRUOC roi moi dien bien, nen bien (chu de nguoi dung go...) khong bao gio thanh the HTML.
 */
export function ChuDam({ khoa, bien = {} }: { khoa: string; bien?: Record<string, string | number> }) {
  const { t } = useT();
  // Lay mau goc: goi t() khong truyen bien de giu nguyen {n}
  const mau = t(khoa);
  const dien = (s: string) => s.replace(/<[^>]*>/g, '').replace(/\{(\w+)\}/g, (m, k: string) => (k in bien ? String(bien[k]) : m));
  const phan = mau.split(/<strong>([\s\S]*?)<\/strong>/);
  return (
    <>
      {phan.map((p, i) => (i % 2 === 1 ? <strong key={i}>{dien(p)}</strong> : <Fragment key={i}>{dien(p)}</Fragment>))}
    </>
  );
}
