const { useState, useEffect } = React;

const POSTS = [
  { id: 1, title: 'Server Components là gì?', excerpt: 'Component chạy trên server, gửi HTML về, không gửi JS.' },
  { id: 2, title: 'ISR: tái tạo trang theo giờ', excerpt: 'revalidate: 3600 — trang tĩnh được làm mới mỗi giờ.' },
  { id: 3, title: 'Server Actions', excerpt: 'Gọi hàm trên server ngay từ form, không cần viết API.' },
];

function fetchPostsOnServer() {
  return new Promise(resolve => setTimeout(() => resolve(POSTS), 600));
}

function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button className="like" onClick={() => setLikes(l => l + 1)}>
      ♥ {likes} <small>Client Component</small>
    </button>
  );
}

function HomePage() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPostsOnServer().then(setPosts);
  }, []);

  return (
    <main className="stack">
      <div className="note">
        Next.js chạy trên server nên không chạy được trong khung này. Bản mô phỏng: phần
        <span className="srv"> xanh</span> giả lập Server Component (dữ liệu tải sẵn), phần
        <span className="cli"> cam</span> là Client Component có tương tác.
      </div>
      <section className="server stack">
        <h1>Blog</h1>
        {posts === null && <p className="muted">Server đang tải bài viết...</p>}
        {posts?.map(post => (
          <article key={post.id} className="post">
            <h2>{post.title}</h2>
            <p className="muted">{post.excerpt}</p>
            <LikeButton />
          </article>
        ))}
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HomePage />);
