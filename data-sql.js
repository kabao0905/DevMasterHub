// SQL & NoSQL Full Curriculum
const DATA_SQL = {
id:'sql', name:'SQL & NoSQL', icon:'🗄️', color:'#336791',
gradient:'linear-gradient(135deg,#336791,#F29111)',
category:'backend',
description:'Relational databases, NoSQL, query optimization, data modeling',
levels:[
  {id:'newbie',name:'Newbie',badge:'newbie',desc:'SQL cơ bản & CRUD',lessons:[
    {id:'crud',title:'SELECT, INSERT, UPDATE, DELETE',
     theory:'<p>SQL (Structured Query Language) quản lý relational databases. <strong>CRUD</strong>: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Mỗi table có columns (fields) và rows (records).</p>',
     code:'-- Create table\nCREATE TABLE students (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  name TEXT NOT NULL,\n  email TEXT UNIQUE,\n  gpa REAL DEFAULT 0.0,\n  major TEXT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- INSERT\nINSERT INTO students (name, email, gpa, major)\nVALUES (\'An\', \'an@mail.com\', 8.5, \'CS\');\n\n-- SELECT with conditions\nSELECT name, gpa FROM students\nWHERE major = \'CS\' AND gpa >= 8.0\nORDER BY gpa DESC\nLIMIT 10;\n\n-- UPDATE\nUPDATE students SET gpa = 9.0 WHERE email = \'an@mail.com\';\n\n-- DELETE\nDELETE FROM students WHERE gpa < 5.0;',
     lang:'sql',
     keyPoints:['PRIMARY KEY unique identifier cho mỗi row','NOT NULL, UNIQUE, DEFAULT constraints bảo vệ data','WHERE filter rows, ORDER BY sắp xếp, LIMIT giới hạn'],
     exercise:'Tạo database quản lý thư viện: books, authors, borrowings.'},

    {id:'filtering',title:'WHERE, Operators & Functions',
     theory:'<p>WHERE dùng operators: <code>=, <>, <, >, BETWEEN, IN, LIKE, IS NULL</code>. Built-in functions: <code>COUNT, SUM, AVG, MAX, MIN, UPPER, LOWER, LENGTH</code>.</p>',
     code:'-- Operators\nSELECT * FROM products\nWHERE price BETWEEN 10 AND 50\n  AND category IN (\'Electronics\', \'Books\')\n  AND name LIKE \'%phone%\'\n  AND discount IS NOT NULL;\n\n-- Aggregate functions\nSELECT\n  category,\n  COUNT(*) as total,\n  AVG(price) as avg_price,\n  MAX(price) as max_price,\n  SUM(price * quantity) as revenue\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 5\nORDER BY revenue DESC;\n\n-- String & Date functions\nSELECT\n  UPPER(name) as upper_name,\n  LENGTH(name) as name_length,\n  DATE(created_at) as date_only,\n  strftime(\'%Y-%m\', created_at) as month\nFROM products;',
     lang:'sql',
     keyPoints:['BETWEEN, IN, LIKE (% = any chars, _ = 1 char)','GROUP BY + aggregate cho statistics theo nhóm','HAVING filter sau GROUP BY (WHERE filter trước)'],
     exercise:'Viết queries thống kê doanh thu theo tháng, category.'},

    {id:'data-types',title:'Kiểu dữ liệu & Constraints',
     theory:'<p>Chọn kiểu dữ liệu phù hợp: <code>INTEGER, TEXT, REAL, BLOB, BOOLEAN, DATE, TIMESTAMP</code>. Constraints đảm bảo data integrity: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL.</p>',
     code:'-- Well-designed table with constraints\nCREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  customer_id INTEGER NOT NULL REFERENCES customers(id),\n  status TEXT NOT NULL DEFAULT \'pending\'\n    CHECK (status IN (\'pending\', \'confirmed\', \'shipped\', \'delivered\')),\n  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),\n  notes TEXT,\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE order_items (\n  id SERIAL PRIMARY KEY,\n  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,\n  product_id INTEGER NOT NULL REFERENCES products(id),\n  quantity INTEGER NOT NULL CHECK (quantity > 0),\n  price DECIMAL(10,2) NOT NULL,\n  UNIQUE(order_id, product_id) -- no duplicate items\n);\n\n-- Index for performance\nCREATE INDEX idx_orders_customer ON orders(customer_id);\nCREATE INDEX idx_orders_status ON orders(status, created_at);',
     lang:'sql',
     keyPoints:['FOREIGN KEY REFERENCES tạo relationship giữa tables','CHECK constraint validate data tại DB level','ON DELETE CASCADE tự xóa child rows khi parent bị xóa'],
     exercise:'Thiết kế schema cho e-commerce: users, products, orders, reviews.'}
  ]},

  {id:'junior',name:'Junior',badge:'junior',desc:'JOINs & Advanced Queries',lessons:[
    {id:'joins',title:'JOINs & Relationships',
     theory:'<p><strong>JOIN</strong> kết hợp data từ nhiều tables. <code>INNER JOIN</code>: chỉ matching rows. <code>LEFT JOIN</code>: tất cả rows bên trái. <code>RIGHT JOIN</code>: tất cả rows bên phải.</p>',
     code:'-- INNER JOIN\nSELECT o.id, c.name, o.total, o.status\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nWHERE o.status = \'shipped\';\n\n-- LEFT JOIN (include customers with no orders)\nSELECT c.name, COUNT(o.id) as order_count,\n       COALESCE(SUM(o.total), 0) as total_spent\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name\nORDER BY total_spent DESC;\n\n-- Multiple JOINs\nSELECT o.id, c.name,\n       p.name as product, oi.quantity, oi.price\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id\nWHERE o.created_at >= \'2025-01-01\'\nORDER BY o.id;',
     lang:'sql',
     keyPoints:['INNER JOIN: chỉ rows có match ở cả 2 tables','LEFT JOIN: tất cả rows table trái, NULL nếu không match','COALESCE(val, default) thay NULL bằng default value'],
     exercise:'Viết report JOIN 4 tables: users, orders, products, categories.'},

    {id:'subqueries',title:'Subqueries & CTEs',
     theory:'<p><strong>Subquery</strong> là query lồng trong query khác. <strong>CTE</strong> (Common Table Expression) với <code>WITH</code> cho readable subqueries. Window functions cho analytics.</p>',
     code:'-- Subquery in WHERE\nSELECT name, gpa FROM students\nWHERE gpa > (SELECT AVG(gpa) FROM students);\n\n-- CTE (Common Table Expression)\nWITH monthly_sales AS (\n  SELECT\n    DATE_TRUNC(\'month\', created_at) as month,\n    SUM(total) as revenue,\n    COUNT(*) as order_count\n  FROM orders\n  WHERE status = \'delivered\'\n  GROUP BY 1\n),\nranked AS (\n  SELECT *,\n    LAG(revenue) OVER (ORDER BY month) as prev_revenue\n  FROM monthly_sales\n)\nSELECT\n  month,\n  revenue,\n  order_count,\n  ROUND((revenue - prev_revenue) / prev_revenue * 100, 1)\n    as growth_pct\nFROM ranked\nORDER BY month;\n\n-- Window functions\nSELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,\n  salary - AVG(salary) OVER (PARTITION BY department) as vs_avg\nFROM employees;',
     lang:'sql',
     keyPoints:['CTE (WITH ... AS) cho readable complex queries','Window: RANK(), ROW_NUMBER(), LAG(), LEAD() OVER()','PARTITION BY chia data thành groups cho window functions'],
     exercise:'Tạo dashboard SQL: top products, monthly growth, customer retention.'},

    {id:'nosql',title:'MongoDB & NoSQL Concepts',
     theory:'<p><strong>NoSQL</strong> databases: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j). MongoDB lưu JSON-like documents, schema flexible, horizontal scaling.</p>',
     code:'// MongoDB CRUD\n\n// Insert\ndb.users.insertOne({\n  name: "An",\n  email: "an@mail.com",\n  skills: ["Python", "JavaScript"],\n  address: { city: "HCMC", country: "VN" }\n});\n\n// Find with filters\ndb.users.find({\n  skills: { $in: ["Python"] },\n  "address.city": "HCMC"\n}).sort({ name: 1 }).limit(10);\n\n// Aggregation pipeline\ndb.orders.aggregate([\n  { $match: { status: "delivered" } },\n  { $group: {\n    _id: { $month: "$createdAt" },\n    totalRevenue: { $sum: "$total" },\n    avgOrder: { $avg: "$total" },\n    count: { $sum: 1 }\n  }},\n  { $sort: { _id: 1 } }\n]);\n\n// Update with operators\ndb.users.updateOne(\n  { email: "an@mail.com" },\n  {\n    $set: { name: "An Nguyen" },\n    $push: { skills: "React" },\n    $inc: { loginCount: 1 }\n  }\n);',
     lang:'javascript',
     keyPoints:['Document DB: flexible schema, nested objects, arrays','Aggregation pipeline: $match → $group → $sort → $project','$set update fields, $push add to array, $inc increment'],
     exercise:'Thiết kế MongoDB schema cho blog: posts, comments, tags, users.'}
  ]},

  {id:'mid',name:'Mid-Level',badge:'mid',desc:'Indexing, Transactions & Optimization',lessons:[
    {id:'indexing',title:'Indexing & Query Optimization',
     theory:'<p><strong>Index</strong> tăng tốc queries (B-tree). <code>EXPLAIN</code> phân tích query plan. Composite index, partial index, covering index. Index tốn storage và slow writes.</p>',
     code:'-- EXPLAIN query plan\nEXPLAIN ANALYZE\nSELECT * FROM orders\nWHERE customer_id = 42 AND status = \'delivered\';\n\n-- Single column index\nCREATE INDEX idx_orders_customer ON orders(customer_id);\n\n-- Composite index (order matters!)\nCREATE INDEX idx_orders_cust_status\n  ON orders(customer_id, status, created_at);\n\n-- Partial index (only matching rows)\nCREATE INDEX idx_active_orders\n  ON orders(customer_id)\n  WHERE status IN (\'pending\', \'confirmed\');\n\n-- Tips for optimization:\n-- 1. SELECT only needed columns (avoid SELECT *)\nSELECT id, name, email FROM users WHERE active = true;\n\n-- 2. Use EXISTS instead of IN for large subsets\nSELECT * FROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.id\n  AND o.created_at >= NOW() - INTERVAL \'30 days\'\n);\n\n-- 3. Avoid functions on indexed columns\n-- BAD:  WHERE YEAR(created_at) = 2025\n-- GOOD: WHERE created_at >= \'2025-01-01\'',
     lang:'sql',
     keyPoints:['EXPLAIN ANALYZE xem query plan và actual timing','Composite index: leftmost prefix rule, column order quan trọng','Partial index: index subset rows, nhỏ hơn và nhanh hơn'],
     exercise:'Optimize 3 slow queries dùng EXPLAIN + proper indexing.'},

    {id:'transactions',title:'Transactions & Data Integrity',
     theory:'<p><strong>ACID</strong>: Atomicity, Consistency, Isolation, Durability. Transaction đảm bảo multiple operations hoặc tất cả thành công hoặc tất cả rollback. Isolation levels kiểm soát concurrency.</p>',
     code:'-- Transaction\nBEGIN;\n  -- Deduct from sender\n  UPDATE accounts SET balance = balance - 1000\n  WHERE id = 1 AND balance >= 1000;\n\n  -- Credit receiver\n  UPDATE accounts SET balance = balance + 1000\n  WHERE id = 2;\n\n  -- Log transaction\n  INSERT INTO transfers (from_id, to_id, amount)\n  VALUES (1, 2, 1000);\n\n  -- Check if sender had enough\n  -- If not, rollback\nCOMMIT;\n\n-- Error handling\nBEGIN;\n  SAVEPOINT before_update;\n  UPDATE products SET stock = stock - 1 WHERE id = 42;\n  -- If error:\n  ROLLBACK TO before_update;\nCOMMIT;\n\n-- Isolation levels\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n-- READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE\n-- Trade-off: higher isolation = more consistency but less performance',
     lang:'sql',
     keyPoints:['BEGIN/COMMIT/ROLLBACK cho atomic operations','SAVEPOINT cho partial rollback trong transaction','Isolation levels: balance consistency vs performance'],
     exercise:'Implement safe money transfer với proper transaction handling.'},

    {id:'advanced-modeling',title:'Advanced Data Modeling',
     theory:'<p>Normalization (1NF → 3NF) giảm redundancy. Denormalization cho read performance. Nhiều patterns: soft delete, polymorphic associations, temporal data, audit logs.</p>',
     code:'-- Soft delete pattern\nALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;\nCREATE VIEW active_users AS\n  SELECT * FROM users WHERE deleted_at IS NULL;\n-- "Delete": UPDATE users SET deleted_at = NOW() WHERE id = 1;\n\n-- Audit log / History table\nCREATE TABLE user_changes (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  field_name TEXT NOT NULL,\n  old_value TEXT,\n  new_value TEXT,\n  changed_by INTEGER,\n  changed_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Polymorphic comments (commentable)\nCREATE TABLE comments (\n  id SERIAL PRIMARY KEY,\n  body TEXT NOT NULL,\n  commentable_type TEXT NOT NULL, -- \'post\', \'product\', \'video\'\n  commentable_id INTEGER NOT NULL,\n  user_id INTEGER REFERENCES users(id),\n  created_at TIMESTAMP DEFAULT NOW()\n);\nCREATE INDEX idx_comments_target\n  ON comments(commentable_type, commentable_id);\n\n-- Full-text search\nALTER TABLE products ADD COLUMN search_vector tsvector;\nCREATE INDEX idx_products_search ON products USING gin(search_vector);\nSELECT * FROM products\nWHERE search_vector @@ to_tsquery(\'phone & samsung\');',
     lang:'sql',
     keyPoints:['Soft delete: set deleted_at thay vì DELETE thực sự','Audit logs: track mọi thay đổi cho compliance','Polymorphic: commentable_type + commentable_id cho flexibility'],
     exercise:'Thiết kế schema cho social network: users, posts, comments, likes, follows.'}
  ]},

  {id:'senior',name:'Senior',badge:'senior',desc:'Performance & Distributed',lessons:[
    {id:'query-perf',title:'Advanced Query Optimization',
     theory:'<p>Materialized views cache expensive queries. Stored procedures run server-side. Connection pooling. Query hints. Pagination strategies: OFFSET vs cursor-based.</p>',
     code:'-- Materialized view\nCREATE MATERIALIZED VIEW mv_monthly_sales AS\nSELECT\n  DATE_TRUNC(\'month\', o.created_at) as month,\n  p.category,\n  SUM(oi.quantity * oi.price) as revenue,\n  COUNT(DISTINCT o.id) as orders\nFROM orders o\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id\nGROUP BY 1, 2;\n\n-- Refresh periodically\nREFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_sales;\n\n-- Cursor-based pagination (efficient)\nSELECT id, name, created_at FROM products\nWHERE created_at < \'2025-06-01T00:00:00\'\n  AND id < 1000\nORDER BY created_at DESC, id DESC\nLIMIT 20;\n-- vs OFFSET pagination (slow for large offsets)\n-- SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 10000;\n\n-- Stored procedure\nCREATE OR REPLACE FUNCTION get_user_stats(user_id INTEGER)\nRETURNS TABLE(total_orders INT, total_spent DECIMAL, avg_order DECIMAL)\nAS $$\nBEGIN\n  RETURN QUERY\n  SELECT COUNT(*)::INT, SUM(total), AVG(total)\n  FROM orders WHERE customer_id = user_id;\nEND;\n$$ LANGUAGE plpgsql;',
     lang:'sql',
     keyPoints:['Materialized view: cache complex queries, refresh manually','Cursor pagination: WHERE id < last_id thay OFFSET (O(1) vs O(n))','Stored procedures: logic server-side, giảm network roundtrips'],
     exercise:'Optimize dashboard queries: materialized views + cursor pagination.'},

    {id:'distributed',title:'Distributed Databases & CAP',
     theory:'<p><strong>CAP theorem</strong>: Consistency, Availability, Partition tolerance — chọn 2/3. Sharding chia data theo key. Replication cho high availability. Read replicas cho scaling reads.</p>',
     code:'-- Sharding strategy example (conceptual)\n-- Shard by user_id hash:\n-- shard_0: user_id % 4 == 0\n-- shard_1: user_id % 4 == 1\n-- shard_2: user_id % 4 == 2\n-- shard_3: user_id % 4 == 3\n\n-- PostgreSQL partitioning (built-in sharding)\nCREATE TABLE events (\n  id BIGSERIAL,\n  event_type TEXT,\n  payload JSONB,\n  created_at TIMESTAMP NOT NULL\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE events_2025_q1\n  PARTITION OF events\n  FOR VALUES FROM (\'2025-01-01\') TO (\'2025-04-01\');\n\nCREATE TABLE events_2025_q2\n  PARTITION OF events\n  FOR VALUES FROM (\'2025-04-01\') TO (\'2025-07-01\');\n\n-- Read replica routing (app level)\n-- const readDB = new Pool({ host: "read-replica.db.com" });\n-- const writeDB = new Pool({ host: "primary.db.com" });\n-- Reads → readDB, Writes → writeDB\n\n-- Redis caching layer\n-- 1. Check Redis cache\n-- 2. If miss → query DB\n-- 3. Store in Redis with TTL\n-- 4. Invalidate on write',
     lang:'sql',
     keyPoints:['CAP: CP (PostgreSQL), AP (Cassandra, DynamoDB)','Partitioning: chia table lớn thành pieces nhỏ hơn','Read replicas: scale reads horizontally, writes vẫn primary'],
     exercise:'Thiết kế distributed database cho app 10M users: sharding, caching, replicas.'}
  ]},

  {id:'master',name:'Master',badge:'master',desc:'Database Architecture & Internals',lessons:[
    {id:'internals',title:'Database Internals & Storage',
     theory:'<p>Hiểu B-tree index structure, WAL (Write-Ahead Logging), MVCC (Multi-Version Concurrency Control). Storage engines: InnoDB vs MyISAM, LSM trees. Query planner optimization.</p>',
     code:'-- B-tree index internals\n-- Balanced tree: O(log n) lookup\n-- Leaf nodes chứa pointers đến actual rows\n-- Non-leaf nodes chứa keys để navigate\n\n-- MVCC in PostgreSQL\n-- Each row has xmin (created by txn) and xmax (deleted by txn)\n-- Concurrent reads see consistent snapshot\n-- No read locks needed!\n\n-- WAL (Write-Ahead Logging)\n-- 1. Write to WAL (sequential, fast)\n-- 2. Acknowledge write to client\n-- 3. Eventually flush to data files\n-- Crash recovery: replay WAL\n\n-- Query planner analysis\nEXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)\nSELECT u.name, COUNT(o.id)\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 10;\n\n-- Result: shows node types, rows estimated vs actual,\n-- buffer hits (cache), reads (disk), timing\n\n-- Connection pool sizing (HikariCP formula)\n-- pool_size = num_cores * 2 + effective_spindle_count\n-- For SSD: pool_size = cpu_cores * 2 + 1',
     lang:'sql',
     keyPoints:['B-tree: O(log n) lookup, O(n log n) build','MVCC: multiple versions per row, no read locks','WAL: write-ahead logging cho durability + performance'],
     exercise:'Phân tích query plan phức tạp và tối ưu từ 5s xuống <100ms.'}
  ]}
]
};
