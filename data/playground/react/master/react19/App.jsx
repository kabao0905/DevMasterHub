const { useState, useTransition, useRef } = React;

function saveTodoOnServer(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text.toLowerCase().includes('lỗi')) reject(new Error('Server từ chối'));
      else resolve({ id: Date.now(), text });
    }, 1200);
  });
}

function useOptimisticList(list) {
  const [pending, setPending] = useState([]);
  const add = item => setPending(p => [...p, item]);
  const remove = id => setPending(p => p.filter(i => i.id !== id));
  return [[...list, ...pending], add, remove];
}

function App() {
  const [todos, setTodos] = useState([{ id: 1, text: 'Đọc changelog React 19' }]);
  const [optimisticTodos, addOptimistic, removeOptimistic] = useOptimisticList(todos);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = inputRef.current.value.trim();
    if (!text) return;
    inputRef.current.value = '';
    setError('');
    const temp = { id: 'tam-' + Date.now(), text, sending: true };
    addOptimistic(temp);
    try {
      const saved = await saveTodoOnServer(text);
      startTransition(() => setTodos(t => [...t, saved]));
    } catch (err) {
      setError(`"${text}": ${err.message}, đã hoàn tác.`);
    } finally {
      removeOptimistic(temp.id);
    }
  }

  return (
    <main className="panel stack">
      <h2>Optimistic UI</h2>
      <p className="muted">
        Việc mới hiện ngay lập tức (mờ) trong khi chờ server, giống <code>useOptimistic</code> của React 19.
        Khung chạy này dùng React 18.3 nên hành vi được dựng lại bằng useState + useTransition.
        Gõ chữ "lỗi" để xem cách hoàn tác.
      </p>
      <form className="row" onSubmit={handleSubmit}>
        <input ref={inputRef} placeholder="Việc cần làm..." />
        <button>Thêm</button>
        {isPending && <span className="muted">Đang cập nhật...</span>}
      </form>
      {error && <p className="err">{error}</p>}
      <ul className="todos">
        {optimisticTodos.map(t => (
          <li key={t.id} className={t.sending ? 'sending' : ''}>{t.text}{t.sending && <small> · đang lưu</small>}</li>
        ))}
      </ul>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
