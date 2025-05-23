const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config(); // Make sure this is added

// MongoDB Atlas bağlantısı
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('API çalışıyor');
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/words', require('./routes/words'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Port ayarı
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Tüm IP adreslerinden erişime izin ver

app.listen(PORT, HOST, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`Yerel erişim: http://localhost:${PORT}`);
  console.log(`Ağ erişimi: http://192.168.36.65:${PORT}`);
}); 