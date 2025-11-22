# PowerShell script to rebuild Docker containers after adding new packages
param(
    [switch]$Dev,
    [string]$Service = "api"
)

if ($Dev) {
    $ComposeFile = "docker-compose.dev.yml"
    $ServiceName = "api-dev"
    Write-Host "Using development configuration..." -ForegroundColor Cyan
} else {
    $ComposeFile = "docker-compose.yml"
    $ServiceName = "api"
    Write-Host "Using production configuration..." -ForegroundColor Cyan
}

Write-Host "Stopping $ServiceName container..." -ForegroundColor Yellow
docker-compose -f $ComposeFile stop $ServiceName

Write-Host "Removing $ServiceName container and image..." -ForegroundColor Yellow
docker-compose -f $ComposeFile rm -f $ServiceName
docker image rm "cevra-$ServiceName" -f 2>$null

Write-Host "Rebuilding $ServiceName with no cache (to ensure new packages are installed)..." -ForegroundColor Yellow
docker-compose -f $ComposeFile build --no-cache $ServiceName

Write-Host "Starting $ServiceName..." -ForegroundColor Yellow
docker-compose -f $ComposeFile up -d $ServiceName

Write-Host "Waiting for service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Checking container status..." -ForegroundColor Yellow
docker-compose -f $ComposeFile ps $ServiceName

Write-Host "Package update complete!" -ForegroundColor Green
Write-Host "Use './update-packages.ps1 -Dev' for development environment" -ForegroundColor Cyan