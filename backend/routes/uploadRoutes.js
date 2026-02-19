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

router.post('/', upload.single('image'), uploadImage);
router.get('/', protect, getAllUploads);
router.get('/event/:eventId', getUploadsByEvent);
router.patch('/:id/approve', protect, approveImage);
router.patch('/:id/reject', protect, rejectImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
