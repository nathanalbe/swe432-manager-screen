// Assignment Model - Mongoose Schema
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ['Morning', 'Afternoon', 'Evening'],
    trim: true
  },
  djId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DJ',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Compound index for conflict checking (prevent duplicate assignments)
assignmentSchema.index({ date: 1, timeSlot: 1, djId: 1 }, { unique: true });

// Index for querying by date
assignmentSchema.index({ date: 1 });

// Static method to get assignments by date
assignmentSchema.statics.getAssignmentsByDate = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).populate('djId', 'name experienceYears').sort({ timeSlot: 1 });
};

// Static method to check if assignment exists
assignmentSchema.statics.getAssignmentByDateAndSlot = function(date, timeSlot) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    timeSlot: timeSlot
  }).populate('djId');
};

module.exports = mongoose.model('Assignment', assignmentSchema);

