import { useCallback, useState } from 'react'
import { useDicomLoader } from '@/hooks/useDicomLoader'
import { cn } from '@/lib/utils'
import {
  readDicomFilesWithDirectories,
} from '@/lib/storage/directoryHandleStorage'
import { parseDicomFilesWithDirectories } from '@/lib/dicom/parser'
import { useStudyStore } from '@/stores/studyStore'
import { useSettingsStore } from '@/stores/settingsStore'

interface FileDropzoneProps {
  className?: string
  onFilesLoaded?: () => void
}

export function FileDropzone({ className, onFilesLoaded }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [localLoading, setLocalLoading] = useState(false)
  const { loadFiles, isLoading, error } = useDicomLoader()
  const setStudies = useStudyStore((state) => state.setStudies)
  const persistStudies = useSettingsStore((state) => state.persistStudies)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      // Handle both files and folder items
      const items = Array.from(e.dataTransfer.items)
      const files: File[] = []

      for (const item of items) {
        const entry = item.webkitGetAsEntry?.()
        if (entry) {
          if (entry.isFile) {
            const file = item.getAsFile()
            if (file) {
              files.push(file)
            }
          } else if (entry.isDirectory) {
            // For directory drops, get all files from the directory
            const dirFiles = await getAllFilesFromDirectory(entry)
            files.push(...dirFiles)
          }
        }
      }

      if (files.length === 0) {
        // Fallback for browsers that don't support webkitGetAsEntry
        const fallbackFiles = Array.from(e.dataTransfer.files)
        files.push(...fallbackFiles)
      }

      if (files.length > 0) {
        try {
          await loadFiles(files)
          // Only call onFilesLoaded if loading was successful
          onFilesLoaded?.()
        } catch (err) {
          console.error('Failed to load files from drop:', err)
        }
      }
    },
    [loadFiles, onFilesLoaded]
  )

  // Helper function to recursively get all files from a directory
  async function getAllFilesFromDirectory(dirEntry: any): Promise<File[]> {
    const files: File[] = []
    const reader = dirEntry.createReader()

    return new Promise((resolve) => {
      const readEntries = () => {
        reader.readEntries(async (entries: any[]) => {
          if (entries.length === 0) {
            resolve(files)
            return
          }

          for (const entry of entries) {
            if (entry.isFile) {
              const file: File = await new Promise((res) => entry.file(res))
              // Accept all files - DICOM parser will validate them
              files.push(file)
            } else if (entry.isDirectory) {
              const subFiles = await getAllFilesFromDirectory(entry)
              files.push(...subFiles)
            }
          }

          readEntries()
        })
      }

      readEntries()
    })
  }

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      if (files.length > 0) {
        try {
          await loadFiles(files)
          // Only call onFilesLoaded if loading was successful
          onFilesLoaded?.()
        } catch (err) {
          console.error('Failed to load files:', err)
        }
      }
    },
    [loadFiles, onFilesLoaded]
  )

  const handleDirectoryPicker = useCallback(async () => {
    try {
      // Check if File System Access API is supported
      if (!('showDirectoryPicker' in window)) {
        alert('Your browser does not support folder selection. Please use Chrome or Edge.')
        return
      }

      setLocalLoading(true)
      setLocalError(null)

      // @ts-ignore - showDirectoryPicker is not in TypeScript types yet
      const directoryHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker({
        mode: 'read',
      })

      // Read all DICOM files with directory tracking
      const filesWithDirs = await readDicomFilesWithDirectories(directoryHandle)

      if (filesWithDirs.length === 0) {
        alert('No DICOM files found in the selected folder.')
        setLocalLoading(false)
        return
      }

      // Parse files with directory tracking
      // Pass the root directory handle so all studies get the same root directory reference
      const studies = await parseDicomFilesWithDirectories(filesWithDirs, directoryHandle)

      if (studies.length === 0) {
        alert('No valid DICOM studies found in the selected folder.')
        setLocalLoading(false)
        return
      }

      // If persistence is disabled, remove the directory handle IDs
      if (!persistStudies) {
        studies.forEach((study) => {
          delete study.directoryHandleId
        })
      }

      // Set the studies directly
      setStudies(studies)

      console.log(`Successfully loaded ${studies.length} studies`)

      // Call onFilesLoaded (no handle ID needed - it's in the studies now)
      onFilesLoaded?.()

      setLocalLoading(false)
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // User cancelled the picker
        setLocalLoading(false)
        return
      }
      console.error('Failed to load directory:', err)
      setLocalError('Failed to load DICOM files from folder')
      setLocalLoading(false)
    }
  }, [setStudies, onFilesLoaded, persistStudies])

  const combinedLoading = isLoading || localLoading
  const combinedError = error || localError

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-colors',
        isDragging
          ? 'border-[#3a3a3a] bg-[#2a2a2a]/10'
          : 'border-[#2a2a2a] hover:border-[#3a3a3a]',
        combinedLoading && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <svg
          className="w-16 h-16 mb-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <h3 className="text-xl font-semibold text-white mb-2">
          {combinedLoading ? 'Loading and parsing DICOM files...' : 'Drop DICOM files here'}
        </h3>

        {combinedLoading ? (
          <p className="text-gray-300 mb-4 animate-pulse">
            Please wait, this may take a moment...
          </p>
        ) : (
          <p className="text-gray-400 mb-4">
            or click below to select files or folder
          </p>
        )}

        <div className="flex gap-3">
          <label className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg cursor-pointer transition-colors">
            Select Files
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={combinedLoading}
              data-testid="file-input"
            />
          </label>

          <button
            onClick={handleDirectoryPicker}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={combinedLoading}
          >
            Select Folder
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Supports DICOM files (with or without .dcm extension)
        </p>

        {combinedError && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
            <p className="font-semibold">Error</p>
            <p>{combinedError}</p>
          </div>
        )}
      </div>
    </div>
  )
}
