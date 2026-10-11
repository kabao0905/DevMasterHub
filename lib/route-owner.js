// Cac URL ma app co trang (router React o web/src/router.tsx). Server dung laUrlReact de tra ma 200;
// URL khac van nhan trang React (hien "Không tìm thấy") nhung voi ma 404 cho may tim kiem.
// Them trang moi vao router thi them mau vao day.

const MAU_REACT = [
  /^\/$/,                          // dashboard
  /^\/auth\/?$/,                   // dang nhap / dang ky
  /^\/roadmap(\/[^/]+){0,2}\/?$/,  // /roadmap, /roadmap/<tech>, /roadmap/<tech>/<cap>
  /^\/lesson(\/[^/]+){0,3}\/?$/,   // /lesson/<tech>/<cap>/<bai> (thieu doan thi React chuyen ve roadmap)
  /^\/challenge\/?$/,              // thu thach CTF
  /^\/project\/?$/,                // Project Lab
  /^\/project-(level|topic)(\/[^/]+)?\/?$/, // project theo cap do / chu de (kem cap, chu de)
  /^\/saved-ideas\/?$/,            // idea da luu
  /^\/my-projects(\/[^/]+)?\/?$/,  // du an da nop va chi tiet
  /^\/career\/?$/                  // AI Career Advisor
];

function laUrlReact(duongDan) {
  const p = String(duongDan || '/').split('?')[0];
  return MAU_REACT.some(re => re.test(p));
}

module.exports = { laUrlReact };
