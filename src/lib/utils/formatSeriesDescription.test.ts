/**
 * Unit tests for formatSeriesDescription - P2 Supporting Tests
 *
 * Test coverage:
 * - Abbreviation mapping (T1, T2, FLAIR, etc.)
 * - Orientation mapping (SAG, COR, AX, etc.)
 * - Underscore replacement
 * - Capitalization
 * - Edge cases (empty, undefined, numbers, fractions)
 *
 * Target: ~20 assertions
 */

import { describe, it, expect } from 'vitest'
import { formatSeriesDescription } from './formatSeriesDescription'

describe('formatSeriesDescription', () => {
  describe('Abbreviation Mapping', () => {
    it('should format sequence abbreviations (T1, T2, FLAIR)', () => {
      expect(formatSeriesDescription('t1')).toBe('T1')
      expect(formatSeriesDescription('t2')).toBe('T2')
      expect(formatSeriesDescription('flair')).toBe('FLAIR')
      expect(formatSeriesDescription('stir')).toBe('STIR')
      expect(formatSeriesDescription('dwi')).toBe('DWI')
    })

    it('should format orientation abbreviations', () => {
      expect(formatSeriesDescription('sag')).toBe('Sagittal')
      expect(formatSeriesDescription('cor')).toBe('Coronal')
      expect(formatSeriesDescription('ax')).toBe('Axial')
      expect(formatSeriesDescription('tra')).toBe('Transverse')
    })

    it('should format contrast abbreviations', () => {
      expect(formatSeriesDescription('pre')).toBe('Pre-contrast')
      expect(formatSeriesDescription('post')).toBe('Post-contrast')
      expect(formatSeriesDescription('gd')).toBe('Gd')
    })

    it('should handle case-insensitive abbreviations', () => {
      expect(formatSeriesDescription('T1')).toBe('T1')
      expect(formatSeriesDescription('FLAIR')).toBe('FLAIR')
      expect(formatSeriesDescription('SAG')).toBe('Sagittal')
    })
  })

  describe('Complex Descriptions', () => {
    it('should format multi-word descriptions', () => {
      expect(formatSeriesDescription('t1 sag mpr')).toBe('T1 Sagittal MPR')
    })

    it('should replace underscores with spaces', () => {
      expect(formatSeriesDescription('t1_sag_mpr')).toBe('T1 Sagittal MPR')
      expect(formatSeriesDescription('t2_flair_ax')).toBe('T2 FLAIR Axial')
    })

    it('should handle mixed abbreviations and regular words', () => {
      expect(formatSeriesDescription('t1 dark fluid')).toBe('T1 Dark Fluid')
      expect(formatSeriesDescription('t2 axial tse')).toBe('T2 Axial TSE')
    })

    it('should capitalize non-abbreviation words', () => {
      expect(formatSeriesDescription('brain protocol')).toBe('Brain Protocol')
      expect(formatSeriesDescription('spine cervical')).toBe('Spine Cervical')
    })
  })

  describe('Special Cases', () => {
    it('should preserve number fractions', () => {
      expect(formatSeriesDescription('2/1')).toBe('2/1')
      expect(formatSeriesDescription('t1 3/2 sag')).toBe('T1 3/2 Sagittal')
    })

    it('should handle 2D and 3D abbreviations', () => {
      expect(formatSeriesDescription('3d t1')).toBe('3D T1')
      expect(formatSeriesDescription('2d flair')).toBe('2D FLAIR')
    })

    it('should handle single word descriptions', () => {
      expect(formatSeriesDescription('localizer')).toBe('Localizer')
      expect(formatSeriesDescription('scout')).toBe('Scout')
    })

    it('should handle empty string', () => {
      expect(formatSeriesDescription('')).toBe('Unknown Series')
    })

    it('should handle undefined', () => {
      expect(formatSeriesDescription(undefined)).toBe('Unknown Series')
    })

    it('should handle descriptions with extra spaces', () => {
      expect(formatSeriesDescription('t1  sag  mpr')).toBe('T1  Sagittal  MPR')
    })
  })

  describe('Real-World Examples', () => {
    it('should format typical MR sequence names', () => {
      expect(formatSeriesDescription('T1_MPR_SAG')).toBe('T1 MPR Sagittal')
      expect(formatSeriesDescription('t2_tse_tra')).toBe('T2 TSE Transverse')
      expect(formatSeriesDescription('FLAIR_AX_DARK_FLUID')).toBe('FLAIR Axial Dark Fluid')
      expect(formatSeriesDescription('DWI_EPI_TRACE')).toBe('DWI EPI Trace')
    })

    it('should format contrast-enhanced sequences', () => {
      expect(formatSeriesDescription('t1_post_gd_sag')).toBe('T1 Post-contrast Gd Sagittal')
      expect(formatSeriesDescription('T1_PRE_SAG')).toBe('T1 Pre-contrast Sagittal')
    })

    it('should format fat-saturated sequences', () => {
      expect(formatSeriesDescription('t1_fs_ax')).toBe('T1 Fat Sat Axial')
      expect(formatSeriesDescription('T2_STIR_COR')).toBe('T2 STIR Coronal')
    })
  })
})
