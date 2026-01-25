/**
 * Test DICOM metadata fixtures
 *
 * These fixtures represent the parsed DicomInstance, DicomSeries, and DicomStudy
 * objects used throughout the application. Use these for testing stores and
 * components that work with DICOM data.
 */

import type { DicomInstance, DicomSeries, DicomStudy, DicomMetadata } from '@/types'

/**
 * Creates a mock DicomInstance with realistic metadata
 */
export function createMockInstance(overrides: Partial<DicomInstance> = {}): DicomInstance {
  const defaultMetadata: DicomMetadata = {
    patientName: 'TEST^PATIENT',
    patientID: 'PAT12345',
    studyDate: '20240101',
    studyDescription: 'Brain MRI',
    seriesDescription: 'T1 MPRAGE SAG',
    seriesNumber: 1,
    instanceNumber: 1,
    modality: 'MR',
    windowCenter: 128,
    windowWidth: 256,
    rows: 512,
    columns: 512,
  }

  return {
    sopInstanceUID: '1.2.840.113619.2.1.3.3.3.20240101.120000.1',
    instanceNumber: 1,
    imageId: 'dicomweb://mock/instance/1',
    rows: 512,
    columns: 512,
    metadata: defaultMetadata,
    ...overrides,
  }
}

/**
 * Creates a mock DicomSeries with multiple instances
 */
export function createMockSeries(
  numInstances = 3,
  overrides: Partial<DicomSeries> = {}
): DicomSeries {
  const instances: DicomInstance[] = []

  for (let i = 0; i < numInstances; i++) {
    instances.push(
      createMockInstance({
        instanceNumber: i + 1,
        sopInstanceUID: `1.2.840.113619.2.1.3.3.3.20240101.120000.${i + 1}`,
        imageId: `dicomweb://mock/instance/${i + 1}`,
      })
    )
  }

  return {
    seriesInstanceUID: '1.2.840.113619.2.1.2.2.2.20240101.120000',
    seriesNumber: 1,
    seriesDescription: 'T1 MPRAGE SAG',
    modality: 'MR',
    instances,
    ...overrides,
  }
}

/**
 * Creates a mock DicomStudy with multiple series
 */
export function createMockStudy(
  numSeries = 2,
  instancesPerSeries = 3,
  overrides: Partial<DicomStudy> = {}
): DicomStudy {
  const series: DicomSeries[] = []

  for (let i = 0; i < numSeries; i++) {
    series.push(
      createMockSeries(instancesPerSeries, {
        seriesInstanceUID: `1.2.840.113619.2.1.2.2.2.20240101.${i + 1}`,
        seriesNumber: i + 1,
        seriesDescription: `Series ${i + 1}`,
      })
    )
  }

  return {
    studyInstanceUID: '1.2.840.113619.2.1.1.1.1.20240101',
    studyDate: '20240101',
    studyTime: '120000',
    studyDescription: 'Brain MRI',
    patientName: 'TEST^PATIENT',
    patientID: 'PAT12345',
    series,
    ...overrides,
  }
}

/**
 * Creates a mock CT instance with appropriate window/level values
 */
export function createMockCTInstance(overrides: Partial<DicomInstance> = {}): DicomInstance {
  const instance = createMockInstance(overrides)
  instance.metadata = {
    ...instance.metadata,
    modality: 'CT',
    seriesDescription: 'CHEST CT',
    windowCenter: 40, // Lung window
    windowWidth: 400,
  }
  return instance
}

/**
 * Creates a mock MR instance with T2 weighting
 */
export function createMockT2Instance(overrides: Partial<DicomInstance> = {}): DicomInstance {
  const instance = createMockInstance(overrides)
  instance.metadata = {
    ...instance.metadata,
    modality: 'MR',
    seriesDescription: 'T2 FLAIR AX',
    windowCenter: 256,
    windowWidth: 512,
  }
  return instance
}

/**
 * Creates an instance with missing metadata (edge case testing)
 */
export function createMockIncompleteInstance(): DicomInstance {
  return createMockInstance({
    metadata: {
      studyDescription: undefined,
      seriesDescription: undefined,
      windowCenter: undefined,
      windowWidth: undefined,
      patientName: undefined,
    },
  })
}

/**
 * Creates a multi-study dataset for testing cross-study navigation
 */
export function createMockMultiStudyDataset(): DicomStudy[] {
  return [
    createMockStudy(2, 5, {
      studyInstanceUID: '1.2.840.113619.2.1.1.1.1.20240101',
      studyDescription: 'Brain MRI',
      studyDate: '20240101',
    }),
    createMockStudy(1, 3, {
      studyInstanceUID: '1.2.840.113619.2.1.1.1.1.20240102',
      studyDescription: 'Spine MRI',
      studyDate: '20240102',
    }),
  ]
}
