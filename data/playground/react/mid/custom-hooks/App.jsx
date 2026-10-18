const { useState, useEffect, useRef } = React;

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = e => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

function useOnScreen(options) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), options);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

const TU_KHOA = ['react', 'redux', 'router', 'remix', 'vite', 'vitest', 'vue', 'svelte', 'solid', 'angular'];

function App() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query);
  const isNarrow = useMediaQuery('(max-width: 600px)');
  const [boxRef, boxVisible] = useOnScreen({ threshold: 0.6 });

  return (
    <main className="stack">
      <section className="panel stack">
        <h2>useDebounce</h2>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Gõ nhanh: re..." />
        <p className="muted">Đang gõ: "{query}" · Đã debounce: "{debounced}"</p>
        <div className="row">
          {TU_KHOA.filter(k => debounced && k.includes(debounced.toLowerCase())).map(k => <span key={k} className="chip">{k}</span>)}
        </div>
      </section>

      <section className="panel">
        <h2>useMediaQuery</h2>
        <p className="muted">Bấm nút Mobile phía trên khung xem trước: {isNarrow ? 'màn hẹp (≤ 600px)' : 'màn rộng (> 600px)'}</p>
      </section>

      <section className="panel stack">
        <h2>useOnScreen</h2>
        <div className="scroller">
          <p className="muted">Cuộn khung này xuống...</p>
          <div className="spacer" />
          <div ref={boxRef} className={boxVisible ? 'target seen' : 'target'}>
            {boxVisible ? 'Đã thấy trên màn hình!' : 'Chưa thấy'}
          </div>
          <div className="spacer" />
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
