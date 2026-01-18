import { useEffect, useRef } from 'react'
import { useStudyStore } from '@/stores/studyStore'
import { cornerstone } from '@/lib/cornerstone/initCornerstone'
import { DicomInstance } from '@/types'

export function ThumbnailStrip() {
  const currentSeries = useStudyStore((state) => state.currentSeries)
  const currentInstanceIndex = useStudyStore((state) => state.currentInstanceIndex)
  const setCurrentInstance = useStudyStore((state) => state.setCurrentInstance)

  if (!currentSeries || currentSeries.instances.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-3 w-full">
      <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
        {currentSeries.instances.map((instance, index) => (
          <Thumbnail
            key={instance.sopInstanceUID}
            instance={instance}
            index={index}
            isSelected={index === currentInstanceIndex}
            onClick={() => setCurrentInstance(index)}
          />
        ))}
      </div>
    </div>
  )
}

interface ThumbnailProps {
  instance: DicomInstance
  index: number
  isSelected: boolean
  onClick: () => void
}

function Thumbnail({ instance, index, isSelected, onClick }: ThumbnailProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!canvasRef.current || loadedRef.current) return

    const element = canvasRef.current

    async function loadThumbnail() {
      try {
        // Enable the element
        cornerstone.enable(element)

        // Load and display the image
        const image = await cornerstone.loadImage(instance.imageId)
        cornerstone.displayImage(element, image)

        // Fit the image to the thumbnail size
        const viewport = cornerstone.getViewport(element)
        if (viewport) {
          // Calculate scale to fit 80x80 thumbnail
          const scale = Math.min(80 / image.width, 80 / image.height)
          viewport.scale = scale
          cornerstone.setViewport(element, viewport)
        }

        loadedRef.current = true
      } catch (err) {
        console.error(`Failed to load thumbnail for instance ${index}:`, err)
      }
    }

    loadThumbnail()

    return () => {
      try {
        if (loadedRef.current) {
          cornerstone.disable(element)
        }
      } catch (err) {
        // Ignore disable errors
      }
    }
  }, [instance.imageId, index])

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 relative group ${
        isSelected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-600'
      } rounded overflow-hidden transition-all hover:ring-blue-400`}
    >
      <div
        ref={canvasRef}
        className="w-20 h-20 bg-black"
        style={{ minWidth: '80px', minHeight: '80px' }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-0.5 text-center">
        {index + 1}
      </div>
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
      )}
    </button>
  )
}
