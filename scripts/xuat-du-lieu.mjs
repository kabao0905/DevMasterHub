import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import curriculum from '../lib/curriculum.js';

const { napGiaoTrinh } = curriculum;
const GOC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const boThe = html => String(html || '').replace(/<[^<>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function ghiJson(thuMuc, ten, duLieu) {
  fs.mkdirSync(thuMuc, { recursive: true });
  fs.writeFileSync(path.join(thuMuc, ten), JSON.stringify(duLieu));
}

function napBanDich(thuMucDuLieu) {
  return JSON.parse(fs.readFileSync(path.join(thuMucDuLieu, 'i18n.json'), 'utf8'));
}

const khongRong = obj => Object.fromEntries(Object.entries(obj || {}).filter(([, v]) => v));

function banDichCho(lang, { translations, canonicalTitles, techDescriptions, LANGUAGES }) {
  const chon = muc => muc[lang] || (lang === 'vi' ? muc.vi : undefined) || muc.en;
  const titles = {};
  for (const [khoa, muc] of Object.entries(canonicalTitles)) {
    const v = chon(muc);
    if (v) titles[khoa] = v;
  }
  const techDesc = {};
  for (const [id, muc] of Object.entries(techDescriptions)) {
    const v = chon(muc);
    if (v) techDesc[id] = v;
  }
  return {
    ui: { ...khongRong(translations.vi), ...khongRong(translations.en), ...khongRong(translations[lang]) },
    titles,
    techDesc,
    languages: LANGUAGES
  };
}

export function xuatDuLieu({ thuMucDuLieu = path.join(GOC, 'data'), thuMucRa = path.join(GOC, 'web', 'public') } = {}) {
  const giaoTrinh = napGiaoTrinh(path.join(thuMucDuLieu, 'curriculum'));
  const congNghe = Object.values(giaoTrinh).filter(t => t && t.id);
  const thuMucGT = path.join(thuMucRa, 'curriculum');

  ghiJson(thuMucGT, 'index.json', congNghe.map(t => ({
    id: t.id, name: t.name, icon: t.icon, color: t.color, gradient: t.gradient,
    category: t.category, description: t.description,
    levels: (t.levels || []).map(l => ({
      id: l.id, name: l.name, desc: l.desc, badge: l.badge,
      lessons: (l.lessons || []).map(ls => ({ id: ls.id, title: ls.title }))
    }))
  })));

  const timKiem = [];
  for (const t of congNghe) {
    ghiJson(thuMucGT, `${t.id}.json`, t);
    for (const l of t.levels || []) {
      for (const ls of l.lessons || []) {
        timKiem.push({ t: t.id, l: l.id, s: ls.id, title: ls.title, text: boThe(ls.theory).slice(0, 2000) });
      }
    }
  }
  ghiJson(thuMucGT, 'search.json', timKiem);

  const banDich = napBanDich(thuMucDuLieu);
  const ngonNgu = Object.keys(banDich.LANGUAGES);
  for (const lang of ngonNgu) ghiJson(path.join(thuMucRa, 'i18n'), `${lang}.json`, banDichCho(lang, banDich));

  return { soCongNghe: congNghe.length, ngonNgu };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const kq = xuatDuLieu();
  console.log(`[xuat-du-lieu] ${kq.soCongNghe} công nghệ, ${kq.ngonNgu.length} ngôn ngữ -> web/public/`);
}
