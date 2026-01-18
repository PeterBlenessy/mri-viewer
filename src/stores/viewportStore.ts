import { create } from 'zustand'
import { ViewportSettings, Tool } from '@/types'

interface ViewportState {
  settings: ViewportSettings
  activeTool: string
  tools: Tool[]
  showAnnotations: boolean
  showMetadata: boolean

  // Actions
  setWindowLevel: (center: number, width: number) => void
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

const defaultSettings: ViewportSettings = {
  windowCenter: 40,
  windowWidth: 400,
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
  activeTool: 'WindowLevel',
  tools: defaultTools,
  showAnnotations: true,
  showMetadata: true,

  setWindowLevel: (center, width) =>
    set((state) => ({
      settings: {
        ...state.settings,
        windowCenter: center,
        windowWidth: width,
      },
    })),

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

  resetSettings: () => set({ settings: defaultSettings }),
}))
