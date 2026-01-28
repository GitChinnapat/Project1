const express = require('express');
const router = express.Router();
const movingController = require('../controllers/movingController');

// Create moving request
router.post('/', movingController.createMoving);

// Get all moving requests
router.get('/', movingController.getAllMoving);

// Get moving by ID
router.get('/:id', movingController.getMovingById);

// Update moving
router.put('/:id', movingController.updateMoving);

// Delete moving
router.delete('/:id', movingController.deleteMoving);

module.exports = router;
