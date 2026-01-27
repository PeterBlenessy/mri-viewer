import { isTauri } from '@/lib/utils/platform'
import { mockDetector, MockVertebralDetector } from './mockVertebralDetector'
import { tauriDetector, TauriVertebralDetector } from './tauriVertebralDetector'

/**
 * Vertebral detector interface
 */
export type VertebralDetector = MockVertebralDetector | TauriVertebralDetector

/**
 * Get the appropriate vertebral detector based on platform
 *
 * - Desktop (Tauri): Real AI detector via Python sidecar
 * - Web: Mock detector for demo purposes
 */
export function getDetector(): VertebralDetector {
  if (isTauri()) {
    console.log('[DetectorFactory] Using Tauri AI detector (real)')
    return tauriDetector
  }

  console.log('[DetectorFactory] Using mock AI detector (simulation)')
  return mockDetector
}

/**
 * Check if real AI is available
 */
export function isRealAI(): boolean {
  return isTauri()
}
