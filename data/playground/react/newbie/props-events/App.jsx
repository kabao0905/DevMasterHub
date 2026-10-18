const { useState } = React;

const KHOA_HOC = [
  { id: 1, ten: 'HTML & CSS', cap: 'Newbie' },
  { id: 2, ten: 'JavaScript ES6+', cap: 'Newbie' },
  { id: 3, ten: 'React Hooks', cap: 'Junior' },
  { id: 4, ten: 'TypeScript', cap: 'Junior' },
  { id: 5, ten: 'Next.js App Router', cap: 'Mid' },
];

function SearchBar({ query, onQueryChange, onlyNewbie, onToggle }) {
  return (
    <div className="row">
      <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Tìm khoá học..." />
      <label className="row">
        <input type="checkbox" checked={onlyNewbie} onChange={e => onToggle(e.target.checked)} />
        Chỉ cấp Newbie
      </label>
    </div>
  );
}

function CourseItem({ course, saved, onSave }) {
  return (
    <li className="item">
      <span>{course.ten}</span>
      <span className="level">{course.cap}</span>
      <button className={saved ? 'ghost' : ''} onClick={() => onSave(course.id)}>
        {saved ? 'Đã lưu' : 'Lưu'}
      </button>
    </li>
  );
}

function FilterableList() {
  const [query, setQuery] = useState('');
  const [onlyNewbie, setOnlyNewbie] = useState(false);
  const [saved, setSaved] = useState([]);

  const ketQua = KHOA_HOC.filter(c =>
    c.ten.toLowerCase().includes(query.toLowerCase()) && (!onlyNewbie || c.cap === 'Newbie')
  );

  const toggleSave = id => setSaved(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  return (
    <main className="panel stack">
      <h1>Tìm khoá học</h1>
      <SearchBar query={query} onQueryChange={setQuery} onlyNewbie={onlyNewbie} onToggle={setOnlyNewbie} />
      {ketQua.length === 0 ? (
        <p className="muted">Không có khoá học nào khớp "{query}".</p>
      ) : (
        <ul className="list">
          {ketQua.map(c => (
            <CourseItem key={c.id} course={c} saved={saved.includes(c.id)} onSave={toggleSave} />
          ))}
        </ul>
      )}
      {saved.length > 0 && <p className="muted">Đã lưu {saved.length} khoá học.</p>}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FilterableList />);
