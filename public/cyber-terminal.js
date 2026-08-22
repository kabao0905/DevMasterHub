const CyberTerminal = (() => {
  let currentDir = '/home/hacker';
  let history = [];
  let historyIdx = -1;
  let capturedFlags = new Set();
  let userScore = 0;

  const VFS = {
    '/': { type: 'dir', children: ['home', 'etc', 'var', 'bin', 'flag'] },
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
    '/etc': { type: 'dir', children: ['passwd', 'shadow', 'hosts'] },
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
    '/var': { type: 'dir', children: ['log', 'www'] },
    '/var/log': { type: 'dir', children: ['auth.log', 'nginx.log'] },
    '/var/log/auth.log': {
      type: 'file',
      content: 'Feb 20 14:02:11 dev-srv sshd[124]: Failed password for invalid user admin from 10.0.0.5\nFeb 20 14:03:00 dev-srv sshd[125]: Accepted password for root with token FLAG{devmaster_log_analyst_pro}'
    },
    '/var/www': { type: 'dir', children: ['html'] },
    '/var/www/html': {
      type: 'dir',
      children: ['index.php', 'config.php']
    },
    '/var/www/html/config.php': {
      type: 'file',
      content: '<?php\n$db_host = "localhost";\n$db_user = "root";\n$db_pass = "SQLi_FLAG{devmaster_sql_injection_master}";\n?>'
    }
  };

  const CHALLENGES = [
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
    }
  ];

  function executeCommand(input) {
    const raw = input.trim();
    if (!raw) return '';
    history.push(raw);
    historyIdx = history.length;

    const parts = raw.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        return `
📋 CÁC LỆNH HỆ THỐNG ĐƯỢC HỖ TRỢ:
  • ls [-la] [path]        : Liệt kê danh sách thư mục / tệp tin
  • cd <path>              : Chuyển đổi thư mục làm việc
  • pwd                    : Hiển thị đường dẫn thư mục hiện tại
  • cat <file>             : Đọc nội dung tệp tin
  • grep <pattern> <file>  : Tìm kiếm chuỗi trong tệp tin
  • base64 -d <file|str>   : Giải mã chuỗi Base64
  • nmap <target>          : Quét cổng dịch vụ mạng
  • curl <url>             : Gửi request HTTP tới web server
  • whoami / id            : Hiển thị người dùng hiện tại
  • uname -a               : Xem thông tin kernel Linux ảo
  • clear                  : Xóa màn hình terminal
  • submit <flag>          : Nộp cờ CTF để nhận điểm XP
`;

      case 'pwd':
        return currentDir;

      case 'whoami':
        return 'hacker (uid=1000 gid=1000 groups=hacker,sudo)';

      case 'id':
        return 'uid=1000(hacker) gid=1000(hacker) groups=1000(hacker),27(sudo)';

      case 'uname':
        return 'Linux devmaster-cyber-box 6.8.0-devmaster-x86_64 #1 SMP GNU/Linux';

      case 'clear':
        setTimeout(() => {
          const termBody = document.getElementById('terminal-lines');
          if (termBody) termBody.innerHTML = '';
        }, 10);
        return '';

      case 'ls': {
        const targetPath = args[0] && !args[0].startsWith('-') ? resolvePath(args[0]) : currentDir;
        const entry = VFS[targetPath];
        if (!entry) return `ls: cannot access '${args[0] || targetPath}': No such file or directory`;
        if (entry.type === 'file') return args[0] || targetPath;
        const list = entry.children || [];
        return list.map(item => {
          const itemPath = targetPath === '/' ? '/' + item : targetPath + '/' + item;
          const isDir = VFS[itemPath]?.type === 'dir';
          return isDir ? `📁 [1;34m${item}/[0m` : `📄 ${item}`;
        }).join('   ');
      }

      case 'cd': {
        const target = args[0] || '/home/hacker';
        const newPath = resolvePath(target);
        if (VFS[newPath] && VFS[newPath].type === 'dir') {
          currentDir = newPath;
          return '';
        }
        return `bash: cd: ${target}: No such file or directory`;
      }

      case 'cat': {
        if (!args[0]) return 'cat: missing operand';
        const filePath = resolvePath(args[0]);
        const file = VFS[filePath];
        if (!file) return `cat: ${args[0]}: No such file or directory`;
        if (file.type === 'dir') return `cat: ${args[0]}: Is a directory`;
        return file.content || '';
      }

      case 'grep': {
        if (args.length < 2) return 'grep: usage: grep <pattern> <file>';
        const pattern = args[0];
        const filePath = resolvePath(args[1]);
        const file = VFS[filePath];
        if (!file || file.type === 'dir') return `grep: ${args[1]}: No such file`;
        const lines = (file.content || '').split('\n');
        const matched = lines.filter(l => l.includes(pattern));
        return matched.join('\n') || `No matches found for "${pattern}"`;
      }

      case 'base64': {
        if (args[0] === '-d' || args[0] === '--decode') {
          const target = args[1];
          if (!target) return 'base64: missing operand';
          let strToDecode = target;
          const filePath = resolvePath(target);
          if (VFS[filePath] && VFS[filePath].content) {
            strToDecode = VFS[filePath].content.trim();
          }
          try {
            return atob(strToDecode);
          } catch(e) {
            return 'base64: invalid input string';
          }
        }
        return 'base64: usage: base64 -d <string|file>';
      }

      case 'nmap': {
        const target = args[0] || '127.0.0.1';
        return `
Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-20 20:00 ICT
Nmap scan report for ${target}
Host is up (0.00042s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.2p1
80/tcp   open  http    Apache httpd 2.4.58
8080/tcp open  http    DevMaster-API-Gateway (FLAG{devmaster_nmap_port_8080_opened})
3306/tcp open  mysql   MySQL 8.0.36

Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds
`;
      }

      case 'curl': {
        const url = args[0] || 'http://localhost';
        return `
HTTP/1.1 200 OK
Server: DevMaster-Server/2026
Content-Type: text/html; charset=UTF-8
X-Flag-Header: FLAG{devmaster_curl_headers_found}

<!DOCTYPE html>
<html>
<body>
  <h1>DevMaster Target Portal</h1>
  <p>Secure Portal System v2.1</p>
</body>
</html>
`;
      }

      case 'submit': {
        const submittedFlag = args[0];
        if (!submittedFlag) return 'submit: usage: submit FLAG{...}';
        return checkFlag(submittedFlag);
      }

      default:
        return `bash: ${cmd}: command not found. Gõ "help" để xem danh sách lệnh.`;
    }
  }

  function resolvePath(p) {
    if (p.startsWith('/')) return normalize(p);
    if (p === '~') return '/home/hacker';
    if (p.startsWith('~/')) return normalize('/home/hacker/' + p.substring(2));
    const full = currentDir === '/' ? '/' + p : currentDir + '/' + p;
    return normalize(full);
  }

  function normalize(pathStr) {
    const parts = pathStr.split('/').filter(Boolean);
    const stack = [];
    for (const seg of parts) {
      if (seg === '.') continue;
      if (seg === '..') { if (stack.length) stack.pop(); }
      else stack.push(seg);
    }
    return '/' + stack.join('/');
  }

  function checkFlag(flag) {
    const match = CHALLENGES.find(c => c.flag.trim() === flag.trim());
    if (match) {
      if (capturedFlags.has(match.id)) {
        return `⚠️ Cờ "${flag}" đã được nộp trước đó!`;
      }
      capturedFlags.add(match.id);
      userScore += match.points;
      updateScoreUI();
      return `🎉 CHÍNH XÁC! Bạn đã mở khóa: ${match.title} (+ ${match.points} XP)!`;
    }
    return `❌ Cờ không hợp lệ: "${flag}". Hãy kiểm tra lại định dạng!`;
  }

  function updateScoreUI() {
    const scoreEl = document.getElementById('ctf-user-score');
    if (scoreEl) scoreEl.textContent = userScore;
    const countEl = document.getElementById('ctf-flag-count');
    if (countEl) countEl.textContent = capturedFlags.size + '/' + CHALLENGES.length;

    CHALLENGES.forEach(c => {
      const card = document.getElementById(`card-${c.id}`);
      if (card && capturedFlags.has(c.id)) {
        card.classList.add('solved');
        const badge = card.querySelector('.ctf-badge');
        if (badge) badge.textContent = '✅ ĐÃ GIẢI';
      }
    });
  }

  /**
   * @param {string} containerId
   * @param {object} opts { challenges: true|false }
   *   Trong BAI HOC chi hien terminal de lam dung bai tap cua bai do.
   *   Bang thu thach CTF thuoc ve muc "Thu thach" rieng, khong lien quan
   *   toi bai dang hoc nen khong hien o day.
   */
  function renderStudio(containerId, opts) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const showChallenges = !opts || opts.challenges !== false;

    container.innerHTML = `
      <div class="cyber-studio-layout${showChallenges ? '' : ' terminal-only'}">
        <!-- 1. LEFT: Terminal Window (xterm style) -->
        <div class="cyber-terminal-panel">
          <div class="terminal-window-header">
            <div class="term-dots">
              <span class="term-dot dot-red"></span>
              <span class="term-dot dot-yellow"></span>
              <span class="term-dot dot-green"></span>
            </div>
            <span class="term-title">⚡ hacker@devmaster-box: <span id="term-pwd">${currentDir}</span></span>
          </div>
          <div class="terminal-screen" id="terminal-screen" onclick="document.getElementById('term-cmd-input')?.focus()">
            <div class="term-banner">
  ╔════════════════════════════════════════════════════════════════════╗
  ║   🛡️ DEVMASTER VIRTUAL LINUX LAB & CYBERSECURITY TERMINAL (CTF)    ║
  ║   Gõ "help" để xem trợ giúp hoặc "submit FLAG{...}" để nộp cờ.     ║
  ╚════════════════════════════════════════════════════════════════════╝
            </div>
            <div id="terminal-lines"></div>
            <div class="terminal-input-row">
              <span class="term-prompt">hacker@devmaster:<span class="term-path" id="term-prompt-path">${currentDir}</span>$</span>
              <input type="text" id="term-cmd-input" autocomplete="off" spellcheck="false" autofocus />
            </div>
          </div>
        </div>

        ${!showChallenges ? '' : `
        <!-- 2. RIGHT: CTF Challenges & Scoreboard -->
        <div class="cyber-ctf-panel">
          <div class="ctf-header">
            <h3>🚩 Bảng Thử Thách CTF & Săn Cờ</h3>
            <div class="ctf-scoreboard">
              <span>Điểm XP: <strong id="ctf-user-score" style="color:#58a6ff">${userScore}</strong></span>
              <span>Cờ đã săn: <strong id="ctf-flag-count" style="color:#3fb950">${capturedFlags.size}/${CHALLENGES.length}</strong></span>
            </div>
          </div>

          <div class="ctf-submit-box">
            <input type="text" id="ctf-manual-flag" placeholder="Nhập cờ FLAG{...} ở đây..." onkeydown="if(event.key==='Enter')CyberTerminal.submitFlagInput()" />
            <button onclick="CyberTerminal.submitFlagInput()">Nộp cờ</button>
          </div>

          <div class="ctf-challenges-list">
            ${CHALLENGES.map(c => `
              <div class="ctf-card ${capturedFlags.has(c.id) ? 'solved' : ''}" id="card-${c.id}">
                <div class="ctf-card-header">
                  <span class="ctf-title">${c.title}</span>
                  <span class="ctf-badge">${capturedFlags.has(c.id) ? '✅ ĐÃ GIẢI' : '+' + c.points + ' XP'}</span>
                </div>
                <p class="ctf-desc">${c.desc}</p>
                <div class="ctf-hint">💡 Gợi ý: <code>${c.hint}</code></div>
              </div>
            `).join('')}
          </div>
        </div>`}
      </div>
    `;

    bindTerminalInput();
  }

  function bindTerminalInput() {
    const input = document.getElementById('term-cmd-input');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value;
        input.value = '';
        const linesEl = document.getElementById('terminal-lines');
        if (linesEl) {
          const promptHtml = `<div class="term-line"><span class="term-prompt">hacker@devmaster:${currentDir}$</span> <span class="term-typed">${escapeHtml(val)}</span></div>`;
          const result = executeCommand(val);
          const outputHtml = result ? `<pre class="term-output">${escapeHtml(result)}</pre>` : '';
          linesEl.innerHTML += promptHtml + outputHtml;

          const screen = document.getElementById('terminal-screen');
          if (screen) screen.scrollTop = screen.scrollHeight;

          const pwdEl = document.getElementById('term-pwd');
          if (pwdEl) pwdEl.textContent = currentDir;
          const promptPath = document.getElementById('term-prompt-path');
          if (promptPath) promptPath.textContent = currentDir;
        }
      } else if (e.key === 'ArrowUp') {
        if (history.length && historyIdx > 0) {
          historyIdx--;
          input.value = history[historyIdx] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < history.length - 1) {
          historyIdx++;
          input.value = history[historyIdx] || '';
        } else {
          historyIdx = history.length;
          input.value = '';
        }
      }
    });
  }

  function submitFlagInput() {
    const input = document.getElementById('ctf-manual-flag');
    const flag = input?.value?.trim();
    if (!flag) return;
    const res = checkFlag(flag);
    alert(res);
    input.value = '';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return {
    renderStudio,
    executeCommand,
    checkFlag,
    submitFlagInput
  };
})();

if (typeof window !== 'undefined') {
  window.CyberTerminal = CyberTerminal;
}
