import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom khong co ResizeObserver; Radix (ScrollArea...) can no khi noi dung doi kich thuoc
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Khi ca bo kiem chay song song, may cham: cho phan tu xuat hien toi 3 giay thay vi 1
configure({ asyncUtilTimeout: 3000 });

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});
