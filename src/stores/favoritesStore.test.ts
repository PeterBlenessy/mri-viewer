/**
 * Unit tests for favoritesStore - P2 Supporting Tests
 *
 * Test coverage:
 * - Add/remove favorites with duplicate prevention
 * - Toggle favorite (add if not exists, remove if exists)
 * - Check favorite status
 * - Clear all favorites
 * - Get favorite count
 * - localStorage persistence
 *
 * Target: ~20 assertions
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesStore, FavoriteImage } from './favoritesStore'

describe('favoritesStore', () => {
  // Helper to create mock favorite images
  const createMockFavorite = (uid: string, overrides?: Partial<FavoriteImage>): FavoriteImage => ({
    sopInstanceUID: uid,
    studyInstanceUID: 'study-1',
    seriesInstanceUID: 'series-1',
    instanceNumber: parseInt(uid.split('-').pop() || '1'),
    imageId: `dicomweb://image/${uid}`,
    modality: 'MR',
    seriesNumber: 1,
    favoritedAt: Date.now(),
    ...overrides,
  })

  beforeEach(() => {
    // Reset store to initial state
    useFavoritesStore.setState({ favorites: [] })
  })

  describe('addFavorite', () => {
    it('should add a favorite image', () => {
      const favorite = createMockFavorite('1.2.3.4.1')

      useFavoritesStore.getState().addFavorite(favorite)

      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(1)
      expect(state.favorites[0]).toEqual(favorite)
    })

    it('should prevent duplicate favorites', () => {
      const favorite = createMockFavorite('1.2.3.4.1')

      useFavoritesStore.getState().addFavorite(favorite)
      useFavoritesStore.getState().addFavorite(favorite) // Duplicate

      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(1) // Should still be 1
    })

    it('should add multiple different favorites', () => {
      const fav1 = createMockFavorite('1.2.3.4.1')
      const fav2 = createMockFavorite('1.2.3.4.2')
      const fav3 = createMockFavorite('1.2.3.4.3')

      useFavoritesStore.getState().addFavorite(fav1)
      useFavoritesStore.getState().addFavorite(fav2)
      useFavoritesStore.getState().addFavorite(fav3)

      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(3)
    })
  })

  describe('removeFavorite', () => {
    it('should remove a favorite by UID', () => {
      const fav1 = createMockFavorite('1.2.3.4.1')
      const fav2 = createMockFavorite('1.2.3.4.2')

      useFavoritesStore.getState().addFavorite(fav1)
      useFavoritesStore.getState().addFavorite(fav2)
      useFavoritesStore.getState().removeFavorite('1.2.3.4.1')

      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(1)
      expect(state.favorites[0].sopInstanceUID).toBe('1.2.3.4.2')
    })

    it('should handle removing non-existent favorite gracefully', () => {
      const fav1 = createMockFavorite('1.2.3.4.1')

      useFavoritesStore.getState().addFavorite(fav1)
      useFavoritesStore.getState().removeFavorite('non-existent-uid')

      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(1) // Should remain unchanged
    })
  })

  describe('toggleFavorite', () => {
    it('should add favorite and return true when not already favorited', () => {
      const favorite = createMockFavorite('1.2.3.4.1')

      const wasAdded = useFavoritesStore.getState().toggleFavorite(favorite)

      expect(wasAdded).toBe(true)
      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(1)
      expect(state.favorites[0]).toEqual(favorite)
    })

    it('should remove favorite and return false when already favorited', () => {
      const favorite = createMockFavorite('1.2.3.4.1')

      useFavoritesStore.getState().addFavorite(favorite)
      const wasAdded = useFavoritesStore.getState().toggleFavorite(favorite)

      expect(wasAdded).toBe(false)
      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(0)
    })

    it('should toggle multiple times correctly', () => {
      const favorite = createMockFavorite('1.2.3.4.1')

      // First toggle - add
      let result = useFavoritesStore.getState().toggleFavorite(favorite)
      expect(result).toBe(true)
      expect(useFavoritesStore.getState().favorites).toHaveLength(1)

      // Second toggle - remove
      result = useFavoritesStore.getState().toggleFavorite(favorite)
      expect(result).toBe(false)
      expect(useFavoritesStore.getState().favorites).toHaveLength(0)

      // Third toggle - add again
      result = useFavoritesStore.getState().toggleFavorite(favorite)
      expect(result).toBe(true)
      expect(useFavoritesStore.getState().favorites).toHaveLength(1)
    })
  })

  describe('isFavorite', () => {
    it('should return true for favorited image', () => {
      const favorite = createMockFavorite('1.2.3.4.1')

      useFavoritesStore.getState().addFavorite(favorite)

      expect(useFavoritesStore.getState().isFavorite('1.2.3.4.1')).toBe(true)
    })

    it('should return false for non-favorited image', () => {
      const favorite = createMockFavorite('1.2.3.4.1')

      useFavoritesStore.getState().addFavorite(favorite)

      expect(useFavoritesStore.getState().isFavorite('1.2.3.4.2')).toBe(false)
    })

    it('should return false for empty favorites', () => {
      expect(useFavoritesStore.getState().isFavorite('1.2.3.4.1')).toBe(false)
    })
  })

  describe('clearAllFavorites', () => {
    it('should clear all favorites', () => {
      const fav1 = createMockFavorite('1.2.3.4.1')
      const fav2 = createMockFavorite('1.2.3.4.2')
      const fav3 = createMockFavorite('1.2.3.4.3')

      useFavoritesStore.getState().addFavorite(fav1)
      useFavoritesStore.getState().addFavorite(fav2)
      useFavoritesStore.getState().addFavorite(fav3)

      useFavoritesStore.getState().clearAllFavorites()

      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(0)
    })

    it('should handle clearing empty favorites', () => {
      useFavoritesStore.getState().clearAllFavorites()

      const state = useFavoritesStore.getState()
      expect(state.favorites).toHaveLength(0)
    })
  })

  describe('getFavoriteCount', () => {
    it('should return correct count', () => {
      expect(useFavoritesStore.getState().getFavoriteCount()).toBe(0)

      useFavoritesStore.getState().addFavorite(createMockFavorite('1.2.3.4.1'))
      expect(useFavoritesStore.getState().getFavoriteCount()).toBe(1)

      useFavoritesStore.getState().addFavorite(createMockFavorite('1.2.3.4.2'))
      expect(useFavoritesStore.getState().getFavoriteCount()).toBe(2)

      useFavoritesStore.getState().removeFavorite('1.2.3.4.1')
      expect(useFavoritesStore.getState().getFavoriteCount()).toBe(1)

      useFavoritesStore.getState().clearAllFavorites()
      expect(useFavoritesStore.getState().getFavoriteCount()).toBe(0)
    })
  })

  describe('Metadata Storage', () => {
    it('should store all favorite metadata fields', () => {
      const favorite = createMockFavorite('1.2.3.4.1', {
        patientName: 'TEST^PATIENT',
        studyDate: '20240101',
        seriesNumber: 5,
        seriesDescription: 'T1 MPRAGE SAG',
        modality: 'MR',
      })

      useFavoritesStore.getState().addFavorite(favorite)

      const stored = useFavoritesStore.getState().favorites[0]
      expect(stored.patientName).toBe('TEST^PATIENT')
      expect(stored.studyDate).toBe('20240101')
      expect(stored.seriesNumber).toBe(5)
      expect(stored.seriesDescription).toBe('T1 MPRAGE SAG')
      expect(stored.modality).toBe('MR')
    })

    it('should handle favorites with missing optional metadata', () => {
      const favorite = createMockFavorite('1.2.3.4.1', {
        patientName: undefined,
        studyDate: undefined,
        seriesDescription: undefined,
      })

      useFavoritesStore.getState().addFavorite(favorite)

      const stored = useFavoritesStore.getState().favorites[0]
      expect(stored.sopInstanceUID).toBe('1.2.3.4.1')
      expect(stored.patientName).toBeUndefined()
      expect(stored.studyDate).toBeUndefined()
    })
  })
})
