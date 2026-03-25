const mongoose = require('mongoose');
const { Pool } = require('pg');
const redis = require('redis');
const logger = require('../utils/logger');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// PostgreSQL Connection Pool
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on('connect', () => {
  logger.info('✅ PostgreSQL connected successfully');
});

pgPool.on('error', (err) => {
  logger.error('❌ PostgreSQL connection error:', err);
});

// Redis Connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('❌ Redis connection failed after 10 retries');
        return new Error('Redis connection failed');
      }
      return retries * 100;
    }
  }
});

redisClient.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  logger.error('❌ Redis connection error:', err);
});

// Connect all databases
const connectDB = async () => {
  try {
    await connectMongoDB();
    await redisClient.connect();
    // Test PostgreSQL connection
    await pgPool.query('SELECT NOW()');
    logger.info('🎉 All databases connected successfully');
  } catch (error) {
    logger.error('Failed to connect to databases:', error);
    throw error;
  }
};

module.exports = connectDB;
module.exports.pgPool = pgPool;
module.exports.redisClient = redisClient;
module.exports.mongoose = mongoose;