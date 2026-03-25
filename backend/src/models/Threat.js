const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  threatId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'malware',
      'ddos',
      'unauthorized_access',
      'data_breach',
      'phishing',
      'ransomware',
      'botnet',
      'zero_day',
      'insider_threat',
      'iot_exploit',
      'other'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['detected', 'investigating', 'contained', 'resolved', 'false_positive'],
    default: 'detected',
    index: true
  },
  source: {
    ipAddress: String,
    port: Number,
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    },
    geolocation: {
      country: String,
      city: String,
      latitude: Number,
      longitude: Number
    }
  },
  target: {
    ipAddress: String,
    port: Number,
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    },
    affectedSystems: [String]
  },
  detection: {
    method: {
      type: String,
      enum: ['ml_model', 'signature', 'behavioral', 'anomaly', 'manual'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    modelVersion: String,
    detectedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  description: {
    type: String,
    required: true
  },
  indicators: {
    patterns: [String],
    signatures: [String],
    behaviors: [String]
  },
  impact: {
    dataCompromised: Boolean,
    systemsAffected: Number,
    estimatedLoss: Number,
    businessImpact: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical']
    }
  },
  mitigation: {
    automated: {
      type: Boolean,
      default: false
    },
    actions: [{
      action: String,
      timestamp: Date,
      performedBy: {
        type: String,
        enum: ['system', 'analyst', 'ai']
      },
      result: String
    }],
    recommendations: [String]
  },
  investigation: {
    assignedTo: String,
    notes: [{ 
      note: String,
      timestamp: Date,
      author: String
    }],
    evidenceCollected: [String],
    rootCause: String
  },
  compliance: {
    reportingRequired: Boolean,
    regulations: [String], // e.g., ['SAMA', 'NESA', 'GDPR']
    reportedAt: Date,
    reportNumber: String
  },
  relatedThreats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Threat'
  }],
  timeline: {
    firstSeen: Date,
    lastSeen: Date,
    resolvedAt: Date,
    duration: Number // in seconds
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
threatSchema.index({ severity: 1, status: 1, 'detection.detectedAt': -1 });
threatSchema.index({ 'source.ipAddress': 1 });
threatSchema.index({ 'target.deviceId': 1 });

// Virtual for threat age
threatSchema.virtual('ageInHours').get(function() {
  const diff = Date.now() - this.detection.detectedAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
});

// Method to resolve threat
threatSchema.methods.resolve = function(userId, note) {
  this.status = 'resolved';
  this.timeline.resolvedAt = new Date();
  this.timeline.duration = Math.floor(
    (this.timeline.resolvedAt - this.detection.detectedAt) / 1000
  );
  this.investigation.notes.push({
    note,
    timestamp: new Date(),
    author: userId
  });
  return this.save();
};

// Static method to get active threats by severity
threatSchema.statics.getActiveThreatsBySeverity = function(severity) {
  return this.find({ 
    severity, 
    status: { $in: ['detected', 'investigating', 'contained'] },
    isActive: true 
  }).sort({ 'detection.detectedAt': -1 });
};

// Static method to get threat statistics
threatSchema.statics.getStatistics = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'detection.detectedAt': { $gte: startDate, $lte: endDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          severity: '$severity',
          type: '$type'
        },
        count: { $sum: 1 },
        avgConfidence: { $avg: '$detection.confidence' },
        avgResolutionTime: { $avg: '$timeline.duration' }
      }
    }
  ]);
};

const Threat = mongoose.model('Threat', threatSchema);

module.exports = Threat;
