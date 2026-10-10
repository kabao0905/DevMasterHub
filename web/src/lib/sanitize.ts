// HTML khong do minh viet tung chu (ban dich may cua ly thuyet...) phai qua day truoc khi chen.
import DOMPurify from 'dompurify';

export function lamSachHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'iframe'],
    FORBID_ATTR: ['id', 'name']
  });
}
