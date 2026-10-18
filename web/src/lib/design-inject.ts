export type TruongThietKe = {
  prop: string;
  writeProp?: string;
  label: string;
  type: 'color' | 'range' | 'px' | 'select' | 'text';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  placeholder?: string;
};
export type NhomThuocTinh = { name: string; fields: TruongThietKe[] };

export const GROUPS: NhomThuocTinh[] = [
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

export function injectScript(token: string): string {
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

export function rgbToHex(v: string): string {
  if (!v) return '';
  if (v.startsWith('#')) return v;
  const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '';
  return '#' + [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('');
}
