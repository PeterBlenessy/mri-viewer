# MR DICOM Viewer

A modern web-based MR DICOM viewer with live image viewing, annotation overlay, and export capabilities. Built with React, TypeScript, and Cornerstone3D.

## Features

### ✅ Phase 1: MVP DICOM Viewer (Current)

- **DICOM File Loading**: Drag-and-drop or file picker to load DICOM files
- **Image Display**: High-quality rendering using Cornerstone3D
- **Navigation**: Browse through multi-slice series with previous/next controls
- **Window/Level**: Adjust image contrast (configurable through viewport store)
- **Metadata Display**: View patient information, study details, and image metadata
- **Series Browser**: Sidebar showing all loaded DICOM metadata

### 🚧 Upcoming Features

- **Phase 2**: Annotation overlay system with markers, measurements, and findings
- **Phase 3**: Export to PNG, JPEG, and PDF with burned-in annotations
- **Phase 4**: Dark theme, keyboard shortcuts, performance optimization

## Tech Stack

- **React 18** + **TypeScript** - Modern UI framework with type safety
- **Vite** - Fast build tool and dev server
- **Cornerstone3D** - Medical image rendering engine
- **dcmjs** - DICOM parsing library
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will open at `http://localhost:3000`

### Usage

1. **Load DICOM Files**:
   - Drag and drop `.dcm` files onto the dropzone, OR
   - Click "Select Files" to browse for files

2. **View Images**:
   - Use Previous/Next buttons to navigate through slices
   - Scroll with mouse wheel to navigate
   - View metadata in the right sidebar

3. **Load New Files**:
   - Click "Load New Files" button in the sidebar

## Project Structure

```
src/
├── components/
│   ├── viewer/          # DicomViewport, FileDropzone
│   ├── controls/        # (Future: WindowLevel, Zoom controls)
│   ├── series/          # (Future: SeriesBrowser, thumbnails)
│   ├── annotations/     # (Future: FindingsList, markers)
│   └── export/          # (Future: ExportDialog)
├── lib/
│   ├── cornerstone/     # Cornerstone initialization
│   ├── dicom/          # DICOM parsing and metadata extraction
│   ├── annotations/    # (Future: Annotation management)
│   └── export/         # (Future: Export implementations)
├── stores/              # Zustand state stores
│   ├── studyStore.ts   # Study/series/image state
│   ├── viewportStore.ts # Viewport settings
│   └── annotationStore.ts # (Future: Annotation data)
├── hooks/               # Custom React hooks
│   └── useDicomLoader.ts
└── types/               # TypeScript definitions
    ├── index.ts         # Core DICOM types
    └── annotation.ts    # Annotation types
```

## Key Files

- **`src/lib/cornerstone/initCornerstone.ts`** - Cornerstone3D initialization and configuration
- **`src/components/viewer/DicomViewport.tsx`** - Main viewport component for rendering DICOM images
- **`src/lib/dicom/parser.ts`** - DICOM file parsing and organization into studies/series
- **`src/stores/studyStore.ts`** - State management for loaded DICOM data
- **`src/App.tsx`** - Main application component

## Development

### Available Scripts

```bash
# Start development server (port 3000)
pnpm dev

# Type check
pnpm run build  # Note: Build currently has WASM issues, use dev mode

# Lint code
pnpm lint

# Run tests (future)
pnpm test
```

### Known Issues

- Production build has WASM loading issues with `@icr/polyseg-wasm` (Cornerstone Tools dependency)
- Development mode works perfectly
- Solution in progress: Configuring Vite to properly handle WASM modules

## Privacy & Logging

This application is designed with **privacy-first principles** to comply with HIPAA and protect patient data:

### Client-Side Processing
- All DICOM files are processed entirely in your browser
- No patient data is ever transmitted to external servers
- Studies are held in memory only and cleared when the browser closes

### Privacy-Compliant Logging
- **No patient information is logged** - Patient names, IDs, and identifiable data are never written to console logs
- **Minimal verbosity** - Console output shows only critical errors and warnings
- **What is logged:**
  - ⚠️ Lossy compression warnings (important for medical image quality)
  - ❌ Critical errors (parsing failures, load failures, viewport errors)
- **What is NOT logged:**
  - Patient names, IDs, or dates of birth
  - DICOM metadata values
  - File names or paths
  - Detailed debugging information

This ensures compliance with medical privacy regulations while maintaining debuggability for critical issues.

### Export Privacy
- Exported file names exclude patient identifiable information by default
- Patient data must be explicitly enabled in export settings
- All exports happen locally - no cloud uploads

## Architecture Decisions

1. **Client-side Only**: All DICOM processing happens in the browser for privacy and performance
2. **Cornerstone3D**: Industry standard for medical imaging on the web (powers OHIF Viewer)
3. **Zustand**: Lightweight state management, simpler than Redux for this use case
4. **TypeScript**: Type safety is critical when working with DICOM data
5. **Modular Structure**: Each phase builds on the previous, can pause/resume between phases
6. **Privacy-First Logging**: Zero patient data in logs, HIPAA-compliant console output

## Implementation Status

- ✅ **Phase 1.1**: Project setup, dependencies, folder structure
- ✅ **Phase 1.2**: Cornerstone integration, DICOM image loader
- ✅ **Phase 1.3**: File loading, parsing, and basic viewer
- ✅ **Phase 1.4**: Navigation controls and viewport manipulation tools (Window/Level, Zoom, Pan, Image Presets)
- ✅ **Phase 1.5**: Polish & UX (Thumbnails, Keyboard Shortcuts, Help Overlay, Image Slider, Collapsible Sidebar, Dark Theme)

**Overall Progress**: Phase 1 MVP is 95% complete. See [STATUS.md](plans/STATUS.md) for detailed progress.

## Contributing

This is currently a development project following the implementation plan outlined in `PRD.md`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Cornerstone3D Documentation](https://www.cornerstonejs.org/)
- [DICOM Standard](https://www.dicomstandard.org/)
- [OHIF Viewer](https://ohif.org/) - Reference implementation
