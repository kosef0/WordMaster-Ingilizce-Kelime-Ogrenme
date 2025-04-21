const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config(); // Make sure this is added

// MongoDB Atlas bağlantısı
connectDB();

const app = express();

// Middleware
// CORS ayarları
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
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
const PORT = process.env.PORT || 3000; // Make sure this is 3000 to match your mobile app

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`Server running at http://localhost:${PORT}`);
});