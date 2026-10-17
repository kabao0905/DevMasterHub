// Bien tuyen cho moi cong nghe (nhu "M1", "L2" tren ban do tau dien): ma ngan + mau rieng cua cong nghe.
// Thay cho emoji: nhin mot lan la nhan ra tuyen, va doc duoc tren moi nen.

const MA: Record<string, string> = {
  cybersecurity: 'SEC', cpp: 'C++', python: 'PY', java: 'JV', nodejs: 'NJS', react: 'RCT',
  htmlcss: 'H5', sql: 'SQL', jest: 'JST', docker: 'DKR', typescript: 'TS', csharp: 'C#',
  go: 'GO', rust: 'RS', php: 'PHP', swift: 'SW', kotlin: 'KT', ruby: 'RB', dart: 'DRT',
  bash: 'SH', dsa: 'DSA', zig: 'ZIG', solidity: 'SOL', lua: 'LUA', r: 'R', scala: 'SCL',
  vue: 'VUE', angular: 'NG', tailwind: 'TW', django: 'DJ', mongodb: 'MDB', graphql: 'GQL',
  kubernetes: 'K8S', cicd: 'CI', nginx: 'NGX'
};

/** Ma tuyen toi da 3 ky tu (bien luon tron deu); cong nghe chua dat ma thi lay chu cai dau cua ten */
export function maTuyen(tech: { id: string; name: string }): string {
  const co = MA[tech.id];
  if (co) return co;
  const tu = tech.name.trim().split(/\s+/).filter(Boolean);
  const ma = tu.length > 1 ? tu.map(w => w[0]).join('') : (tu[0] ?? '').slice(0, 2);
  return (ma || tech.id.slice(0, 2)).toUpperCase().slice(0, 3);
}

const MUC = '#14181e';

function doSang(hex: string): number | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map(i => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const tuongPhan = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Chu trang hay chu toi tren nen mau nay: chon ben nao tuong phan cao hon (WCAG) */
export function chuTrenNen(hex: string): 'trang' | 'toi' {
  const l = doSang(hex);
  if (l === null) return 'trang';
  return tuongPhan(l, 1) >= tuongPhan(l, doSang(MUC)!) ? 'trang' : 'toi';
}
