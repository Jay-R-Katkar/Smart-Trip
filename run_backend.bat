@echo off
echo ===================================================
echo Starting SmartTrip Backend Server (Flask)...
echo ===================================================
cd backend
python -m pip install -r requirements.txt
python seeds.py
python app.py
pause
