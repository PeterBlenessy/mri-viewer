# E2E Test Fixtures

## IMPORTANT: Patient Data Privacy

**NEVER commit real patient DICOM files to this repository.**

All test DICOM files in this directory MUST be:
- Anonymized (patient name, ID, dates removed)
- Synthetic test data
- Publicly available test datasets

---

## Quick Start: Download Test Files

The easiest way to get test DICOM files is to download from the official Cornerstone test suite:

```bash
./download-test-files.sh
```

This script downloads anonymized test images from the [Cornerstone WADO Image Loader repository](https://github.com/cornerstonejs/cornerstoneWADOImageLoader) - the same library this project uses for DICOM parsing.

---

## Trusted Sources for DICOM Test Files

### 1. **Cornerstone Libraries Test Images** ⭐ Recommended

Since this project uses `dicom-parser` and `cornerstone-wado-image-loader`, the official test images are ideal:

- **Repository**: [cornerstoneWADOImageLoader/testImages](https://github.com/cornerstonejs/cornerstoneWADOImageLoader/tree/master/testImages)
- **Direct URL**: `https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/`
- **Files Include**: CT, MR, X-Ray images (already anonymized)
- **License**: MIT (same as this project)

### 2. **dicom-parser Official Repository**

- **Repository**: [cornerstonejs/dicomParser](https://github.com/cornerstonejs/dicomParser)
- **Test Coverage**: 80%+ of code paths with their test files
- **Examples**: Interactive examples in `/examples` directory

### 3. **Dedicated DICOM Test Files Collection**

- **Repository**: [robyoung/dicom-test-files](https://github.com/robyoung/dicom-test-files)
- **Description**: Collection of DICOM files from various sources for testing
- **Use Case**: Cross-library testing

### 4. **The Cancer Imaging Archive (TCIA)** - For Research

- **Website**: [cancerimagingarchive.net](https://www.cancerimagingarchive.net/)
- **Description**: Largest public archive of de-identified cancer images
- **Special Dataset**: [Pseudo-PHI-DICOM](https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=80969777) - 1,693 images specifically for testing de-identification
- **Modalities**: CT, MRI, PET, X-Ray
- **License**: Varies by dataset (check individual licenses)

### 5. **Stanford AIMI Shared Datasets**

- **Website**: [aimi.stanford.edu/shared-datasets](https://aimi.stanford.edu/shared-datasets)
- **Description**: Curated public imaging data from Stanford Health Care
- **License**: Free for non-commercial research

### 6. **GitHub Medical Imaging Dataset Collections**

- [m-aryayi/Medical-Imaging-Datasets](https://github.com/m-aryayi/Medical-Imaging-Datasets)
- [sfikas/medical-imaging-datasets](https://github.com/sfikas/medical-imaging-datasets)

---

## Required Test Files Structure

For the E2E test suite to run, you need:

1. **`single-image.dcm`** - A single DICOM instance for basic loading tests
2. **`multi-series/`** directory - 3-5 DICOM instances for navigation tests

---

## Creating Your Own Test Files (Advanced)

If you need to anonymize your own DICOM data:

### Using DICOM Toolkit (dcmtk)

```bash
# Install dcmtk (macOS)
brew install dcmtk

# Anonymize a DICOM file
dcmodify -i "(0010,0010)=ANON^TEST" \      # Replace patient name
         -i "(0010,0020)=TEST123" \         # Replace patient ID
         -i "(0010,0030)=" \                 # Remove birth date
         -i "(0008,0020)=20240101" \         # Use generic study date
         -i "(0008,0050)=" \                 # Remove accession number
         -i "(0010,1010)=" \                 # Remove patient age
         input.dcm output.dcm
```

### Using Python (pydicom)

```python
import pydicom

# Load DICOM file
ds = pydicom.dcmread("input.dcm")

# Anonymize
ds.PatientName = "ANON^TEST"
ds.PatientID = "TEST123"
ds.PatientBirthDate = ""
ds.StudyDate = "20240101"
ds.AccessionNumber = ""

# Save anonymized file
ds.save_as("output.dcm")
```

### Using Online Tools

- [DICOM Library](https://www.dicomlibrary.com/) - Web-based DICOM anonymization

---

## Verification Checklist

Before committing any DICOM file to this directory:

- [ ] File is from a trusted public source (Cornerstone, TCIA, etc.)
- [ ] OR file has been anonymized (no patient name, ID, DOB, etc.)
- [ ] File size is reasonable (<10MB per file)
- [ ] You have permission/license to use the file
- [ ] File is documented in this README

---

## .gitignore Configuration

The `.gitignore` is configured to:
- **Block all `*.dcm` files** in the repository
- **Allow `e2e/fixtures/*.dcm`** as an exception (use with extreme caution)

**Double-check before committing** that no patient data is included!

---

## Sources

All trusted sources mentioned in this document:

- [Cornerstone WADO Image Loader](https://github.com/cornerstonejs/cornerstoneWADOImageLoader)
- [dicom-parser](https://github.com/cornerstonejs/dicomParser)
- [robyoung/dicom-test-files](https://github.com/robyoung/dicom-test-files)
- [The Cancer Imaging Archive](https://www.cancerimagingarchive.net/)
- [Pseudo-PHI-DICOM Dataset](https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=80969777)
- [Stanford AIMI](https://aimi.stanford.edu/shared-datasets)
- [Medical Imaging Datasets Collection](https://github.com/m-aryayi/Medical-Imaging-Datasets)
- [DICOM Library](https://www.dicomlibrary.com/)
