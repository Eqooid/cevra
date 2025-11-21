# PowerShell script to rebuild Docker containers with updated Qdrant version
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "Removing Qdrant volume to ensure clean start..." -ForegroundColor Yellow
docker volume rm cevra_qdrant_data -f

Write-Host "Pulling latest Qdrant image..." -ForegroundColor Yellow
docker pull qdrant/qdrant:v1.11.0

Write-Host "Building and starting containers..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Checking container status..." -ForegroundColor Yellow
docker-compose ps

Write-Host "Docker containers rebuilt successfully!" -ForegroundColor Green
Write-Host "You can now test the similarity search functionality." -ForegroundColor Green