# Study Cache Optimization

## Problem

When loading studies from "Recent Studies" in desktop mode, the app was re-reading and re-parsing ALL files from disk every time:
- **File reading**: ~1200ms for 1142 files
- **DICOM parsing**: ~300ms
- **Total overhead**: ~1500ms per switch

This made switching between recent studies **significantly slower** than in web mode.

## Solution

Implemented an in-memory cache for parsed DICOM studies.

### Architecture

**Cache Module**: `src/lib/storage/studyCache.ts`
- Simple Map-based cache: `Key → DicomStudy[]`
- Key = folderPath (desktop) or directoryHandleId (web)
- Shared across all components

### Integration Points

1. **Initial Load** (`useDicomLoader.ts`)
   - When files are first loaded, cache the parsed studies
   - Uses folderPath as cache key in desktop mode

2. **Recent Studies** (`LeftDrawer.tsx`)
   - Check cache before re-reading files
   - If cached → instant load (0ms!)
   - If not cached → read, parse, and cache for next time

3. **Both Web and Desktop Modes**
   - Desktop: uses `folderPath` as key
   - Web: uses `directoryHandleId` as key

## Performance Improvement

### Before Cache
```
Click recent study → Read 1142 files (1200ms) → Parse (300ms) → Display (1500ms total)
```

### After Cache (First Load)
```
Click recent study → Read files (1200ms) → Parse (300ms) → Cache → Display (1500ms)
```

### After Cache (Subsequent Loads)
```
Click recent study → Load from cache (0ms) → Display (~0ms total!) ⚡
```

## Expected Results

- **First click**: ~1500ms (same as before, but now caches)
- **Second+ click**: <10ms (instant - just switching state)
- **100x faster** for cached studies!

## Cache Characteristics

### Memory Usage
- Caches parsed study metadata only
- Does NOT cache pixel data (that's in Cornerstone's cache)
- ~1-5MB per 1000-image study
- Safe for multiple studies

### Invalidation
- Cache persists for the entire app session
- Cleared on app restart
- No automatic invalidation (files assumed unchanged)

### Future Enhancements
- Persistent cache using IndexedDB
- LRU eviction for memory limits
- Cache invalidation based on file timestamps
- Preload cache on app startup from recent studies

## Files Modified

- `src/lib/storage/studyCache.ts` - NEW: Cache implementation
- `src/hooks/useDicomLoader.ts` - Cache population on initial load
- `src/components/layout/LeftDrawer.tsx` - Cache check before reload
- `docs/CACHE_OPTIMIZATION.md` - NEW: This documentation

## Testing

To verify the optimization works:

1. Load a folder with many DICOM files (first time)
   - Check console: Should see normal loading times
   - Check console: Should see "Cached X studies for: /path/to/folder"

2. Click a different recent study from the SAME folder
   - Check console: Should see "⚡ Loading X studies from cache (instant!)"
   - UI should switch instantly (no loading spinner)

3. Compare timing:
   - First load: ~1500ms
   - Cached load: ~0-10ms

## Code Example

```typescript
// Cache check
const cachedStudies = getCachedStudies(folderPath)
if (cachedStudies) {
  console.log('⚡ Loading from cache (instant!)')
  setStudies(cachedStudies)
  return // No file I/O needed!
}

// Cache miss - load and cache
const studies = await parseDicomFiles(files, folderPath)
cacheStudies(folderPath, studies) // Cache for next time
```

## Limitations

- Cache doesn't persist across app restarts
- No detection of file changes on disk
- Memory usage grows with number of cached folders
- No automatic cleanup of old entries

These are acceptable trade-offs for the massive performance gain!
