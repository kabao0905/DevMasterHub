document.getElementById('toggle').addEventListener('click', () => {
  const toi = document.documentElement.classList.toggle('dark');
  console.log('class="dark" trên <html>:', toi);
});
