const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Kullanıcı ilerleme modeli
const LearningProgress = require('../models/LearningProgress');

// @route   GET api/learning/progress/:userId
// @desc    Kullanıcının öğrenme ilerlemesini getir
// @access  Private
router.get('/progress/:userId', auth, async (req, res) => {
  try {
    // Kullanıcı kendi verilerine erişebilir
    if (req.user.id !== req.params.userId) {
      return res.status(401).json({ msg: 'Yetkisiz erişim' });
    }

    // Kullanıcının ilerleme bilgilerini bul
    let progress = await LearningProgress.findOne({ user: req.params.userId });

    // İlerleme kaydı yoksa yeni oluştur
    if (!progress) {
      progress = new LearningProgress({
        user: req.params.userId,
        categories: [],
        progress: {
          totalLessonsCompleted: 0,
          totalPoints: 0,
          streak: 0,
          lastStudyDate: null
        }
      });

      await progress.save();
    }

    res.json({
      categories: progress.categories,
      progress: progress.progress
    });
  } catch (err) {
    console.error('İlerleme bilgileri getirilirken hata:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// @route   POST api/learning/sync
// @desc    Kullanıcının kategori ilerlemesini senkronize et
// @access  Private
router.post('/sync', auth, async (req, res) => {
  try {
    const { categories } = req.body;

    // Kullanıcının ilerleme bilgilerini bul
    let progress = await LearningProgress.findOne({ user: req.user.id });

    // İlerleme kaydı yoksa yeni oluştur
    if (!progress) {
      progress = new LearningProgress({
        user: req.user.id,
        categories: categories,
        progress: {
          totalLessonsCompleted: 0,
          totalPoints: 0,
          streak: 0,
          lastStudyDate: null
        }
      });
    } else {
      // Mevcut kategori verilerini güncelle
      progress.categories = categories;
    }

    await progress.save();
    res.json({ msg: 'İlerleme senkronize edildi' });
  } catch (err) {
    console.error('İlerleme senkronize edilirken hata:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// @route   POST api/learning/complete-lesson
// @desc    Ders tamamlama bilgisini kaydet
// @access  Private
router.post('/complete-lesson', auth, async (req, res) => {
  try {
    const { categoryId, lessonId, score, progress: progressData } = req.body;

    // Kullanıcının ilerleme bilgilerini bul
    let progress = await LearningProgress.findOne({ user: req.user.id });

    // İlerleme kaydı yoksa yeni oluştur
    if (!progress) {
      progress = new LearningProgress({
        user: req.user.id,
        categories: [],
        progress: progressData || {
          totalLessonsCompleted: 1,
          totalPoints: score,
          streak: 1,
          lastStudyDate: new Date().toDateString()
        }
      });
    } else {
      // İlerleme bilgilerini güncelle
      if (progressData) {
        progress.progress = progressData;
      } else {
        // Varsayılan güncelleme
        progress.progress.totalLessonsCompleted += 1;
        progress.progress.totalPoints += score;
        
        // Günlük çalışma kontrolü
        const today = new Date().toDateString();
        if (progress.progress.lastStudyDate !== today) {
          progress.progress.lastStudyDate = today;
          progress.progress.streak += 1;
        }
      }
    }

    await progress.save();

    // Kullanıcının XP puanını güncelle
    const user = await User.findById(req.user.id);
    if (user) {
      user.xp = (user.xp || 0) + score;
      await user.save();
    }

    res.json({ 
      msg: 'Ders tamamlandı',
      progress: progress.progress
    });
  } catch (err) {
    console.error('Ders tamamlama kaydedilirken hata:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// @route   GET api/learning/stats
// @desc    Kullanıcının öğrenme istatistiklerini getir
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Kullanıcının ilerleme bilgilerini bul
    const progress = await LearningProgress.findOne({ user: req.user.id });

    if (!progress) {
      return res.json({
        totalLessonsCompleted: 0,
        totalPoints: 0,
        streak: 0,
        lastStudyDate: null,
        categoriesCompleted: 0
      });
    }

    // Tamamlanmış kategorileri hesapla (ilerleme %100 olanlar)
    const categoriesCompleted = progress.categories.filter(cat => cat.progress === 100).length;

    res.json({
      ...progress.progress,
      categoriesCompleted
    });
  } catch (err) {
    console.error('İstatistikler getirilirken hata:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router; 