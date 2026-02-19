const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      // Limit search string length to prevent ReDoS attacks
      const sanitizedSearch = search.substring(0, 100);
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    // Validate id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Event ID' });
    }

    const event = await Event.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, googleFormLink, category, status } =
      req.body;

    if (!title || !description || !date || !location || !googleFormLink) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      googleFormLink,
      category,
      status: status || 'upcoming',
      createdBy: req.admin._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin only)
const updateEvent = async (req, res) => {
  try {
    // Validate id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Event ID' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { title, description, date, location, googleFormLink, category, status } =
      req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.googleFormLink = googleFormLink || event.googleFormLink;
    event.category = category || event.category;
    event.status = status || event.status;

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
const deleteEvent = async (req, res) => {
  try {
    // Validate id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Event ID' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();

    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
