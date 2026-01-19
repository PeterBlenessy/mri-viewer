import { useState, useEffect } from 'react'
import { Disclosure } from '@headlessui/react'
import { FileDropzone } from './components/viewer/FileDropzone'
import { DicomViewport } from './components/viewer/DicomViewport'
import { StudySeriesBrowser } from './components/viewer/StudySeriesBrowser'
import { ThumbnailStrip } from './components/viewer/ThumbnailStrip'
import { KeyboardShortcutsHelp } from './components/viewer/KeyboardShortcutsHelp'
import { ImagePresets } from './components/viewer/ImagePresets'
import { useStudyStore } from './stores/studyStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  // Force HMR update
  const [showDropzone, setShowDropzone] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const currentInstance = useStudyStore((state) => state.currentInstance)
  const currentSeries = useStudyStore((state) => state.currentSeries)
  const currentInstanceIndex = useStudyStore((state) => state.currentInstanceIndex)
  const { nextInstance, previousInstance } = useStudyStore()

  // Collapsible section state with localStorage persistence
  const [sectionState, setSectionState] = useState(() => {
    // Initialize from localStorage on first render
    const saved = localStorage.getItem('sidebarSections')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved sidebar state:', e)
      }
    }
    // Default values if nothing in localStorage
    return {
      studiesOpen: true,
      presetsOpen: false,
      metadataOpen: true
    }
  })

  // Save collapse state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarSections', JSON.stringify(sectionState))
  }, [sectionState])

  // Enable keyboard shortcuts
  useKeyboardShortcuts({ onToggleHelp: () => setShowHelp(!showHelp) })

  const handleFilesLoaded = () => {
    setShowDropzone(false)
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Keyboard Shortcuts Help */}

      <KeyboardShortcutsHelp show={showHelp} onClose={() => setShowHelp(false)} />

      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">MR DICOM Viewer</h1>
          {currentSeries && (
            <p className="text-sm text-gray-400 mt-1">
              {currentSeries.seriesDescription || `Series ${currentSeries.seriesNumber}`} -
              Image {currentInstanceIndex + 1} of {currentSeries.instances.length}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="px-3 py-2 bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded text-sm flex items-center gap-2 transition-colors"
          title="Keyboard shortcuts"
        >
          <span>?</span>
          <span>Help</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {showDropzone ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <FileDropzone
              className="w-full max-w-2xl"
              onFilesLoaded={handleFilesLoaded}
            />
          </div>
        ) : (
          <>
            {/* Viewer */}
            <div className="flex-1 flex flex-col min-w-0">
              <DicomViewport className="flex-1" />

              {/* Image Slider */}
              {currentSeries && currentSeries.instances.length > 1 && (
                <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] px-6 py-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 min-w-fit">
                      {currentInstanceIndex + 1} / {currentSeries.instances.length}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={currentSeries.instances.length - 1}
                      value={currentInstanceIndex}
                      onChange={(e) => {
                        const newIndex = parseInt(e.target.value)
                        useStudyStore.getState().setCurrentInstance(newIndex)
                      }}
                      className="flex-1 h-2 bg-[#0f0f0f] rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #4a4a4a 0%, #4a4a4a ${(currentInstanceIndex / (currentSeries.instances.length - 1)) * 100}%, #0f0f0f ${(currentInstanceIndex / (currentSeries.instances.length - 1)) * 100}%, #0f0f0f 100%)`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Thumbnail Navigation */}
              <ThumbnailStrip />
            </div>

            {/* Sidebar */}
            <aside className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] flex flex-col overflow-hidden">
              {/* Study/Series Browser - Collapsible, Persistent */}
              <div className="border-b border-[#2a2a2a]">
                <button
                  onClick={() => setSectionState(prev => ({ ...prev, studiesOpen: !prev.studiesOpen }))}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#0f0f0f] transition-colors"
                >
                  <h2 className="text-lg font-semibold">Studies & Series</h2>
                  <span className="text-gray-400">{sectionState.studiesOpen ? '▼' : '▶'}</span>
                </button>
                {sectionState.studiesOpen && (
                  <div className="px-4 pb-4">
                    <div className="max-h-64 overflow-y-auto">
                      <StudySeriesBrowser />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Presets - Collapsible, Persistent */}
              <div className="border-b border-[#2a2a2a]">
                <button
                  onClick={() => setSectionState(prev => ({ ...prev, presetsOpen: !prev.presetsOpen }))}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#0f0f0f] transition-colors"
                >
                  <h2 className="text-lg font-semibold">Image Presets</h2>
                  <span className="text-gray-400">{sectionState.presetsOpen ? '▼' : '▶'}</span>
                </button>
                {sectionState.presetsOpen && (
                  <div className="px-4 pb-4">
                    <ImagePresets />
                  </div>
                )}
              </div>

              {/* Current Metadata - Collapsible, Persistent */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <button
                  onClick={() => setSectionState(prev => ({ ...prev, metadataOpen: !prev.metadataOpen }))}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#0f0f0f] transition-colors flex-shrink-0"
                >
                  <h2 className="text-lg font-semibold">Current Image</h2>
                  <span className="text-gray-400">{sectionState.metadataOpen ? '▼' : '▶'}</span>
                </button>
                {sectionState.metadataOpen && (
                  <div className="px-4 pb-4 flex-1 overflow-y-auto">
                    {currentInstance?.metadata && (
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Patient Name:</span>
                          <p className="text-white">{currentInstance.metadata.patientName}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Patient ID:</span>
                          <p className="text-white">{currentInstance.metadata.patientID}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Study Date:</span>
                          <p className="text-white">{currentInstance.metadata.studyDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Series:</span>
                          <p className="text-white">{currentInstance.metadata.seriesDescription}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Instance:</span>
                          <p className="text-white">{currentInstance.instanceNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Brightness:</span>
                          <p className="text-white">{currentInstance.metadata.windowCenter}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Contrast:</span>
                          <p className="text-white">{currentInstance.metadata.windowWidth}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Load New Files Button */}
              <div className="p-4 border-t border-[#2a2a2a] flex-shrink-0">
                <button
                  onClick={() => setShowDropzone(true)}
                  className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded transition-colors"
                >
                  Load New Files
                </button>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  )
}

export default App
