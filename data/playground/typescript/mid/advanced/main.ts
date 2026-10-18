type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

type IsString<T> = T extends string ? true : false;
const a: IsString<'hello'> = true;
const b: IsString<42> = false;

type HttpMethod = 'GET' | 'POST';
type Route = `${HttpMethod} /api/${string}`;
const route: Route = 'GET /api/users';

type USD = number & { __brand: 'USD' };
type EUR = number & { __brand: 'EUR' };
const usd = (n: number) => n as USD;
const eur = (n: number) => n as EUR;
const addUSD = (x: USD, y: USD) => (x + y) as USD;

type Events = {
  login: { userId: string };
  logout: undefined;
  purchase: { amount: number; currency: 'VND' | 'USD' };
};

class Emitter<E extends Record<string, unknown>> {
  private handlers: { [K in keyof E]?: Array<(payload: E[K]) => void> } = {};

  on<K extends keyof E>(event: K, handler: (payload: E[K]) => void) {
    (this.handlers[event] ??= []).push(handler);
  }

  emit<K extends keyof E>(event: K, payload: E[K]) {
    this.handlers[event]?.forEach(h => h(payload));
  }
}

const bus = new Emitter<Events>();
bus.on('login', p => console.log('Đăng nhập:', p.userId));
bus.on('purchase', p => console.log(`Mua hàng: ${p.amount} ${p.currency}`));
bus.emit('login', { userId: 'u42' });
bus.emit('purchase', { amount: 199000, currency: 'VND' });

const config = { port: 3000, host: 'localhost', debug: true } satisfies Record<string, string | number | boolean>;
const frozen: MyReadonly<typeof config> = config;
const blank: Nullable<{ name: string }> = { name: null };

console.log(a, b, route, addUSD(usd(10), usd(5)), frozen.port + 1, blank);

// Bỏ // để xem lỗi kiểu: không được cộng USD với EUR, sai payload của sự kiện
// addUSD(usd(10), eur(20));
// bus.emit('purchase', { amount: '100' });
