// Cac file trong public/ la script trinh duyet, khong phai module Node.
// Nap chung vao hop cat vm de bo kiem chay duoc ngoai trinh duyet.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const PUB = path.join(__dirname, '..', 'public');

function hopCat() {
  const sb = {
    console,
    atob: s => Buffer.from(s, 'base64').toString('utf8'),
    btoa: s => Buffer.from(s, 'utf8').toString('base64'),
    setTimeout: () => 0,
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, classList: { add() {}, remove() {} }, appendChild() {}, remove() {} }),
      body: { appendChild() {} }
    },
    localStorage: (() => {
      const kho = {};
      return {
        getItem: k => (k in kho ? kho[k] : null),
        setItem: (k, v) => { kho[k] = String(v); },
        removeItem: k => { delete kho[k]; }
      };
    })()
  };
  sb.window = sb;
  sb.globalThis = sb;
  vm.createContext(sb);
  return sb;
}

/** Nap mot file trong public/ vao hop cat, tra ve bien toan cuc no khai bao */
function napFile(sb, tenFile, tenBien) {
  const src = fs.readFileSync(path.join(PUB, tenFile), 'utf8');
  vm.runInContext(src + '\n;globalThis.__KQ = ' + tenBien + ';', sb);
  return sb.__KQ;
}

/** Moi lan goi tra ve mot terminal doc lap, khong dinh trang thai bai kiem truoc */
function napTerminal() {
  const sb = hopCat();
  return napFile(sb, 'cyber-terminal.js', 'CyberTerminal');
}

/** Doc ma nguon tho cua mot file trong public/ */
function docNguon(tenFile) {
  return fs.readFileSync(path.join(PUB, tenFile), 'utf8');
}

module.exports = { hopCat, napFile, napTerminal, docNguon, PUB };
