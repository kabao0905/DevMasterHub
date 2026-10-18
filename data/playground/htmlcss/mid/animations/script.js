const cards = document.getElementById('cards');

document.getElementById('replay').addEventListener('click', () => {
  cards.querySelectorAll('.card').forEach(card => {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = '';
  });
});
