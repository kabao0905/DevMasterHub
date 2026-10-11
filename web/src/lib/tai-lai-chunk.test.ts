import { dieuHuong } from './dieu-huong';
import { ganTaiLaiKhiLoiChunk, laLoiTaiChunk, taiLaiMotLan } from './tai-lai-chunk';

test('nhan ra loi tai chunk cua Chrome, Firefox, Safari va loi preload CSS cua Vite; loi khac thi khong', () => {
  expect(laLoiTaiChunk(new TypeError('Failed to fetch dynamically imported module: https://x/assets/LessonPage-1a2b.js'))).toBe(true);
  expect(laLoiTaiChunk(new TypeError('error loading dynamically imported module: https://x/a.js'))).toBe(true);
  expect(laLoiTaiChunk(new TypeError('Importing a module script failed.'))).toBe(true);
  expect(laLoiTaiChunk(new Error('Unable to preload CSS for /assets/a.css'))).toBe(true);
  expect(laLoiTaiChunk(new Error('Cannot read properties of undefined'))).toBe(false);
  expect(laLoiTaiChunk(null)).toBe(false);
});

test('tai lai mot lan; vua tai lai ma van loi thi khong tai lai nua (tranh vong lap)', () => {
  const taiLai = vi.spyOn(dieuHuong, 'taiLai').mockImplementation(() => {});
  expect(taiLaiMotLan()).toBe(true);
  expect(taiLaiMotLan()).toBe(false);
  expect(taiLai).toHaveBeenCalledTimes(1);
  taiLai.mockRestore();
});

test('vite:preloadError: tai lai va chan loi; lan hai lien sau do de loi di tiep', () => {
  const taiLai = vi.spyOn(dieuHuong, 'taiLai').mockImplementation(() => {});
  const go = ganTaiLaiKhiLoiChunk();
  const e1 = new Event('vite:preloadError', { cancelable: true });
  window.dispatchEvent(e1);
  expect(e1.defaultPrevented).toBe(true);
  const e2 = new Event('vite:preloadError', { cancelable: true });
  window.dispatchEvent(e2);
  expect(e2.defaultPrevented).toBe(false);
  expect(taiLai).toHaveBeenCalledTimes(1);
  go();
  taiLai.mockRestore();
});
