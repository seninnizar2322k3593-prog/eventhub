const express = require('express');
const router = express.Router();
const {
  uploadImage,
  getAllUploads,
  getUploadsByEvent,
  approveImage,
  rejectImage,
  deleteImage,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { uploadLimiter, apiLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/', uploadLimiter, upload.single('image'), uploadImage);
router.get('/', protect, apiLimiter, getAllUploads);
router.get('/event/:eventId', apiLimiter, getUploadsByEvent);
router.patch('/:id/approve', protect, apiLimiter, approveImage);
router.patch('/:id/reject', protect, apiLimiter, rejectImage);
router.delete('/:id', protect, apiLimiter, deleteImage);

module.exports = router;
