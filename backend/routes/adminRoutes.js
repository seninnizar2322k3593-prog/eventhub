const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  verifyAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/verify', protect, verifyAdmin);

module.exports = router;
