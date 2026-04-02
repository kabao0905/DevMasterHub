// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Extra Languages Pack 2
// Zig, Elixir, Solidity, Lua, R, Scala
// FORMAT: levels = ARRAY (matching data-cpp.js structure)
// ═══════════════════════════════════════════════════════════════

const DATA_ZIG = {
  id:'zig', name:'Zig', icon:'⚡', color:'#F7A41D',
  gradient:'linear-gradient(135deg,#F7A41D,#EC8B00)',
  category:'language',
  description:'Systems programming language — fast, safe, C replacement',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp cơ bản & nền tảng',lessons:[
      {id:'intro',title:'Zig Overview & Setup',
       theory:'<p><b>Zig</b> là ngôn ngữ systems programming hiện đại, thay thế C/C++. Không garbage collector, compile-time code execution, interop trực tiếp với C.</p><p>Đặc điểm: Safety + Performance + Simplicity.</p>',
       code:'const std = @import("std");\n\npub fn main() void {\n    std.debug.print("Hello, Zig!\\n", .{});\n}',
       lang:'zig',
       keyPoints:['Systems programming language','No hidden control flow','Compile-time evaluation','C interop'],
       exercise:'Viết chương trình Hello World bằng Zig'},
      {id:'variables',title:'Variables & Types',
       theory:'<p>Zig có <code>const</code> (immutable) và <code>var</code> (mutable). Kiểu dữ liệu: <code>u8, i32, f64, bool, []u8</code>.</p><p>Type inference với <code>const x = 42;</code></p>',
       code:'const x: i32 = 42;\nvar y: f64 = 3.14;\ny += 1.0;\n\nconst name = "Zig";\nconst len = name.len; // 3',
       lang:'zig',
       keyPoints:['const = immutable, var = mutable','Explicit integer sizes (u8, i32, u64)','Optional types: ?T','Error union: !T'],
       exercise:'Khai báo các biến với kiểu i32, f64, bool và in ra'},
      {id:'functions',title:'Functions & Error Handling',
       theory:'<p>Functions trong Zig dùng <code>fn</code>. Error handling dùng <code>try/catch</code> pattern với error unions.</p>',
       code:'fn add(a: i32, b: i32) i32 {\n    return a + b;\n}\n\nfn divide(a: f64, b: f64) !f64 {\n    if (b == 0) return error.DivisionByZero;\n    return a / b;\n}\n\npub fn main() !void {\n    const result = try divide(10.0, 3.0);\n    std.debug.print("{d}\\n", .{result});\n}',
       lang:'zig',
       keyPoints:['fn keyword khai báo function','Error unions với !T','try/catch pattern','Comptime functions'],
       exercise:'Viết function tính giai thừa với error handling'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Structs, Memory & Slices',lessons:[
      {id:'structs',title:'Structs & Methods',
       theory:'<p>Zig dùng structs thay cho classes. Methods là functions nhận <code>self</code> parameter.</p>',
       code:'const Point = struct {\n    x: f64,\n    y: f64,\n\n    fn distance(self: Point, other: Point) f64 {\n        const dx = self.x - other.x;\n        const dy = self.y - other.y;\n        return @sqrt(dx * dx + dy * dy);\n    }\n};',
       lang:'zig',
       keyPoints:['Structs thay classes','Methods qua self parameter','Packed structs cho memory layout','Anonymous structs'],
       exercise:'Tạo struct Rectangle với method area() và perimeter()'},
      {id:'arrays',title:'Arrays, Slices & Strings',
       theory:'<p>Arrays có fixed-size, slices là pointers với length. String literals là <code>[]const u8</code>.</p>',
       code:'const arr = [_]i32{ 1, 2, 3, 4, 5 };\nconst slice = arr[1..4]; // [2, 3, 4]\n\nfor (arr) |val| {\n    std.debug.print("{d} ", .{val});\n}\n\nconst hello = "Hello";\nconst world = "World";',
       lang:'zig',
       keyPoints:['Fixed-size arrays [N]T','Slices []T = ptr + len','String = []const u8','for loops with capture'],
       exercise:'Tạo array, slice và iterate qua chúng'},
      {id:'memory',title:'Memory Management',
       theory:'<p>Zig không có garbage collector. Dùng allocators để quản lý memory một cách explicit.</p>',
       code:'const allocator = std.heap.page_allocator;\n\nconst ptr = try allocator.create(i32);\ndefer allocator.destroy(ptr);\nptr.* = 42;\n\nvar list = std.ArrayList(i32).init(allocator);\ndefer list.deinit();\ntry list.append(1);\ntry list.append(2);',
       lang:'zig',
       keyPoints:['Explicit allocators','defer cho cleanup','No hidden allocations','Arena allocator pattern'],
       exercise:'Dùng ArrayList với allocator, đảm bảo cleanup bằng defer'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Comptime, Async & FFI',lessons:[
      {id:'comptime',title:'Comptime & Generics',
       theory:'<p><code>comptime</code> là feature mạnh nhất của Zig — chạy code lúc compile-time thay vì runtime.</p>',
       code:'fn Matrix(comptime T: type, comptime rows: usize, comptime cols: usize) type {\n    return struct {\n        data: [rows][cols]T,\n        fn init() @This() {\n            return .{ .data = std.mem.zeroes([rows][cols]T) };\n        }\n    };\n}\n\nconst Mat3x3 = Matrix(f64, 3, 3);',
       lang:'zig',
       keyPoints:['comptime = compile-time evaluation','Type-level programming','Generic functions/structs','No runtime cost'],
       exercise:'Viết generic Stack(T) dùng comptime'},
      {id:'async',title:'Async I/O & Networking',
       theory:'<p>Zig có built-in async/await với event loop. Dùng cho I/O non-blocking.</p>',
       code:'const net = std.net;\n\nfn handleClient(conn: net.StreamServer.Connection) void {\n    defer conn.stream.close();\n    const request = conn.stream.reader().readUntilDelimiterAlloc(\n        std.heap.page_allocator, \'\\n\', 4096\n    ) catch return;\n    conn.stream.writer().writeAll("HTTP/1.1 200 OK\\r\\n\\r\\nHello!") catch return;\n}',
       lang:'zig',
       keyPoints:['Event-driven I/O','std.net cho networking','Async frames','Non-blocking patterns'],
       exercise:'Tạo TCP echo server đơn giản'},
      {id:'c_interop',title:'C Interop & FFI',
       theory:'<p>Zig có thể import C headers trực tiếp, gọi C functions, link C libraries.</p>',
       code:'const c = @cImport({\n    @cInclude("stdio.h");\n    @cInclude("stdlib.h");\n});\n\npub fn main() void {\n    _ = c.printf("Hello from C!\\n");\n    const ptr = c.malloc(100);\n    defer c.free(ptr);\n}',
       lang:'zig',
       keyPoints:['@cImport / @cInclude','Dùng C libraries trực tiếp','ABI compatibility','Cross-compilation'],
       exercise:'Import và dùng một C library trong Zig'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Build System & Cross-Compilation',lessons:[
      {id:'build',title:'Build System & Cross-Compilation',
       theory:'<p>Zig build system dùng <code>build.zig</code>. Support cross-compilation cho mọi target.</p>',
       code:'// build.zig\nconst std = @import("std");\n\npub fn build(b: *std.Build) void {\n    const target = b.standardTargetOptions(.{});\n    const optimize = b.standardOptimizeOption(.{});\n    const exe = b.addExecutable(.{\n        .name = "myapp",\n        .root_source_file = .{ .path = "src/main.zig" },\n        .target = target,\n        .optimize = optimize,\n    });\n    b.installArtifact(exe);\n}',
       lang:'zig',
       keyPoints:['build.zig thay Makefile','Cross-compile mọi platform','Dependency management','Build modes: Debug/Release'],
       exercise:'Tạo build.zig cho project multi-file'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'OS-Level & Embedded Programming',lessons:[
      {id:'os',title:'OS-Level Programming',
       theory:'<p>Zig phù hợp cho OS development: direct system calls, memory-mapped I/O, kernels.</p>',
       code:'const os = std.os;\n\n// Direct syscall\nconst fd = os.open("/tmp/test.txt", .{ .ACCMODE = .WRONLY, .CREAT = true }, 0o644);\ndefer os.close(fd);\n_ = os.write(fd, "Hello OS level!") catch 0;\n\n// Memory mapping\nconst mem = os.mmap(null, 4096, os.PROT.READ | os.PROT.WRITE, .{ .TYPE = .PRIVATE, .ANONYMOUS = true }, -1, 0);',
       lang:'zig',
       keyPoints:['Direct syscalls','Memory-mapped I/O','Kernel development','Embedded systems'],
       exercise:'Viết program dùng direct syscalls để đọc/ghi file'}
    ]}
  ]
};

const DATA_ELIXIR = {
  id:'elixir', name:'Elixir', icon:'💧', color:'#6E4A7E',
  gradient:'linear-gradient(135deg,#6E4A7E,#9B59B6)',
  category:'language',
  description:'Functional, concurrent — Phoenix, real-time systems',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Pattern matching & BEAM VM',lessons:[
      {id:'intro',title:'Elixir Overview & IEx',
       theory:'<p><b>Elixir</b> chạy trên BEAM VM (Erlang). Functional, immutable, concurrent. Dùng cho real-time systems (chat, gaming, IoT).</p>',
       code:'# IEx - Interactive Elixir\nIO.puts("Hello, Elixir!")\n\n# Variables (immutable!)\nname = "DevMaster"\nage = 25\n\n# String interpolation\nIO.puts("#{name} is #{age} years old")\n\n# Pattern matching\n{a, b, c} = {1, 2, 3}\nIO.inspect(a) # 1',
       lang:'elixir',
       keyPoints:['BEAM VM (Erlang ecosystem)','Immutable data','Pattern matching everywhere','IEx shell = REPL'],
       exercise:'Mở IEx, thử pattern matching với tuples và lists'},
      {id:'types',title:'Data Types & Pattern Matching',
       theory:'<p>Elixir types: atoms, tuples, lists, maps, strings. Pattern matching là cốt lõi.</p>',
       code:'# Atoms\nstatus = :ok\n\n# Lists\nlist = [1, 2, 3]\n[head | tail] = list  # head=1, tail=[2,3]\n\n# Maps\nuser = %{name: "Minh", age: 22}\n%{name: name} = user  # pattern match!\n\n# Case with pattern matching\ncase {1, 2, 3} do\n  {1, x, 3} -> IO.puts("x = #{x}")\n  _ -> IO.puts("no match")\nend',
       lang:'elixir',
       keyPoints:['Atoms: :ok, :error','Lists = linked lists','Maps = key-value','Pattern matching = assignment'],
       exercise:'Tạo map cho user profile, dùng pattern matching extract'},
      {id:'functions',title:'Functions & Modules',
       theory:'<p>Elixir dùng modules để nhóm functions. Hỗ trợ multiple function clauses qua pattern matching.</p>',
       code:'defmodule Math do\n  def factorial(0), do: 1\n  def factorial(n) when n > 0 do\n    n * factorial(n - 1)\n  end\n\n  def sum(list) do\n    Enum.reduce(list, 0, &(&1 + &2))\n  end\nend\n\nIO.puts Math.factorial(5)  # 120\nIO.puts Math.sum([1,2,3])  # 6',
       lang:'elixir',
       keyPoints:['defmodule/def keywords','Multi-clause functions','Guards (when)','Pipe operator |>'],
       exercise:'Tạo module Calculator với add, subtract, multiply, divide'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Concurrency & OTP',lessons:[
      {id:'enum',title:'Enum, Stream & Pipe Operator',
       theory:'<p><code>Enum</code> cho eager operations, <code>Stream</code> cho lazy. Pipe operator <code>|></code> chain operations.</p>',
       code:'# Pipe operator — Elixir signature!\n1..100\n|> Enum.filter(&(rem(&1, 2) == 0))\n|> Enum.map(&(&1 * &1))\n|> Enum.take(5)\n|> IO.inspect()  # [4, 16, 36, 64, 100]\n\n# Stream (lazy eval)\n1..1_000_000\n|> Stream.filter(&(rem(&1, 2) == 0))\n|> Stream.map(&(&1 * 2))\n|> Enum.take(3)  # [4, 8, 12]',
       lang:'elixir',
       keyPoints:['|> pipe operator = read code left-to-right','Enum = eager, Stream = lazy','Anonymous functions &()','Comprehensions for/do'],
       exercise:'Dùng pipe operator xử lý list: filter → transform → sort'},
      {id:'processes',title:'Processes & Concurrency',
       theory:'<p>Elixir processes siêu nhẹ (millions OK). Communicate via message passing.</p>',
       code:'defmodule Worker do\n  def start do\n    spawn(fn -> loop() end)\n  end\n\n  defp loop do\n    receive do\n      {:hello, sender} ->\n        send(sender, {:reply, "Hello back!"})\n        loop()\n      :stop -> :ok\n    end\n  end\nend\n\npid = Worker.start()\nsend(pid, {:hello, self()})\nreceive do\n  {:reply, msg} -> IO.puts(msg)\nend',
       lang:'elixir',
       keyPoints:['spawn/send/receive','Lightweight processes (not OS threads)','Message passing = actor model','Process isolation'],
       exercise:'Tạo 2 processes giao tiếp ping-pong với nhau'},
      {id:'genserver',title:'GenServer & OTP',
       theory:'<p>GenServer abstraction cho stateful processes. OTP = framework cho fault-tolerant systems.</p>',
       code:'defmodule Counter do\n  use GenServer\n\n  def start_link(initial) do\n    GenServer.start_link(__MODULE__, initial, name: __MODULE__)\n  end\n\n  def increment, do: GenServer.call(__MODULE__, :increment)\n  def get, do: GenServer.call(__MODULE__, :get)\n\n  @impl true\n  def init(count), do: {:ok, count}\n\n  @impl true\n  def handle_call(:increment, _from, count), do: {:reply, count + 1, count + 1}\n  def handle_call(:get, _from, count), do: {:reply, count, count}\nend',
       lang:'elixir',
       keyPoints:['GenServer = stateful process','call (sync) vs cast (async)','OTP behaviors','Supervisor trees'],
       exercise:'Tạo GenServer TodoList: add, remove, list items'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Phoenix Framework',lessons:[
      {id:'phoenix',title:'Phoenix Framework',
       theory:'<p>Phoenix = web framework cho Elixir. Real-time via channels, LiveView cho SPA without JS.</p>',
       code:'defmodule MyAppWeb.PageController do\n  use MyAppWeb, :controller\n\n  def index(conn, _params) do\n    render(conn, :index)\n  end\n\n  def show(conn, %{"id" => id}) do\n    user = MyApp.Accounts.get_user!(id)\n    json(conn, %{user: user})\n  end\nend',
       lang:'elixir',
       keyPoints:['MVC pattern','Channels for WebSocket','LiveView = reactive UI','Ecto for database'],
       exercise:'Tạo Phoenix app với REST API đơn giản'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Distributed Systems',lessons:[
      {id:'distributed',title:'Distributed Systems',
       theory:'<p>Elixir/BEAM native support cho distribution. Nodes kết nối và communicate.</p>',
       code:'# Connect nodes\nNode.connect(:node2@hostname)\n\n# Send message to remote process\nNode.spawn(:node2@hostname, fn ->\n  IO.puts("Running on remote node!")\nend)\n\n# Distributed GenServer\nGenServer.call({MyServer, :node2@hostname}, :request)',
       lang:'elixir',
       keyPoints:['Node clustering','Remote process communication','Distributed ETS','Horde/libcluster'],
       exercise:'Setup 2 Elixir nodes và giao tiếp giữa chúng'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Production Architecture',lessons:[
      {id:'production',title:'Production Architecture',
       theory:'<p>Production Elixir: releases, hot code upgrades, telemetry, observability.</p>',
       code:'# mix.exs releases config\ndef project do\n  [app: :my_app, releases: [\n    my_app: [include_executables_for: [:unix]]\n  ]]\nend\n\n# Telemetry\n:telemetry.attach("handler", [:my_app, :request], fn name, measurements, metadata, _ ->\n  Logger.info("Request took #{measurements.duration}ms")\nend, nil)',
       lang:'elixir',
       keyPoints:['Mix releases','Hot code upgrades','Telemetry & observability','Deployment strategies'],
       exercise:'Build release và configure telemetry cho Phoenix app'}
    ]}
  ]
};

const DATA_SOLIDITY = {
  id:'solidity', name:'Solidity', icon:'🔗', color:'#363636',
  gradient:'linear-gradient(135deg,#363636,#1a1a2e)',
  category:'language',
  description:'Smart contracts — Ethereum, Web3, DeFi',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Blockchain & Smart Contracts cơ bản',lessons:[
      {id:'intro',title:'Blockchain & Smart Contracts',
       theory:'<p><b>Solidity</b> = ngôn ngữ viết smart contracts trên Ethereum. Compiled to EVM bytecode. Immutable once deployed.</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract HelloWorld {\n    string public greeting = "Hello, Web3!";\n    \n    function setGreeting(string memory _greeting) public {\n        greeting = _greeting;\n    }\n    \n    function getGreeting() public view returns (string memory) {\n        return greeting;\n    }\n}',
       lang:'javascript',
       keyPoints:['EVM = Ethereum Virtual Machine','Smart contracts = immutable programs','Gas fees cho mỗi transaction','Solidity = statically typed, Ethereum-native'],
       exercise:'Deploy HelloWorld contract trên Remix IDE'},
      {id:'types',title:'Types, Variables & Functions',
       theory:'<p>Solidity types: <code>uint, int, address, bool, string, bytes</code>. Storage vs Memory vs Calldata.</p>',
       code:'contract Types {\n    uint256 public count;\n    address public owner;\n    bool public active;\n    mapping(address => uint256) public balances;\n    \n    constructor() {\n        owner = msg.sender;\n        active = true;\n    }\n    \n    function increment() public {\n        count += 1;\n    }\n    \n    modifier onlyOwner() {\n        require(msg.sender == owner, "Not owner");\n        _;\n    }\n}',
       lang:'javascript',
       keyPoints:['uint256 = unsigned 256-bit integer','address type cho wallet/contract','mapping = hash table','Modifiers cho access control'],
       exercise:'Tạo contract Counter với owner-only reset'},
      {id:'events',title:'Events & Logging',
       theory:'<p>Events emit logs on blockchain. Frontend dùng events để listen cho changes.</p>',
       code:'contract EventDemo {\n    event Transfer(address indexed from, address indexed to, uint256 amount);\n    event Log(string message);\n    \n    function transfer(address _to, uint256 _amount) public {\n        emit Transfer(msg.sender, _to, _amount);\n        emit Log("Transfer completed");\n    }\n}',
       lang:'javascript',
       keyPoints:['Events = on-chain logs','indexed cho filtering','Frontend listen via ethers.js','Gas efficient logging'],
       exercise:'Tạo contract với events cho CRUD operations'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'ERC-20 & Security',lessons:[
      {id:'erc20',title:'ERC-20 Token',
       theory:'<p>ERC-20 = standard interface cho fungible tokens. balanceOf, transfer, approve, transferFrom.</p>',
       code:'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";\n\ncontract MyToken is ERC20 {\n    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {\n        _mint(msg.sender, initialSupply * 10 ** decimals());\n    }\n}',
       lang:'javascript',
       keyPoints:['ERC-20 standard interface','OpenZeppelin libraries','Minting & burning','Approve/transferFrom pattern'],
       exercise:'Tạo ERC-20 token với mint function'},
      {id:'security',title:'Security & Common Attacks',
       theory:'<p>Smart contract security: reentrancy, overflow, access control. Bugs = lost money!</p>',
       code:'contract Secure {\n    mapping(address => uint256) balances;\n    bool locked;\n    \n    modifier noReentrant() {\n        require(!locked, "Reentrant call");\n        locked = true;\n        _;\n        locked = false;\n    }\n    \n    function withdraw() public noReentrant {\n        uint256 bal = balances[msg.sender];\n        require(bal > 0);\n        balances[msg.sender] = 0; // CEI pattern\n        (bool ok, ) = msg.sender.call{value: bal}("");\n        require(ok);\n    }\n}',
       lang:'javascript',
       keyPoints:['Reentrancy attacks','Checks-Effects-Interactions','Access control','Integer overflow (SafeMath)'],
       exercise:'Audit contract tìm vulnerabilities'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'DeFi Protocols',lessons:[
      {id:'defi',title:'DeFi Protocols',
       theory:'<p>DeFi = Decentralized Finance. AMMs, lending, staking, yield farming.</p>',
       code:'// Simple staking contract\ncontract Staking {\n    IERC20 public stakingToken;\n    mapping(address => uint256) public staked;\n    mapping(address => uint256) public rewards;\n    \n    function stake(uint256 amount) external {\n        stakingToken.transferFrom(msg.sender, address(this), amount);\n        staked[msg.sender] += amount;\n    }\n    \n    function unstake(uint256 amount) external {\n        require(staked[msg.sender] >= amount);\n        staked[msg.sender] -= amount;\n        stakingToken.transfer(msg.sender, amount);\n    }\n}',
       lang:'javascript',
       keyPoints:['AMM = Automated Market Maker','Liquidity pools','Yield farming','Flash loans'],
       exercise:'Tạo simple staking contract'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Proxy Patterns & Upgrades',lessons:[
      {id:'advanced',title:'Proxy Patterns & Upgrades',
       theory:'<p>Proxy patterns cho phép upgrade contracts. UUPS, Transparent proxy, Diamond pattern.</p>',
       code:'// UUPS Proxy pattern\nimport "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";\n\ncontract MyContractV1 is UUPSUpgradeable {\n    uint256 public value;\n    \n    function initialize(uint256 _value) public initializer {\n        value = _value;\n    }\n    \n    function _authorizeUpgrade(address) internal override {}\n}',
       lang:'javascript',
       keyPoints:['Proxy delegate calls','Storage layout compatibility','UUPS vs Transparent','Diamond pattern (EIP-2535)'],
       exercise:'Implement upgradeable contract với proxy pattern'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Protocol Architecture & Governance',lessons:[
      {id:'protocol',title:'Protocol Architecture',
       theory:'<p>Design full DeFi protocol: governance, tokenomics, multi-chain deployment.</p>',
       code:'// Governance token\ncontract Governance {\n    struct Proposal {\n        uint256 id;\n        string description;\n        uint256 forVotes;\n        uint256 againstVotes;\n        uint256 endTime;\n        bool executed;\n    }\n    \n    mapping(uint256 => Proposal) public proposals;\n    uint256 public proposalCount;\n    \n    function propose(string memory desc) external returns (uint256) {\n        proposalCount++;\n        proposals[proposalCount] = Proposal(proposalCount, desc, 0, 0, block.timestamp + 7 days, false);\n        return proposalCount;\n    }\n}',
       lang:'javascript',
       keyPoints:['Governance systems','Tokenomics design','Multi-chain deployment','MEV protection'],
       exercise:'Design governance system cho DAO'}
    ]}
  ]
};

const DATA_LUA = {
  id:'lua', name:'Lua', icon:'🌙', color:'#000080',
  gradient:'linear-gradient(135deg,#000080,#2C2C54)',
  category:'language',
  description:'Lightweight scripting — game dev, Roblox, embedding',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp cơ bản & Tables',lessons:[
      {id:'intro',title:'Lua Basics & REPL',
       theory:'<p><b>Lua</b> = ngôn ngữ scripting nhẹ, nhúng vào applications. Dùng trong game development (Roblox, Love2D, WoW addons).</p>',
       code:'-- Hello World\nprint("Hello, Lua!")\n\n-- Variables (dynamic typing)\nlocal name = "DevMaster"\nlocal age = 25\nlocal active = true\n\n-- String concatenation\nprint(name .. " is " .. age .. " years old")\n\n-- Nil = no value\nlocal x = nil\nprint(type(x)) -- "nil"',
       lang:'lua',
       keyPoints:['Lightweight scripting language','Dynamic typing','1-indexed arrays','nil = null/undefined','local keyword cho scope'],
       exercise:'Print thông tin cá nhân dùng Lua variables'},
      {id:'tables',title:'Tables — Universal Data Structure',
       theory:'<p>Tables = cấu trúc dữ liệu duy nhất trong Lua. Đóng vai trò arrays, maps, objects.</p>',
       code:'-- Array style\nlocal fruits = {"apple", "banana", "mango"}\nprint(fruits[1]) -- "apple" (1-indexed!)\n\n-- Dictionary style\nlocal user = {\n    name = "Minh",\n    age = 22,\n    skills = {"Lua", "Python"}\n}\nprint(user.name)\nprint(user["age"])\n\n-- Iterate\nfor i, v in ipairs(fruits) do\n    print(i, v)\nend\n\nfor k, v in pairs(user) do\n    print(k, v)\nend',
       lang:'lua',
       keyPoints:['Tables = arrays + maps + objects','1-indexed (not 0!)','ipairs = array iteration','pairs = dictionary iteration'],
       exercise:'Tạo table inventory cho RPG game'},
      {id:'functions',title:'Functions & Closures',
       theory:'<p>Functions trong Lua là first-class. Closures, varargs, multiple returns.</p>',
       code:'local function greet(name)\n    return "Hello, " .. name .. "!"\nend\n\n-- Multiple return values\nlocal function divide(a, b)\n    if b == 0 then return nil, "Division by zero" end\n    return a / b, nil\nend\n\nlocal result, err = divide(10, 0)\nif err then print("Error: " .. err) end\n\n-- Closures\nlocal function counter()\n    local count = 0\n    return function()\n        count = count + 1\n        return count\n    end\nend\n\nlocal next = counter()\nprint(next()) -- 1\nprint(next()) -- 2',
       lang:'lua',
       keyPoints:['First-class functions','Multiple return values','Closures capture state','Varargs with ...'],
       exercise:'Tạo closure timer đếm giây'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'OOP & Modules',lessons:[
      {id:'oop',title:'OOP with Metatables',
       theory:'<p>Lua dùng metatables cho OOP. __index metamethod cho inheritance.</p>',
       code:'local Animal = {}\nAnimal.__index = Animal\n\nfunction Animal.new(name, sound)\n    local self = setmetatable({}, Animal)\n    self.name = name\n    self.sound = sound\n    return self\nend\n\nfunction Animal:speak()\n    print(self.name .. " says " .. self.sound)\nend\n\n-- Inheritance\nlocal Dog = setmetatable({}, {__index = Animal})\nDog.__index = Dog\n\nfunction Dog.new(name)\n    local self = Animal.new(name, "Woof")\n    return setmetatable(self, Dog)\nend\n\nlocal rex = Dog.new("Rex")\nrex:speak() -- "Rex says Woof"',
       lang:'lua',
       keyPoints:['Metatables = prototype-based OOP','__index cho inheritance',': syntax = implicit self','setmetatable()'],
       exercise:'Tạo class hierarchy Vehicle > Car > ElectricCar'},
      {id:'modules',title:'Modules & Packages',
       theory:'<p>Modules trong Lua dùng tables + require. LuaRocks = package manager.</p>',
       code:'-- mymodule.lua\nlocal M = {}\n\nfunction M.greet(name)\n    return "Hello, " .. name\nend\n\nfunction M.add(a, b)\n    return a + b\nend\n\nreturn M\n\n-- main.lua\nlocal mymod = require("mymodule")\nprint(mymod.greet("World"))\nprint(mymod.add(2, 3))',
       lang:'lua',
       keyPoints:['Modules = tables','require() loads modules','LuaRocks for packages','Package search paths'],
       exercise:'Tạo module math utilities rồi require vào main'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Game Development',lessons:[
      {id:'gamedev',title:'Game Development (Love2D / Roblox)',
       theory:'<p>Lua dùng rộng rãi trong game: Love2D, Roblox, Corona SDK, WoW. Game loop: load → update → draw.</p>',
       code:'-- Love2D game loop\nfunction love.load()\n    player = {x = 400, y = 300, speed = 200}\n    score = 0\nend\n\nfunction love.update(dt)\n    if love.keyboard.isDown("left") then\n        player.x = player.x - player.speed * dt\n    end\n    if love.keyboard.isDown("right") then\n        player.x = player.x + player.speed * dt\n    end\nend\n\nfunction love.draw()\n    love.graphics.circle("fill", player.x, player.y, 20)\n    love.graphics.print("Score: " .. score, 10, 10)\nend',
       lang:'lua',
       keyPoints:['Love2D framework','Game loop: load/update/draw','Roblox Luau scripting','Input handling'],
       exercise:'Tạo game đơn giản di chuyển player tránh obstacles'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Embedding Lua trong C/C++',lessons:[
      {id:'embedding',title:'Embedding Lua in C/C++',
       theory:'<p>Lua được thiết kế để nhúng vào C/C++ applications. Config files, scripting, plugin systems.</p>',
       code:'// C code embedding Lua\n#include <lua.h>\n#include <lauxlib.h>\n#include <lualib.h>\n\nint main() {\n    lua_State *L = luaL_newstate();\n    luaL_openlibs(L);\n    \n    // Execute Lua string\n    luaL_dostring(L, "x = 42");\n    \n    // Get value from Lua\n    lua_getglobal(L, "x");\n    int x = lua_tointeger(L, -1);\n    printf("x = %d\\n", x);\n    \n    lua_close(L);\n    return 0;\n}',
       lang:'c',
       keyPoints:['Lua C API','Stack-based communication','Registering C functions','Configuration scripting'],
       exercise:'Nhúng Lua interpreter vào C program'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Coroutines & LuaJIT',lessons:[
      {id:'advanced',title:'Advanced Patterns & Optimization',
       theory:'<p>LuaJIT performance, coroutines cho cooperative multitasking, DSL design.</p>',
       code:'-- Coroutines\nlocal function producer()\n    local i = 0\n    while true do\n        i = i + 1\n        coroutine.yield(i)\n    end\nend\n\nlocal co = coroutine.create(producer)\nfor _ = 1, 5 do\n    local _, val = coroutine.resume(co)\n    print(val)\nend\n\n-- DSL pattern\nlocal ui = {}\nfunction ui.button(props)\n    return { type = "button", text = props.text, onClick = props.onClick }\nend\n\nlocal myButton = ui.button {\n    text = "Click me",\n    onClick = function() print("Clicked!") end\n}',
       lang:'lua',
       keyPoints:['Coroutines','LuaJIT optimization','DSL design','Weak tables & garbage collection'],
       exercise:'Implement producer-consumer pattern với coroutines'}
    ]}
  ]
};

const DATA_R = {
  id:'r', name:'R', icon:'📊', color:'#276DC3',
  gradient:'linear-gradient(135deg,#276DC3,#1A4F8B)',
  category:'language',
  description:'Statistical computing — data science, visualization',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'R cơ bản & Vectors',lessons:[
      {id:'intro',title:'R Basics & RStudio',
       theory:'<p><b>R</b> = ngôn ngữ cho statistical computing và data visualization. RStudio = best IDE.</p>',
       code:'# Variables\nx <- 42        # assignment với <-\ny = 3.14       # cũng OK nhưng <- preferred\nname <- "R"\n\n# Vectors (core data structure)\nnums <- c(1, 2, 3, 4, 5)\nnames <- c("A", "B", "C")\n\n# Basic stats\nmean(nums)    # 3\nmedian(nums)  # 3\nsd(nums)      # standard deviation\nsum(nums)     # 15\n\nprint(paste("Sum:", sum(nums)))',
       lang:'r',
       keyPoints:['<- là assignment operator','Vectors = core data structure','c() tạo vectors','Built-in thống kê','RStudio IDE'],
       exercise:'Tạo vector điểm 10 sinh viên, tính mean, median, sd'},
      {id:'vectors',title:'Vectors & Data Frames',
       theory:'<p>Data frames = bảng dữ liệu (giống SQL table). Columns + rows.</p>',
       code:'# Data frame\ndf <- data.frame(\n  name = c("An", "Binh", "Chi"),\n  age = c(22, 25, 23),\n  score = c(85, 92, 78)\n)\n\n# Access\ndf$name          # column by name\ndf[1, ]          # first row\ndf[df$score > 80, ]  # filter\n\n# Summary\nsummary(df)\nstr(df)  # structure\nnrow(df) # 3\nncol(df) # 3',
       lang:'r',
       keyPoints:['data.frame = bảng dữ liệu','$ access columns','Vector operations (vectorized)','summary() cho thống kê nhanh'],
       exercise:'Tạo data frame sản phẩm (tên, giá, số lượng), filter giá > 100'},
      {id:'plots',title:'Basic Visualization',
       theory:'<p>R nổi tiếng với visualization. Base R plots + ggplot2 library.</p>',
       code:'# Base R plots\nx <- 1:10\ny <- x^2\n\nplot(x, y, type = "b", col = "blue",\n     main = "Quadratic",\n     xlab = "X", ylab = "Y")\n\n# Histogram\ndata <- rnorm(1000)  # 1000 random normal\nhist(data, breaks = 30, col = "skyblue")\n\n# ggplot2 \nlibrary(ggplot2)\nggplot(mtcars, aes(x = wt, y = mpg)) +\n  geom_point(color = "red") +\n  geom_smooth(method = "lm") +\n  labs(title = "Weight vs MPG")',
       lang:'r',
       keyPoints:['plot() cho basic charts','hist() cho histogram','ggplot2 = grammar of graphics','aes() = aesthetic mappings'],
       exercise:'Vẽ scatter plot và histogram từ data'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Data Wrangling & Statistics',lessons:[
      {id:'dplyr',title:'Data Wrangling (dplyr/tidyr)',
       theory:'<p>dplyr = khung xử lý data. filter, select, mutate, summarise, group_by.</p>',
       code:'library(dplyr)\n\nmtcars %>%\n  filter(mpg > 20) %>%\n  select(mpg, cyl, hp) %>%\n  mutate(hp_per_cyl = hp / cyl) %>%\n  group_by(cyl) %>%\n  summarise(\n    avg_mpg = mean(mpg),\n    count = n()\n  ) %>%\n  arrange(desc(avg_mpg))',
       lang:'r',
       keyPoints:['%>% pipe operator','filter, select, mutate','group_by + summarise','tidyverse ecosystem'],
       exercise:'Phân tích dataset: filter, aggregate, visualize'},
      {id:'stats',title:'Statistical Analysis',
       theory:'<p>R là king cho statistics. Hypothesis testing, regression, ANOVA.</p>',
       code:'# Linear regression\nmodel <- lm(mpg ~ wt + hp, data = mtcars)\nsummary(model)\n\n# Coefficients\ncoef(model)\n\n# Prediction\nnew_car <- data.frame(wt = 3.0, hp = 150)\npredict(model, new_car)\n\n# T-test\ngroup1 <- c(85, 90, 78, 92, 88)\ngroup2 <- c(75, 80, 72, 85, 78)\nt.test(group1, group2)',
       lang:'r',
       keyPoints:['lm() = linear model','t.test(), chisq.test()','summary() cho p-values','ANOVA with aov()'],
       exercise:'Run linear regression trên dataset và interpret kết quả'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Machine Learning',lessons:[
      {id:'ml',title:'Machine Learning in R',
       theory:'<p>R packages cho ML: caret, randomForest, xgboost, tidymodels.</p>',
       code:'library(caret)\n\n# Train/test split\nset.seed(42)\nidx <- createDataPartition(iris$Species, p = 0.8, list = FALSE)\ntrain <- iris[idx, ]\ntest <- iris[-idx, ]\n\n# Random Forest\nmodel <- train(Species ~ ., data = train, method = "rf")\n\n# Prediction\npreds <- predict(model, test)\nconfusionMatrix(preds, test$Species)',
       lang:'r',
       keyPoints:['caret framework','Train/test split','Cross-validation','Model evaluation'],
       exercise:'Train classification model trên iris dataset'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Shiny Web Apps',lessons:[
      {id:'shiny',title:'Shiny Web Apps',
       theory:'<p>Shiny = framework tạo interactive web apps bằng R. Reactive programming.</p>',
       code:'library(shiny)\n\nui <- fluidPage(\n  titlePanel("My Dashboard"),\n  sidebarLayout(\n    sidebarPanel(\n      sliderInput("n", "Sample size:", 10, 1000, 100)\n    ),\n    mainPanel(\n      plotOutput("plot")\n    )\n  )\n)\n\nserver <- function(input, output) {\n  output$plot <- renderPlot({\n    hist(rnorm(input$n), main = "Normal Distribution")\n  })\n}\n\nshinyApp(ui, server)',
       lang:'r',
       keyPoints:['Reactive programming','UI + Server architecture','Reactive expressions','Deployment with shinyapps.io'],
       exercise:'Tạo Shiny app dashboard hiển thị 3 loại chart'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Production R & Big Data',lessons:[
      {id:'production',title:'Production R & Big Data',
       theory:'<p>R in production: plumber APIs, parallel computing, Spark integration.</p>',
       code:'# plumber API\nlibrary(plumber)\n\n#* @get /predict\nfunction(weight, horsepower) {\n  model <- readRDS("model.rds")\n  new_data <- data.frame(wt = as.numeric(weight), hp = as.numeric(horsepower))\n  prediction <- predict(model, new_data)\n  list(predicted_mpg = prediction)\n}\n\n# Parallel computing\nlibrary(parallel)\nno_cores <- detectCores() - 1\nresults <- mclapply(1:100, function(i) {\n  sqrt(i)\n}, mc.cores = no_cores)',
       lang:'r',
       keyPoints:['plumber REST APIs','Parallel computing','sparklyr for Big Data','Docker deployment'],
       exercise:'Tạo REST API predict model với plumber'}
    ]}
  ]
};

const DATA_SCALA = {
  id:'scala', name:'Scala', icon:'🔴', color:'#DC322F',
  gradient:'linear-gradient(135deg,#DC322F,#B8282E)',
  category:'language',
  description:'JVM language — Big Data (Spark), functional + OOP',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp cơ bản & Collections',lessons:[
      {id:'intro',title:'Scala Overview & Setup',
       theory:'<p><b>Scala</b> = Scalable Language. Chạy trên JVM, kết hợp OOP + Functional. Dùng cho Big Data (Apache Spark).</p>',
       code:'object HelloWorld extends App {\n  println("Hello, Scala!")\n  \n  // val = immutable, var = mutable\n  val name: String = "DevMaster"\n  var count: Int = 0\n  count += 1\n  \n  // Type inference\n  val age = 25  // Int inferred\n  val pi = 3.14 // Double inferred\n  \n  // String interpolation\n  println(s"$name is $age years old")\n}',
       lang:'scala',
       keyPoints:['JVM language = Java interop','val (immutable) vs var (mutable)','Type inference','Everything is an expression'],
       exercise:'Tạo Scala object với variables và string interpolation'},
      {id:'functions',title:'Functions & Collections',
       theory:'<p>Scala functions là first-class. Collections rich với map, filter, fold.</p>',
       code:'// Functions\ndef add(a: Int, b: Int): Int = a + b\n\n// Lambda\nval multiply = (a: Int, b: Int) => a * b\n\n// Collections\nval nums = List(1, 2, 3, 4, 5)\nval evens = nums.filter(_ % 2 == 0)\nval doubled = nums.map(_ * 2)\nval sum = nums.reduce(_ + _)\n\nprintln(s"Evens: $evens")    // List(2, 4)\nprintln(s"Doubled: $doubled") // List(2, 4, 6, 8, 10)\nprintln(s"Sum: $sum")        // 15\n\n// Pattern matching\nval result = nums.head match {\n  case 1 => "one"\n  case 2 => "two"\n  case _ => "other"\n}',
       lang:'scala',
       keyPoints:['def keyword cho functions','_ placeholder syntax','Rich collection API','Pattern matching'],
       exercise:'Dùng collections API xử lý list students'},
      {id:'classes',title:'Classes & Case Classes',
       theory:'<p>Scala có classes (mutable) và case classes (immutable, auto equals/hashCode/toString).</p>',
       code:'// Case class (immutable, auto-generated methods)\ncase class User(name: String, age: Int)\n\nval user = User("Minh", 22)\nprintln(user)  // User(Minh,22)\n\n// Copy with modification\nval older = user.copy(age = 23)\n\n// Pattern matching with case classes\ndef greet(u: User): String = u match {\n  case User("Admin", _) => "Welcome, Admin!"\n  case User(name, age) if age < 18 => s"Hi $name, you\'re young!"\n  case User(name, _) => s"Hello, $name!"\n}\n\n// Traits (like interfaces)\ntrait Printable {\n  def prettyPrint(): String\n}\n\ncase class Product(name: String, price: Double) extends Printable {\n  def prettyPrint(): String = s"$name: $$$price"\n}',
       lang:'scala',
       keyPoints:['case class = immutable data','Pattern matching on types','Traits = interfaces + mixins','copy() for modification'],
       exercise:'Tạo case class hierarchy cho Shape (Circle, Rectangle)'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Functional Programming & Concurrency',lessons:[
      {id:'fp',title:'Functional Programming',
       theory:'<p>Scala excels at FP: higher-order functions, currying, for-comprehensions.</p>',
       code:'// Higher-order functions\ndef applyTwice(f: Int => Int, x: Int): Int = f(f(x))\nprintln(applyTwice(_ + 3, 7)) // 13\n\n// Currying\ndef multiply(a: Int)(b: Int): Int = a * b\nval double = multiply(2) _\nprintln(double(5)) // 10\n\n// For-comprehensions\nval pairs = for {\n  x <- 1 to 3\n  y <- 1 to 3\n  if x != y\n} yield (x, y)\n\n// Option type (no nulls!)\ndef findUser(id: Int): Option[User] =\n  if (id == 1) Some(User("Minh", 22)) else None\n\nfindUser(1).map(_.name).getOrElse("Unknown")',
       lang:'scala',
       keyPoints:['Higher-order functions','Currying','For-comprehensions','Option = no null'],
       exercise:'Implement chain of transformations dùng FP patterns'},
      {id:'concurrency',title:'Futures & Concurrency',
       theory:'<p>Scala Futures cho async programming. Akka cho actor-based concurrency.</p>',
       code:'import scala.concurrent.{Future, Await}\nimport scala.concurrent.ExecutionContext.Implicits.global\nimport scala.concurrent.duration._\n\n// Future = async computation\nval futureResult: Future[Int] = Future {\n  Thread.sleep(1000)\n  42\n}\n\n// Chaining\nval transformed = futureResult\n  .map(_ * 2)\n  .flatMap(x => Future(x + 10))\n  .recover { case e: Exception => -1 }\n\n// For-comprehension with Futures\nval combined = for {\n  a <- Future(10)\n  b <- Future(20)\n} yield a + b\n\nval result = Await.result(combined, 5.seconds)\nprintln(result) // 30',
       lang:'scala',
       keyPoints:['Future = async computation','map/flatMap chaining','For-comprehension async','ExecutionContext = thread pool'],
       exercise:'Tạo 3 async tasks chạy parallel, combine kết quả'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Apache Spark & Big Data',lessons:[
      {id:'spark',title:'Apache Spark',
       theory:'<p>Apache Spark = Big Data framework viết bằng Scala. DataFrames, SQL, streaming.</p>',
       code:'import org.apache.spark.sql.SparkSession\n\nval spark = SparkSession.builder\n  .appName("DevMaster")\n  .master("local[*]")\n  .getOrCreate()\n\nimport spark.implicits._\n\n// Read CSV\nval df = spark.read\n  .option("header", "true")\n  .csv("data.csv")\n\n// Transformations\ndf.filter($"age" > 20)\n  .groupBy($"city")\n  .agg(avg($"salary").as("avg_salary"))\n  .orderBy($"avg_salary".desc)\n  .show()',
       lang:'scala',
       keyPoints:['SparkSession entry point','DataFrame API','Lazy evaluation','Distributed computing'],
       exercise:'Đọc CSV, filter, aggregate và output kết quả'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Advanced Type System',lessons:[
      {id:'typesystem',title:'Advanced Type System',
       theory:'<p>Scala type system: generics, variance, type classes, implicits/givens.</p>',
       code:'// Type class pattern\ntrait JsonEncoder[T] {\n  def encode(value: T): String\n}\n\nimplicit val intEncoder: JsonEncoder[Int] = (v: Int) => v.toString\nimplicit val stringEncoder: JsonEncoder[String] = (v: String) => s\\"$v\\"\n\ndef toJson[T](value: T)(implicit encoder: JsonEncoder[T]): String =\n  encoder.encode(value)\n\nprintln(toJson(42))       // "42"\nprintln(toJson("hello"))  // "\\"hello\\""',
       lang:'scala',
       keyPoints:['Type classes','Implicits/Givens','Variance (co/contra)','Higher-kinded types'],
       exercise:'Implement type class cho serialization'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Production Scala & Microservices',lessons:[
      {id:'production',title:'Production Scala',
       theory:'<p>Production Scala: Akka, ZIO, Cats Effect, microservices architecture.</p>',
       code:'// ZIO for effectful programming\nimport zio._\n\nval program: ZIO[Any, Throwable, Unit] = for {\n  _ <- Console.printLine("Enter name:")\n  name <- Console.readLine\n  _ <- Console.printLine(s"Hello, $name!")\n} yield ()\n\n// Akka HTTP\nimport akka.http.scaladsl.server.Directives._\n\nval route = path("api" / "users") {\n  get {\n    complete("User list")\n  } ~\n  post {\n    entity(as[String]) { body =>\n      complete(s"Created: $body")\n    }\n  }\n}',
       lang:'scala',
       keyPoints:['ZIO/Cats Effect','Akka for microservices','Functional architecture','ScalaTest/specs2 testing'],
       exercise:'Build REST API microservice với Akka HTTP hoặc http4s'}
    ]}
  ]
};
