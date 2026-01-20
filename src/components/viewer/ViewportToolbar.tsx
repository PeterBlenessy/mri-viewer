import { useViewportStore } from '@/stores/viewportStore'

interface ViewportToolbarProps {
  className?: string
}

export function ViewportToolbar({ className = '' }: ViewportToolbarProps) {
  const settings = useViewportStore((state) => state.settings)
  const resetSettings = useViewportStore((state) => state.resetSettings)
  const setRotation = useViewportStore((state) => state.setRotation)
  const setFlipHorizontal = useViewportStore((state) => state.setFlipHorizontal)
  const setFlipVertical = useViewportStore((state) => state.setFlipVertical)
  const setInvert = useViewportStore((state) => state.setInvert)
  const setZoom = useViewportStore((state) => state.setZoom)

  const handleRotateLeft = () => {
    setRotation((settings.rotation - 90 + 360) % 360)
  }

  const handleRotateRight = () => {
    setRotation((settings.rotation + 90) % 360)
  }

  const handleFlipHorizontal = () => {
    setFlipHorizontal(!settings.flipHorizontal)
  }

  const handleFlipVertical = () => {
    setFlipVertical(!settings.flipVertical)
  }

  const handleInvert = () => {
    setInvert(!settings.invert)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(20, settings.zoom * 1.25))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(0.1, settings.zoom / 1.25))
  }

  const handleFitToScreen = () => {
    // Reset zoom and pan to defaults
    useViewportStore.getState().setZoom(1)
    useViewportStore.getState().setPan(0, 0)
  }

  return (
    <div className={`flex items-center gap-1 bg-[#1a1a1a]/90 backdrop-blur-sm rounded-lg p-1.5 shadow-lg border border-[#2a2a2a] ${className}`}>
      {/* Reset */}
      <ToolbarButton
        onClick={resetSettings}
        title="Reset all (R)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
          </svg>
        }
      />

      <ToolbarDivider />

      {/* Fit to Screen */}
      <ToolbarButton
        onClick={handleFitToScreen}
        title="Fit to screen (F)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 01.75-.75h2.5a.75.75 0 000-1.5h-2.5zM13.25 2a.75.75 0 000 1.5h2.5a.75.75 0 01.75.75v2.5a.75.75 0 001.5 0v-2.5A2.25 2.25 0 0015.75 2h-2.5zM2 13.25a.75.75 0 011.5 0v2.5a.75.75 0 00.75.75h2.5a.75.75 0 010 1.5h-2.5A2.25 2.25 0 012 15.75v-2.5zM16.5 13.25a.75.75 0 011.5 0v2.5A2.25 2.25 0 0115.75 18h-2.5a.75.75 0 010-1.5h2.5a.75.75 0 00.75-.75v-2.5z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* Zoom In */}
      <ToolbarButton
        onClick={handleZoomIn}
        title="Zoom in (+)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M9 6a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 6z" />
            <path fillRule="evenodd" d="M2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9zm7-5.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* Zoom Out */}
      <ToolbarButton
        onClick={handleZoomOut}
        title="Zoom out (-)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M6.75 8.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" />
            <path fillRule="evenodd" d="M9 2a7 7 0 104.391 12.452l3.329 3.328a.75.75 0 101.06-1.06l-3.328-3.329A7 7 0 009 2zM3.5 9a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" clipRule="evenodd" />
          </svg>
        }
      />

      <ToolbarDivider />

      {/* Rotate Left */}
      <ToolbarButton
        onClick={handleRotateLeft}
        title="Rotate left ([)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* Rotate Right */}
      <ToolbarButton
        onClick={handleRotateRight}
        title="Rotate right (])"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 scale-x-[-1]">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39z" clipRule="evenodd" />
          </svg>
        }
      />

      <ToolbarDivider />

      {/* Flip Horizontal */}
      <ToolbarButton
        onClick={handleFlipHorizontal}
        active={settings.flipHorizontal}
        title="Flip horizontal (H)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* Flip Vertical */}
      <ToolbarButton
        onClick={handleFlipVertical}
        active={settings.flipVertical}
        title="Flip vertical (V)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-90">
            <path fillRule="evenodd" d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* Invert */}
      <ToolbarButton
        onClick={handleInvert}
        active={settings.invert}
        title="Invert colors (I)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
          </svg>
        }
      />
    </div>
  )
}

interface ToolbarButtonProps {
  onClick: () => void
  title: string
  icon: React.ReactNode
  active?: boolean
}

function ToolbarButton({ onClick, title, icon, active = false }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
      }`}
    >
      {icon}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[#3a3a3a] mx-1" />
}
