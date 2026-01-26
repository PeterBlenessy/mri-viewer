/**
 * Platform detection utilities
 *
 * Detect whether the app is running in:
 * - Web browser (standard deployment)
 * - Tauri desktop app (with Python ML capabilities)
 */

/**
 * Check if running inside Tauri desktop app
 *
 * @returns true if running in Tauri, false if running in web browser
 */
export function isTauri(): boolean {
  // Check if window object exists (SSR safety)
  if (typeof window === 'undefined') {
    return false
  }

  // Tauri injects __TAURI__ global when running as desktop app
  return '__TAURI__' in window
}

/**
 * Get the current platform
 *
 * @returns 'desktop' if Tauri, 'web' if browser
 */
export function getPlatform(): 'web' | 'desktop' {
  return isTauri() ? 'desktop' : 'web'
}

/**
 * Get platform display name
 *
 * @returns Human-readable platform name
 */
export function getPlatformName(): string {
  return isTauri() ? 'Desktop App' : 'Web App'
}

/**
 * Check if AI detection is available (real, not mock)
 *
 * @returns true if real AI is available (desktop only)
 */
export function hasRealAI(): boolean {
  return isTauri()
}
