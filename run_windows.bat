@echo off
cd /d "%~dp0"
echo Starting ShelfWise Python server...
python -m pip install -r requirements.txt
python app.py
pause
