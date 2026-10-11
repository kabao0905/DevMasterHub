// Ban TS phai giu NGUYEN VAN du lieu cua app cu (code mau trong IDE, script chon phan tu).
import NGUON_SANDPACK from '../../../public/sandpack-live.js?raw';
import NGUON_THIET_KE from '../../../public/design-mode.js?raw';
import { PRESETS } from './sandpack-doc';
import { injectScript, GROUPS } from './design-inject';

/** Chay file cu trong mot ham voi window/document gia, lay doi tuong no gan len window */
function napCu(nguon: string, ten: string): Record<string, unknown> {
  const window: Record<string, unknown> = {};
  const document = { getElementById: () => null, querySelector: () => null, addEventListener() {} };
  new Function('window', 'document', nguon)(window, document);
  return window[ten] as Record<string, unknown>;
}

test('PRESETS (code mau cua IDE) trung tung ky tu voi sandpack-live.js', () => {
  expect(PRESETS).toEqual(napCu(NGUON_SANDPACK, 'SandpackLive').PRESETS);
});

test('script chon phan tu va bang thuoc tinh trung voi design-mode.js', () => {
  const cu = napCu(NGUON_THIET_KE, 'DesignMode') as { injectScript: (t: string) => string; GROUPS: unknown };
  expect(injectScript('tok')).toBe(cu.injectScript('tok'));
  expect(GROUPS).toEqual(cu.GROUPS);
});
