@echo off
title Dental Intake Demo Launcher

echo.
echo Starting Backend...
start cmd /k "cd backend && npm run dev"

timeout /t 4 >nul

echo.
echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo ====================================
echo Demo launching...
echo Backend:  http://localhost:5000/api/health
echo Frontend: http://localhost:3000/intake
echo ====================================
echo.
pause