const mongoose = require('mongoose');

const LearningProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  categories: [
    {
      id: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      progress: {
        type: Number,
        default: 0
      },
      lessons: [
        {
          id: {
            type: String,
            required: true
          },
          title: {
            type: String,
            required: true
          },
          completed: {
            type: Boolean,
            default: false
          },
          locked: {
            type: Boolean,
            default: true
          },
          score: {
            type: Number,
            default: 0
          },
          lastCompleted: {
            type: Date
          }
        }
      ]
    }
  ],
  progress: {
    totalLessonsCompleted: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastStudyDate: {
      type: String,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Güncellemeden önce updatedAt alanını güncelle
LearningProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('learning_progress', LearningProgressSchema); 