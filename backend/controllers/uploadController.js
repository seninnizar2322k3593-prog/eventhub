const ImageUpload = require('../models/ImageUpload');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload image
// @route   POST /api/uploads
// @access  Public
const uploadImage = async (req, res) => {
  try {
    const { eventId, uploadedBy, uploaderEmail } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageUpload = await ImageUpload.create({
      eventId,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      uploadedBy,
      uploaderEmail,
    });

    res.status(201).json(imageUpload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all uploads
// @route   GET /api/uploads
// @access  Private (Admin only)
const getAllUploads = async (req, res) => {
  try {
    const { status, eventId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (eventId) {
      query.eventId = eventId;
    }

    const uploads = await ImageUpload.find(query)
      .populate('eventId', 'title date')
      .populate('reviewedBy', 'name email')
      .sort({ uploadedAt: -1 });

    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get uploads by event
// @route   GET /api/uploads/event/:eventId
// @access  Public
const getUploadsByEvent = async (req, res) => {
  try {
    const uploads = await ImageUpload.find({
      eventId: req.params.eventId,
      status: 'approved', // Only show approved images publicly
    }).sort({ uploadedAt: -1 });

    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve image
// @route   PATCH /api/uploads/:id/approve
// @access  Private (Admin only)
const approveImage = async (req, res) => {
  try {
    const upload = await ImageUpload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    upload.status = 'approved';
    upload.reviewedAt = Date.now();
    upload.reviewedBy = req.admin._id;

    const updatedUpload = await upload.save();

    res.json(updatedUpload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject image
// @route   PATCH /api/uploads/:id/reject
// @access  Private (Admin only)
const rejectImage = async (req, res) => {
  try {
    const upload = await ImageUpload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    upload.status = 'rejected';
    upload.reviewedAt = Date.now();
    upload.reviewedBy = req.admin._id;

    const updatedUpload = await upload.save();

    res.json(updatedUpload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete image
// @route   DELETE /api/uploads/:id
// @access  Private (Admin only)
const deleteImage = async (req, res) => {
  try {
    const upload = await ImageUpload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(upload.cloudinaryId);

    // Delete from database
    await upload.deleteOne();

    res.json({ message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadImage,
  getAllUploads,
  getUploadsByEvent,
  approveImage,
  rejectImage,
  deleteImage,
};
