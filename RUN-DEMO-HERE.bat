@echo off
REM Quick Demo Runner for Windows
REM Run this file to test all demo commands

echo ========================================
echo PR Review Agent - Demo Test
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Validating agent structure...
node scripts/validate-structure.mjs
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Validation failed
    pause
    exit /b 1
)
echo.

echo [2/4] Running offline heuristics scan...
node scripts/local-heuristics.mjs fixtures/sample.patch
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Heuristics failed
    pause
    exit /b 1
)
echo.

echo [3/4] Checking .env file...
if not exist .env (
    echo WARNING: .env file not found
    echo Please copy .env.example to .env and add your ANTHROPIC_API_KEY
    echo.
    pause
    exit /b 1
)

echo [4/4] Running full AI review with gitclaw...
echo NOTE: This requires ANTHROPIC_API_KEY in .env
node scripts/run-demo.mjs
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Demo failed - check your API key in .env
    pause
    exit /b 1
)
echo.

echo ========================================
echo Demo completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Record your screen running this script
echo 2. Upload video to YouTube/Loom
echo 3. Submit to hackathon!
echo.
pause
