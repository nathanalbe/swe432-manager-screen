// Report Routes
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /report - Render report page
router.get('/', reportController.renderReportPage);

// POST /report - Handle filter submission
router.post('/', reportController.handleReportFilter);

// GET /report/data - Get report data (API)
router.get('/data', reportController.getReportData);

module.exports = router;

