import { create } from 'zustand'

export interface RecentStudyEntry {
  id: string
  studyInstanceUID: string
  patientName: string
  patientID: string
  studyDate: string
  studyDescription: string
  seriesCount: number
  imageCount: number
  loadedAt: number
}

interface RecentStudiesState {
  recentStudies: RecentStudyEntry[]
  addRecentStudy: (entry: Omit<RecentStudyEntry, 'id' | 'loadedAt'>) => void
  removeRecentStudy: (id: string) => void
  clearRecentStudies: () => void
}

export const useRecentStudiesStore = create<RecentStudiesState>((set) => ({
  recentStudies: [],

  addRecentStudy: (entry) => {
    const newEntry: RecentStudyEntry = {
      ...entry,
      id: crypto.randomUUID(),
      loadedAt: Date.now(),
    }

    set((state) => {
      // Check if study already exists (by studyInstanceUID)
      const existingIndex = state.recentStudies.findIndex(
        (s) => s.studyInstanceUID === entry.studyInstanceUID
      )

      if (existingIndex >= 0) {
        // Move existing study to front and update loadedAt
        const updated = [...state.recentStudies]
        updated[existingIndex] = { ...updated[existingIndex], loadedAt: Date.now() }
        return {
          recentStudies: [
            updated[existingIndex],
            ...updated.slice(0, existingIndex),
            ...updated.slice(existingIndex + 1),
          ],
        }
      }

      // Add new study to front, limit to 10 entries
      return {
        recentStudies: [newEntry, ...state.recentStudies].slice(0, 10),
      }
    })
  },

  removeRecentStudy: (id) => {
    set((state) => ({
      recentStudies: state.recentStudies.filter((s) => s.id !== id),
    }))
  },

  clearRecentStudies: () => {
    set({ recentStudies: [] })
  },
}))
