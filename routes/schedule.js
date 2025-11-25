// Schedule Routes
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// GET /schedule - Render schedule page
router.get('/', scheduleController.renderSchedulePage);

// POST /schedule - Handle form submission
router.post('/', scheduleController.handleScheduleSubmit);

// GET /schedule/assignments/:date - Get assignments for date (API)
router.get('/assignments/:date', scheduleController.getAssignments);

module.exports = router;

