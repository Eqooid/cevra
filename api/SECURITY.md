# API Security Implementation

This document outlines the security measures implemented in the Cevra API to ensure safe and secure operations.

## Security Features Implemented

### 1. Input Validation
- **Class Validator**: All DTOs use validation decorators to ensure proper input format
- **Sanitization**: Input data is automatically trimmed and sanitized
- **Type Safety**: TypeScript strict mode enabled with runtime validation

### 2. Rate Limiting
- **Global Rate Limit**: 100 requests per minute per IP address
- **Endpoint-Specific Limits**:
  - File uploads: 5 per minute
  - Chat responses: 20 per minute
  - Chat streaming: 10 per minute
  - Similarity search: 30 per minute

### 3. File Upload Security
- **File Size Limit**: Maximum 10MB per file
- **Allowed MIME Types**: Only document formats (PDF, DOC, DOCX, TXT, CSV, XLS, XLSX)
- **Filename Sanitization**: Removes special characters and suspicious extensions
- **Extension Blocking**: Blocks executable files (.exe, .bat, .cmd, .scr, etc.)

### 4. CORS Configuration
- **Environment-based Origins**: Different allowed origins for development and production
- **Method Restriction**: Only allows GET, POST, PUT, DELETE methods
- **Header Control**: Restricts allowed headers to Content-Type and Authorization

### 5. Security Headers
- **Helmet.js**: Adds various HTTP security headers
- **Content Security Policy**: Prevents XSS attacks
- **HSTS**: Enforces HTTPS in production

### 6. Error Handling
- **Global Exception Filter**: Consistent error responses across all endpoints
- **Error Logging**: All errors are logged with context
- **Production Safety**: Internal errors are not exposed in production

### 7. Parameter Validation
- **MongoDB ObjectId Validation**: All ID parameters are validated as proper ObjectIds
- **Custom Pipes**: Custom validation pipes for specific data types

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cevra-db

# Vector Database
QDRANT_URL=http://localhost:6333

# AI Service
OPENAI_API_KEY=your_openai_api_key_here

# Security (Optional - has defaults)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_TTL=60000
RATE_LIMIT_REQUESTS=100
MAX_FILE_SIZE=10485760
```

## Security Best Practices

### 1. Input Validation
- All user inputs are validated using class-validator decorators
- Length limits are enforced on all string inputs
- MongoDB ObjectIds are validated for database operations

### 2. File Uploads
- Only allow necessary file types
- Implement file size limits
- Scan uploaded files for malware (recommended for production)
- Store files outside the web root

### 3. Rate Limiting
- Implement appropriate rate limits for each endpoint type
- Consider user-based rate limiting for authenticated endpoints
- Monitor and adjust limits based on usage patterns

### 4. Error Handling
- Never expose internal system information in error messages
- Log all errors for monitoring and debugging
- Use consistent error response format

### 5. CORS Configuration
- Only allow necessary origins
- Restrict HTTP methods to those actually used
- Be specific about allowed headers

## Monitoring and Logging

- All requests are logged with method, URL, and response status
- Errors include stack traces for debugging (development only)
- Consider implementing structured logging for production

## Production Deployment Recommendations

1. **Use HTTPS**: Always use SSL/TLS certificates in production
2. **Environment Variables**: Store sensitive data in environment variables
3. **Database Security**: Use database authentication and restrict access
4. **Network Security**: Implement firewall rules and VPN access
5. **Regular Updates**: Keep dependencies updated for security patches
6. **Monitoring**: Implement application monitoring and alerting
7. **Backup Strategy**: Regular database backups with encryption

## Testing Security

```bash
# Install and run security audit
npm audit

# Fix known vulnerabilities
npm audit fix

# Run tests
npm run test

# Check for vulnerable dependencies
npm install -g retire
retire
```

## Security Headers Added

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (production only)
- `Content-Security-Policy`

## API Endpoint Security Summary

| Endpoint | Validation | Rate Limit | Special Security |
|----------|------------|------------|------------------|
| GET /chat/all-chats | None | Global | None |
| GET /chat/chat-detail/:id | ObjectId | Global | None |
| POST /chat/create-chat | Full DTO | Global | None |
| PUT /chat/update-chat/:id | ObjectId + DTO | Global | None |
| DELETE /chat/delete-chat/:id | ObjectId | Global | None |
| POST /chat/similarity-search | Full DTO | 30/min | None |
| POST /chat/chat-response | Full DTO | 20/min | None |
| POST /chat/chat-stream | Full DTO | 10/min | None |
| POST /vector-storage/upload/:id | File + ObjectId | 5/min | File validation |
| All other endpoints | As configured | Global | Standard |

This security implementation provides a robust foundation for the Cevra API, protecting against common vulnerabilities while maintaining functionality and performance.