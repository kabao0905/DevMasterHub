const ROUTE_CU = new Set([
  'roadmap', 'lesson', 'challenge', 'career', 'project', 'project-level',
  'project-topic', 'saved-ideas', 'my-projects', 'auth', 'dashboard'
]);

export function duongDanTuHashCu(hash: string): string | null {
  const sach = hash.replace(/^#\/?/, '');
  if (!sach) return null;
  const dau = sach.split('/')[0];
  if (!ROUTE_CU.has(dau)) return null;
  return dau === 'dashboard' ? '/' : '/' + sach;
}
