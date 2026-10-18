const worklet = `
class DotPattern {
  static get inputProperties() {
    return ['--dot-color', '--dot-size', '--dot-spacing'];
  }

  paint(ctx, size, props) {
    const color = props.get('--dot-color').toString();
    const dot = parseFloat(props.get('--dot-size')) || 3;
    const gap = parseFloat(props.get('--dot-spacing')) || 20;
    ctx.fillStyle = color;
    for (let x = gap / 2; x < size.width; x += gap) {
      for (let y = gap / 2; y < size.height; y += gap) {
        ctx.beginPath();
        ctx.arc(x, y, dot, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
registerPaint('dots', DotPattern);
`;

const box = document.getElementById('box');
const status = document.getElementById('status');

if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule('data:text/javascript,' + encodeURIComponent(worklet))
    .then(() => {
      box.classList.add('houdini');
      status.textContent = 'Đang vẽ bằng paint worklet.';
    })
    .catch(e => { status.textContent = 'Không nạp được worklet: ' + e.message; });
} else {
  status.textContent = 'Trình duyệt này chưa hỗ trợ CSS Paint API, đang dùng nền radial-gradient thay thế. Hãy thử trên Chrome hoặc Edge.';
}

const dat = (ten, gt) => box.style.setProperty(ten, gt);
document.getElementById('size').addEventListener('input', e => dat('--dot-size', e.target.value));
document.getElementById('spacing').addEventListener('input', e => dat('--dot-spacing', e.target.value));
document.getElementById('color').addEventListener('input', e => dat('--dot-color', e.target.value));
