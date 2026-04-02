// Python Full Curriculum
const DATA_PYTHON = {
id:'python', name:'Python', icon:'🐍', color:'#3776AB',
gradient:'linear-gradient(135deg,#3776AB,#FFD43B)',
category:'language',
description:'AI/ML, web backend, data science, scripting, automation',
levels:[
  // ── NEWBIE (5 bài) ──
  {id:'newbie',name:'Newbie',badge:'newbie',desc:'Syntax cơ bản Python',lessons:[
    {id:'intro',title:'Hello World & Cơ bản',
     theory:'<p>Python là ngôn ngữ đơn giản, dễ đọc nhất. Không dùng <code>{}</code> mà dùng <strong>indentation</strong> (thụt lề). Biến không cần khai báo kiểu.</p>',
     code:'# Python cực kỳ đơn giản\nname = "DevMaster"\nage = 20\npi = 3.14159\nis_student = True\n\nprint(f"Hello, {name}!")\nprint(f"Age: {age}, Pi: {pi:.2f}")\n\n# Input\nuser_name = input("Your name: ")\nprint(f"Welcome {user_name}!")',
     lang:'python',
     keyPoints:['Không cần ; hay {} - dùng indentation','f-string: f"...{variable}..." cho format','input() nhận dữ liệu từ user, trả về string'],
     exercise:'Viết chương trình nhập 2 số và in tổng, hiệu, tích, thương.'},

    {id:'conditions',title:'Điều kiện & Toán tử',
     theory:'<p>Python dùng <code>if/elif/else</code>. Toán tử logic dùng <strong>từ tiếng Anh</strong>: <code>and, or, not</code>. <code>in</code> kiểm tra phần tử trong collection.</p>',
     code:'score = 85\n\n# if/elif/else\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\nprint(f"Grade: {grade}")\n\n# Ternary\nstatus = "Pass" if score >= 50 else "Fail"\n\n# Logical operators\nage = 20\nhas_id = True\nif age >= 18 and has_id:\n    print("Access granted")\n\n# in operator\nfruits = ["apple", "banana", "mango"]\nif "apple" in fruits:\n    print("Found apple!")',
     lang:'python',
     keyPoints:['elif thay else if, indent bắt buộc','and/or/not thay &&/||/!','Ternary: value_if_true if condition else value_if_false'],
     exercise:'Viết chương trình kiểm tra năm nhuận.'},

    {id:'loops',title:'Vòng lặp & Range',
     theory:'<p><code>for</code> duyệt qua iterable (list, range, string...). <code>while</code> lặp khi điều kiện đúng. <code>range(start, stop, step)</code> tạo dãy số.</p>',
     code:'# for + range\nfor i in range(5):\n    print(i, end=" ")  # 0 1 2 3 4\nprint()\n\n# for duyệt list\ncolors = ["red", "green", "blue"]\nfor i, color in enumerate(colors):\n    print(f"{i}: {color}")\n\n# while\nn = 5\nfactorial = 1\nwhile n > 1:\n    factorial *= n\n    n -= 1\nprint(f"5! = {factorial}")  # 120\n\n# List comprehension (vòng lặp 1 dòng)\nsquares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\nprint(squares)  # [0, 1, 4, 9, ...]\nprint(evens)    # [0, 2, 4, 6, ...]',
     lang:'python',
     keyPoints:['range(start, stop, step) tạo dãy số','enumerate() cho index + value','List comprehension: [expr for x in iter if cond]'],
     exercise:'Dùng list comprehension tạo bảng cửu chương 2-9.'},

    {id:'functions',title:'Hàm & Lambda',
     theory:'<p><code>def</code> khai báo hàm. Python hỗ trợ default params, *args (tuple), **kwargs (dict). <code>lambda</code> là hàm anonymous 1 dòng.</p>',
     code:'# Basic function\ndef greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("An"))           # Hello, An!\nprint(greet("An", "Hi"))     # Hi, An!\n\n# *args, **kwargs\ndef stats(*numbers):\n    return {\n        "sum": sum(numbers),\n        "avg": sum(numbers) / len(numbers),\n        "max": max(numbers)\n    }\nprint(stats(4, 7, 2, 9, 1))\n\n# Lambda\nsquare = lambda x: x ** 2\nstudents = [("An", 8.5), ("Binh", 9.2), ("Chi", 7.8)]\nstudents.sort(key=lambda s: s[1], reverse=True)\nfor name, gpa in students:\n    print(f"{name}: {gpa}")\n\n# map, filter\nnums = [1, 2, 3, 4, 5]\ndoubled = list(map(lambda x: x*2, nums))\nodds = list(filter(lambda x: x%2, nums))',
     lang:'python',
     keyPoints:['*args nhận tuple, **kwargs nhận dict','lambda x: expr cho hàm anonymous','map/filter/sorted + lambda cho functional style'],
     exercise:'Viết decorator đếm số lần hàm được gọi.'},

    {id:'collections',title:'Collections & Data Structures',
     theory:'<p>Python có 4 collections built-in: <code>list</code> (mảng), <code>tuple</code> (bất biến), <code>dict</code> (key-value), <code>set</code> (tập hợp duy nhất). Mỗi cái có use case riêng.</p>',
     code:'# List - mảng mutable\ntasks = ["code", "eat", "sleep"]\ntasks.append("review")\ntasks.insert(0, "plan")\nprint(tasks[1:3])  # slicing\n\n# Dict - key:value\nuser = {\n    "name": "Minh",\n    "skills": ["Python", "JS"],\n    "level": 5\n}\nfor key, val in user.items():\n    print(f"  {key}: {val}")\n\n# Set - unique values\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a & b)  # intersection: {3, 4}\nprint(a | b)  # union: {1,2,3,4,5,6}\n\n# Tuple - immutable\npoint = (3, 4)\nx, y = point  # unpacking\nprint(f"x={x}, y={y}")\n\n# Dict comprehension\nscores = {"An": 9, "Binh": 6, "Chi": 8}\npassed = {k: v for k, v in scores.items() if v >= 7}\nprint(passed)  # {"An": 9, "Chi": 8}',
     lang:'python',
     keyPoints:['list mutable, tuple immutable, set unique','dict.items() cho key-value pairs','Set operations: & (and), | (or), - (difference)'],
     exercise:'Viết chương trình đếm tần suất từ trong một đoạn văn bản.'}
  ]},

  // ── JUNIOR (3 bài) ──
  {id:'junior',name:'Junior',badge:'junior',desc:'OOP, Modules & Error Handling',lessons:[
    {id:'oop',title:'OOP trong Python',
     theory:'<p>Python OOP dùng <code>class</code>. <code>__init__</code> là constructor, <code>self</code> tham chiếu đến instance. Inheritance với <code>class Child(Parent)</code>. Python hỗ trợ multiple inheritance.</p>',
     code:'class Animal:\n    def __init__(self, name, sound):\n        self.name = name\n        self._sound = sound  # protected convention\n    \n    def speak(self):\n        return f"{self.name}: {self._sound}!"\n    \n    def __str__(self):\n        return f"Animal({self.name})"\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name, "Gau gau")\n        self.breed = breed\n    \n    def fetch(self, item):\n        return f"{self.name} fetched {item}!"\n\nclass Cat(Animal):\n    def __init__(self, name):\n        super().__init__(name, "Meo meo")\n\n# Polymorphism\nanimals = [Dog("Rex", "Husky"), Cat("Mimi"), Dog("Buddy", "Corgi")]\nfor a in animals:\n    print(a.speak())\n\nrex = Dog("Rex", "Husky")\nprint(rex.fetch("ball"))\nprint(isinstance(rex, Animal))  # True',
     lang:'python',
     keyPoints:['__init__ constructor, self = this','super().__init__() gọi constructor cha','_prefix convention cho protected, __prefix cho private (name mangling)'],
     exercise:'Tạo class hierarchy Shape → Circle, Rectangle, Triangle với area(), perimeter().'},

    {id:'modules',title:'Modules, Packages & File I/O',
     theory:'<p><code>import</code> dùng module sẵn có. <code>pip</code> cài packages bên ngoài. File I/O dùng <code>open()</code> với context manager <code>with</code> để auto-close. <code>json</code> module cho đọc/ghi JSON.</p>',
     code:'import os\nimport json\nfrom datetime import datetime\nfrom pathlib import Path\n\n# File I/O with context manager\nwith open("notes.txt", "w") as f:\n    f.write("Line 1\\n")\n    f.write("Line 2\\n")\n\nwith open("notes.txt", "r") as f:\n    lines = f.readlines()\n    print(lines)\n\n# JSON\ndata = {\n    "users": ["An", "Binh"],\n    "count": 2,\n    "timestamp": str(datetime.now())\n}\nwith open("data.json", "w") as f:\n    json.dump(data, f, indent=2)\n\nwith open("data.json") as f:\n    loaded = json.load(f)\n    print(loaded["users"])\n\n# OS & Path\nprint(os.getcwd())\nfor f in Path(".").glob("*.py"):\n    print(f"  {f}: {f.stat().st_size} bytes")',
     lang:'python',
     keyPoints:['with open() auto-close file khi xong','json.dump/load cho serialize/deserialize','pathlib.Path hiện đại hơn os.path'],
     exercise:'Viết script đọc CSV file và export sang JSON.'},

    {id:'error-handling',title:'Exception Handling & Debugging',
     theory:'<p><code>try/except/else/finally</code> xử lý lỗi. Custom exceptions kế thừa từ <code>Exception</code>. <code>raise</code> ném exception. <code>assert</code> kiểm tra điều kiện debug.</p>',
     code:'# Try/Except\ndef divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        return "Cannot divide by zero!"\n    except TypeError as e:\n        return f"Type error: {e}"\n    else:\n        return result\n    finally:\n        print("Division attempted")\n\nprint(divide(10, 3))   # 3.333...\nprint(divide(10, 0))   # Cannot divide by zero!\n\n# Custom Exception\nclass InsufficientFunds(Exception):\n    def __init__(self, balance, amount):\n        self.balance = balance\n        self.amount = amount\n        super().__init__(f"Need {amount}, have {balance}")\n\nclass Wallet:\n    def __init__(self, balance=0):\n        self.balance = balance\n    \n    def pay(self, amount):\n        if amount > self.balance:\n            raise InsufficientFunds(self.balance, amount)\n        self.balance -= amount\n        return self.balance\n\nw = Wallet(100)\ntry:\n    w.pay(150)\nexcept InsufficientFunds as e:\n    print(f"Error: {e}")  # Need 150, have 100',
     lang:'python',
     keyPoints:['except SpecificError bắt lỗi cụ thể, tránh bare except','else chạy khi không có lỗi, finally luôn chạy','Custom exceptions thừa hưởng Exception class'],
     exercise:'Tạo class Validator với custom exceptions cho email, password, age.'}
  ]},

  // ── MID (3 bài) ──
  {id:'mid',name:'Mid-Level',badge:'mid',desc:'Decorators, Generators & Advanced',lessons:[
    {id:'decorators',title:'Decorators & Closures',
     theory:'<p><strong>Decorator</strong> là hàm bọc hàm khác để thêm chức năng. <code>@decorator</code> syntax sugar. Closures là hàm giữ reference đến biến trong scope bên ngoài. Dùng <code>functools.wraps</code> giữ metadata.</p>',
     code:'import functools\nimport time\n\n# Timer decorator\ndef timer(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__} took {elapsed:.4f}s")\n        return result\n    return wrapper\n\n# Retry decorator with parameter\ndef retry(max_attempts=3):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, max_attempts + 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    print(f"Attempt {attempt} failed: {e}")\n                    if attempt == max_attempts:\n                        raise\n        return wrapper\n    return decorator\n\n@timer\n@retry(max_attempts=3)\ndef fetch_data(url):\n    print(f"Fetching {url}...")\n    return {"status": "ok"}\n\nresult = fetch_data("https://api.example.com")',
     lang:'python',
     keyPoints:['@decorator syntax sugar cho func = decorator(func)','functools.wraps giữ __name__, __doc__ gốc','Decorators có param cần 3 tầng nested functions'],
     exercise:'Viết decorator @cache lưu kết quả hàm (memoization).'},

    {id:'generators',title:'Generators & Iterators',
     theory:'<p><code>yield</code> biến hàm thành generator — tạo values <strong>lazy</strong> (theo yêu cầu), tiết kiệm RAM. Generator expressions tương tự list comprehension nhưng dùng <code>()</code>.</p>',
     code:'# Generator function\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\n# Lazy - chỉ tạo khi cần\nfor num in fibonacci(10):\n    print(num, end=" ")  # 0 1 1 2 3 5 8 13 21 34\nprint()\n\n# Generator expression\nnums = range(1_000_000)\nsum_squares = sum(x**2 for x in nums)  # Không tạo list!\nprint(f"Sum of squares: {sum_squares}")\n\n# Pipeline: chain generators\ndef read_lines(filename):\n    with open(filename) as f:\n        for line in f:\n            yield line.strip()\n\ndef filter_errors(lines):\n    for line in lines:\n        if "ERROR" in line:\n            yield line\n\ndef parse_error(lines):\n    for line in lines:\n        yield {"msg": line, "level": "ERROR"}',
     lang:'python',
     keyPoints:['yield tạo generator, trả về lazy iterator','Generator expression: (expr for x in iter) tiết kiệm RAM','Chaining generators tạo data pipeline hiệu quả'],
     exercise:'Viết generator đọc file log lớn (GB) và lọc theo pattern.'},

    {id:'type-hints',title:'Type Hints & Dataclasses',
     theory:'<p>Python 3.5+ hỗ trợ <strong>type hints</strong> cho code rõ ràng hơn. <code>dataclass</code> (Python 3.7+) tự tạo __init__, __repr__, __eq__. <code>typing</code> module cho complex types.</p>',
     code:'from dataclasses import dataclass, field\nfrom typing import Optional\nfrom datetime import datetime\n\n@dataclass\nclass Task:\n    title: str\n    priority: int = 1\n    done: bool = False\n    tags: list[str] = field(default_factory=list)\n    created: datetime = field(default_factory=datetime.now)\n    \n    def complete(self) -> None:\n        self.done = True\n    \n    def add_tag(self, tag: str) -> None:\n        if tag not in self.tags:\n            self.tags.append(tag)\n\ndef filter_tasks(\n    tasks: list[Task],\n    priority: Optional[int] = None,\n    done: Optional[bool] = None\n) -> list[Task]:\n    result = tasks\n    if priority is not None:\n        result = [t for t in result if t.priority >= priority]\n    if done is not None:\n        result = [t for t in result if t.done == done]\n    return result\n\ntasks = [\n    Task("Learn Python", priority=3),\n    Task("Buy groceries", priority=1),\n    Task("Read book", priority=2, tags=["personal"]),\n]\ntasks[0].complete()\nimportant = filter_tasks(tasks, priority=2, done=False)\nfor t in important:\n    print(f"  [{t.priority}] {t.title}")',
     lang:'python',
     keyPoints:['Type hints: def func(x: int) -> str giúp IDE + mypy','@dataclass tự tạo __init__, __repr__, __eq__','Optional[T] = T | None, field() cho default mutable'],
     exercise:'Tạo dataclass TodoApp với CRUD operations và type hints đầy đủ.'}
  ]},

  // ── SENIOR (3 bài) ──
  {id:'senior',name:'Senior',badge:'senior',desc:'Async, Testing & Web Frameworks',lessons:[
    {id:'async',title:'Async/Await & Concurrency',
     theory:'<p><code>asyncio</code> cho lập trình bất đồng bộ. <code>async def</code> tạo coroutine, <code>await</code> đợi kết quả. <code>asyncio.gather()</code> chạy nhiều tasks song song. Dùng cho I/O-bound tasks (network, file).</p>',
     code:'import asyncio\nimport time\n\nasync def fetch_data(name: str, delay: float) -> dict:\n    print(f"Fetching {name}...")\n    await asyncio.sleep(delay)  # simulate API call\n    return {"name": name, "data": f"Result from {name}"}\n\nasync def main():\n    # Sequential: 3s total\n    start = time.perf_counter()\n    r1 = await fetch_data("API-1", 1)\n    r2 = await fetch_data("API-2", 2)\n    print(f"Sequential: {time.perf_counter()-start:.1f}s")\n\n    # Concurrent: ~2s total!\n    start = time.perf_counter()\n    results = await asyncio.gather(\n        fetch_data("API-A", 1),\n        fetch_data("API-B", 2),\n        fetch_data("API-C", 1.5)\n    )\n    print(f"Concurrent: {time.perf_counter()-start:.1f}s")\n    for r in results:\n        print(f"  {r[\'name\']}: {r[\'data\']}")\n\nasyncio.run(main())',
     lang:'python',
     keyPoints:['async def tạo coroutine, await đợi kết quả','asyncio.gather() chạy song song nhiều coroutines','Dùng cho I/O-bound, KHÔNG phải CPU-bound (dùng multiprocessing)'],
     exercise:'Viết async web scraper tải 10 URLs đồng thời với aiohttp.'},

    {id:'testing',title:'Testing với pytest',
     theory:'<p><code>pytest</code> là framework test phổ biến nhất. Fixtures cung cấp test data. Parametrize chạy test với nhiều input. Mock thay thế dependencies. Coverage đo % code được test.</p>',
     code:'import pytest\n\n# Code to test\nclass Calculator:\n    def divide(self, a: float, b: float) -> float:\n        if b == 0:\n            raise ValueError("Cannot divide by zero")\n        return a / b\n    \n    def average(self, numbers: list[float]) -> float:\n        if not numbers:\n            raise ValueError("Empty list")\n        return sum(numbers) / len(numbers)\n\n# Fixture\n@pytest.fixture\ndef calc():\n    return Calculator()\n\n# Basic test\ndef test_divide(calc):\n    assert calc.divide(10, 2) == 5.0\n    assert calc.divide(-6, 3) == -2.0\n\n# Parametrize: test nhiều cases\n@pytest.mark.parametrize("a,b,expected", [\n    (10, 2, 5.0),\n    (7, 3, 2.333),\n    (0, 5, 0.0),\n])\ndef test_divide_cases(calc, a, b, expected):\n    assert calc.divide(a, b) == pytest.approx(expected, rel=1e-2)\n\n# Test exceptions\ndef test_divide_by_zero(calc):\n    with pytest.raises(ValueError, match="Cannot divide by zero"):\n        calc.divide(10, 0)\n\n# Run: pytest -v --cov=.',
     lang:'python',
     keyPoints:['pytest tự detect test_*.py files và test_ functions','@pytest.fixture cung cấp test dependencies','@pytest.mark.parametrize test nhiều cases 1 lần'],
     exercise:'Viết tests cho TodoApp: CRUD operations, edge cases, error handling.'},

    {id:'web-frameworks',title:'Web Backend: FastAPI',
     theory:'<p><strong>FastAPI</strong> là framework web hiện đại, nhanh nhất Python. Auto-generate API docs, type validation với Pydantic, native async support.</p>',
     code:'from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nfrom datetime import datetime\n\napp = FastAPI(title="Todo API")\n\nclass TodoCreate(BaseModel):\n    title: str\n    priority: int = 1\n\nclass Todo(TodoCreate):\n    id: int\n    done: bool = False\n    created_at: datetime = datetime.now()\n\ntodos: list[Todo] = []\nnext_id = 1\n\n@app.get("/todos")\nasync def list_todos(done: bool | None = None):\n    if done is not None:\n        return [t for t in todos if t.done == done]\n    return todos\n\n@app.post("/todos", status_code=201)\nasync def create_todo(data: TodoCreate):\n    global next_id\n    todo = Todo(id=next_id, **data.model_dump())\n    todos.append(todo)\n    next_id += 1\n    return todo\n\n@app.patch("/todos/{todo_id}")\nasync def toggle_todo(todo_id: int):\n    for t in todos:\n        if t.id == todo_id:\n            t.done = not t.done\n            return t\n    raise HTTPException(404, "Todo not found")\n\n# Run: uvicorn main:app --reload\n# Docs: http://localhost:8000/docs',
     lang:'python',
     keyPoints:['Pydantic BaseModel auto-validate request data','Path params, query params, request body tự động','Auto-generated Swagger docs tại /docs'],
     exercise:'Xây dựng REST API CRUD cho blog posts với FastAPI + SQLite.'}
  ]},

  // ── MASTER (2 bài) ──
  {id:'master',name:'Master',badge:'master',desc:'Metaclasses & Performance',lessons:[
    {id:'metaclasses',title:'Metaclasses & Descriptors',
     theory:'<p>Metaclass là "class của class" — kiểm soát cách class được tạo. Descriptors (<code>__get__, __set__</code>) kiểm soát attribute access. <code>__slots__</code> tối ưu memory.</p>',
     code:'# Descriptor for validation\nclass Validated:\n    def __init__(self, min_val=None, max_val=None):\n        self.min_val = min_val\n        self.max_val = max_val\n    \n    def __set_name__(self, owner, name):\n        self.name = f"_{name}"\n    \n    def __get__(self, obj, objtype=None):\n        return getattr(obj, self.name, None)\n    \n    def __set__(self, obj, value):\n        if self.min_val and value < self.min_val:\n            raise ValueError(f"Min is {self.min_val}")\n        if self.max_val and value > self.max_val:\n            raise ValueError(f"Max is {self.max_val}")\n        setattr(obj, self.name, value)\n\nclass Student:\n    age = Validated(min_val=0, max_val=150)\n    grade = Validated(min_val=0, max_val=10)\n    \n    def __init__(self, name, age, grade):\n        self.name = name\n        self.age = age\n        self.grade = grade\n\ns = Student("An", 20, 9.5)\nprint(f"{s.name}: age={s.age}, grade={s.grade}")\n# Student("X", -1, 5)  # ValueError!',
     lang:'python',
     keyPoints:['Metaclass: class Meta(type) kiểm soát class creation','Descriptor: __get__/__set__ cho property behavior','__slots__ giảm memory ~40% so với __dict__'],
     exercise:'Viết metaclass AutoRegister tự đăng ký tất cả subclass.'},

    {id:'performance',title:'Performance & CPython Internals',
     theory:'<p>Hiểu CPython internals: GIL, reference counting, memory pools. <code>cProfile</code> profiling. <code>multiprocessing</code> bypass GIL cho CPU-bound. <code>Cython</code>/<code>ctypes</code> gọi C từ Python.</p>',
     code:'import cProfile\nimport multiprocessing as mp\nfrom concurrent.futures import ProcessPoolExecutor\nimport time\n\ndef cpu_heavy(n):\n    """CPU-bound task"""\n    total = 0\n    for i in range(n):\n        total += i ** 2\n    return total\n\ndef benchmark():\n    N = 5_000_000\n    \n    # Single process\n    start = time.perf_counter()\n    result = cpu_heavy(N)\n    single_time = time.perf_counter() - start\n    print(f"Single: {single_time:.2f}s")\n    \n    # Multi process (bypasses GIL)\n    start = time.perf_counter()\n    chunks = [N // 4] * 4\n    with ProcessPoolExecutor(max_workers=4) as pool:\n        results = list(pool.map(cpu_heavy, chunks))\n    multi_time = time.perf_counter() - start\n    print(f"Multi:  {multi_time:.2f}s")\n    print(f"Speedup: {single_time/multi_time:.1f}x")\n\n# Profile\ncProfile.run("cpu_heavy(1000000)")\nbenchmark()',
     lang:'python',
     keyPoints:['GIL: chỉ 1 thread Python chạy tại 1 thời điểm','multiprocessing bypass GIL cho CPU-bound tasks','cProfile + line_profiler tìm bottleneck chính xác'],
     exercise:'Profile và optimize hàm xử lý 1 triệu records, đạt speedup 5x.'}
  ]}
]
};
