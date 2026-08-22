/**
 * DesignMode — sua truc tiep tren trang web that, nhung CODE VAN LA GOC.
 *
 * Cach hoat dong:
 *  1. Chen mot script do vao khung xem truoc. Script nay bat hover/click,
 *     tinh ra mot CSS selector on dinh cho phan tu duoc bam, roi gui ve trang cha.
 *  2. Trang cha hien bang thuoc tinh. Moi thay doi deu di qua CssPatch de
 *     chen dung mot khai bao vao style.css — khong sinh lai ca file.
 *  3. O nhap AI gui ke ca file hien tai lan phan tu dang chon; AI tu quyet dinh
 *     nen sua rieng phan tu hay sua ca trang.
 *
 * Vi code la goc nen phan hoc vien tu go khong bao gio bi ghi de.
 */
const DesignMode = (() => {
  'use strict';

  // ─── Cac thuoc tinh cho chinh bang tay, chia nhom de do roi mat (Miller) ───
  const GROUPS = [
    {
      name: 'Nền & màu',
      fields: [
        { prop: 'background-color', writeProp: 'background', label: 'Màu nền', type: 'color' },
        { prop: 'color', label: 'Màu chữ', type: 'color' },
        { prop: 'opacity', label: 'Độ mờ', type: 'range', min: 0, max: 1, step: 0.05 }
      ]
    },
    {
      name: 'Chữ',
      fields: [
        { prop: 'font-size', label: 'Cỡ chữ', type: 'px', min: 8, max: 96 },
        { prop: 'font-weight', label: 'Độ đậm', type: 'select',
          options: ['', '300', '400', '500', '600', '700', '800', '900'] },
        { prop: 'text-align', label: 'Căn lề', type: 'select',
          options: ['', 'left', 'center', 'right', 'justify'] }
      ]
    },
    {
      name: 'Khoảng cách & viền',
      fields: [
        { prop: 'padding', label: 'Đệm trong', type: 'px', min: 0, max: 120 },
        { prop: 'margin', label: 'Lề ngoài', type: 'px', min: 0, max: 120 },
        { prop: 'border-radius', label: 'Bo góc', type: 'px', min: 0, max: 80 },
        { prop: 'border', label: 'Viền', type: 'text', placeholder: '1px solid #333' }
      ]
    }
  ];

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /**
   * Script chay BEN TRONG khung xem truoc.
   * Tinh selector ngan nhat ma van chi tro toi dung mot phan tu — de hoc vien
   * doc code thay selector giong thu ho tu viet, khong phai chuoi may sinh.
   */
  function injectScript(token) {
    return `
<script>
(function () {
  var HL = document.createElement('div');
  HL.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #58a6ff;background:rgba(88,166,255,.1);border-radius:2px;transition:all .05s;display:none';
  var TAG = document.createElement('div');
  TAG.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483647;background:#58a6ff;color:#fff;font:600 11px/1.5 ui-monospace,monospace;padding:2px 7px;border-radius:4px;display:none;white-space:nowrap';
  document.documentElement.appendChild(HL);
  document.documentElement.appendChild(TAG);

  var selected = null;

  function isUnique(sel) {
    try { return document.querySelectorAll(sel).length === 1; } catch (e) { return false; }
  }

  function selectorFor(el) {
    if (!el || el === document.body) return 'body';
    if (el.id) return '#' + el.id;

    var tag = el.tagName.toLowerCase();

    // uu tien class rieng cua phan tu
    var classes = (el.className && typeof el.className === 'string')
      ? el.className.trim().split(/\\s+/).filter(Boolean) : [];
    for (var i = 0; i < classes.length; i++) {
      if (isUnique('.' + classes[i])) return '.' + classes[i];
    }
    if (classes.length && isUnique(tag + '.' + classes.join('.'))) return tag + '.' + classes.join('.');
    if (isUnique(tag)) return tag;

    // di nguoc len cha cho toi khi duy nhat
    var path = tag + (classes.length ? '.' + classes[0] : '');
    var node = el.parentElement;
    while (node && node !== document.documentElement) {
      var parentSel = node.id ? '#' + node.id : node.tagName.toLowerCase() +
        (node.className && typeof node.className === 'string' && node.className.trim()
          ? '.' + node.className.trim().split(/\\s+/)[0] : '');
      path = parentSel + ' > ' + path;
      if (isUnique(path)) return path;
      node = node.parentElement;
    }

    // cuoi cung moi dung nth-of-type
    var sibs = el.parentElement ? Array.prototype.filter.call(
      el.parentElement.children, function (c) { return c.tagName === el.tagName; }) : [];
    if (sibs.length > 1) {
      var idx = sibs.indexOf(el) + 1;
      var withNth = path + ':nth-of-type(' + idx + ')';
      if (isUnique(withNth)) return withNth;
    }
    return path;
  }

  function box(el) {
    var r = el.getBoundingClientRect();
    HL.style.display = 'block';
    HL.style.left = r.left + 'px'; HL.style.top = r.top + 'px';
    HL.style.width = r.width + 'px'; HL.style.height = r.height + 'px';
    TAG.style.display = 'block';
    TAG.textContent = selectorFor(el);
    TAG.style.left = r.left + 'px';
    TAG.style.top = (r.top > 22 ? r.top - 20 : r.bottom + 4) + 'px';
  }

  function report(el) {
    var cs = getComputedStyle(el);
    var props = {};
    ['background-color','color','opacity','font-size','font-weight','text-align',
     'padding','margin','border-radius','border'].forEach(function (p) {
      props[p] = cs.getPropertyValue(p).trim();
    });
    parent.postMessage({
      __design: '${token}',
      type: 'select',
      selector: selectorFor(el),
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().slice(0, 60),
      computed: props
    }, '*');
  }

  document.addEventListener('mouseover', function (e) {
    if (e.target === HL || e.target === TAG) return;
    box(e.target);
  }, true);

  document.addEventListener('mouseleave', function () {
    if (!selected) { HL.style.display = 'none'; TAG.style.display = 'none'; }
  }, true);

  document.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    selected = e.target;
    HL.style.borderColor = '#3fb950';
    TAG.style.background = '#3fb950';
    box(selected);
    report(selected);
  }, true);

  // chan moi tuong tac that de bam khong kich hoat nut cua trang
  ['submit','keydown','mousedown','mouseup','dblclick'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); }, true);
  });

  window.addEventListener('scroll', function () { if (selected) box(selected); }, true);
  window.addEventListener('resize', function () { if (selected) box(selected); });
})();
<\/script>`;
  }

  // ─── Bang thuoc tinh ben trang cha ───
  function panelHtml(sel) {
    if (!sel) {
      return `<div class="dm-empty">
        <p><strong>Bấm vào bất kỳ phần tử nào</strong> trong trang bên trái để chỉnh sửa.</p>
        <p class="dm-note">Mọi thay đổi sẽ được ghi thành CSS thật trong <code>style.css</code> — bạn xem được ngay code vừa sinh ra.</p>
      </div>`;
    }

    const c = sel.computed || {};
    const groups = GROUPS.map(g => `
      <div class="dm-group">
        <h4>${esc(g.name)}</h4>
        ${g.fields.map(f => fieldHtml(f, c[f.prop])).join('')}
      </div>`).join('');

    return `
      <div class="dm-target">
        <code>${esc(sel.selector)}</code>
        <span class="dm-tag">&lt;${esc(sel.tag)}&gt;</span>
      </div>
      ${groups}`;
  }

  function fieldHtml(f, value) {
    const v = value || '';
    const id = 'dm-f-' + f.prop.replace(/[^a-z]/g, '');
    const write = f.writeProp || f.prop;
    const common = `id="${id}" data-prop="${f.prop}" data-write="${write}" oninput="DesignMode.onField(this)"`;

    if (f.type === 'color') {
      const hex = rgbToHex(v);
      return `<label class="dm-field">
        <span>${esc(f.label)}</span>
        <span class="dm-color">
          <input type="color" ${common} value="${hex || '#000000'}" />
          <input type="text" class="dm-color-text" value="${esc(hex || v)}"
                 data-prop="${f.prop}" data-write="${write}"
                 oninput="DesignMode.onField(this)" spellcheck="false" />
        </span>
      </label>`;
    }
    if (f.type === 'px') {
      const num = parseFloat(v) || 0;
      return `<label class="dm-field">
        <span>${esc(f.label)}</span>
        <span class="dm-px">
          <input type="range" ${common} min="${f.min}" max="${f.max}" value="${num}" data-unit="px" />
          <output>${num}px</output>
        </span>
      </label>`;
    }
    if (f.type === 'range') {
      const num = parseFloat(v);
      return `<label class="dm-field">
        <span>${esc(f.label)}</span>
        <span class="dm-px">
          <input type="range" ${common} min="${f.min}" max="${f.max}" step="${f.step}"
                 value="${isNaN(num) ? 1 : num}" />
          <output>${isNaN(num) ? 1 : num}</output>
        </span>
      </label>`;
    }
    if (f.type === 'select') {
      return `<label class="dm-field">
        <span>${esc(f.label)}</span>
        <select ${common.replace('oninput', 'onchange')}>
          ${f.options.map(o =>
            `<option value="${o}"${o && v.startsWith(o) ? ' selected' : ''}>${o || '— mặc định —'}</option>`
          ).join('')}
        </select>
      </label>`;
    }
    return `<label class="dm-field">
      <span>${esc(f.label)}</span>
      <input type="text" ${common} value="${esc(v)}" placeholder="${esc(f.placeholder || '')}" spellcheck="false" />
    </label>`;
  }

  function rgbToHex(v) {
    if (!v) return '';
    if (v.startsWith('#')) return v;
    const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return '';
    return '#' + [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('');
  }

  // ─── Trang thai + xu ly su kien ───
  let current = null;      // phan tu dang chon
  let aiBusy = false;

  function setSelection(sel) {
    current = sel;
    const box = document.getElementById('dm-panel');
    if (box) box.innerHTML = panelHtml(sel);
    const ai = document.getElementById('dm-ai-target');
    if (ai) {
      ai.textContent = sel ? sel.selector : 'cả trang';
      ai.className = sel ? 'dm-ai-target has' : 'dm-ai-target';
    }
  }

  function getSelection() { return current; }

  // Nguoi dung keo thanh truot / doi mau -> va thang vao style.css
  function onField(input) {
    if (!current) return;
    const prop = input.dataset.write || input.dataset.prop;
    let value = input.value;

    if (input.dataset.unit === 'px') value = value + 'px';
    if (input.type === 'range') {
      const out = input.parentElement.querySelector('output');
      if (out) out.textContent = value;
    }
    // o nhap ma hex di kem o chon mau: dong bo hai chieu
    if (input.type === 'color') {
      const twin = input.parentElement.querySelector('.dm-color-text');
      if (twin) twin.value = value;
    } else if (input.classList.contains('dm-color-text')) {
      const twin = input.parentElement.querySelector('input[type=color]');
      if (twin && /^#[0-9a-f]{6}$/i.test(value)) twin.value = value;
    }

    if (typeof SandpackLive !== 'undefined') {
      SandpackLive.applyStyle(current.selector, { [prop]: value });
    }
  }

  // ─── Nho AI. Theo yeu cau: AI tu quyet dinh pham vi, khong co nut chon ───
  async function askAi() {
    if (aiBusy) return;
    const input = document.getElementById('dm-ai-input');
    const status = document.getElementById('dm-ai-status');
    const req = (input.value || '').trim();
    if (!req) return;

    if (typeof SandpackLive === 'undefined') return;
    const files = SandpackLive.getFiles();

    aiBusy = true;
    status.className = 'dm-ai-status busy';
    status.textContent = 'AI đang đọc code của bạn…';

    const context = current
      ? `Người dùng đang chọn phần tử <${current.tag}> có selector "${current.selector}".`
      : 'Người dùng chưa chọn phần tử nào cụ thể.';

    const system = [
      'Bạn là trợ lý sửa giao diện web cho một nền tảng dạy lập trình.',
      'Người học có 3 file: index.html, style.css, script.js.',
      'Hãy TỰ QUYẾT ĐỊNH phạm vi sửa dựa trên yêu cầu: nếu họ nói về một phần tử cụ thể',
      'thì chỉ sửa CSS của phần tử đó; nếu họ yêu cầu đổi cả giao diện thì được phép',
      'viết lại cả file.',
      '',
      'CHỈ trả về JSON thuần, không kèm giải thích ngoài JSON, không bọc trong markdown:',
      '{"edits":[...],"explain":"một câu tiếng Việt ngắn"}',
      '',
      'Mỗi phần tử trong "edits" là MỘT trong hai dạng:',
      '  {"type":"css","selector":".card","props":{"background":"#fff","color":"red"}}',
      '  {"type":"file","file":"index.html","content":"<toàn bộ nội dung file mới>"}',
      '',
      'Ưu tiên dạng "css" vì nó giữ nguyên code người học tự viết.',
      'Chỉ dùng dạng "file" khi thật sự phải đổi cấu trúc HTML hoặc logic JS.'
    ].join('\n');

    const user = [
      context,
      '',
      'YÊU CẦU CỦA NGƯỜI DÙNG: ' + req,
      '',
      '--- index.html ---', files['index.html'] || '',
      '--- style.css ---', files['style.css'] || '',
      '--- script.js ---', files['script.js'] || ''
    ].join('\n');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (typeof AuthService !== 'undefined' && AuthService.isConfigured && AuthService.isConfigured()) {
        Object.assign(headers, await AuthService.authHeaders());
      }
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          system,
          messages: [{ role: 'user', content: user }],
          temperature: 0.3,
          max_tokens: 2000,
          taskType: 'general'
        })
      });

      if (res.status === 401) throw new Error('Bạn cần đăng nhập để dùng AI.');
      if (!res.ok) throw new Error('AI đang bận, thử lại sau ít phút.');

      const data = await res.json();
      let text = (data.content && data.content[0] && data.content[0].text) || '';
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();

      let plan;
      try { plan = JSON.parse(text); }
      catch { throw new Error('AI trả về không đúng định dạng, hãy diễn đạt lại yêu cầu.'); }

      const edits = Array.isArray(plan.edits) ? plan.edits : [];
      if (!edits.length) throw new Error('AI không đề xuất thay đổi nào.');

      let applied = 0;
      for (const e of edits) {
        if (e.type === 'css' && e.selector && e.props) {
          SandpackLive.applyStyle(e.selector, e.props, true);
          applied++;
        } else if (e.type === 'file' && e.file && typeof e.content === 'string') {
          SandpackLive.replaceFile(e.file, e.content);
          applied++;
        }
      }
      SandpackLive.refresh();

      status.className = 'dm-ai-status ok';
      status.textContent = (plan.explain || 'Đã áp dụng') + ` (${applied} thay đổi)`;
      input.value = '';
    } catch (err) {
      status.className = 'dm-ai-status err';
      status.textContent = err.message;
    } finally {
      aiBusy = false;
    }
  }

  function aiKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAi(); }
  }

  return { injectScript, panelHtml, GROUPS, rgbToHex, esc,
           setSelection, getSelection, onField, askAi, aiKey };
})();

if (typeof window !== 'undefined') window.DesignMode = DesignMode;
