const { test, before } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { napGiaoTrinh } = require('../lib/curriculum.js');
const { hopCat, napFile, PUB } = require('./helper.js');

let ra;
let giaoTrinh;
const doc = p => JSON.parse(fs.readFileSync(path.join(ra, p), 'utf8'));

before(async () => {
  ra = fs.mkdtempSync(path.join(os.tmpdir(), 'xuat-'));
  const { xuatDuLieu } = await import('../scripts/xuat-du-lieu.mjs');
  await xuatDuLieu({ thuMucPublic: PUB, thuMucRa: ra });
  giaoTrinh = napGiaoTrinh(PUB);
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
  const I18n = napFile(hopCat(), 'i18n.js', 'I18n');
  const { translations: tr } = I18n._duLieu;
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
  const I18n = napFile(hopCat(), 'i18n.js', 'I18n');
  const { canonicalTitles, techDescriptions } = I18n._duLieu;
  const [khoa, muc] = Object.entries(canonicalTitles).find(([, m]) => m.fr && m.en);
  assert.strictEqual(doc('i18n/fr.json').titles[khoa], muc.fr);
  assert.strictEqual(doc('i18n/vi.json').techDesc.cpp, techDescriptions.cpp.vi);
});
