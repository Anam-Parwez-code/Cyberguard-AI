const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/reports', protect, authorize('admin', 'analyst'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Compliance reports endpoint - Coming soon!',
    data: []
  });
});

module.exports = router;
