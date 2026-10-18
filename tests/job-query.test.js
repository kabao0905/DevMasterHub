const { test } = require('node:test');
const assert = require('node:assert');
const { doanThanhPho, lamSachTuKhoa, chiNhanHttp } = require('../lib/job-query.js');

test('chu "hn" nam giua tu khong bi hieu la Ha Noi', () => {
  assert.strictEqual(doanThanhPho('technical lead'), null);
  assert.strictEqual(doanThanhPho('technology intern'), null);
  assert.strictEqual(doanThanhPho('john doe react'), null);
});

test('nhan ra thanh pho khi duoc viet thanh tu rieng', () => {
  assert.strictEqual(doanThanhPho('react hn'), 'hanoi');
  assert.strictEqual(doanThanhPho('react ở hcm'), 'hcm');
  assert.strictEqual(doanThanhPho('việc làm đà nẵng'), 'danang');
  assert.strictEqual(doanThanhPho('python remote'), 'remote');
});

test('bo dia diem va tu dem tieng Viet co dau khoi tu khoa', () => {
  assert.strictEqual(lamSachTuKhoa('tìm việc react ở hcm').cleanTechQuery, 'react');
  assert.strictEqual(lamSachTuKhoa('công việc về java tại đà nẵng').cleanTechQuery, 'java');
});

test('coreTech bo cap bac, ke ca chu co dau o cuoi nhu "kỹ sư"', () => {
  assert.strictEqual(lamSachTuKhoa('kỹ sư python').coreTech, 'python');
  assert.strictEqual(lamSachTuKhoa('senior golang developer').coreTech, 'golang');
});

test('chi co cap bac + vai tro chung (nguoi moi chua hoc gi: "Intern Developer") van tim theo vai tro, khong ra 0 viec', () => {
  assert.strictEqual(lamSachTuKhoa('intern developer').coreTech, 'developer');
  assert.strictEqual(lamSachTuKhoa('Fresher Engineer').coreTech, 'engineer');
  assert.strictEqual(lamSachTuKhoa('thực tập lập trình viên').coreTech, 'developer');
  assert.strictEqual(lamSachTuKhoa('intern').coreTech, 'developer');
});

test('chi con dia diem thi tu khoa mac dinh la developer', () => {
  assert.strictEqual(lamSachTuKhoa('hcm').cleanTechQuery, 'developer');
});

test('chiNhanHttp chi giu duong dan http va https', () => {
  assert.strictEqual(chiNhanHttp('https://remoteok.com/l/123'), 'https://remoteok.com/l/123');
  assert.strictEqual(chiNhanHttp('http://a.vn/x?y=1'), 'http://a.vn/x?y=1');
  assert.strictEqual(chiNhanHttp('javascript:alert(1)'), null);
  assert.strictEqual(chiNhanHttp(' JaVaScRiPt:alert(1)'), null);
  assert.strictEqual(chiNhanHttp('data:text/html,<b>x</b>'), null);
  assert.strictEqual(chiNhanHttp('khong phai url'), null);
  assert.strictEqual(chiNhanHttp(undefined), null);
});
