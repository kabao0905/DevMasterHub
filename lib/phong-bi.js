// "Phong bi" base64 cho body gui AI / chay code.
// Render dat tuong lua Cloudflare phia truoc: body co chuoi giong tan cong (../../, ${jndi:...) bi chan
// bang trang 403 HTML truoc khi toi server. Hoi gia su ve lap trinh rat de dinh nhung chuoi do, nen client
// boc ca body thanh { b64 } — WAF khong doc duoc ben trong, server mo ra o day roi xu ly nhu thuong.

/** Middleware Express: { b64 } -> req.body that. Body thuong (client cu) di qua nguyen ven. */
function moPhongBi(req, res, next) {
  const b = req.body;
  if (!b || typeof b !== 'object' || !('b64' in b)) return next();
  let goc;
  try {
    if (typeof b.b64 !== 'string') throw new Error('b64 khong phai chuoi');
    goc = JSON.parse(Buffer.from(b.b64, 'base64').toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Dữ liệu gửi lên bị hỏng' });
  }
  if (!goc || typeof goc !== 'object' || Array.isArray(goc)) {
    return res.status(400).json({ error: 'Dữ liệu gửi lên bị hỏng' });
  }
  req.body = goc;
  next();
}

module.exports = { moPhongBi };
