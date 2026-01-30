import { useState, useEffect } from 'react'
import { PanelLeft, PanelRight, PanelBottom, ShieldCheck, ShieldOff } from 'lucide-react'
import { FileDropzone } from './components/viewer/FileDropzone'
import { DicomViewport } from './components/viewer/DicomViewport'
import { StudySeriesBrowser } from './components/viewer/StudySeriesBrowser'
import { ThumbnailStrip } from './components/viewer/ThumbnailStrip'
import { KeyboardShortcutsHelp } from './components/viewer/KeyboardShortcutsHelp'
import { HelpDialog } from './components/help/HelpDialog'
import { FavoritesPanel } from './components/favorites/FavoritesPanel'
import { LeftDrawer } from './components/layout/LeftDrawer'
import { SettingsPanel } from './components/settings/SettingsPanel'
import { useStudyStore } from './stores/studyStore'
import { useRecentStudiesStore } from './stores/recentStudiesStore'
import { useSettingsStore } from './stores/settingsStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { formatSeriesDescription } from './lib/utils/formatSeriesDescription'

function App() {
  // Force HMR update
  const [showDropzone, setShowDropzone] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [hasProcessedStudies, setHasProcessedStudies] = useState(false)

  // Panel visibility state
  const [showLeftDrawer, setShowLeftDrawer] = useState(() => {
    const saved = localStorage.getItem('leftDrawerOpen')
    return saved ? JSON.parse(saved) : false
  })
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [showThumbnailStrip, setShowThumbnailStrip] = useState(true)

  const theme = useSettingsStore((state) => state.theme)
  const hidePersonalInfo = useSettingsStore((state) => state.hidePersonalInfo)
  const setHidePersonalInfo = useSettingsStore((state) => state.setHidePersonalInfo)
  const currentSeries = useStudyStore((state) => state.currentSeries)
  const currentStudy = useStudyStore((state) => state.currentStudy)
  const currentInstanceIndex = useStudyStore((state) => state.currentInstanceIndex)
  const studies = useStudyStore((state) => state.studies)
  const addRecentStudy = useRecentStudiesStore((state) => state.addRecentStudy)

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
      favoritesOpen: true
    }
  })

  // Save collapse state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarSections', JSON.stringify(sectionState))
  }, [sectionState])

  // Save left drawer state to localStorage
  useEffect(() => {
    localStorage.setItem('leftDrawerOpen', JSON.stringify(showLeftDrawer))
  }, [showLeftDrawer])

  // Enable keyboard shortcuts
  useKeyboardShortcuts({ onToggleHelp: () => setShowKeyboardShortcuts(!showKeyboardShortcuts) })

  const handleFilesLoaded = () => {
    setHasProcessedStudies(false) // Reset so we process the new studies
    setShowDropzone(false)
  }

  // Auto-hide dropzone when studies are loaded (e.g., from recent studies reload)
  useEffect(() => {
    if (currentStudy) {
      setShowDropzone(false)
    }
  }, [currentStudy])

  // Track ALL studies in recent history when they're loaded
  useEffect(() => {
    // Only process studies once per load, and only if we have studies
    if (studies.length > 0 && !hasProcessedStudies) {
      // Add ALL studies to recent history with their own directoryHandleId or folderPath
      studies.forEach((study) => {
        const imageCount = study.series.reduce(
          (total, series) => total + series.instances.length,
          0
        )
        addRecentStudy({
          studyInstanceUID: study.studyInstanceUID,
          patientName: study.patientName || 'Unknown',
          patientID: study.patientID || '',
          studyDate: study.studyDate || '',
          studyDescription: study.studyDescription || '',
          seriesCount: study.series.length,
          imageCount,
          directoryHandleId: study.directoryHandleId, // Use the study's own directory handle (web mode)
          folderPath: study.folderPath, // Use the folder path (desktop mode)
        })
      })

      // Mark as processed so we don't add them again
      setHasProcessedStudies(true)
    }
  }, [studies, hasProcessedStudies, addRecentStudy])

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Settings Panel */}
      <SettingsPanel show={showSettings} onClose={() => setShowSettings(false)} />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp show={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />

      {/* Help Dialog */}
      <HelpDialog show={showHelp} onClose={() => setShowHelp(false)} />

      {/* Header */}
      <header className={`px-6 py-4 flex items-center justify-between border-b flex-shrink-0 ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
        <div>
          <div>
            <h1 className="text-2xl font-bold">OpenScans</h1>
            <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Privacy-first DICOM viewer
            </p>
          </div>
          {currentSeries && (
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatSeriesDescription(currentSeries.seriesDescription) || `Series ${currentSeries.seriesNumber}`} -
              Image {currentInstanceIndex + 1} of {currentSeries.instances.length}
            </p>
          )}
        </div>

        {/* Toolbar */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-gray-100'}`}>
          {/* Left Panel Toggle */}
          <button
            onClick={() => setShowLeftDrawer(!showLeftDrawer)}
            className={`p-2 rounded transition-colors ${showLeftDrawer ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-gray-300 text-gray-900') : (theme === 'dark' ? 'hover:bg-[#1a1a1a] text-gray-500' : 'hover:bg-gray-200 text-gray-400')}`}
            title="Toggle Left Panel"
          >
            <PanelLeft size={18} />
          </button>

          {/* Right Panel Toggle */}
          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className={`p-2 rounded transition-colors ${showRightSidebar ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-gray-300 text-gray-900') : (theme === 'dark' ? 'hover:bg-[#1a1a1a] text-gray-500' : 'hover:bg-gray-200 text-gray-400')}`}
            title="Toggle Right Panel"
          >
            <PanelRight size={18} />
          </button>

          {/* Bottom Panel Toggle */}
          <button
            onClick={() => setShowThumbnailStrip(!showThumbnailStrip)}
            className={`p-2 rounded transition-colors ${showThumbnailStrip ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-gray-300 text-gray-900') : (theme === 'dark' ? 'hover:bg-[#1a1a1a] text-gray-500' : 'hover:bg-gray-200 text-gray-400')}`}
            title="Toggle Thumbnail Strip"
          >
            <PanelBottom size={18} />
          </button>

          {/* Divider */}
          <div className={`w-px h-6 ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-300'}`}></div>

          {/* Privacy Toggle */}
          <button
            onClick={() => setHidePersonalInfo(!hidePersonalInfo)}
            className={`p-2 rounded transition-colors ${hidePersonalInfo ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-gray-300 text-gray-900') : (theme === 'dark' ? 'hover:bg-[#1a1a1a] text-gray-500' : 'hover:bg-gray-200 text-gray-400')}`}
            title={hidePersonalInfo ? 'Show Personal Information' : 'Hide Personal Information'}
            data-testid="privacy-toggle"
          >
            {hidePersonalInfo ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors ${theme === 'dark' ? 'hover:bg-[#1a1a1a] text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Help & Documentation"
          >
            <span>?</span>
            <span>Help</span>
          </button>
        </div>
      </header>

      {/* Main Container - Horizontal Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Drawer */}
        <LeftDrawer
          isOpen={showLeftDrawer}
          setIsOpen={setShowLeftDrawer}
          onLoadNewFiles={() => setShowDropzone(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
          onOpenHelp={() => setShowHelp(true)}
        />

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden relative">
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
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <DicomViewport className="flex-1 min-h-0" />

              {/* Image Slider */}
              {currentSeries && currentSeries.instances.length > 1 && (
                <div className={`px-6 py-3 border-t ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm min-w-fit ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
                      className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer slider ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-gray-200'}`}
                      data-testid="instance-slider"
                      style={{
                        background: theme === 'dark'
                          ? `linear-gradient(to right, #4a4a4a 0%, #4a4a4a ${(currentInstanceIndex / (currentSeries.instances.length - 1)) * 100}%, #0f0f0f ${(currentInstanceIndex / (currentSeries.instances.length - 1)) * 100}%, #0f0f0f 100%)`
                          : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentInstanceIndex / (currentSeries.instances.length - 1)) * 100}%, #e5e7eb ${(currentInstanceIndex / (currentSeries.instances.length - 1)) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Thumbnail Navigation */}
              {showThumbnailStrip && <ThumbnailStrip />}
            </div>

            {/* Sidebar */}
            <aside className={`flex flex-col overflow-hidden border-l transition-all duration-300 ease-in-out flex-shrink-0 ${
              showRightSidebar ? 'w-64' : 'w-0 border-l-0'
            } ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
              {showRightSidebar && (
                <>
              {/* Study/Series Browser - Collapsible, Persistent */}
              <div className={`border-b ${theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                <button
                  onClick={() => setSectionState((prev: typeof sectionState) => ({ ...prev, studiesOpen: !prev.studiesOpen }))}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-[#0f0f0f]' : 'hover:bg-gray-50'}`}
                >
                  <h2 className="text-lg font-semibold">Studies & Series</h2>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{sectionState.studiesOpen ? '▼' : '▶'}</span>
                </button>
                {sectionState.studiesOpen && (
                  <div className="px-4 pb-4">
                    <div className="max-h-64 overflow-y-auto">
                      <StudySeriesBrowser />
                    </div>
                  </div>
                )}
              </div>

              {/* Key Images - Collapsible, Persistent (includes favorites and AI-analyzed images) */}
              {/* Suggested names: "Key Images" (medical standard), "Marked Images", "Selections", "Important Images" */}
              <div className={`border-b ${theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                <button
                  onClick={() => setSectionState((prev: typeof sectionState) => ({ ...prev, favoritesOpen: !prev.favoritesOpen }))}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-[#0f0f0f]' : 'hover:bg-gray-50'}`}
                >
                  <h2 className="text-lg font-semibold">Key Images</h2>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{sectionState.favoritesOpen ? '▼' : '▶'}</span>
                </button>
                {sectionState.favoritesOpen && (
                  <div className="px-4 pb-4">
                    <FavoritesPanel />
                  </div>
                )}
              </div>

              </>
              )}
            </aside>
          </>
        )}
        </main>
      </div>
    </div>
  )
}

export default App
