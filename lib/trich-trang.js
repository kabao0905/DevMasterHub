const { trichVanBan } = require('./net-guard.js');

const DU_CHU = 600;

const giaiMa = s => s
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&');
const boThe = s => giaiMa(String(s).replace(/<[^<>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

const KY_TU_MA = /[{};=()[\]]/g;
const laMa = s => /\b(?:function\s*\(|var\s+\w+\s*=|window\.|document\.)/.test(s)
  || (s.match(KY_TU_MA) || []).length / s.length > 0.05;

function moTaMeta(html) {
  const ra = [];
  for (const [the] of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (!/(?:name|property)\s*=\s*["'](?:description|og:description|twitter:description)["']/i.test(the)) continue;
    const c = the.match(/content\s*=\s*"([^"]*)"|content\s*=\s*'([^']*)'/i);
    if (c) ra.push(boThe(c[1] ?? c[2]));
  }
  return ra;
}

const diaChi = l => (l && l.address
  ? [l.address.streetAddress, l.address.addressLocality, l.address.addressRegion].filter(Boolean).join(', ')
  : '');

function motTin(j) {
  const luong = j.baseSalary && j.baseSalary.value;
  const soLuong = luong && [luong.minValue, luong.maxValue, luong.value].filter(v => v != null).join(' - ');
  const diaDiem = [].concat(j.jobLocation || []).map(diaChi).filter(Boolean).join('; ');
  return [
    j.title && `Vị trí: ${j.title}`,
    j.hiringOrganization && j.hiringOrganization.name && `Công ty: ${j.hiringOrganization.name}`,
    diaDiem && `Địa điểm: ${diaDiem}`,
    soLuong && `Lương: ${soLuong} ${j.baseSalary.currency || ''}`.trim(),
    j.employmentType && `Hình thức: ${[].concat(j.employmentType).join(', ')}`,
    j.description && `Mô tả: ${boThe(j.description)}`
  ].filter(Boolean).join('\n');
}

function tinTuyenDung(html) {
  const ra = [];
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let d;
    try { d = JSON.parse(m[1]); } catch { continue; }
    const ds = [d].flat().flatMap(x => (x && Array.isArray(x['@graph']) ? x['@graph'] : [x]));
    for (const j of ds) {
      if (j && /JobPosting/.test([].concat(j['@type']).join(' '))) ra.push(motTin(j));
    }
  }
  return ra;
}

function duLieuNext(html) {
  let luong = '';
  for (const m of html.matchAll(/self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g)) {
    try {
      const a = JSON.parse(m[1]);
      if (typeof a[1] === 'string') luong += a[1];
    } catch {}
  }
  const buf = Buffer.from(luong, 'utf8');
  const ra = [];
  let i = 0;
  while (i < buf.length) {
    const haiCham = buf.indexOf(0x3a, i);
    if (haiCham < 0) break;
    const laBanGhi = /^[0-9a-z]{1,6}$/.test(buf.toString('latin1', i, haiCham));
    if (laBanGhi && buf[haiCham + 1] === 0x54) {
      const phay = buf.indexOf(0x2c, haiCham + 2);
      const n = parseInt(buf.toString('latin1', haiCham + 2, phay), 16);
      if (phay < 0 || !Number.isFinite(n)) break;
      const chu = boThe(buf.toString('utf8', phay + 1, phay + 1 + n));
      if (chu.length > 20 && !laMa(chu)) ra.push(chu);
      i = phay + 1 + n;
      continue;
    }
    const xuong = buf.indexOf(0x0a, i);
    if (xuong < 0) break;
    i = xuong + 1;
  }
  return ra;
}

function trichNoiDungTrang(html) {
  const s = String(html || '');
  const hienThi = trichVanBan(s);
  if (hienThi.length >= DU_CHU) return hienThi;
  const them = [...tinTuyenDung(s), ...duLieuNext(s), ...moTaMeta(s)];
  const daCo = new Set();
  const doan = [hienThi, ...them].filter(x => x && !daCo.has(x) && daCo.add(x));
  return doan.join('\n\n');
}

module.exports = { trichNoiDungTrang };
