const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB bağlantı URL'si (env dosyası yoksa doğrudan belirtiyoruz)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kelime_db';

const connectDB = async () => {
  try {
    // Bağlantı seçeneklerini güncelleyelim
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Bağlantı başarılı olduğunda konsola bilgi verelim
    console.log('MongoDB bağlantısı başarılı');
    console.log(`Bağlantı URL: ${MONGODB_URI}`);
    
    // Bağlantı durumunu kontrol edelim
    const db = mongoose.connection;
    db.on('error', (err) => console.error('MongoDB bağlantı hatası:', err));
    db.once('open', () => console.log('Veritabanı bağlantısı aktif'));
    
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;