const MAU_REACT = [
  /^\/$/,
  /^\/auth\/?$/,
  /^\/roadmap(\/[^/]+){0,2}\/?$/,
  /^\/lesson(\/[^/]+){0,3}\/?$/,
  /^\/challenge\/?$/,
  /^\/project\/?$/,
  /^\/project-(level|topic)(\/[^/]+)?\/?$/,
  /^\/saved-ideas\/?$/,
  /^\/my-projects(\/[^/]+)?\/?$/,
  /^\/career\/?$/
];

function laUrlReact(duongDan) {
  const p = String(duongDan || '/').split('?')[0];
  return MAU_REACT.some(re => re.test(p));
}

module.exports = { laUrlReact };
