const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Bağlantı seçeneklerini güncelleyelim
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Bağlantı başarılı olduğunda konsola bilgi verelim
    console.log('MongoDB Atlas bağlantısı başarılı');
    
    // Bağlantı durumunu kontrol edelim
    const db = mongoose.connection;
    db.on('error', (err) => console.error('MongoDB bağlantı hatası:', err));
    db.once('open', () => console.log('Veritabanı bağlantısı aktif'));
    
  } catch (error) {
    console.error('MongoDB Atlas bağlantı hatası:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;