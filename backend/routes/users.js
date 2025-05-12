const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gizli anahtar
const JWT_SECRET = process.env.JWT_SECRET || 'wm-secret-key123';

// Token doğrulama middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'Token bulunamadı, yetkilendirme reddedildi' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token geçerli değil' });
  }
};

// Tüm kullanıcıları getir (sadece admin kullanır)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  console.log('Kayıt isteği alındı:', req.body);
  const { name, email, password } = req.body;

  // Eksik alan kontrolü
  if (!name || !email || !password) {
    console.log('Eksik alanlar:', { name: !!name, email: !!email, password: !!password });
    return res.status(400).json({ msg: 'Lütfen tüm alanları doldurun' });
  }

  try {
    // Email kontrolü
    let user = await User.findOne({ email });
    if (user) {
      console.log('Email zaten kullanımda:', email);
      return res.status(400).json({ msg: 'Bu e-posta adresi zaten kullanımda' });
    }

    // Yeni kullanıcı oluştur
    user = new User({
      name,
      email,
      password,
    });

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Kullanıcıyı kaydet
    await user.save();
    console.log('Yeni kullanıcı oluşturuldu:', { id: user.id, name: user.name, email: user.email });

    // JWT token oluştur
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('Token oluşturma hatası:', err);
          throw err;
        }
        console.log('Token oluşturuldu ve cevap döndürülüyor');
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error('Kayıt hatası:', err.message);
    res.status(500).send('Server Error');
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Email kontrolü
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Geçersiz kullanıcı bilgileri' });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Geçersiz kullanıcı bilgileri' });
    }

    // JWT token oluştur
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// JWT token ile kullanıcı bilgilerini getir
router.get('/me', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'Token bulunamadı, yetkilendirme reddedildi' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
      }
      res.json(user);
    } catch (err) {
      res.status(401).json({ msg: 'Token geçerli değil' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Kullanıcı profil bilgilerini güncelleme
router.put('/profile', auth, async (req, res) => {
  const { name, email } = req.body;
  
  try {
    // Kullanıcıyı bul
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    
    // Email değişikliği varsa ve bu email başka bir kullanıcı tarafından kullanılıyorsa kontrol et
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: 'Bu e-posta adresi zaten kullanımda' });
      }
    }
    
    // Kullanıcı bilgilerini güncelle
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Kullanıcı şifresini değiştirme
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Şifre kontrolü
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'Mevcut şifre ve yeni şifre gereklidir' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'Şifre en az 6 karakter olmalıdır' });
  }
  
  try {
    // Kullanıcıyı bul
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    
    // Mevcut şifreyi kontrol et
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mevcut şifre yanlış' });
    }
    
    // Yeni şifreyi hashle ve kaydet
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ msg: 'Şifre başarıyla değiştirildi' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;