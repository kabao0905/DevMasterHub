const { useState, useMemo, useCallback, memo, useRef } = React;

function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}

const ItemList = memo(function ItemList({ items, onSelect, selectedId }) {
  const renders = useRenderCount();
  return (
    <div className="panel stack">
      <p className="muted">ItemList đã render <b>{renders}</b> lần</p>
      <ul className="list">
        {items.slice(0, 50).map(item => (
          <li key={item.id} className={item.id === selectedId ? 'sel' : ''} onClick={() => onSelect(item.id)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
});

function Dashboard() {
  const [filter, setFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [dark, setDark] = useState(false);
  const [items] = useState(() =>
    Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `Sản phẩm ${i}`, category: i % 3 === 0 ? 'A' : 'B' }))
  );

  const filtered = useMemo(() => {
    const t0 = performance.now();
    const kq = items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
    console.log(`Lọc ${items.length} mục mất ${(performance.now() - t0).toFixed(2)}ms`);
    return kq;
  }, [items, filter]);

  const handleSelect = useCallback(id => setSelectedId(id), []);

  return (
    <main className={dark ? 'stack dark' : 'stack'}>
      <div className="row">
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Lọc 5000 sản phẩm..." />
        <button className="ghost" onClick={() => setDark(d => !d)}>Đổi nền (không ảnh hưởng danh sách)</button>
      </div>
      <p className="muted">{filtered.length} kết quả{selectedId !== null && ` · đang chọn #${selectedId}`}</p>
      <ItemList items={filtered} onSelect={handleSelect} selectedId={selectedId} />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Dashboard />);
