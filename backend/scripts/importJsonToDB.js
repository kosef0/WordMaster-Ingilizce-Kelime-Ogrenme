const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../db');
const Category = require('../models/Category');
const Word = require('../models/Word');

// Veritabanına bağlan
connectDB();

// JSON dosyasını oku
const jsonFilePath = path.join(__dirname, '../../kelimeler.json');

const importDataFromJson = async () => {
  try {
    console.log('JSON dosyası okunuyor...');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const words = JSON.parse(jsonData);
    console.log(`Toplam ${words.length} kelime JSON dosyasından okundu.`);

    // Kategorileri grupla
    const categories = {};
    words.forEach(word => {
      if (!categories[word.category]) {
        categories[word.category] = {
          name: word.category.charAt(0).toUpperCase() + word.category.slice(1),
          description: `${word.category} kategorisindeki kelimeler`,
          count: 1
        };
      } else {
        categories[word.category].count++;
      }
    });

    console.log(`Toplam ${Object.keys(categories).length} farklı kategori bulundu.`);

    // Önce veritabanındaki mevcut kategorileri kontrol et
    const existingCategories = await Category.find();
    console.log(`Veritabanında ${existingCategories.length} kategori bulunuyor.`);

    // Kategorileri veritabanına ekle
    const categoryMap = {};
    
    for (const categoryKey of Object.keys(categories)) {
      let categoryDoc = existingCategories.find(c => c.name.toLowerCase() === categoryKey.toLowerCase());
      
      if (!categoryDoc) {
        console.log(`Yeni kategori oluşturuluyor: ${categories[categoryKey].name}`);
        const newCategory = new Category({
          name: categories[categoryKey].name,
          description: categories[categoryKey].description,
          imageUrl: `https://via.placeholder.com/150?text=${encodeURIComponent(categories[categoryKey].name)}`
        });
        
        categoryDoc = await newCategory.save();
        console.log(`Yeni kategori oluşturuldu: ${categoryDoc.name} (${categoryDoc._id})`);
      } else {
        console.log(`Mevcut kategori bulundu: ${categoryDoc.name} (${categoryDoc._id})`);
      }
      
      categoryMap[categoryKey] = categoryDoc._id;
    }

    // Veritabanındaki mevcut kelime sayısını kontrol et
    const existingWordsCount = await Word.countDocuments();
    console.log(`Veritabanında şu anda ${existingWordsCount} kelime bulunuyor.`);

    // Kelime verilerini işle
    console.log('Kelimeler veritabanına ekleniyor...');
    let addedCount = 0;
    let skippedCount = 0;
    let batchSize = 500; // Her seferde işlenecek kelime sayısı
    
    // Kelimeleri daha küçük gruplara bölerek işle
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      const operations = [];
      
      for (const word of batch) {
        // Kelimenin zaten veritabanında olup olmadığını kontrol etmek için filtreleme yapma
        const filter = {
          english_word: word.english_word,
          turkish_word: word.turkish_word
        };
        
        // Bu kelime için kaydedilecek veriyi hazırla
        const wordData = {
          level: word.level,
          category: categoryMap[word.category],
          english_word: word.english_word,
          turkish_word: word.turkish_word
        };
        
        // Bu kelimeyi kaydetme veya güncelleme işlemi
        operations.push({
          updateOne: {
            filter: filter,
            update: wordData,
            upsert: true // Eğer bulunamazsa yeni kayıt oluştur, bulunursa güncelle
          }
        });
      }
      
      if (operations.length > 0) {
        const result = await Word.bulkWrite(operations);
        addedCount += result.upsertedCount;
        skippedCount += (batch.length - result.upsertedCount);
        console.log(`İşlenen: ${i + batch.length}/${words.length}, Eklenen: ${result.upsertedCount}, Güncellenen/Atlanan: ${batch.length - result.upsertedCount}`);
      }
    }

    console.log('İşlem tamamlandı!');
    console.log(`Toplam ${addedCount} yeni kelime eklendi, ${skippedCount} kelime zaten vardı veya güncellendi.`);
    console.log(`Veritabanında artık toplam ${await Word.countDocuments()} kelime bulunuyor.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Veri aktarma hatası:', error);
    process.exit(1);
  }
};

importDataFromJson(); 