import { create } from 'zustand'

export interface AiAnalysis {
  id: string
  sopInstanceUID: string
  instanceNumber: number
  findings: string
  createdAt: string
  createdBy: string
  modelVersion: string
}

interface AiAnalysisState {
  analyses: AiAnalysis[]
  selectedAnalysisId: string | null
  isAnalyzing: boolean
  isModalVisible: boolean

  // Actions
  addAnalysis: (analysis: AiAnalysis) => void
  deleteAnalysis: (id: string) => void
  deleteAnalysisForInstance: (sopInstanceUID: string) => void
  getAnalysisForInstance: (sopInstanceUID: string) => AiAnalysis | undefined
  setAnalyzing: (analyzing: boolean) => void
  showModal: (analysisId: string) => void
  hideModal: () => void
  reset: () => void
}

const initialState = {
  analyses: [],
  selectedAnalysisId: null,
  isAnalyzing: false,
  isModalVisible: false,
}

export const useAiAnalysisStore = create<AiAnalysisState>((set, get) => ({
  ...initialState,

  addAnalysis: (analysis) =>
    set((state) => ({
      analyses: [...state.analyses.filter(a => a.sopInstanceUID !== analysis.sopInstanceUID), analysis],
      selectedAnalysisId: analysis.id,
      isModalVisible: true,
    })),

  deleteAnalysis: (id) =>
    set((state) => ({
      analyses: state.analyses.filter((a) => a.id !== id),
      selectedAnalysisId: state.selectedAnalysisId === id ? null : state.selectedAnalysisId,
      isModalVisible: state.selectedAnalysisId === id ? false : state.isModalVisible,
    })),

  deleteAnalysisForInstance: (sopInstanceUID) =>
    set((state) => ({
      analyses: state.analyses.filter((a) => a.sopInstanceUID !== sopInstanceUID),
    })),

  getAnalysisForInstance: (sopInstanceUID) => {
    return get().analyses.find((a) => a.sopInstanceUID === sopInstanceUID)
  },

  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  showModal: (analysisId) => set({ selectedAnalysisId: analysisId, isModalVisible: true }),

  hideModal: () => set({ isModalVisible: false }),

  reset: () => set(initialState),
}))
