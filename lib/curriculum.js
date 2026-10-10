// Nap giao trinh tu cac file data*.js trong public/ (script trinh duyet) bang vm.
// Dung chung cho server (SEO, sitemap) va script xuat JSON cho app React.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/** Thu tu khong anh huong ket qua: data-extra.js moi la noi gop, nen nap no sau cung */
function napGiaoTrinh(thuMucPublic) {
  const names = fs.readdirSync(thuMucPublic);
  const ordered = [
    'data.js',
    ...names.filter(f => /^data-.*\.js$/.test(f) && f !== 'data-extra.js').sort(),
    'data-extra.js'
  ].filter(f => names.includes(f));

  const sandbox = { console: { log() {}, warn() {}, error() {} } };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const f of ordered) {
    vm.runInContext(fs.readFileSync(path.join(thuMucPublic, f), 'utf8'), ctx, { filename: f });
  }
  vm.runInContext('globalThis.__C = typeof CURRICULUM !== "undefined" ? CURRICULUM : null;', ctx);
  return { ...(sandbox.CURRICULUM || {}), ...(ctx.__C || {}) };
}

module.exports = { napGiaoTrinh };
