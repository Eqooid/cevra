# PowerShell script to rebuild Docker containers with updated dependencies
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "Removing old images to ensure fresh builds..." -ForegroundColor Yellow
docker image prune -f

Write-Host "Pulling latest base images..." -ForegroundColor Yellow
docker pull qdrant/qdrant:v1.15.1
docker pull node:24-alpine

Write-Host "Building and starting containers with no cache..." -ForegroundColor Yellow
docker-compose up --build --no-cache -d

Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Checking container status..." -ForegroundColor Yellow
docker-compose ps

Write-Host "Docker containers rebuilt successfully!" -ForegroundColor Green
Write-Host "You can now test the similarity search functionality." -ForegroundColor Green