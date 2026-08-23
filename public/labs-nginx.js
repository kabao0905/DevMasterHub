// Du lieu phong lab cho chu de Nginx & Linux.
// Moi phong lab gan voi mot bai hoc qua lessonKey = `${tech.id}.${level.id}.${lesson.id}`.
const LABS_NGINX = (() => {
  const CONF_MACDINH = [
    'user  nginx;',
    'worker_processes  auto;',
    '',
    'events {',
    '    worker_connections  1024;',
    '}',
    '',
    'http {',
    '    include       /etc/nginx/mime.types;',
    '    default_type  application/octet-stream;',
    '',
    '    server {',
    '        listen       80;',
    '        server_name  localhost;',
    '        root   /usr/share/nginx/html;',
    '        index  index.html;',
    '    }',
    '}'
  ].join('\n');

  const FS_INTRO = {
    '/': { type: 'dir', children: ['home', 'etc', 'usr', 'var'] },
    '/home': { type: 'dir', children: ['hacker'] },
    '/home/hacker': { type: 'dir', children: ['ghichu.txt'] },
    '/home/hacker/ghichu.txt': {
      type: 'file',
      content: 'Máy chủ vừa cài Nginx xong.\nChưa đổi gì so với cấu hình mặc định.'
    },

    '/etc': { type: 'dir', children: ['nginx'] },
    '/etc/nginx': { type: 'dir', children: ['nginx.conf', 'mime.types'] },
    '/etc/nginx/nginx.conf': { type: 'file', content: CONF_MACDINH },
    '/etc/nginx/mime.types': {
      type: 'file',
      content: 'types {\n    text/html  html htm;\n    text/css   css;\n}'
    },

    '/usr': { type: 'dir', children: ['share'] },
    '/usr/share': { type: 'dir', children: ['nginx'] },
    '/usr/share/nginx': { type: 'dir', children: ['html'] },
    '/usr/share/nginx/html': { type: 'dir', children: ['index.html'] },
    '/usr/share/nginx/html/index.html': {
      type: 'file',
      content: '<h1>Welcome to nginx!</h1>\n<p>Trang mặc định sau khi cài đặt.</p>'
    },

    '/var': { type: 'dir', children: ['log', 'www'] },
    '/var/log': { type: 'dir', children: ['nginx'] },
    '/var/log/nginx': { type: 'dir', children: ['access.log'] },
    '/var/log/nginx/access.log': {
      type: 'file',
      content: '127.0.0.1 - - [23/Aug/2026:09:14:02] "GET / HTTP/1.1" 200 615'
    },
    '/var/www': { type: 'dir', children: [] }
  };

  return {
    'nginx.newbie.intro': {
      lessonKey: 'nginx.newbie.intro',
      tenLab: 'Làm quen máy chủ Nginx vừa cài',
      fs: FS_INTRO,

      tasks: [
        {
          id: 'nginx-intro-1',
          cau: 'Tệp cấu hình chính của Nginx nằm ở đường dẫn nào?',
          kieu: 'traLoi',
          dapAn: ['/etc/nginx/nginx.conf'],
          diem: 10,
          goiY: [
            'Cấu hình của các dịch vụ hệ thống thường nằm trong /etc',
            'Thử: find / -name nginx.conf'
          ]
        },
        {
          id: 'nginx-intro-2',
          cau: 'Nginx đang lắng nghe ở cổng nào trong cấu hình mặc định?',
          kieu: 'traLoi',
          dapAn: ['80'],
          diem: 10,
          goiY: [
            'Mở tệp cấu hình ra đọc',
            'Tìm dòng bắt đầu bằng chỉ thị listen'
          ]
        },
        {
          id: 'nginx-intro-3',
          cau: 'Thư mục gốc (root) mà trang mặc định đang được phục vụ từ đó là gì?',
          kieu: 'traLoi',
          dapAn: ['/usr/share/nginx/html'],
          diem: 15,
          goiY: [
            'Vẫn trong tệp cấu hình, tìm chỉ thị root',
            'Thử: grep root /etc/nginx/nginx.conf'
          ]
        },
        {
          id: 'nginx-intro-4',
          cau: 'Tạo trang riêng tại /var/www/site/index.html rồi sửa cấu hình cho Nginx '
             + 'phục vụ trang đó. Chạy "nginx -t" để kiểm cú pháp và "curl localhost" '
             + 'để tự xác nhận trước khi bấm Kiểm tra.',
          kieu: 'trangThai',
          diem: 25,
          kiem: (fs) => {
            const trang = fs['/var/www/site/index.html'];
            if (!trang || trang.type !== 'file') {
              return { dat: false, nhan: 'Chưa thấy tệp /var/www/site/index.html' };
            }
            if (!String(trang.content || '').trim()) {
              return { dat: false, nhan: 'Tệp /var/www/site/index.html đang rỗng' };
            }
            const conf = fs['/etc/nginx/nginx.conf'];
            if (!conf) {
              return { dat: false, nhan: 'Không tìm thấy /etc/nginx/nginx.conf' };
            }
            if (!/^\s*root\s+\/var\/www\/site\s*;/m.test(String(conf.content || ''))) {
              return { dat: false, nhan: 'nginx.conf chưa có dòng "root /var/www/site;"' };
            }
            return { dat: true };
          },
          goiY: [
            'Dùng mkdir -p để tạo thư mục, rồi nano để soạn nội dung trang',
            'Mở nginx.conf bằng nano và sửa chỉ thị root trong khối server',
            'Nhớ giữ dấu chấm phẩy ở cuối dòng root'
          ]
        }
      ],

      // Day buoc giai mau, chay tuan tu. Chi dung cho bo kiem, khong hien cho hoc vien.
      // Phan tu la chuoi thi chay nhu lenh; la object {nano, noiDung} thi ghi tep
      // — dung thu ma nano goi khi hoc vien bam Luu.
      loiGiai: [
        'find / -name nginx.conf',
        'cat /etc/nginx/nginx.conf',
        'grep root /etc/nginx/nginx.conf',
        'mkdir -p /var/www/site',
        'echo "<h1>Trang cua toi</h1>" > /var/www/site/index.html',
        { nano: '/etc/nginx/nginx.conf',
          noiDung: CONF_MACDINH.replace('/usr/share/nginx/html', '/var/www/site') },
        'nginx -t',
        'curl localhost'
      ]
    }
  };
})();
