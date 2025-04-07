const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import models
const Category = require('../models/Category');
const Word = require('../models/Word');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => {
  console.error('MongoDB bağlantı hatası:', err);
  process.exit(1);
});

// Read the JSON file
const importData = async () => {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../kelimeler.json'), 'utf-8')
    );
    
    console.log(`${jsonData.length} kelime okundu.`);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(jsonData.map(item => item.category))];
    console.log(`${uniqueCategories.length} benzersiz kategori bulundu:`, uniqueCategories);
    
    // Clear existing data
    await Category.deleteMany({});
    await Word.deleteMany({});
    console.log('Mevcut veriler temizlendi.');
    
    // Create categories
    const categoryPromises = uniqueCategories.map(categoryName => {
      return Category.create({
        name: categoryName,
        description: `${categoryName} kategorisi`,
        imageUrl: `https://via.placeholder.com/150?text=${categoryName}`
      });
    });
    
    const savedCategories = await Promise.all(categoryPromises);
    console.log(`${savedCategories.length} kategori veritabanına kaydedildi.`);
    
    // Create a map of category names to their IDs
    const categoryMap = {};
    savedCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });
    
    // Create words with references to their categories
    const wordPromises = jsonData.map(item => {
      return Word.create({
        level: item.level,
        category: categoryMap[item.category],
        english_word: item.english_word,
        turkish_word: item.turkish_word
      });
    });
    
    const savedWords = await Promise.all(wordPromises);
    console.log(`${savedWords.length} kelime veritabanına kaydedildi.`);
    
    console.log('Veri içe aktarma işlemi başarıyla tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('Veri içe aktarma hatası:', error);
    process.exit(1);
  }
};

// Run the import
importData();