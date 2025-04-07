const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Tüm kategorileri getir
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// ID'ye göre kategori getir
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Kategori bulunamadı' });
    }
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Kategori bulunamadı' });
    }
    res.status(500).send('Sunucu Hatası');
  }
});

// Kategori ekle
router.post('/', async (req, res) => {
  const { name, description, imageUrl } = req.body;
  
  try {
    const newCategory = new Category({
      name,
      description,
      imageUrl
    });
    
    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// Kategori güncelle
router.put('/:id', async (req, res) => {
  const { name, description, imageUrl } = req.body;
  
  // Kategori alanlarını güncelle
  const categoryFields = {};
  if (name) categoryFields.name = name;
  if (description) categoryFields.description = description;
  if (imageUrl) categoryFields.imageUrl = imageUrl;
  
  try {
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Kategori bulunamadı' });
    }
    
    // Güncelle
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Kategori bulunamadı' });
    }
    res.status(500).send('Sunucu Hatası');
  }
});

// Kategori sil
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Kategori bulunamadı' });
    }
    
    await Category.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Kategori silindi' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Kategori bulunamadı' });
    }
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;