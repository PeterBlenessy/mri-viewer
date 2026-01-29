import { useAiAnalysisStore } from '@/stores/aiAnalysisStore'
import { useStudyStore } from '@/stores/studyStore'

export function AiAnalysisModal() {
  const isModalVisible = useAiAnalysisStore((state) => state.isModalVisible)
  const selectedAnalysisId = useAiAnalysisStore((state) => state.selectedAnalysisId)
  const analyses = useAiAnalysisStore((state) => state.analyses)
  const hideModal = useAiAnalysisStore((state) => state.hideModal)
  const showModal = useAiAnalysisStore((state) => state.showModal)
  const deleteAnalysis = useAiAnalysisStore((state) => state.deleteAnalysis)
  const currentInstance = useStudyStore((state) => state.currentInstance)

  // Get the analysis for the current image
  const currentAnalysis = currentInstance
    ? analyses.find((a) => a.sopInstanceUID === currentInstance.sopInstanceUID)
    : null

  const handleDelete = () => {
    if (!currentAnalysis) return
    if (confirm('Are you sure you want to delete this AI analysis?')) {
      deleteAnalysis(currentAnalysis.id)
    }
  }

  const handleMinimizedClick = () => {
    if (currentAnalysis) {
      showModal(currentAnalysis.id)
    }
  }

  // Show minimized icon if there's an analysis but modal is hidden
  if (!isModalVisible && currentAnalysis) {
    return (
      <button
        onClick={handleMinimizedClick}
        title="View AI analysis"
        className="absolute bottom-[6.25rem] left-4 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white p-2.5 rounded-lg shadow-lg transition-colors z-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    )
  }

  if (!isModalVisible || !selectedAnalysisId || !currentAnalysis) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-blue-500"
            >
              <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
            </svg>
            <h2 className="text-lg font-semibold text-white">AI Radiology Analysis</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              title="Delete analysis"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-[#2a2a2a] rounded transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={hideModal}
              title="Close"
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {currentAnalysis.findings}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2a2a] text-xs text-gray-500 flex items-center justify-between">
          <div>
            Generated by <span className="text-gray-400 font-medium">{currentAnalysis.createdBy}</span>
          </div>
          <div>
            {new Date(currentAnalysis.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
