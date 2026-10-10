// Phai nap truoc 'prismjs': bao Prism khong tu to mau ca trang luc tai (React tu quan ly DOM)
(globalThis as unknown as { Prism?: { manual: boolean } }).Prism = { manual: true };
export {};
