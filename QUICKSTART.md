# Quick Start Guide

## Running the Application

### 1. Start the Development Server

```bash
cd /Users/peter/Development/MR-viewer
pnpm dev
```

The application will automatically open at **http://localhost:3000**

### 2. Load DICOM Files

You have two options:

**Option A: Drag and Drop**
- Drag `.dcm` files from your file explorer directly onto the drop zone

**Option B: File Picker**
- Click the "Select Files" button
- Choose one or more `.dcm` files
- Click "Open"

### 3. View and Navigate

Once loaded:
- **Navigate**: Use Previous/Next buttons or arrow keys to browse through slices
- **Metadata**: View patient info and study details in the right sidebar
- **Reset**: Click "Load New Files" to load different DICOM files

## Testing the Viewer

If you don't have DICOM files, you can download sample files from:
- [DICOM Library](https://www.dicomlibrary.com/) - Free sample DICOM datasets
- [OsiriX Sample Images](https://www.osirix-viewer.com/resources/dicom-image-library/) - Various modalities

## Keyboard Shortcuts (Current)

- `←` `→` - Navigate between slices (when implemented)
- Mouse wheel - Scroll through slices (when implemented)

## Troubleshooting

### Dev Server Won't Start
```bash
# Check if port 3000 is in use
lsof -ti :3000

# Kill the process if needed
lsof -ti :3000 | xargs kill -9

# Try again
pnpm dev
```

### Files Won't Load
- Ensure files have `.dcm` extension or DICOM mime type
- Check browser console (F12) for error messages
- Try loading a single file first to test

### Blank Screen
- Check browser console (F12) for errors
- Ensure WebGL is supported in your browser
- Try a different browser (Chrome/Firefox recommended)

## Development

### Project Structure

```
src/
├── App.tsx                    # Main application
├── components/
│   └── viewer/
│       ├── DicomViewport.tsx  # Cornerstone viewport
│       └── FileDropzone.tsx   # File loading UI
├── lib/
│   ├── cornerstone/           # Cornerstone init
│   └── dicom/                 # DICOM parsing
└── stores/                    # Zustand state
```

### Making Changes

The dev server supports hot module replacement (HMR), so changes will appear immediately:

1. Edit any `.tsx` or `.ts` file
2. Save
3. Browser updates automatically

### Adding Features

See `PRD.md` for the full implementation plan with upcoming features.

## Next Features to Implement

1. **Window/Level Controls** - Adjust image brightness/contrast
2. **Zoom/Pan Tools** - Mouse-based viewport manipulation
3. **Series Browser** - Thumbnail view of all loaded series
4. **Keyboard Shortcuts** - Full navigation via keyboard
5. **Annotation Overlay** - Display findings and markers (Phase 2)
6. **Export** - Save images as PNG/PDF (Phase 3)

## Support

For issues or questions about the implementation, refer to:
- `README.md` - Full documentation
- `PRD.md` - Implementation plan
- Console logs - Detailed error information
