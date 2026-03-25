const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

// Import routes
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const threatRoutes = require('./routes/threat.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const complianceRoutes = require('./routes/compliance.routes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Compress responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/threats', threatRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/compliance', complianceRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('subscribe-threats', (room) => {
    socket.join(room);
    logger.info(`Client ${socket.id} subscribed to ${room}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to databases
    await connectDB();
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 CyberGuard AI Backend running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

startServer();

module.exports = { app, io };
