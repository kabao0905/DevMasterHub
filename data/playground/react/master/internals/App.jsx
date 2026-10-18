const { useState, useRef, useEffect, memo } = React;

const ROW_HEIGHT = 32;
const TOTAL = 100000;

function VirtualList({ count, height, renderRow }) {
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 5);
  const visible = Math.ceil(height / ROW_HEIGHT) + 10;
  const end = Math.min(count, start + visible);

  const rows = [];
  for (let i = start; i < end; i++) {
    rows.push(
      <div key={i} className="vrow" style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}>
        {renderRow(i)}
      </div>
    );
  }

  return (
    <div className="viewport" style={{ height }} onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: count * ROW_HEIGHT, position: 'relative' }}>{rows}</div>
      <p className="badge">DOM chỉ có {end - start} / {count.toLocaleString('vi-VN')} hàng</p>
    </div>
  );
}

function RenderTracker({ name, children }) {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="tracker">
      <small>{name} · render {renders.current} lần</small>
      {children}
    </div>
  );
}

const MemoChild = memo(function MemoChild() {
  return <RenderTracker name="Con có React.memo" />;
});

function App() {
  const [count, setCount] = useState(0);
  return (
    <main className="stack">
      <section className="panel stack">
        <h2>Quy tắc re-render</h2>
        <button onClick={() => setCount(c => c + 1)}>State của cha: {count}</button>
        <RenderTracker name="Cha">
          <RenderTracker name="Con thường (render theo cha)" />
          <MemoChild />
        </RenderTracker>
      </section>
      <section className="panel stack">
        <h2>Virtual scrolling 100.000 hàng</h2>
        <VirtualList count={TOTAL} height={220} renderRow={i => <span>Hàng #{i + 1}</span>} />
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
