const modal = document.getElementById('modal');
const toasts = document.getElementById('toasts');

document.getElementById('open-modal').addEventListener('click', () => modal.showModal());

document.getElementById('toast-btn').addEventListener('click', () => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Đã lưu thay đổi';
  toasts.append(toast);
  setTimeout(() => toast.remove(), 2500);
});
