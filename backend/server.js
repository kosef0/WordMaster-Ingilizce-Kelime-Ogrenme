const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config(); // Make sure this is added

// JWT Secret key tanımlanması - .env içinde olmasa bile
const JWT_SECRET = process.env.JWT_SECRET || 'wmm0b1l$3cur3t0k3n2023';
global.JWT_SECRET = JWT_SECRET;

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

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`Server running at http://localhost:${PORT}`);
});