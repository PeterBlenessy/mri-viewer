import * as cornerstone from 'cornerstone-core'
import * as cornerstoneTools from 'cornerstone-tools'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import { isTauri } from '../utils/platform'

let isInitialized = false

/**
 * Initialize Cornerstone 2.x and related libraries
 * This must be called before using any Cornerstone functionality
 */
export async function initCornerstone(): Promise<void> {
  if (isInitialized) {
    return
  }

  try {
    // Configure WADO Image Loader
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser

    // Detect if running in Tauri (desktop mode)
    const isDesktop = isTauri()
    console.log(`[Cornerstone] Platform detection: Desktop=${isDesktop}, __TAURI_INTERNALS__=${'__TAURI_INTERNALS__' in window}, __TAURI__=${'__TAURI__' in window}`)

    // Configure web workers for high-quality decoding and better performance
    // Use a direct path to the worker file to avoid blob URL issues in Tauri
    let workersEnabled = false
    try {
      // Use hardware concurrency to determine optimal worker count
      const maxWorkers = Math.max(1, (navigator.hardwareConcurrency || 4) - 1) // Reserve 1 core for main thread

      // Configure worker path before initialization
      // This avoids blob URLs which don't work reliably in Tauri
      const config = {
        maxWebWorkers: maxWorkers,
        startWebWorkersOnDemand: true,
        webWorkerPath: isDesktop
          ? '/cornerstoneWADOImageLoaderWebWorker.js'  // Direct path for Tauri
          : undefined, // Let it use default blob URLs in browser
        taskConfiguration: {
          decodeTask: {
            initializeCodecsOnStartup: false, // Don't initialize immediately
            strict: true,
          },
        },
      }

      cornerstoneWADOImageLoader.webWorkerManager.initialize(config)
      workersEnabled = true
      console.log(`[Cornerstone] Initialized with ${maxWorkers} web workers (Desktop: ${isDesktop})`)
      console.log(`[Cornerstone] Worker configuration:`, config)

      // Test if workers are actually working
      setTimeout(() => {
        try {
          const stats = (cornerstoneWADOImageLoader.webWorkerManager as any).getStatistics?.()
          if (stats) {
            console.log(`[Cornerstone] Worker statistics:`, stats)
          }
        } catch (err) {
          // Ignore if getStatistics doesn't exist
        }
      }, 5000)
    } catch (err) {
      console.warn('[Cornerstone] Web workers initialization failed, using main thread decoding:', err)
      workersEnabled = false
    }

    // Configure Cornerstone image cache for better performance
    // This prevents flickering when navigating through images
    const imageCacheSize = 1024 * 1024 * 1024 // 1GB cache
    cornerstone.imageCache.setMaximumSizeBytes(imageCacheSize)

    // Register the WADO image loader with Cornerstone for both schemes
    cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage)
    cornerstone.registerImageLoader('dicomfile', cornerstoneWADOImageLoader.wadouri.loadImage)

    // Configure WADO Image Loader for maximum quality
    cornerstoneWADOImageLoader.configure({
      beforeSend: function(xhr: any) {
        // No need for authentication for local files
      },
      strict: false, // Don't fail on DICOM spec violations
      useWebWorkers: workersEnabled, // Use workers if they initialized successfully
      decodeConfig: {
        // Preserve maximum precision for medical imaging
        convertFloatPixelDataToInt: false, // Keep full floating-point precision
        usePDFJS: false, // Don't use PDF.js for DICOM decoding
      },
    })

    console.log(`[Cornerstone] Image loader configured - workers: ${workersEnabled}`)


    // Make cornerstone available globally for debugging
    ;(window as any).cornerstone = cornerstone

    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize Cornerstone:', error)
    throw error
  }
}

/**
 * Create an image ID for loading a DICOM file
 * @param file The DICOM file to load
 * @returns The image ID that can be used with Cornerstone
 */
export function createImageId(file: File): string {
  // Create a blob URL for the file using the file manager
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file)
  return imageId
}

/**
 * Cleanup Cornerstone resources
 */
export function cleanupCornerstone(): void {
  if (!isInitialized) return
  // Cleanup complete
}

export function isInitializedCornerstone(): boolean {
  return isInitialized
}

// Export cornerstone for use in components
export { cornerstone, cornerstoneTools }
