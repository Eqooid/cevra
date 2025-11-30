import { registerAs } from '@nestjs/config';

/**
 * Security configuration
 * @returns {object} Security configuration object
 */
export const securityConfig = registerAs('security', () => ({
  corsOrigins:
    process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGINS?.split(',') || ['https://yourdomain.com']
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:5173',
        ],
  rateLimiting: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60000, // 1 minute
    limit: parseInt(process.env.RATE_LIMIT_REQUESTS, 10) || 100, // 100 requests
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
}));
