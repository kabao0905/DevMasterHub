declare const ts: any;

const source = `
interface user_profile { id: number; Name: string }
class orderService {}
function GetUser() {}
const MAX_RETRY = 3;
let currentUser = null;
`;

const file = ts.createSourceFile('demo.ts', source, ts.ScriptTarget.Latest, true);

const isPascal = (s: string) => /^[A-Z][A-Za-z0-9]*$/.test(s);
const isCamel = (s: string) => /^[a-z][A-Za-z0-9]*$/.test(s);
const isUpperSnake = (s: string) => /^[A-Z][A-Z0-9_]*$/.test(s);

const problems: string[] = [];

function visit(node: any) {
  const line = file.getLineAndCharacterOfPosition(node.getStart()).line;
  if ((ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) && node.name && !isPascal(node.name.text)) {
    problems.push(`dòng ${line}: ${ts.SyntaxKind[node.kind]} "${node.name.text}" nên viết PascalCase`);
  }
  if (ts.isFunctionDeclaration(node) && node.name && !isCamel(node.name.text)) {
    problems.push(`dòng ${line}: hàm "${node.name.text}" nên viết camelCase`);
  }
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
    const name = node.name.text;
    if (!isCamel(name) && !isUpperSnake(name)) problems.push(`dòng ${line}: biến "${name}" sai quy ước`);
  }
  ts.forEachChild(node, visit);
}

visit(file);

console.log(`Đã đọc ${file.statements.length} câu lệnh bằng TypeScript Compiler API (ts.createSourceFile).`);
problems.forEach(p => console.log('⚠ ' + p));
console.log(problems.length ? `${problems.length} lỗi đặt tên.` : 'Không có lỗi đặt tên.');
