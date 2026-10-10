import { lamSachHtml } from './sanitize';

test('bo script va thuoc tinh su kien, giu dinh dang va mau chu cua giao trinh', () => {
  const ra = lamSachHtml('<p>Xin <strong>chao</strong></p><img src=x onerror=alert(1)><span style="color:red">a</span><script>b()</script><a href="javascript:x()">l</a>');
  expect(ra).toContain('<strong>chao</strong>');
  expect(ra).toContain('<span style="color:red">a</span>');
  expect(ra).not.toMatch(/onerror|<script|javascript:/i);
});
