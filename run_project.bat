@echo off
echo ========================================================
echo        OptiCropAI 2.0 - Precision Agriculture Platform
echo ========================================================
echo.

echo [1/2] Launching Backend Flask API on http://127.0.0.1:5000 ...
start "OptiCropAI 2.0 Backend" cmd /k "python backend/run.py"

echo [2/2] Launching Frontend Vite Server on http://localhost:5173 ...
start "OptiCropAI 2.0 Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo OptiCropAI 2.0 services launched successfully!
echo Open your browser at: http://localhost:5173
echo ========================================================
pause

