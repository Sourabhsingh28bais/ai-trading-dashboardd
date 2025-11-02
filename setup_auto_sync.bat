@echo off
echo 🚀 Setting up Auto-Sync for Trading Dashboard
echo ================================================

echo 📝 Configuring Git for automatic sync...

REM Set up Git to store credentials
git config --global credential.helper store

REM Set up Git to automatically push
git config --global push.default simple

echo ✅ Git configuration complete!
echo.
echo 🔄 Available sync options:
echo.
echo 1. Manual Sync (run when needed):
echo    python sync_now.py
echo.
echo 2. Auto Sync (runs continuously):
echo    python auto_sync.py
echo.
echo 3. Auto Sync with custom interval:
echo    python auto_sync.py 60    (checks every 60 seconds)
echo.
echo 🔗 Your repository: https://github.com/Sourabhsingh28bais/ai-trading-dashboardd
echo.
pause