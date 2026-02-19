const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimitMiddleware');

router.route('/').get(apiLimiter, getEvents).post(protect, apiLimiter, createEvent);
router
  .route('/:id')
  .get(apiLimiter, getEventById)
  .put(protect, apiLimiter, updateEvent)
  .delete(protect, apiLimiter, deleteEvent);

module.exports = router;
