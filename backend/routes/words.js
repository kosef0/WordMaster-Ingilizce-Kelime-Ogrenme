const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// Tüm kelimeleri getir
router.get('/', async (req, res) => {
  try {
    const words = await Word.find().populate('category', 'name');
    console.log(`Toplam ${words.length} kelime bulundu`);
    res.json(words);
  } catch (err) {
    console.error('Tüm kelimeleri getirirken hata:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Kategoriye göre kelimeleri getir
router.get('/category/:categoryId', async (req, res) => {
  try {
    console.log(`Kategori ID: ${req.params.categoryId} için kelimeler aranıyor...`);
    
    // ObjectId doğrulaması
    if (!req.params.categoryId || req.params.categoryId.length !== 24) {
      console.log('Geçersiz kategori ID formatı');
      return res.status(400).json({ msg: 'Geçersiz kategori ID formatı' });
    }
    
    const words = await Word.find({ category: req.params.categoryId }).populate('category', 'name');
    console.log(`Kategori ID: ${req.params.categoryId} için ${words.length} kelime bulundu`);
    
    res.json(words);
  } catch (err) {
    console.error(`Kategori ID: ${req.params.categoryId} için kelimeler getirilirken hata:`, err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Seviyeye göre kelimeleri getir
router.get('/level/:level', async (req, res) => {
  try {
    const words = await Word.find({ level: req.params.level }).populate('category', 'name');
    console.log(`${req.params.level} seviyesi için ${words.length} kelime bulundu`);
    res.json(words);
  } catch (err) {
    console.error(`${req.params.level} seviyesi için kelimeler getirilirken hata:`, err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Kelime ekle
router.post('/', async (req, res) => {
  const { level, category, english_word, turkish_word } = req.body;
  
  if (!level || !category || !english_word || !turkish_word) {
    return res.status(400).json({ msg: 'Tüm alanlar zorunludur' });
  }
  
  try {
    const newWord = new Word({
      level,
      category,
      english_word,
      turkish_word
    });
    
    const word = await newWord.save();
    console.log(`Yeni kelime eklendi: ${english_word} (${turkish_word})`);
    res.json(word);
  } catch (err) {
    console.error('Kelime eklerken hata:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;