const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

router.get('/stats', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      totalDevices: 0,
      activeThreats: 0,
      criticalAlerts: 0,
      systemUptime: 100
    }
  });
});

module.exports = router;
