// Schedule Controller
const DJ = require('../models/DJ');
const Assignment = require('../models/Assignment');
const scheduleService = require('../services/scheduleService');

/**
 * Render schedule page
 */
async function renderSchedulePage(req, res) {
  try {
    // Get all DJs from database
    const djs = await DJ.find().sort({ name: 1 });
    
    // Get saved assignments for today (or selected date)
    const selectedDate = req.query.date || new Date().toISOString().split('T')[0];
    const assignments = await Assignment.getAssignmentsByDate(selectedDate);
    
    // Format assignments for display
    const savedAssignments = assignments.map(a => ({
      timeSlot: a.timeSlot,
      djId: a.djId
    }));
    
    // Get form data from session (for restoration)
    const formData = req.session.scheduleForm || {};
    
    res.render('schedule', {
      djs: djs,
      savedAssignments: savedAssignments,
      formData: formData,
      errors: [],
      success: null
    });
  } catch (error) {
    console.error('Error rendering schedule page:', error);
    res.status(500).send('Error loading schedule page');
  }
}

/**
 * Handle schedule form submission
 */
async function handleScheduleSubmit(req, res) {
  try {
    const { day, morning, afternoon, evening } = req.body;
    
    // Get all DJs for dropdown
    const djs = await DJ.find().sort({ name: 1 });
    
    // Validate and create assignments
    const result = await scheduleService.createAssignments(day, {
      morning,
      afternoon,
      evening
    });
    
    if (!result.success) {
      // Validation failed - render with errors
      const assignments = await Assignment.getAssignmentsByDate(day);
      const savedAssignments = assignments.map(a => ({
        timeSlot: a.timeSlot,
        djId: a.djId
      }));
      
      return res.render('schedule', {
        djs: djs,
        savedAssignments: savedAssignments,
        formData: req.body,
        errors: result.errors,
        success: null
      });
    }
    
    // Success - clear session form data and redirect
    delete req.session.scheduleForm;
    
    // Get updated assignments
    const assignments = await Assignment.getAssignmentsByDate(day);
    const savedAssignments = assignments.map(a => ({
      timeSlot: a.timeSlot,
      djId: a.djId
    }));
    
    res.render('schedule', {
      djs: djs,
      savedAssignments: savedAssignments,
      formData: {},
      errors: [],
      success: 'Assignments saved successfully!'
    });
    
  } catch (error) {
    console.error('Error handling schedule submit:', error);
    const djs = await DJ.find().sort({ name: 1 });
    res.render('schedule', {
      djs: djs,
      savedAssignments: [],
      formData: req.body,
      errors: ['An error occurred while saving assignments'],
      success: null
    });
  }
}

/**
 * Get assignments for a specific date (API endpoint)
 */
async function getAssignments(req, res) {
  try {
    const { date } = req.params;
    const assignments = await Assignment.getAssignmentsByDate(date);
    res.json(assignments);
  } catch (error) {
    console.error('Error getting assignments:', error);
    res.status(500).json({ error: 'Error fetching assignments' });
  }
}

module.exports = {
  renderSchedulePage,
  handleScheduleSubmit,
  getAssignments
};

