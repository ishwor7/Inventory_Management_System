const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, uploadController.uploadMiddleware, uploadController.uploadImage);

module.exports = router;
