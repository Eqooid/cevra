# Cevra

A modern full-stack application for document management and intelligent chat with vector search capabilities. Built with NestJS (API), Next.js (UI), MongoDB for data storage, and Qdrant for vector operations.

## 🚀 Features

- **Document Management**: Upload, store, and manage documents with metadata
- **Vector Search**: Advanced similarity search using Qdrant vector database
- **Chat System**: Interactive chat interface with AI-powered responses
- **Dashboard Analytics**: Real-time metrics and usage statistics
- **File Processing**: Support for PDF and text document processing
- **RESTful API**: Well-structured API built with NestJS
- **Modern UI**: Responsive dashboard built with Next.js and Tailwind CSS

## 🏗️ Architecture

### Backend (API)
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Vector Database**: Qdrant for similarity search
- **AI Integration**: LangChain with OpenAI
- **Features**: File upload, document processing, chat management, vector operations

### Frontend (UI)
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: Zustand
- **Data Fetching**: SWR with Axios
- **Features**: Dashboard, chat interface, document management, analytics

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB 7.0
- **Vector DB**: Qdrant v1.15.1
- **Networking**: Bridge network for service communication

## 📋 Prerequisites

Before running this project, make sure you have:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **OpenAI API Key** (for AI chat functionality)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cevra
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy from example (if available)
cp .env.example .env
```

Edit the `.env` file and add your configuration:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override default database credentials
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=cevra
```

### 3. Run with Docker Compose

#### Production Mode (Recommended)

```bash
# Start all services in production mode
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Development Mode

For development with hot-reload:

```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Access the Application

Once all services are running:

- **UI Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:3001
- **MongoDB**: localhost:27017
- **Qdrant Dashboard**: http://localhost:6333/dashboard

## 🐳 Docker Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| UI | cevra-ui | 3000 | Next.js frontend dashboard |
| API | cevra-api | 3001 | NestJS backend API |
| MongoDB | cevra-mongodb | 27017 | Document database |
| Qdrant | cevra-qdrant | 6333, 6334 | Vector database |

## 🛠️ Development

### Local Development Setup

If you prefer to run services locally without Docker:

#### Backend (API)
```bash
cd api
npm install
npm run start:dev
```

#### Frontend (UI)
```bash
cd ui
npm install
npm run dev
```

### Useful Docker Commands

```bash
# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build -d

# View service logs
docker-compose logs [service-name]

# Execute commands in containers
docker-compose exec api npm run test
docker-compose exec ui npm run lint

# Clean up volumes (⚠️ This will delete all data)
docker-compose down -v
```

### PowerShell Rebuild Script

For Windows users, use the provided PowerShell script:

```powershell
# Rebuild all containers with clean volumes
.\rebuild-docker.ps1
```

## 📁 Project Structure

```
cevra/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── chat/          # Chat functionality
│   │   ├── vector-storage/ # Vector operations
│   │   ├── qdrant/        # Qdrant integration
│   │   └── config/        # Configuration files
│   ├── schemas/           # MongoDB schemas
│   ├── uploads/           # File storage
│   └── Dockerfile
├── ui/                     # Next.js Frontend
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── apis/              # API client
│   └── Dockerfile
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
└── mongo-init.js          # MongoDB initialization
```

## 🔧 Configuration

### Environment Variables

#### API Configuration
- `MONGODB_URI`: MongoDB connection string
- `QDRANT_URL`: Qdrant service URL
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: API server port (default: 3000)

#### UI Configuration
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: Environment mode

### Database Initialization

MongoDB is automatically initialized with:
- Admin user credentials (configurable via environment)
- Default database and collections
- Indexes for optimal performance

## 📊 API Endpoints

### Main Endpoints
- `GET /` - Health check
- `POST /vector-storage` - Upload and process documents
- `GET /vector-storage` - List stored documents
- `POST /chat` - Create chat conversations
- `GET /chat` - List chat conversations

### File Operations
- `POST /vector-storage/upload` - Upload documents
- `GET /vector-storage/:id` - Get document details
- `DELETE /vector-storage/:id` - Delete documents

## 🧪 Testing

```bash
# Run API tests
docker-compose exec api npm run test

# Run e2e tests
docker-compose exec api npm run test:e2e

# Run UI tests
docker-compose exec ui npm run test
```

## 🚨 Troubleshooting

### Common Issues

1. **Services won't start**
   ```bash
   # Check Docker is running
   docker --version
   docker-compose --version
   
   # Check port availability
   netstat -an | findstr "3000\|3001\|27017\|6333"
   ```

2. **Database connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Verify network connectivity
   docker-compose exec api ping mongodb
   ```

3. **Vector search not working**
   ```bash
   # Check Qdrant status
   docker-compose logs qdrant
   curl http://localhost:6333/health
   ```

4. **OpenAI API errors**
   - Verify your API key is correct in `.env`
   - Check API quota and usage limits
   - Ensure the key has necessary permissions

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v
docker system prune -f

# Restart fresh
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Create an issue in the repository

---

**Happy coding! 🎉**