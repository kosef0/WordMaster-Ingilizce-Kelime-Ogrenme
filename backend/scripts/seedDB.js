const mongoose = require('mongoose');
const Category = require('../models/Category');
const Word = require('../models/Word');
const connectDB = require('../db');

// Veritabanına bağlan
connectDB();

// Örnek kategoriler
const categories = [
  {
    name: 'Temel Kelimeler',
    description: 'Günlük yaşamda en sık kullanılan kelimeler',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    name: 'Seyahat',
    description: 'Seyahat ederken işinize yarayacak kelimeler',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    name: 'İş İngilizcesi',
    description: 'İş hayatında kullanılan temel kelimeler',
    imageUrl: 'https://via.placeholder.com/150'
  }
];

// Örnek kelimeler - categoryIds dizisini daha sonra dolduracağız
const wordsTemplate = [
  { level: 'Başlangıç', english_word: 'Hello', turkish_word: 'Merhaba' },
  { level: 'Başlangıç', english_word: 'Good morning', turkish_word: 'Günaydın' },
  { level: 'Başlangıç', english_word: 'Thank you', turkish_word: 'Teşekkür ederim' },
  { level: 'Başlangıç', english_word: 'Yes', turkish_word: 'Evet' },
  { level: 'Başlangıç', english_word: 'No', turkish_word: 'Hayır' },
  { level: 'Başlangıç', english_word: 'Please', turkish_word: 'Lütfen' },
  { level: 'Orta', english_word: 'Meeting', turkish_word: 'Toplantı' },
  { level: 'Orta', english_word: 'Presentation', turkish_word: 'Sunum' },
  { level: 'Orta', english_word: 'Report', turkish_word: 'Rapor' },
  { level: 'Orta', english_word: 'Deadline', turkish_word: 'Son Teslim Tarihi' },
  { level: 'İleri', english_word: 'Airport', turkish_word: 'Havalimanı' },
  { level: 'İleri', english_word: 'Reservation', turkish_word: 'Rezervasyon' },
  { level: 'İleri', english_word: 'Passport', turkish_word: 'Pasaport' }
];

const seedDB = async () => {
  try {
    // Önce veritabanını temizle
    await Category.deleteMany({});
    await Word.deleteMany({});
    console.log('Veritabanı temizlendi');

    // Kategorileri ekle
    const savedCategories = await Category.insertMany(categories);
    console.log(`${savedCategories.length} kategori eklendi`);

    // Kelime eklemek için kategori ID'lerini al
    const categoryIds = savedCategories.map(category => category._id);

    // Her kategori için kelimeler oluştur
    const words = [];
    
    categoryIds.forEach((categoryId, index) => {
      // Her kategoriye birkaç kelime ekleyelim
      const startIdx = index * 4; // Her kategoriye 4 kelime
      const endIdx = startIdx + 4 < wordsTemplate.length ? startIdx + 4 : wordsTemplate.length;
      
      for (let i = startIdx; i < endIdx; i++) {
        if (i < wordsTemplate.length) {
          words.push({
            ...wordsTemplate[i],
            category: categoryId
          });
        }
      }
    });

    // Kelimeleri ekle
    const savedWords = await Word.insertMany(words);
    console.log(`${savedWords.length} kelime eklendi`);

    console.log('Veritabanı başarıyla dolduruldu!');
    process.exit(0);
  } catch (error) {
    console.error('Veritabanını doldururken hata oluştu:', error);
    process.exit(1);
  }
};

seedDB(); 