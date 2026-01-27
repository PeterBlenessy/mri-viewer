@echo off
REM Build script for OpenScans Python Backend (Windows)

echo ================================
echo OpenScans Python Backend Build
echo ================================
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Virtual environment activated
echo.

REM Install PyInstaller if not already installed
echo Checking PyInstaller...
pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo Installing PyInstaller...
    pip install pyinstaller
) else (
    echo   PyInstaller already installed
)

REM Clean previous builds
echo.
echo Cleaning previous builds...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist
echo   Cleaned
echo.

REM Run PyInstaller
echo Building executable...
echo This may take 5-10 minutes...
echo.

pyinstaller build.spec

echo.
echo ================================
echo Build Complete!
echo ================================
echo.
echo Executable location:
echo   dist\openscans-inference\
echo.
echo Test the executable:
echo   cd dist\openscans-inference
echo   openscans-inference.exe
echo.

pause
