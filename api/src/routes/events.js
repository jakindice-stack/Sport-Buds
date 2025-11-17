const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');

// Get all events with optional filtering
router.get('/', eventsController.getEvents);

// Create a new event
router.post('/', eventsController.createEvent);

// Get a specific event by ID
router.get('/:eventId', eventsController.getEventById);

// Update an event
router.patch('/:eventId', eventsController.updateEvent);

// Delete an event
router.delete('/:eventId', eventsController.deleteEvent);

module.exports = router;
