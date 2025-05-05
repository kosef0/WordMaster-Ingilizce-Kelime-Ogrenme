const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Token'ı header'dan al
  const token = req.header('x-auth-token');

  // Token yoksa
  if (!token) {
    return res.status(401).json({ msg: 'Yetkilendirme hatası, token bulunamadı' });
  }

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtSecret');

    // User bilgisini request'e ekle
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Geçersiz token' });
  }
}; 