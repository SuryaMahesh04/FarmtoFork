const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth'); // Optionally protect it

// Setup multer memory storage since we pass buffer straight to Vercel
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Using post route
router.post('/certificate', upload.single('document'), uploadFile);

module.exports = router;
