const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// Get all words
router.get('/', async (req, res) => {
  try {
    const words = await Word.find().populate('category', 'name');
    res.json(words);
  } catch (err) {
    console.error('Error fetching words:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get words by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const words = await Word.find({ category: req.params.categoryId }).sort({ english: 1 });
    res.json(words);
  } catch (err) {
    console.error('Error fetching words by category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single word by ID
router.get('/:id', async (req, res) => {
  try {
    const word = await Word.findById(req.params.id).populate('category', 'name');
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.json(word);
  } catch (err) {
    console.error('Error fetching word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new word
router.post('/', async (req, res) => {
  try {
    const newWord = new Word({
      english: req.body.english,
      turkish: req.body.turkish,
      category: req.body.category,
      exampleSentence: req.body.exampleSentence,
      pronunciation: req.body.pronunciation,
      difficulty: req.body.difficulty
    });

    const word = await newWord.save();
    res.status(201).json(word);
  } catch (err) {
    console.error('Error creating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update word
router.put('/:id', async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      {
        english: req.body.english,
        turkish: req.body.turkish,
        category: req.body.category,
        exampleSentence: req.body.exampleSentence,
        pronunciation: req.body.pronunciation,
        difficulty: req.body.difficulty
      },
      { new: true }
    );
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    res.json(word);
  } catch (err) {
    console.error('Error updating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete word
router.delete('/:id', async (req, res) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    res.json({ message: 'Word removed' });
  } catch (err) {
    console.error('Error deleting word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;