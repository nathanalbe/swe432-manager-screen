// DJ Model - Mongoose Schema
const mongoose = require('mongoose');

const djSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  experienceYears: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're using createdAt manually
});

// Index for faster queries
djSchema.index({ name: 1 });

// Virtual for formatted display name
djSchema.virtual('displayName').get(function() {
  return this.name;
});

module.exports = mongoose.model('DJ', djSchema);

