function Table({ columns, data, emptyText = 'Chưa có dữ liệu' }) {
  if (data.length === 0) return <p className="muted">{emptyText}</p>;
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => <th key={col.key}>{col.title}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Card({ title, children, footer }) {
  return (
    <section className="panel stack">
      <h2>{title}</h2>
      {children}
      {footer && <footer className="muted">{footer}</footer>}
    </section>
  );
}

const users = [
  { id: 'u1', name: 'Nguyễn An', role: 'Admin', joined: '2025-03-02', active: true },
  { id: 'u2', name: 'Trần Bình', role: 'Editor', joined: '2025-11-18', active: false },
  { id: 'u3', name: 'Lê Chi', role: 'Viewer', joined: '2026-06-09', active: true },
];

const columns = [
  { key: 'name', title: 'Tên' },
  { key: 'role', title: 'Vai trò' },
  { key: 'joined', title: 'Tham gia', render: v => new Date(v).toLocaleDateString('vi-VN') },
  { key: 'active', title: 'Trạng thái', render: v => <span className={v ? 'on' : 'off'}>{v ? 'Hoạt động' : 'Tạm khoá'}</span> },
];

function App() {
  return (
    <>
      <Card title={`Người dùng (${users.length})`} footer="Mỗi hàng có key = id để React theo dõi đúng phần tử.">
        <Table columns={columns} data={users} />
      </Card>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
