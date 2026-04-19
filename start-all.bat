@echo off
echo Starting EduAI CMS Server...
start "CMS Server" cmd /k "cd /d %~dp0 && node cms-server/server.js"
echo Waiting for CMS to start...
timeout /t 3 /nobreak >nul
echo.
echo Starting Expo Web Preview...
start "Expo Web" cmd /k "cd /d %~dp0 && npm run web"
echo.
echo Services starting...
echo - CMS API: http://localhost:4100
echo - CMS UI: http://localhost:4100/cms
echo - App Preview: http://localhost:8082 (or check the Expo window)
echo.
pause
