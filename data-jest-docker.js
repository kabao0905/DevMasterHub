// Jest & Testing Full Curriculum
const DATA_JEST = {
id:'jest', name:'Jest & Testing', icon:'🧪', color:'#C21325',
gradient:'linear-gradient(135deg,#C21325,#99424F)',
category:'tool',
description:'Unit testing, integration testing, TDD, test automation',
levels:[
  {id:'newbie',name:'Newbie',badge:'newbie',desc:'Testing cơ bản với Jest',lessons:[
    {id:'basics',title:'Jest Basics & First Tests',
     theory:'<p><strong>Testing</strong> kiểm tra code hoạt động đúng. <code>Jest</code> là framework test phổ biến nhất cho JavaScript. <code>describe</code> nhóm tests, <code>it/test</code> mô tả hành vi. <code>expect</code> + matchers kiểm tra kết quả.</p>',
     code:'// math.js\nfunction add(a, b) { return a + b; }\nfunction subtract(a, b) { return a - b; }\nfunction multiply(a, b) { return a * b; }\nfunction divide(a, b) {\n  if (b === 0) throw new Error("Cannot divide by zero");\n  return a / b;\n}\nmodule.exports = { add, subtract, multiply, divide };\n\n// math.test.js\nconst { add, subtract, divide } = require("./math");\n\ndescribe("Math functions", () => {\n  test("add returns sum of two numbers", () => {\n    expect(add(2, 3)).toBe(5);\n    expect(add(-1, 1)).toBe(0);\n  });\n\n  test("subtract returns difference", () => {\n    expect(subtract(5, 3)).toBe(2);\n  });\n\n  test("divide throws on zero", () => {\n    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");\n  });\n\n  test("divide returns correct result", () => {\n    expect(divide(10, 3)).toBeCloseTo(3.33, 1);\n  });\n});\n\n// Run: npx jest --verbose',
     lang:'javascript',
     keyPoints:['describe() nhóm related tests, test/it() mô tả 1 behavior','expect(value).toBe(expected) cho strict equality','toThrow() test exceptions, toBeCloseTo() cho floating-point'],
     exercise:'Viết tests cho hàm: isPrime, factorial, fibonacci.'},

    {id:'matchers',title:'Matchers & Assertions chi tiết',
     theory:'<p>Jest cung cấp nhiều <strong>matchers</strong> cho mọi kiểu so sánh: object, array, string, truthy/falsy, exceptions. <code>toEqual</code> deep equality, <code>toBe</code> reference equality.</p>',
     code:'describe("Jest Matchers", () => {\n  // Equality\n  test("object equality", () => {\n    const user = { name: "An", age: 20 };\n    expect(user).toEqual({ name: "An", age: 20 }); // deep\n    expect(user).not.toBe({ name: "An", age: 20 }); // different ref\n  });\n\n  // Truthiness\n  test("truthy/falsy", () => {\n    expect(null).toBeNull();\n    expect(undefined).toBeUndefined();\n    expect("hello").toBeTruthy();\n    expect(0).toBeFalsy();\n  });\n\n  // Arrays & Iterables\n  test("arrays", () => {\n    const list = ["apple", "banana", "cherry"];\n    expect(list).toContain("banana");\n    expect(list).toHaveLength(3);\n    expect(list).toEqual(expect.arrayContaining(["apple", "cherry"]));\n  });\n\n  // Objects\n  test("object matching", () => {\n    const response = { status: 200, data: { id: 1, name: "An" } };\n    expect(response).toMatchObject({\n      status: 200,\n      data: expect.objectContaining({ name: "An" })\n    });\n  });\n\n  // Strings\n  test("string matching", () => {\n    expect("hello world").toMatch(/world/);\n    expect("Error: not found").toContain("not found");\n  });\n});',
     lang:'javascript',
     keyPoints:['toBe: strict === reference equality','toEqual: deep comparison cho objects/arrays','toMatchObject: partial object matching, rất hữu ích cho API tests'],
     exercise:'Viết tests cho shopping cart: addItem, removeItem, calculateTotal.'},

    {id:'structure',title:'Test Structure & Organization',
     theory:'<p>AAA pattern: <strong>Arrange</strong> (setup), <strong>Act</strong> (execute), <strong>Assert</strong> (verify). <code>beforeEach/afterEach</code> cho setup/teardown. <code>beforeAll/afterAll</code> chạy 1 lần cho toàn bộ suite.</p>',
     code:'class TodoList {\n  constructor() { this.todos = []; this.nextId = 1; }\n  add(title) {\n    const todo = { id: this.nextId++, title, done: false };\n    this.todos.push(todo);\n    return todo;\n  }\n  toggle(id) {\n    const todo = this.todos.find(t => t.id === id);\n    if (!todo) throw new Error("Not found");\n    todo.done = !todo.done;\n    return todo;\n  }\n  getAll(filter) {\n    if (filter === "done") return this.todos.filter(t => t.done);\n    if (filter === "active") return this.todos.filter(t => !t.done);\n    return [...this.todos];\n  }\n}\n\ndescribe("TodoList", () => {\n  let todoList;\n\n  beforeEach(() => {\n    // Arrange: fresh instance for each test\n    todoList = new TodoList();\n  });\n\n  describe("add()", () => {\n    test("should add todo with auto-incremented id", () => {\n      const todo = todoList.add("Learn Jest");\n      expect(todo).toEqual({ id: 1, title: "Learn Jest", done: false });\n    });\n\n    test("should increment id for each todo", () => {\n      todoList.add("First");\n      const second = todoList.add("Second");\n      expect(second.id).toBe(2);\n    });\n  });\n\n  describe("toggle()", () => {\n    test("should toggle done status", () => {\n      todoList.add("Task");\n      const toggled = todoList.toggle(1);\n      expect(toggled.done).toBe(true);\n    });\n\n    test("should throw for invalid id", () => {\n      expect(() => todoList.toggle(999)).toThrow("Not found");\n    });\n  });\n});',
     lang:'javascript',
     keyPoints:['AAA: Arrange (setup) → Act (execute) → Assert (verify)','beforeEach: fresh state cho mỗi test, tránh test coupling','Nested describe blocks cho related feature grouping'],
     exercise:'Viết test suite cho BankAccount class: deposit, withdraw, getBalance.'}
  ]},

  {id:'junior',name:'Junior',badge:'junior',desc:'Mocking & Async Testing',lessons:[
    {id:'mocking',title:'Mocking & Spying',
     theory:'<p><strong>Mock</strong> thay thế real implementations. <code>jest.fn()</code> tạo mock function. <code>jest.mock()</code> mock cả module. <code>jest.spyOn()</code> spy trên existing method mà giữ implementation.</p>',
     code:'// userService.js\nclass UserService {\n  constructor(database, emailSender) {\n    this.db = database;\n    this.email = emailSender;\n  }\n  async createUser(name, email) {\n    const user = await this.db.save({ name, email });\n    await this.email.sendWelcome(email, name);\n    return user;\n  }\n}\n\n// userService.test.js\ndescribe("UserService", () => {\n  let service, mockDb, mockEmail;\n\n  beforeEach(() => {\n    mockDb = {\n      save: jest.fn().mockResolvedValue({ id: 1, name: "An", email: "a@b.com" }),\n      findById: jest.fn()\n    };\n    mockEmail = {\n      sendWelcome: jest.fn().mockResolvedValue(true)\n    };\n    service = new UserService(mockDb, mockEmail);\n  });\n\n  test("createUser saves to db and sends email", async () => {\n    const user = await service.createUser("An", "a@b.com");\n\n    expect(user.id).toBe(1);\n    expect(mockDb.save).toHaveBeenCalledWith({\n      name: "An", email: "a@b.com"\n    });\n    expect(mockDb.save).toHaveBeenCalledTimes(1);\n    expect(mockEmail.sendWelcome).toHaveBeenCalledWith("a@b.com", "An");\n  });\n\n  test("should not send email if db fails", async () => {\n    mockDb.save.mockRejectedValue(new Error("DB Error"));\n    await expect(service.createUser("X", "x@y.com")).rejects.toThrow("DB Error");\n    expect(mockEmail.sendWelcome).not.toHaveBeenCalled();\n  });\n});',
     lang:'javascript',
     keyPoints:['jest.fn() tạo tracked mock function','mockResolvedValue cho async mocks, mockRejectedValue cho errors','toHaveBeenCalledWith(args) verify mock được gọi đúng'],
     exercise:'Mock API client và test service layer với error handling.'},

    {id:'async',title:'Testing Async Code',
     theory:'<p>Test async: dùng <code>async/await</code>, hoặc return Promise. <code>resolves/rejects</code> matchers cho Promise assertions. Fake timers (<code>jest.useFakeTimers</code>) cho setTimeout/setInterval.</p>',
     code:'// async functions\nasync function fetchUser(id) {\n  const res = await fetch(`/api/users/${id}`);\n  if (!res.ok) throw new Error(`User ${id} not found`);\n  return res.json();\n}\n\nfunction debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\n\n// Tests\ndescribe("Async testing", () => {\n  // Mock fetch\n  beforeEach(() => {\n    global.fetch = jest.fn();\n  });\n\n  test("fetchUser returns user data", async () => {\n    fetch.mockResolvedValue({\n      ok: true,\n      json: () => Promise.resolve({ id: 1, name: "An" })\n    });\n\n    const user = await fetchUser(1);\n    expect(user.name).toBe("An");\n    expect(fetch).toHaveBeenCalledWith("/api/users/1");\n  });\n\n  test("fetchUser throws on 404", async () => {\n    fetch.mockResolvedValue({ ok: false, status: 404 });\n    await expect(fetchUser(999)).rejects.toThrow("not found");\n  });\n});\n\ndescribe("Fake timers", () => {\n  beforeEach(() => jest.useFakeTimers());\n  afterEach(() => jest.useRealTimers());\n\n  test("debounce waits before calling", () => {\n    const fn = jest.fn();\n    const debounced = debounce(fn, 300);\n\n    debounced("a");\n    debounced("b");\n    expect(fn).not.toHaveBeenCalled();\n\n    jest.advanceTimersByTime(300);\n    expect(fn).toHaveBeenCalledWith("b");\n    expect(fn).toHaveBeenCalledTimes(1);\n  });\n});',
     lang:'javascript',
     keyPoints:['async/await trong test, expect().resolves/.rejects cho Promises','jest.useFakeTimers() điều khiển thời gian','jest.advanceTimersByTime(ms) nhảy forward qua setTimeout'],
     exercise:'Test WebSocket connection với mock, timeout, và reconnection.'},

    {id:'setup-coverage',title:'Setup, Config & Coverage',
     theory:'<p>Jest config (<code>jest.config.js</code>): test environment, coverage thresholds, module aliases. <code>--coverage</code> đo coverage. Setup files cho global mocks. Snapshot testing cho UI.</p>',
     code:'// jest.config.js\nmodule.exports = {\n  testEnvironment: "node",\n  coverageThreshold: {\n    global: {\n      branches: 80,\n      functions: 80,\n      lines: 80,\n      statements: 80\n    }\n  },\n  collectCoverageFrom: [\n    "src/**/*.{js,ts}",\n    "!src/**/*.test.{js,ts}",\n    "!src/types/**"\n  ],\n  moduleNameMapper: {\n    "^@/(.*)$": "<rootDir>/src/$1"\n  },\n  setupFilesAfterSetup: ["./jest.setup.js"]\n};\n\n// jest.setup.js\nglobal.console.warn = jest.fn();\n\n// Snapshot testing\nfunction formatUser(user) {\n  return {\n    displayName: `${user.firstName} ${user.lastName}`,\n    initials: `${user.firstName[0]}${user.lastName[0]}`,\n    isAdmin: user.role === "admin"\n  };\n}\n\ntest("formatUser snapshot", () => {\n  const result = formatUser({\n    firstName: "An", lastName: "Nguyen", role: "admin"\n  });\n  expect(result).toMatchSnapshot();\n  // First run: creates snapshot file\n  // Next runs: compares with saved snapshot\n});\n\n// Run: npx jest --coverage --verbose',
     lang:'javascript',
     keyPoints:['coverageThreshold đảm bảo minimum coverage %','toMatchSnapshot() cho regression testing','setupFilesAfterSetup cho global test configuration'],
     exercise:'Config Jest cho project với aliases, coverage 80%, custom matchers.'}
  ]},

  {id:'mid',name:'Mid-Level',badge:'mid',desc:'Integration & Advanced Testing',lessons:[
    {id:'integration',title:'Integration Testing',
     theory:'<p><strong>Integration tests</strong> kiểm tra nhiều modules work together. Test API endpoints với <code>supertest</code>. Test database queries. Test middleware chains.</p>',
     code:'const request = require("supertest");\nconst app = require("./app");\n\ndescribe("API Integration Tests", () => {\n  describe("POST /api/todos", () => {\n    test("creates todo successfully", async () => {\n      const res = await request(app)\n        .post("/api/todos")\n        .send({ title: "Test todo", priority: 1 })\n        .expect("Content-Type", /json/)\n        .expect(201);\n\n      expect(res.body).toMatchObject({\n        title: "Test todo",\n        priority: 1,\n        done: false\n      });\n      expect(res.body.id).toBeDefined();\n    });\n\n    test("returns 400 for missing title", async () => {\n      const res = await request(app)\n        .post("/api/todos")\n        .send({ priority: 1 })\n        .expect(400);\n\n      expect(res.body.error).toContain("title");\n    });\n  });\n\n  describe("GET /api/todos", () => {\n    test("returns filtered todos", async () => {\n      // Arrange: create test data\n      await request(app).post("/api/todos").send({ title: "A" });\n      await request(app).post("/api/todos").send({ title: "B" });\n\n      // Act\n      const res = await request(app)\n        .get("/api/todos")\n        .expect(200);\n\n      // Assert\n      expect(res.body.length).toBeGreaterThanOrEqual(2);\n    });\n  });\n});',
     lang:'javascript',
     keyPoints:['supertest(app) test HTTP endpoints đầy đủ','Chaining: .send() → .expect(status) → .expect(header)','Integration = test modules together, unit = isolated'],
     exercise:'Viết integration tests cho REST API: CRUD + auth + error handling.'},

    {id:'tdd',title:'Test-Driven Development (TDD)',
     theory:'<p><strong>TDD</strong> cycle: <span style="color:#c21325">RED</span> (write failing test) → <span style="color:#2da44e">GREEN</span> (write minimum code to pass) → <span style="color:#3178c6">REFACTOR</span> (clean up). Tests drive design.</p>',
     code:'// TDD Example: Building a password validator\n\n// Step 1: RED - Write failing test first\ndescribe("PasswordValidator", () => {\n  test("rejects empty password", () => {\n    expect(validate("")).toEqual({\n      valid: false,\n      errors: ["Password is required"]\n    });\n  });\n\n  test("rejects short password", () => {\n    expect(validate("abc")).toEqual({\n      valid: false,\n      errors: ["Minimum 8 characters"]\n    });\n  });\n\n  test("requires uppercase letter", () => {\n    const result = validate("abcdefgh");\n    expect(result.valid).toBe(false);\n    expect(result.errors).toContain("Needs uppercase letter");\n  });\n\n  test("accepts valid password", () => {\n    expect(validate("Abcdef1!")).toEqual({\n      valid: true, errors: []\n    });\n  });\n});\n\n// Step 2: GREEN - Minimum code to pass\nfunction validate(password) {\n  const errors = [];\n  if (!password) errors.push("Password is required");\n  else {\n    if (password.length < 8) errors.push("Minimum 8 characters");\n    if (!/[A-Z]/.test(password)) errors.push("Needs uppercase letter");\n    if (!/[0-9]/.test(password)) errors.push("Needs a number");\n  }\n  return { valid: errors.length === 0, errors };\n}\n\n// Step 3: REFACTOR - Clean up while tests stay green',
     lang:'javascript',
     keyPoints:['RED: viết test trước, chưa có code → test FAIL','GREEN: viết minimum code để test PASS','REFACTOR: clean code mà tests vẫn pass'],
     exercise:'TDD: xây dựng URL shortener từ scratch, test trước code sau.'},

    {id:'testing-strategy',title:'Testing Strategy & Patterns',
     theory:'<p>Test pyramid: Unit (70%) → Integration (20%) → E2E (10%). Test doubles: Mock, Stub, Spy, Fake. Test isolation. Flaky test detection. CI/CD integration.</p>',
     code:'// Testing patterns cheat sheet\n\n// 1. Builder pattern for test data\nclass UserBuilder {\n  #data = { name: "Default", email: "test@test.com", role: "user" };\n  withName(n) { this.#data.name = n; return this; }\n  withRole(r) { this.#data.role = r; return this; }\n  build() { return { ...this.#data }; }\n}\nconst aUser = () => new UserBuilder();\n\ntest("admin can delete", () => {\n  const admin = aUser().withName("Boss").withRole("admin").build();\n  expect(canDelete(admin)).toBe(true);\n});\n\n// 2. Test isolation with dependency injection\nclass OrderService {\n  constructor(db, payment, email) {\n    this.db = db; this.payment = payment; this.email = email;\n  }\n}\n\n// 3. Custom matchers\nexpect.extend({\n  toBeValidEmail(received) {\n    const pass = /^\\S+@\\S+\\.\\S+$/.test(received);\n    return {\n      pass,\n      message: () => `expected ${received} to be valid email`\n    };\n  }\n});\n\ntest("email validation", () => {\n  expect("an@mail.com").toBeValidEmail();\n  expect("invalid").not.toBeValidEmail();\n});\n\n// 4. CI config (package.json)\n// "scripts": {\n//   "test": "jest --coverage --ci --reporters=default",\n//   "test:watch": "jest --watch"\n// }',
     lang:'javascript',
     keyPoints:['Test pyramid: Unit(70%) > Integration(20%) > E2E(10%)','Builder pattern cho test data factory','Custom matchers: expect.extend() cho domain-specific assertions'],
     exercise:'Thiết kế testing strategy cho e-commerce app: unit + integration + E2E.'}
  ]},

  {id:'senior',name:'Senior',badge:'senior',desc:'Advanced Testing Patterns',lessons:[
    {id:'ci-cd',title:'CI/CD & Test Automation',
     theory:'<p>GitHub Actions chạy tests tự động trên mỗi PR. Parallel test execution. Test splitting cho CI nhanh. Mutation testing kiểm tra test quality.</p>',
     code:'# .github/workflows/test.yml\nname: Tests\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [18, 20]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}\n          cache: "npm"\n      - run: npm ci\n      - run: npm test -- --coverage --ci\n      - uses: codecov/codecov-action@v4\n        with:\n          token: ${{ secrets.CODECOV_TOKEN }}\n\n  e2e:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npx playwright install --with-deps\n      - run: npx playwright test',
     lang:'yaml',
     keyPoints:['GitHub Actions: automated testing on every push/PR','Matrix testing: multiple Node versions in parallel','Codecov: track coverage trends over time'],
     exercise:'Setup CI pipeline: lint → unit tests → integration → E2E → deploy.'},

    {id:'property-testing',title:'Property-Based & Contract Testing',
     theory:'<p><strong>Property-based testing</strong>: define properties code MUST satisfy, generator creates random inputs. <strong>Contract testing</strong>: verify API producer/consumer agreements.</p>',
     code:'import fc from "fast-check";\n\n// Property-based testing with fast-check\ndescribe("sort function properties", () => {\n  test("output length equals input length", () => {\n    fc.assert(\n      fc.property(fc.array(fc.integer()), (arr) => {\n        const sorted = [...arr].sort((a, b) => a - b);\n        return sorted.length === arr.length;\n      })\n    );\n  });\n\n  test("output is ordered", () => {\n    fc.assert(\n      fc.property(fc.array(fc.integer()), (arr) => {\n        const sorted = [...arr].sort((a, b) => a - b);\n        for (let i = 1; i < sorted.length; i++) {\n          if (sorted[i] < sorted[i - 1]) return false;\n        }\n        return true;\n      })\n    );\n  });\n\n  test("idempotent: sorting twice = sorting once", () => {\n    fc.assert(\n      fc.property(fc.array(fc.integer()), (arr) => {\n        const sort = a => [...a].sort((x, y) => x - y);\n        const once = sort(arr);\n        const twice = sort(once);\n        return JSON.stringify(once) === JSON.stringify(twice);\n      })\n    );\n  });\n});\n\n// fast-check tự tìm edge cases:\n// [], [1], [-1, 0, 1], [MAX_INT], duplicates, etc.',
     lang:'javascript',
     keyPoints:['Property-based: define invariants, random inputs find edge cases','fast-check tự shrink failing cases đến minimal example','Contract tests: verify API shape between services'],
     exercise:'Viết property-based tests cho search, filter, và pagination functions.'}
  ]},

  {id:'master',name:'Master',badge:'master',desc:'Testing Architecture & Philosophy',lessons:[
    {id:'architecture',title:'Testing Architecture & Testing Trophy',
     theory:'<p>Testing Trophy (Kent C. Dodds): Static → Unit → Integration → E2E. Integration tests give best ROI. Test behavior not implementation. Avoid testing internals.</p>',
     code:'// Anti-pattern: testing implementation details\n// BAD: testing internal state\ntest("BAD: checks internal array", () => {\n  const cart = new ShoppingCart();\n  cart.addItem({ id: 1, price: 10 });\n  expect(cart.items.length).toBe(1);     // internal!\n  expect(cart.items[0].price).toBe(10);  // brittle!\n});\n\n// GOOD: testing behavior\ntest("GOOD: tests public behavior", () => {\n  const cart = new ShoppingCart();\n  cart.addItem({ id: 1, price: 10 });\n  cart.addItem({ id: 2, price: 20 });\n\n  expect(cart.getTotal()).toBe(30);\n  expect(cart.getItemCount()).toBe(2);\n  expect(cart.hasItem(1)).toBe(true);\n});\n\n// Integration test > many unit tests\ndescribe("User registration flow", () => {\n  test("complete user journey", async () => {\n    // Register\n    const register = await request(app)\n      .post("/api/auth/register")\n      .send({ name: "An", email: "an@t.com", password: "Pass1234!" })\n      .expect(201);\n\n    // Login\n    const login = await request(app)\n      .post("/api/auth/login")\n      .send({ email: "an@t.com", password: "Pass1234!" })\n      .expect(200);\n\n    // Access protected route\n    await request(app)\n      .get("/api/profile")\n      .set("Authorization", `Bearer ${login.body.token}`)\n      .expect(200);\n  });\n});',
     lang:'javascript',
     keyPoints:['Test behavior (output), không test implementation (internals)','Integration tests give highest confidence per test','Avoid mocking everything — test with real dependencies when possible'],
     exercise:'Refactor test suite: xóa implementation tests, thêm behavior tests.'}
  ]}
]
};

// Docker & Git Full Curriculum
const DATA_DOCKER = {
id:'docker', name:'Docker & Git', icon:'🐳', color:'#2496ED',
gradient:'linear-gradient(135deg,#2496ED,#F05032)',
category:'devops',
description:'Containerization, version control, CI/CD, deployment',
levels:[
  {id:'newbie',name:'Newbie',badge:'newbie',desc:'Git & Docker cơ bản',lessons:[
    {id:'git-basics',title:'Git Fundamentals',
     theory:'<p><strong>Git</strong> quản lý version control. <code>commit</code> lưu snapshot. <code>branch</code> tạo nhánh phát triển song song. <code>merge</code> hợp nhất branches.</p>',
     code:'# Init & Config\ngit init\ngit config --global user.name "DevMaster"\ngit config --global user.email "dev@master.com"\n\n# Basic workflow\ngit add .                    # Stage all changes\ngit commit -m "feat: add login page"\ngit status                   # Check status\ngit log --oneline -5         # View history\n\n# Branching\ngit branch feature/auth      # Create branch\ngit checkout feature/auth    # Switch branch\n# Or: git checkout -b feature/auth (create + switch)\n\ngit add .\ngit commit -m "feat: add JWT auth"\n\ngit checkout main\ngit merge feature/auth       # Merge to main\ngit branch -d feature/auth   # Delete merged branch\n\n# Remote\ngit remote add origin https://github.com/user/repo.git\ngit push -u origin main\ngit pull origin main',
     lang:'bash',
     keyPoints:['git add → git commit → git push workflow','Branching: tạo branch cho mỗi feature, merge khi xong','Commit messages: type(scope): description (conventional)'],
     exercise:'Tạo repo, commit 3 lần, tạo branch, merge, push lên GitHub.'},

    {id:'docker-basics',title:'Docker Basics',
     theory:'<p><strong>Docker</strong> đóng gói app + dependencies vào <strong>container</strong>. <code>Dockerfile</code> định nghĩa cách build image. Containers chạy isolated, consistent mọi nơi.</p>',
     code:'# Dockerfile\nFROM node:20-alpine\n\nWORKDIR /app\n\n# Copy deps first (caching)\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Copy source\nCOPY . .\n\nEXPOSE 3000\n\nCMD ["node", "server.js"]\n\n# .dockerignore\n# node_modules\n# .git\n# .env\n\n# Build & Run\n# docker build -t myapp .\n# docker run -d -p 3000:3000 --name myapp myapp\n\n# Useful commands\n# docker ps              # running containers\n# docker logs myapp      # view logs\n# docker exec -it myapp sh  # shell into container\n# docker stop myapp      # stop\n# docker rm myapp        # remove',
     lang:'dockerfile',
     keyPoints:['FROM base image, WORKDIR set directory, COPY transfer files','Layer caching: COPY package.json trước, npm install, sau COPY source','docker build -t name . tạo image, docker run chạy container'],
     exercise:'Dockerize một Node.js Express app.'},

    {id:'gitignore',title:'.gitignore & Docker Ignore',
     theory:'<p><code>.gitignore</code> loại bỏ files không track: node_modules, .env, build outputs. <code>.dockerignore</code> giảm build context size. Proper ignore patterns quan trọng cho security.</p>',
     code:'# .gitignore\nnode_modules/\ndist/\nbuild/\n.env\n.env.local\n*.log\n.DS_Store\ncoverage/\n.cache/\n\n# IDE\n.vscode/\n.idea/\n*.swp\n\n# OS\nThumbs.db\n\n# .dockerignore\nnode_modules\nnpm-debug.log\n.git\n.gitignore\n.env*\nREADME.md\n.dockerignore\nDockerfile\ndocker-compose*.yml\ntests/\ncoverage/\n.vscode/',
     lang:'bash',
     keyPoints:['.gitignore: NEVER commit node_modules, .env, secrets','Pattern: * (any), ** (recursive), ! (negate/include)','Commit .gitignore sớm, trước khi add sensitive files'],
     exercise:'Tạo .gitignore và .dockerignore phù hợp cho full-stack project.'}
  ]},

  {id:'junior',name:'Junior',badge:'junior',desc:'Branching, Compose & Workflows',lessons:[
    {id:'branching',title:'Git Branching Strategies',
     theory:'<p><strong>Git Flow</strong>: main, develop, feature/*, release/*, hotfix/*. <strong>GitHub Flow</strong>: main + feature branches + PR. Rebase vs Merge. Conventional commits.</p>',
     code:'# GitHub Flow (simple, recommended)\ngit checkout -b feature/user-auth\n\n# Work...\ngit add .\ngit commit -m "feat(auth): add JWT login endpoint"\ngit commit -m "test(auth): add login unit tests"\ngit commit -m "docs(auth): update API documentation"\n\n# Push and create PR\ngit push -u origin feature/user-auth\n# Create Pull Request on GitHub\n\n# Rebase before merge (clean history)\ngit checkout feature/user-auth\ngit rebase main\n# Resolve conflicts if any\ngit push --force-with-lease\n\n# After PR approved & merged\ngit checkout main\ngit pull origin main\ngit branch -d feature/user-auth\n\n# Interactive rebase (clean up commits)\ngit rebase -i HEAD~3\n# pick, squash, reword, drop\n\n# Stash (save work temporarily)\ngit stash\ngit checkout other-branch\n# do stuff...\ngit checkout feature-branch\ngit stash pop',
     lang:'bash',
     keyPoints:['GitHub Flow: main → feature branch → PR → merge → delete','Conventional commits: feat:, fix:, docs:, test:, chore:','Rebase cho clean history, merge cho team collaboration'],
     exercise:'Practice Git Flow: tạo feature, hotfix, release branches.'},

    {id:'compose',title:'Docker Compose & Multi-container',
     theory:'<p><code>Docker Compose</code> orchestrate nhiều containers cùng lúc. Một file <code>docker-compose.yml</code> định nghĩa tất cả services, networks, volumes.</p>',
     code:'# docker-compose.yml\nversion: "3.8"\n\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n      - DATABASE_URL=postgres://user:pass@db:5432/myapp\n      - REDIS_URL=redis://cache:6379\n    depends_on:\n      db:\n        condition: service_healthy\n      cache:\n        condition: service_started\n    volumes:\n      - ./src:/app/src  # dev: hot reload\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: myapp\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U user"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n\n  cache:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  postgres_data:\n\n# Commands:\n# docker compose up -d      # start all\n# docker compose logs -f    # follow logs\n# docker compose down -v    # stop & remove volumes',
     lang:'yaml',
     keyPoints:['services: định nghĩa mỗi container (app, db, cache)','depends_on + healthcheck đảm bảo startup order','volumes: persist data khi container restart'],
     exercise:'Compose full-stack app: Node.js + PostgreSQL + Redis.'},

    {id:'merge-conflicts',title:'Merge Conflicts & Recovery',
     theory:'<p>Conflicts xảy ra khi 2 branches sửa cùng file. Resolve bằng cách chọn code đúng. <code>git reflog</code> recovery tool. <code>git bisect</code> tìm commit gây bug.</p>',
     code:'# When conflict occurs:\ngit merge feature/auth\n# CONFLICT (content): Merge conflict in src/app.js\n\n# The file will contain:\n<<<<<<< HEAD\n  const port = 3000;\n=======\n  const port = process.env.PORT || 8080;\n>>>>>>> feature/auth\n\n# Fix: choose correct code, remove markers\n  const port = process.env.PORT || 3000;\n\ngit add src/app.js\ngit commit -m "fix: resolve merge conflict in app.js"\n\n# Recovery tools\ngit reflog              # view ALL history (even deleted)\ngit reset --hard HEAD~1 # undo last commit (DANGEROUS)\ngit revert HEAD         # create new commit that undoes\n\n# Find bug-introducing commit\ngit bisect start\ngit bisect bad          # current commit has bug\ngit bisect good v1.0    # this version was fine\n# Git will checkout middle commits\n# Test each: git bisect good/bad\n# Eventually finds the exact commit!\ngit bisect reset',
     lang:'bash',
     keyPoints:['<<<< HEAD / ==== / >>>> branch markers cho conflict','git reflog: recovery cho mọi thao tác đã mất','git bisect: binary search tìm commit gây bug'],
     exercise:'Tạo conflict cố tình giữa 2 branches và resolve chúng.'}
  ]},

  {id:'mid',name:'Mid-Level',badge:'mid',desc:'CI/CD, Advanced Docker & Git',lessons:[
    {id:'ci-cd',title:'CI/CD Pipelines',
     theory:'<p><strong>CI</strong> (Continuous Integration): auto-test mỗi push. <strong>CD</strong> (Continuous Deployment): auto-deploy khi tests pass. GitHub Actions, GitLab CI, Jenkins.</p>',
     code:'# .github/workflows/deploy.yml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20 }\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test -- --coverage\n\n  build:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build Docker Image\n        run: docker build -t myapp:${{ github.sha }} .\n      - name: Push to Registry\n        run: |\n          docker tag myapp:${{ github.sha }} registry.example.com/myapp:latest\n          docker push registry.example.com/myapp:latest\n\n  deploy:\n    needs: build\n    if: github.ref == \'refs/heads/main\'\n    runs-on: ubuntu-latest\n    steps:\n      - name: Deploy\n        run: |\n          ssh deploy@server "docker pull registry.example.com/myapp:latest && docker compose up -d"',
     lang:'yaml',
     keyPoints:['CI: test → lint → build on every push/PR','CD: auto-deploy to production after tests pass','needs: job1 cho dependency order giữa jobs'],
     exercise:'Setup GitHub Actions CI/CD cho project: test → build → deploy.'},

    {id:'docker-advanced',title:'Docker Production Patterns',
     theory:'<p>Multi-stage builds giảm image size. Health checks. Security: non-root user, minimal base image. Docker layer optimization. Environment variables.</p>',
     code:'# Multi-stage build\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Production image (smaller)\nFROM node:20-alpine AS production\nWORKDIR /app\n\n# Security: non-root user\nRUN addgroup -g 1001 appgroup && \\\n    adduser -u 1001 -G appgroup -s /bin/sh -D appuser\n\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/package.json ./\n\n# Health check\nHEALTHCHECK --interval=30s --timeout=3s --retries=3 \\\n  CMD wget -qO- http://localhost:3000/health || exit 1\n\nUSER appuser\nEXPOSE 3000\nCMD ["node", "dist/server.js"]',
     lang:'dockerfile',
     keyPoints:['Multi-stage: builder stage compiles, production stage chỉ chứa output','Non-root USER cho security (không chạy container as root)','HEALTHCHECK cho container orchestration biết service healthy'],
     exercise:'Optimize Docker image từ 1GB xuống <200MB dùng multi-stage.'},

    {id:'git-advanced',title:'Advanced Git Techniques',
     theory:'<p>Git hooks (pre-commit, pre-push). Git submodules. Cherry-pick specific commits. Worktrees cho parallel development. Signed commits.</p>',
     code:'# Pre-commit hook (.husky/pre-commit)\nnpx lint-staged\n\n# lint-staged config (package.json)\n# "lint-staged": {\n#   "*.{js,ts}": ["eslint --fix", "prettier --write"],\n#   "*.css": ["prettier --write"]\n# }\n\n# Cherry-pick: apply specific commit from another branch\ngit cherry-pick abc1234\n\n# Worktrees: multiple working directories\ngit worktree add ../hotfix hotfix/critical\n# Work in ../hotfix without switching branches\n# Clean up: git worktree remove ../hotfix\n\n# Interactive rebase: rewrite history\ngit rebase -i HEAD~5\n# Commands:\n# pick   = keep commit\n# squash = combine with previous\n# reword = change commit message\n# drop   = remove commit\n# edit   = stop to amend\n\n# Signed commits (verify authorship)\ngit config --global commit.gpgsign true\ngit commit -S -m "feat: verified commit"\n\n# Git blame with ignoring whitespace changes\ngit blame -w --ignore-revs-file .git-blame-ignore-revs src/app.js',
     lang:'bash',
     keyPoints:['Pre-commit hooks: lint + format trước khi commit','Cherry-pick: lấy 1 commit cụ thể từ branch khác','Worktrees: work trên nhiều branches cùng lúc'],
     exercise:'Setup husky + lint-staged cho pre-commit linting.'}
  ]},

  {id:'senior',name:'Senior',badge:'senior',desc:'Docker Security & Orchestration',lessons:[
    {id:'security',title:'Container Security & Best Practices',
     theory:'<p>Container security: minimal images, vulnerability scanning, secrets management, network policies. Trivy/Snyk scan. Docker secrets. Read-only filesystems.</p>',
     code:'# Security scanning\n# docker scout cves myapp:latest\n# trivy image myapp:latest\n\n# Secure Dockerfile\nFROM node:20-alpine AS base\n\n# Don\'t run as root\nRUN addgroup -S app && adduser -S -G app appuser\n\n# Read-only filesystem\n# docker run --read-only --tmpfs /tmp myapp\n\n# Docker secrets (Compose)\n# docker-compose.yml\n# services:\n#   app:\n#     secrets:\n#       - db_password\n# secrets:\n#   db_password:\n#     file: ./secrets/db_password.txt\n\n# Security hardening\n# docker run \\\n#   --read-only \\\n#   --no-new-privileges \\\n#   --security-opt=no-new-privileges:true \\\n#   --cap-drop=ALL \\\n#   --cap-add=NET_BIND_SERVICE \\\n#   myapp\n\n# .trivyignore - ignore known acceptable CVEs\n# CVE-2023-12345\n\n# Scan in CI\n# - name: Scan image\n#   run: trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest',
     lang:'dockerfile',
     keyPoints:['Trivy/Snyk scan containers cho vulnerabilities','--cap-drop=ALL + add only needed capabilities','Docker secrets thay environment variables cho sensitive data'],
     exercise:'Audit và harden Docker setup: scan, non-root, secrets.'},

    {id:'kubernetes-intro',title:'Kubernetes & Container Orchestration',
     theory:'<p><strong>Kubernetes (K8s)</strong> orchestrate containers at scale. Pods, Services, Deployments, Ingress. Auto-scaling, rolling updates, self-healing.</p>',
     code:'# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n    spec:\n      containers:\n        - name: myapp\n          image: myapp:latest\n          ports:\n            - containerPort: 3000\n          resources:\n            requests:\n              memory: "128Mi"\n              cpu: "250m"\n            limits:\n              memory: "256Mi"\n              cpu: "500m"\n          livenessProbe:\n            httpGet:\n              path: /health\n              port: 3000\n            periodSeconds: 10\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: myapp-service\nspec:\n  selector:\n    app: myapp\n  ports:\n    - port: 80\n      targetPort: 3000\n  type: LoadBalancer',
     lang:'yaml',
     keyPoints:['Deployment: manage replicas, rolling updates, rollbacks','Service: load balance traffic to pods','Resource limits: memory/cpu requests + limits cho stability'],
     exercise:'Deploy app lên Kubernetes cluster với 3 replicas, auto-scaling.'}
  ]},

  {id:'master',name:'Master',badge:'master',desc:'GitOps & Infrastructure as Code',lessons:[
    {id:'gitops',title:'GitOps & Infrastructure as Code',
     theory:'<p><strong>GitOps</strong>: Git là single source of truth cho infrastructure. ArgoCD, Flux sync cluster state với Git. Terraform/Pulumi cho cloud infrastructure. Immutable deployments.</p>',
     code:'# Terraform example (infrastructure as code)\nresource "aws_ecs_service" "app" {\n  name            = "myapp"\n  cluster         = aws_ecs_cluster.main.id\n  task_definition = aws_ecs_task_definition.app.arn\n  desired_count   = 3\n\n  load_balancer {\n    target_group_arn = aws_lb_target_group.app.arn\n    container_name   = "myapp"\n    container_port   = 3000\n  }\n}\n\n# ArgoCD Application (GitOps)\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: myapp\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/org/k8s-manifests\n    targetRevision: main\n    path: apps/myapp\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n\n# Flow:\n# 1. Developer pushes code → GitHub\n# 2. CI builds + tests → pushes Docker image\n# 3. CI updates k8s manifests in GitOps repo\n# 4. ArgoCD detects change → deploys automatically\n# 5. Rollback = git revert on GitOps repo',
     lang:'yaml',
     keyPoints:['GitOps: Git repo = desired infrastructure state','ArgoCD/Flux: auto-sync cluster state với Git repo','Terraform: infrastructure as code, plan → apply → destroy'],
     exercise:'Set up GitOps pipeline: code repo → CI → GitOps repo → ArgoCD → K8s.'}
  ]}
]
};
