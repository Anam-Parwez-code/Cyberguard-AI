const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get threats endpoint - Coming soon!',
    data: []
  });
});

module.exports = router;
