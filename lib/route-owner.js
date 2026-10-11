// Bang duy nhat: URL nao do app React phuc vu. Moi dot chuyen them mau vao day.
// Server dung laUrlReact de chon trang; app cu nhan VIEW_REACT qua window.__REACT_VIEWS
// de biet di toi view nao thi phai tai trang moi (location.assign) thay vi pushState.

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

// Ten view tuong ung trong navigateTo cua public/app.js
const VIEW_REACT = ['dashboard', 'auth', 'roadmap', 'lesson', 'challenge', 'project', 'project-level', 'project-topic', 'saved-ideas', 'my-projects', 'career'];

function laUrlReact(duongDan) {
  const p = String(duongDan || '/').split('?')[0];
  return MAU_REACT.some(re => re.test(p));
}

module.exports = { laUrlReact, VIEW_REACT };
