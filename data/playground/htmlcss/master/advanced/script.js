const tiles = document.getElementById('tiles');

document.getElementById('swap').addEventListener('click', () => {
  const doi = () => tiles.classList.toggle('doc');
  if (document.startViewTransition) document.startViewTransition(doi);
  else doi();
});

const thieu = [];
if (!CSS.supports('animation-timeline: view()')) thieu.push('scroll-driven animation');
if (!HTMLElement.prototype.hasOwnProperty('popover')) thieu.push('Popover API');
if (!document.startViewTransition) thieu.push('View Transitions');
document.getElementById('note').textContent = thieu.length
  ? 'Trình duyệt này chưa hỗ trợ: ' + thieu.join(', ') + '. Hãy thử trên Chrome hoặc Edge mới nhất.'
  : 'Trình duyệt của bạn hỗ trợ đủ cả 4 tính năng.';
