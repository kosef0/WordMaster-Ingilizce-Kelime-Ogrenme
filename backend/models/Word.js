const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  english: {
    type: String,
    required: true,
    trim: true
  },
  turkish: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  exampleSentence: {
    type: String,
    trim: true
  },
  pronunciation: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Word', WordSchema);