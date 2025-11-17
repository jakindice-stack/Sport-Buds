const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');

// Submit a report for an event
router.post('/events/:eventId/reports', reportsController.submitEventReport);

// List all reports (admin only)
router.get('/', reportsController.listReports);

module.exports = router;
