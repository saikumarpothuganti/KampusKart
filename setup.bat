@echo off
REM KampusKart Project Setup Script for Windows
REM This script sets up both frontend and backend with all dependencies

echo.
echo KampusKart Setup Script
echo =======================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo [OK] Node.js version: %NODE_VERSION%
echo [OK] npm version: %NPM_VERSION%
echo.

REM Backend Setup
echo Setting up Backend...
cd server

if not exist ".env" (
    echo [INFO] Creating .env file from .env.example
    copy .env.example .env
    echo.
    echo [WARNING] Please fill in your .env file with actual credentials:
    echo   1. MONGODB_URI - MongoDB Atlas connection string
    echo   2. JWT_SECRET - Your JWT secret
    echo   3. Cloudinary credentials
    echo.
)

echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [OK] Backend setup complete
echo.

REM Frontend Setup
echo Setting up Frontend...
cd ..\client

echo Installing frontend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [OK] Frontend setup complete
echo.

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Fill in your .env file in server\ directory
echo 2. Run backend: cd server && npm run dev
echo 3. Run frontend: cd client && npm run dev
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo See QUICKSTART.md for more information
echo.

pause
