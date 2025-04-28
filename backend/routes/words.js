const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// Tüm kelimeleri getir
router.get('/', async (req, res) => {
  try {
    const words = await Word.find().populate('category', 'name');
    res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Kategoriye göre kelimeleri getir
router.get('/category/:categoryId', async (req, res) => {
  try {
    const words = await Word.find({ category: req.params.categoryId }).populate('category', 'name');
    res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Seviyeye göre kelimeleri getir
router.get('/level/:level', async (req, res) => {
  try {
    const words = await Word.find({ level: req.params.level }).populate('category', 'name');
    res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Kelime ekle
router.post('/', async (req, res) => {
  const { level, category, english_word, turkish_word } = req.body;
  
  try {
    const newWord = new Word({
      level,
      category,
      english_word,
      turkish_word
    });
    
    const word = await newWord.save();
    res.json(word);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;