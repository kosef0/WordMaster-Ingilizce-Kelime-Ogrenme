const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  english_word: {
    type: String,
    required: true,
    trim: true
  },
  turkish_word: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Word', WordSchema);