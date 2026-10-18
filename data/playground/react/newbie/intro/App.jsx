function Card({ image, title, description, tag = 'Mới' }) {
  return (
    <article className="card">
      <div className="card-image" style={{ background: image }}>
        <span className="tag">{tag}</span>
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

function App() {
  return (
    <main className="stack">
      <h1>Khoá học nổi bật</h1>
      <p className="muted">Mỗi thẻ là một component Card dùng lại với props khác nhau.</p>
      <div className="grid">
        <Card
          image="linear-gradient(135deg, #38bdf8, #6366f1)"
          title="React cơ bản"
          description="JSX, component và props trong 2 giờ."
        />
        <Card
          image="linear-gradient(135deg, #f472b6, #fb923c)"
          title="Hooks thực chiến"
          description="useState, useEffect qua 5 dự án nhỏ."
          tag="Hot"
        />
        <Card
          image="linear-gradient(135deg, #34d399, #0ea5e9)"
          title="React + API"
          description="Gọi API, xử lý loading và lỗi."
        />
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
