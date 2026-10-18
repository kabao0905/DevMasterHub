const { test, before } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { napGiaoTrinh } = require('../lib/curriculum.js');
const DU_LIEU_I18N = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'i18n.json'), 'utf8'));

let ra;
let giaoTrinh;
const doc = p => JSON.parse(fs.readFileSync(path.join(ra, p), 'utf8'));

before(async () => {
  ra = fs.mkdtempSync(path.join(os.tmpdir(), 'xuat-'));
  const { xuatDuLieu } = await import('../scripts/xuat-du-lieu.mjs');
  await xuatDuLieu({ thuMucRa: ra });
  giaoTrinh = napGiaoTrinh();
});

test('index.json liet ke du cong nghe, giu thu tu, khong chua noi dung bai', () => {
  const ds = doc('curriculum/index.json');
  assert.deepStrictEqual(ds.map(t => t.id), Object.values(giaoTrinh).map(t => t.id));
  assert.ok(ds.length >= 30);
  assert.ok(!fs.readFileSync(path.join(ra, 'curriculum/index.json'), 'utf8').includes('"theory"'));
  const py = ds.find(t => t.id === 'python');
  assert.ok(py.levels[0].lessons[0].id && py.levels[0].lessons[0].title);
});

test('moi cong nghe co file rieng day du noi dung', () => {
  const py = doc('curriculum/python.json');
  assert.strictEqual(py.id, 'python');
  assert.ok(py.levels[0].lessons[0].theory.length > 50);
});

test('search.json co van ban thuan cua ly thuyet, cat ngan', () => {
  const ds = doc('curriculum/search.json');
  const muc = ds.find(x => x.t === 'python');
  assert.ok(muc.l && muc.s && muc.title);
  assert.ok(!/<[a-z]/i.test(muc.text), 'con the HTML');
  assert.ok(ds.every(x => x.text.length <= 2000));
});

test('ban dich moi ngon ngu da gop san du phong: ngon ngu > en > vi', () => {
  const { translations: tr } = DU_LIEU_I18N;
  const en = doc('i18n/en.json');
  const fr = doc('i18n/fr.json');
  assert.ok(en.ui.dashboardTitle);
  const thieuOFr = Object.keys(tr.en).find(k => tr.en[k] && !tr.fr[k]);
  if (thieuOFr) assert.strictEqual(fr.ui[thieuOFr], tr.en[thieuOFr]);
  const coOFr = Object.keys(tr.fr).find(k => tr.fr[k]);
  assert.strictEqual(fr.ui[coOFr], tr.fr[coOFr]);
  assert.strictEqual(Object.keys(en.languages).length, 8);
});

test('ten bai hoc dich tra duoc bang khoa da chuan hoa, mo ta cong nghe theo ngon ngu', () => {
  const { canonicalTitles, techDescriptions } = DU_LIEU_I18N;
  const [khoa, muc] = Object.entries(canonicalTitles).find(([, m]) => m.fr && m.en);
  assert.strictEqual(doc('i18n/fr.json').titles[khoa], muc.fr);
  assert.strictEqual(doc('i18n/vi.json').techDesc.cpp, techDescriptions.cpp.vi);
});

test('giao trinh JSON: moi cong nghe co id trung ten file, thu-tu.json liet ke du', () => {
  const thuMuc = path.join(__dirname, '..', 'data', 'curriculum');
  const thuTu = JSON.parse(fs.readFileSync(path.join(thuMuc, 'thu-tu.json'), 'utf8'));
  const tep = fs.readdirSync(thuMuc).filter(x => x !== 'thu-tu.json').map(x => x.replace(/\.json$/, ''));
  assert.deepStrictEqual([...thuTu].sort(), [...tep].sort());
  for (const id of thuTu) assert.strictEqual(giaoTrinh[id].id, id);
});

test('moi bai co khung chay code (HTML/CSS, React, Vue, Tailwind, TypeScript) co bo file thuc hanh rieng', () => {
  const tepChinh = { htmlcss: 'index.html', react: 'App.jsx', vue: 'App.js', tailwind: 'index.html', typescript: 'main.ts' };
  for (const [id, tep] of Object.entries(tepChinh)) {
    const t = doc(`curriculum/${id}.json`);
    for (const l of t.levels) {
      for (const ls of l.lessons) {
        const pg = ls.playground;
        assert.ok(pg, `${id}/${l.id}/${ls.id} chua co playground`);
        assert.ok(pg.files[tep]?.trim(), `${id}/${l.id}/${ls.id} thieu ${tep}`);
        if (id !== 'typescript') assert.ok(pg.files['index.html'], `${id}/${l.id}/${ls.id} thieu index.html`);
        if (pg.libs) assert.ok(Array.isArray(pg.libs) && pg.libs.every(u => /^https:\/\/(unpkg\.com|cdn\.tailwindcss\.com)\//.test(u)), `${id}/${l.id}/${ls.id} libs sai`);
      }
    }
  }
});

test('napPlayground: index.html, style.css truoc roi moi den file code; doc libs.json', async () => {
  const { napPlayground } = await import('../scripts/xuat-du-lieu.mjs');
  const thu = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-'));
  fs.writeFileSync(path.join(thu, 'App.jsx'), 'x');
  fs.writeFileSync(path.join(thu, 'style.css'), 'y');
  fs.writeFileSync(path.join(thu, 'index.html'), 'z');
  fs.writeFileSync(path.join(thu, 'libs.json'), '["https://unpkg.com/a.js"]');
  const pg = napPlayground(thu);
  assert.deepStrictEqual(Object.keys(pg.files), ['index.html', 'style.css', 'App.jsx']);
  assert.deepStrictEqual(pg.libs, ['https://unpkg.com/a.js']);
  assert.strictEqual(napPlayground(path.join(thu, 'khong-co')), null);
});
