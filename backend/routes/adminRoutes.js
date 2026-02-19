const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  verifyAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, apiLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', authLimiter, registerAdmin);
router.post('/login', authLimiter, loginAdmin);
router.get('/verify', apiLimiter, protect, verifyAdmin);

module.exports = router;
