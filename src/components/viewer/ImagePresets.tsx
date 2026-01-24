import { useViewportStore } from '@/stores/viewportStore'

export function ImagePresets() {
  const setWindowLevel = useViewportStore((state) => state.setWindowLevel)
  const resetSettings = useViewportStore((state) => state.resetSettings)

  const presets = [
    {
      name: 'Soft Tissue',
      contrast: 400,
      brightness: 40,
      description: 'General soft tissue imaging'
    },
    {
      name: 'Lung',
      contrast: 1500,
      brightness: -600,
      description: 'Lung parenchyma'
    },
    {
      name: 'Bone',
      contrast: 2500,
      brightness: 480,
      description: 'Bone structures'
    },
    {
      name: 'Brain',
      contrast: 80,
      brightness: 40,
      description: 'Brain tissue'
    },
    {
      name: 'Liver',
      contrast: 150,
      brightness: 30,
      description: 'Liver parenchyma'
    },
    {
      name: 'Abdomen',
      contrast: 350,
      brightness: 40,
      description: 'General abdomen'
    }
  ]

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setWindowLevel(preset.brightness, preset.contrast)}
            className="px-3 py-2 bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded text-xs text-left transition-colors border border-[#2a2a2a] hover:border-[#3a3a3a]"
            title={`${preset.description}\nContrast: ${preset.contrast}, Brightness: ${preset.brightness}`}
          >
            <div className="font-medium text-gray-100">{preset.name}</div>
            <div className="text-[10px] text-gray-500">
              C:{preset.contrast} B:{preset.brightness}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={resetSettings}
        className="w-full px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-xs font-medium transition-colors"
        title="Reset to DICOM metadata or modality defaults"
      >
        Reset to Default
      </button>
    </div>
  )
}
