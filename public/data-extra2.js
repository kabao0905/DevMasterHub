const DATA_ZIG = {
  id:'zig', name:'Zig', icon:'⚡', color:'#F7A41D',
  gradient:'linear-gradient(135deg,#F7A41D,#EC8B00)',
  category:'language',
  description:'Ngôn ngữ lập trình hệ thống — Tốc độ cao, an toàn, thay thế C',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp cơ bản & Nền tảng Zig',lessons:[
      {id:'intro',title:'Tổng quan Zig & Cài đặt môi trường',
       theory:'<p><b>Zig</b> là ngôn ngữ lập trình hệ thống (Systems Programming) thế hệ mới, được thiết kế để thay thế C/C++. Điểm đặc biệt của Zig là <strong>không có Garbage Collector</strong>, không có luồng điều khiển ẩn, hỗ trợ thực thi code ngay trong lúc biên dịch (<code>comptime</code>) và có khả năng tương thích trực tiếp 100% với các thư viện C.</p><p>Triết lý của Zig: <em>An toàn (Safety) + Hiệu năng tối đa (Performance) + Đơn giản, tường minh (Simplicity)</em>.</p>',
       code:'const std = @import("std");\n\n// Điểm bắt đầu của mọi chương trình Zig\npub fn main() void {\n    std.debug.print("Xin chao, toi dang hoc Zig!\\n", .{});\n}',
       lang:'zig',
       keyPoints:['Ngôn ngữ lập trình hệ thống không Garbage Collector','Không có luồng điều khiển ẩn (No hidden control flow)','Hỗ trợ thực thi code khi biên dịch (Comptime)','Tương thích trực tiếp với mã nguồn C'],
       exercise:'Viết chương trình in ra tên và mục tiêu học Zig của bạn.'},
      {id:'variables',title:'Biến & Kiểu dữ liệu trong Zig',
       theory:'<p>Trong Zig, bạn dùng <code>const</code> cho biến bất biến (không thể đổi giá trị) và <code>var</code> cho biến có thể gán lại giá trị.</p><p>Các kiểu dữ liệu số nguyên có kích thước tường minh: <code>u8</code> (byte không dấu), <code>i32</code> (số nguyên 32-bit), <code>f64</code> (số thực 64-bit), <code>bool</code> (đúng/sai) và mảng byte <code>[]u8</code>.</p>',
       code:'const std = @import("std");\n\npub fn main() void {\n    const age: i32 = 25; // Hằng số bất biến\n    var score: f64 = 8.5; // Biến có thể thay đổi\n    score += 1.0;\n\n    const language = "Zig";\n    std.debug.print("Ngon ngu: {s}, Tuoi: {d}, Diem: {d:.1}\\n", .{language, age, score});\n}',
       lang:'zig',
       keyPoints:['const: Hằng số bất biến, var: Biến có thể thay đổi','Khai báo kích thước kiểu dữ liệu tường minh (u8, i32, u64)','Type inference tự suy luận kiểu khi khởi tạo giá trị'],
       exercise:'Khai báo thông tin một chiếc xe máy (hãng xe, năm sản xuất, giá tiền) bằng các biến Zig và in ra màn hình.'},
      {id:'functions',title:'Hàm & Cơ chế xử lý lỗi',
       theory:'<p>Hàm trong Zig được định nghĩa bằng từ khóa <code>fn</code>. Zig không sử dụng Exceptions (try/catch cổ điển) mà sử dụng <strong>Error Unions</strong> (kết hợp kiểu dữ liệu và mã lỗi với dấu <code>!</code>), kết hợp toán tử <code>try</code> để bắt lỗi một cách tường minh và an toàn.</p>',
       code:'const std = @import("std");\n\n// Định nghĩa tập hợp lỗi\nconst MathError = error{\n    DivisionByZero,\n};\n\n// Hàm có thể trả về lỗi hoặc kết quả f64\nfn divide(a: f64, b: f64) MathError!f64 {\n    if (b == 0) return MathError.DivisionByZero;\n    return a / b;\n}\n\npub fn main() !void {\n    const result = try divide(10.0, 2.0);\n    std.debug.print("Ket qua chia: {d}\\n", .{result});\n}',
       lang:'zig',
       keyPoints:['Từ khóa fn để khai báo hàm','Cơ chế Error Unions với cú pháp !T','Toán tử try để bắt và chuyển tiếp lỗi an toàn'],
       exercise:'Viết hàm tính chu vi và diện tích hình tròn có kiểm tra bán kính phải lớn hơn 0.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Structs, Quản lý bộ nhớ & Slices',lessons:[
      {id:'structs',title:'Cấu trúc Structs & Phương thức',
       theory:'<p>Zig không có khái niệm <code>class</code> như các ngôn ngữ OOP truyền thống. Thay vào đó, bạn sử dụng <code>struct</code> để đóng gói dữ liệu và định nghĩa các phương thức thông qua tham số <code>self</code>.</p>',
       code:'const std = @import("std");\n\nconst User = struct {\n    name: []const u8,\n    age: u8,\n\n    pub fn printInfo(self: User) void {\n        std.debug.print("User: {s}, {d} tuoi\\n", .{self.name, self.age});\n    }\n};\n\npub fn main() void {\n    const u = User{ .name = "Nam", .age = 22 };\n    u.printInfo();\n}',
       lang:'zig',
       keyPoints:['Structs thay thế cho class trong OOP','Phương thức được gọi thông qua tham số self','Khởi tạo struct với cú pháp .{ .field = value }'],
       exercise:'Tạo struct Rectangle với 2 phương thức tính chu vi và diện tích.'},
      {id:'arrays',title:'Mảng, Slices & Chuỗi ký tự',
       theory:'<p>Mảng tĩnh trong Zig có kích thước cố định được xác định trước. <strong>Slice</strong> (<code>[]T</code>) là một con trỏ đi kèm với chiều dài (pointer + length), cho phép truy cập linh hoạt vào một phần của mảng mà không tốn chi phí sao chép dữ liệu.</p>',
       code:'const std = @import("std");\n\npub fn main() void {\n    const numbers = [_]i32{ 10, 20, 30, 40, 50 };\n    const slice = numbers[1..4]; // Cắt lấy phần tử từ index 1 đến 3\n\n    for (slice) |item| {\n        std.debug.print("{d} ", .{item});\n    }\n    std.debug.print("\\n", .{});\n}',
       lang:'zig',
       keyPoints:['Mảng cố định [N]T','Slice []T = Con trỏ + Chiều dài (Pointer + Length)','Chuỗi ký tự trong Zig thực chất là []const u8'],
       exercise:'Tạo một mảng 5 số nguyên, tạo slice lấy 3 phần tử ở giữa và in ra tổng của chúng.'},
      {id:'memory',title:'Quản lý bộ nhớ & Allocators',
       theory:'<p>Zig không cấp phát bộ nhớ ngầm. Mọi thao tác cấp phát vùng nhớ trên Heap đều phải thông qua <strong>Allocator</strong> tường minh. Bạn sử dụng từ khóa <code>defer</code> để đảm bảo luôn giải phóng bộ nhớ khi ra khỏi phạm vi khối lệnh (tránh rò rỉ bộ nhớ - memory leak).</p>',
       code:'const std = @import("std");\n\npub fn main() !void {\n    var gpa = std.heap.GeneralPurposeAllocator(.{}){};\n    const allocator = gpa.allocator();\n    defer _ = gpa.deinit();\n\n    // Cấp phát mảng động\n    var list = std.ArrayList(i32).init(allocator);\n    defer list.deinit(); // Luôn giải phóng khi kết thúc hàm\n\n    try list.append(100);\n    try list.append(200);\n    std.debug.print("So luong phan tu: {d}\\n", .{list.items.len});\n}',
       lang:'zig',
       keyPoints:['Cấp phát bộ nhớ tường minh qua Allocator','Từ khóa defer đảm bảo tự động giải phóng vùng nhớ','Không có rò rỉ bộ nhớ ẩn (No hidden allocations)'],
       exercise:'Dùng ArrayList để lưu danh sách điểm số nhập từ bàn phím và tính điểm trung bình.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Comptime, Lập trình bất đồng bộ & FFI',lessons:[
      {id:'comptime',title:'Comptime & Lập trình Generic',
       theory:'<p><code>comptime</code> là tính năng mạnh mẽ nhất của Zig: cho phép thực thi mã nguồn và tính toán trực tiếp trong giai đoạn biên dịch thay vì đợi đến lúc chạy chương trình (Runtime), giúp tạo ra code Generic với chi phí hiệu năng bằng 0 (Zero-cost abstraction).</p>',
       code:'const std = @import("std");\n\n// Hàm Generic tạo ma trận tùy chỉnh kích thước khi biên dịch\nfn Matrix(comptime T: type, comptime rows: usize, comptime cols: usize) type {\n    return struct {\n        data: [rows][cols]T,\n    };\n}\n\npub fn main() void {\n    const Mat2x2 = Matrix(f32, 2, 2);\n    var m = Mat2x2{ .data = .{ .{ 1.0, 0.0 }, .{ 0.0, 1.0 } } };\n    std.debug.print("Matrix initialized!\\n", .{});\n}',
       lang:'zig',
       keyPoints:['comptime: Tính toán và kiểm tra kiểu lúc biên dịch','Lập trình kiểu dữ liệu Generic không tốn chi phí runtime','Tối ưu hóa hiệu năng tối đa trước khi xuất file thực thi'],
       exercise:'Viết hàm generic cộng hai giá trị bất kỳ hỗ trợ cả số nguyên và số thực bằng comptime.'},
      {id:'async',title:'I/O Bất đồng bộ & Lập trình Mạng',
       theory:'<p>Zig cung cấp các thư viện mạng <code>std.net</code> hiệu năng cao, hỗ trợ kết nối Socket TCP/UDP non-blocking phục vụ các ứng dụng máy chủ tải lớn.</p>',
       code:'const std = @import("std");\nconst net = std.net;\n\npub fn main() !void {\n    const address = try net.Address.parseIp4("127.0.0.1", 8080);\n    var server = try address.listen(.{ .reuse_address = true });\n    defer server.deinit();\n    std.debug.print("Server dang lang nghe tai cong 8080...\\n", .{});\n}',
       lang:'zig',
       keyPoints:['Thư viện std.net cho kết nối TCP/UDP','Mô hình I/O hiệu năng cao không block luồng','Xây dựng máy chủ mạng tải lớn với dung lượng RAM tối thiểu'],
       exercise:'Tạo một TCP Echo Server đơn giản nhận chuỗi từ Client và gửi phản hồi ngược lại.'},
      {id:'c_interop',title:'Tương tác trực tiếp với mã nguồn C (FFI)',
       theory:'<p>Zig có khả năng đọc trực tiếp các file header <code>.h</code> của ngôn ngữ C bằng cú pháp <code>@cImport</code> và <code>@cInclude</code> mà không cần viết các lớp bọc (bindings) phức tạp.</p>',
       code:'const std = @import("std");\n\nconst c = @cImport({\n    @cInclude("stdio.h");\n    @cInclude("stdlib.h");\n});\n\npub fn main() void {\n    _ = c.printf("Xin chao truc tiep tu ham printf cua C!\\n");\n}',
       lang:'zig',
       keyPoints:['@cImport và @cInclude đọc trực tiếp file thư viện C','Gọi các hàm C thuần với hiệu năng bản địa (Native ABI)','Biên dịch chéo mã nguồn C và Zig trong cùng một project'],
       exercise:'Gọi hàm rand() trong thư viện stdlib của C từ chương trình Zig.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Hệ thống Build & Biên dịch chéo',lessons:[
      {id:'build',title:'Hệ thống Build & Biên dịch chéo (Cross-Compilation)',
       theory:'<p>Zig thay thế Makefile và CMake bằng file cấu hình <code>build.zig</code> viết hoàn toàn bằng chính ngôn ngữ Zig. Bạn có thể biên dịch ứng dụng chạy trên Windows, Linux, macOS hoặc vi điều khiển nhúng chỉ với một câu lệnh duy nhất.</p>',
       code:'const std = @import("std");\n\npub fn build(b: *std.Build) void {\n    const target = b.standardTargetOptions(.{});\n    const optimize = b.standardOptimizeOption(.{});\n\n    const exe = b.addExecutable(.{\n        .name = "my_app",\n        .root_source_file = b.path("src/main.zig"),\n        .target = target,\n        .optimize = optimize,\n    });\n    b.installArtifact(exe);\n}',
       lang:'zig',
       keyPoints:['build.zig thay thế hoàn toàn Makefile và CMake','Biên dịch chéo cho mọi hệ điều hành (Windows, Linux, macOS)','Quản lý thư viện phụ thuộc (Package Manager) tích hợp sẵn'],
       exercise:'Tạo file build.zig để cấu hình build ứng dụng cho cả chế độ Debug và ReleaseFast.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Lập trình cấp hệ điều hành & Nhúng',lessons:[
      {id:'os',title:'Lập trình cấp hệ điều hành & Syscalls',
       theory:'<p>Zig là ngôn ngữ lý tưởng để viết Kernel hệ điều hành, Driver phần cứng và firmware nhúng nhờ khả năng gọi trực tiếp các System Calls (syscalls) và ánh xạ bộ nhớ phần cứng (Memory-mapped I/O).</p>',
       code:'const std = @import("std");\nconst os = std.os;\n\npub fn main() !void {\n    // Goi truc tiep ham he thong\n    std.debug.print("Zig dang chay o cap do he thong!\\n", .{});\n}',
       lang:'zig',
       keyPoints:['Gọi trực tiếp System Calls của Kernel','Quản lý bộ nhớ vật lý và Memory-Mapped I/O','Thích hợp phát triển hệ điều hành và vi điều khiển nhúng (ARM, RISC-V)'],
       exercise:'Viết hàm đọc thông tin CPU và bộ nhớ hệ thống thông qua Zig syscall.'}
    ]}
  ]
};

const DATA_SOLIDITY = {
  id:'solidity', name:'Solidity', icon:'🔗', color:'#363636',
  gradient:'linear-gradient(135deg,#363636,#1a1a2e)',
  category:'language',
  description:'Hợp đồng thông minh — Ethereum, Web3, DeFi & Blockchain',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Blockchain & Smart Contracts cơ bản',lessons:[
      {id:'intro',title:'Blockchain & Hợp đồng thông minh cơ bản',
       theory:'<p><b>Solidity</b> là ngôn ngữ lập trình hướng đối tượng, chuyên dụng để viết <strong>Hợp đồng thông minh (Smart Contracts)</strong> trên nền tảng Ethereum và các mạng máy ảo EVM. Một khi đã triển khai lên blockchain, mã nguồn hợp đồng là <em>bất biến (Immutable)</em> không thể chỉnh sửa trái phép.</p><p>Mỗi giao dịch thực thi trên mạng lưới đều tiêu tốn một lượng phí xử lý gọi là <strong>Gas Fee</strong>.</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\n// Hop dong thong minh dau tien\ncontract HelloWorld {\n    // Bien trang thai luu tru tren Blockchain\n    string public greeting = "Xin chao Web3!";\n    \n    // Ham cap nhat loi chao (ghi vao blockchain - ton gas)\n    function setGreeting(string memory _greeting) public {\n        greeting = _greeting;\n    }\n    \n    // Ham doc du lieu (view function - khong ton gas)\n    function getGreeting() public view returns (string memory) {\n        return greeting;\n    }\n}',
       lang:'javascript',
       keyPoints:['EVM = Máy ảo Ethereum (Ethereum Virtual Machine)','Smart contracts = Mã thực thi bất biến trên blockchain','Gas fee = Phí tính toán cho mỗi giao dịch mạng lưới','Solidity = Ngôn ngữ kiểu tĩnh, bản địa cho Ethereum'],
       exercise:'Triển khai hợp đồng HelloWorld lên môi trường thử nghiệm Remix IDE.'},
      {id:'types',title:'Kiểu dữ liệu, Biến & Hàm trong Solidity',
       theory:'<p>Solidity có các kiểu dữ liệu cốt lõi: <code>uint256</code> (số nguyên không dấu 256-bit), <code>address</code> (địa chỉ ví/hợp đồng), <code>bool</code>, <code>string</code> và <code>mapping</code> (bảng băm tra cứu khóa-giá trị).</p><p>Vị trí lưu trữ dữ liệu được chia làm: <strong>Storage</strong> (lưu vĩnh viễn trên blockchain), <strong>Memory</strong> (tạm thời trong hàm) và <strong>Calldata</strong> (dữ liệu đầu vào chỉ đọc).</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract BankAccount {\n    address public owner;\n    mapping(address => uint256) public balances;\n\n    constructor() {\n        owner = msg.sender; // Nguoi tao hop dong la chu so huu\n    }\n\n    // Modifier kiem tra quyen truy cap\n    modifier onlyOwner() {\n        require(msg.sender == owner, "Chi chu hop dong moi co quyen!");\n        _;\n    }\n\n    function deposit() public payable {\n        balances[msg.sender] += msg.value;\n    }\n}',
       lang:'javascript',
       keyPoints:['uint256 = Số nguyên không dấu chuẩn cho tiền mã hóa','address = Địa chỉ ví người dùng hoặc hợp đồng','mapping = Bảng tra cứu số dư cực nhanh O(1)','Modifiers = Cơ chế phân quyền và kiểm tra điều kiện an toàn'],
       exercise:'Tạo hợp đồng Counter với các hàm tăng, giảm và hàm reset chỉ cho phép Owner thực hiện.'},
      {id:'events',title:'Sự kiện & Ghi nhật ký (Events & Logs)',
       theory:'<p><strong>Events</strong> cho phép hợp đồng thông minh ghi lại các nhật ký (Logs) trên Blockchain. Ứng dụng phía Frontend (React, Vue) có thể lắng nghe các sự kiện này qua thư viện <code>ethers.js</code> hoặc <code>viem</code> để cập nhật giao diện người dùng theo thời gian thực với chi phí gas cực kỳ tiết kiệm.</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract TransferLogger {\n    // Dinh nghia Event voi tu khoa indexed de de dang tim kiem\n    event Transfer(address indexed from, address indexed to, uint256 amount);\n    event LogMessage(string message);\n\n    function sendToken(address _to, uint256 _amount) public {\n        // Phat ra su kien de Frontend lang nghe\n        emit Transfer(msg.sender, _to, _amount);\n        emit LogMessage("Chuyen tien thanh cong!");\n    }\n}',
       lang:'javascript',
       keyPoints:['Events ghi log trực tiếp lên Blockchain với chi phí gas rẻ','Từ khóa indexed giúp ứng dụng frontend lọc và tìm kiếm giao dịch','Frontend lắng nghe sự kiện thời gian thực qua ethers.js'],
       exercise:'Tạo hợp đồng phát ra sự kiện MemberJoined mỗi khi có người đăng ký mới.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Tiêu chuẩn ERC-20 & Bảo mật hợp đồng',lessons:[
      {id:'erc20',title:'Xây dựng Token chuẩn ERC-20',
       theory:'<p><strong>ERC-20</strong> là tiêu chuẩn kỹ thuật số 1 cho các đồng tiền mã hóa (Fungible Tokens) trên Ethereum. Nó định nghĩa các hàm bắt buộc như <code>totalSupply()</code>, <code>balanceOf()</code>, <code>transfer()</code>, <code>approve()</code> và <code>transferFrom()</code>.</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/token/ERC20/ERC20.sol";\n\ncontract MyToken is ERC20 {\n    // Khoi tao token voi ten goi va ky hieu\n    constructor(uint256 initialSupply) ERC20("DevMaster Token", "DMT") {\n        // Mint token ban dau cho nguoi tao hop dong\n        _mint(msg.sender, initialSupply * 10 ** decimals());\n    }\n}',
       lang:'javascript',
       keyPoints:['ERC-20 là tiêu chuẩn token phổ biến nhất trên Ethereum','Thư viện OpenZeppelin cung cấp code chuẩn bảo mật cao','Hàm _mint() dùng để phát hành token ban đầu'],
       exercise:'Tạo token ERC-20 của riêng bạn và thử chuyển token giữa hai ví thử nghiệm.'},
      {id:'security',title:'Bảo mật & Các lỗ hổng phổ biến (Reentrancy)',
       theory:'<p>Bảo mật hợp đồng thông minh là yếu tố sống còn vì mọi lỗi code đều có thể dẫn đến mất mát tài sản không thể đảo ngược. Lỗ hổng nguy hiểm nhất là <strong>Reentrancy Attack</strong> (tấn công tái nhập), cần phòng tránh bằng quy tắc <strong>Checks-Effects-Interactions (CEI)</strong> và <code>ReentrancyGuard</code>.</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract SecureVault {\n    mapping(address => uint256) public balances;\n    bool private locked;\n\n    // Khoa chong tan cong tai nhap (Reentrancy Guard)\n    modifier noReentrant() {\n        require(!locked, "Khong cho phep goi lai!");\n        locked = true;\n        _;\n        locked = false;\n    }\n\n    function withdraw() public noReentrant {\n        uint256 amount = balances[msg.sender];\n        require(amount > 0, "So du khong du");\n\n        // Quy tac CEI: Cap nhat so du TRUOC khi gui tien\n        balances[msg.sender] = 0;\n\n        (bool success, ) = msg.sender.call{value: amount}("");\n        require(success, "Giao dich chuyen tien that bai");\n    }\n}',
       lang:'javascript',
       keyPoints:['Quy tắc CEI (Checks-Effects-Interactions) ngăn chặn Reentrancy','Không dùng tx.origin để phân quyền bảo mật','Sử dụng OpenZeppelin ReentrancyGuard'],
       exercise:'Viết lại hàm rút tiền bảo mật tuân thủ hoàn toàn quy tắc CEI.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Giao thức Tài chính Phi tập trung (DeFi)',lessons:[
      {id:'defi',title:'Giao thức DeFi, Staking & Liquidity Pool',
       theory:'<p><strong>DeFi (Decentralized Finance)</strong> loại bỏ bên trung gian tài chính bằng các hợp đồng tự động: AMM (Sàn giao dịch phi tập trung như Uniswap), Staking (khóa token nhận thưởng) và Lending (cho vay ký quỹ).</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/token/ERC20/IERC20.sol";\n\ncontract SimpleStaking {\n    IERC20 public stakingToken;\n    mapping(address => uint256) public stakedAmount;\n\n    constructor(address _tokenAddress) {\n        stakingToken = IERC20(_tokenAddress);\n    }\n\n    function stake(uint256 amount) external {\n        require(amount > 0, "So luong phai lon hon 0");\n        stakingToken.transferFrom(msg.sender, address(this), amount);\n        stakedAmount[msg.sender] += amount;\n    }\n}',
       lang:'javascript',
       keyPoints:['Mô hình Staking và phân phối phần thưởng','Khái niệm sàn AMM và Liquidity Pool','Tích hợp chuẩn IERC20 trong DeFi'],
       exercise:'Tạo hợp đồng Staking có tính năng tính toán phần thưởng sau mỗi khối (block).'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Mẫu thiết kế Proxy & Nâng cấp hợp đồng',lessons:[
      {id:'advanced',title:'Proxy Patterns & Khả năng nâng cấp hợp đồng',
       theory:'<p>Vì hợp đồng trên Ethereum là bất biến, các dự án lớn sử dụng mô hình <strong>Proxy Pattern (UUPS / Transparent Proxy)</strong>: Người dùng tương tác với Proxy Contract (lưu trạng thái), Proxy sẽ ủy quyền thực thi (<code>delegatecall</code>) sang Implementation Contract (chứa logic), cho phép nâng cấp logic mà không mất dữ liệu người dùng.</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";\nimport "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";\n\ncontract MyVaultV1 is UUPSUpgradeable, OwnableUpgradeable {\n    uint256 public totalVaultValue;\n\n    function initialize(address initialOwner) public initializer {\n        __Ownable_init(initialOwner);\n        __UUPSUpgradeable_init();\n    }\n\n    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}\n}',
       lang:'javascript',
       keyPoints:['Proxy Pattern cho phép nâng cấp logic hợp đồng an toàn','Cơ chế delegatecall ủy quyền tính toán giữ nguyên storage','Mô hình UUPS tiết kiệm gas hơn Transparent Proxy'],
       exercise:'Triển khai hợp đồng nâng cấp được dùng chuẩn UUPS của OpenZeppelin.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Kiến trúc Protocol & Quản trị DAO',lessons:[
      {id:'protocol',title:'Kiến trúc DAO, Tokenomics & Quản trị phi tập trung',
       theory:'<p>Thiết kế hệ thống quản trị phi tập trung (DAO): Tạo đề xuất (Proposals), biểu quyết bằng token (Voting), cơ chế khóa thời gian (Timelock) và bảo vệ giao dịch chống lại Bot MEV (Maximal Extractable Value).</p>',
       code:'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract DaoGovernance {\n    struct Proposal {\n        uint256 id;\n        string description;\n        uint256 votesFor;\n        uint256 votesAgainst;\n        uint256 deadline;\n        bool executed;\n    }\n\n    mapping(uint256 => Proposal) public proposals;\n    uint256 public nextProposalId;\n\n    function createProposal(string calldata desc) external returns (uint256) {\n        uint256 id = nextProposalId++;\n        proposals[id] = Proposal(id, desc, 0, 0, block.timestamp + 3 days, false);\n        return id;\n    }\n}',
       lang:'javascript',
       keyPoints:['Hệ thống biểu quyết phi tập trung DAO','Cơ chế Timelock kiểm soát an toàn trước khi thực thi','Thiết kế Tokenomics bền vững và phòng chống MEV'],
       exercise:'Thiết kế quy trình bỏ phiếu biểu quyết On-chain cho cộng đồng DAO.'}
    ]}
  ]
};

const DATA_LUA = {
  id:'lua', name:'Lua', icon:'🌙', color:'#000080',
  gradient:'linear-gradient(135deg,#000080,#2C2C54)',
  category:'language',
  description:'Ngôn ngữ kịch bản siêu nhẹ — Lập trình game, Roblox & hệ thống nhúng',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp cơ bản & Cấu trúc Tables',lessons:[
      {id:'intro',title:'Cú pháp cơ bản & Môi trường Lua',
       theory:'<p><b>Lua</b> là ngôn ngữ kịch bản siêu nhẹ, cực nhanh và dễ dàng nhúng vào các ứng dụng C/C++. Lua là ngôn ngữ chính trong phát triển game (Roblox, World of Warcraft, Love2D, Corona SDK) và hệ thống nhúng (Nginx, Redis scripts).</p>',
       code:'-- In loi chao dau tien\nprint("Xin chao, toi dang hoc Lua tren DevMaster Hub!")\n\n-- Khai bao bien cuc bo (local scope)\nlocal name = "Hoc vien"\nlocal level = 1\nlocal isLearning = true\n\n-- Noi chuoi trong Lua dung dau ..\nprint("Ten: " .. name .. " - Cap do: " .. level)',
       lang:'lua',
       keyPoints:['Ngôn ngữ kịch bản siêu nhẹ, tốc độ thực thi cực nhanh','Mảng trong Lua bắt đầu từ chỉ số 1 (1-indexed)','Từ khóa local giúp giới hạn phạm vi biến an toàn','Toán tử .. dùng để nối chuỗi'],
       exercise:'Khai báo biến lưu tên nhân vật game, điểm số và in ra màn hình.'},
      {id:'tables',title:'Tables — Cấu trúc dữ liệu vạn năng trong Lua',
       theory:'<p>Trong Lua, <strong>Table</strong> là cấu trúc dữ liệu duy nhất nhưng vô cùng linh hoạt. Nó đóng vai trò vừa là Mảng (Array), vừa là Bảng băm (Dictionary/Map), vừa là Đối tượng (Object).</p>',
       code:'-- Table kieu mang (Array style - bat dau tu index 1)\nlocal weapons = {"Kiem", "Cung", "Gay phep"}\nprint("Vu khi dau tien: " .. weapons[1]) -- "Kiem"\n\n-- Table kieu tu dien (Dictionary/Object style)\nlocal player = {\n    name = "Chien Binh",\n    hp = 100,\n    level = 5\n}\nprint("HP cua player: " .. player.hp)\n\n-- Duyet mang voi ipairs\nfor i, v in ipairs(weapons) do\n    print("Vi tri " .. i .. ": " .. v)\nend',
       lang:'lua',
       keyPoints:['Table thay thế cho cả Array, Dictionary và Class','Chỉ số mảng bắt đầu từ 1 (không phải 0)','Dùng ipairs duyệt mảng và pairs duyệt từ điển'],
       exercise:'Tạo một table lưu túi đồ (inventory) của nhân vật game và viết vòng lặp in ra toàn bộ vật phẩm.'},
      {id:'functions',title:'Hàm, Closures & Nhiều giá trị trả về',
       theory:'<p>Hàm trong Lua là <em>First-class citizen</em> (có thể gán vào biến, truyền qua tham số). Lua hỗ trợ trả về <strong>nhiều giá trị cùng lúc</strong> và cơ chế <strong>Closures</strong> lưu giữ trạng thái.</p>',
       code:'-- Ham tra ve nhieu gia tri\nlocal function divide(a, b)\n    if b == 0 then\n        return nil, "Khong the chia cho 0!"\n    end\n    return a / b, nil\nend\n\nlocal result, err = divide(10, 2)\nif err then\n    print("Loi: " .. err)\nelse\n    print("Ket qua: " .. result)\nend',
       lang:'lua',
       keyPoints:['Hàm có thể trả về nhiều giá trị cùng lúc','Hỗ trợ Closures lưu giữ biến môi trường','Cú pháp gọn gàng, dễ nhúng vào engine game'],
       exercise:'Viết hàm tính chu vi và diện tích hình chữ nhật trả về cả 2 kết quả.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Hướng đối tượng với Metatables & Modules',lessons:[
      {id:'oop',title:'Lập trình hướng đối tượng với Metatables',
       theory:'<p>Lua sử dụng <strong>Metatables</strong> và thuộc tính <code>__index</code> để hiện thực hóa lập trình hướng đối tượng (OOP) theo mô hình Prototype (tương tự JavaScript ban đầu).</p>',
       code:'local Character = {}\nCharacter.__index = Character\n\nfunction Character.new(name, hp)\n    local self = setmetatable({}, Character)\n    self.name = name\n    self.hp = hp\n    return self\nend\n\nfunction Character:takeDamage(dmg)\n    self.hp = self.hp - dmg\n    print(self.name .. " con lai " .. self.hp .. " HP")\nend\n\nlocal hero = Character.new("Hero", 100)\nhero:takeDamage(30)',
       lang:'lua',
       keyPoints:['setmetatable và __index tạo cơ chế kế thừa OOP','Cú pháp dấu hai chấm : tự động truyền tham số self ngầm định'],
       exercise:'Tạo lớp Monster kế thừa từ Character với phương thức tấn công riêng.'},
      {id:'modules',title:'Module hóa & Quản lý thư viện với LuaRocks',
       theory:'<p>Module trong Lua thực chất là một Table chứa các hàm được xuất ra qua <code>return</code>. Bạn nạp module bằng hàm <code>require()</code>.</p>',
       code:'-- File math_utils.lua\nlocal M = {}\n\nfunction M.add(a, b)\n    return a + b\nend\n\nreturn M\n\n-- File main.lua\n-- local utils = require("math_utils")\n-- print(utils.add(5, 10))',
       lang:'lua',
       keyPoints:['Modules là các table trả về qua return','Hàm require() dùng để nạp module và cache lại','LuaRocks là trình quản lý gói thư viện của Lua'],
       exercise:'Tạo một module chứa các hàm tiện ích xử lý chuỗi và nạp vào file chính.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Phát triển Game với Love2D & Roblox',lessons:[
      {id:'gamedev',title:'Vòng lặp Game Loop & Lập trình Roblox (Luau)',
       theory:'<p>Cốt lõi của Game Engine là vòng lặp <strong>Game Loop</strong> gồm 3 giai đoạn: <code>load()</code> (khởi tạo tài nguyên), <code>update(dt)</code> (cập nhật vật lý/logic theo thời gian delta) và <code>draw()</code> (vẽ đồ họa lên màn hình).</p>',
       code:'-- Mo phong Game Loop\nlocal player = { x = 100, y = 100, speed = 50 }\n\nfunction gameUpdate(dt)\n    player.x = player.x + player.speed * dt\n    print("Vi tri nguoi choi X: " .. player.x)\nend\n\ngameUpdate(0.016) -- Mo phong 1 frame 60FPS',
       lang:'lua',
       keyPoints:['Vòng lặp Game Loop: Load -> Update -> Draw','Delta time (dt) đảm bảo game mượt mà trên mọi cấu hình','Luau (biến thể của Roblox) bổ sung hệ thống kiểu tĩnh Type Checking'],
       exercise:'Mô phỏng nhân vật game nhảy lên và rơi xuống do trọng lực theo delta time.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Nhúng Lua vào ứng dụng C/C++',lessons:[
      {id:'embedding',title:'Nhúng Lua Interpreter vào chương trình C/C++',
       theory:'<p>Lua được thiết kế để làm ngôn ngữ kịch bản gắn vào phần mềm C/C++. Giao tiếp giữa C và Lua hoạt động thông qua một cấu trúc ngăn xếp ảo (Virtual Stack).</p>',
       code:'// Ma nguon C khoi tao Lua Engine\n// #include <lua.h>\n// #include <lauxlib.h>\n// #include <lualib.h>\n\n// int main() {\n//     lua_State *L = luaL_newstate();\n//     luaL_openlibs(L);\n//     luaL_dostring(L, "print(\'Lua chay tu ben trong C!\')");\n//     lua_close(L);\n//     return 0;\n// }',
       lang:'c',
       keyPoints:['Lua C API giao tiếp qua cơ chế Virtual Stack','Nhúng dễ dàng làm kịch bản AI, cấu hình game engine','Tối ưu hóa tài nguyên phần cứng cực đại'],
       exercise:'Tìm hiểu quy trình đẩy và lấy giá trị từ Lua Stack sang C.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Coroutines & Tối ưu hóa với LuaJIT',lessons:[
      {id:'advanced',title:'Coroutines, LuaJIT & Thiết kế Ngôn ngữ DSL',
       theory:'<p><strong>Coroutines</strong> trong Lua cung cấp mô hình đa nhiệm hợp tác (Cooperative Multitasking). <strong>LuaJIT</strong> là trình biên dịch Just-In-Time nhanh hàng đầu thế giới trong các ngôn ngữ động.</p>',
       code:'-- Coroutines tao bo dem vo tan\nlocal function counter()\n    local i = 0\n    while true do\n        i = i + 1\n        coroutine.yield(i) -- Tam dung va tra ve gia tri\n    end\nend\n\nlocal co = coroutine.create(counter)\nlocal _, v1 = coroutine.resume(co)\nlocal _, v2 = coroutine.resume(co)\nprint("Lan 1: " .. v1 .. ", Lan 2: " .. v2) -- 1, 2',
       lang:'lua',
       keyPoints:['Coroutines cho phép tạm dừng và phục hồi hàm linh hoạt','LuaJIT tăng tốc độ thực thi tiệm cận C/C++','Thiết kế Domain Specific Languages (DSL) tùy biến'],
       exercise:'Dùng coroutines để hiện thực hóa mô hình Producer - Consumer.'}
    ]}
  ]
};

const DATA_R = {
  id:'r', name:'R', icon:'📊', color:'#276DC3',
  gradient:'linear-gradient(135deg,#276DC3,#1A4F8B)',
  category:'language',
  description:'Tính toán thống kê, khoa học dữ liệu, trực quan hóa biểu đồ',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Nền tảng R, Vector & Phân tích cơ bản',lessons:[
      {id:'intro',title:'Nền tảng ngôn ngữ R & Môi trường RStudio',
       theory:'<p><b>R</b> là ngôn ngữ tiêu chuẩn vàng thế giới trong lĩnh vực tính toán thống kê (Statistical Computing), phân tích dữ liệu và vẽ biểu đồ khoa học.</p><p>Trong R, toán tử gán giá trị tiêu chuẩn là <code><-</code>.</p>',
       code:'# Khai bao bien bang toan tu <-\nage <- 22\nscore <- 9.5\n\n# Vector - Cau truc du lieu cot loi nhat trong R\nscores <- c(8.5, 9.0, 7.5, 10, 8.0)\n\n# Cac ham thong ke tich hop san\nprint(paste("Diem trung binh:", mean(scores)))\nprint(paste("Diem cao nhat:", max(scores)))\nprint(paste("Do lech chuan:", sd(scores)))',
       lang:'r',
       keyPoints:['Toán tử <- là chuẩn gán giá trị trong R','Vector là cấu trúc dữ liệu cơ bản nhất tạo bởi c()','Tích hợp sẵn đầy đủ mọi hàm thống kê toán học'],
       exercise:'Tạo vector chứa điểm của 10 sinh viên và tính giá trị trung bình, trung vị (median) và độ lệch chuẩn.'},
      {id:'vectors',title:'Bảng dữ liệu Data Frames trong R',
       theory:'<p><strong>Data Frame</strong> là cấu trúc bảng dữ liệu 2 chiều (gồm các hàng và cột, tương tự bảng tính Excel hoặc bảng SQL), là cấu trúc trung tâm trong phân tích khoa học dữ liệu.</p>',
       code:'# Tao Data Frame\nstudents <- data.frame(\n  name = c("An", "Binh", "Chi"),\n  math = c(9, 8, 10),\n  english = c(8.5, 9.0, 7.5)\n)\n\n# Truy cap cot bang dau $\nprint(students$name)\n\n# Thong ke tong quan toan bo bang\nsummary(students)',
       lang:'r',
       keyPoints:['Data Frame lưu trữ dữ liệu dạng bảng với nhiều kiểu dữ liệu','Truy cập cột dữ liệu cực nhanh bằng ký hiệu $','Hàm summary() tóm tắt thống kê toàn diện'],
       exercise:'Tạo data frame lưu danh sách 5 sản phẩm (Tên, Giá, Số lượng) và lọc ra các sản phẩm có giá lớn hơn 100.'},
      {id:'plots',title:'Trực quan hóa biểu đồ với Base R & ggplot2',
       theory:'<p>R là ngôn ngữ vẽ biểu đồ đẹp và chuẩn mực nhất nhờ thư viện <code>ggplot2</code> dựa trên triết lý ngữ pháp đồ họa (Grammar of Graphics).</p>',
       code:'# Ve bieu do phan tan Scatter Plot co ban\nx <- 1:10\ny <- x^2\nplot(x, y, type = "b", col = "blue", main = "Bieu do tang truong", xlab = "Thoi gian", ylab = "Gia tri")',
       lang:'r',
       keyPoints:['Hàm plot() vẽ nhanh các biểu đồ cơ bản','Thư viện ggplot2 chuẩn mực cho các bài báo khoa học quốc tế'],
       exercise:'Vẽ biểu đồ Histogram phân phối tần số của 100 số ngẫu nhiên sinh từ hàm rnorm().'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Xử lý dữ liệu với dplyr & Thống kê suy diễn',lessons:[
      {id:'dplyr',title:'Xử lý dữ liệu chuyên nghiệp với dplyr & Tidyverse',
       theory:'<p>Bộ thư viện <strong>Tidyverse</strong> (đặc biệt là <code>dplyr</code>) cung cấp các hàm xử lý dữ liệu trực quan: <code>filter()</code> (lọc hàng), <code>select()</code> (chọn cột), <code>mutate()</code> (tạo cột mới), <code>group_by()</code> và <code>summarise()</code> kết hợp toán tử đường ống <code>%>%</code>.</p>',
       code:'# Su dung toan tu pipe %>%\n# data %>% filter(age > 20) %>% select(name, score)',
       lang:'r',
       keyPoints:['Toán tử Pipe %>% giúp code đọc từ trái sang phải mượt mà','Các động từ cốt lõi: filter, select, mutate, summarise'],
       exercise:'Dùng dplyr để nhóm dữ liệu theo lớp học và tính điểm trung bình từng lớp.'},
      {id:'stats',title:'Phân tích thống kê & Kiểm định giả thuyết',
       theory:'<p>R hỗ trợ kiểm định thống kê chuyên sâu: Kiểm định T-test so sánh hai nhóm, kiểm định Chi-bình phương (Chi-squared), phân tích phương sai (ANOVA) và Hồi quy tuyến tính (Linear Regression).</p>',
       code:'# Hoi quy tuyen tinh Linear Regression\n# model <- lm(y ~ x, data = df)\n# summary(model)',
       lang:'r',
       keyPoints:['Hàm lm() xây dựng mô hình hồi quy tuyến tính','Kiểm định t.test() so sánh sự khác biệt có ý nghĩa thống kê'],
       exercise:'Xây dựng mô hình hồi quy đơn biến dự đoán doanh thu theo chi phí quảng cáo.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Machine Learning & Học máy trong R',lessons:[
      {id:'ml',title:'Mô hình Học máy Machine Learning với Caret',
       theory:'<p>Thư viện <code>caret</code> và <code>tidymodels</code> chuẩn hóa toàn bộ quy trình Machine Learning: Tiền xử lý dữ liệu, chia tập Train/Test, Cross-validation và đánh giá mô hình Random Forest, XGBoost.</p>',
       code:'# Mo phong phan chia Train / Test\n# library(caret)\n# set.seed(42)',
       lang:'r',
       keyPoints:['Quy trình ML chuẩn hóa với Caret & Tidymodels','Đánh giá mô hình qua Confusion Matrix, ROC-AUC'],
       exercise:'Xây dựng mô hình phân loại hoa Iris với thuật toán Decision Tree.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Xây dựng Dashboard tương tác với Shiny',lessons:[
      {id:'shiny',title:'Xây dựng Web Dashboard tương tác với R Shiny',
       theory:'<p><strong>Shiny</strong> cho phép lập trình viên R tạo các ứng dụng Web Dashboard tương tác thời gian thực hoàn chỉnh mà không cần biết HTML, CSS hay JavaScript phức tạp.</p>',
       code:'# Cau truc mot ung dung Shiny co ban\n# ui <- fluidPage(...)\n# server <- function(input, output) {...}\n# shinyApp(ui, server)',
       lang:'r',
       keyPoints:['Mô hình lập trình phản ứng (Reactive Programming)','Kiến trúc UI + Server mạch lạc','Triển khai dashboard trực tiếp lên Cloud'],
       exercise:'Thiết kế giao diện Shiny có thanh trượt điều chỉnh số lượng mẫu vẽ biểu đồ.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'R trong Môi trường Doanh nghiệp & Big Data',lessons:[
      {id:'production',title:'Triển khai API với Plumber & Tích hợp Apache Spark',
       theory:'<p>Đưa mô hình R vào Production: Đóng gói mô hình thành REST API tốc độ cao với <code>plumber</code>, xử lý dữ liệu phân tán quy mô hàng triệu bản ghi với <code>sparklyr</code> và đóng gói Container Docker.</p>',
       code:'# API Plumber trong R\n#* @get /predict\n# function(x) { return(predict(model, x)) }',
       lang:'r',
       keyPoints:['Tạo microservices REST API cho mô hình AI bằng Plumber','Xử lý dữ liệu lớn Big Data với Sparklyr & Docker'],
       exercise:'Viết một API Plumber nhận vào tham số và trả về kết quả dự đoán JSON.'}
    ]}
  ]
};

const DATA_SCALA = {
  id:'scala', name:'Scala', icon:'🔴', color:'#DC322F',
  gradient:'linear-gradient(135deg,#DC322F,#B8282E)',
  category:'language',
  description:'Hệ sinh thái JVM, xử lý Dữ liệu lớn (Big Data / Spark), hàm kết hợp OOP',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Cú pháp cơ bản, Biến & Collections',lessons:[
      {id:'intro',title:'Tổng quan Scala & Môi trường JVM',
       theory:'<p><b>Scala</b> (Scalable Language) là ngôn ngữ chạy trên máy ảo Java (JVM), kết hợp hoàn hảo giữa <strong>Lập trình hướng đối tượng (OOP)</strong> và <strong>Lập trình hàm (Functional Programming)</strong>.</p><p>Scala là ngôn ngữ đứng sau nền tảng xử lý dữ liệu lớn số 1 thế giới: <strong>Apache Spark</strong>.</p>',
       code:'object HelloWorld extends App {\n  // val la hang so bat bien (immutable), var la bien co the thay doi\n  val message: String = "Xin chao Scala tren DevMaster Hub!"\n  println(message)\n\n  // String interpolation voi ky hieu s\n  val name = "Hoc vien"\n  val age = 22\n  println(s"Ten: $name, Tuoi: $age")\n}',
       lang:'scala',
       keyPoints:['Chạy trên nền tảng JVM, tương thích 100% với toàn bộ thư viện Java','val: Biến bất biến (khuyên dùng), var: Biến có thể gán lại','Mọi câu lệnh trong Scala đều là một biểu thức trả về giá trị'],
       exercise:'Tạo một Scala object in ra thông tin bản thân và kết quả tính toán số học.'},
      {id:'functions',title:'Hàm & Xử lý Collections mạnh mẽ',
       theory:'<p>Trong Scala, hàm là <em>First-class citizen</em>. Bộ thư viện Collections (List, Set, Map) cung cấp các phương thức biến đổi dữ liệu cực kỳ súc tích: <code>map</code>, <code>filter</code>, <code>reduce</code>, <code>fold</code>.</p>',
       code:'object CollectionsDemo extends App {\n  val numbers = List(1, 2, 3, 4, 5, 6)\n\n  // Loc so chan va gap doi gia tri\n  val evenDoubled = numbers.filter(_ % 2 == 0).map(_ * 2)\n  println(s"Ket qua: $evenDoubled") // List(4, 8, 12)\n\n  // Tinh tong danh sach bang reduce\n  val total = numbers.reduce(_ + _)\n  println(s"Tong: $total") // 21\n}',
       lang:'scala',
       keyPoints:['Cú pháp dấu gạch dưới _ làm tham số ngắn gọn súc tích','Các phương thức biến đổi bất biến map, filter, flatMap, reduce','Pattern Matching mạnh mẽ thay thế switch-case'],
       exercise:'Tạo danh sách điểm sinh viên, lọc ra điểm >= 8.0 và tính điểm trung bình.'},
      {id:'classes',title:'Classes, Case Classes & Pattern Matching',
       theory:'<p><strong>Case Class</strong> trong Scala là cấu trúc dữ liệu bất biến lý tưởng cho mô hình hóa nghiệp vụ: Tự động sinh sẵn các phương thức <code>equals</code>, <code>hashCode</code>, <code>toString</code> và hỗ trợ giải nén qua <strong>Pattern Matching</strong>.</p>',
       code:'// Dinh nghia Case Class\ncase class User(name: String, role: String, age: Int)\n\nobject Main extends App {\n  val u = User("Minh", "Admin", 25)\n\n  // Pattern Matching theo kieu du lieu va gia tri\n  u match {\n    case User(name, "Admin", _) => println(s"Xin chao quan tri vien $name!")\n    case User(name, _, age) if age < 18 => println(s"Chao ban tre $name")\n    case _ => println("Nguoi dung tieu chuan")\n  }\n}',
       lang:'scala',
       keyPoints:['Case Class tự động hỗ trợ tính bất biến và so sánh giá trị','Pattern Matching mạnh mẽ với điều kiện Guard (if)','Traits đóng vai trò như Interfaces nhưng có thể chứa mã thực thi'],
       exercise:'Tạo cấu trúc Shape (Circle, Rectangle) dạng Case Class và viết hàm tính diện tích dùng Pattern Matching.'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Lập trình Hàm nâng cao & Xử lý Bất đồng bộ',lessons:[
      {id:'fp',title:'Lập trình hàm nâng cao & Kiểu Option',
       theory:'<p>Scala loại bỏ hoàn toàn lỗi <code>NullPointerException</code> bằng cách sử dụng kiểu <code>Option[T]</code> (gồm <code>Some(value)</code> hoặc <code>None</code>). Kết hợp kỹ thuật <em>Currying</em> và <em>For-comprehensions</em>.</p>',
       code:'object OptionDemo extends App {\n  def findUser(id: Int): Option[String] = {\n    if (id == 1) Some("Nguyen Van A") else None\n  }\n\n  val userName = findUser(1).getOrElse("Khong tim thay nguoi dung")\n  println(userName)\n}',
       lang:'scala',
       keyPoints:['Option[T] thay thế an toàn cho null','For-comprehensions giúp chuỗi hóa các phép tính bất đồng bộ','Currying chia nhỏ hàm nhiều tham số'],
       exercise:'Viết hàm tìm kiếm sinh viên theo ID trả về Option và xử lý kết quả an toàn.'},
      {id:'concurrency',title:'Lập trình đồng thời với Futures & Promises',
       theory:'<p><code>Future</code> trong Scala đại diện cho một tác vụ tính toán bất đồng bộ chạy trên luồng nền (ThreadPool / ExecutionContext) mà không làm tắc nghẽn luồng chính.</p>',
       code:'import scala.concurrent.{Future, Await}\nimport scala.concurrent.ExecutionContext.Implicits.global\nimport scala.concurrent.duration._\n\nobject FutureDemo extends App {\n  val f = Future {\n    Thread.sleep(500)\n    42\n  }\n\n  val mapped = f.map(_ * 2)\n  val result = Await.result(mapped, 2.seconds)\n  println(s"Ket qua bat dong bo: $result") // 84\n}',
       lang:'scala',
       keyPoints:['Future xử lý tác vụ bất đồng bộ non-blocking','Kết hợp nhiều Futures bằng For-comprehension','ExecutionContext quản lý ThreadPool tối ưu'],
       exercise:'Chạy song song 2 tác vụ tải dữ liệu và tổng hợp kết quả khi cả hai hoàn thành.'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Xử lý Dữ liệu lớn với Apache Spark',lessons:[
      {id:'spark',title:'Phân tích Dữ liệu lớn với Apache Spark & DataFrames',
       theory:'<p><strong>Apache Spark</strong> là framework xử lý dữ liệu phân tán viết bằng Scala. Spark DataFrames cung cấp khả năng tính toán trên hàng tỷ bản ghi với cơ chế thực thi lười (Lazy Evaluation) và tối ưu hóa truy vấn Catalyst.</p>',
       code:'// Mo phong Spark code\n// val spark = SparkSession.builder.appName("DevMaster").getOrCreate()\n// val df = spark.read.json("data.json")\n// df.filter($"age" > 20).groupBy("city").count().show()',
       lang:'scala',
       keyPoints:['SparkSession là điểm khởi đầu của ứng dụng Spark','Cơ chế Lazy Evaluation tối ưu hóa đồ thị tính toán DAG','Xử lý song song phân tán trên cụm máy chủ (Cluster)'],
       exercise:'Viết mã nguồn Spark đọc file log và đếm số lượng lỗi HTTP 500 theo từng giờ.'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Hệ thống Kiểu nâng cao & Type Classes',lessons:[
      {id:'typesystem',title:'Hệ thống kiểu nâng cao & Type Classes (Implicits/Givens)',
       theory:'<p>Hệ thống kiểu của Scala thuộc hàng mạnh mẽ nhất thế giới: Hỗ trợ <strong>Type Classes</strong>, <strong>Variance (Covariant/Contravariant)</strong> và cơ chế <strong>Implicits / Givens</strong> giúp mở rộng chức năng mà không cần sửa đổi mã nguồn gốc.</p>',
       code:'// Mo phong Type Class Pattern\ntrait JsonSerializable[T] {\n  def toJson(value: T): String\n}',
       lang:'scala',
       keyPoints:['Type Class Pattern tạo tính đa hình mở (Ad-hoc Polymorphism)','Implicits / Givens truyền tham số ngầm định tự động'],
       exercise:'Thiết kế một Type Class định dạng hiển thị tiền tệ cho các kiểu dữ liệu khác nhau.'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Kiến trúc Microservices với Akka & ZIO',lessons:[
      {id:'production',title:'Xây dựng Microservices với Akka HTTP & ZIO',
       theory:'<p>Xây dựng hệ thống phân tán, chịu lỗi cực cao (Fault-Tolerant) dựa trên mô hình Actor Model của <strong>Akka</strong> hoặc mô hình Functional Effects của <strong>ZIO / Cats Effect</strong>.</p>',
       code:'// Mo phong Akka / ZIO effect system\n// val program = ZIO.succeed("Microservice running with zero downtime!")',
       lang:'scala',
       keyPoints:['Actor Model trong Akka xử lý hàng triệu thông điệp đồng thời','ZIO quản lý luồng, tài nguyên và lỗi thuần khiết','Kiến trúc Reactive Microservices chịu lỗi cao'],
       exercise:'Thiết kế kiến trúc Actor cho hệ thống nhận và xử lý đơn hàng theo thời gian thực.'}
    ]}
  ]
};
