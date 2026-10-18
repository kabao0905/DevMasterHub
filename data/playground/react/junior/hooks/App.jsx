const { useState, useEffect } = React;

function fakeApi(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('Máy chủ không phản hồi (503)'));
      else resolve([
        { id: 1, name: 'Nguyễn An', city: 'Hà Nội' },
        { id: 2, name: 'Trần Bình', city: 'Đà Nẵng' },
        { id: 3, name: 'Lê Chi', city: 'TP.HCM' },
      ]);
    }, 900);
  });
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  return (
    <section className="panel stack">
      <h2>Đồng hồ: {seconds}s</h2>
      <div className="row">
        <button onClick={() => setIsRunning(r => !r)}>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</button>
        <button className="ghost" onClick={() => { setSeconds(0); setIsRunning(false); }}>Đặt lại</button>
      </div>
    </section>
  );
}

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [simulateError, setSimulateError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fakeApi(simulateError)
      .then(data => { if (!cancelled) setUsers(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);

  return (
    <section className="panel stack">
      <h2>Danh sách người dùng</h2>
      <div className="row">
        <label className="row"><input type="checkbox" checked={simulateError} onChange={e => setSimulateError(e.target.checked)} /> Giả lập máy chủ lỗi</label>
        <button className="ghost" onClick={() => setAttempt(a => a + 1)}>Tải lại</button>
      </div>
      {loading && <p className="muted">Đang tải...</p>}
      {error && (
        <div className="error">
          {error}
          <button onClick={() => setAttempt(a => a + 1)}>Thử lại</button>
        </div>
      )}
      {!loading && !error && (
        <ul>{users.map(u => <li key={u.id}>{u.name} · {u.city}</li>)}</ul>
      )}
    </section>
  );
}

function App() {
  return (
    <main className="stack">
      <Timer />
      <UserList />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
