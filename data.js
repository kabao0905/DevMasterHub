/* DevMaster Hub — Curriculum Data */
const CURRICULUM = {

// ═══════════════ C++ ═══════════════
cpp: {
  id:'cpp', name:'C++', icon:'⚡', color:'#00599C',
  gradient:'linear-gradient(135deg,#00599C,#004482)',
  category:'language',
  description:'Lập trình hệ thống, game engine, ứng dụng hiệu năng cao',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp cơ bản & nền tảng',lessons:[
      {id:'intro',title:'Hello World & Cài đặt',
       theory:'<p>C++ là ngôn ngữ lập trình mạnh mẽ, được sử dụng cho game, hệ điều hành, và ứng dụng hiệu năng cao. Mỗi chương trình C++ bắt đầu từ hàm <code>main()</code>.</p><p><strong>#include</strong> dùng để import thư viện. <code>iostream</code> cho phép xuất/nhập dữ liệu với <code>cout</code> và <code>cin</code>.</p>',
       code:'#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << "Toi dang hoc C++!" << endl;\n    return 0;\n}',
       lang:'cpp',
       keyPoints:['#include <iostream> để dùng cout/cin','main() là điểm bắt đầu chương trình','endl xuống dòng, return 0 = thành công'],
       exercise:'Viết chương trình in ra tên và tuổi của bạn.'},
      {id:'variables',title:'Biến & Kiểu dữ liệu',
       theory:'<p>C++ có các kiểu dữ liệu cơ bản: <code>int</code> (số nguyên), <code>double</code> (số thực), <code>char</code> (ký tự), <code>string</code> (chuỗi), <code>bool</code> (true/false).</p><p>Biến phải được <strong>khai báo kiểu</strong> trước khi dùng. Dùng <code>const</code> cho hằng số.</p>',
       code:'#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int age = 20;\n    double gpa = 3.75;\n    string name = "Minh";\n    bool isStudent = true;\n    const double PI = 3.14159;\n\n    cout << name << " - " << age << " tuoi" << endl;\n    cout << "GPA: " << gpa << endl;\n    return 0;\n}',
       lang:'cpp',
       keyPoints:['int, double, char, string, bool là kiểu cơ bản','const cho giá trị không đổi','string cần #include <string>'],
       exercise:'Khai báo biến lưu thông tin sinh viên (tên, tuổi, GPA) và in ra.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'OOP & quản lý bộ nhớ',lessons:[
      {id:'oop-basics',title:'Class & Object cơ bản',
       theory:'<p>OOP trong C++ dùng <code>class</code> để tạo kiểu dữ liệu tùy chỉnh. Class chứa <strong>attributes</strong> (dữ liệu) và <strong>methods</strong> (hành vi).</p><p>Dùng <code>public</code>, <code>private</code>, <code>protected</code> để kiểm soát truy cập. Constructor khởi tạo object.</p>',
       code:'#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Player {\nprivate:\n    string name;\n    int hp;\npublic:\n    Player(string n, int h) : name(n), hp(h) {}\n    \n    void takeDamage(int dmg) {\n        hp = max(0, hp - dmg);\n        cout << name << " HP: " << hp << endl;\n    }\n    \n    bool isAlive() { return hp > 0; }\n};\n\nint main() {\n    Player p("Hero", 100);\n    p.takeDamage(30);\n    cout << "Alive: " << p.isAlive() << endl;\n}',
       lang:'cpp',
       keyPoints:['class gom data + methods','private ẩn dữ liệu, public cho truy cập','Constructor dùng initializer list (:) hiệu quả hơn'],
       exercise:'Tạo class BankAccount với deposit, withdraw, getBalance.'},
      {id:'pointers',title:'Pointers & References',
       theory:'<p><strong>Pointer</strong> (<code>*</code>) lưu địa chỉ bộ nhớ. <strong>Reference</strong> (<code>&</code>) là alias cho biến khác. Đây là sức mạnh cốt lõi của C++.</p><p>Dùng <code>new</code> cấp phát heap, <code>delete</code> giải phóng. Quên delete → <strong>memory leak</strong>!</p>',
       code:'#include <iostream>\nusing namespace std;\n\nvoid swap(int& a, int& b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\nint main() {\n    int x = 10;\n    int* ptr = &x;     // pointer to x\n    int& ref = x;      // reference to x\n    \n    cout << "Value: " << *ptr << endl;  // dereference\n    cout << "Address: " << ptr << endl;\n    \n    int a = 5, b = 10;\n    swap(a, b);  // pass by reference\n    cout << a << " " << b << endl; // 10 5\n    \n    int* arr = new int[5]; // heap allocation\n    delete[] arr;          // MUST free!\n}',
       lang:'cpp',
       keyPoints:['* khai báo pointer, & lấy địa chỉ','Reference truyền tham chiếu, tránh copy','new/delete quản lý heap, luôn free bộ nhớ'],
       exercise:'Viết hàm nhận pointer đến array, tìm min và max.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Templates, STL & Modern C++',lessons:[
      {id:'templates',title:'Templates & Generic Programming',
       theory:'<p>Templates cho phép viết code tổng quát cho nhiều kiểu dữ liệu. <code>template&lt;typename T&gt;</code> tạo hàm/class hoạt động với bất kỳ kiểu nào.</p><p>STL (Standard Template Library) dựa hoàn toàn trên templates: vector, map, set, algorithm...</p>',
       code:'#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\ntemplate<typename T>\nT findMax(vector<T>& v) {\n    T maxVal = v[0];\n    for (const auto& item : v)\n        if (item > maxVal) maxVal = item;\n    return maxVal;\n}\n\nint main() {\n    vector<int> nums = {3, 7, 1, 9, 4};\n    cout << "Max: " << findMax(nums) << endl;\n    \n    // STL algorithms\n    sort(nums.begin(), nums.end());\n    auto it = find(nums.begin(), nums.end(), 7);\n    cout << "Found 7 at index: " << (it - nums.begin()) << endl;\n}',
       lang:'cpp',
       keyPoints:['template<typename T> cho generic code','STL containers: vector, map, set, unordered_map','auto keyword giúp suy luận kiểu tự động'],
       exercise:'Viết template class Stack<T> với push, pop, top, isEmpty.'},
      {id:'smart-ptr',title:'Smart Pointers & RAII',
       theory:'<p>Modern C++ (C++11+) dùng <strong>smart pointers</strong> thay raw pointer: <code>unique_ptr</code> (sở hữu duy nhất), <code>shared_ptr</code> (chia sẻ), <code>weak_ptr</code> (không sở hữu).</p><p><strong>RAII</strong>: Resource tự giải phóng khi object ra khỏi scope. Không cần delete thủ công!</p>',
       code:'#include <iostream>\n#include <memory>\nusing namespace std;\n\nclass Database {\npublic:\n    Database(string n) : name(n) { cout << name << " opened\\n"; }\n    ~Database() { cout << name << " closed\\n"; }\n    void query(string q) { cout << "Query: " << q << endl; }\nprivate:\n    string name;\n};\n\nint main() {\n    // unique_ptr: auto-delete khi ra scope\n    auto db = make_unique<Database>("MainDB");\n    db->query("SELECT * FROM users");\n    \n    // shared_ptr: nhiều owner, delete khi count = 0\n    auto config = make_shared<Database>("ConfigDB");\n    auto backup = config; // count = 2\n    cout << "Refs: " << config.use_count() << endl;\n} // Tự động close tất cả!',
       lang:'cpp',
       keyPoints:['unique_ptr: 1 owner, không copy được, dùng move()','shared_ptr: đếm reference, auto delete khi count=0','make_unique/make_shared an toàn hơn new'],
       exercise:'Refactor code dùng raw pointer sang smart pointer.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Concurrency, Design Patterns & Optimization',lessons:[
      {id:'concurrency',title:'Multithreading & Concurrency',
       theory:'<p>C++11 cung cấp <code>std::thread</code>, <code>mutex</code>, <code>condition_variable</code>, <code>future/promise</code> cho lập trình đa luồng.</p><p><strong>Race condition</strong> xảy ra khi nhiều thread truy cập chung data. Dùng <code>lock_guard</code> hoặc <code>unique_lock</code> để bảo vệ.</p>',
       code:'#include <iostream>\n#include <thread>\n#include <mutex>\n#include <vector>\nusing namespace std;\n\nmutex mtx;\nint counter = 0;\n\nvoid increment(int times) {\n    for (int i = 0; i < times; i++) {\n        lock_guard<mutex> lock(mtx);\n        counter++;\n    }\n}\n\nint main() {\n    vector<thread> threads;\n    for (int i = 0; i < 4; i++)\n        threads.emplace_back(increment, 10000);\n    \n    for (auto& t : threads) t.join();\n    cout << "Counter: " << counter << endl; // 40000\n}',
       lang:'cpp',
       keyPoints:['std::thread tạo thread, .join() đợi kết thúc','mutex + lock_guard tránh race condition','atomic<int> cho operations đơn giản, nhanh hơn mutex'],
       exercise:'Viết producer-consumer pattern dùng condition_variable.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Metaprogramming & System Design',lessons:[
      {id:'metaprog',title:'Template Metaprogramming',
       theory:'<p>Template metaprogramming tính toán <strong>tại compile-time</strong>. C++17 <code>constexpr if</code> và C++20 <code>concepts</code> làm code generic an toàn và rõ ràng hơn.</p><p>SFINAE, CRTP, và variadic templates là kỹ thuật nâng cao cho library design.</p>',
       code:'#include <iostream>\n#include <concepts>\nusing namespace std;\n\n// C++20 Concepts\ntemplate<typename T>\nconcept Numeric = is_arithmetic_v<T>;\n\ntemplate<Numeric T>\nT safeDiv(T a, T b) {\n    if (b == 0) throw runtime_error("Division by zero");\n    return a / b;\n}\n\n// Compile-time computation\nconstexpr int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    cout << safeDiv(10.0, 3.0) << endl;\n    // safeDiv("a", "b"); // Compile error! Not Numeric\n    \n    constexpr int f10 = factorial(10); // Computed at COMPILE TIME\n    cout << "10! = " << f10 << endl;\n}',
       lang:'cpp',
       keyPoints:['concepts (C++20) ràng buộc template rõ ràng','constexpr tính toán tại compile-time','CRTP: Curiously Recurring Template Pattern cho static polymorphism'],
       exercise:'Viết concept Sortable và hàm sort tổng quát dùng concepts.'}
    ]}
  ]
},

// ═══════════════ PYTHON ═══════════════
python: {
  id:'python', name:'Python', icon:'🐍', color:'#3776AB',
  gradient:'linear-gradient(135deg,#3776AB,#FFD43B)',
  category:'language',
  description:'Data Science, AI/ML, Web, Automation — ngôn ngữ đa năng nhất',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Syntax & cấu trúc dữ liệu cơ bản',lessons:[
      {id:'basics',title:'Cú pháp Python cơ bản',
       theory:'<p>Python dùng <strong>indentation</strong> thay dấu ngoặc {}. Không cần khai báo kiểu — Python tự suy luận. Print, input, biến, kiểu dữ liệu cơ bản.</p>',
       code:'# Biến không cần khai báo kiểu\nname = "Python"\nversion = 3.12\nis_awesome = True\n\n# f-string formatting (Python 3.6+)\nprint(f"{name} {version} is awesome: {is_awesome}")\n\n# Input\nage = int(input("Tuổi của bạn: "))\nprint(f"Bạn {age} tuổi, sinh năm {2026 - age}")\n\n# Conditional\nif age >= 18:\n    print("Đủ tuổi!")\nelse:\n    print("Chưa đủ tuổi")',
       lang:'python',
       keyPoints:['Indentation (4 spaces) thay thế {}','f-string: f"text {variable}" tiện hơn + nối chuỗi','input() luôn trả string, cần int()/float() chuyển đổi'],
       exercise:'Viết chương trình tính BMI từ cân nặng và chiều cao.'},
      {id:'collections',title:'List, Dict, Set, Tuple',
       theory:'<p><code>list</code> = mảng động, <code>dict</code> = key-value, <code>set</code> = tập hợp unique, <code>tuple</code> = list bất biến. List comprehension là cú pháp mạnh mẽ nhất của Python.</p>',
       code:'# List comprehension\nnums = [x**2 for x in range(10) if x % 2 == 0]\nprint(nums)  # [0, 4, 16, 36, 64]\n\n# Dictionary\nstudent = {"name": "An", "age": 20, "gpa": 3.8}\nfor key, val in student.items():\n    print(f"{key}: {val}")\n\n# Set operations\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a & b)  # intersection: {3, 4}\nprint(a | b)  # union: {1, 2, 3, 4, 5, 6}\n\n# Unpacking\nfirst, *rest = [1, 2, 3, 4, 5]\nprint(first, rest)  # 1 [2, 3, 4, 5]',
       lang:'python',
       keyPoints:['List comprehension: [expr for x in iter if cond]','Dict: .get(key, default) tránh KeyError','.items(), .keys(), .values() duyệt dictionary'],
       exercise:'Đếm tần suất từ trong một đoạn văn bản dùng dict.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'OOP, Modules & Error Handling',lessons:[
      {id:'oop',title:'OOP trong Python',
       theory:'<p>Python hỗ trợ OOP đầy đủ: class, inheritance, polymorphism, encapsulation. Dùng <code>__init__</code> làm constructor, <code>self</code> tham chiếu instance.</p>',
       code:'from dataclasses import dataclass\nfrom abc import ABC, abstractmethod\n\n# Modern Python: dataclass\n@dataclass\nclass Product:\n    name: str\n    price: float\n    quantity: int = 0\n    \n    @property\n    def total(self):\n        return self.price * self.quantity\n\n# Abstract class\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float: ...\n\nclass Circle(Shape):\n    def __init__(self, radius: float):\n        self.radius = radius\n    def area(self) -> float:\n        return 3.14159 * self.radius ** 2\n\np = Product("Laptop", 999.99, 3)\nprint(f"{p.name}: ${p.total:,.2f}")\nc = Circle(5)\nprint(f"Area: {c.area():.2f}")',
       lang:'python',
       keyPoints:['@dataclass giảm boilerplate cho data classes','@property biến method thành attribute','ABC + @abstractmethod bắt buộc implement'],
       exercise:'Tạo hierarchy Animal → Dog, Cat với abstract method speak().'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Decorators, Generators & Async',lessons:[
      {id:'decorators',title:'Decorators & Generators',
       theory:'<p><strong>Decorator</strong> wrap function để thêm behavior. <strong>Generator</strong> dùng <code>yield</code> tạo lazy sequence tiết kiệm bộ nhớ. Đây là 2 tính năng Python-specific quan trọng nhất.</p>',
       code:'import time\nfrom functools import wraps\n\n# Decorator: measure execution time\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__}: {elapsed:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef process_data(n):\n    return sum(x**2 for x in range(n))\n\n# Generator: lazy infinite sequence\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nprocess_data(1_000_000)\n\nfib = fibonacci()\nfirst_10 = [next(fib) for _ in range(10)]\nprint(first_10)',
       lang:'python',
       keyPoints:['@wraps giữ metadata của function gốc','Generator yield từng giá trị, không load hết vào RAM','*args, **kwargs nhận arguments linh hoạt'],
       exercise:'Viết decorator @retry(max=3) tự thử lại khi function raise exception.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Architecture, Testing & Performance',lessons:[
      {id:'async',title:'Async/Await & Concurrency',
       theory:'<p>Python <code>asyncio</code> cho I/O-bound tasks (API calls, file, DB). <code>async def</code> định nghĩa coroutine, <code>await</code> đợi kết quả. <code>asyncio.gather()</code> chạy nhiều tasks song song.</p>',
       code:'import asyncio\n\nasync def fetch_data(url: str, delay: float) -> dict:\n    print(f"Fetching {url}...")\n    await asyncio.sleep(delay)  # simulate API call\n    return {"url": url, "status": 200}\n\nasync def main():\n    # Run 3 requests concurrently (not sequentially!)\n    tasks = [\n        fetch_data("api/users", 1.0),\n        fetch_data("api/posts", 1.5),\n        fetch_data("api/comments", 0.8),\n    ]\n    results = await asyncio.gather(*tasks)\n    for r in results:\n        print(f"{r[\'url\']}: {r[\'status\']}")\n\nasyncio.run(main())\n# Total time: ~1.5s (not 3.3s!)',
       lang:'python',
       keyPoints:['async/await cho I/O-bound, NOT CPU-bound','asyncio.gather() chạy song song, nhanh hơn sequential','CPU-bound dùng multiprocessing thay asyncio'],
       exercise:'Viết async web scraper fetch 10 URLs đồng thời.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Metaclasses, C Extensions & System Design',lessons:[
      {id:'metaclass',title:'Metaclasses & Descriptors',
       theory:'<p>Metaclass kiểm soát cách class được tạo. Descriptor protocol (<code>__get__</code>, <code>__set__</code>) điều khiển attribute access. Đây là nền tảng của Django ORM, SQLAlchemy, Pydantic.</p>',
       code:'# Descriptor: validate attribute types\nclass Typed:\n    def __init__(self, name, expected_type):\n        self.name = name\n        self.expected_type = expected_type\n    \n    def __set__(self, obj, value):\n        if not isinstance(value, self.expected_type):\n            raise TypeError(f"{self.name} must be {self.expected_type.__name__}")\n        obj.__dict__[self.name] = value\n    \n    def __get__(self, obj, cls):\n        return obj.__dict__.get(self.name)\n\n# Metaclass: auto-register all subclasses\nclass PluginMeta(type):\n    registry = {}\n    def __new__(mcs, name, bases, namespace):\n        cls = super().__new__(mcs, name, bases, namespace)\n        if bases:  # skip base class itself\n            mcs.registry[name] = cls\n        return cls\n\nclass Plugin(metaclass=PluginMeta): pass\nclass AuthPlugin(Plugin): pass\nclass CachePlugin(Plugin): pass\nprint(PluginMeta.registry)  # {AuthPlugin, CachePlugin}',
       lang:'python',
       keyPoints:['Metaclass = "class of a class", kiểm soát class creation','Descriptor protocol: __get__, __set__, __delete__','99% trường hợp dùng class decorator thay metaclass'],
       exercise:'Viết metaclass Singleton đảm bảo chỉ 1 instance.'}
    ]}
  ]
},

// ═══════════════ JAVA ═══════════════
java: {
  id:'java', name:'Java', icon:'☕', color:'#ED8B00',
  gradient:'linear-gradient(135deg,#ED8B00,#5382A1)',
  category:'language',
  description:'Enterprise, Android, microservices — ngôn ngữ phổ biến nhất thế giới',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp & OOP cơ bản',lessons:[
      {id:'basics',title:'Java Fundamentals',
       theory:'<p>Java là ngôn ngữ <strong>strongly-typed</strong>, chạy trên JVM. Mọi code phải nằm trong <code>class</code>. File .java → compile → .class bytecode → JVM thực thi.</p>',
       code:'public class Main {\n    public static void main(String[] args) {\n        // Variables\n        String name = "Java";\n        int version = 21;\n        var message = "Hello " + name + " " + version; // var (Java 10+)\n        \n        System.out.println(message);\n        \n        // Enhanced switch (Java 14+)\n        String level = switch (version) {\n            case 8 -> "Legacy";\n            case 11, 17 -> "LTS";\n            case 21 -> "Latest LTS";\n            default -> "Other";\n        };\n        System.out.println("Level: " + level);\n    }\n}',
       lang:'java',
       keyPoints:['Mỗi file = 1 public class cùng tên file','var (Java 10+) tự suy luận kiểu local variable','Enhanced switch expression (Java 14+) ngắn gọn hơn'],
       exercise:'Viết chương trình tính điểm trung bình và xếp loại sinh viên.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Collections, Streams & Exception Handling',lessons:[
      {id:'collections',title:'Collections Framework & Streams',
       theory:'<p>Java Collections: <code>List</code>, <code>Set</code>, <code>Map</code>, <code>Queue</code>. Stream API (Java 8+) cho functional programming: filter, map, reduce trên collections.</p>',
       code:'import java.util.*;\nimport java.util.stream.*;\n\npublic class StreamDemo {\n    record Student(String name, double gpa, String major) {}\n    \n    public static void main(String[] args) {\n        var students = List.of(\n            new Student("An", 3.8, "CS"),\n            new Student("Binh", 3.2, "Math"),\n            new Student("Chi", 3.9, "CS"),\n            new Student("Dung", 2.8, "CS")\n        );\n        \n        // Stream pipeline\n        var topCS = students.stream()\n            .filter(s -> s.major().equals("CS"))\n            .filter(s -> s.gpa() >= 3.5)\n            .sorted(Comparator.comparing(Student::gpa).reversed())\n            .map(Student::name)\n            .collect(Collectors.toList());\n        \n        System.out.println("Top CS: " + topCS); // [Chi, An]\n        \n        // Statistics\n        var stats = students.stream()\n            .mapToDouble(Student::gpa)\n            .summaryStatistics();\n        System.out.printf("Avg GPA: %.2f%n", stats.getAverage());\n    }\n}',
       lang:'java',
       keyPoints:['record (Java 16+) thay POJO boilerplate','Stream: filter → map → collect pipeline','Collectors.groupingBy() nhóm dữ liệu mạnh mẽ'],
       exercise:'Dùng Stream API nhóm students theo major, tính GPA trung bình mỗi nhóm.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Generics, Design Patterns & JDBC',lessons:[
      {id:'generics',title:'Generics & Design Patterns',
       theory:'<p>Generics cho type safety tại compile-time. Wildcard: <code>? extends T</code> (upper bound), <code>? super T</code> (lower bound). PECS: Producer Extends, Consumer Super.</p>',
       code:'import java.util.*;\nimport java.util.function.*;\n\n// Generic repository pattern\npublic interface Repository<T, ID> {\n    Optional<T> findById(ID id);\n    List<T> findAll();\n    T save(T entity);\n    void deleteById(ID id);\n}\n\n// Builder pattern with generics\npublic class QueryBuilder<T> {\n    private final List<Predicate<T>> filters = new ArrayList<>();\n    \n    public QueryBuilder<T> where(Predicate<T> condition) {\n        filters.add(condition);\n        return this; // fluent API\n    }\n    \n    public List<T> execute(List<T> data) {\n        return data.stream()\n            .filter(filters.stream().reduce(Predicate::and).orElse(x -> true))\n            .collect(Collectors.toList());\n    }\n}\n// Usage: new QueryBuilder<User>()\n//   .where(u -> u.age() > 18)\n//   .where(u -> u.active())\n//   .execute(users);',
       lang:'java',
       keyPoints:['Generic <T> cho type-safe reusable code','Builder pattern = fluent API, method chaining','Optional thay null, tránh NullPointerException'],
       exercise:'Implement Observer pattern generic cho event system.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Spring Boot, Concurrency & Architecture',lessons:[
      {id:'spring',title:'Spring Boot Essentials',
       theory:'<p>Spring Boot = framework enterprise #1. Auto-configuration, dependency injection, REST API, JPA/Hibernate. Annotation-driven: <code>@RestController</code>, <code>@Service</code>, <code>@Repository</code>.</p>',
       code:'@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n    private final UserService userService;\n    \n    public UserController(UserService userService) {\n        this.userService = userService; // Constructor injection\n    }\n    \n    @GetMapping\n    public List<UserDTO> getAll() {\n        return userService.findAll();\n    }\n    \n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public UserDTO create(@Valid @RequestBody CreateUserRequest req) {\n        return userService.create(req);\n    }\n    \n    @GetMapping("/{id}")\n    public UserDTO getById(@PathVariable Long id) {\n        return userService.findById(id)\n            .orElseThrow(() -> new ResponseStatusException(\n                HttpStatus.NOT_FOUND, "User not found"));\n    }\n}',
       lang:'java',
       keyPoints:['Constructor injection > @Autowired field injection','@Valid + DTO validation tự động','Exception handling với @ControllerAdvice global'],
       exercise:'Xây dựng REST API CRUD với Spring Boot + JPA + Validation.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'JVM Internals, Performance Tuning & Reactive',lessons:[
      {id:'jvm',title:'JVM Internals & GC Tuning',
       theory:'<p>Master Java = hiểu JVM: Class loading, JIT compilation, Garbage Collection (G1GC, ZGC, Shenandoah). Profiling với JFR, async-profiler. Virtual Threads (Java 21) = game changer cho concurrency.</p>',
       code:'// Java 21: Virtual Threads\nimport java.util.concurrent.*;\n\npublic class VirtualThreadDemo {\n    public static void main(String[] args) throws Exception {\n        // Create 100,000 virtual threads (impossible with platform threads!)\n        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n            var futures = new ArrayList<Future<String>>();\n            \n            for (int i = 0; i < 100_000; i++) {\n                final int id = i;\n                futures.add(executor.submit(() -> {\n                    Thread.sleep(1000); // simulate I/O\n                    return "Task " + id + " done";\n                }));\n            }\n            \n            System.out.println("All submitted!");\n            System.out.println("First result: " + futures.get(0).get());\n        }\n        // JVM flags for tuning:\n        // -XX:+UseZGC -Xmx4g -XX:+PrintGCDetails\n    }\n}',
       lang:'java',
       keyPoints:['Virtual Threads (Java 21): millions of threads, zero overhead','ZGC: sub-millisecond GC pauses cho real-time apps','JFR (Java Flight Recorder) cho production profiling'],
       exercise:'Benchmark Virtual Threads vs Platform Threads cho 10K HTTP calls.'}
    ]}
  ]
},

// ═══════════════ NODE.JS ═══════════════
nodejs: {
  id:'nodejs', name:'Node.js', icon:'🟢', color:'#68A063',
  gradient:'linear-gradient(135deg,#68A063,#3C873A)',
  category:'backend',
  description:'JavaScript runtime cho backend, API, real-time apps',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Node basics, npm & modules',lessons:[
      {id:'basics',title:'Node.js Fundamentals',
       theory:'<p>Node.js chạy JavaScript bên ngoài browser, dùng V8 engine. <strong>Event-driven</strong>, <strong>non-blocking I/O</strong> — xử lý nhiều requests đồng thời mà không cần thread.</p>',
       code:'// ES Modules (package.json: "type": "module")\nimport fs from "fs/promises";\nimport path from "path";\n\n// Async file operations\nasync function processFiles() {\n  const files = await fs.readdir("./data");\n  console.log(`Found ${files.length} files`);\n  \n  for (const file of files) {\n    const content = await fs.readFile(\n      path.join("./data", file), "utf-8"\n    );\n    console.log(`${file}: ${content.length} chars`);\n  }\n}\n\nprocessFiles().catch(console.error);\n\n// Environment variables\nconst PORT = process.env.PORT || 3000;\nconsole.log(`Port: ${PORT}`);',
       lang:'javascript',
       keyPoints:['ES Modules: import/export thay require()','fs/promises cho async file operations','process.env cho environment variables'],
       exercise:'Viết CLI tool đọc file JSON, thống kê số keys/values.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Express, REST API & Middleware',lessons:[
      {id:'express',title:'Express.js REST API',
       theory:'<p>Express là framework web phổ biến nhất cho Node.js. Middleware pattern: request → middleware chain → response. Router group, error handling, validation.</p>',
       code:'import express from "express";\n\nconst app = express();\napp.use(express.json());\n\n// Middleware: logging\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});\n\nlet todos = [];\nlet nextId = 1;\n\napp.get("/api/todos", (req, res) => {\n  res.json(todos);\n});\n\napp.post("/api/todos", (req, res) => {\n  const { title } = req.body;\n  if (!title) return res.status(400).json({ error: "Title required" });\n  const todo = { id: nextId++, title, done: false };\n  todos.push(todo);\n  res.status(201).json(todo);\n});\n\n// Error handler (must be last)\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: "Internal Server Error" });\n});\n\napp.listen(3000, () => console.log("Server: http://localhost:3000"));',
       lang:'javascript',
       keyPoints:['Middleware: (req, res, next) => next() chain','Error handler middleware có 4 params (err, req, res, next)','Status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found'],
       exercise:'Xây dựng full CRUD API cho Book management với validation.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Database, Auth & Testing',lessons:[
      {id:'auth',title:'Authentication & JWT',
       theory:'<p>JWT (JSON Web Token) = stateless auth. Access token (15min) + Refresh token (7d). Bcrypt hash password. Middleware xác thực mỗi request.</p>',
       code:'import jwt from "jsonwebtoken";\nimport bcrypt from "bcrypt";\n\nconst SECRET = process.env.JWT_SECRET;\n\n// Hash password\nconst hashPassword = (pw) => bcrypt.hash(pw, 12);\nconst checkPassword = (pw, hash) => bcrypt.compare(pw, hash);\n\n// Generate tokens\nfunction generateTokens(user) {\n  const access = jwt.sign(\n    { id: user.id, role: user.role },\n    SECRET,\n    { expiresIn: "15m" }\n  );\n  const refresh = jwt.sign(\n    { id: user.id },\n    SECRET,\n    { expiresIn: "7d" }\n  );\n  return { access, refresh };\n}\n\n// Auth middleware\nfunction auth(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "No token" });\n  try {\n    req.user = jwt.verify(token, SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: "Invalid token" });\n  }\n}\n\n// Protected route\napp.get("/api/profile", auth, (req, res) => {\n  res.json({ userId: req.user.id });\n});',
       lang:'javascript',
       keyPoints:['Bcrypt hash password, KHÔNG BAO GIỜ lưu plaintext','Access token ngắn hạn + Refresh token dài hạn','Authorization: Bearer <token> header standard'],
       exercise:'Implement full auth flow: register, login, refresh, logout.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Architecture, Scaling & DevOps',lessons:[
      {id:'arch',title:'Microservices & Event-Driven',
       theory:'<p>Senior Node.js = thiết kế hệ thống scalable. Message queue (Redis, RabbitMQ), event sourcing, CQRS, API Gateway. Docker + K8s deployment.</p>',
       code:'// Event-driven microservice with Redis pub/sub\nimport Redis from "ioredis";\n\nconst publisher = new Redis();\nconst subscriber = new Redis();\n\n// Service A: Order Service - publish events\nasync function createOrder(order) {\n  const saved = await db.orders.create(order);\n  await publisher.publish("order:created", JSON.stringify({\n    orderId: saved.id,\n    userId: order.userId,\n    items: order.items,\n    total: order.total,\n    timestamp: Date.now()\n  }));\n  return saved;\n}\n\n// Service B: Notification Service - subscribe\nsubscriber.subscribe("order:created", "payment:completed");\nsubscriber.on("message", (channel, message) => {\n  const data = JSON.parse(message);\n  switch (channel) {\n    case "order:created":\n      sendEmail(data.userId, `Order #${data.orderId} created`);\n      break;\n    case "payment:completed":\n      sendEmail(data.userId, "Payment confirmed!");\n      break;\n  }\n});',
       lang:'javascript',
       keyPoints:['Pub/Sub decouple services, async communication','Event sourcing: store events, rebuild state','CQRS: tách read/write models cho performance'],
       exercise:'Thiết kế hệ thống e-commerce với 3 microservices.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'V8 Internals, Performance & System Design',lessons:[
      {id:'v8',title:'V8 Engine & Performance Tuning',
       theory:'<p>V8 pipeline: Parse → AST → Ignition (bytecode) → Sparkplug → TurboFan (optimized). Hidden classes, inline caching, deoptimization. Profiling với --prof, clinic.js.</p>',
       code:'// Performance: Object shape consistency\n// BAD: V8 creates new hidden class each time\nfunction createBad(type) {\n  const obj = {};\n  if (type === "a") { obj.x = 1; obj.y = 2; }\n  else { obj.y = 2; obj.x = 1; } // Different order!\n  return obj;\n}\n\n// GOOD: Same shape (hidden class reuse)\nclass Point {\n  constructor(x, y) {\n    this.x = x;  // Always same order\n    this.y = y;\n  }\n}\n\n// Memory leak detection\nimport v8 from "v8";\n\nfunction checkMemory() {\n  const heap = v8.getHeapStatistics();\n  console.log({\n    total: (heap.total_heap_size / 1e6).toFixed(1) + "MB",\n    used: (heap.used_heap_size / 1e6).toFixed(1) + "MB",\n    limit: (heap.heap_size_limit / 1e6).toFixed(1) + "MB"\n  });\n}\n\n// Worker Threads for CPU-bound\nimport { Worker, isMainThread, workerData } from "worker_threads";\nif (isMainThread) {\n  const worker = new Worker(new URL(import.meta.url), {\n    workerData: { task: "heavy-computation" }\n  });\n  worker.on("message", (result) => console.log(result));\n}',
       lang:'javascript',
       keyPoints:['Object shape consistency = V8 optimization key','Worker Threads cho CPU-bound tasks','clinic.js: flame graphs, event loop lag detection'],
       exercise:'Profile một app với --prof, tìm và fix bottleneck.'}
    ]}
  ]
},

// ═══════════════ REACT ═══════════════
react: {
  id:'react', name:'React', icon:'⚛️', color:'#61DAFB',
  gradient:'linear-gradient(135deg,#61DAFB,#087EA4)',
  category:'frontend',
  description:'UI library phổ biến nhất — Component-based, Virtual DOM',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'JSX, Components & Props',lessons:[
      {id:'jsx',title:'JSX & Components đầu tiên',
       theory:'<p>React dùng <strong>JSX</strong> — HTML trong JavaScript. Component là function trả về JSX. Props truyền data từ parent → child, <strong>one-way data flow</strong>.</p>',
       code:'function Welcome({ name, role }) {\n  return (\n    <div className="card">\n      <h2>Xin chào, {name}!</h2>\n      <p>Role: {role}</p>\n    </div>\n  );\n}\n\nfunction App() {\n  const users = ["An", "Bình", "Chi"];\n  return (\n    <div>\n      {users.map(user => (\n        <Welcome key={user} name={user} role="Dev" />\n      ))}\n    </div>\n  );\n}\n\nexport default App;',
       lang:'jsx',
       keyPoints:['Component = function trả về JSX','Props là read-only, one-way data flow','key prop bắt buộc khi render list'],
       exercise:'Tạo component ProductCard nhận name, price, image props.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Hooks, State & Effects',lessons:[
      {id:'hooks',title:'useState & useEffect',
       theory:'<p><code>useState</code> quản lý state local. <code>useEffect</code> cho side effects (API calls, subscriptions). Rules: chỉ gọi hooks ở top level, chỉ trong function components.</p>',
       code:'import { useState, useEffect } from "react";\n\nfunction UserList() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [search, setSearch] = useState("");\n\n  useEffect(() => {\n    fetch("/api/users")\n      .then(res => res.json())\n      .then(data => { setUsers(data); setLoading(false); })\n      .catch(console.error);\n  }, []); // [] = run once on mount\n\n  const filtered = users.filter(u =>\n    u.name.toLowerCase().includes(search.toLowerCase())\n  );\n\n  if (loading) return <p>Loading...</p>;\n\n  return (\n    <div>\n      <input\n        value={search}\n        onChange={e => setSearch(e.target.value)}\n        placeholder="Tìm kiếm..."\n      />\n      {filtered.map(u => <p key={u.id}>{u.name}</p>)}\n    </div>\n  );\n}',
       lang:'jsx',
       keyPoints:['useState: [value, setter] = useState(initial)','useEffect dependency array: [] = mount, [dep] = khi dep thay đổi','Derived state (filtered) tính từ state, không cần useState riêng'],
       exercise:'Tạo Todo app với add, delete, filter, và localStorage persistence.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Custom Hooks, Context & Patterns',lessons:[
      {id:'patterns',title:'Custom Hooks & Performance',
       theory:'<p>Custom hooks extract logic tái sử dụng. <code>useMemo</code> cache expensive computations, <code>useCallback</code> memoize functions. React.memo() prevent unnecessary re-renders.</p>',
       code:'import { useState, useMemo, useCallback } from "react";\n\n// Custom hook: reusable API fetching\nfunction useApi(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let cancelled = false;\n    setLoading(true);\n    fetch(url)\n      .then(r => r.json())\n      .then(d => { if (!cancelled) { setData(d); setLoading(false); }})\n      .catch(e => { if (!cancelled) { setError(e); setLoading(false); }});\n    return () => { cancelled = true; }; // cleanup\n  }, [url]);\n\n  return { data, loading, error };\n}\n\n// Usage\nfunction Dashboard() {\n  const { data: users, loading } = useApi("/api/users");\n  const [filter, setFilter] = useState("");\n\n  // Memoize expensive filter\n  const filtered = useMemo(() =>\n    (users || []).filter(u => u.name.includes(filter)),\n    [users, filter]\n  );\n\n  const handleClick = useCallback((id) => {\n    console.log("Click:", id);\n  }, []);\n\n  if (loading) return <Spinner />;\n  return filtered.map(u => (\n    <UserCard key={u.id} user={u} onClick={handleClick} />\n  ));\n}',
       lang:'jsx',
       keyPoints:['Custom hooks: use prefix, extract reusable logic','useMemo cho expensive calculations, useCallback cho functions','Cleanup function trong useEffect tránh memory leaks'],
       exercise:'Viết useLocalStorage hook lưu state vào localStorage.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Architecture, Server Components & Advanced Patterns',lessons:[
      {id:'architecture',title:'React Architecture Patterns',
       theory:'<p>Senior React: compound components, render props, HOC vs hooks, state machines. Server Components (RSC) giảm bundle size. Suspense + Error Boundaries cho robust UX.</p>',
       code:'// Compound Components Pattern\nconst Tabs = ({ children, defaultTab }) => {\n  const [active, setActive] = useState(defaultTab);\n  return (\n    <TabsContext.Provider value={{ active, setActive }}>\n      {children}\n    </TabsContext.Provider>\n  );\n};\n\nTabs.List = ({ children }) => (\n  <div className="tabs-list">{children}</div>\n);\n\nTabs.Tab = ({ id, children }) => {\n  const { active, setActive } = useContext(TabsContext);\n  return (\n    <button\n      className={active === id ? "active" : ""}\n      onClick={() => setActive(id)}\n    >{children}</button>\n  );\n};\n\nTabs.Panel = ({ id, children }) => {\n  const { active } = useContext(TabsContext);\n  return active === id ? <div>{children}</div> : null;\n};\n\n// Usage: composable & flexible\n<Tabs defaultTab="code">\n  <Tabs.List>\n    <Tabs.Tab id="code">Code</Tabs.Tab>\n    <Tabs.Tab id="preview">Preview</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel id="code"><CodeEditor /></Tabs.Panel>\n  <Tabs.Panel id="preview"><Preview /></Tabs.Panel>\n</Tabs>',
       lang:'jsx',
       keyPoints:['Compound components cho API linh hoạt, composable','Context + useReducer thay Redux cho medium apps','Error Boundary class component catch render errors'],
       exercise:'Xây dựng Form compound component với Field, Submit, Validation.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'React Internals, Fiber & Compiler',lessons:[
      {id:'internals',title:'React Fiber & Reconciliation',
       theory:'<p>React Fiber = reconciliation engine. Chia rendering thành units of work, pause/resume. Concurrent Mode, Suspense, Transitions. React Compiler (React 19) auto-memoize.</p>',
       code:'// React 19: use() hook + Server Components\nimport { use, Suspense, startTransition } from "react";\n\n// Fetching with use() — replaces useEffect for data\nasync function getUsers() {\n  const res = await fetch("/api/users");\n  return res.json();\n}\n\nfunction UserList({ usersPromise }) {\n  const users = use(usersPromise); // suspend until resolved\n  return users.map(u => <UserCard key={u.id} user={u} />);\n}\n\n// Actions (React 19)\nfunction CreateUser() {\n  const [state, formAction, isPending] = useActionState(\n    async (prev, formData) => {\n      const name = formData.get("name");\n      const res = await fetch("/api/users", {\n        method: "POST",\n        body: JSON.stringify({ name })\n      });\n      return res.json();\n    },\n    null\n  );\n\n  return (\n    <form action={formAction}>\n      <input name="name" />\n      <button disabled={isPending}>\n        {isPending ? "Creating..." : "Create"}\n      </button>\n    </form>\n  );\n}',
       lang:'jsx',
       keyPoints:['Fiber: incremental rendering, time-slicing','use() hook thay useEffect cho async data','React Compiler auto-memoize, không cần useMemo/useCallback'],
       exercise:'Implement optimistic UI update với useOptimistic.'}
    ]}
  ]
},

// ═══════════════ HTML/CSS ═══════════════
htmlcss: {
  id:'htmlcss', name:'HTML/CSS', icon:'🎨', color:'#E34C26',
  gradient:'linear-gradient(135deg,#E34C26,#264de4)',
  category:'frontend',
  description:'Nền tảng web — Structure & Styling cho mọi website',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'HTML cơ bản & CSS selectors',lessons:[
      {id:'basics',title:'HTML5 Semantic & CSS Basics',
       theory:'<p>HTML5 semantic tags: <code>header, nav, main, section, article, footer</code> thay vì div soup. CSS dùng selectors để style elements. <strong>Box Model</strong>: content → padding → border → margin.</p>',
       code:'<!-- Semantic HTML5 -->\n<header>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h1>Bài viết đầu tiên</h1>\n    <p>Nội dung bài viết...</p>\n  </article>\n</main>\n\n<style>\n  /* CSS Box Model */\n  article {\n    max-width: 800px;\n    margin: 0 auto;        /* center */\n    padding: 24px;         /* inner space */\n    border: 1px solid #ddd;\n    border-radius: 8px;\n  }\n  \n  h1 {\n    color: #1a1a2e;\n    font-size: 2rem;\n    margin-bottom: 0.5em;\n  }\n</style>',
       lang:'markup',
       keyPoints:['Semantic tags giúp SEO và accessibility','Box Model: content + padding + border + margin','margin: 0 auto center block element'],
       exercise:'Tạo profile card với avatar, tên, bio dùng semantic HTML.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Flexbox, Grid & Responsive',lessons:[
      {id:'layout',title:'Flexbox & Grid Layout',
       theory:'<p><strong>Flexbox</strong> cho 1 chiều (row/column). <strong>Grid</strong> cho 2 chiều (rows + columns). Media queries cho responsive. Mobile-first approach: style mobile trước, mở rộng cho desktop.</p>',
       code:'/* Flexbox: Navigation */\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 32px;\n  gap: 16px;\n}\n\n.nav-links {\n  display: flex;\n  gap: 24px;\n  list-style: none;\n}\n\n/* Grid: Card Layout */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 24px;\n  padding: 32px;\n}\n\n/* Responsive: Mobile First */\n.container {\n  padding: 16px;\n}\n\n@media (min-width: 768px) {\n  .container { padding: 32px; }\n  .card-grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (min-width: 1024px) {\n  .card-grid { grid-template-columns: repeat(3, 1fr); }\n}',
       lang:'css',
       keyPoints:['Flexbox: justify-content (main axis), align-items (cross axis)','Grid: repeat(auto-fill, minmax()) cho responsive grid','Mobile-first: style mobile default, @media min-width mở rộng'],
       exercise:'Tạo responsive dashboard layout với sidebar + grid content.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Animations, Variables & Modern CSS',lessons:[
      {id:'modern',title:'CSS Variables & Animations',
       theory:'<p>CSS Custom Properties (variables) cho theming. <code>@keyframes</code> cho animations. <code>transition</code> cho hover effects. <code>clamp()</code> cho responsive typography.</p>',
       code:':root {\n  --primary: #667eea;\n  --bg: #0a0e17;\n  --text: #e6edf3;\n  --radius: 12px;\n}\n\n/* Glassmorphism Card */\n.glass-card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: var(--radius);\n  padding: 24px;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.glass-card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);\n}\n\n/* Responsive Typography */\nh1 { font-size: clamp(1.5rem, 4vw, 3rem); }\n\n/* Keyframe Animation */\n@keyframes fadeSlideIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.animate-in {\n  animation: fadeSlideIn 0.5s ease forwards;\n}\n\n/* Staggered children */\n.stagger > *:nth-child(1) { animation-delay: 0.1s; }\n.stagger > *:nth-child(2) { animation-delay: 0.2s; }\n.stagger > *:nth-child(3) { animation-delay: 0.3s; }',
       lang:'css',
       keyPoints:['CSS Variables: --name: value, dùng var(--name)','backdrop-filter: blur() cho glassmorphism','clamp(min, preferred, max) cho responsive values'],
       exercise:'Tạo dark/light theme switcher dùng CSS variables.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Architecture, Performance & Accessibility',lessons:[
      {id:'arch',title:'CSS Architecture & a11y',
       theory:'<p>BEM naming, CSS Modules, CSS-in-JS. Container queries thay media queries. Focus management, ARIA labels, color contrast cho accessibility. Viết CSS cho 5 năm maintain.</p>',
       code:'/* Container Queries (modern CSS) */\n.card-container {\n  container-type: inline-size;\n  container-name: card;\n}\n\n@container card (min-width: 400px) {\n  .card { display: flex; gap: 16px; }\n  .card-image { width: 200px; }\n}\n\n/* Scroll-driven animations */\n@keyframes reveal {\n  from { opacity: 0; transform: scale(0.9); }\n  to { opacity: 1; transform: scale(1); }\n}\n\n.scroll-animate {\n  animation: reveal linear;\n  animation-timeline: view();\n  animation-range: entry 0% cover 40%;\n}\n\n/* Accessibility */\n.sr-only {\n  position: absolute; width: 1px; height: 1px;\n  padding: 0; margin: -1px; overflow: hidden;\n  clip: rect(0,0,0,0); border: 0;\n}\n\n:focus-visible {\n  outline: 2px solid var(--primary);\n  outline-offset: 2px;\n}\n\n/* Reduced motion preference */\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}',
       lang:'css',
       keyPoints:['Container queries: responsive theo container, không viewport','Scroll-driven animations: CSS-only scroll effects','prefers-reduced-motion: respect user accessibility settings'],
       exercise:'Audit một website cho WCAG 2.1 AA compliance.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Houdini, Layout Algorithms & Design Systems',lessons:[
      {id:'systems',title:'Design Systems & Houdini',
       theory:'<p>Design systems: tokens, components, patterns. CSS Houdini cho custom paint, layout, properties. Subgrid cho nested grid alignment. Design tokens → CSS variables → Figma sync.</p>',
       code:'/* Design Token System */\n:root {\n  /* Spacing scale */\n  --space-xs: 4px; --space-sm: 8px;\n  --space-md: 16px; --space-lg: 24px; --space-xl: 48px;\n  \n  /* Typography scale */\n  --text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);\n  --text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);\n  --text-base: clamp(1rem, 0.9rem + 0.4vw, 1.125rem);\n  --text-lg: clamp(1.25rem, 1rem + 0.8vw, 1.5rem);\n  --text-xl: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem);\n  --text-2xl: clamp(2rem, 1.5rem + 2vw, 3.5rem);\n  \n  /* Color: HSL for easy manipulation */\n  --hue: 230;\n  --primary-h: var(--hue);\n  --primary-s: 70%;\n  --primary-l: 55%;\n  --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));\n  --primary-light: hsl(var(--primary-h), var(--primary-s), 70%);\n  --primary-dark: hsl(var(--primary-h), var(--primary-s), 40%);\n}\n\n/* Subgrid alignment */\n.grid-parent {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: var(--space-lg);\n}\n\n.grid-child {\n  display: grid;\n  grid-template-rows: subgrid; /* inherit parent grid */\n  grid-row: span 3;\n}',
       lang:'css',
       keyPoints:['Design tokens: single source of truth cho design','HSL colors: dễ tạo variants (light/dark/alpha)','Subgrid: nested elements align với parent grid'],
       exercise:'Xây dựng design system tokens cho 1 sản phẩm thực tế.'}
    ]}
  ]
},

// ═══════════════ SQL ═══════════════
sql: {
  id:'sql', name:'SQL & NoSQL', icon:'🗄️', color:'#00758F',
  gradient:'linear-gradient(135deg,#00758F,#F29111)',
  category:'backend',
  description:'Database — từ SELECT đến query optimization & MongoDB',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'SELECT, INSERT, UPDATE, DELETE',lessons:[
      {id:'basics',title:'SQL CRUD cơ bản',
       theory:'<p>SQL (Structured Query Language) tương tác với relational database. 4 operations cơ bản: <code>SELECT</code> (đọc), <code>INSERT</code> (thêm), <code>UPDATE</code> (sửa), <code>DELETE</code> (xóa). <code>WHERE</code> lọc dữ liệu.</p>',
       code:'-- Tạo bảng\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  age INT CHECK (age >= 0),\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- CRUD Operations\nINSERT INTO users (name, email, age)\nVALUES (\'An\', \'an@email.com\', 25);\n\nSELECT * FROM users WHERE age >= 18 ORDER BY name;\n\nUPDATE users SET age = 26 WHERE email = \'an@email.com\';\n\nDELETE FROM users WHERE id = 1;\n\n-- Aggregate functions\nSELECT \n  COUNT(*) as total,\n  AVG(age) as avg_age,\n  MAX(age) as max_age\nFROM users;',
       lang:'sql',
       keyPoints:['PRIMARY KEY = unique identifier cho mỗi row','NOT NULL, UNIQUE, CHECK = constraints đảm bảo data integrity','ORDER BY sắp xếp, LIMIT giới hạn kết quả'],
       exercise:'Tạo bảng products và viết queries CRUD.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'JOINs, Subqueries & Grouping',lessons:[
      {id:'joins',title:'JOINs & Relationships',
       theory:'<p><code>JOIN</code> kết hợp data từ nhiều bảng. INNER JOIN (match cả 2), LEFT JOIN (tất cả bên trái), Foreign Key tạo relationship giữa các bảng.</p>',
       code:'-- Orders + Users relationship\nSELECT \n  u.name,\n  COUNT(o.id) as order_count,\n  COALESCE(SUM(o.total), 0) as total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 0\nORDER BY total_spent DESC;\n\n-- Subquery: users above average spending\nSELECT name, total_spent FROM (\n  SELECT u.name, SUM(o.total) as total_spent\n  FROM users u\n  JOIN orders o ON u.id = o.user_id\n  GROUP BY u.id, u.name\n) sub\nWHERE total_spent > (SELECT AVG(total) FROM orders);\n\n-- Window function\nSELECT \n  name,\n  total,\n  ROW_NUMBER() OVER (ORDER BY total DESC) as rank,\n  SUM(total) OVER () as grand_total\nFROM orders;',
       lang:'sql',
       keyPoints:['INNER JOIN = cả 2 match, LEFT JOIN = tất cả bên trái','GROUP BY + HAVING lọc sau aggregation','Window functions: ROW_NUMBER, RANK, SUM OVER()'],
       exercise:'Viết report: top 10 customers theo doanh thu, kèm % tổng.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Indexing, Transactions & NoSQL',lessons:[
      {id:'nosql',title:'MongoDB & NoSQL Patterns',
       theory:'<p>NoSQL cho flexible schema, horizontal scaling. MongoDB dùng document model (JSON). Khi nào SQL vs NoSQL? SQL = relationships mạnh, NoSQL = flexible schema, high write throughput.</p>',
       code:'// MongoDB CRUD\ndb.users.insertOne({\n  name: "An",\n  email: "an@email.com",\n  skills: ["JavaScript", "Python"],\n  address: { city: "HCMC", country: "VN" }\n});\n\n// Aggregation pipeline\ndb.orders.aggregate([\n  { $match: { status: "completed" } },\n  { $group: {\n    _id: "$userId",\n    totalSpent: { $sum: "$total" },\n    orderCount: { $sum: 1 }\n  }},\n  { $sort: { totalSpent: -1 } },\n  { $limit: 10 },\n  { $lookup: {\n    from: "users",\n    localField: "_id",\n    foreignField: "_id",\n    as: "user"\n  }}\n]);\n\n// Index for performance\ndb.users.createIndex({ email: 1 }, { unique: true });\ndb.orders.createIndex({ userId: 1, createdAt: -1 });',
       lang:'javascript',
       keyPoints:['Document model: nested objects, flexible schema','Aggregation pipeline: $match → $group → $sort → $lookup','Index trên frequently queried fields, compound index cho multi-field'],
       exercise:'Thiết kế MongoDB schema cho blog với users, posts, comments.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Query Optimization & Scaling',lessons:[
      {id:'optimize',title:'Query Optimization & EXPLAIN',
       theory:'<p><code>EXPLAIN ANALYZE</code> hiển thị execution plan. Index strategy: B-tree, Hash, GIN, GiST. Partitioning cho bảng lớn. Connection pooling, read replicas cho scaling.</p>',
       code:'-- EXPLAIN ANALYZE: understand query performance\nEXPLAIN ANALYZE\nSELECT u.name, COUNT(o.id)\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.created_at > NOW() - INTERVAL \'30 days\'\nGROUP BY u.id;\n\n-- Covering index (index-only scan)\nCREATE INDEX idx_orders_user_date \nON orders(user_id, created_at DESC)\nINCLUDE (total, status);\n\n-- Partial index (only active users)\nCREATE INDEX idx_active_users \nON users(email) WHERE active = true;\n\n-- Table partitioning for large tables\nCREATE TABLE logs (\n  id BIGSERIAL,\n  created_at TIMESTAMPTZ NOT NULL,\n  message TEXT\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE logs_2026_q1 PARTITION OF logs\nFOR VALUES FROM (\'2026-01-01\') TO (\'2026-04-01\');',
       lang:'sql',
       keyPoints:['EXPLAIN ANALYZE = execution plan thực tế (không chỉ estimate)','Covering index: INCLUDE columns tránh table lookup','Partial index: chỉ index rows cần thiết, tiết kiệm space'],
       exercise:'Optimize slow query từ 5s xuống 50ms dùng EXPLAIN.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Distributed DB, Sharding & CAP Theorem',lessons:[
      {id:'distributed',title:'Distributed Databases & CAP',
       theory:'<p>CAP Theorem: Consistency, Availability, Partition tolerance — chọn 2/3. Sharding strategies, replication, consensus (Raft/Paxos). NewSQL: CockroachDB, TiDB, Vitess.</p>',
       code:'-- Sharding strategy: Hash-based\n-- Shard key selection is CRITICAL\n-- Good: user_id (even distribution)\n-- Bad: country (hotspot on popular countries)\n\n-- CockroachDB: Distributed SQL\nCREATE TABLE orders (\n  id UUID DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL,\n  total DECIMAL(10,2),\n  region STRING NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT now(),\n  PRIMARY KEY (region, id)\n) PARTITION BY LIST (region) (\n  PARTITION asia VALUES IN (\'asia\'),\n  PARTITION eu VALUES IN (\'europe\'),\n  PARTITION us VALUES IN (\'americas\')\n);\n\n-- Read replicas + write primary pattern\n-- Application code:\n-- const readDB = pool.connect(REPLICA_URL);\n-- const writeDB = pool.connect(PRIMARY_URL);\n-- SELECT queries -> readDB\n-- INSERT/UPDATE/DELETE -> writeDB',
       lang:'sql',
       keyPoints:['CAP: CP (consistent, MongoDB), AP (available, Cassandra)','Shard key quyết định performance, chọn cẩn thận','Read replicas giảm load primary, eventual consistency'],
       exercise:'Thiết kế sharding strategy cho real-time chat app 10M users.'}
    ]}
  ]
},

// ═══════════════ JEST ═══════════════
jest: {
  id:'jest', name:'Jest & Testing', icon:'🧪', color:'#C21325',
  gradient:'linear-gradient(135deg,#C21325,#99425B)',
  category:'tool',
  description:'JavaScript testing framework — Unit, Integration, E2E',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Test đầu tiên & assertions',lessons:[
      {id:'basics',title:'Jest Basics & Assertions',
       theory:'<p>Jest = test runner + assertion library + mocking. <code>describe</code> nhóm tests, <code>it/test</code> định nghĩa test case. <code>expect()</code> + matchers kiểm tra kết quả.</p>',
       code:'// math.js\nexport function add(a, b) { return a + b; }\nexport function divide(a, b) {\n  if (b === 0) throw new Error("Division by zero");\n  return a / b;\n}\n\n// math.test.js\nimport { add, divide } from "./math";\n\ndescribe("Math functions", () => {\n  test("add two numbers", () => {\n    expect(add(2, 3)).toBe(5);\n    expect(add(-1, 1)).toBe(0);\n  });\n\n  test("divide numbers", () => {\n    expect(divide(10, 2)).toBe(5);\n    expect(divide(10, 3)).toBeCloseTo(3.333, 2);\n  });\n\n  test("divide by zero throws", () => {\n    expect(() => divide(10, 0)).toThrow("Division by zero");\n  });\n\n  test("array contains item", () => {\n    const fruits = ["apple", "banana"];\n    expect(fruits).toContain("apple");\n    expect(fruits).toHaveLength(2);\n  });\n});',
       lang:'javascript',
       keyPoints:['toBe() cho primitives, toEqual() cho objects/arrays','toThrow() test exceptions','describe() nhóm related tests, test() = 1 test case'],
       exercise:'Viết tests cho hàm validateEmail, isPalindrome.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Mocking, Async testing & Setup',lessons:[
      {id:'mocking',title:'Mocking & Async Tests',
       theory:'<p><code>jest.fn()</code> tạo mock function. <code>jest.mock()</code> mock module. Async tests dùng <code>async/await</code> hoặc <code>.resolves/.rejects</code>. Setup/teardown: <code>beforeEach</code>, <code>afterEach</code>.</p>',
       code:'// userService.test.js\nimport { getUser, createUser } from "./userService";\nimport * as db from "./database";\n\njest.mock("./database"); // auto-mock all exports\n\ndescribe("UserService", () => {\n  beforeEach(() => {\n    jest.clearAllMocks();\n  });\n\n  test("getUser returns user from DB", async () => {\n    const mockUser = { id: 1, name: "An" };\n    db.findById.mockResolvedValue(mockUser);\n\n    const result = await getUser(1);\n\n    expect(result).toEqual(mockUser);\n    expect(db.findById).toHaveBeenCalledWith(1);\n    expect(db.findById).toHaveBeenCalledTimes(1);\n  });\n\n  test("getUser throws for non-existent", async () => {\n    db.findById.mockResolvedValue(null);\n\n    await expect(getUser(999)).rejects.toThrow("Not found");\n  });\n\n  test("createUser hashes password", async () => {\n    db.insert.mockResolvedValue({ id: 1 });\n\n    await createUser("An", "password123");\n\n    const savedData = db.insert.mock.calls[0][0];\n    expect(savedData.password).not.toBe("password123");\n    expect(savedData.name).toBe("An");\n  });\n});',
       lang:'javascript',
       keyPoints:['jest.mock() thay toàn bộ module bằng mocks','mockResolvedValue() cho async mock returns','jest.clearAllMocks() trong beforeEach tránh leak giữa tests'],
       exercise:'Viết tests cho API controller với mocked service layer.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Integration tests & Test patterns',lessons:[
      {id:'integration',title:'Integration Testing Patterns',
       theory:'<p>Integration tests kiểm tra nhiều components cùng lúc. Test API endpoints với supertest. Test database với test containers. Fixture factories cho test data.</p>',
       code:'// API Integration Test\nimport request from "supertest";\nimport app from "../app";\nimport { resetDB, seedDB } from "../test/helpers";\n\ndescribe("POST /api/users", () => {\n  beforeEach(async () => {\n    await resetDB();\n    await seedDB();\n  });\n\n  test("creates user with valid data", async () => {\n    const res = await request(app)\n      .post("/api/users")\n      .send({ name: "New User", email: "new@test.com" })\n      .expect(201);\n\n    expect(res.body).toMatchObject({\n      name: "New User",\n      email: "new@test.com"\n    });\n    expect(res.body.id).toBeDefined();\n  });\n\n  test("rejects duplicate email", async () => {\n    await request(app)\n      .post("/api/users")\n      .send({ name: "Dup", email: "existing@test.com" })\n      .expect(409);\n  });\n\n  test("validates required fields", async () => {\n    const res = await request(app)\n      .post("/api/users")\n      .send({})\n      .expect(400);\n\n    expect(res.body.errors).toContainEqual(\n      expect.objectContaining({ field: "name" })\n    );\n  });\n});',
       lang:'javascript',
       keyPoints:['supertest test HTTP endpoints without starting server','toMatchObject() partial matching cho response body','beforeEach reset DB đảm bảo test independence'],
       exercise:'Viết integration tests cho full CRUD API flow.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Coverage, CI/CD & Test Strategy',lessons:[
      {id:'strategy',title:'Testing Strategy & Best Practices',
       theory:'<p>Testing pyramid: Unit (70%) → Integration (20%) → E2E (10%). Code coverage target 80%+. Mutation testing phát hiện weak tests. Test behavior, không test implementation.</p>',
       code:'// jest.config.js - production configuration\nexport default {\n  preset: "ts-jest",\n  testEnvironment: "node",\n  coverageThreshold: {\n    global: {\n      branches: 80,\n      functions: 80,\n      lines: 80,\n      statements: 80\n    }\n  },\n  collectCoverageFrom: [\n    "src/**/*.ts",\n    "!src/**/*.d.ts",\n    "!src/**/index.ts" // barrel exports\n  ],\n  setupFilesAfterSetup: ["./jest.setup.ts"],\n  testMatch: [\n    "<rootDir>/src/**/*.test.ts",\n    "<rootDir>/tests/**/*.test.ts"\n  ],\n  moduleNameMapper: {\n    "^@/(.*)$": "<rootDir>/src/$1"\n  }\n};\n\n// Custom matcher example\nexpect.extend({\n  toBeValidEmail(received) {\n    const pass = /^[^@]+@[^@]+\\.[^@]+$/.test(received);\n    return {\n      pass,\n      message: () => `expected ${received} to be valid email`\n    };\n  }\n});\n\n// Usage: expect("test@mail.com").toBeValidEmail();',
       lang:'javascript',
       keyPoints:['Coverage threshold trong jest.config bắt buộc minimum coverage','Custom matchers cho domain-specific assertions','Test behavior (output) không test implementation (internal)'],
       exercise:'Set up Jest + coverage + CI/CD pipeline cho một project.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Property-based testing & TDD mastery',lessons:[
      {id:'advanced',title:'Property-Based & Contract Testing',
       theory:'<p>Property-based testing (fast-check) generate random inputs tìm edge cases. Contract testing (Pact) verify API compatibility giữa services. Snapshot testing cho UI regression.</p>',
       code:'import fc from "fast-check";\n\n// Property-based: auto-discover edge cases\ndescribe("sort function", () => {\n  test("output has same length as input", () => {\n    fc.assert(\n      fc.property(fc.array(fc.integer()), (arr) => {\n        const sorted = mySort([...arr]);\n        return sorted.length === arr.length;\n      })\n    );\n  });\n\n  test("output is always sorted", () => {\n    fc.assert(\n      fc.property(fc.array(fc.integer()), (arr) => {\n        const sorted = mySort([...arr]);\n        for (let i = 1; i < sorted.length; i++) {\n          if (sorted[i] < sorted[i-1]) return false;\n        }\n        return true;\n      })\n    );\n  });\n\n  test("idempotent: sorting twice = sorting once", () => {\n    fc.assert(\n      fc.property(fc.array(fc.integer()), (arr) => {\n        const once = mySort([...arr]);\n        const twice = mySort([...once]);\n        return JSON.stringify(once) === JSON.stringify(twice);\n      })\n    );\n  });\n});',
       lang:'javascript',
       keyPoints:['Property-based testing tìm edge cases bạn không nghĩ tới','fast-check generate hàng ngàn random inputs','Contract testing verify API compatibility giữa services'],
       exercise:'Viết property-based tests cho custom data structure (LinkedList).'}
    ]}
  ]
},

// ═══════════════ DOCKER & GIT ═══════════════
dockergit: {
  id:'dockergit', name:'Docker & Git', icon:'🐳', color:'#2496ED',
  gradient:'linear-gradient(135deg,#2496ED,#F05032)',
  category:'tool',
  description:'Containerization & Version Control — DevOps essentials',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Git basics & Docker containers',lessons:[
      {id:'git-basics',title:'Git Fundamentals',
       theory:'<p>Git = distributed version control. <code>init, add, commit, push, pull</code> là workflow cơ bản. Branch cho feature development. <code>.gitignore</code> loại trừ files không cần track.</p>',
       code:'# Initialize & first commit\ngit init\ngit add .\ngit commit -m "feat: initial project setup"\n\n# Branch workflow\ngit checkout -b feature/login\n# ... make changes ...\ngit add src/auth/\ngit commit -m "feat: add login form with validation"\ngit push -u origin feature/login\n\n# View history\ngit log --oneline --graph --decorate -20\n\n# .gitignore\nnode_modules/\n.env\ndist/\n*.log\n.DS_Store\n\n# Undo mistakes\ngit stash           # save WIP temporarily\ngit stash pop       # restore WIP\ngit reset HEAD~1    # undo last commit (keep changes)\ngit checkout -- .   # discard all changes',
       lang:'bash',
       keyPoints:['commit message format: type: description (feat, fix, docs, refactor)','Branch per feature, merge via Pull Request','git stash saves work-in-progress temporarily'],
       exercise:'Tạo repo, tạo branch, commit, merge và resolve conflict.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Docker images & Compose',lessons:[
      {id:'dockerfile',title:'Dockerfile & Docker Compose',
       theory:'<p>Dockerfile = recipe tạo image. Docker Compose = orchestrate multi-container apps. <strong>Multi-stage builds</strong> giảm image size. Volume cho persistent data.</p>',
       code:'# Dockerfile (multi-stage build)\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS production\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/package.json ./\n\nEXPOSE 3000\nUSER node\nCMD ["node", "dist/index.js"]\n\n# docker-compose.yml\n# version: "3.8"\n# services:\n#   app:\n#     build: .\n#     ports: ["3000:3000"]\n#     env_file: .env\n#     depends_on: [db, redis]\n#   db:\n#     image: postgres:16-alpine\n#     volumes: [pgdata:/var/lib/postgresql/data]\n#     environment:\n#       POSTGRES_DB: myapp\n#       POSTGRES_PASSWORD: secret\n#   redis:\n#     image: redis:7-alpine\n# volumes:\n#   pgdata:',
       lang:'docker',
       keyPoints:['Multi-stage build: builder stage → production stage (smaller image)','USER node: run as non-root for security','depends_on: start services in order'],
       exercise:'Dockerize một Node.js app với PostgreSQL và Redis.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Git branching strategies & CI/CD',lessons:[
      {id:'workflow',title:'Git Flow & CI/CD',
       theory:'<p>Branching strategies: Git Flow, GitHub Flow, Trunk-based. Rebase vs Merge. CI/CD pipelines auto-test, build, deploy. GitHub Actions cho automation.</p>',
       code:'# GitHub Actions CI/CD\n# .github/workflows/ci.yml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n      - run: npm ci\n      - run: npm test -- --coverage\n      - run: npm run lint\n\n  build:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t myapp:${{ github.sha }} .\n      - run: docker push myapp:${{ github.sha }}\n\n  deploy:\n    needs: build\n    if: github.ref == \'refs/heads/main\'\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Deploy to production"',
       lang:'yaml',
       keyPoints:['GitHub Flow: simple, main + feature branches','CI: auto test on every PR, block merge if fails','needs: job dependencies, if: conditional execution'],
       exercise:'Setup GitHub Actions CI cho project với test + lint + build.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Docker networking, security & optimization',lessons:[
      {id:'advanced-docker',title:'Docker Production Best Practices',
       theory:'<p>Docker security: non-root user, scan vulnerabilities, secrets management. Networking: bridge, overlay, host. Health checks cho container monitoring. Image optimization: .dockerignore, layer caching.</p>',
       code:'# Production Dockerfile best practices\nFROM node:20-alpine AS base\n\n# Security: create non-root user\nRUN addgroup -g 1001 appgroup && \\\n    adduser -u 1001 -G appgroup -s /bin/sh -D appuser\n\n# Install only production deps\nFROM base AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production && npm cache clean --force\n\n# Build stage\nFROM base AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Production\nFROM base AS production\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY --from=build /app/dist ./dist\nCOPY package.json ./\n\nUSER appuser\nEXPOSE 3000\n\nHEALTHCHECK --interval=30s --timeout=3s \\\n  CMD wget -q --spider http://localhost:3000/health || exit 1\n\nCMD ["node", "dist/index.js"]',
       lang:'docker',
       keyPoints:['Non-root user: security best practice bắt buộc','HEALTHCHECK cho container monitoring','Multi-stage + .dockerignore giảm image size 50-80%'],
       exercise:'Optimize Docker image từ 1.2GB xuống <200MB.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Kubernetes, Orchestration & GitOps',lessons:[
      {id:'k8s',title:'Kubernetes & GitOps',
       theory:'<p>K8s orchestrate containers at scale: Pods, Deployments, Services, Ingress. GitOps: Git as single source of truth cho infrastructure. ArgoCD, Flux cho automated deployment.</p>',
       code:'# Kubernetes Deployment\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n    spec:\n      containers:\n        - name: myapp\n          image: myapp:latest\n          ports:\n            - containerPort: 3000\n          resources:\n            requests:\n              memory: "128Mi"\n              cpu: "100m"\n            limits:\n              memory: "256Mi"\n              cpu: "500m"\n          livenessProbe:\n            httpGet:\n              path: /health\n              port: 3000\n            initialDelaySeconds: 10\n          readinessProbe:\n            httpGet:\n              path: /ready\n              port: 3000\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: myapp-svc\nspec:\n  selector:\n    app: myapp\n  ports:\n    - port: 80\n      targetPort: 3000\n  type: ClusterIP',
       lang:'yaml',
       keyPoints:['Deployment: declarative desired state, K8s maintains it','Resources requests/limits prevent noisy neighbors','Liveness/readiness probes cho auto-restart và traffic routing'],
       exercise:'Deploy app lên K8s cluster với rolling update strategy.'}
    ]}
  ]
},

// ═══════════════ TYPESCRIPT ═══════════════
typescript: {
  id:'typescript', name:'TypeScript', icon:'💎', color:'#3178C6',
  gradient:'linear-gradient(135deg,#3178C6,#235A97)',
  category:'language',
  description:'JavaScript với type safety — Standard cho production apps',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Types cơ bản & Interfaces',lessons:[
      {id:'basics',title:'TypeScript Fundamentals',
       theory:'<p>TypeScript = JavaScript + types. Phát hiện lỗi <strong>tại compile-time</strong> thay vì runtime. Type annotations, interfaces, type aliases là nền tảng.</p>',
       code:'// Basic types\nlet name: string = "TypeScript";\nlet version: number = 5.4;\nlet isAwesome: boolean = true;\nlet skills: string[] = ["React", "Node"];\n\n// Interface: define object shape\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  age?: number;           // optional\n  readonly createdAt: Date; // immutable\n}\n\n// Type alias\ntype Status = "active" | "inactive" | "banned"; // union\ntype Point = { x: number; y: number };\n\n// Function with types\nfunction greet(user: User): string {\n  return `Hello ${user.name}!`;\n}\n\n// Array methods are type-safe\nconst activeUsers = users.filter(\n  (u): u is User => u.status === "active" // type guard\n);',
       lang:'typescript',
       keyPoints:['Type annotation: variable: Type','Interface cho object shapes, type cho unions/aliases','? = optional property, readonly = immutable'],
       exercise:'Define interfaces cho e-commerce: Product, Cart, Order.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Generics & Utility Types',lessons:[
      {id:'generics',title:'Generics & Utility Types',
       theory:'<p>Generics (<code>&lt;T&gt;</code>) cho reusable typed code. Utility types: <code>Partial, Required, Pick, Omit, Record</code> transform types. Discriminated unions cho type-safe state.</p>',
       code:'// Generic function\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst num = first([1, 2, 3]);      // number | undefined\nconst str = first(["a", "b"]);     // string | undefined\n\n// Generic interface\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n\nasync function fetchUsers(): Promise<ApiResponse<User[]>> {\n  const res = await fetch("/api/users");\n  return res.json();\n}\n\n// Utility types\ntype CreateUser = Omit<User, "id" | "createdAt">;\ntype UpdateUser = Partial<CreateUser>;\ntype UserPreview = Pick<User, "id" | "name">;\n\n// Discriminated union (type-safe state)\ntype RequestState<T> =\n  | { status: "idle" }\n  | { status: "loading" }\n  | { status: "success"; data: T }\n  | { status: "error"; error: string };\n\nfunction renderState(state: RequestState<User[]>) {\n  switch (state.status) {\n    case "loading": return "Loading...";\n    case "success": return state.data.map(u => u.name); // TS knows data exists!\n    case "error": return state.error; // TS knows error exists!\n  }\n}',
       lang:'typescript',
       keyPoints:['Generic <T> cho reusable type-safe code','Utility types: Partial, Pick, Omit transform existing types','Discriminated unions cho type-safe state management'],
       exercise:'Tạo generic useForm<T> hook với typed fields và validation.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Advanced types & Type Guards',lessons:[
      {id:'advanced',title:'Advanced Type Patterns',
       theory:'<p>Conditional types, mapped types, template literals cho meta-programming. <code>infer</code> extract types. Branded types cho domain safety. <code>satisfies</code> operator (TS 5+).</p>',
       code:'// Mapped types: transform object types\ntype Readonly<T> = { readonly [K in keyof T]: T[K] };\ntype Nullable<T> = { [K in keyof T]: T[K] | null };\n\n// Conditional types\ntype IsString<T> = T extends string ? true : false;\ntype A = IsString<"hello">; // true\ntype B = IsString<42>;      // false\n\n// Template literal types\ntype HttpMethod = "GET" | "POST" | "PUT" | "DELETE";\ntype ApiEndpoint = `/api/${string}`;\ntype Route = `${HttpMethod} ${ApiEndpoint}`;\n// Route = "GET /api/..." | "POST /api/..." | ...\n\n// Branded types for domain safety\ntype USD = number & { __brand: "USD" };\ntype EUR = number & { __brand: "EUR" };\n\nfunction usd(amount: number): USD { return amount as USD; }\nfunction eur(amount: number): EUR { return amount as EUR; }\n\nfunction addUSD(a: USD, b: USD): USD { return (a + b) as USD; }\n// addUSD(usd(10), eur(20)); // ERROR! Can\'t mix USD and EUR\n\n// satisfies operator (TS 5+)\nconst config = {\n  port: 3000,\n  host: "localhost",\n  debug: true\n} satisfies Record<string, string | number | boolean>;\n// config.port is still `number` (not string | number | boolean)',
       lang:'typescript',
       keyPoints:['keyof T: union of all keys, T[K]: value type of key K','Branded types prevent accidental mixing of similar types','satisfies validates AND preserves narrower types'],
       exercise:'Viết type-safe event emitter với typed event names và payloads.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Declaration files, Type-Level Programming',lessons:[
      {id:'type-level',title:'Type-Level Programming',
       theory:'<p>TypeScript type system là Turing-complete. Recursive types, variadic tuples, const assertions. Type-level computation cho validation, routing, ORM query builders.</p>',
       code:'// Type-safe builder pattern\ntype Builder<T extends Record<string, any>> = {\n  set<K extends string, V>(key: K, value: V): Builder<T & Record<K, V>>;\n  build(): T;\n};\n\nfunction createBuilder(): Builder<{}> {\n  const obj: any = {};\n  return {\n    set(key, value) {\n      obj[key] = value;\n      return this as any;\n    },\n    build() { return obj; }\n  };\n}\n\nconst result = createBuilder()\n  .set("name", "TypeScript")\n  .set("version", 5.4)\n  .set("released", true)\n  .build();\n// result type: { name: string; version: number; released: boolean }\n\n// Recursive type: deep partial\ntype DeepPartial<T> = T extends object\n  ? { [K in keyof T]?: DeepPartial<T[K]> }\n  : T;\n\n// Extract route params from string\ntype ExtractParams<T extends string> =\n  T extends `${string}:${infer Param}/${infer Rest}`\n    ? Param | ExtractParams<Rest>\n    : T extends `${string}:${infer Param}`\n      ? Param\n      : never;\n\ntype Params = ExtractParams<"/users/:id/posts/:postId">;\n// Params = "id" | "postId"',
       lang:'typescript',
       keyPoints:['infer keyword extract types trong conditional types','Recursive types cho deeply nested transformations','Template literal + infer = compile-time string parsing'],
       exercise:'Viết type-safe SQL query builder infer return type từ SELECT.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Compiler API & Custom Transformers',lessons:[
      {id:'compiler',title:'TS Compiler Internals',
       theory:'<p>TypeScript Compiler API cho code generation, custom linters, codemods. AST manipulation, type checker API. Performance: project references, incremental builds. Declaration merging cho library augmentation.</p>',
       code:'// Custom type transformer using ts-morph\nimport { Project, SyntaxKind } from "ts-morph";\n\nconst project = new Project();\nconst sourceFile = project.addSourceFileAtPath("./src/types.ts");\n\n// Find all interfaces\nconst interfaces = sourceFile.getInterfaces();\n\nfor (const iface of interfaces) {\n  console.log(`Interface: ${iface.getName()}`);\n  \n  // Generate runtime validator from type\n  const properties = iface.getProperties();\n  const validators = properties.map(prop => {\n    const name = prop.getName();\n    const type = prop.getType().getText();\n    const optional = prop.hasQuestionToken();\n    return { name, type, optional };\n  });\n  \n  console.log("Validators:", validators);\n}\n\n// Declaration merging\ndeclare module "express" {\n  interface Request {\n    user?: { id: string; role: string };\n    requestId: string;\n  }\n}\n\n// Module augmentation\ndeclare global {\n  interface Array<T> {\n    groupBy(fn: (item: T) => string): Record<string, T[]>;\n  }\n}',
       lang:'typescript',
       keyPoints:['ts-morph: high-level API cho TypeScript AST manipulation','Declaration merging: extend third-party types','Project references: scale TS to monorepos with incremental builds'],
       exercise:'Viết custom lint rule kiểm tra naming conventions dùng TSC API.'}
    ]}
  ]
}

};
