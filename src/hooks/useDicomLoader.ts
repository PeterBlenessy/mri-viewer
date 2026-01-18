import { useState } from 'react'
import { parseDicomFiles } from '@/lib/dicom/parser'
import { useStudyStore } from '@/stores/studyStore'

export function useDicomLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setStudies, setLoading: setStoreLoading, setError: setStoreError } = useStudyStore()

  const loadFiles = async (files: File[]) => {
    setIsLoading(true)
    setStoreLoading(true)
    setError(null)
    setStoreError(null)

    try {
      console.log(`Loading ${files.length} DICOM files...`)
      const studies = await parseDicomFiles(files)

      console.log(`Parsing complete. Found ${studies.length} studies`)

      if (studies.length === 0) {
        throw new Error('No valid DICOM files found in the selected files/folder')
      }

      // Log study details
      studies.forEach((study, i) => {
        console.log(`Study ${i + 1}: ${study.series.length} series, ${study.series.reduce((sum, s) => sum + s.instances.length, 0)} instances`)
      })

      setStudies(studies)
      console.log(`Successfully loaded ${studies.length} studies`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load DICOM files'
      console.error('Error loading DICOM files:', err)
      setError(errorMessage)
      setStoreError(errorMessage)
      throw err // Re-throw so the caller knows loading failed
    } finally {
      setIsLoading(false)
      setStoreLoading(false)
    }
  }

  return {
    loadFiles,
    isLoading,
    error,
  }
}
