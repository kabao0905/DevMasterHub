const { MemoryRouter, Routes, Route, NavLink, Link, Navigate, Outlet, useParams, useNavigate, useLocation } = ReactRouterDOM;
const { useState } = React;

const users = [
  { id: '1', name: 'Nguyễn An', role: 'Frontend' },
  { id: '2', name: 'Trần Bình', role: 'Backend' },
];

function Layout({ isAuth, onLogout }) {
  const location = useLocation();
  return (
    <div className="stack">
      <nav className="nav">
        <NavLink to="/" end>Trang chủ</NavLink>
        <NavLink to="/users">Người dùng</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        {isAuth && <button className="ghost" onClick={onLogout}>Đăng xuất</button>}
      </nav>
      <code className="url">URL: {location.pathname}</code>
      <div className="panel"><Outlet /></div>
    </div>
  );
}

function Home() {
  return <><h2>Trang chủ</h2><p className="muted">Bấm các link phía trên: trang đổi mà không tải lại.</p></>;
}

function UserList() {
  return (
    <>
      <h2>Người dùng</h2>
      <ul>{users.map(u => <li key={u.id}><Link to={`/users/${u.id}`}>{u.name}</Link></li>)}</ul>
    </>
  );
}

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find(u => u.id === id);
  if (!user) return <p>Không tìm thấy người dùng {id}</p>;
  return (
    <>
      <h2>{user.name}</h2>
      <p className="muted">Vị trí: {user.role} · id lấy từ useParams() = {id}</p>
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </>
  );
}

function ProtectedRoute({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

function Login({ onLogin }) {
  const navigate = useNavigate();
  return (
    <>
      <h2>Cần đăng nhập</h2>
      <p className="muted">Dashboard là route được bảo vệ.</p>
      <button onClick={() => { onLogin(); navigate('/dashboard'); }}>Đăng nhập</button>
    </>
  );
}

function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<Layout isAuth={isAuth} onLogout={() => setIsAuth(false)} />}>
          <Route index element={<Home />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="login" element={<Login onLogin={() => setIsAuth(true)} />} />
          <Route path="dashboard" element={<ProtectedRoute isAuth={isAuth}><h2>Dashboard bí mật</h2></ProtectedRoute>} />
          <Route path="*" element={<h2>404 — Không có trang này</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
