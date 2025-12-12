const express = require('express');
const router = express.Router();
const rsvpsController = require('../controllers/rsvps');

// Get all RSVPs for an event
router.get('/events/:eventId/rsvps', rsvpsController.getEventRsvps);

// Get all RSVPs for a user
router.get('/users/:userId/rsvps', rsvpsController.getUserRsvps);

// RSVP to an event
router.post('/events/:eventId/rsvps', rsvpsController.createRsvp);

// Confirm an RSVP (host-only)
router.post('/events/:eventId/rsvps/:rsvpId/confirm', rsvpsController.confirmRsvp);

// Cancel current user's RSVP
router.delete('/events/:eventId/rsvps/me', rsvpsController.cancelMyRsvp);

module.exports = router;
