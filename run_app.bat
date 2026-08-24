@echo off
echo ===================================================
echo   Welcome to SmartTrip Travel Automation Platform
echo ===================================================
echo [1] Start Frontend Application
echo [2] Run Backend Pytest Test Suite
echo [3] Seed Database with 8 Global Cities
echo [4] Exit
echo.
set /p choice="Enter option (1-4): "

if "%choice%"=="1" (
    call run_frontend.bat
)
if "%choice%"=="2" (
    cd backend
    python -m pytest tests/test_routes.py -v
    pause
)
if "%choice%"=="3" (
    cd backend
    python seeds.py
    pause
)
