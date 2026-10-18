type Builder<T extends Record<string, unknown>> = {
  set<K extends string, V>(key: K, value: V): Builder<T & Record<K, V>>;
  build(): T;
};

function createBuilder(): Builder<{}> {
  const obj: Record<string, unknown> = {};
  const builder: Builder<any> = {
    set(key, value) {
      obj[key] = value;
      return builder;
    },
    build() {
      return obj;
    },
  };
  return builder;
}

const result = createBuilder().set('name', 'TypeScript').set('version', 5.4).set('released', true).build();
console.log('Builder:', result, '· version + 1 =', result.version + 1);

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
type Settings = { theme: { color: string; dark: boolean }; lang: string };
const patch: DeepPartial<Settings> = { theme: { dark: true } };
console.log('DeepPartial:', patch);

type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

function buildUrl<P extends string>(pattern: P, params: Record<ExtractParams<P>, string>): string {
  return pattern.replace(/:(\w+)/g, (_, key: string) => params[key as ExtractParams<P>]);
}

console.log(buildUrl('/users/:id/posts/:postId', { id: '7', postId: '42' }));

// Bỏ // để xem TypeScript bắt thiếu tham số postId ngay khi gõ
// buildUrl('/users/:id/posts/:postId', { id: '7' });
