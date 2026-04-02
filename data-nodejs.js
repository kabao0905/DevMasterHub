// Node.js Full Curriculum
const DATA_NODEJS = {
id:'nodejs', name:'Node.js', icon:'🟢', color:'#339933',
gradient:'linear-gradient(135deg,#339933,#68A063)',
category:'backend',
description:'JavaScript backend, REST APIs, real-time apps, microservices',
levels:[
  {id:'newbie',name:'Newbie',badge:'newbie',desc:'Node.js cơ bản',lessons:[
    {id:'intro',title:'Node.js & npm Basics',
     theory:'<p>Node.js chạy JavaScript ngoài browser. <code>npm</code> quản lý packages. <code>require()</code> / <code>import</code> để dùng modules. Node dùng <strong>event loop</strong> xử lý async (non-blocking I/O).</p>',
     code:'// ES Modules (package.json: "type": "module")\nimport os from "os";\nimport path from "path";\n\nconsole.log("Node version:", process.version);\nconsole.log("Platform:", os.platform());\nconsole.log("CPUs:", os.cpus().length);\n\n// npm init -y → tạo package.json\n// npm install express → cài package\n// npm install -D nodemon → dev dependency\n\n// Process args\nconst args = process.argv.slice(2);\nconsole.log("Arguments:", args);',
     lang:'javascript',
     keyPoints:['npm init tạo project, npm install cài packages','require() = CommonJS, import = ESM (modern)','process object: env, argv, exit, cwd'],
     exercise:'Tạo CLI tool nhận arguments và in ra thông tin hệ thống.'},

    {id:'fs-async',title:'File System & Async Patterns',
     theory:'<p>Node.js I/O là <strong>async by default</strong>. <code>fs/promises</code> cho async file operations. <code>async/await</code> viết async code như sync. Streams xử lý data lớn hiệu quả.</p>',
     code:'import { readFile, writeFile, readdir, stat } from "fs/promises";\nimport { createReadStream, createWriteStream } from "fs";\nimport path from "path";\n\n// Async file operations\nasync function analyzeDir(dirPath) {\n  const files = await readdir(dirPath);\n  const results = [];\n  \n  for (const file of files) {\n    const fullPath = path.join(dirPath, file);\n    const info = await stat(fullPath);\n    if (info.isFile()) {\n      results.push({\n        name: file,\n        size: info.size,\n        modified: info.mtime\n      });\n    }\n  }\n  return results.sort((a, b) => b.size - a.size);\n}\n\n// JSON read/write\nasync function saveConfig(data) {\n  await writeFile("config.json", JSON.stringify(data, null, 2));\n}\n\nasync function loadConfig() {\n  const raw = await readFile("config.json", "utf-8");\n  return JSON.parse(raw);\n}\n\n// Run\nconst files = await analyzeDir(".");\nconsole.table(files.slice(0, 5));',
     lang:'javascript',
     keyPoints:['fs/promises cho async file operations','async/await thay .then() chains','Streams: createReadStream cho file lớn (GB)'],
     exercise:'Viết script đọc tất cả .txt files trong folder và merge thành 1 file.'},

    {id:'http-basics',title:'HTTP Server cơ bản',
     theory:'<p>Module <code>http</code> tạo server không cần framework. Hiểu request/response cycle, status codes, headers, routing cơ bản trước khi dùng Express.</p>',
     code:'import http from "http";\nimport { readFile } from "fs/promises";\n\nconst server = http.createServer(async (req, res) => {\n  const { method, url } = req;\n  console.log(`${method} ${url}`);\n\n  // Simple router\n  if (url === "/" && method === "GET") {\n    res.writeHead(200, { "Content-Type": "text/html" });\n    res.end("<h1>Home Page</h1>");\n  }\n  else if (url === "/api/status" && method === "GET") {\n    res.writeHead(200, { "Content-Type": "application/json" });\n    res.end(JSON.stringify({\n      status: "ok",\n      uptime: process.uptime(),\n      memory: process.memoryUsage().heapUsed\n    }));\n  }\n  else if (url === "/api/echo" && method === "POST") {\n    let body = "";\n    req.on("data", chunk => body += chunk);\n    req.on("end", () => {\n      res.writeHead(200, { "Content-Type": "application/json" });\n      res.end(JSON.stringify({ echo: JSON.parse(body) }));\n    });\n  }\n  else {\n    res.writeHead(404);\n    res.end("Not Found");\n  }\n});\n\nserver.listen(3000, () => console.log("Server on :3000"));',
     lang:'javascript',
     keyPoints:['http.createServer tạo server cơ bản','req.on("data") đọc POST body theo chunks','res.writeHead(status, headers) trước res.end(body)'],
     exercise:'Tạo REST API CRUD cho todo list KHÔNG dùng framework.'}
  ]},

  {id:'junior',name:'Junior',badge:'junior',desc:'Express & REST API',lessons:[
    {id:'express',title:'Express.js Framework',
     theory:'<p><strong>Express</strong> là framework web phổ biến nhất Node.js. Middleware chain xử lý request tuần tự. Router tổ chức routes theo module. Error handling middleware bắt lỗi global.</p>',
     code:'import express from "express";\nconst app = express();\n\n// Middleware\napp.use(express.json());\napp.use((req, res, next) => {\n  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);\n  next();\n});\n\n// Routes\nlet todos = [];\nlet nextId = 1;\n\napp.get("/api/todos", (req, res) => {\n  const { done } = req.query;\n  let result = todos;\n  if (done !== undefined) {\n    result = todos.filter(t => t.done === (done === "true"));\n  }\n  res.json(result);\n});\n\napp.post("/api/todos", (req, res) => {\n  const todo = { id: nextId++, ...req.body, done: false };\n  todos.push(todo);\n  res.status(201).json(todo);\n});\n\napp.patch("/api/todos/:id", (req, res) => {\n  const todo = todos.find(t => t.id === +req.params.id);\n  if (!todo) return res.status(404).json({ error: "Not found" });\n  Object.assign(todo, req.body);\n  res.json(todo);\n});\n\n// Error handler\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: "Internal Server Error" });\n});\n\napp.listen(3000);',
     lang:'javascript',
     keyPoints:['Middleware: (req, res, next) => ... next() chuyển tiếp','req.params, req.query, req.body cho route/query/body data','Error middleware: 4 params (err, req, res, next)'],
     exercise:'Xây dựng REST API blog với Express: posts, comments, categories.'},

    {id:'auth-jwt',title:'Authentication với JWT',
     theory:'<p><strong>JWT</strong> (JSON Web Token) cho stateless authentication. Flow: Login → Server tạo JWT → Client gửi JWT trong header → Server verify. Middleware protect routes cần auth.</p>',
     code:'import jwt from "jsonwebtoken";\nimport bcrypt from "bcryptjs";\n\nconst SECRET = process.env.JWT_SECRET || "your-secret";\nconst users = [];\n\n// Register\napp.post("/api/auth/register", async (req, res) => {\n  const { email, password, name } = req.body;\n  const exists = users.find(u => u.email === email);\n  if (exists) return res.status(409).json({ error: "Email taken" });\n\n  const hash = await bcrypt.hash(password, 10);\n  const user = { id: users.length + 1, email, name, password: hash };\n  users.push(user);\n  res.status(201).json({ message: "Registered" });\n});\n\n// Login\napp.post("/api/auth/login", async (req, res) => {\n  const { email, password } = req.body;\n  const user = users.find(u => u.email === email);\n  if (!user || !(await bcrypt.compare(password, user.password))) {\n    return res.status(401).json({ error: "Invalid credentials" });\n  }\n  const token = jwt.sign({ id: user.id, email }, SECRET, { expiresIn: "24h" });\n  res.json({ token, user: { id: user.id, name: user.name } });\n});\n\n// Auth middleware\nfunction auth(req, res, next) {\n  const header = req.headers.authorization;\n  if (!header?.startsWith("Bearer ")) {\n    return res.status(401).json({ error: "No token" });\n  }\n  try {\n    req.user = jwt.verify(header.split(" ")[1], SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: "Invalid token" });\n  }\n}\n\n// Protected route\napp.get("/api/profile", auth, (req, res) => {\n  res.json({ user: req.user });\n});',
     lang:'javascript',
     keyPoints:['bcrypt.hash/compare cho password hashing (KHÔNG lưu plain text)','jwt.sign tạo token, jwt.verify kiểm tra','Authorization: Bearer <token> header pattern'],
     exercise:'Implement JWT auth với refresh token rotation.'},

    {id:'database',title:'Database: Prisma ORM',
     theory:'<p><strong>Prisma</strong> là modern ORM cho Node.js. Schema-first design, type-safe queries, auto migrations. Hỗ trợ PostgreSQL, MySQL, SQLite, MongoDB.</p>',
     code:'// prisma/schema.prisma\n// model User {\n//   id    Int    @id @default(autoincrement())\n//   email String @unique\n//   name  String\n//   posts Post[]\n// }\n// model Post {\n//   id       Int    @id @default(autoincrement())\n//   title    String\n//   content  String?\n//   author   User   @relation(fields: [authorId], references: [id])\n//   authorId Int\n// }\n\nimport { PrismaClient } from "@prisma/client";\nconst prisma = new PrismaClient();\n\n// CRUD Operations\nasync function main() {\n  // Create with relation\n  const user = await prisma.user.create({\n    data: {\n      email: "an@mail.com",\n      name: "An",\n      posts: {\n        create: [\n          { title: "First Post", content: "Hello!" },\n          { title: "Second Post" }\n        ]\n      }\n    },\n    include: { posts: true }\n  });\n\n  // Query with filtering\n  const users = await prisma.user.findMany({\n    where: { posts: { some: {} } },\n    include: { posts: { orderBy: { id: "desc" }, take: 5 } }\n  });\n\n  // Transaction\n  const [u, p] = await prisma.$transaction([\n    prisma.user.count(),\n    prisma.post.count()\n  ]);\n  console.log(`${u} users, ${p} posts`);\n}\n\nmain().finally(() => prisma.$disconnect());',
     lang:'javascript',
     keyPoints:['Schema-first: prisma/schema.prisma định nghĩa models','npx prisma migrate dev tạo + chạy migrations','Include: eager loading relations, select: chọn fields'],
     exercise:'Xây dựng API e-commerce với Prisma: products, orders, users.'}
  ]},

  {id:'mid',name:'Mid-Level',badge:'mid',desc:'Testing, Architecture & Middleware',lessons:[
    {id:'testing',title:'Testing Node.js Apps',
     theory:'<p>Testing pyramid: Unit → Integration → E2E. <strong>Jest</strong> hoặc <strong>Vitest</strong> cho unit tests. <code>supertest</code> test HTTP endpoints. Mock external services.</p>',
     code:'import { describe, it, expect, vi, beforeEach } from "vitest";\nimport request from "supertest";\nimport app from "./app.js";\n\n// Unit test\ndescribe("UserService", () => {\n  const mockRepo = { findById: vi.fn(), save: vi.fn() };\n  const service = new UserService(mockRepo);\n\n  it("should find user by id", async () => {\n    mockRepo.findById.mockResolvedValue({ id: 1, name: "An" });\n    const user = await service.findById(1);\n    expect(user.name).toBe("An");\n    expect(mockRepo.findById).toHaveBeenCalledWith(1);\n  });\n\n  it("should throw on not found", async () => {\n    mockRepo.findById.mockResolvedValue(null);\n    await expect(service.findById(999))\n      .rejects.toThrow("Not found");\n  });\n});\n\n// Integration test\ndescribe("POST /api/todos", () => {\n  it("should create todo", async () => {\n    const res = await request(app)\n      .post("/api/todos")\n      .send({ title: "Test todo" })\n      .expect(201);\n    \n    expect(res.body.title).toBe("Test todo");\n    expect(res.body.id).toBeDefined();\n  });\n\n  it("should validate required fields", async () => {\n    await request(app)\n      .post("/api/todos")\n      .send({})\n      .expect(400);\n  });\n});',
     lang:'javascript',
     keyPoints:['vi.fn() / jest.fn() cho mock functions','supertest(app) test HTTP endpoints không cần server','describe/it/expect structure cho readable tests'],
     exercise:'Viết tests cho auth API: register, login, protected routes.'},

    {id:'architecture',title:'Clean Architecture & Error Handling',
     theory:'<p>Tách code thành layers: <strong>Routes → Controllers → Services → Repositories</strong>. Central error handling. Validation middleware. Environment-based config.</p>',
     code:'// src/errors/AppError.js\nexport class AppError extends Error {\n  constructor(message, statusCode = 500) {\n    super(message);\n    this.statusCode = statusCode;\n    this.isOperational = true;\n  }\n}\nexport class NotFoundError extends AppError {\n  constructor(resource) { super(`${resource} not found`, 404); }\n}\nexport class ValidationError extends AppError {\n  constructor(msg) { super(msg, 400); }\n}\n\n// src/middleware/errorHandler.js\nexport function errorHandler(err, req, res, next) {\n  const status = err.statusCode || 500;\n  const message = err.isOperational ? err.message : "Internal Error";\n  \n  if (!err.isOperational) {\n    console.error("UNEXPECTED ERROR:", err);\n  }\n  \n  res.status(status).json({\n    error: { message, status },\n    ...(process.env.NODE_ENV === "development" && { stack: err.stack })\n  });\n}\n\n// src/services/userService.js\nexport class UserService {\n  constructor(userRepo) { this.repo = userRepo; }\n  \n  async findById(id) {\n    const user = await this.repo.findById(id);\n    if (!user) throw new NotFoundError("User");\n    return user;\n  }\n}',
     lang:'javascript',
     keyPoints:['AppError base class cho operational errors','Tách layers: route → controller → service → repository','process.env.NODE_ENV switch behavior dev/prod'],
     exercise:'Refactor flat Express app thành layered architecture.'},

    {id:'realtime',title:'Real-time: WebSocket & Socket.io',
     theory:'<p><strong>WebSocket</strong> cho two-way real-time communication. <code>Socket.io</code> thêm rooms, namespaces, auto-reconnect. Dùng cho chat, notifications, live data.</p>',
     code:'import { Server } from "socket.io";\nimport http from "http";\nimport express from "express";\n\nconst app = express();\nconst server = http.createServer(app);\nconst io = new Server(server, { cors: { origin: "*" } });\n\n// Chat rooms\nio.on("connection", (socket) => {\n  console.log("User connected:", socket.id);\n\n  socket.on("join-room", (room) => {\n    socket.join(room);\n    socket.to(room).emit("user-joined", {\n      user: socket.id,\n      message: `${socket.id} joined ${room}`\n    });\n  });\n\n  socket.on("chat-message", ({ room, message }) => {\n    io.to(room).emit("new-message", {\n      user: socket.id,\n      message,\n      timestamp: new Date()\n    });\n  });\n\n  socket.on("disconnect", () => {\n    console.log("User disconnected:", socket.id);\n  });\n});\n\nserver.listen(3000);',
     lang:'javascript',
     keyPoints:['socket.emit gửi đến 1 client, io.emit broadcast tất cả','socket.join(room) cho room-based messaging','socket.to(room).emit gửi đến room (trừ sender)'],
     exercise:'Xây dựng real-time chat app với rooms và typing indicators.'}
  ]},

  {id:'senior',name:'Senior',badge:'senior',desc:'Microservices & DevOps',lessons:[
    {id:'microservices',title:'Microservices Architecture',
     theory:'<p>Microservices: mỗi service làm 1 việc, communicate qua API hoặc message queue. <strong>Docker</strong> container hóa. <strong>Redis</strong> cho caching. <strong>RabbitMQ/Kafka</strong> cho async messaging.</p>',
     code:'// API Gateway pattern\nimport express from "express";\nimport { createProxyMiddleware } from "http-proxy-middleware";\n\nconst gateway = express();\n\n// Rate limiting\nimport rateLimit from "express-rate-limit";\ngateway.use(rateLimit({ windowMs: 60000, max: 100 }));\n\n// Route to microservices\ngateway.use("/api/users",\n  createProxyMiddleware({ target: "http://user-service:3001" }));\ngateway.use("/api/orders",\n  createProxyMiddleware({ target: "http://order-service:3002" }));\ngateway.use("/api/products",\n  createProxyMiddleware({ target: "http://product-service:3003" }));\n\n// Health check\ngateway.get("/health", (req, res) => {\n  res.json({ status: "ok", services: ["users", "orders", "products"] });\n});\n\ngateway.listen(3000);\n\n// Redis caching in a service\nimport Redis from "ioredis";\nconst redis = new Redis(process.env.REDIS_URL);\n\nasync function getCachedUser(id) {\n  const cached = await redis.get(`user:${id}`);\n  if (cached) return JSON.parse(cached);\n  const user = await db.user.findById(id);\n  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));\n  return user;\n}',
     lang:'javascript',
     keyPoints:['API Gateway: single entry point, routing, rate limiting','Redis cache: setex(key, ttl, value) cho TTL-based caching','Message queue (RabbitMQ/Kafka) cho async service communication'],
     exercise:'Thiết kế microservices cho e-commerce: user, product, order, payment.'},

    {id:'performance',title:'Performance & Scaling',
     theory:'<p>Node.js single-threaded → dùng <strong>Cluster</strong> module multi-process. <code>Worker Threads</code> cho CPU-bound tasks. Monitoring với <code>clinic.js</code>. Caching strategies.</p>',
     code:'import cluster from "cluster";\nimport os from "os";\nimport { Worker } from "worker_threads";\n\nif (cluster.isPrimary) {\n  const cpus = os.cpus().length;\n  console.log(`Primary ${process.pid} forking ${cpus} workers`);\n  \n  for (let i = 0; i < cpus; i++) {\n    cluster.fork();\n  }\n  \n  cluster.on("exit", (worker) => {\n    console.log(`Worker ${worker.process.pid} died, restarting`);\n    cluster.fork(); // Auto-restart\n  });\n} else {\n  // Each worker runs the Express app\n  const app = express();\n  \n  // CPU-heavy task → Worker Thread\n  app.get("/api/heavy", (req, res) => {\n    const worker = new Worker("./heavy-task.js", {\n      workerData: { input: req.query.n }\n    });\n    worker.on("message", (result) => res.json(result));\n    worker.on("error", (err) => res.status(500).json({ error: err.message }));\n  });\n  \n  app.listen(3000);\n  console.log(`Worker ${process.pid} started`);\n}',
     lang:'javascript',
     keyPoints:['Cluster: multi-process, tận dụng multi-core CPU','Worker Threads: CPU-bound tasks không block event loop','PM2: process manager cho production deployment'],
     exercise:'Benchmark app trước/sau cluster, đạt throughput tăng 4x.'}
  ]},

  {id:'master',name:'Master',badge:'master',desc:'System Design & Internals',lessons:[
    {id:'event-loop',title:'Event Loop & V8 Internals',
     theory:'<p>Hiểu sâu <strong>Event Loop</strong>: phases (timers, poll, check), microtasks vs macrotasks. V8 engine: JIT compilation, hidden classes, inline caching. Memory management và GC.</p>',
     code:'// Event Loop phases demo\nconsole.log("1. Sync");\n\nsetTimeout(() => console.log("2. setTimeout (macrotask)"), 0);\nsetImmediate(() => console.log("3. setImmediate (check phase)"));\n\nPromise.resolve().then(() => {\n  console.log("4. Promise (microtask)");\n  process.nextTick(() => console.log("5. nextTick inside promise"));\n});\n\nprocess.nextTick(() => console.log("6. nextTick (microtask)"));\n\n// Output order: 1, 6, 4, 5, 2, 3\n// nextTick > Promise > setTimeout > setImmediate\n\n// Memory profiling\nfunction monitorMemory() {\n  const used = process.memoryUsage();\n  console.log({\n    rss: Math.round(used.rss / 1024 / 1024) + "MB",\n    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + "MB",\n    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + "MB",\n    external: Math.round(used.external / 1024 / 1024) + "MB"\n  });\n}\n\n// V8 optimization tips\n// 1. Consistent object shapes (hidden classes)\n// 2. Avoid delete operator (deoptimizes)\n// 3. Use TypedArrays for numeric data\n// 4. Avoid try/catch in hot loops\n\nsetInterval(monitorMemory, 5000);',
     lang:'javascript',
     keyPoints:['nextTick > Promises > setTimeout > setImmediate priority','V8 Hidden Classes: giữ object shape consistent','Heap snapshot + --inspect cho memory leak detection'],
     exercise:'Tìm và fix memory leak trong Express app dùng --inspect + Chrome DevTools.'},

    {id:'system-design',title:'System Design với Node.js',
     theory:'<p>Thiết kế hệ thống production: Load balancing, database sharding, CQRS, event sourcing. Infrastructure: Docker, Kubernetes, CI/CD. Observability: logging, metrics, tracing.</p>',
     code:'// Structured logging\nimport pino from "pino";\nconst logger = pino({\n  level: process.env.LOG_LEVEL || "info",\n  transport: process.env.NODE_ENV === "development"\n    ? { target: "pino-pretty" }\n    : undefined\n});\n\n// Request tracing middleware\nfunction tracing(req, res, next) {\n  const requestId = req.headers["x-request-id"] || crypto.randomUUID();\n  req.logger = logger.child({ requestId, path: req.url });\n  req.logger.info("Request started");\n  \n  const start = Date.now();\n  res.on("finish", () => {\n    req.logger.info({\n      status: res.statusCode,\n      duration: Date.now() - start\n    }, "Request completed");\n  });\n  next();\n}\n\n// Circuit Breaker pattern\nclass CircuitBreaker {\n  constructor(fn, { threshold = 5, timeout = 30000 } = {}) {\n    this.fn = fn;\n    this.failures = 0;\n    this.threshold = threshold;\n    this.timeout = timeout;\n    this.state = "CLOSED"; // CLOSED → OPEN → HALF-OPEN\n    this.nextAttempt = 0;\n  }\n  async call(...args) {\n    if (this.state === "OPEN") {\n      if (Date.now() < this.nextAttempt) throw new Error("Circuit open");\n      this.state = "HALF-OPEN";\n    }\n    try {\n      const result = await this.fn(...args);\n      this.failures = 0;\n      this.state = "CLOSED";\n      return result;\n    } catch (err) {\n      this.failures++;\n      if (this.failures >= this.threshold) {\n        this.state = "OPEN";\n        this.nextAttempt = Date.now() + this.timeout;\n      }\n      throw err;\n    }\n  }\n}',
     lang:'javascript',
     keyPoints:['Structured logging (pino/winston) thay console.log','Circuit Breaker: tự ngắt khi service downstream lỗi','Request tracing: correlation IDs across services'],
     exercise:'Thiết kế system cho 1M concurrent users: caching, queuing, CDN.'}
  ]}
]
};
