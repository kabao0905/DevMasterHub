// Server da chen meta cho lan tai dau; khi di chuyen trong SPA thi cap nhat o day.
import { useEffect } from 'react';

function datThuocTinh(chon: string, thuocTinh: string, giaTri?: string) {
  if (giaTri === undefined) return;
  document.querySelectorAll(chon).forEach(el => el.setAttribute(thuocTinh, giaTri));
}

export function usePageMeta({ title, description, url }: { title: string; description?: string; url?: string }) {
  useEffect(() => {
    document.title = title;
    datThuocTinh('meta[property="og:title"], meta[name="twitter:title"]', 'content', title);
    datThuocTinh('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]', 'content', description);
    datThuocTinh('link[rel="canonical"]', 'href', url);
    datThuocTinh('meta[property="og:url"], meta[name="twitter:url"]', 'content', url);
  }, [title, description, url]);
}
