# OpenScans Color System

## Overview

This document describes the standardized color palette for OpenScans, optimized for medical imaging applications. The color choices follow PACS (Picture Archiving and Communication System) industry standards to ensure maximum visibility on grayscale medical images.

## Color System Location

All color definitions are centralized in: `/src/lib/colors.ts`

## Annotation Overlay Colors

These colors are used for markers, measurements, and annotations that appear directly on DICOM images.

### Primary Annotation Colors

| Color | Hex Code | Usage | Rationale |
|-------|----------|-------|-----------|
| **Orange** | `#FF6B35` | All vertebrae markers (automatic & manual) | Excellent visibility on all grayscale backgrounds. Warm and attention-grabbing. |
| **White** | `#FFFFFF` | Selected/active UI buttons and icons | Maximum contrast against dark interface. Clear visual feedback. |
| **Grey** | `#9CA3AF` | Default/unselected UI buttons and icons | Subtle default state. Changes to white on hover/selection. |
| **Cyan** | `#00D9FF` | UI indicators (zoom) | Excellent visibility on both dark and light areas. Industry standard in radiology. |
| **Yellow** | `#FFD700` | Window/Level indicators | Best overall contrast. Highest perceived brightness. |
| **Amber** | `#FFC107` | Warning severity | Softer than pure yellow, good for warnings. |
| **Red** | `#EF4444` | Critical severity | Universal color for critical findings. |

### Why These Colors?

**Medical imaging requires specific colors because:**
1. **Grayscale images** - Need colors that contrast with both black and white
2. **Diagnostic accuracy** - Colors must not interfere with tissue interpretation
3. **Eye fatigue** - High-contrast colors reduce strain during long reading sessions
4. **Industry standards** - Radiologists expect certain color conventions

**What was wrong before:**
- **Green** (`#10b981`) - Poor visibility on bright bone/tissue areas
- **Blue** (`#3b82f6`) - Low contrast on dark areas, blends with some imaging artifacts

## UI Element Colors

These colors are for toolbar buttons, indicators, and interface elements (not on medical images).

### UI Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary Blue** | `#60A5FA` | Primary actions, active buttons |
| **Primary Hover** | `#3B82F6` | Hover states |
| **Success Green** | `#10B981` | Successful operations |
| **Warning Orange** | `#F59E0B` | Warnings |
| **Error Red** | `#EF4444` | Errors |
| **Favorite Gold** | `#FBBF24` | Favorite/starred items |
| **Disabled Gray** | `#6B7280` | Disabled states |

## Component Color Usage

### Annotations (on images)
- **All markers**: Orange (`#FF6B35`)
  - **Automatic markers**: Transparent fill (15% opacity)
  - **User-adjusted markers**: Solid fill (80% opacity)
- **Marker borders**: Narrow (1.5px stroke)
- **Marker labels**: Orange, 12px font
- **Warning markers**: Amber (`#FFC107`)
- **Critical markers**: Red (`#EF4444`)

### Viewport Indicators
- **Zoom indicator (active)**: Cyan (`#00D9FF`)
- **Window/Level indicator (active)**: Yellow (`#FFD700`)

### Thumbnails
- **Favorite star**: White when selected, grey when not (hover → white)
- **AI analysis icon**: Grey default (hover → white)
- **Marker visibility toggle**: White when visible, grey when hidden (hover → white)

### Toolbar & UI Buttons
- **Active/selected buttons**: White
- **Default buttons**: Grey (#9CA3AF) or dark background (#2a2a2a)
- **Hover state**: White or slightly lighter background (#3a3a3a)
- **Disabled buttons**: Dark grey (#6B7280)
- **All buttons**: Consistent grey/white scheme (no blue accents)

## Implementation Guide

### Using Annotation Colors

```typescript
import { annotationColors } from '@/lib/colors'

// For SVG elements on images
<circle fill={annotationColors.cyan} />
<text fill={annotationColors.yellow}>Label</text>
```

### Using UI Colors

```typescript
import { uiColors } from '@/lib/colors'

// For interface elements
<button style={{ backgroundColor: uiColors.primary }}>Action</button>
<svg style={{ color: uiColors.favorite }}>Star</svg>
```

### Using Annotation Styles

```typescript
import { annotationStyles } from '@/lib/colors'

// Get complete style preset
const style = annotationStyles.normal
// Returns: { color: '#00D9FF', lineWidth: 2, fillOpacity: 0.2 }
```

### Helper Functions

```typescript
import { withOpacity } from '@/lib/colors'

// Create semi-transparent colors
const transparentCyan = withOpacity(annotationColors.cyan, 0.5)
// Returns: 'rgba(0, 217, 255, 0.5)'
```

## Migration Summary

### Files Updated

1. **`/src/lib/colors.ts`** - NEW: Central color definitions
2. **`/src/types/annotation.ts`** - Updated to use standardized colors
3. **`/src/components/viewer/AnnotationOverlay.tsx`** - Cyan/yellow for markers
4. **`/src/components/viewer/ViewportToolbar.tsx`** - Standardized UI colors
5. **`/src/components/viewer/ThumbnailStrip.tsx`** - Cyan/gold for indicators
6. **`/src/components/viewer/DicomViewport.tsx`** - Cyan/yellow for overlays

### Color Changes

| Element | Before | After | Reason |
|---------|--------|-------|--------|
| All markers | Green/Blue | Orange `#FF6B35` | Better contrast on all grayscale backgrounds |
| Marker fill | Uniform | 80% solid (adjusted) / 15% transparent (automatic) | Visual distinction between AI and manual |
| Marker border | 2-3px varied | 1.5px uniform | Cleaner, more refined appearance |
| Marker labels | 14px | 12px | Smaller, less intrusive |
| Star icon | Gold | White (selected) / Grey (not) | Cleaner, simpler visual language |
| Marker toggle | Cyan | White (visible) / Grey (hidden) | Consistent with other UI icons |
| AI analysis icon | Blue hover | Grey → White hover | Consistent with other UI icons |
| Toolbar buttons | Blue active | White active / Grey default | Simplified, high-contrast scheme |

## Best Practices

### DO:
✅ Use `annotationColors` for anything appearing on medical images
✅ Use `uiColors` for toolbar buttons and interface elements
✅ Import colors from `/src/lib/colors.ts`
✅ Use semantic names (e.g., `annotationColors.normal` not hardcoded hex)
✅ Test colors on both bright and dark areas of images

### DON'T:
❌ Hardcode hex values in components
❌ Use green or blue for annotations on images
❌ Mix annotation colors with UI colors
❌ Use low-contrast colors on medical images
❌ Choose colors based on aesthetics alone

## Testing Recommendations

When testing the new color system:

1. **Load various image types**: CT, MRI, X-ray - test on different modalities
2. **Check contrast**: Verify visibility on both very dark and very bright image areas
3. **Adjust window/level**: Ensure annotations remain visible across W/L settings
4. **Multiple monitors**: Colors may appear different on different displays
5. **Lighting conditions**: Test in various ambient lighting (dark reading rooms, bright offices)

## Future Enhancements

Potential improvements to consider:

- [ ] User-selectable color schemes (personal preference)
- [ ] High contrast mode for accessibility
- [ ] Color blind friendly alternatives
- [ ] Per-modality color defaults (different colors for CT vs MRI)
- [ ] Annotation color picker for manual annotations

## References

- **DICOM Standard**: https://www.dicomstandard.org/
- **PACS Color Guidelines**: Industry best practices for overlay colors
- **Radiology UX**: Studies on optimal colors for medical image interpretation

---

**Last Updated**: 2026-01-31
**Version**: 1.0
