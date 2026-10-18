const form = document.getElementById('form');
const email = document.getElementById('email');
const loi = document.getElementById('email-error');
const trangThai = document.getElementById('status');
const gioHang = document.getElementById('cart-btn');

form.addEventListener('submit', e => {
  e.preventDefault();
  trangThai.textContent = '';
  if (!email.validity.valid) {
    email.setAttribute('aria-invalid', 'true');
    loi.textContent = email.validity.valueMissing ? 'Vui lòng nhập email.' : 'Email chưa đúng định dạng, ví dụ: ban@vidu.com';
    email.focus();
    return;
  }
  email.setAttribute('aria-invalid', 'false');
  loi.textContent = '';
  trangThai.textContent = 'Đăng ký thành công! Kiểm tra hộp thư của bạn.';
});

gioHang.addEventListener('click', () => {
  const mo = gioHang.getAttribute('aria-expanded') === 'true';
  gioHang.setAttribute('aria-expanded', String(!mo));
  console.log('Giỏ hàng', mo ? 'đóng' : 'mở');
});
