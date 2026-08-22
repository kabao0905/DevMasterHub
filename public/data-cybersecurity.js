(function() {
  const cybersecurityCurriculum = {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🛡️',
    color: '#f85149',
    category: 'tool',
    desc: 'An ninh mạng & Ethical Hacking: Từ Linux cơ bản, Quét mạng, Lỗ hổng Web OWASP đến Leo thang đặc quyền.',
    levels: [
      {
        id: 'newbie',
        name: 'Newbie',
        badge: 'newbie',
        desc: 'Nền tảng An toàn thông tin & Lệnh Linux cho Hacker',
        lessons: [
          {
            id: 'security-fundamentals',
            title: 'Tổng quan An toàn thông tin & Mô hình CIA',
            theory: 'An toàn thông tin (Information Security) xoay quanh tam giác bảo mật kinh điển CIA Triad:\n\n1. **Confidentiality (Tính bảo mật)**: Đảm bảo dữ liệu chỉ được truy cập bởi những đối tượng được cấp quyền. Các giải pháp chính gồm Mã hóa (Encryption), Kiểm soát truy cập (Access Control) và Xác thực 2 lớp (2FA).\n\n2. **Integrity (Tính toàn vẹn)**: Đảm bảo dữ liệu không bị sửa đổi trái phép hoặc giả mạo trong quá trình lưu trữ và truyền tải. Công cụ: Hàm băm mật mã (SHA-256, MD5), Chữ ký số (Digital Signature).\n\n3. **Availability (Tính khả dụng)**: Đảm bảo hệ thống và dữ liệu luôn sẵn sàng phục vụ khi người dùng hợp lệ có nhu cầu. Các mối đe dọa lớn: Tấn công từ chối dịch vụ (DDoS), sự cố phần cứng, lỗi cấu hình mạng.\n\nTrong vai trò Ethical Hacker (Hacker mũ trắng), bạn cần hiểu cách bảo vệ cả 3 trụ cột này trước các kỹ thuật tấn công hiện đại.',
            code: '# Kiểm tra tính toàn vẹn của tệp tin bằng SHA-256 trên Linux\nsha256sum secret_data.txt\n\n# Output mẫu:\n# e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  secret_data.txt',
            keyPoints: [
              'Tam giác CIA: Confidentiality (Bảo mật), Integrity (Toàn vẹn), Availability (Khả dụng).',
              'Hàm băm (Hash Function) là hàm 1 chiều, tạo dấu vân tay số cho dữ liệu.',
              'Mục tiêu của Ethical Hacking là tìm ra lỗ hổng trước khi tin tặc khai thác.'
            ],
            exercise: 'Hãy mở Terminal Linux ảo, kiểm tra danh sách tệp tin trong thư mục hiện tại và đọc tệp readme.txt để tìm hướng dẫn đầu tiên.'
          },
          {
            id: 'linux-permissions',
            title: 'Hệ thống Phân quyền Linux (chmod & chown)',
            theory: 'Hệ điều hành Linux quản lý quyền truy cập tệp rất chặt chẽ dựa trên 3 nhóm đối tượng:\n- **u (User/Owner)**: Chủ sở hữu tệp.\n- **g (Group)**: Nhóm người dùng sở hữu.\n- **o (Others)**: Tất cả người dùng còn lại trong hệ thống.\n\nBa quyền cơ bản tương ứng với các giá trị nhị phân:\n- **r (Read - 4)**: Quyền đọc nội dung tệp.\n- **w (Write - 2)**: Quyền sửa đổi hoặc xóa tệp.\n- **x (Execute - 1)**: Quyền thực thi chương trình/script.\n\nVí dụ lệnh chmod 755 script.sh cấp quyền:\n- Owner: 4+2+1 = 7 (rwx)\n- Group: 4+0+1 = 5 (r-x)\n- Others: 4+0+1 = 5 (r-x)\n\nHiểu phân quyền là chìa khóa để phát hiện lỗ hổng leo thang đặc quyền (Privilege Escalation).',
            code: '# Xem chi tiết phân quyền\nls -la\n\n# Cấp quyền thực thi cho chủ sở hữu\nchmod 700 exploit.sh\n\n# Chuyển quyền sở hữu cho user root\nsudo chown root:root /etc/shadow',
            keyPoints: [
              'Quyền Linux tính theo octal: Read=4, Write=2, Execute=1.',
              'Tệp có quyền 777 là cực kỳ nguy hiểm trong môi trường sản xuất.',
              'Lệnh chown thay đổi chủ sở hữu và nhóm sở hữu của tệp.'
            ],
            exercise: 'Sử dụng lệnh chmod và ls -la trong Terminal để kiểm tra quyền của các tệp tin trong thư mục cá nhân.'
          }
        ]
      },
      {
        id: 'junior',
        name: 'Junior',
        badge: 'junior',
        desc: 'Mạng Máy Tính & Kỹ thuật Quét Dò Lỗ Hổng (Reconnaissance)',
        lessons: [
          {
            id: 'network-scanning-nmap',
            title: 'Quét Mạng & Thám Mã Cổng với Nmap',
            theory: 'Thu thập thông tin (Reconnaissance / Information Gathering) là bước đầu tiên và quan trọng nhất trong một cuộc tấn công bảo mật.\n\n**Nmap (Network Mapper)** là công cụ quét mạng mã nguồn mở tiêu chuẩn quốc tế giúp:\n1. Phát hiện các máy chủ (Host Discovery) đang hoạt động trên subnet.\n2. Quét các cổng (Port Scanning) TCP/UDP đang mở (Open Ports).\n3. Nhận diện dịch vụ và phiên bản phần mềm (Service & Version Detection: Apache, Nginx, OpenSSH, MySQL).\n4. Nhận diện hệ điều hành mục tiêu (OS Fingerprinting).\n\nKhi phát hiện cổng mở (ví dụ: Port 80 HTTP, Port 8080 API, Port 3306 MySQL), pentester sẽ tìm kiếm các lỗ hổng đã biết (CVE) tương ứng với phiên bản dịch vụ đó.',
            code: '# Quét các cổng phổ biến và nhận diện phiên bản\nnmap -sV -p- 192.168.1.100\n\n# Quét nhanh toàn bộ subnet mạng LAN\nnmap -sn 192.168.1.0/24\n\n# Quét kèm theo các script kiểm tra lỗ hổng tự động\nnmap --script vuln 192.168.1.100',
            keyPoints: [
              'Nmap là công cụ số 1 cho giai đoạn Reconnaissance.',
              'Port 80/443 (Web), Port 22 (SSH), Port 3306 (MySQL), Port 8080 (App Server).',
              'Luôn quét dịch vụ trước khi lên kế hoạch khai thác lỗ hổng.'
            ],
            exercise: 'Gõ lệnh nmap 192.168.1.100 trong Terminal để quét máy chủ mục tiêu và tìm cờ ẩn trong dịch vụ cổng 8080.'
          },
          {
            id: 'http-analysis-curl',
            title: 'Phân tích Giao thức HTTP/HTTPS với cURL',
            theory: 'Web Application Pentesting đòi hỏi hiểu sâu cấu trúc gói tin HTTP Request và Response Header.\n\nNhiều máy chủ vô tình làm rò rỉ thông tin nhạy cảm qua Header phản hồi:\n- Server: Tiết lộ phiên bản web server (ví dụ: Apache/2.4.41).\n- X-Powered-By: Tiết lộ ngôn ngữ hoặc framework (PHP/8.1, Express, ASP.NET).\n- Set-Cookie: Kiểm tra cờ bảo mật (HttpOnly, Secure, SameSite).\n- Custom Headers: Đôi khi lập trình viên để lại thông tin debug hoặc API token bí mật trong header.\n\nSử dụng lệnh curl -I hoặc curl -v cho phép pentester quan sát toàn bộ quá trình bắt tay và trao đổi header HTTP.',
            code: '# Lấy toàn bộ Header phản hồi của trang web\\ncurl -I https://target.local\\n\\n# Gửi request HTTP POST với dữ liệu JSON\\ncurl -X POST -H "Content-Type: application/json" -d \'{"user":"admin"}\' http://target.local/api/login',
            keyPoints: [
              'cURL là công cụ kiểm thử HTTP command-line mạnh mẽ.',
              'Cờ -I dùng để lấy Header, cờ -v hiển thị chi tiết verbose toàn bộ request/response.',
              'Header HTTP thường chứa dấu vết rò rỉ phiên bản và token bảo mật.'
            ],
            exercise: 'Dùng lệnh curl http://localhost trong Terminal để kiểm tra các HTTP Header và tìm cờ bí mật.'
          }
        ]
      },
      {
        id: 'mid',
        name: 'Mid',
        badge: 'mid',
        desc: 'Khai Thác Lỗ Hổng Ứng Dụng Web (OWASP Top 10)',
        lessons: [
          {
            id: 'sql-injection',
            title: 'Lỗ hổng SQL Injection (SQLi) & Phòng Chống',
            theory: 'SQL Injection (SQLi) là lỗ hổng bảo mật xảy ra khi dữ liệu người dùng nhập không được lọc (sanitize) hoặc tham số hóa (parameterize), mà được ghép trực tiếp vào câu truy vấn SQL.\\n\\n**Cơ chế tấn công:**\\nNếu câu truy vấn là:\\nSELECT * FROM users WHERE username = \\\' + input + \\\' AND password = \\\'...\\\'\\n\\nKhi attacker nhập input là: admin\\\' OR \\\'1\\\'=\\\'1\\nCâu truy vấn trở thành:\\nSELECT * FROM users WHERE username = \\\'admin\\\' OR \\\'1\\\'=\\\'1 AND password = \\\'...\\\'\\nĐiều kiện \\\'1\\\'=\\\'1 luôn luôn đúng, giúp attacker đăng nhập vào tài khoản admin mà không cần mật khẩu!\\n\\n**Cách khắc phục:** Luôn sử dụng **Prepared Statements (Parameterized Queries)** hoặc ORM an toàn.',
            code: '// ❌ VULNERABLE CODE (Dễ bị SQLi):\\nconst sql = "SELECT * FROM users WHERE user = \\\'" + req.body.user + "\\\'";\\n\\n// ✅ SECURE CODE (An toàn 100% với Parameterized Query):\\nconst sql = "SELECT * FROM users WHERE user = ?";\\ndb.query(sql, [req.body.user]);',
            keyPoints: [
              'SQL Injection cho phép kẻ tấn công vượt qua xác thực và trích xuất toàn bộ CSDL.',
              'Không bao giờ cộng chuỗi trực tiếp để tạo câu lệnh SQL.',
              'Prepared Statements là giải pháp phòng vệ triệt để nhất.'
            ],
            exercise: 'Tìm và đọc tệp cấu hình web server tại /var/www/html/config.php để tìm mật khẩu CSDL chứa cờ CTF.'
          },
          {
            id: 'xss-csrf-defenses',
            title: 'Lỗ hổng Cross-Site Scripting (XSS) & CSRF',
            theory: '**XSS (Cross-Site Scripting)** cho phép kẻ tấn công chèn mã JavaScript độc hại vào trang web để đánh cắp Cookie, Session Token hoặc giả mạo hành vi của người dùng.\n\nCó 3 dạng XSS chính:\n1. **Stored XSS (Persistent)**: Mã độc được lưu vĩnh viễn trong CSDL (ví dụ: phần bình luận bài viết) và thực thi mỗi khi nạn nhân tải trang.\n2. **Reflected XSS**: Mã độc nằm trong URL query parameter và phản chiếu ngay trên trang kết quả.\n3. **DOM-based XSS**: Lỗ hổng xảy ra hoàn toàn ở phía client script khi xử lý dữ liệu từ window.location.\n\n**Biện pháp phòng ngừa:** Mã hóa HTML Output Encoding, thiết lập cờ HttpOnly cho Cookie, và triển khai chính sách Content Security Policy (CSP).',
            code: '<!-- ❌ Dễ bị Stored XSS -->\n<div id="comment"><%= userComment %></div>\n\n<!-- ✅ An toàn: Sử dụng textContent hoặc hàm escapeHtml -->\n<script>\n  document.getElementById("comment").textContent = userComment;\n</script>',
            keyPoints: [
              'XSS nhắm vào người dùng truy cập trang web thông qua mã JavaScript độc hại.',
              'Cờ Cookie HttpOnly ngăn chặn JavaScript đọc session token.',
              'Content Security Policy (CSP) hạn chế nguồn thực thi script bên ngoài.'
            ],
            exercise: 'Thực hành giải mã chuỗi Base64 chứa payload bảo mật trong tệp secret_b64.txt bằng lệnh base64 -d.'
          }
        ]
      },
      {
        id: 'senior',
        name: 'Senior',
        badge: 'senior',
        desc: 'Mật Mã Học (Cryptography) & Điều Tra Số (Digital Forensics)',
        lessons: [
          {
            id: 'cryptography-hashing',
            title: 'Mật mã học: Đối xứng, Bất đối xứng & Hash',
            theory: 'Mật mã học là nền tảng của an ninh thông tin hiện đại:\n\n1. **Mã hóa đối xứng (Symmetric Encryption - AES)**: Dùng chung 1 khóa bí mật (Secret Key) cho cả mã hóa và giải mã. Tốc độ rất nhanh, phù hợp mã hóa khối lượng lớn dữ liệu.\n\n2. **Mã hóa bất đối xứng (Asymmetric Encryption - RSA, ECC)**: Dùng cặp khóa gồm Public Key (khóa công khai để mã hóa) và Private Key (khóa bí mật để giải mã). Dùng cho trao đổi khóa và chữ ký số.\n\n3. **Mã hóa một chiều (Hashing - SHA-256, bcrypt, Argon2)**: Không thể giải mã ngược. Dùng để lưu trữ mật khẩu an toàn kết hợp với Salt ngẫu nhiên chống lại tấn công Rainbow Table.',
            code: '// Tạo chuỗi băm mật khẩu với Salt bằng bcrypt trong Node.js\nconst bcrypt = require("bcrypt");\nconst saltRounds = 12;\n\n// Băm mật khẩu\nconst hash = await bcrypt.hash("MyP@ssw0rd2026", saltRounds);\n\n// Kiểm tra mật khẩu\nconst isMatch = await bcrypt.compare("MyP@ssw0rd2026", hash);',
            keyPoints: [
              'AES là tiêu chuẩn mã hóa đối xứng hàng đầu.',
              'RSA / ECC giải quyết bài toán phân phối khóa an toàn qua kênh truyền công khai.',
              'Mật khẩu trong cơ sở dữ liệu BẮT BUỘC phải được băm bằng bcrypt hoặc Argon2 có Salt.'
            ],
            exercise: 'Kiểm tra tệp /etc/shadow trong Terminal ảo để phân tích chuỗi hash mật khẩu của tài khoản root.'
          },
          {
            id: 'log-analysis-forensics',
            title: 'Điều Tra Số & Phân Tích Nhật Ký (Log Forensics)',
            theory: 'Khi xảy ra sự cố an ninh, chuyên gia Incident Response (IR) cần điều tra nhật ký hệ thống để tái hiện lại hành vi của kẻ xâm nhập:\n\nCác tệp log quan trọng trên Linux:\n- /var/log/auth.log (hoặc /var/log/secure): Ghi lại các nỗ lực đăng nhập SSH, dùng lệnh sudo, thay đổi mật khẩu.\n- /var/log/nginx/access.log: Ghi lại IP, User-Agent, URI và Status code của các truy vấn web.\n- /var/log/syslog: Nhật ký hoạt động chung của toàn bộ tiến trình hệ điều hành.\n\nSử dụng các công cụ dòng lệnh grep, awk, sed, cut và sort | uniq -c giúp phát hiện nhanh các cuộc tấn công Brute-Force hoặc quét lỗ hổng tự động.',
            code: '# Tìm kiếm các lần đăng nhập SSH thất bại\\ngrep "Failed password" /var/log/auth.log | awk \\\'{print $11}\\\' | sort | uniq -c | sort -nr\\n\\n# Tìm kiếm các request quét lỗi SQLi trên Nginx\\ngrep -i "union select" /var/log/nginx/access.log',
            keyPoints: [
              'Log là bằng chứng vàng trong điều tra số và phản ứng sự cố.',
              'Nhật ký auth.log lưu trữ mọi vết tích đăng nhập và phân quyền.',
              'Thành thạo grep và regex giúp lọc dữ liệu tấn công trong hàng triệu dòng log.'
            ],
            exercise: 'Dùng lệnh cat /var/log/auth.log hoặc grep FLAG /var/log/auth.log để tìm dấu vết cờ đăng nhập bí mật.'
          }
        ]
      },
      {
        id: 'master',
        name: 'Master',
        badge: 'master',
        desc: 'Leo Thang Đặc Quyền & Kiến Trúc Phòng Thủ Zero Trust',
        lessons: [
          {
            id: 'linux-privilege-escalation',
            title: 'Kỹ Thuật Leo Thang Đặc Quyền Linux (PrivEsc)',
            theory: 'Leo thang đặc quyền (Privilege Escalation) là quá trình chiếm quyền truy cập cao hơn (từ tài khoản thông thường lên root) sau khi đã có foothold ban đầu.\n\nCác vector leo thang đặc quyền phổ biến nhất trên Linux:\n1. **Cấu hình Sudo sai lầm (sudo -l)**: Cho phép user chạy một số nhị phân nguy hiểm (như vim, find, bash, python) với quyền root không cần mật khẩu (tham khảo GTFOBins).\n2. **SUID Binaries (chmod u+s)**: Các tệp thực thi chạy dưới quyền của chủ sở hữu tệp (root) bất kể ai là người gọi lệnh.\n3. **Cron Jobs chạy quyền root**: Các script định kỳ có quyền ghi (writeable) cho phép chèn lệnh đảo ngược shell.\n4. **Lỗ hổng Kernel (Dirty COW, PwnKit)**: Khai thác lỗi bộ nhớ trong nhân Linux để ép hệ điều hành cấp quyền root.',
            code: '# 1. Kiểm tra các lệnh được phép chạy qua sudo\nsudo -l\n\n# 2. Tìm kiếm tất cả các tệp có cờ SUID\nfind / -perm -4000 -type f 2>/dev/null\n\n# 3. Kiểm tra các tiến trình đang chạy bởi root\nps aux | grep root',
            keyPoints: [
              'PrivEsc là mục tiêu tối thượng của kẻ tấn công sau khi xâm nhập thành công.',
              'Cấu hình sudoers lỏng lẻo và SUID binary là nguyên nhân hàng đầu gây mất an toàn.',
              'Luôn tuân thủ nguyên tắc quyền tối thiểu (Principle of Least Privilege).'
            ],
            exercise: 'Gõ lệnh whoami, id, uname -a và hoàn thành toàn bộ 5 thử thách CTF trong bảng để nhận danh hiệu Master Hacker.'
          },
          {
            id: 'zero-trust-architecture',
            title: 'Kiến Trúc Phòng Thủ Zero Trust & DevSecOps',
            theory: '**Zero Trust Architecture (ZTA)** hoạt động dựa trên triết lý cốt lõi: "Never Trust, Always Verify" (Không bao giờ tin tưởng, luôn luôn xác thực).\n\nThay vì mô hình lâu đài và hào nước truyền thống (tin tưởng mọi thứ bên trong mạng nội bộ), Zero Trust yêu cầu:\n1. **Xác thực và phân quyền liên tục (Continuous Verification)** cho mọi request, bất kể nó đến từ mạng nội bộ hay Internet.\n2. **Phân đoạn mạng vi mô (Micro-segmentation)**: Ngăn chặn kẻ tấn công di chuyển ngang (Lateral Movement) nếu một node bị xâm nhập.\n3. **DevSecOps Integration**: Tích hợp quét bảo mật tự động (SAST, DAST, SCA) ngay trong pipeline CI/CD (GitHub Actions, GitLab CI) để vá lỗi trước khi code lên Production.',
            code: '# Ví dụ cấu hình GitHub Actions quét lỗ hổng tự động với Trivy (DevSecOps)\n- name: Run Trivy Vulnerability Scanner\n  uses: aquasecurity/trivy-action@master\n  with:\n    scan-type: "fs"\n    severity: "CRITICAL,HIGH"\n    exit-code: "1"',
            keyPoints: [
              'Zero Trust không tin tưởng bất kỳ thiết bị hay người dùng nào theo mặc định.',
              'DevSecOps đưa bảo mật vào sớm trong vòng đời phát triển phần mềm (Shift Left).',
              'Micro-segmentation hạn chế tối đa phạm vi ảnh hưởng khi bị tin tặc tấn công.'
            ],
            exercise: 'Nộp cờ cuối cùng và chạy thử toàn bộ bộ công cụ phòng thủ trong Cybersecurity Studio.'
          }
        ]
      }
    ]
  };

  if (typeof window !== 'undefined') {
    window.DATA_CYBERSECURITY = cybersecurityCurriculum;
    if (!window.CURRICULUM) window.CURRICULUM = {};
    window.CURRICULUM.cybersecurity = cybersecurityCurriculum;
  }
  if (typeof global !== 'undefined') {
    global.DATA_CYBERSECURITY = cybersecurityCurriculum;
    if (!global.CURRICULUM) global.CURRICULUM = {};
    global.CURRICULUM.cybersecurity = cybersecurityCurriculum;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = cybersecurityCurriculum;
  }
})();
