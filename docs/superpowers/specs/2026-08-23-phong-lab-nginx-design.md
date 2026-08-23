# Phòng lab có chấm cho bài học — thiết kế

**Ngày:** 2026-08-23
**Phạm vi lần này:** chủ đề Nginx & Linux (7 bài)

---

## 1. Vấn đề

Tab "Bài tập Thử thách" trong mỗi bài học hiện gồm ba thứ:

| Thành phần | Thực tế |
|---|---|
| Bài tập gốc | Một chuỗi `exercise` trong file dữ liệu. Bài *Nginx Overview & Installation* nguyên văn là `"Setup Nginx serve static website"`. |
| Đáp án của bạn | Ô văn bản tự do, gõ gì cũng được. |
| AI Chấm bài | Gửi đoạn văn bản cho AI, nhận về điểm 0–100 kèm nhận xét. |
| Chạy Code / Run | Chạy trong sandbox trình duyệt — vô nghĩa với Nginx, Docker, Linux. |

Đo trên toàn giáo trình: **419 bài tập trong 29 file dữ liệu, độ dài trung vị 57 ký tự, 61% ngắn hơn 60 ký tự.** Đề bài thực chất chỉ là một cái tiêu đề.

Hệ quả: không có môi trường để thao tác, không có gì để khám phá, không có đúng/sai. Học viên viết một đoạn văn nghe hợp lý là được điểm cao, dù chưa từng đụng vào Nginx. Việc chấm dựa trên **ý kiến** của AI về chất lượng đoạn văn, không dựa trên **sự thật** là học viên có làm được việc đó hay không.

Ngoại lệ duy nhất đang làm đúng là chủ đề Cybersecurity: `submit FLAG{...}` chấm đúng/sai tuyệt đối, không thương lượng.

## 2. Mục tiêu

Biến tab bài tập của 7 bài Nginx thành **phòng lab có chấm**, theo mô hình TryHackMe: học viên thao tác trên một máy giả lập, mỗi nhiệm vụ có kết quả đúng/sai khách quan, không thể qua bằng cách viết hay.

Thước đo thành công: **không thể hoàn thành một phòng lab mà không thật sự gõ lệnh và sửa file trong đó.**

## 3. Phi mục tiêu

- Không đụng tới 27 chủ đề còn lại. Bài nào chưa có lab vẫn dùng ô văn bản + AI chấm như hiện tại.
- Không dựng máy ảo hay container thật. Ràng buộc $0 và máy yếu — mọi thứ chạy trong trình duyệt.
- Không mô phỏng Linux đầy đủ. Chỉ giả lập đủ để 7 bài Nginx giải được.
- Không làm hệ thống xếp hạng, streak, huy hiệu trong lần này.

## 4. Kiến trúc

### 4.1 Một phòng lab

Một phòng lab là dữ liệu gắn với một bài học:

```js
{
  lessonKey: 'nginx/newbie/nginx-overview',
  fs: { /* hệ thống tệp riêng của lab này */ },
  tasks: [ /* 3–5 nhiệm vụ */ ],
  // Dãy lệnh giải mẫu: mảng chuỗi, chạy tuần tự qua terminal.
  // Chỉ dùng cho bộ kiểm, không bao giờ hiện cho học viên.
  loiGiai: ['mkdir -p /var/www/site', 'echo "Xin chào" > /var/www/site/index.html', ...]
}
```

### 4.2 Hai kiểu nhiệm vụ

**Kiểu `traLoi` — đi tìm giá trị.** Học viên lục trong máy tìm ra một giá trị rồi gõ vào ô đáp án. So khớp sau khi chuẩn hoá (bỏ khoảng trắng thừa, không phân biệt hoa thường). Cho phép khai báo nhiều biến thể chấp nhận được.

```js
{
  id: 'nginx-1-t2',
  cau: 'Nginx đang lắng nghe ở cổng nào trong cấu hình mặc định?',
  kieu: 'traLoi',
  dapAn: '80',
  diem: 10,
  goiY: ['Mở /etc/nginx/nginx.conf', 'Tìm dòng bắt đầu bằng listen']
}
```

**Kiểu `trangThai` — làm cho hệ thống đạt trạng thái.** Không có ô đáp án. Học viên bấm Kiểm tra, hàm `kiem` đọc thẳng hệ thống tệp và kết luận.

```js
{
  id: 'nginx-1-t4',
  cau: 'Cấu hình Nginx phục vụ trang tĩnh từ /var/www/site',
  kieu: 'trangThai',
  diem: 25,
  kiem: (fs) => {
    const trang = fs['/var/www/site/index.html'];
    const conf = fs['/etc/nginx/nginx.conf'];
    if (!trang) return { dat: false, nhan: 'Chưa thấy /var/www/site/index.html' };
    if (!conf || !/root\s+\/var\/www\/site\s*;/.test(conf.content))
      return { dat: false, nhan: 'nginx.conf chưa trỏ root vào /var/www/site' };
    return { dat: true };
  },
  goiY: ['Dùng mkdir -p rồi nano để tạo trang', 'Sửa chỉ thị root trong khối server']
}
```

Hàm `kiem` trả về `{ dat, nhan }` chứ không chỉ true/false — lời nhắn cho học viên biết còn thiếu gì, thay vì chỉ báo sai.

### 4.3 Nhiệm vụ mẫu cho bài 1

| # | Kiểu | Nội dung | Điểm |
|---|---|---|---|
| 1 | traLoi | Tệp cấu hình chính của Nginx nằm ở đường dẫn nào? → `/etc/nginx/nginx.conf` | 10 |
| 2 | traLoi | Nginx đang lắng nghe ở cổng nào? → `80` | 10 |
| 3 | traLoi | Thư mục gốc mà trang mặc định đang phục vụ? → `/usr/share/nginx/html` | 15 |
| 4 | trangThai | Tạo trang tại `/var/www/site/index.html` và sửa `root` trỏ vào đó | 25 |

Tổng 60 điểm. Nhiệm vụ `trangThai` đáng giá nhất vì nó là nhiệm vụ duy nhất không thể qua bằng cách đoán.

## 5. Thay đổi ở terminal

Terminal hiện tại chỉ đọc (`ls`, `cd`, `cat`, `grep`, `find`, `ps`, `netstat`, `base64`, `nmap`, `curl`, ...). Nhiệm vụ kiểu `trangThai` bắt buộc phải ghi được.

### 5.1 Nhóm lệnh ghi

| Lệnh | Ghi chú |
|---|---|
| `nano <file>` | Mở ô soạn thảo dạng cửa sổ nổi đè lên terminal, có nút Lưu / Hủy. **Không** mô phỏng giao diện nano thật với `Ctrl+O`/`Ctrl+X` — người mới sẽ mắc kẹt ở chỗ thoát ra. |
| `echo "..." > file` và `>>` | Ghi đè và ghi nối, cho người đã quen dòng lệnh. |
| `mkdir -p <path>` | Tạo thư mục, tự tạo cả cây cha. |
| `rm [-r] <path>` | Xoá. |
| `cp <a> <b>`, `mv <a> <b>` | Sao chép, di chuyển. |

`nano` là lệnh quan trọng nhất trong nhóm. `nginx.conf` dài hơn chục dòng; bắt người mới viết lại toàn bộ bằng `echo >` thì sai một dấu ngoặc là phải gõ lại từ đầu.

### 5.2 Nhóm lệnh riêng của Nginx

| Lệnh | Trả về |
|---|---|
| `nginx -t` | Đọc `nginx.conf` thật, kiểm cân bằng dấu ngoặc và dấu chấm phẩy, báo đúng/sai kèm số dòng lỗi. |
| `systemctl status nginx` | Trạng thái đang chạy / đã dừng. |
| `systemctl reload nginx` | Nạp lại cấu hình; nếu cú pháp sai thì báo lỗi và không nạp. |
| `curl localhost[:port][/path]` | **Tính từ trạng thái:** đọc `root` trong cấu hình hiện tại → mở file tương ứng → trả về nội dung. |

`curl` là điểm mấu chốt. Hiện tại nó trả về một đoạn HTML viết cứng trong code, gõ gì cũng ra y hệt. Trong phòng lab nó phải là **hàm tính từ trạng thái hệ thống**: sửa `root` sang chỗ khác thì `curl` đổi theo; cấu hình sai thì trả `502`; không có file thì trả `404`.

Đây là thứ tạo ra vòng lặp học: sửa → `nginx -t` → `reload` → `curl` → thấy kết quả đổi. Học viên tự biết mình đúng hay sai **trước khi** bấm Kiểm tra.

### 5.3 Hệ thống tệp nạp được theo lab

Hiện `VFS` là hằng số cấp module, dùng chung toàn website. Cần đổi thành biến nạp được:

- `let VFS = {}` cùng hàm `loadFs(duLieu)` đặt lại toàn bộ.
- Bộ tệp Săn cờ hiện tại trở thành lab mặc định của trang Thử thách.
- `renderStudio(id, { lab })` nạp hệ thống tệp của lab đó.

Đây là chỗ dễ làm vỡ thứ đang chạy tốt nhất. Bộ kiểm phải khẳng định trang Săn cờ vẫn giải được nguyên vẹn sau thay đổi này.

## 6. Giao diện

```
Tiến độ: 2/4 nhiệm vụ · 20/60 điểm   ███████░░░░░░░░░░░░░

✅ Nhiệm vụ 1 · 10đ   Tệp cấu hình chính nằm ở đâu?
                      → /etc/nginx/nginx.conf

▾  Nhiệm vụ 2 · 10đ   Nginx đang lắng nghe ở cổng nào?
                      [__________]  Kiểm tra
                      💡 Gợi ý 1/2

▸  Nhiệm vụ 3 · 15đ   Thư mục gốc của trang mặc định?
▸  Nhiệm vụ 4 · 25đ   Cấu hình phục vụ trang từ /var/www/site   [Kiểm tra]

┌─ hacker@nginx-box ─────────────────────────────┐
│ $ _                                             │
```

Quy tắc:

- **Mở hết mọi nhiệm vụ ngay từ đầu**, không khoá tuần tự. Khoá tuần tự chỉ gây bực khi ai đó kẹt giữa chừng; TryHackMe cũng mở hết.
- **Gợi ý phải bấm mới hiện**, từng cái một. Hiện sẵn là quay lại đúng vấn đề đang sửa.
- Nhiệm vụ đã xong thì thu gọn và hiện đáp án, để học viên xem lại được.

## 7. Lưu tiến độ

Dùng chung cơ chế `progress` trong `localStorage` đang có, thêm khoá `labProgress[lessonKey] = [danh sách id nhiệm vụ đã xong]`. Đóng máy giữa chừng, mở lại vẫn còn.

## 8. Các file

| File | Trạng thái | Việc |
|---|---|---|
| `public/labs-nginx.js` | mới | 7 phòng lab: hệ thống tệp, nhiệm vụ, lời giải mẫu |
| `public/lab-runner.js` | mới | Dựng danh sách nhiệm vụ, chấm đáp án, chạy hàm `kiem`, lưu tiến độ |
| `public/cyber-terminal.js` | sửa | Nạp hệ thống tệp theo lab, nhóm lệnh ghi, nhóm lệnh Nginx |
| `public/app.js` | sửa | Bài nào có lab thì gắn lab vào tab bài tập, thay ô văn bản |
| `public/style.css` | sửa | Kiểu hiển thị danh sách nhiệm vụ |

Tách `lab-runner.js` thành file riêng thay vì nhét vào `app.js` — file đó đã hơn 3500 dòng.

## 9. Cách kiểm chứng

Mỗi phòng lab kèm một **lời giải mẫu**: đúng dãy lệnh học viên phải gõ. Bộ kiểm chạy dãy lệnh đó qua terminal thật rồi khẳng định **cả 4 nhiệm vụ đều chuyển sang đạt**.

Đây là phép kiểm bắt buộc, vì một phòng lab có thể trông hoàn hảo mà vẫn không giải được — đúng như lỗi vừa gặp: AI ra đề dùng `netstat` trong khi terminal chưa cài lệnh đó. Kiểm "nhiệm vụ có hiển thị không", "ô đáp án có chấm không" thì đều xanh, mà bài vẫn tắc.

Danh sách phép kiểm:

1. **Giải được** — chạy lời giải mẫu, mọi nhiệm vụ phải đạt.
2. **Không qua được bằng cách gõ bừa** — chạy bộ kiểm trên hệ thống tệp ban đầu, mọi nhiệm vụ `trangThai` phải trượt.
3. **Mọi lệnh trong lời giải đều có thật** — đối chiếu với bảng `COMMANDS`, không lệnh nào rơi vào `command not found`.
4. **Không có mục treo** trong hệ thống tệp của lab (`ls` thấy mà `cd`/`cat` báo không tồn tại).
5. **Trang Săn cờ không hồi quy** — sau khi đổi `VFS` thành nạp được, 6 thử thách CTF vẫn giải được.
6. **Đáp án khớp dữ liệu thật** — với nhiệm vụ `traLoi`, giá trị trong `dapAn` phải thật sự xuất hiện trong hệ thống tệp của lab.

Kèm theo là **lỗi giả** để chứng minh bộ kiểm biết báo lỗi chứ không xanh vì chẳng kiểm gì: gỡ một lệnh khỏi terminal, sửa lệch một `dapAn`, xoá một file khỏi hệ thống tệp của lab.

## 10. Thứ tự làm

1. Đổi `VFS` thành nạp được theo lab; khẳng định trang Săn cờ không hồi quy.
2. Thêm nhóm lệnh ghi (`nano`, `echo >`, `mkdir`, `rm`, `cp`, `mv`).
3. Thêm nhóm lệnh Nginx (`nginx -t`, `systemctl`, `curl` tính từ trạng thái).
4. Viết `lab-runner.js` và giao diện danh sách nhiệm vụ.
5. Làm trọn **phòng lab bài 1**, chạy đủ bộ kiểm.
6. **Dừng lại đưa người dùng xem.** Ưng thì làm nốt 6 bài còn lại.

Bước 6 là có chủ đích: tránh đổ công vào cả 7 bài rồi mới biết mô hình không đúng ý.

## 11. Rủi ro

| Rủi ro | Cách giảm |
|---|---|
| Đổi `VFS` làm vỡ trang Săn cờ đang chạy tốt | Giữ bộ tệp cũ làm lab mặc định; phép kiểm số 5 chặn hồi quy |
| Giả lập `nginx -t` quá sơ sài, báo đúng khi cấu hình thật ra sai | Chỉ kiểm cân bằng ngoặc và dấu chấm phẩy, và nói rõ trong bài rằng đây là bản giả lập rút gọn |
| Học viên gõ đáp án đúng nhưng khác định dạng (`80/tcp` thay vì `80`) | Cho phép khai báo nhiều biến thể chấp nhận được; chuẩn hoá trước khi so khớp |
| 6 bài còn lại cần lệnh mà bài 1 chưa cần | Chấp nhận; thêm dần theo từng bài, phép kiểm số 3 sẽ phát hiện thiếu |
