// Tai trang that (ra khoi router React). Gom vao mot cho de bai kiem theo doi duoc.
export const dieuHuong = {
  thay: (url: string) => window.location.replace(url),
  taiLai: () => window.location.reload()
};
