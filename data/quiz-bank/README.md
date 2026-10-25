# Ngân hàng câu hỏi

Mỗi bài có một tệp `<tech>/<level>/<lesson>.<language>.json`, phiên bản 1:

- 80 câu: 20 `easy`, 40 `medium`, 20 `hard`.
- Mỗi câu có ID duy nhất, `objective`, `question`, 4 `options`, một chỉ số `correct` từ 0 đến 3 và `explanation`. `code` là tùy chọn.
- `sourceHash` gắn với nội dung bài học. Nội dung bài thay đổi thì cần rà soát ngân hàng và cập nhật hash sau khi kiểm tra.
- `status: draft` chưa được xuất lên web. `approved` cần có ghi chú `review`.

Các kho tiếng Việt được biên soạn trực tiếp trong phiên Codex theo yêu cầu không dùng API sinh nội dung hoặc chi phí API riêng. Chưa có đủ kho cho 361 bài. Chạy `node scripts/quiz-bank.mjs inventory` để xem số liệu hiện tại. `validate` trả mã lỗi nếu còn bài thiếu, bản nháp hoặc lỗi dữ liệu; không đánh đồng đầy đủ cấu trúc với đúng kiến thức.

Đã có đủ 80 câu mỗi bài cho Cybersecurity (10/10), C++ (17/17), Python (16/16), Java (14/14), Node.js (13/13), React (13/13), HTML/CSS (13/13), SQL & NoSQL (12/12), Jest & Testing (12/12), Docker & Git (12/12), TypeScript (5/5), C# (12/12), Go (12/12), Rust (12/12), PHP (10/10), Swift (11/11), Kotlin (11/11), Ruby (9/9), Dart/Flutter (9/9), Bash/Shell (9/9), DSA & Algorithms (13/13), Zig (11/11), Solidity (8/8), Lua (8/8), R (8/8), Scala (8/8), Vue.js (10/10), Angular (10/10), Tailwind CSS (8/8), Django (9/9), MongoDB (8/8), GraphQL (7/7), Kubernetes (7/7), CI/CD (7/7), Nginx & Linux (7/7): tổng 361 bài / 28.880 câu tiếng Việt. Mỗi bài 20 dễ / 40 trung bình / 20 khó; mỗi đề 1 dễ + 2 trung bình + 1 khó.

Web ưu tiên ngân hàng đúng ngôn ngữ khi có. Mỗi đề lấy ngẫu nhiên 1 dễ + 2 trung bình + 1 khó, đảo thứ tự câu và lựa chọn, cập nhật đúng chỉ số đáp án. Tránh lặp đến hết chu kỳ 20 đề trong trạng thái của người học ở phiên này. Đổi bài rồi quay lại giữ nguyên đề và câu trả lời; cơ chế snapshot phiên hiện có giữ trạng thái khi tải lại trang. Chưa đồng bộ lịch sử qua thiết bị hoặc tab khác.

Đây là quiz luyện tập, hiện chấm phía trình duyệt theo luồng cũ: đáp án có trong JSON. Không dùng kết quả này làm căn cứ cấp chứng chỉ/xếp hạng có tính đối kháng. Bài/ngôn ngữ chưa có kho tiếp tục dùng nút AI cũ; nếu kho đã công bố bị lỗi thì báo lỗi, không tự chuyển sang gọi AI có phí.

## Biên soạn trực tiếp, không API

`scripts/author-quiz-bank.mjs` chỉ hỗ trợ ghi tệp và kiểm tra dữ liệu. Từng câu hỏi, lựa chọn nhiễu, đáp án, giải thích và độ khó đều được viết rõ ràng; helper không gọi mạng, không sinh biến thể hay chèn câu để bù số lượng. Nó từ chối ghi đè kho có sẵn.

Các bài Python đã viết có kiểm tra ví dụ tại `.impeccable/review/quiz-bank/verify-seed.py` và `verify-authored-python.py`: chỉ chạy ví dụ tự biên soạn đã liệt kê, không dùng làm trình chạy code tải về. Kiểm tra tự động đối chiếu đầu ra, kiểu lỗi và trạng thái; kiến thức mô tả vẫn cần rà soát nội dung.

`test_advanced_content.py` bổ sung kiểm tra cục bộ cho asyncio, pytest, Pydantic/FastAPI, descriptor, slots và tính tương đương phân đoạn benchmark. FastAPI dùng TestClient/ASGI trong tiến trình với dữ liệu RAM, không gọi server ngoài. Không suy rộng các kiểm tra này thành bằng chứng chịu tải production. Các lỗi đã nhận diện trong ví dụ giáo trình được nêu đúng trong câu hỏi, không sửa âm thầm nội dung bài gốc.

`verify-authored-cpp.py` biên dịch và chạy các ví dụ C++ đã liệt kê với `g++ -std=c++17 -pedantic-errors -Wall -Wextra`; bài Concepts/Metaprogramming dùng C++20, bài đa luồng thêm `-pthread`. Kiểm tra đối chiếu stdout hoặc lỗi biên dịch được kỳ vọng. Không chạy ví dụ undefined behavior hay vòng lặp vô hạn để đoán đáp án. Ví dụ file dùng tên tương đối riêng trong thư mục scratch từng câu; không truy cập file của người học hoặc gọi compiler từ xa. `index-cpp-evidence.py` đối chiếu source hiện tại với các lần chạy đã ghi và lập danh mục bằng chứng, không thay thế một lần biên dịch mới. Các câu mô tả vẫn cần rà soát kiến thức ngoài kiểm tra tự động.

Phần C++ Master nêu đúng giới hạn ví dụ nguồn: stack thiếu safe memory reclamation/ABA handling khi dùng đồng thời; phép trừ pointer trong pool cần tiền điều kiện ownership, không được coi kiểm tra index sau phép trừ là cách nhận pointer tùy ý an toàn. Output stack chỉ được kiểm tra một thread như ví dụ, chưa có tuyên bố đã chạy ASan/TSan hay chứng minh code nguồn sẵn sàng production.

`verify-authored-java.py` chỉ biên dịch/chạy các ví dụ Java tự biên soạn được liệt kê, dùng `javac --release 17` (Java21 cho Concurrency và Modern Java) và `java` trong cùng JDK local. Từng câu chạy trong thư mục scratch riêng với input/argument/expected output rõ; không gọi compiler từ xa. `index-java-evidence.py` đối chiếu source và stdout đã ghi với nội dung hiện hành. Không khái quát các nhận định về class/main hay pinning của Java21 cho mọi tính năng mới hơn hoặc preview. Câu hỏi nêu đúng việc tràn int trong `average` nguồn và kết quả NaN khi array rỗng.

Các câu Java Junior phân biệt interface hiện đại có default/static/private methods, record chỉ shallow immutable, Stream.toList khác cam kết của Collectors.toList, và lỗi biểu diễn trạng thái `Result.fail(null)` trong source khiến `isOk()` trả true. Đây là nhận diện hành vi nguồn trong câu hỏi, không sửa âm thầm bài gốc. Kiểm tra Java hiện có 312 ví dụ thuộc 10 bài; các câu mô tả vẫn cần đánh giá kiến thức riêng.

Java JPA và ba bài Spring được review theo source/đặc tả, chưa chạy integration JPA/Spring/JUnit/Mockito vì workspace chưa có bộ dependencies tương ứng. Các câu hỏi không tuyên bố đã kiểm chứng cấu hình production. Phần JPA phân biệt `javax.persistence` của nguồn với `jakarta.persistence`, JPQL chuẩn `SIZE(...)`, owning side và orphan removal. Phần Security không coi signed JWT là mã hóa payload hoặc stateless là miễn CSRF. Phần JVM nêu rõ cache nguồn bỏ qua size khi hit, check-then-put không atomic, weak reference không tự cleanup map; không hứa JFR zero overhead hay tốc độ virtual thread cố định.

`verify-authored-node.mjs` đã chạy 246 ví dụ thuộc mười bài Node.js với Node24.12. File mẫu có thư mục scratch riêng, đường dẫn tương đối cố định và dữ liệu nhỏ. Phần HTTP chỉ thử URL/data parsing hoặc `ServerResponse` trong RAM; không mở port hay gọi HTTP bên ngoài. `index-node-evidence.mjs` đối chiếu từng source, module format, arguments và stdout đã lưu, phân biệt hash ngân hàng lúc chạy với hash hiện tại khi chỉ sửa câu mô tả. Những kiểm tra này không chứng minh network integration hoặc sức chịu tải. Câu hỏi chỉ rõ router nguồn so raw URL nên không nhận query string, chưa giới hạn body/catch JSON error và có rủi ro decode UTF-8 theo từng chunk.

Node.js Junior có ba bài Express/JWT/Prisma. Express local là4.22.3, không suy error handling như5. Ví dụ Express chạy chọn lọc là semantics JavaScript/test double, JWT là header/encoding/await models; chưa có jsonwebtoken/bcryptjs/Prisma để chạy thư viện/DB integration. Prisma được review theo schema/query docs, phân biệt SQL với MongoDB và không chạy migrate trên dữ liệu thật. Phần nguồn cho body ghi đè ID, PATCH mass assignment, boolean query invalid và duplicate-email race trước await được nêu đúng trong câu hỏi.

Node.js Mid có Testing/Architecture/Realtime. `verify-authored-vitest.mjs` dùng Vitest5.0.2 local, kiểm tra đúng kết quả của26 ví dụ:19 pass và7 assertion cố ý fail như đáp án yêu cầu; không báo sai rằng cả26 test assertions đều pass. Report và source riêng được lưu trong `vitest-proof-build`, tóm tắt ở `vitest-evidence.json`. Bài Socket.IO review theo docs4, chưa chạy Socket.IO integration vì thư viện chưa cài. Room routing không tự là quyền, reconnect không tự durable replay và CORS không thay auth.

Node.js Senior/Master bổ sung microservices,performance,event loop,system design. Cache/proxy/broker/Pino được review theo source/docs, không kết nối Redis/queue/downstream thật. Ví dụ Worker hữu hạn dùng tối đa2 threads; không fork cluster tự restart hoặc benchmark4x. Event loop có `.cjs`/`.mjs` rõ và không ép thứ tự timer0/immediate ngoài I/O. Breaker chỉ được kiểm tra với hàm/clock giả trong process riêng: cooldown không là execution deadline, HALF-OPEN chưa giới hạn probes và late success có thể đóng circuit vừa mở. Không suy các kiểm tra này thành chứng minh1M concurrent users.

React hiện có đủ 13 bài. `verify-authored-react.mjs` đã kiểm tra 161 ví dụ với React/React DOM19.3.0, RTL16.3.3, Vitest5.0.2 và jsdom29.1.1. Module JSX của câu hỏi được giữ nguyên, assertion scaffolding riêng; không chạy app/server hay gọi API. `index-react-evidence.mjs` đối chiếu source, assertions, dependencies và báo cáo đã chạy. Routing review theo React Router6.30.3 và Next.js theo16.2.9 docs, chưa chạy framework integration vì dependencies chưa cài. Có thêm kiểm tra3 Children API facts và5 phép đếm filter hữu hạn, không là benchmark. Không coi callback chỉ log là cập nhật state, key là DOM attribute, hoặc abort là giải pháp đầy đủ cho request races.

HTML/CSS có đủ 13 bài. `verify-authored-html.mjs` kiểm tra60 ví dụ markup/DOM/selectors/name-description trong bốn bài với jsdom29.1.1; không bật scripts/resources. Index đối chiếu source và assertions với kết quả đã lưu, không là lượt chạy mới. Typography/Flexbox/Grid/Responsive được review theo units/conditions/spec, chưa là browser layout measurement. Main/h1 semantics, boolean attributes, specificity tuple/layers, root-size assumptions và HSL contrast được nêu đúng giới hạn.

HTML/CSS Senior/Master được review theo source và tài liệu: BEM/modules/tokens, cascade và component contracts, subgrid, typed properties, scroll/view transitions và Paint API. `verify-paint-model.mjs` kiểm tra 8 mô hình JavaScript hữu hạn về parseInt và số tâm chấm; không gọi browser worklet hay tải module. Spacing âm được phân tích tĩnh vì có nguy cơ vòng lặp không kết thúc. Đây chưa phải kiểm thử browser rendering, animation FPS hoặc accessibility conformance.

SQL/NoSQL có đủ 12 bài. CRUD/filtering/joins/subqueries/transactions/query-perf dùng SQLite3.49.1: 123 ví dụ với fixtures riêng trong bộ nhớ đã đạt. `verify-authored-sql.py` không kết nối DB thật; `index-sql-evidence.py` đối chiếu source/expected outcomes đã lưu, không là lượt chạy mới. Data types/constraints dùng source và docs PostgreSQL17; NoSQL review MongoDB manual. Chưa chạy PostgreSQL/MongoDB vì không có runtime trên PATH. Câu hỏi phân biệt dialect, CHECK/NULL, SERIAL gaps, decimal rounding/NaN, timestamp defaults, FK/indexes và những invariants nguồn chưa enforce.

TypeScript có đủ năm bài. `verify-authored-ts.mjs` đã kiểm tra 100 ví dụ bằng native CLI TypeScript7.0.2: 53 trường hợp bị từ chối đúng kỳ vọng và 47 trường hợp typecheck được; 47 kết quả emitted-JS gồm43 bình thường và4 lỗi runtime có chủ đích đúng đáp án. `verify-authored-ts-morph.mjs` bổ sung25 ví dụ API/AST/semantic/virtual-save/emit trong bộ nhớ bằngts-morph26.0.0 với compiler5.8.3 đi kèm. Hai toolchains được ghi riêng. Index đối chiếu source/expected/flags/logs,không là lượt chạy mới. Không gọi fetch/network hay chạy recursion vô hạn. Source builder có alias/overwrite/binding limitations; DeepPartial/parser có scope; compiler source mới đọc metadata,chưa sinh validator hoặc runtime augmentation.

Go hiện có 12/12 bài. verify-authored-go.mjs đã kiểm tra 270 ví dụ chọn lọc bằng Go1.26.1 local: 17 lỗi compiler đúng kỳ vọng và 253 kết quả chạy hữu hạn, gồm 4 panic đúng đáp án. verify-authored-go-testing.mjs kiểm tra 25 bộ file package/test, 10 thất bại đúng kỳ vọng. Hai benchmark chỉ chạy1x để kiểm tra harness, không suy tốc độ. HTTP/context fixtures trong RAM, không listen hoặc gọi DefaultClient.Do; goroutine fixtures drain/join hữu hạn, không chạy race detector hay deadlock. Task-local offline env; modern mux fixtures đặt httpmuxgo121=0, không sửa global config. Index đối chiếu provenance, không là lượt chạy mới. Xem go-references.md cho source limitations và phạm vi từng bài.

Rust hiện có 12/12 bài. verify-authored-rust.mjs kiểm tra 293 ví dụ chọn lọc bằng rustc1.93.1 local,edition2024,overflow checks bật: 65 compiler rejections và 228 kết quả chạy hữu hạn, gồm 15 process panic đúng kỳ vọng và 1 child-thread panic đã join, exit0 và giữ stderr. File examples dùng input nhỏ trong scratch riêng, không đọc file người dùng. Source/diagnostic codes/flags/input/log/artifacts được ghi và đối chiếu; index không là lượt biên dịch mới. Chưa gọi Cargo fetch,API,network,unsafe hay FFI. Trait source có UTF-8 byte slicing/stateful preview hazards; lifetimes không kéo dài owners; Rc/RefCell và iterator lazy/capture contracts được kiểm tra đúng phạm vi. Xem rust-references.md.

Tokio riêng: 20 ví dụ runtime/task/channel/time thực thi bằng Tokio1.52.3 cached,features rt/sync/time,runtime current_thread và Cargo --offline --frozen. Tất cả exit0,1 task panic được join và giữ diagnostic stderr đúng kỳ vọng. Khác với 293 native compiler cases ở trên;không chạy reqwest/HTTP/network. Gate --check đối chiếu607 cached source files cùng lock/log/artifacts mà không build lại hoặc ghi index.

C# hiện 12/12 bài. Selected 136 compiler cases dùng compiler14.8.10001.0 C#5/.NET Framework sẵn có: 8 expected rejects,128 finite exit0 outcomes gồm 22 caught exceptions. Source records/with/nullable/switch hiện đại theo docs,không giả đã chạy trên compiler cũ. --check đối chiếu exact source/spec/flags/compiler/log/artifact provenance trước publication;không SDK/API/download/ASP.NET/EF/provider/load claim. Xem csharp-references.md.

Danh mục input-snapshot theo dõi hash của toàn bộ giáo trình, các ngân hàng hiện có và 361 đường dẫn dự kiến, cùng các proof files đã chọn. Kiểm tra xuất bản từ chối snapshot cũ; sau chỉnh sửa phải ghi snapshot trước checkpoint. Đây là gate kiểm tra filesystem khi chạy, không phải background watcher.

## Công cụ chuẩn bị lô có sẵn — không sử dụng trong tác vụ hiện tại

Người dùng đã yêu cầu không gọi API sinh nội dung. Các công cụ dưới đây chỉ là khả năng chuẩn bị/import từ lần triển khai trước; không thực hiện bước gửi lô cho yêu cầu hiện tại.

Tạo bản kế hoạch hoàn toàn offline, chưa cần chọn model:

```powershell
node scripts/quiz-bank.mjs plan --output work/quiz-bank/plan-01
```

Kế hoạch chứa đầy đủ nội dung từng bài và ràng buộc. Mỗi bài chia thành 4 shard 20 câu: dễ, trung bình vận dụng, trung bình đọc code/tìm lỗi, khó. Chỉ lấy bài chưa có kho; không tự ghi đè kho cũ hoặc sinh lại bản nháp. Không gửi thông tin người học, hội thoại hoặc biến môi trường. Kế hoạch không có model nên không thể gửi.

Sau khi người dùng chọn chính xác model Anthropic và cho phép chi phí API, chuẩn bị spec trong thư mục mới:

```powershell
node scripts/quiz-bank.mjs prepare --model CHOSEN_API_MODEL --output work/quiz-bank/spec-01
```

`--params FILE.json` cho phép giữ nguyên cấu hình `max_tokens`, reasoning/thinking hay tham số native được người dùng chọn. Mặc định `max_tokens: 16384` cho mỗi shard. Đây là giới hạn output, không phải ước tính chi phí hoặc cam kết chất lượng. Cần xác nhận model hỗ trợ các tham số và giới hạn ngân sách ở tài khoản trước khi gửi.

Chuyển spec sang runner GOAT Batch (hai lệnh đầu không gửi API):

```powershell
node "C:/Users/Admin/Documents/Codex/tools/goat-batch/batch.cjs" prepare work/quiz-bank/spec-01/spec.json work/quiz-bank/job-01
node "C:/Users/Admin/Documents/Codex/tools/goat-batch/batch.cjs" submit work/quiz-bank/job-01
# Chỉ chạy sau khi được phép dùng model/ngân sách API riêng:
node "C:/Users/Admin/Documents/Codex/tools/goat-batch/batch.cjs" submit work/quiz-bank/job-01 --send
node "C:/Users/Admin/Documents/Codex/tools/goat-batch/batch.cjs" status work/quiz-bank/job-01
node "C:/Users/Admin/Documents/Codex/tools/goat-batch/batch.cjs" results work/quiz-bank/job-01
```

Nhập kết quả vào thư mục nháp riêng:

```powershell
node scripts/quiz-bank.mjs import --prepared work/quiz-bank/spec-01 --results work/quiz-bank/job-01/results.jsonl --output work/quiz-bank/drafts-01
```

Import kiểm tra toàn bộ tập kết quả trước khi ghi: đúng ID, không thiếu/trùng shard, `succeeded` và `end_turn`, JSON hợp lệ, đủ 80 câu/bài, đúng tỷ lệ, câu/lựa chọn trùng khớp chính xác và hash bài học còn đúng. Không thực thi code hoặc chỉ thị trong phản hồi. Kết quả luôn là `draft`; rà đúng kiến thức, chỉ một đáp án đúng, mức khó và trùng ý trước khi chuyển từng tệp đã duyệt vào kho với `status: approved` cùng ghi chú `review`. Không tự gửi lại lô lỗi, không tự thanh toán lần hai.

Build chỉ xuất kho hợp lệ và đã duyệt vào `web/public/quiz-bank/` với tên tệp có hash nội dung; bài học chỉ chứa metadata nhỏ. Nội dung kho được tải khi người học bắt đầu quiz, không gộp toàn bộ kho vào JavaScript.

PHP hiện 10/10 bài, 800 câu tự soạn. Đối chiếu PHP Manual, Laravel12 và Livewire3 docs; chưa có PHP/Laravel/DB/Pest/Swoole execution. php-content-review.mjs --check kiểm manifest nguồn/bank/recipe/tài liệu và tỷ lệ, không là chạy interpreter hoặc bằng chứng mọi đáp án đúng tự động. Known source gaps được ghi trong php-references.md; không gọi API sinh nội dung hoặc đo10x/chịu tải.

DSA hiện 13/13 bài. 231 selected finite C++17 fixtures dùng g++ local, exact source/spec/compiler/flags/log/artifact provenance. Không chạy UB, comparator sai, cycle traversal/free, network/benchmark/load. --check chỉ kiểm provenance, không là lượt chạy mới. Xem dsa-references.md.

Dart/Flutter hiện 9/9 bài, 720 câu tự soạn theo source và tài liệu. Chưa tìm thấy SDK trên PATH/các đường dẫn đã ghi; chưa chạy Dart/Flutter/native/DB/HTTP/profile. Manifest chỉ kiểm cấu trúc và provenance, không tự chứng minh mọi đáp án. Source gaps và version scope xem dart-references.md.

Ruby/Rails hiện 9/9 bài, 720 câu tự soạn theo source và tài liệu. Chưa tìm thấy interpreter trên PATH/các đường dẫn đã ghi; chưa chạy Ruby/Rails/native/DB/HTTP/profile. Manifest chỉ kiểm cấu trúc và provenance, không tự chứng minh mọi đáp án. Source gaps và version scope xem ruby-references.md.

Lua hiện 8/8 bài, 640 câu tự soạn theo source và tài liệu Lua5.4/Luau/LuaJIT/LÖVE/Roblox/LuaRocks. Chưa tìm thấy interpreter trên PATH/các đường dẫn đã ghi; chưa chạy Lua/C API/FFI/engine/rendering. Manifest kiểm cấu trúc/provenance, không tự chứng minh mọi đáp án. Source gaps và version scope xem lua-references.md.

Bash hiện 9/9 bài, 720 câu tự soạn theo từng source và tài liệu. Đã kiểm 116 ví dụ hữu hạn trên Bash5.3.15 có sẵn với stdout/stderr/status kỳ vọng, gồm6trường hợp nonzero có chủ đích. Không chạy script triển khai/SSH/Docker/cron/shred/flock hoặc ghi đường dẫn hệ thống. Giới hạn source, native fixture và provenance xem bash-references.md.

Vue hiện 10/10 bài, 800 câu tự soạn theo từng source và tài liệu Vue3/Router/Pinia/Nuxt3. Tám bài được rà soát nội dung độc lập; hai bài được tác giả native soạn trong file riêng và root tích hợp. Chưa chạy Vue/compiler/browser/network; manifest kiểm cấu trúc/provenance, không tự chứng minh mọi đáp án. Phạm vi phiên bản, source gaps và một lần từ chối truy vấn tài liệu Nuxt xem vue-references.md và vue-review-notes.json.

Angular10,Kotlin11,Swift11,Tailwind8 đã có40ngân hàng/3.200câu tự soạn và kiểm source/recipe. Angular800câu vàTailwind640câu được rà độc lập toàn bộ; Kotlin/Swift author review,root rà chọn lọc48câu và sửa12câu khó cuối theo source. Không chạy framework/compiler/browser/HTTP/DB/load; riêng7case CVA class factory đã có bằng chứng giới hạn. Xem framework-wave-review.json,framework-wave-notes.json và references từng môn;manifest kiểm provenance không tự chứng minh mọi đáp án/độ khó.

Django hiện9/9bài720câu tự soạn,source/docs-only Django5.2/DRF scope. Review độc lập đủ720stem/key/2160distractors/720giải thích;229prosefields được sửa/đọc lại và không finding mở.94recent recipes khớpJSON;chưa cài/chạyDjango/ORM/DB/cache/HTTP/asyncserver/Docker/Gunicorn/WhiteNoise/browser/load. Version/source gaps vàgiới hạn xem django-references.md,django-independent-review.json,django-review.json.

Mốc GraphQL/Docker/Kubernetes/Nginx/CI-CD gồm 40 ngân hàng / 3200 câu. Tác giả đối chiếu source/docs; GraphQL được root đọc toàn bộ7 nguồn và56 câu chọn lọc, sửa14 câu; Nginx3bài/240câu có review độc lập đầy đủ. Không gọi đây là review độc lập toàn bộ phần còn lại. Schema/source/recipe/draw checks và hashes hiện hành xem infrastructure-wave-review.json. Không chạy GraphQL/DB/network/Docker/cluster/Nginx/Linux/CI/deploy/load; không API tạo nội dung hay chi phí riêng.

Mốc đầy đủ 361 bài: nội dung được soạn trực tiếp trong phiên, không gọi API tạo câu hỏi. Độ khó là đánh giá biên tập theo bài, chưa hiệu chuẩn bằng dữ liệu người học. Phạm vi review, hash nguồn và kiểm tra phát hành xem `.impeccable/review/quiz-bank/result.md`; chỉ coi bản phát hành đã kiểm chứng khi báo cáo ghi các kiểm tra hiện hành đạt.
