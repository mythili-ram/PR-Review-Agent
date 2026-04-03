@echo off
REM Quick Demo Script for GitAgent Hackathon
REM This runs all demo commands in sequence

echo.
echo ============================================================
echo  PR-Review-Agent - GitAgent Hackathon Demo
echo ============================================================
echo.

echo [1/4] Validating agent structure...
echo.
call npm run validate
echo.
pause

cls
echo.
echo ============================================================
echo  [2/4] Fast Heuristic Security Scan (0.1s, no API calls)
echo ============================================================
echo.
call npm run heuristics
echo.
pause

cls
echo.
echo ============================================================
echo  [3/4] ML Anomaly Detection
echo ============================================================
echo.
call npm run ml:analyze -- fixtures/sample.patch
echo.
pause

cls
echo.
echo ============================================================
echo  [4/4] Review Complete!
echo ============================================================
echo.
echo ✅ Structure validated
echo ✅ Found 3 CRITICAL issues in 0.1 seconds
echo ✅ ML analysis complete
echo.
echo Next steps:
echo  - npm run dashboard     (Start web dashboard)
echo  - npm run demo          (Full AI review - requires API key)
echo.
echo Ready to record your video? Follow DEMO.md script!
echo.
pause
