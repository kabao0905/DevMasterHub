// Nap giao trinh tu data/curriculum/<id>.json (noi sua noi dung). Dung chung cho server (SEO, sitemap)
// va script xuat JSON cho app React. Thu tu cong nghe theo thu-tu.json; file moi chua co trong do
// thi xep sau, theo ten.
const fs = require('node:fs');
const path = require('node:path');

const THU_MUC_MAC_DINH = path.join(__dirname, '..', 'data', 'curriculum');

function napGiaoTrinh(thuMuc = THU_MUC_MAC_DINH) {
  const tep = fs.readdirSync(thuMuc).filter(f => f.endsWith('.json') && f !== 'thu-tu.json').map(f => f.slice(0, -5));
  let thuTu = [];
  try { thuTu = JSON.parse(fs.readFileSync(path.join(thuMuc, 'thu-tu.json'), 'utf8')); } catch { /* khong co thi xep theo ten */ }
  const ids = [...thuTu.filter(id => tep.includes(id)), ...tep.filter(id => !thuTu.includes(id)).sort()];
  return Object.fromEntries(ids.map(id => [id, JSON.parse(fs.readFileSync(path.join(thuMuc, id + '.json'), 'utf8'))]));
}

module.exports = { napGiaoTrinh, THU_MUC_MAC_DINH };
