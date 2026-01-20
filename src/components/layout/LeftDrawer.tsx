import { useState, useEffect } from 'react'
import { useRecentStudiesStore, RecentStudyEntry } from '@/stores/recentStudiesStore'
import { useStudyStore } from '@/stores/studyStore'

interface LeftDrawerProps {
  onLoadNewFiles: () => void
}

export function LeftDrawer({ onLoadNewFiles }: LeftDrawerProps) {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('leftDrawerOpen')
    return saved ? JSON.parse(saved) : false
  })

  const recentStudies = useRecentStudiesStore((state) => state.recentStudies)
  const removeRecentStudy = useRecentStudiesStore((state) => state.removeRecentStudy)
  const clearRecentStudies = useRecentStudiesStore((state) => state.clearRecentStudies)
  const currentStudy = useStudyStore((state) => state.currentStudy)
  const setCurrentStudy = useStudyStore((state) => state.setCurrentStudy)
  const studies = useStudyStore((state) => state.studies)

  // Save open state to localStorage
  useEffect(() => {
    localStorage.setItem('leftDrawerOpen', JSON.stringify(isOpen))
  }, [isOpen])

  const handleStudyClick = (entry: RecentStudyEntry) => {
    // Check if this study is still loaded
    const study = studies.find((s) => s.studyInstanceUID === entry.studyInstanceUID)
    if (study) {
      setCurrentStudy(study.studyInstanceUID)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] border-l-0 rounded-r-lg p-2 transition-all duration-300 ${
          isOpen ? 'translate-x-64' : 'translate-x-0'
        }`}
        title={isOpen ? 'Close drawer' : 'Open drawer'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Drawer Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-[#121212] border-r border-[#2a2a2a] z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            Menu
          </h2>
        </div>

        {/* Recent Studies */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Recent Studies
              </h3>
              {recentStudies.length > 0 && (
                <button
                  onClick={clearRecentStudies}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  title="Clear all"
                >
                  Clear
                </button>
              )}
            </div>

            {recentStudies.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No recent studies</p>
            ) : (
              <ul className="space-y-2">
                {recentStudies.map((entry) => {
                  const isActive = currentStudy?.studyInstanceUID === entry.studyInstanceUID
                  const isLoaded = studies.some((s) => s.studyInstanceUID === entry.studyInstanceUID)

                  return (
                    <li key={entry.id}>
                      <button
                        onClick={() => handleStudyClick(entry)}
                        disabled={!isLoaded}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-600/20 border border-blue-500/50'
                            : isLoaded
                            ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-transparent'
                            : 'bg-[#1a1a1a]/50 border border-transparent opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {entry.patientName || 'Unknown Patient'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {entry.studyDescription || 'No description'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {entry.seriesCount} series, {entry.imageCount} images
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(entry.loadedAt)}
                            </span>
                            {!isLoaded && (
                              <span className="text-xs text-yellow-500">Unloaded</span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Section - Settings & Actions */}
        <div className="border-t border-[#2a2a2a] p-4 space-y-2">
          {/* Load New Files */}
          <button
            onClick={() => {
              onLoadNewFiles()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <span className="text-sm text-gray-300">Load New Files</span>
          </button>

          {/* Settings Button (placeholder for future) */}
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors text-left"
            title="Settings (coming soon)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-300">Settings</span>
            <span className="ml-auto text-xs text-gray-600">Soon</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => {
              // Dispatch keyboard shortcut event to open help
              window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-300">Keyboard Shortcuts</span>
          </button>
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
