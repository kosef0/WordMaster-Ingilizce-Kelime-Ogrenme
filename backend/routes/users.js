const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT doğrulama middleware
const auth = require('../middleware/auth');

// Kimlik doğrulama ile kullanıcı bilgilerini getir
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Tüm kullanıcıları getir (sadece admin için)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Kullanıcı kayıt
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Email kontrolü
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Yeni kullanıcı oluştur
    user = new User({
      name,
      email,
      password
    });

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // JWT oluştur
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwtSecret', // JWT gizli anahtarı
      { expiresIn: 360000 }, // Token süresi
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Kullanıcı giriş
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Email kontrolü
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Geçersiz kullanıcı bilgileri' });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Geçersiz kullanıcı bilgileri' });
    }

    // JWT oluştur
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwtSecret', // JWT gizli anahtarı
      { expiresIn: 360000 }, // Token süresi
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Profil güncelleme
router.put('/profile', auth, async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }

    // Güncelleme alanlarını kontrol et ve güncelle
    if (name) user.name = name;
    if (email) user.email = email;

    // Eğer şifre değişikliği istenmişse
    if (currentPassword && newPassword) {
      // Mevcut şifreyi doğrula
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Mevcut şifre yanlış' });
      }

      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Şifre hariç kullanıcı bilgilerini döndür
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;