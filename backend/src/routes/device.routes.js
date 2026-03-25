const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// @desc    Get all devices
// @route   GET /api/v1/devices
// @access  Private
router.get('/', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get devices endpoint - Coming soon!',
    data: []
  });
});

// @desc    Get single device
// @route   GET /api/v1/devices/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get device endpoint - Coming soon!',
    data: {}
  });
});

// @desc    Create device
// @route   POST /api/v1/devices
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create device endpoint - Coming soon!',
    data: {}
  });
});

// @desc    Update device
// @route   PUT /api/v1/devices/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update device endpoint - Coming soon!',
    data: {}
  });
});

// @desc    Delete device
// @route   DELETE /api/v1/devices/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delete device endpoint - Coming soon!',
    data: {}
  });
});

module.exports = router;
