import { create } from 'zustand'
import { ViewportSettings, Tool } from '@/types'

// Window/Level settings specific to each modality
interface ModalityWindowLevel {
  windowCenter: number
  windowWidth: number
  dicomDefault?: { windowCenter: number; windowWidth: number }  // Original DICOM values for reset
}

interface ViewportState {
  settings: ViewportSettings
  currentModality: string  // Track current modality (MR, CT, CR, etc.)
  modalitySettings: Record<string, ModalityWindowLevel>  // W/L per modality
  activeTool: string
  tools: Tool[]
  showAnnotations: boolean
  showMetadata: boolean

  // Actions
  setWindowLevel: (center: number, width: number) => void
  setModality: (modality: string, defaultCenter?: number, defaultWidth?: number) => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  setRotation: (rotation: number) => void
  setInvert: (invert: boolean) => void
  setFlipHorizontal: (flip: boolean) => void
  setFlipVertical: (flip: boolean) => void
  setActiveTool: (toolName: string) => void
  toggleAnnotations: () => void
  toggleMetadata: () => void
  resetSettings: () => void
}

// Modality-specific default W/L values based on typical imaging ranges
const modalityDefaults: Record<string, ModalityWindowLevel> = {
  'MR': { windowCenter: 600, windowWidth: 1200 },     // Magnetic Resonance
  'CT': { windowCenter: 40, windowWidth: 400 },       // Computed Tomography (soft tissue)
  'CR': { windowCenter: 2048, windowWidth: 4096 },    // Computed Radiography (X-ray)
  'DX': { windowCenter: 2048, windowWidth: 4096 },    // Digital Radiography (X-ray)
  'RF': { windowCenter: 2048, windowWidth: 4096 },    // Radio Fluoroscopy
  'XA': { windowCenter: 2048, windowWidth: 4096 },    // X-ray Angiography
  'MG': { windowCenter: 1500, windowWidth: 3000 },    // Mammography
  'OT': { windowCenter: 600, windowWidth: 1200 },     // Other (default to MR-like)
}

// Default viewport settings (non W/L settings)
// W/L is now managed per-modality in modalitySettings
const defaultSettings: ViewportSettings = {
  windowCenter: 600,   // Will be overridden by modality-specific values
  windowWidth: 1200,   // Will be overridden by modality-specific values
  zoom: 1,
  pan: { x: 0, y: 0 },
  rotation: 0,
  invert: false,
  flipHorizontal: false,
  flipVertical: false,
}

const defaultTools: Tool[] = [
  { name: 'WindowLevel', mode: 'active' },
  { name: 'Zoom', mode: 'passive' },
  { name: 'Pan', mode: 'passive' },
  { name: 'StackScroll', mode: 'active' },
]

export const useViewportStore = create<ViewportState>((set) => ({
  settings: defaultSettings,
  currentModality: 'MR',  // Default to MR
  modalitySettings: { ...modalityDefaults },  // Initialize with all modality defaults
  activeTool: 'WindowLevel',
  tools: defaultTools,
  showAnnotations: true,
  showMetadata: true,

  // Update W/L for the current modality and apply to viewport
  // IMPORTANT: Preserve dicomDefault when updating user adjustments
  setWindowLevel: (center, width) =>
    set((state) => ({
      modalitySettings: {
        ...state.modalitySettings,
        [state.currentModality]: {
          ...state.modalitySettings[state.currentModality],  // Preserve dicomDefault
          windowCenter: center,
          windowWidth: width,
        },
      },
      settings: {
        ...state.settings,
        windowCenter: center,
        windowWidth: width,
      },
    })),

  // Switch to a different modality and apply its stored W/L settings
  // If defaultCenter/defaultWidth provided (from DICOM metadata), use those to initialize
  setModality: (modality, defaultCenter, defaultWidth) =>
    set((state) => {
      console.log(`[setModality] Called with: modality=${modality}, defaultCenter=${defaultCenter}, defaultWidth=${defaultWidth}`)

      // Get stored settings for this modality, or use defaults
      let modalityWL = state.modalitySettings[modality]

      // Fall back to modality default if no stored settings
      if (!modalityWL) {
        modalityWL = modalityDefaults[modality] || modalityDefaults['OT']
        console.log(`[setModality] No stored settings, using hard-coded defaults: ${modalityWL.windowCenter}/${modalityWL.windowWidth}`)
      } else {
        console.log(`[setModality] Current stored settings: ${modalityWL.windowCenter}/${modalityWL.windowWidth}, dicomDefault: ${modalityWL.dicomDefault?.windowCenter}/${modalityWL.dicomDefault?.windowWidth}`)
      }

      // If we have DICOM metadata, always update the reset target
      // Apply DICOM values only if user hasn't customized yet
      if (defaultCenter !== undefined && defaultWidth !== undefined) {
        const hasNoDicomDefault = !modalityWL.dicomDefault

        // Check if user has customized (current values differ from any DICOM or hard-coded defaults)
        const isAtHardCodedDefault =
          modalityWL.windowCenter === modalityDefaults[modality]?.windowCenter &&
          modalityWL.windowWidth === modalityDefaults[modality]?.windowWidth

        const isAtPreviousDicomDefault =
          modalityWL.dicomDefault &&
          modalityWL.windowCenter === modalityWL.dicomDefault.windowCenter &&
          modalityWL.windowWidth === modalityWL.dicomDefault.windowWidth

        // User hasn't customized if they're at either hard-coded defaults OR previous DICOM defaults
        const userHasNotCustomized = isAtHardCodedDefault || isAtPreviousDicomDefault || hasNoDicomDefault

        if (userHasNotCustomized) {
          // Apply new DICOM metadata (user hasn't made manual adjustments)
          modalityWL = {
            windowCenter: defaultCenter,
            windowWidth: defaultWidth,
            dicomDefault: { windowCenter: defaultCenter, windowWidth: defaultWidth },
          }
          console.log(`Applied DICOM metadata for ${modality}: ${defaultCenter}/${defaultWidth}`)
        } else {
          // Keep user adjustments but update the DICOM reset target for current image
          modalityWL = {
            ...modalityWL,
            dicomDefault: { windowCenter: defaultCenter, windowWidth: defaultWidth },
          }
          console.log(`Updated ${modality} DICOM reset target to: ${defaultCenter}/${defaultWidth} (keeping user adjustments: ${modalityWL.windowCenter}/${modalityWL.windowWidth})`)
        }
      }

      console.log(`Switching to modality: ${modality}, W/L: ${modalityWL.windowCenter}/${modalityWL.windowWidth}`)

      return {
        currentModality: modality,
        modalitySettings: {
          ...state.modalitySettings,
          [modality]: modalityWL,
        },
        settings: {
          ...state.settings,
          windowCenter: modalityWL.windowCenter,
          windowWidth: modalityWL.windowWidth,
        },
      }
    }),

  setZoom: (zoom) =>
    set((state) => ({
      settings: { ...state.settings, zoom },
    })),

  setPan: (x, y) =>
    set((state) => ({
      settings: { ...state.settings, pan: { x, y } },
    })),

  setRotation: (rotation) =>
    set((state) => ({
      settings: { ...state.settings, rotation },
    })),

  setInvert: (invert) =>
    set((state) => ({
      settings: { ...state.settings, invert },
    })),

  setFlipHorizontal: (flip) =>
    set((state) => ({
      settings: { ...state.settings, flipHorizontal: flip },
    })),

  setFlipVertical: (flip) =>
    set((state) => ({
      settings: { ...state.settings, flipVertical: flip },
    })),

  setActiveTool: (toolName) => set({ activeTool: toolName }),

  toggleAnnotations: () =>
    set((state) => ({ showAnnotations: !state.showAnnotations })),

  toggleMetadata: () =>
    set((state) => ({ showMetadata: !state.showMetadata })),

  // Reset to current modality's default values
  // Priority: 1) Current image's DICOM metadata, 2) Hard-coded modality defaults
  resetSettings: () =>
    set((state) => {
      const currentModalitySettings = state.modalitySettings[state.currentModality]

      console.log(`[resetSettings] Current modality: ${state.currentModality}`)
      console.log(`[resetSettings] Current settings:`, currentModalitySettings)

      // Prefer DICOM defaults if available, otherwise use hard-coded modality defaults
      const resetTarget = currentModalitySettings?.dicomDefault ||
                          modalityDefaults[state.currentModality] ||
                          modalityDefaults['OT']

      const source = currentModalitySettings?.dicomDefault ? 'DICOM metadata (current image)' : 'hard-coded modality defaults'
      console.log(`[resetSettings] Resetting ${state.currentModality} to ${source}: ${resetTarget.windowCenter}/${resetTarget.windowWidth}`)

      return {
        modalitySettings: {
          ...state.modalitySettings,
          [state.currentModality]: {
            ...resetTarget,
            dicomDefault: currentModalitySettings?.dicomDefault, // Preserve DICOM defaults for future resets
          },
        },
        settings: {
          ...defaultSettings,
          windowCenter: resetTarget.windowCenter,
          windowWidth: resetTarget.windowWidth,
        },
      }
    }),
}))
