const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['sensor', 'camera', 'gateway', 'controller', 'traffic_light', 'smart_meter', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'warning', 'critical'],
    default: 'offline'
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      trim: true
    },
    zone: {
      type: String,
      enum: ['downtown', 'industrial', 'residential', 'commercial', 'transport'],
      required: true
    }
  },
  ipAddress: {
    type: String,
    required: true
  },
  macAddress: {
    type: String,
    required: true
  },
  firmware: {
    version: String,
    lastUpdated: Date
  },
  specifications: {
    manufacturer: String,
    model: String,
    serialNumber: String
  },
  security: {
    encryptionEnabled: {
      type: Boolean,
      default: false
    },
    lastSecurityScan: Date,
    vulnerabilities: [{
      severity: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low']
      },
      description: String,
      cve: String,
      detectedAt: Date
    }],
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  metrics: {
    uptime: {
      type: Number,
      default: 0
    },
    lastSeen: Date,
    dataRate: {
      bytesPerSecond: Number
    },
    responseTime: {
      type: Number, // in milliseconds
      default: 0
    }
  },
  anomalyDetection: {
    enabled: {
      type: Boolean,
      default: true
    },
    baselineBehavior: {
      normalTrafficPattern: mongoose.Schema.Types.Mixed,
      typicalResponseTime: Number,
      averageDataRate: Number
    },
    lastAnomalyDetected: Date
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
deviceSchema.index({ status: 1, 'location.zone': 1 });
deviceSchema.index({ 'security.riskScore': -1 });
deviceSchema.index({ 'metrics.lastSeen': -1 });

// Virtual for days since last update
deviceSchema.virtual('daysSinceUpdate').get(function() {
  if (!this.firmware.lastUpdated) return null;
  const diff = Date.now() - this.firmware.lastUpdated.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Method to update device status
deviceSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  this.metrics.lastSeen = new Date();
  return this.save();
};

// Static method to get devices by zone
deviceSchema.statics.getDevicesByZone = function(zone) {
  return this.find({ 'location.zone': zone, isActive: true });
};

// Static method to get high-risk devices
deviceSchema.statics.getHighRiskDevices = function(threshold = 70) {
  return this.find({ 
    'security.riskScore': { $gte: threshold },
    isActive: true 
  }).sort({ 'security.riskScore': -1 });
};

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
