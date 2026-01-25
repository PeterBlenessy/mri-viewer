#!/bin/bash
# Download anonymized DICOM test files from Cornerstone's official test images
# These files are already anonymized and safe for testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Downloading anonymized DICOM test files from Cornerstone repository..."

# Base URL for Cornerstone test images
BASE_URL="https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages"

# Download single image for basic tests
echo "Downloading CT test image..."
curl -L -o single-image.dcm "$BASE_URL/CTImage.dcm"

# Create multi-series directory
mkdir -p multi-series

# Download a series of images (MR images from Cornerstone examples)
echo "Downloading MR series images..."
curl -L -o multi-series/image1.dcm "$BASE_URL/MRImage.dcm"

# Note: If the repository has numbered series, we can download multiple
# For now, we'll use different modalities as our test series
curl -L -o multi-series/image2.dcm "$BASE_URL/CTImage.dcm"
curl -L -o multi-series/image3.dcm "$BASE_URL/XRayImage.dcm"

echo ""
echo "✓ Test files downloaded successfully!"
echo ""
echo "Downloaded files:"
echo "  - single-image.dcm (CT image for basic tests)"
echo "  - multi-series/image1.dcm (MR image)"
echo "  - multi-series/image2.dcm (CT image)"
echo "  - multi-series/image3.dcm (X-Ray image)"
echo ""
echo "These files are from the official Cornerstone test suite and are already anonymized."
echo "You can now run: pnpm test:e2e"
