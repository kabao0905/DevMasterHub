const box = document.getElementById('box');
document.getElementById('w').addEventListener('input', e => {
  box.style.width = e.target.value + 'px';
});
