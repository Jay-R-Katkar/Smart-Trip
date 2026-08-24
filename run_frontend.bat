@echo off
echo ===================================================
echo Starting SmartTrip Frontend Application...
echo ===================================================
echo Opening SmartTrip in your default web browser...
start http://localhost:5173/index.html
cd frontend
python -m http.server 5173
pause
