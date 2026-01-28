const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');

// Create repair request
router.post('/', repairController.createRepair);

// Get all repair requests
router.get('/', repairController.getAllRepairs);

// Get repair by ID
router.get('/:id', repairController.getRepairById);

// Update repair request
router.put('/:id', repairController.updateRepair);

// Delete repair request
router.delete('/:id', repairController.deleteRepair);

module.exports = router;
