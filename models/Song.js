// Song Model - Mongoose Schema
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  previewUrl: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Indexes for faster queries
songSchema.index({ title: 1 });
songSchema.index({ artist: 1 });
songSchema.index({ title: 1, artist: 1 });

// Static method to search songs
songSchema.statics.searchSongs = function(query) {
  const searchRegex = new RegExp(query, 'i'); // Case-insensitive
  return this.find({
    $or: [
      { title: searchRegex },
      { artist: searchRegex }
    ]
  }).sort({ title: 1 });
};

module.exports = mongoose.model('Song', songSchema);

