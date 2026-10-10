/**
 * HtmlUtils — mot cho duy nhat de thoat HTML va dinh dang tin nhan AI.
 *
 * Truoc day moi file tu viet ham escape rieng (app.js con khai bao HAI ham
 * escapeHtml trong cung pham vi, ban sau ghi de ban truoc va quen thoat dau ').
 * Noi dung AI, du lieu viec lam ben thu ba... deu phai di qua day truoc khi
 * gan vao innerHTML.
 */
const HtmlUtils = (() => {
  'use strict';

  const BANG = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, c => BANG[c]);
  }

  /** Link tu nguon khong tin cay: chi http/https, con lai (javascript:, data:...) thanh # */
  function safeUrl(url) {
    try {
      const u = new URL(String(url).trim());
      return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : '#';
    } catch (e) {
      return '#';
    }
  }

  /**
   * Markdown toi gian cho tin nhan AI: ```khoi code```, `code dong`, **dam**, *nghieng*.
   * Thu tu quan trong: tach code ra truoc, thoat HTML phan con lai, roi moi dinh dang —
   * de <br> va <em> khong lot vao trong code (Prism dung textContent nen <br> trong
   * <pre> lam ca khoi dinh thanh mot dong, con *p bi an mat dau *).
   */
  function formatChatMarkdown(text, { preClass = '', inlineClass = '' } = {}) {
    if (!text) return '';
    const giu = [];
    const cat = html => '\u0000' + (giu.push(html) - 1) + '\u0000';
    const lopPre = preClass ? ` class="${escapeHtml(preClass)}"` : '';
    const lopCode = inlineClass ? ` class="${escapeHtml(inlineClass)}"` : '';

    let s = String(text).replace(/\u0000/g, '');

    s = s.replace(/```([\w+#.-]*)[^\n`]*\n?([\s\S]*?)```/g, (_, ngonNgu, code) =>
      cat(`<pre${lopPre}><code class="language-${ngonNgu || 'plaintext'}">${escapeHtml(code.replace(/^\n+|\s+$/g, ''))}</code></pre>`));

    s = s.replace(/`([^`\n]+)`/g, (_, code) => cat(`<code${lopCode}>${escapeHtml(code)}</code>`));

    s = escapeHtml(s)
      .replace(/\*\*(?=\S)([^*\n]+?)\*\*/g, '<strong>$1</strong>')
      // Dau * chi la nghieng khi dinh lien chu ben trong, nhu Markdown: "2 * 3 * 4" giu nguyen
      .replace(/(?<![\w*])\*(?=\S)([^*\n]+?)(?<=\S)\*(?![\w*])/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => giu[Number(i)]);
  }

  return { escapeHtml, safeUrl, formatChatMarkdown };
})();

if (typeof window !== 'undefined') window.HtmlUtils = HtmlUtils;
