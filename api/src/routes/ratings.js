const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratings');

// Get all ratings for an event
router.get('/events/:eventId/ratings', ratingsController.getEventRatings);

// Submit or update a rating for an event
router.post('/events/:eventId/ratings', ratingsController.submitRating);

// Get host rating summary
router.get('/hosts/:hostId/ratings', ratingsController.getHostRatings);

module.exports = router;
