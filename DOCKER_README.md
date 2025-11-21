# Cevra Docker Setup

This project uses Docker and Docker Compose to run the API and UI services along with required dependencies (MongoDB and Qdrant).

## Prerequisites

- Docker
- Docker Compose
- OpenAI API Key

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

3. **Run the application in production mode**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB on port 27017
   - Qdrant on ports 6333/6334
   - API on port 3001
   - UI on port 3000

4. **Access the application**
   - UI: http://localhost:3000
   - API: http://localhost:3001

## Development Mode

For development with hot reloading:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will mount your source code as volumes, enabling hot reloading for both API and UI.

## Available Commands

### Production
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build -d
```

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Individual Services
```bash
# Start only database services
docker-compose up -d mongodb qdrant

# Start only API
docker-compose up -d api

# Start only UI
docker-compose up -d ui
```

## Service Details

### API (NestJS)
- **Port**: 3001
- **Environment**: Production optimized with multi-stage build
- **Dependencies**: MongoDB, Qdrant
- **Health Check**: Available at `/health`

### UI (Next.js)
- **Port**: 3000
- **Environment**: Production optimized with standalone output
- **Dependencies**: API service

### MongoDB
- **Port**: 27017
- **Username**: admin
- **Password**: password123
- **Database**: cevra
- **Persistent Storage**: `mongodb_data` volume

### Qdrant (Vector Database)
- **Port**: 6333 (HTTP API)
- **Port**: 6334 (gRPC)
- **Persistent Storage**: `qdrant_data` volume

## Docker Images

### API Dockerfile
- Multi-stage build with development, build, and production stages
- Uses Node.js 18 Alpine for smaller image size
- Non-root user for security
- Health checks included

### UI Dockerfile
- Multi-stage build optimized for Next.js
- Standalone output for minimal production image
- Static files properly handled
- Non-root user for security

## Volumes

- `mongodb_data`: Persists MongoDB data
- `qdrant_data`: Persists Qdrant vector data
- `./api/uploads`: File uploads directory

## Networks

- `cevra-network`: Bridge network for service communication

## Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key

### Optional (have defaults)
- `MONGODB_URI`: MongoDB connection string
- `QDRANT_URL`: Qdrant server URL
- `PORT`: API server port
- `NEXT_PUBLIC_API_URL`: API URL for the UI

## Troubleshooting

### Common Issues

1. **Port conflicts**
   - Change ports in docker-compose.yml if 3000, 3001, 27017, or 6333 are already in use

2. **Permission issues**
   - Ensure Docker has permissions to access the project directory
   - On Windows, ensure the drive is shared in Docker Desktop settings

3. **Build failures**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

4. **Database connection issues**
   - Ensure MongoDB service is running: `docker-compose ps`
   - Check logs: `docker-compose logs mongodb`

### Useful Commands

```bash
# Check running containers
docker-compose ps

# View logs for specific service
docker-compose logs -f api

# Execute commands in running container
docker-compose exec api npm run test

# Remove all containers and volumes
docker-compose down -v

# Clean up unused Docker resources
docker system prune -a
```

## Production Deployment

For production deployment:

1. Use a production-ready MongoDB setup (MongoDB Atlas recommended)
2. Set up proper environment variables
3. Configure reverse proxy (nginx) for HTTPS
4. Set up proper logging and monitoring
5. Use Docker secrets for sensitive data
6. Consider using Docker Swarm or Kubernetes for orchestration

## Security Notes

- The default MongoDB credentials are for development only
- Change default passwords in production
- Use Docker secrets or external secret management
- Enable authentication and authorization properly
- Use HTTPS in production
- Regular security updates for base images