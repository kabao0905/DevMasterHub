import type { SupabaseLike } from './auth';
import { dongPhongBi } from './phong-bi';

export type KetQuaChay =
  | { stdout: string; stderr: string; maThoat: number; dichVu: string; trinhBienDich?: string; quaGio?: number }
  | { bienDichLoi: string; dichVu: string; trinhBienDich?: string };

type NoiChay = 'trinh-duyet' | 'may-chu';
export type NgonNguChay = { id: string; ten: string; noi: NoiChay; duPhong: boolean };

const NGON_NGU: Record<string, { ten: string; noi: NoiChay; duPhong?: boolean }> = {
  python: { ten: 'Python', noi: 'trinh-duyet', duPhong: true },
  sql: { ten: 'PostgreSQL', noi: 'trinh-duyet' },
  lua: { ten: 'Lua', noi: 'trinh-duyet', duPhong: true },
  cpp: { ten: 'C++', noi: 'may-chu' },
  c: { ten: 'C', noi: 'may-chu' },
  java: { ten: 'Java', noi: 'may-chu' },
  go: { ten: 'Go', noi: 'may-chu' },
  rust: { ten: 'Rust', noi: 'may-chu' },
  csharp: { ten: 'C#', noi: 'may-chu' },
  kotlin: { ten: 'Kotlin', noi: 'may-chu' },
  swift: { ten: 'Swift', noi: 'may-chu' },
  dart: { ten: 'Dart', noi: 'may-chu' },
  scala: { ten: 'Scala', noi: 'may-chu' },
  zig: { ten: 'Zig', noi: 'may-chu' },
  ruby: { ten: 'Ruby', noi: 'may-chu' },
  php: { ten: 'PHP', noi: 'may-chu' },
  bash: { ten: 'Bash', noi: 'may-chu' },
  r: { ten: 'R', noi: 'may-chu' },
  haskell: { ten: 'Haskell', noi: 'may-chu' },
  perl: { ten: 'Perl', noi: 'may-chu' },
  elixir: { ten: 'Elixir', noi: 'may-chu' }
};

const BI_DANH: Record<string, string> = {
  'c++': 'cpp', cc: 'cpp', cxx: 'cpp', 'c#': 'csharp', cs: 'csharp', py: 'python', python3: 'python', golang: 'go',
  rs: 'rust', kt: 'kotlin', kts: 'kotlin', rb: 'ruby', sh: 'bash', shell: 'bash', zsh: 'bash', postgresql: 'sql',
  postgres: 'sql', psql: 'sql', hs: 'haskell', pl: 'perl', ex: 'elixir', exs: 'elixir'
};

export function ngonNguChay(lang?: string): NgonNguChay | null {
  const k = (lang ?? '').trim().toLowerCase();
  const id = BI_DANH[k] ?? k;
  const n = Object.prototype.hasOwnProperty.call(NGON_NGU, id) ? NGON_NGU[id] : null;
  return n ? { id, ten: n.ten, noi: n.noi, duPhong: !!n.duPhong } : null;
}

const THU_VIEN: Record<string, [RegExp, string][]> = {
  python: [
    [/^\s*(?:from|import)\s+django\b/m, 'Django'], [/^\s*(?:from|import)\s+fastapi\b/m, 'FastAPI'], [/^\s*(?:from|import)\s+flask\b/m, 'Flask'],
    [/^\s*(?:from|import)\s+pytest\b/m, 'pytest'], [/^\s*(?:from|import)\s+pydantic\b/m, 'Pydantic'], [/^\s*(?:from|import)\s+(?:numpy|pandas)\b/m, 'NumPy/pandas'],
    [/^\s*(?:from|import)\s+(?:requests|httpx|aiohttp)\b/m, 'HTTP client'], [/^\s*(?:from|import)\s+(?:sqlalchemy|celery|redis)\b/m, 'SQLAlchemy/Celery/Redis']
  ],
  java: [
    [/org\.springframework|@SpringBootApplication|@RestController|@Configuration|@Service\b|@Bean\b/, 'Spring Boot'], [/javax\.persistence|jakarta\.persistence|@Entity\b/, 'JPA/Hibernate'],
    [/org\.junit|@Test\b|Mockito/, 'JUnit/Mockito'], [/\blombok\b/, 'Lombok']
  ],
  kotlin: [
    [/@Composable|androidx\.|ViewModel\(\)|@Entity\(|@Dao\b/, 'Android/Jetpack'], [/kotlinx\.coroutines/, 'kotlinx.coroutines'], [/io\.ktor/, 'Ktor'],
    [/io\.kotest|io\.mockk|app\.cash\.turbine/, 'Kotest/MockK'], [/@Serializable|kotlinx\.serialization/, 'kotlinx.serialization'], [/\bSharedPreferences\b/, 'Android']
  ],
  swift: [[/import\s+SwiftUI\b/, 'SwiftUI'], [/import\s+SwiftData\b/, 'SwiftData'], [/import\s+(?:XCTest|UIKit|ComposableArchitecture)\b/, 'Xcode/iOS SDK'], [/import\s+PackageDescription\b/, 'Swift Package Manager']],
  dart: [[/package:flutter/, 'Flutter'], [/package:(?!flutter)\w+/, 'pub package'], [/\b(?:StatelessWidget|StatefulWidget|CustomPainter|BuildContext)\b/, 'Flutter']],
  csharp: [
    [/Microsoft\.AspNetCore|\bWebApplication\b|\[ApiController\]|ControllerBase|\bHub\b|GreeterBase|IMiddleware|RequestDelegate/, 'ASP.NET Core'],
    [/\bDbContext\b|EntityFrameworkCore/, 'Entity Framework Core'], [/\bMediatR\b|IRequestHandler|IRequest</, 'MediatR'], [/BenchmarkDotNet/, 'BenchmarkDotNet'], [/\bAggregateRoot\b/, 'DDD framework']
  ],
  php: [[/Illuminate\\|extends\s+(?:Controller|Model|ServiceProvider|FormRequest|JsonResource|Component)\b|ShouldQueue|Route::/, 'Laravel'], [/Swoole|vendor\/autoload/, 'Composer packages']],
  ruby: [[/ApplicationRecord|ApplicationController|ActiveRecord|ActiveSupport|\bRails\.|RSpec|\bdescribe\s+\w+.*\bdo\b/, 'Ruby on Rails']],
  rust: [[/^\s*use\s+(tokio|reqwest|serde|axum|wasm_bindgen|actix_web|sqlx|clap|rand)\b/m, 'crates (tokio/serde/axum…)']],
  go: [[/"(?:github\.com|golang\.org\/x|google\.golang\.org|gorm\.io|go\.uber\.org)\//, 'Go modules']],
  scala: [[/org\.apache\.spark|akka\.|cats\.|zio\./, 'Spark/Akka/Cats']],
  lua: [[/\blove\.(?:load|update|draw)\b/, 'LÖVE']],
  r: [[/library\((?:shiny|ggplot2|dplyr|tidyverse|caret|randomForest|plumber|tidymodels)\)/, 'CRAN packages']],
  c: [[/#include\s*[<"](?:lua|lauxlib|lualib)\.h[>"]/, 'Lua C API']],
  bash: [[/^\s*(?:sudo\s+)?(?:docker|docker-compose|kubectl|systemctl|apt(?:-get)?|journalctl|crontab|nginx)\b/m, 'docker/systemctl…']]
};

const CAN_MAIN: Record<string, RegExp> = {
  java: /\bstatic\s+(?:public\s+)?void\s+main\s*\(/,
  kotlin: /\bfun\s+main\s*\(/,
  go: /\bfunc\s+main\s*\(\s*\)/,
  rust: /\bfn\s+main\s*\(/,
  c: /\bmain\s*\(/,
  cpp: /\bmain\s*\(/,
  dart: /\bmain\s*\(/,
  csharp: /\bstatic\s+(?:async\s+)?(?:void|int|Task(?:<int>)?)\s+Main\s*\(|^(?:var|foreach|for|if|while|await|Console)\b|^(?!(?:using|namespace|public|internal|private|protected|sealed|abstract|static|partial|class|record|struct|interface|enum)\b)[A-Za-z_].*;\s*$/m,
  scala: /extends\s+App\b|\bdef\s+main\s*\(|@main\b/,
  zig: /\bpub\s+fn\s+main\s*\(/
};

export type CanhBaoChay = { loai: 'thu-vien'; ten: string } | { loai: 'thieu-main' };

export function canhBaoChay(lang: string | undefined, code: string): CanhBaoChay | null {
  const n = ngonNguChay(lang);
  if (!n) return null;
  for (const [re, ten] of THU_VIEN[n.id] ?? []) if (re.test(code)) return { loai: 'thu-vien', ten };
  const main = CAN_MAIN[n.id];
  if (main && !main.test(code)) return { loai: 'thieu-main' };
  return null;
}

const THOI_GIAN_CHAY_MS = 15000;
const THOI_GIAN_TAI_MS = 120000;

type TinWorker = { id: number; giaiDoan?: 'chay'; loiTai?: string; stdout?: string; stderr?: string; maThoat?: number };
let worker: Worker | null = null;
let soId = 0;
const daTai = new Set<string>();

function layWorker() {
  if (!worker) worker = new Worker('/chay-code-worker.js', { type: 'module' });
  return worker;
}

function huyWorker() {
  worker?.terminate();
  worker = null;
  daTai.clear();
}

export class LoiTaiTrinhDuyet extends Error {}

function chayTrongTrinhDuyet(lang: string, code: string, stdin: string, signal?: AbortSignal, khiChay?: () => void): Promise<KetQuaChay> {
  return new Promise((resolve, reject) => {
    const w = layWorker();
    const id = ++soId;
    let hen: ReturnType<typeof setTimeout>;
    const xong = () => {
      clearTimeout(hen);
      w.removeEventListener('message', nghe);
      w.removeEventListener('error', loi);
      signal?.removeEventListener('abort', huy);
    };
    const quaGio = (ms: number, laTai: boolean) => {
      clearTimeout(hen);
      hen = setTimeout(() => {
        xong();
        huyWorker();
        if (laTai) reject(new LoiTaiTrinhDuyet('timeout'));
        else resolve({ stdout: '', stderr: '', maThoat: 124, dichVu: 'trinh-duyet', quaGio: ms / 1000 });
      }, ms);
    };
    const nghe = (ev: MessageEvent<TinWorker>) => {
      const d = ev.data;
      if (!d || d.id !== id) return;
      if (d.giaiDoan === 'chay') {
        daTai.add(lang);
        khiChay?.();
        quaGio(THOI_GIAN_CHAY_MS, false);
        return;
      }
      xong();
      if (d.loiTai) reject(new LoiTaiTrinhDuyet(d.loiTai));
      else resolve({ stdout: d.stdout ?? '', stderr: d.stderr ?? '', maThoat: d.maThoat ?? 0, dichVu: 'trinh-duyet' });
    };
    const loi = (ev: ErrorEvent) => {
      xong();
      huyWorker();
      reject(new LoiTaiTrinhDuyet(ev.message || 'worker'));
    };
    const huy = () => {
      xong();
      huyWorker();
      reject(new DOMException('Aborted', 'AbortError'));
    };
    if (signal?.aborted) { huy(); return; }
    w.addEventListener('message', nghe);
    w.addEventListener('error', loi);
    signal?.addEventListener('abort', huy);
    quaGio(THOI_GIAN_TAI_MS, true);
    w.postMessage({ id, lang, code, stdin });
  });
}

export const daTaiTrinhDuyet = (lang: string) => daTai.has(lang);

async function chayTrenMayChu(client: SupabaseLike, lang: string, code: string, stdin: string, signal?: AbortSignal): Promise<KetQuaChay> {
  const { data } = await client.auth.getSession();
  const token = data.session?.access_token;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let r: Response;
  try {
    r = await fetch('/api/run', { method: 'POST', headers, body: dongPhongBi({ lang, code, stdin }), signal });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw new Error('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
  }
  const json = (await r.json().catch(() => null)) as (KetQuaChay & { error?: string }) | null;
  if (!r.ok || !json) throw new Error(json?.error || `Lỗi máy chủ (${r.status})`);
  return json;
}

export async function chayCode(client: SupabaseLike, lang: string, code: string, stdin = '', signal?: AbortSignal, khiChay?: () => void): Promise<KetQuaChay> {
  const n = ngonNguChay(lang);
  if (!n) throw new Error('Ngôn ngữ này chưa hỗ trợ chạy thử');
  if (n.noi === 'may-chu') return chayTrenMayChu(client, n.id, code, stdin, signal);
  try {
    return await chayTrongTrinhDuyet(n.id, code, stdin, signal, khiChay);
  } catch (e) {
    if (!(e instanceof LoiTaiTrinhDuyet)) throw e;
    if (n.duPhong) return chayTrenMayChu(client, n.id, code, stdin, signal);
    throw new Error(`Không tải được ${n.ten} trong trình duyệt. Kiểm tra mạng rồi thử lại.`);
  }
}
