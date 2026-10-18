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
