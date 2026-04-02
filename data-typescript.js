// TypeScript Full Curriculum
const DATA_TS = {
id:'typescript', name:'TypeScript', icon:'🔷', color:'#3178C6',
gradient:'linear-gradient(135deg,#3178C6,#235A97)',
category:'language',
description:'Typed JavaScript, enterprise apps, better DX, fewer bugs',
levels:[
  {id:'newbie',name:'Newbie',badge:'newbie',desc:'TypeScript cơ bản',lessons:[
    {id:'intro',title:'TypeScript Fundamentals',
     theory:'<p><strong>TypeScript</strong> = JavaScript + types. Bắt lỗi tại <strong>compile-time</strong> thay vì runtime. <code>type</code> và <code>interface</code> mô tả shape của data.</p>',
     code:'// Basic types\nlet name: string = "DevMaster";\nlet age: number = 20;\nlet active: boolean = true;\nlet items: string[] = ["js", "ts"];\nlet tuple: [string, number] = ["An", 25];\n\n// Function types\nfunction greet(name: string, greeting?: string): string {\n  return `${greeting ?? "Hello"}, ${name}!`;\n}\n\n// Object type\ntype User = {\n  id: number;\n  name: string;\n  email: string;\n  role: "admin" | "user"; // union literal type\n};\n\nconst user: User = {\n  id: 1,\n  name: "An",\n  email: "an@mail.com",\n  role: "admin"\n};\n\n// Array of objects\nconst users: User[] = [user];',
     lang:'typescript',
     keyPoints:['Types bắt lỗi compile-time: string, number, boolean, type[]','? optional parameter/property, ?? nullish coalescing','Union type: "admin" | "user" giới hạn giá trị hợp lệ'],
     exercise:'Type toàn bộ một JavaScript app đơn giản sang TypeScript.'},

    {id:'interfaces',title:'Interfaces & Type Aliases',
     theory:'<p><code>interface</code> mô tả object shape, có thể extend. <code>type</code> linh hoạt hơn: unions, intersections, primitives. Interface cho objects, type cho phần còn lại.</p>',
     code:'// Interface\ninterface Product {\n  id: number;\n  name: string;\n  price: number;\n  category: string;\n}\n\n// Extending interface\ninterface DiscountedProduct extends Product {\n  discount: number;\n  finalPrice: () => number;\n}\n\n// Type aliases\ntype ID = number | string;\ntype Status = "pending" | "active" | "completed";\ntype Coordinates = [number, number];\n\n// Intersection types\ntype WithTimestamps = {\n  createdAt: Date;\n  updatedAt: Date;\n};\ntype UserWithTimestamps = User & WithTimestamps;\n\n// Generic function\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst firstNum = first([1, 2, 3]);      // number | undefined\nconst firstStr = first(["a", "b"]);     // string | undefined',
     lang:'typescript',
     keyPoints:['interface extend cho inheritance, type & cho intersection','Union (A | B): hoặc A hoặc B','Generic <T>: type parameter cho reusable code'],
     exercise:'Tạo type system cho API response: success/error với generics.'},

    {id:'functions-generics',title:'Functions & Generics cơ bản',
     theory:'<p>Function overloads cho multiple signatures. Generics (<code><T></code>) tạo type-safe reusable code. <code>keyof</code> lấy union of keys, <code>typeof</code> lấy type từ value.</p>',
     code:'// Function with proper types\nfunction processItems<T>(\n  items: T[],\n  transform: (item: T) => T,\n  filter?: (item: T) => boolean\n): T[] {\n  let result = items;\n  if (filter) result = result.filter(filter);\n  return result.map(transform);\n}\n\nconst nums = processItems(\n  [1, 2, 3, 4, 5],\n  n => n * 2,\n  n => n > 2\n); // [6, 8, 10]\n\n// keyof & typeof\ntype Config = {\n  theme: "light" | "dark";\n  lang: string;\n  debug: boolean;\n};\n\nfunction getConfig<K extends keyof Config>(\n  key: K\n): Config[K] {\n  const config: Config = { theme: "dark", lang: "vi", debug: false };\n  return config[key];\n}\n\nconst theme = getConfig("theme");  // type: "light" | "dark"\nconst debug = getConfig("debug");  // type: boolean\n// getConfig("invalid"); // TS Error!',
     lang:'typescript',
     keyPoints:['Generic constraints: <T extends SomeType>','keyof T: union of all property names of T','Indexed access: T[K] lấy type của property K'],
     exercise:'Viết generic function safe objectGet với type-safe key access.'}
  ]},

  {id:'junior',name:'Junior',badge:'junior',desc:'Advanced Types & Patterns',lessons:[
    {id:'advanced-generics',title:'Advanced Generics',
     theory:'<p>Generics constraints, default types. Multiple type parameters. Generic classes và interfaces. Infer type parameters tự động từ usage.</p>',
     code:'// Generic with constraints\ninterface HasId { id: number | string; }\n\nfunction findById<T extends HasId>(items: T[], id: T["id"]): T | undefined {\n  return items.find(item => item.id === id);\n}\n\n// Generic class\nclass Repository<T extends HasId> {\n  private items: T[] = [];\n\n  add(item: T): void { this.items.push(item); }\n  findById(id: T["id"]): T | undefined {\n    return this.items.find(i => i.id === id);\n  }\n  findAll(predicate?: (item: T) => boolean): T[] {\n    return predicate ? this.items.filter(predicate) : [...this.items];\n  }\n  update(id: T["id"], data: Partial<T>): T | undefined {\n    const item = this.findById(id);\n    if (item) Object.assign(item, data);\n    return item;\n  }\n}\n\ninterface User extends HasId {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst userRepo = new Repository<User>();\nuserRepo.add({ id: 1, name: "An", email: "an@mail.com" });\nconst user = userRepo.findById(1); // User | undefined',
     lang:'typescript',
     keyPoints:['constraints: <T extends Base> giới hạn type phải có properties','Partial<T> tất cả properties optional','Generic class/interface cho reusable data structures'],
     exercise:'Tạo generic EventEmitter<EventMap> type-safe.'},

    {id:'utility-types',title:'Utility Types & Mapped Types',
     theory:'<p>TypeScript cung cấp utility types: <code>Partial, Required, Pick, Omit, Record, Readonly, ReturnType, Parameters</code>. Mapped types biến đổi types tự động.</p>',
     code:'interface User {\n  id: number;\n  name: string;\n  email: string;\n  password: string;\n  role: "admin" | "user";\n}\n\n// Built-in utility types\ntype UserUpdate = Partial<User>;           // all optional\ntype UserRequired = Required<User>;        // all required\ntype UserPublic = Omit<User, "password">;  // remove password\ntype UserLogin = Pick<User, "email" | "password">;\ntype UserMap = Record<string, User>;       // { [key]: User }\ntype UserReadonly = Readonly<User>;        // all readonly\n\n// ReturnType & Parameters\nfunction createUser(name: string, email: string) {\n  return { id: Date.now(), name, email, role: "user" as const };\n}\ntype NewUser = ReturnType<typeof createUser>;\ntype CreateParams = Parameters<typeof createUser>;\n\n// Custom mapped type\ntype Nullable<T> = {\n  [K in keyof T]: T[K] | null;\n};\n\ntype FormData<T> = {\n  [K in keyof T]: {\n    value: T[K];\n    error: string | null;\n    touched: boolean;\n  };\n};\n\ntype UserForm = FormData<Pick<User, "name" | "email">>;',
     lang:'typescript',
     keyPoints:['Omit<T, keys> loại bỏ, Pick<T, keys> chọn properties','Record<K, V> tạo object type với specific key/value types','Mapped types: { [K in keyof T]: Transform<T[K]> }'],
     exercise:'Tạo type-safe form builder dùng mapped types.'},

    {id:'discriminated-unions',title:'Discriminated Unions & Type Guards',
     theory:'<p><strong>Discriminated unions</strong> dùng shared literal property (discriminant) để TypeScript tự narrow type. Type guards với <code>typeof</code>, <code>instanceof</code>, <code>in</code>, custom guard functions.</p>',
     code:'// Discriminated Union\ntype ApiResponse<T> =\n  | { status: "success"; data: T; timestamp: Date }\n  | { status: "error"; error: string; code: number }\n  | { status: "loading" };\n\nfunction handleResponse<T>(response: ApiResponse<T>) {\n  switch (response.status) {\n    case "success":\n      console.log(response.data); // TypeScript knows data exists!\n      break;\n    case "error":\n      console.error(response.error, response.code);\n      break;\n    case "loading":\n      console.log("Loading...");\n      break;\n  }\n}\n\n// Custom type guard\ninterface Fish { swim: () => void; }\ninterface Bird { fly: () => void; }\n\nfunction isFish(animal: Fish | Bird): animal is Fish {\n  return "swim" in animal;\n}\n\n// Exhaustive checking with never\nfunction exhaustive(x: never): never {\n  throw new Error(`Unhandled case: ${x}`);\n}\n\ntype Action = { type: "ADD"; item: string }\n  | { type: "REMOVE"; id: number };\n\nfunction reducer(action: Action) {\n  switch (action.type) {\n    case "ADD": return action.item;\n    case "REMOVE": return action.id;\n    default: return exhaustive(action); // compile error if case missed!\n  }\n}',
     lang:'typescript',
     keyPoints:['Discriminated union: shared literal property cho auto-narrowing','Type guard function: (x): x is Type => boolean','Exhaustive check: never type bắt missing cases tại compile time'],
     exercise:'Tạo type-safe state machine với discriminated unions.'}
  ]},

  {id:'mid',name:'Mid-Level',badge:'mid',desc:'Conditional Types & Advanced Patterns',lessons:[
    {id:'conditional',title:'Conditional Types & Infer',
     theory:'<p><code>Conditional types</code>: <code>T extends U ? X : Y</code>. <code>infer</code> keyword extract types bên trong. Template literal types cho string manipulation at type level.</p>',
     code:'// Conditional type\ntype IsString<T> = T extends string ? true : false;\ntype A = IsString<"hello">;  // true\ntype B = IsString<42>;       // false\n\n// Infer: extract inner types\ntype UnwrapPromise<T> = T extends Promise<infer U> ? U : T;\ntype Result = UnwrapPromise<Promise<string>>;  // string\n\ntype ArrayElement<T> = T extends (infer E)[] ? E : never;\ntype Elem = ArrayElement<string[]>;  // string\n\n// Template Literal Types\ntype EventName = `on${Capitalize<string>}`;\n// matches: "onClick", "onHover", "onSubmit"...\n\ntype HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";\ntype APIRoute = `/${string}`;\ntype Endpoint = `${HTTPMethod} ${APIRoute}`;\n\n// Real-world: Extract route params\ntype ExtractParams<T extends string> =\n  T extends `${string}:${infer Param}/${infer Rest}`\n    ? Param | ExtractParams<`/${Rest}`>\n    : T extends `${string}:${infer Param}`\n      ? Param\n      : never;\n\ntype RouteParams = ExtractParams<"/users/:id/posts/:postId">;\n// type RouteParams = "id" | "postId"',
     lang:'typescript',
     keyPoints:['T extends U ? X : Y cho conditional type logic','infer keyword extract type variables','Template literal types: string manipulation at type level'],
     exercise:'Viết DeepPartial<T> recursive type cho nested objects.'},

    {id:'advanced-patterns',title:'Advanced TypeScript Patterns',
     theory:'<p>Builder pattern type-safe. Method chaining. Branded types cho type-safe IDs. <code>satisfies</code> operator (TS 5.0). <code>const</code> assertions.</p>',
     code:'// Branded types (nominal typing)\ntype UserId = number & { __brand: "UserId" };\ntype PostId = number & { __brand: "PostId" };\n\nfunction createUserId(id: number): UserId { return id as UserId; }\nfunction createPostId(id: number): PostId { return id as PostId; }\n\nfunction getUser(id: UserId) { /* ... */ }\nconst userId = createUserId(1);\nconst postId = createPostId(1);\ngetUser(userId);  // OK\n// getUser(postId);  // Error! PostId is not UserId\n\n// satisfies operator (TS 5.0)\nconst palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n  blue: [0, 0, 255],\n} satisfies Record<string, string | number[]>;\n\n// palette.red is still number[] (not string | number[])\npalette.red.map(x => x / 255);\n\n// const assertions\nconst ROUTES = {\n  HOME: "/",\n  USERS: "/users",\n  POSTS: "/posts",\n} as const;\n\ntype Route = typeof ROUTES[keyof typeof ROUTES];\n// type Route = "/" | "/users" | "/posts"',
     lang:'typescript',
     keyPoints:['Branded types: prevent mixing IDs of different entities','satisfies: validate type while keeping narrow inferred type','as const: make literal types instead of widened types'],
     exercise:'Tạo type-safe API client với branded IDs và const routes.'},

    {id:'declaration-files',title:'Declaration Files & Module Types',
     theory:'<p><code>.d.ts</code> files declare types cho JavaScript libraries. <code>@types/</code> packages. Module augmentation extend existing types. Global declarations.</p>',
     code:'// types/api.d.ts - Custom declarations\ndeclare namespace API {\n  interface User {\n    id: number;\n    name: string;\n    email: string;\n  }\n  interface Response<T> {\n    data: T;\n    meta: { page: number; total: number };\n  }\n}\n\n// Module augmentation\ndeclare module "express" {\n  interface Request {\n    user?: API.User;\n    requestId: string;\n  }\n}\n\n// Global declarations\ndeclare global {\n  interface Window {\n    __APP_CONFIG__: {\n      apiUrl: string;\n      version: string;\n    };\n  }\n}\n\n// Triple-slash directives\n/// <reference types="vite/client" />\ninterface ImportMetaEnv {\n  readonly VITE_API_URL: string;\n  readonly VITE_APP_TITLE: string;\n}\n\n// Now TypeScript knows:\nconst config = window.__APP_CONFIG__;\nconst apiUrl = import.meta.env.VITE_API_URL;',
     lang:'typescript',
     keyPoints:['.d.ts files: type declarations without implementation','Module augmentation: extend third-party library types','declare global: add types to global scope (Window, etc)'],
     exercise:'Viết declaration file cho một JavaScript library untyped.'}
  ]},

  {id:'senior',name:'Senior',badge:'senior',desc:'Type-Level Programming',lessons:[
    {id:'type-level',title:'Type-Level Programming',
     theory:'<p>TypeScript types là <strong>Turing-complete</strong>. Recursive conditional types, mapped types chains, variadic tuple types. Dùng cho library APIs, form validators, API clients.</p>',
     code:'// Deep Readonly\ntype DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object\n    ? T[K] extends Function\n      ? T[K]\n      : DeepReadonly<T[K]>\n    : T[K];\n};\n\n// Path type for nested access\ntype Path<T, K extends keyof T = keyof T> =\n  K extends string\n    ? T[K] extends object\n      ? K | `${K}.${Path<T[K]>}`\n      : K\n    : never;\n\ninterface Config {\n  db: { host: string; port: number };\n  cache: { ttl: number; enabled: boolean };\n}\ntype ConfigPath = Path<Config>;\n// "db" | "cache" | "db.host" | "db.port" | "cache.ttl" | "cache.enabled"\n\n// Type-safe event emitter\ntype EventMap = {\n  click: { x: number; y: number };\n  keydown: { key: string; code: number };\n  resize: { width: number; height: number };\n};\n\nclass TypedEmitter<T extends Record<string, object>> {\n  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {\n    /* ... */\n  }\n  emit<K extends keyof T>(event: K, data: T[K]): void {\n    /* ... */\n  }\n}\n\nconst emitter = new TypedEmitter<EventMap>();\nemitter.on("click", ({ x, y }) => {}); // fully typed!\n// emitter.emit("click", { key: "a" }); // Error!',
     lang:'typescript',
     keyPoints:['Recursive types: DeepPartial, DeepReadonly cho nested objects','Template literal types + recursive = string pattern matching','Type-safe builders: mỗi method thay đổi return type'],
     exercise:'Tạo type-safe SQL query builder với full autocomplete.'},

    {id:'ecosystem',title:'TypeScript Ecosystem & Best Practices',
     theory:'<p>Zod cho runtime validation + type inference. tRPC cho end-to-end type safety. tsconfig best practices. Performance: isolatedModules, skipLibCheck.</p>',
     code:'// Zod: runtime validation + type inference\nimport { z } from "zod";\n\nconst UserSchema = z.object({\n  name: z.string().min(2).max(50),\n  email: z.string().email(),\n  age: z.number().min(0).max(150).optional(),\n  role: z.enum(["admin", "user", "moderator"]),\n});\n\n// Infer TypeScript type FROM schema\ntype User = z.infer<typeof UserSchema>;\n// { name: string; email: string; age?: number; role: "admin" | "user" | "moderator" }\n\n// Safe parsing\nconst result = UserSchema.safeParse({\n  name: "An", email: "an@mail.com", role: "admin"\n});\n\nif (result.success) {\n  console.log(result.data.name); // typed!\n} else {\n  console.error(result.error.issues);\n}\n\n// tsconfig.json best practices\n// {\n//   "compilerOptions": {\n//     "strict": true,\n//     "noUncheckedIndexedAccess": true,\n//     "exactOptionalPropertyTypes": true,\n//     "isolatedModules": true,\n//     "moduleResolution": "bundler"\n//   }\n// }',
     lang:'typescript',
     keyPoints:['Zod: single source of truth cho types + validation','z.infer<typeof Schema> sync types với validation','strict: true + noUncheckedIndexedAccess nên luôn bật'],
     exercise:'Refactor Express API dùng Zod validation cho tất cả endpoints.'}
  ]},

  {id:'master',name:'Master',badge:'master',desc:'Compiler & Advanced Internals',lessons:[
    {id:'compiler',title:'TypeScript Compiler Internals',
     theory:'<p>Hiểu TS compiler: Scanner → Parser → Binder → Checker → Emitter. Custom transformers modify AST. TypeScript Language Service Protocol cho IDE integration.</p>',
     code:'// Custom TypeScript transformer (simplified)\nimport ts from "typescript";\n\n// Remove console.log in production\nfunction removeConsoleTransformer(): ts.TransformerFactory<ts.SourceFile> {\n  return (context) => {\n    return (sourceFile) => {\n      function visitor(node: ts.Node): ts.Node | undefined {\n        if (\n          ts.isExpressionStatement(node) &&\n          ts.isCallExpression(node.expression) &&\n          ts.isPropertyAccessExpression(node.expression.expression) &&\n          node.expression.expression.expression.getText() === "console"\n        ) {\n          return undefined; // Remove the node\n        }\n        return ts.visitEachChild(node, visitor, context);\n      }\n      return ts.visitNode(sourceFile, visitor) as ts.SourceFile;\n    };\n  };\n}\n\n// ts.createProgram → compile programmatically\nconst program = ts.createProgram(["src/index.ts"], {\n  target: ts.ScriptTarget.ES2022,\n  module: ts.ModuleKind.ESNext,\n  strict: true,\n});\n\n// Get type information\nconst checker = program.getTypeChecker();\nconst sourceFile = program.getSourceFile("src/index.ts")!;\nts.forEachChild(sourceFile, (node) => {\n  if (ts.isFunctionDeclaration(node) && node.name) {\n    const symbol = checker.getSymbolAtLocation(node.name);\n    if (symbol) {\n      const type = checker.getTypeOfSymbolAtLocation(symbol, node);\n      console.log(node.name.text, checker.typeToString(type));\n    }\n  }\n});',
     lang:'typescript',
     keyPoints:['TS compiler pipeline: Scanner→Parser→Binder→Checker→Emitter','Custom transformers modify AST at compile time','Language Service: powers IDE features (autocomplete, errors)'],
     exercise:'Viết custom TS transformer tự generate API docs từ type declarations.'}
  ]}
]
};
