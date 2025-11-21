import { registerAs } from '@nestjs/config';

/**
 * Application configuration
 * @returns {object} Configuration object
 */
export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cevra-db',
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  openaiApiKey: process.env.OPENAI_API_KEY,
}));