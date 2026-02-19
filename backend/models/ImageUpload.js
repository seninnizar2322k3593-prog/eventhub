const mongoose = require('mongoose');

const imageUploadSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    trim: true,
  },
  uploaderEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
});

module.exports = mongoose.model('ImageUpload', imageUploadSchema);
