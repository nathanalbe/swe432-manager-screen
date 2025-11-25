// Schedule Service - Business Logic
const Assignment = require('../models/Assignment');
const DJ = require('../models/DJ');

/**
 * Validate assignment data
 */
function validateAssignment(date, timeSlot, djId) {
  const errors = [];
  
  if (!date) {
    errors.push('Date is required');
  } else {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('Date cannot be in the past');
    }
  }
  
  if (!timeSlot) {
    errors.push('Time slot is required');
  }
  
  if (!djId) {
    errors.push('DJ is required');
  }
  
  return errors;
}

/**
 * Check for conflicts (same DJ in multiple slots on same day)
 */
async function checkConflicts(date, assignments) {
  const errors = [];
  const { morning, afternoon, evening } = assignments;
  
  // Check for duplicate DJ assignments
  if (morning && afternoon && morning === afternoon) {
    errors.push('A DJ cannot be assigned to both Morning and Afternoon slots');
  }
  if (morning && evening && morning === evening) {
    errors.push('A DJ cannot be assigned to both Morning and Evening slots');
  }
  if (afternoon && evening && afternoon === evening) {
    errors.push('A DJ cannot be assigned to both Afternoon and Evening slots');
  }
  
  // Check if DJs exist
  const djIds = [morning, afternoon, evening].filter(id => id);
  const djs = await DJ.find({ _id: { $in: djIds } });
  if (djs.length !== djIds.length) {
    errors.push('One or more selected DJs do not exist');
  }
  
  return errors;
}

/**
 * Create assignments for a date
 */
async function createAssignments(date, assignments) {
  const errors = [];
  const { morning, afternoon, evening } = assignments;
  
  // Validate all fields
  if (!date) errors.push('Date is required');
  if (!morning) errors.push('Morning slot must have a DJ assigned');
  if (!afternoon) errors.push('Afternoon slot must have a DJ assigned');
  if (!evening) errors.push('Evening slot must have a DJ assigned');
  
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  // Check for conflicts
  const conflictErrors = await checkConflicts(date, assignments);
  if (conflictErrors.length > 0) {
    return { success: false, errors: conflictErrors };
  }
  
  // Validate date
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return { success: false, errors: ['Date cannot be in the past'] };
  }
  
  try {
    // Delete existing assignments for this date
    await Assignment.deleteMany({
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      }
    });
    
    // Create new assignments
    const assignmentDate = new Date(date);
    assignmentDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    await Assignment.insertMany([
      { date: assignmentDate, timeSlot: 'Morning', djId: morning },
      { date: assignmentDate, timeSlot: 'Afternoon', djId: afternoon },
      { date: assignmentDate, timeSlot: 'Evening', djId: evening }
    ]);
    
    return { success: true, errors: [] };
  } catch (error) {
    console.error('Error creating assignments:', error);
    return { success: false, errors: ['Error saving assignments to database'] };
  }
}

/**
 * Get formatted assignments for a date
 */
async function getAssignmentsForDate(date) {
  const assignments = await Assignment.getAssignmentsByDate(date);
  return assignments.map(a => ({
    timeSlot: a.timeSlot,
    dj: a.djId.name,
    djId: a.djId._id
  }));
}

module.exports = {
  validateAssignment,
  checkConflicts,
  createAssignments,
  getAssignmentsForDate
};

