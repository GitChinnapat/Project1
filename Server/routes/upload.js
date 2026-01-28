const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Upload image
router.post('/', uploadController.uploadImageBase64);

// Delete image
router.delete('/', uploadController.deleteImage);

module.exports = router;
