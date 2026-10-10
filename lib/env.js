// Doc file .env khong can thu vien dotenv (du an khong them phu thuoc npm).
// Ban cu chi doc 6 khoa AI: SUPABASE_URL, BASE_URL, PORT ghi trong .env bi bo qua am tham.

/** Chuyen noi dung .env thanh object { KHOA: 'gia tri' } */
function phanTichEnv(noiDung) {
  const kq = {};
  for (const dong of String(noiDung).replace(/^﻿/, '').split('\n')) {
    const m = dong.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let giaTri = m[2];
    const nhay = giaTri[0];
    if ((nhay === '"' || nhay === "'") && giaTri.length >= 2 && giaTri.endsWith(nhay)) {
      giaTri = giaTri.slice(1, -1);
    }
    kq[m[1]] = giaTri;
  }
  return kq;
}

/** Nap vao env (mac dinh process.env). Bien da dat tu moi truong luon thang .env */
function napEnv(noiDung, env = process.env) {
  for (const [khoa, giaTri] of Object.entries(phanTichEnv(noiDung))) {
    if (!(khoa in env)) env[khoa] = giaTri;
  }
  return env;
}

module.exports = { phanTichEnv, napEnv };
