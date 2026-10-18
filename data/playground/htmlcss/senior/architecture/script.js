const goc = document.documentElement;

document.getElementById('theme').addEventListener('click', () => {
  const moi = goc.dataset.theme === 'dark' ? 'light' : 'dark';
  goc.dataset.theme = moi;
  console.log('data-theme =', moi);
});
