// Du lieu mac dinh cua terminal gia lap: he thong tep "San co" va cac thu thach CTF.
// Tach khoi terminal.ts de engine chi con logic; createTerminal() sao chep sau truoc khi dung.
import type { HeThongTep, ThuThach } from './terminal';

export const VFS_MAC_DINH: HeThongTep = {
  '/': { type: 'dir', children: ['home', 'etc', 'var', 'bin', 'usr', 'flag'] },
  '/home': { type: 'dir', children: ['hacker'] },
  '/home/hacker': {
    type: 'dir',
    children: ['readme.txt', 'network_scan.sh', 'notes.md', 'secret_b64.txt', 'flag1.txt']
  },
  '/home/hacker/readme.txt': {
    type: 'file',
    content: 'Chào mừng chiến binh An ninh mạng! Hãy dùng các lệnh Linux (ls, cat, grep, nmap, base64) để tìm cờ ẩn trong hệ thống.'
  },
  '/home/hacker/notes.md': {
    type: 'file',
    content: '# Ghi chú của Admin:\n- Mật khẩu server test: admin123\n- Web server đang chạy ở cổng 8080\n- Đã sao lưu hash trong /etc/shadow'
  },
  '/home/hacker/secret_b64.txt': {
    type: 'file',
    content: 'RkxBR3tkZXZtYXN0ZXJfYmFzZTY0X2RlY29kZWRfc3VjY2Vzc30='
  },
  '/home/hacker/flag1.txt': {
    type: 'file',
    content: 'FLAG{devmaster_linux_explorer_novice}'
  },
  '/home/hacker/network_scan.sh': {
    type: 'file',
    content: '#!/bin/bash\necho "Scanning local subnet..."\nnmap 192.168.1.100\n'
  },
  '/etc': { type: 'dir', children: ['passwd', 'shadow', 'hosts', '.hidden'] },
  '/etc/.hidden': { type: 'dir', children: ['backdoor.conf'] },
  '/etc/.hidden/backdoor.conf': {
    type: 'file',
    content: '# cai dat cua tien trinh .sysupdate\nlisten_port=4444\nexfil_host=10.0.0.66\nauth_key=FLAG{devmaster_backdoor_port_4444_found}'
  },
  '/etc/passwd': {
    type: 'file',
    content: 'root:x:0:0:root:/root:/bin/bash\nhacker:x:1000:1000:Hacker:/home/hacker:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin'
  },
  '/etc/shadow': {
    type: 'file',
    content: 'root:$6$salt$Z107XmUFLAG{devmaster_root_hash_unlocked}:19000:0:99999:7:::'
  },
  '/etc/hosts': {
    type: 'file',
    content: '127.0.0.1 localhost\n192.168.1.100 target-bank-api.local'
  },
  '/bin': { type: 'dir', children: ['bash', 'nc'] },
  '/bin/bash': {
    type: 'file',
    content: '\u007fELF\u0002\u0001\u0001 GNU/Linux x86-64 — /bin/bash (binary)'
  },
  '/bin/nc': {
    type: 'file',
    content: '\u007fELF\u0002\u0001\u0001 GNU/Linux x86-64 — netcat (nc): -l listen, -e exec (binary)'
  },
  '/flag': { type: 'dir', children: ['README.txt'] },
  '/flag/README.txt': {
    type: 'file',
    content: 'Cờ không để sẵn ở đây đâu.\nHãy tự truy tìm trong hệ thống bằng: ls -la, cat, grep, find, ps, netstat, nmap, curl.'
  },
  '/usr': { type: 'dir', children: ['local'] },
  '/usr/local': { type: 'dir', children: ['bin'] },
  '/usr/local/bin': { type: 'dir', children: ['.sysupdate'] },
  '/usr/local/bin/.sysupdate': {
    type: 'file',
    content: '#!/bin/sh\n# tien trinh la: mo cong 4444 cho ke tan cong ket noi vao\nnc -lvnp 4444 -e /bin/bash'
  },
  '/var': { type: 'dir', children: ['log', 'www'] },
  '/var/log': { type: 'dir', children: ['auth.log', 'nginx.log'] },
  '/var/log/nginx.log': {
    type: 'file',
    content: '10.0.0.5 - - [20/Feb/2026:14:05:22] "GET /admin.php?debug=1 HTTP/1.1" 200 512\n10.0.0.66 - - [20/Feb/2026:14:06:03] "POST /upload.php HTTP/1.1" 200 88\n10.0.0.66 - - [20/Feb/2026:14:06:40] "GET /shell.php?cmd=whoami HTTP/1.1" 200 12'
  },
  '/var/log/auth.log': {
    type: 'file',
    content: 'Feb 20 14:02:11 dev-srv sshd[124]: Failed password for invalid user admin from 10.0.0.5\nFeb 20 14:03:00 dev-srv sshd[125]: Accepted password for root with token FLAG{devmaster_log_analyst_pro}'
  },
  '/var/www': { type: 'dir', children: ['html'] },
  '/var/www/html': {
    type: 'dir',
    children: ['index.php', 'config.php']
  },
  '/var/www/html/index.php': {
    type: 'file',
    content: '<?php\n  include "config.php";\n  echo "<h1>DevMaster Target Portal</h1>";\n?>'
  },
  '/var/www/html/config.php': {
    type: 'file',
    content: '<?php\n$db_host = "localhost";\n$db_user = "root";\n$db_pass = "SQLi_FLAG{devmaster_sql_injection_master}";\n?>'
  }
};

export const DS_THU_THACH: ThuThach[] = [
  {
    id: 'ctf-1',
    title: '🚩 Challenge 1: Thám Tử Linux',
    desc: 'Tìm kiếm tệp cờ ẩn đầu tiên trong thư mục cá nhân.',
    hint: 'Dùng lệnh "ls -la" và "cat flag1.txt"',
    flag: 'FLAG{devmaster_linux_explorer_novice}',
    points: 50
  },
  {
    id: 'ctf-2',
    title: '🔐 Challenge 2: Giải Mã Base64',
    desc: 'Admin đã lưu một đoạn chuỗi mã hóa trong "secret_b64.txt". Hãy giải mã nó.',
    hint: 'Dùng lệnh: cat secret_b64.txt | base64 -d hoặc base64 -d secret_b64.txt',
    flag: 'FLAG{devmaster_base64_decoded_success}',
    points: 100
  },
  {
    id: 'ctf-3',
    title: '🕵️ Challenge 3: Điều Tra Nhật Ký (Log Forensics)',
    desc: 'Có dấu vết đăng nhập trái phép trong nhật ký xác thực "/var/log/auth.log".',
    hint: 'Dùng lệnh "cat /var/log/auth.log" hoặc "grep FLAG /var/log/auth.log"',
    flag: 'FLAG{devmaster_log_analyst_pro}',
    points: 150
  },
  {
    id: 'ctf-4',
    title: '🌐 Challenge 4: Quét Cổng Mạng (Port Scanning)',
    desc: 'Quét máy chủ mục tiêu "192.168.1.100" để tìm các dịch vụ đang mở.',
    hint: 'Dùng lệnh: nmap 192.168.1.100',
    flag: 'FLAG{devmaster_nmap_port_8080_opened}',
    points: 150
  },
  {
    id: 'ctf-5',
    title: '💉 Challenge 5: Rò Rỉ Cấu Hình Web Server',
    desc: 'Kiểm tra mã nguồn web server trong "/var/www/html/config.php" để lấy mật khẩu bí mật.',
    hint: 'Dùng lệnh: cat /var/www/html/config.php',
    flag: 'FLAG{devmaster_sql_injection_master}',
    points: 200
  },
  {
    id: 'ctf-6',
    title: '🐚 Challenge 6: Truy Tìm Backdoor Ẩn',
    desc: 'Máy chủ mở một cổng lạ và có tiến trình chạy ngầm. Lần theo cổng đó để tìm tệp cấu hình của kẻ tấn công.',
    hint: 'Dùng: netstat -tuln → ps aux → cat tệp cấu hình mà tiến trình lạ đang dùng',
    flag: 'FLAG{devmaster_backdoor_port_4444_found}',
    points: 250
  }
];
