
Write-Host "Starting Deployment Process..." -ForegroundColor Cyan

# 1. Git Commit
Write-Host "`n[1/3] Committing changes to Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    git commit -m "feat: complete content overhaul and firebase integration"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git commit successful." -ForegroundColor Green
    } else {
        Write-Host "Git commit failed or nothing to commit." -ForegroundColor Yellow
    }
} else {
    Write-Host "Git add failed. Please check your git installation." -ForegroundColor Red
    exit
}

# 2. Build
Write-Host "`n[2/3] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    exit
}
Write-Host "Build successful." -ForegroundColor Green

# 3. Firebase Deploy
Write-Host "`n[3/3] Deploying to Firebase..." -ForegroundColor Yellow
# Try global firebase command first
if (Get-Command firebase -ErrorAction SilentlyContinue) {
    firebase deploy
} else {
    Write-Host "Global 'firebase' command not found. Trying 'npx firebase-tools deploy'..." -ForegroundColor Yellow
    npx firebase-tools deploy
}

Write-Host "`nDeployment process finished." -ForegroundColor Cyan
