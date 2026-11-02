@echo off
title Portfolio - vista local
cd /d "%~dp0"
echo.
echo   Tu web se esta abriendo en http://localhost:8000
echo   Panel local: http://localhost:8000/admin/
echo   Cierra esta ventana para apagarla.
echo.
start "" http://localhost:8000
where python >nul 2>nul && (python -m http.server 8000) || (py -m http.server 8000)
if errorlevel 1 (
  echo.
  echo   No encontre Python. Instalalo desde python.org y marca "Add Python to PATH".
  pause
)
