const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profiles');

// Get all profiles with optional filtering
router.get('/', profilesController.getProfiles);

// Get current user's profile
router.get('/me', profilesController.getMyProfile);

// Update current user's profile
router.patch('/me', profilesController.updateMyProfile);

// Get a specific profile by ID
router.get('/:profileId', profilesController.getProfileById);

// Create a new profile (for the current user)
router.post('/', profilesController.createProfile);

module.exports = router;
