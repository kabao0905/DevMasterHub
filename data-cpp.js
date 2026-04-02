// C++ Full Curriculum
const DATA_CPP = {
id:'cpp', name:'C++', icon:'⚡', color:'#00599C',
gradient:'linear-gradient(135deg,#00599C,#004482)',
category:'language',
description:'Lập trình hệ thống, game engine, ứng dụng hiệu năng cao',
levels:[
  // ── NEWBIE (5 bài) ──
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
     exercise:'Khai báo biến lưu thông tin sinh viên (tên, tuổi, GPA) và in ra.'},

    {id:'conditions',title:'Câu lệnh điều kiện',
     theory:'<p><code>if/else</code> kiểm tra điều kiện. <code>switch</code> cho multiple cases cố định. Toán tử so sánh: <code>==, !=, <, >, <=, >=</code>. Toán tử logic: <code>&&</code> (AND), <code>||</code> (OR), <code>!</code> (NOT).</p>',
     code:'#include <iostream>\nusing namespace std;\n\nint main() {\n    int score;\n    cout << "Nhap diem: ";\n    cin >> score;\n\n    // if-else\n    if (score >= 90) cout << "A - Xuat sac!" << endl;\n    else if (score >= 80) cout << "B - Gioi" << endl;\n    else if (score >= 70) cout << "C - Kha" << endl;\n    else cout << "D - Can co gang" << endl;\n\n    // switch\n    int day = 3;\n    switch (day) {\n        case 1: cout << "Monday"; break;\n        case 2: cout << "Tuesday"; break;\n        case 3: cout << "Wednesday"; break;\n        default: cout << "Other day";\n    }\n    cout << endl;\n\n    // Ternary operator\n    string status = (score >= 50) ? "Pass" : "Fail";\n    cout << status << endl;\n}',
     lang:'cpp',
     keyPoints:['if/else if/else cho điều kiện phức tạp','switch + break cho multiple cases','Ternary: (condition) ? true_val : false_val'],
     exercise:'Viết chương trình tính tiền taxi: 2km đầu 15k, từ km 3 trở đi 10k/km.'},

    {id:'loops',title:'Vòng lặp & Iteration',
     theory:'<p><code>for</code> khi biết số lần lặp. <code>while</code> khi chưa biết. <code>do-while</code> chạy ít nhất 1 lần. <code>break</code> thoát vòng lặp, <code>continue</code> bỏ qua iteration hiện tại.</p>',
     code:'#include <iostream>\nusing namespace std;\n\nint main() {\n    // for loop\n    for (int i = 1; i <= 5; i++) {\n        cout << i << " ";\n    }\n    cout << endl; // 1 2 3 4 5\n\n    // while - tìm ước chung lớn nhất\n    int a = 48, b = 18;\n    while (b != 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    cout << "GCD: " << a << endl; // 6\n\n    // Nested loop - bảng cửu chương\n    for (int i = 2; i <= 4; i++) {\n        for (int j = 1; j <= 5; j++) {\n            cout << i << "x" << j << "=" << i*j << "\\t";\n        }\n        cout << endl;\n    }\n\n    // do-while - menu\n    int choice;\n    do {\n        cout << "1.Play 2.Settings 3.Exit: ";\n        cin >> choice;\n    } while (choice != 3);\n}',
     lang:'cpp',
     keyPoints:['for(init; condition; update) cho lặp có đếm','while kiểm tra điều kiện trước, do-while sau','break thoát loop, continue skip iteration'],
     exercise:'In ra tam giác sao (*) với n hàng dùng nested loop.'},

    {id:'functions',title:'Hàm & Mảng',
     theory:'<p>Hàm giúp tái sử dụng code. Khai báo: <code>kiểu_trả_về tên_hàm(tham_số)</code>. Mảng lưu nhiều giá trị cùng kiểu. <code>vector</code> là mảng động, linh hoạt hơn array tĩnh.</p>',
     code:'#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Function overloading\nint add(int a, int b) { return a + b; }\ndouble add(double a, double b) { return a + b; }\n\n// Default parameter\nvoid greet(string name, string title = "ban") {\n    cout << "Xin chao " << title << " " << name << endl;\n}\n\n// Pass by reference\nvoid doubleAll(vector<int>& v) {\n    for (int& x : v) x *= 2;\n}\n\nint main() {\n    cout << add(3, 4) << endl;      // 7\n    cout << add(3.5, 4.2) << endl;  // 7.7\n    greet("An");\n    greet("An", "thay");\n\n    // Array tĩnh\n    int arr[] = {5, 3, 8, 1, 9};\n    int n = sizeof(arr) / sizeof(arr[0]);\n\n    // Vector (mảng động)\n    vector<int> nums = {10, 20, 30, 40};\n    nums.push_back(50);\n    doubleAll(nums);\n\n    for (int x : nums) cout << x << " ";\n    // 20 40 60 80 100\n}',
     lang:'cpp',
     keyPoints:['Function overloading: cùng tên, khác tham số','vector<T> thay array tĩnh, linh hoạt hơn','Range-based for: for(auto x : container)'],
     exercise:'Viết hàm tìm số nguyên tố trong vector, trả về vector kết quả.'}
  ]},

  // ── JUNIOR (4 bài) ──
  {id:'junior',name:'Junior',badge:'junior',desc:'OOP & quản lý bộ nhớ',lessons:[
    {id:'oop-basics',title:'Class & Object cơ bản',
     theory:'<p>OOP trong C++ dùng <code>class</code> để tạo kiểu dữ liệu tùy chỉnh. Class chứa <strong>attributes</strong> (dữ liệu) và <strong>methods</strong> (hành vi).</p><p>Dùng <code>public</code>, <code>private</code>, <code>protected</code> để kiểm soát truy cập. Constructor khởi tạo object.</p>',
     code:'#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Player {\nprivate:\n    string name;\n    int hp;\npublic:\n    Player(string n, int h) : name(n), hp(h) {}\n    \n    void takeDamage(int dmg) {\n        hp = max(0, hp - dmg);\n        cout << name << " HP: " << hp << endl;\n    }\n    \n    bool isAlive() { return hp > 0; }\n    string getName() { return name; }\n};\n\nint main() {\n    Player p("Hero", 100);\n    p.takeDamage(30);\n    cout << "Alive: " << p.isAlive() << endl;\n}',
     lang:'cpp',
     keyPoints:['class gom data + methods','private ẩn dữ liệu, public cho truy cập','Constructor dùng initializer list (:) hiệu quả hơn'],
     exercise:'Tạo class BankAccount với deposit, withdraw, getBalance.'},

    {id:'pointers',title:'Pointers & References',
     theory:'<p><strong>Pointer</strong> (<code>*</code>) lưu địa chỉ bộ nhớ. <strong>Reference</strong> (<code>&</code>) là alias cho biến khác. Đây là sức mạnh cốt lõi của C++.</p><p>Dùng <code>new</code> cấp phát heap, <code>delete</code> giải phóng. Quên delete → <strong>memory leak</strong>!</p>',
     code:'#include <iostream>\nusing namespace std;\n\nvoid swap(int& a, int& b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\nint main() {\n    int x = 10;\n    int* ptr = &x;     // pointer to x\n    int& ref = x;      // reference to x\n    \n    cout << "Value: " << *ptr << endl;  // dereference\n    cout << "Address: " << ptr << endl;\n    \n    int a = 5, b = 10;\n    swap(a, b);  // pass by reference\n    cout << a << " " << b << endl; // 10 5\n    \n    int* arr = new int[5]; // heap allocation\n    delete[] arr;          // MUST free!\n}',
     lang:'cpp',
     keyPoints:['* khai báo pointer, & lấy địa chỉ','Reference truyền tham chiếu, tránh copy','new/delete quản lý heap, luôn free bộ nhớ'],
     exercise:'Viết hàm nhận pointer đến array, tìm min và max.'},

    {id:'inheritance',title:'Kế thừa & Đa hình',
     theory:'<p><code>Inheritance</code> cho phép class con thừa hưởng từ class cha. <code>virtual</code> cho phép override method (polymorphism). <code>override</code> keyword đảm bảo đúng signature.</p><p>Abstract class có ít nhất 1 <code>pure virtual</code> function (<code>= 0</code>). Không thể tạo object từ abstract class.</p>',
     code:'#include <iostream>\n#include <vector>\n#include <memory>\nusing namespace std;\n\nclass Shape {\nprotected:\n    string color;\npublic:\n    Shape(string c) : color(c) {}\n    virtual double area() const = 0; // pure virtual\n    virtual void draw() const {\n        cout << color << " shape, area=" << area() << endl;\n    }\n    virtual ~Shape() = default;\n};\n\nclass Circle : public Shape {\n    double r;\npublic:\n    Circle(double radius, string c) : Shape(c), r(radius) {}\n    double area() const override { return 3.14159 * r * r; }\n};\n\nclass Rect : public Shape {\n    double w, h;\npublic:\n    Rect(double w, double h, string c) : Shape(c), w(w), h(h) {}\n    double area() const override { return w * h; }\n};\n\nint main() {\n    vector<unique_ptr<Shape>> shapes;\n    shapes.push_back(make_unique<Circle>(5, "Red"));\n    shapes.push_back(make_unique<Rect>(4, 6, "Blue"));\n    for (auto& s : shapes) s->draw(); // polymorphism!\n}',
     lang:'cpp',
     keyPoints:['virtual cho phép override, = 0 là pure virtual','override keyword bắt lỗi sai signature tại compile','virtual destructor BẮT BUỘC khi dùng inheritance + pointer'],
     exercise:'Tạo hierarchy Vehicle → Car, Motorcycle với virtual methods.'},

    {id:'string-io',title:'String xử lý & File I/O',
     theory:'<p><code>string</code> trong C++ có nhiều methods: <code>substr, find, replace, length</code>. <code>stringstream</code> chuyển đổi string ↔ number. File I/O dùng <code>fstream</code>: <code>ifstream</code> (đọc), <code>ofstream</code> (ghi).</p>',
     code:'#include <iostream>\n#include <string>\n#include <sstream>\n#include <fstream>\nusing namespace std;\n\nint main() {\n    // String operations\n    string s = "Hello World C++";\n    cout << s.length() << endl;         // 15\n    cout << s.substr(6, 5) << endl;     // World\n    cout << s.find("World") << endl;    // 6\n    s.replace(6, 5, "Dev");\n    cout << s << endl; // Hello Dev C++\n\n    // stringstream: string <-> number\n    stringstream ss("42 3.14 hello");\n    int n; double d; string w;\n    ss >> n >> d >> w;\n    cout << n << " " << d << " " << w << endl;\n\n    // File write\n    ofstream out("data.txt");\n    out << "Line 1\\nLine 2\\nLine 3" << endl;\n    out.close();\n\n    // File read\n    ifstream in("data.txt");\n    string line;\n    while (getline(in, line)) {\n        cout << "> " << line << endl;\n    }\n    in.close();\n}',
     lang:'cpp',
     keyPoints:['substr(pos, len), find(str) cho string manipulation','stringstream chuyển đổi string ↔ number linh hoạt','ofstream ghi file, ifstream đọc file, getline đọc từng dòng'],
     exercise:'Viết chương trình đọc file CSV và tính trung bình cột số.'}
  ]},

  // ── MID-LEVEL (3 bài) ──
  {id:'mid',name:'Mid-Level',badge:'mid',desc:'Templates, STL & Modern C++',lessons:[
    {id:'templates',title:'Templates & Generic Programming',
     theory:'<p>Templates cho phép viết code tổng quát cho nhiều kiểu dữ liệu. <code>template<typename T></code> tạo hàm/class hoạt động với bất kỳ kiểu nào.</p><p>STL (Standard Template Library) dựa hoàn toàn trên templates: vector, map, set, algorithm...</p>',
     code:'#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\ntemplate<typename T>\nT findMax(vector<T>& v) {\n    T maxVal = v[0];\n    for (const auto& item : v)\n        if (item > maxVal) maxVal = item;\n    return maxVal;\n}\n\nint main() {\n    vector<int> nums = {3, 7, 1, 9, 4};\n    cout << "Max: " << findMax(nums) << endl;\n    \n    // STL algorithms\n    sort(nums.begin(), nums.end());\n    auto it = find(nums.begin(), nums.end(), 7);\n    cout << "Found 7 at index: " << (it - nums.begin()) << endl;\n}',
     lang:'cpp',
     keyPoints:['template<typename T> cho generic code','STL containers: vector, map, set, unordered_map','auto keyword giúp suy luận kiểu tự động'],
     exercise:'Viết template class Stack<T> với push, pop, top, isEmpty.'},

    {id:'smart-ptr',title:'Smart Pointers & RAII',
     theory:'<p>Modern C++ (C++11+) dùng <strong>smart pointers</strong> thay raw pointer: <code>unique_ptr</code> (sở hữu duy nhất), <code>shared_ptr</code> (chia sẻ), <code>weak_ptr</code> (không sở hữu).</p><p><strong>RAII</strong>: Resource tự giải phóng khi object ra khỏi scope. Không cần delete thủ công!</p>',
     code:'#include <iostream>\n#include <memory>\nusing namespace std;\n\nclass Database {\npublic:\n    Database(string n) : name(n) { cout << name << " opened\\n"; }\n    ~Database() { cout << name << " closed\\n"; }\n    void query(string q) { cout << "Query: " << q << endl; }\nprivate:\n    string name;\n};\n\nint main() {\n    auto db = make_unique<Database>("MainDB");\n    db->query("SELECT * FROM users");\n    \n    auto config = make_shared<Database>("ConfigDB");\n    auto backup = config; // count = 2\n    cout << "Refs: " << config.use_count() << endl;\n} // Tự động close tất cả!',
     lang:'cpp',
     keyPoints:['unique_ptr: 1 owner, không copy được, dùng move()','shared_ptr: đếm reference, auto delete khi count=0','make_unique/make_shared an toàn hơn new'],
     exercise:'Refactor code dùng raw pointer sang smart pointer.'},

    {id:'lambda-modern',title:'Lambda & Modern C++ Features',
     theory:'<p>Lambda (<code>[capture](params){body}</code>) là anonymous function. C++17 thêm <code>structured bindings</code>, <code>optional</code>, <code>filesystem</code>. C++20 có <code>ranges</code>, <code>concepts</code>, <code>coroutines</code>.</p>',
     code:'#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <optional>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {5, 2, 8, 1, 9, 3};\n\n    // Lambda capture\n    int threshold = 4;\n    auto count = count_if(nums.begin(), nums.end(),\n        [threshold](int n) { return n > threshold; });\n    cout << count << " nums > " << threshold << endl; // 3\n\n    // Sort with lambda\n    sort(nums.begin(), nums.end(),\n        [](int a, int b) { return a > b; }); // descending\n\n    // Structured bindings (C++17)\n    auto [minIt, maxIt] = minmax_element(nums.begin(), nums.end());\n    cout << "Min: " << *minIt << " Max: " << *maxIt << endl;\n\n    // std::optional (C++17)\n    auto findEven = [](vector<int>& v) -> optional<int> {\n        for (int x : v) if (x % 2 == 0) return x;\n        return nullopt;\n    };\n    if (auto val = findEven(nums)) {\n        cout << "First even: " << *val << endl;\n    }\n}',
     lang:'cpp',
     keyPoints:['Lambda: [capture](params) -> ret { body }','Structured bindings: auto [a, b] = pair/tuple','std::optional thay nullptr/magic values cho "có thể không có"'],
     exercise:'Dùng lambda + STL algorithms transform và filter một vector.'}
  ]},

  // ── SENIOR (3 bài) ──
  {id:'senior',name:'Senior',badge:'senior',desc:'Concurrency, Design Patterns & Optimization',lessons:[
    {id:'concurrency',title:'Multithreading & Concurrency',
     theory:'<p>C++11 cung cấp <code>std::thread</code>, <code>mutex</code>, <code>condition_variable</code>, <code>future/promise</code> cho lập trình đa luồng.</p><p><strong>Race condition</strong> xảy ra khi nhiều thread truy cập chung data. Dùng <code>lock_guard</code> hoặc <code>unique_lock</code> để bảo vệ.</p>',
     code:'#include <iostream>\n#include <thread>\n#include <mutex>\n#include <vector>\nusing namespace std;\n\nmutex mtx;\nint counter = 0;\n\nvoid increment(int times) {\n    for (int i = 0; i < times; i++) {\n        lock_guard<mutex> lock(mtx);\n        counter++;\n    }\n}\n\nint main() {\n    vector<thread> threads;\n    for (int i = 0; i < 4; i++)\n        threads.emplace_back(increment, 10000);\n    \n    for (auto& t : threads) t.join();\n    cout << "Counter: " << counter << endl; // 40000\n}',
     lang:'cpp',
     keyPoints:['std::thread tạo thread, .join() đợi kết thúc','mutex + lock_guard tránh race condition','atomic<int> cho operations đơn giản, nhanh hơn mutex'],
     exercise:'Viết producer-consumer pattern dùng condition_variable.'},

    {id:'design-patterns',title:'Design Patterns trong C++',
     theory:'<p>Design patterns là giải pháp đã được chứng minh cho vấn đề phổ biến. <strong>Singleton</strong> đảm bảo 1 instance. <strong>Observer</strong> cho event system. <strong>Factory</strong> tạo object linh hoạt. <strong>Strategy</strong> thay đổi algorithm runtime.</p>',
     code:'#include <iostream>\n#include <vector>\n#include <functional>\n#include <memory>\nusing namespace std;\n\n// Strategy Pattern\nclass SortStrategy {\npublic:\n    virtual void sort(vector<int>& v) = 0;\n    virtual ~SortStrategy() = default;\n};\n\nclass BubbleSort : public SortStrategy {\npublic:\n    void sort(vector<int>& v) override {\n        for (size_t i = 0; i < v.size(); i++)\n            for (size_t j = 0; j < v.size()-i-1; j++)\n                if (v[j] > v[j+1]) swap(v[j], v[j+1]);\n        cout << "Bubble sorted" << endl;\n    }\n};\n\nclass QuickSort : public SortStrategy {\npublic:\n    void sort(vector<int>& v) override {\n        std::sort(v.begin(), v.end());\n        cout << "Quick sorted" << endl;\n    }\n};\n\nclass Sorter {\n    unique_ptr<SortStrategy> strategy;\npublic:\n    void setStrategy(unique_ptr<SortStrategy> s) {\n        strategy = move(s);\n    }\n    void sort(vector<int>& v) { strategy->sort(v); }\n};\n\nint main() {\n    Sorter sorter;\n    vector<int> data = {5, 2, 8, 1};\n    sorter.setStrategy(make_unique<QuickSort>());\n    sorter.sort(data);\n}',
     lang:'cpp',
     keyPoints:['Strategy: thay đổi algorithm runtime qua interface','Factory: tạo object mà không expose creation logic','Observer: notify nhiều listeners khi state thay đổi'],
     exercise:'Implement Observer pattern cho event-driven game system.'},

    {id:'perf-optimization',title:'Performance & Memory Optimization',
     theory:'<p>C++ cho kiểm soát tối đa hiệu năng. <code>move semantics</code> tránh copy không cần thiết. <code>constexpr</code> tính toán compile-time. Cache-friendly code, memory alignment, profiling.</p>',
     code:'#include <iostream>\n#include <vector>\n#include <chrono>\n#include <numeric>\nusing namespace std;\n\n// Move semantics\nclass Buffer {\n    int* data;\n    size_t size;\npublic:\n    Buffer(size_t n) : data(new int[n]), size(n) {\n        iota(data, data + n, 0);\n    }\n    // Move constructor (steal resources)\n    Buffer(Buffer&& other) noexcept\n        : data(other.data), size(other.size) {\n        other.data = nullptr;\n        other.size = 0;\n    }\n    ~Buffer() { delete[] data; }\n    size_t getSize() const { return size; }\n};\n\n// constexpr: compile-time computation\nconstexpr int factorial(int n) {\n    return (n <= 1) ? 1 : n * factorial(n - 1);\n}\n\nint main() {\n    // Move vs Copy\n    Buffer a(1000000);\n    Buffer b = move(a); // O(1) move, not O(n) copy!\n    cout << "b size: " << b.getSize() << endl;\n\n    constexpr int f10 = factorial(10); // compile-time!\n    cout << "10! = " << f10 << endl;\n\n    // Benchmarking\n    auto start = chrono::high_resolution_clock::now();\n    vector<int> v(10000000, 1);\n    long long sum = accumulate(v.begin(), v.end(), 0LL);\n    auto end = chrono::high_resolution_clock::now();\n    auto ms = chrono::duration_cast<chrono::milliseconds>(end-start);\n    cout << "Sum=" << sum << " Time=" << ms.count() << "ms" << endl;\n}',
     lang:'cpp',
     keyPoints:['Move semantics: std::move chuyển ownership, tránh copy O(n)','constexpr tính toán tại compile-time, zero runtime cost','noexcept cho move constructor/assignment để STL optimize'],
     exercise:'So sánh performance giữa copy vs move với vector 10M elements.'}
  ]},

  // ── MASTER (2 bài) ──
  {id:'master',name:'Master',badge:'master',desc:'Metaprogramming & System Design',lessons:[
    {id:'metaprog',title:'Template Metaprogramming',
     theory:'<p>Template metaprogramming tính toán <strong>tại compile-time</strong>. C++17 <code>constexpr if</code> và C++20 <code>concepts</code> làm code generic an toàn và rõ ràng hơn.</p><p>SFINAE, CRTP, và variadic templates là kỹ thuật nâng cao cho library design.</p>',
     code:'#include <iostream>\n#include <concepts>\nusing namespace std;\n\n// C++20 Concepts\ntemplate<typename T>\nconcept Numeric = is_arithmetic_v<T>;\n\ntemplate<Numeric T>\nT safeDiv(T a, T b) {\n    if (b == 0) throw runtime_error("Division by zero");\n    return a / b;\n}\n\nconstexpr int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    cout << safeDiv(10.0, 3.0) << endl;\n    // safeDiv("a", "b"); // Compile error! Not Numeric\n    \n    constexpr int f10 = factorial(10);\n    cout << "10! = " << f10 << endl;\n}',
     lang:'cpp',
     keyPoints:['concepts (C++20) ràng buộc template rõ ràng','constexpr tính toán tại compile-time','CRTP: Curiously Recurring Template Pattern cho static polymorphism'],
     exercise:'Viết concept Sortable và hàm sort tổng quát dùng concepts.'},

    {id:'system-design',title:'System Design với C++',
     theory:'<p>Master C++ = thiết kế hệ thống lớn. Memory pool, custom allocators, lock-free data structures. CMake cho build system, sanitizers (ASan, TSan) cho debugging.</p>',
     code:'#include <iostream>\n#include <array>\n#include <atomic>\nusing namespace std;\n\n// Lock-free stack (simplified)\ntemplate<typename T>\nclass LockFreeStack {\n    struct Node {\n        T data;\n        Node* next;\n    };\n    atomic<Node*> head{nullptr};\npublic:\n    void push(T val) {\n        Node* node = new Node{val, nullptr};\n        node->next = head.load();\n        while (!head.compare_exchange_weak(node->next, node));\n    }\n    bool pop(T& val) {\n        Node* node = head.load();\n        while (node && !head.compare_exchange_weak(node, node->next));\n        if (!node) return false;\n        val = node->data;\n        delete node;\n        return true;\n    }\n};\n\n// Object pool pattern\ntemplate<typename T, size_t N>\nclass ObjectPool {\n    array<T, N> pool;\n    array<bool, N> used{};\npublic:\n    T* acquire() {\n        for (size_t i = 0; i < N; i++)\n            if (!used[i]) { used[i]=true; return &pool[i]; }\n        return nullptr;\n    }\n    void release(T* obj) {\n        size_t idx = obj - &pool[0];\n        if (idx < N) used[idx] = false;\n    }\n};\n\nint main() {\n    LockFreeStack<int> stack;\n    stack.push(1); stack.push(2); stack.push(3);\n    int val;\n    while (stack.pop(val)) cout << val << " "; // 3 2 1\n}',
     lang:'cpp',
     keyPoints:['atomic + compare_exchange cho lock-free algorithms','Object pool: pre-allocate, reuse, tránh new/delete runtime','Memory alignment: alignas, cache line optimization'],
     exercise:'Thiết kế game engine ECS (Entity-Component-System) architecture.'}
  ]}
]
};
