const { test } = require('node:test');
const assert = require('node:assert');
const { napTerminal, docNguon } = require('./helper.js');

// Bang COMMANDS la nguon duy nhat: help in tu day, va cau lenh mo ta gui AI
// cung lay tu day. Neu no lech voi cac nhan case trong ma thi hoc vien se gap
// "command not found" o dung lenh ma he thong vua bao la co.
//
// Bai kiem nay con bat duoc truong hop xoa nham ban cai khi sua ma nguon.
//
// LUU Y: terminal chay trong hop cat vm, tuc mot realm JavaScript khac. Mang do
// no tra ve co Array.prototype rieng, nen deepStrictEqual se bao "same structure
// but not reference-equal" du hai mang cung rong. Phai trai ra bang [...] de
// chuyen sang mang cua realm hien tai truoc khi so.
const raMangHost = x => [...x];

function nhanCase() {
  return [...docNguon('cyber-terminal.js').matchAll(/^\s*case '([a-z0-9_]+)':/gm)].map(m => m[1]);
}

test('moi lenh trong bang COMMANDS deu co ban cai', () => {
  const T = napTerminal();
  const nhan = nhanCase();
  const thieu = raMangHost(T.commandNames()).filter(c => !nhan.includes(c));
  assert.deepStrictEqual(thieu, [], 'quang cao nhung khong cai');
});

test('moi ban cai deu duoc khai bao trong bang COMMANDS', () => {
  const T = napTerminal();
  const ten = raMangHost(T.commandNames());
  const thieu = nhanCase().filter(c => !ten.includes(c));
  assert.deepStrictEqual(thieu, [], 'cai roi nhung khong khai bao');
});

test('khong lenh nao roi vao command not found', () => {
  const T = napTerminal();
  const hong = raMangHost(T.commandNames())
    .filter(c => String(T.executeCommand(c)).includes('command not found'));
  assert.deepStrictEqual(hong, []);
});

test('help liet ke du moi lenh', () => {
  const T = napTerminal();
  const troGiup = String(T.executeCommand('help'));
  const thieu = raMangHost(T.commandNames()).filter(c => !troGiup.includes(c));
  assert.deepStrictEqual(thieu, []);
});

test('cac lenh dieu tra co san van chay duoc', () => {
  // Chan viec vo tinh xoa mat ban cai khi sua ma nguon quanh do
  const T = napTerminal();
  assert.match(String(T.executeCommand('ps aux')), /PID/);
  assert.match(String(T.executeCommand('netstat -tuln')), /LISTEN/);
  assert.match(String(T.executeCommand('find /home')), /\/home\/hacker/);
  assert.match(String(T.executeCommand('nmap 192.168.1.100')), /PORT/);
});
