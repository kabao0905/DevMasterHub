const demo = document.getElementById('demo');
const out = document.getElementById('css-out');
const chon = ['justify', 'align', 'direction'].map(id => document.getElementById(id));

function capNhat() {
  const [justify, align, direction] = chon.map(s => s.value);
  demo.style.justifyContent = justify;
  demo.style.alignItems = align;
  demo.style.flexDirection = direction;
  out.textContent = `.demo {\n  display: flex;\n  flex-direction: ${direction};\n  justify-content: ${justify};\n  align-items: ${align};\n}`;
}

chon.forEach(s => s.addEventListener('change', capNhat));
capNhat();
