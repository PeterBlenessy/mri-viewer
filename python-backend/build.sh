#!/bin/bash
# Build script for OpenScans Python Backend

set -e  # Exit on error

echo "================================"
echo "OpenScans Python Backend Build"
echo "================================"
echo

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Install PyInstaller if not already installed
echo "Checking PyInstaller..."
if ! pip show pyinstaller > /dev/null 2>&1; then
    echo "Installing PyInstaller..."
    pip install pyinstaller
else
    echo "✓ PyInstaller already installed"
fi

# Clean previous builds
echo
echo "Cleaning previous builds..."
rm -rf build dist
echo "✓ Cleaned"

# Run PyInstaller
echo
echo "Building executable..."
echo "This may take 5-10 minutes..."
echo

pyinstaller build.spec

echo
echo "================================"
echo "Build Complete!"
echo "================================"
echo
echo "Executable location:"
echo "  dist/openscans-inference/"
echo
echo "Test the executable:"
echo "  cd dist/openscans-inference"
echo "  ./openscans-inference"
echo
