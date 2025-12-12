const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');

// Submit a report for an event
router.post('/events/:eventId/reports', reportsController.submitEventReport);

// Submit a report for a user
router.post('/users/:userId/reports', reportsController.submitUserReport);

// List all reports (admin only)
router.get('/', reportsController.listReports);

module.exports = router;
