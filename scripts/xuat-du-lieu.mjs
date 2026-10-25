import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import curriculum from '../lib/curriculum.js';
import hashes from '../lib/quiz-bank.js';
import { validateBank } from '../shared/quiz-bank.mjs';

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

const THU_TU_TEP = ['index.html', 'style.css', 'script.js', 'App.jsx', 'App.js', 'main.ts'];

export function napPlayground(thuMucBai) {
  if (!fs.existsSync(thuMucBai)) return null;
  const ten = fs.readdirSync(thuMucBai).filter(f => f !== 'libs.json' && fs.statSync(path.join(thuMucBai, f)).isFile());
  if (!ten.length) return null;
  const hang = f => (THU_TU_TEP.includes(f) ? THU_TU_TEP.indexOf(f) : THU_TU_TEP.length);
  ten.sort((a, b) => hang(a) - hang(b) || a.localeCompare(b));
  const files = Object.fromEntries(ten.map(f => [f, fs.readFileSync(path.join(thuMucBai, f), 'utf8')]));
  const tepLibs = path.join(thuMucBai, 'libs.json');
  const libs = fs.existsSync(tepLibs) ? JSON.parse(fs.readFileSync(tepLibs, 'utf8')) : undefined;
  return libs ? { files, libs } : { files };
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
    for (const l of t.levels || []) {
      for (const ls of l.lessons || []) {
        // Never publish a draft or silently accept content for an outdated lesson.
        delete ls.quizBanks;
        const bankDir = path.join(thuMucDuLieu, 'quiz-bank', t.id, l.id);
        for (const lang of ['vi', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es']) {
          const file = path.join(bankDir, `${ls.id}.${lang}.json`);
          if (!fs.existsSync(file)) continue;
          const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
          const errors = validateBank(bank, { tech: t.id, level: l.id, lesson: ls.id, language: lang, sourceHash: hashes.lessonHash(ls) });
          if (errors.length) throw new Error(`${file}: ${errors.join('; ')}`);
          if (bank.status !== 'approved') continue;
          const name = `${ls.id}.${lang}.${createHash('sha256').update(JSON.stringify(bank)).digest('hex').slice(0, 16)}.json`;
          ghiJson(path.join(thuMucRa, 'quiz-bank', t.id, l.id), name, bank);
          ls.quizBanks ??= {};
          ls.quizBanks[lang] = { url: `/quiz-bank/${t.id}/${l.id}/${name}`, sourceHash: bank.sourceHash, count: 80 };
        }
        const pg = napPlayground(path.join(thuMucDuLieu, 'playground', t.id, l.id, ls.id));
        if (pg) ls.playground = pg;
      }
    }
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
