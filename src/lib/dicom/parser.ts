import * as dicomParser from 'dicom-parser'
import { DicomStudy, DicomInstance, DicomMetadata } from '@/types'
import { createImageId } from '../cornerstone/initCornerstone'

/**
 * Parse DICOM files and organize them into studies and series
 */
export async function parseDicomFiles(files: File[]): Promise<DicomStudy[]> {
  console.log(`Parsing ${files.length} DICOM files...`)

  const instances: Array<{
    file: File
    dataset: any
    metadata: DicomMetadata
  }> = []

  // Parse all files
  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const byteArray = new Uint8Array(arrayBuffer)

      // Parse DICOM file using dicom-parser
      const dataSet = dicomParser.parseDicom(byteArray)

      const metadata = extractMetadata(dataSet)

      // Only include files with pixel data (actual images)
      // Skip DICOMDIR and other non-image DICOM files
      // Check if the file has pixel data by checking for the pixel data tag
      const hasPixelData = dataSet.elements.x7fe00010 !== undefined

      if (hasPixelData) {
        instances.push({ file, dataset: dataSet, metadata })
      } else {
        console.log(`Skipping non-image DICOM file: ${file.name} (no pixel data tag)`)
      }
    } catch (error) {
      console.error(`Failed to parse DICOM file ${file.name}:`, error)
    }
  }

  // Organize into studies and series
  const studies = organizeDicomData(instances)
  console.log(`Parsed ${studies.length} studies`)

  return studies
}

/**
 * Extract relevant metadata from a DICOM dataset
 */
function extractMetadata(dataSet: dicomParser.DataSet): DicomMetadata {
  const getString = (tag: string, defaultValue: string = ''): string => {
    try {
      return dataSet.string(tag) || defaultValue
    } catch {
      return defaultValue
    }
  }

  const getNumber = (tag: string, defaultValue: number = 0): number => {
    try {
      const value = dataSet.string(tag)
      return value ? Number(value) : defaultValue
    } catch {
      return defaultValue
    }
  }

  return {
    patientName: getString('x00100010', 'Unknown'),
    patientID: getString('x00100020', 'Unknown'),
    studyDate: getString('x00080020', ''),
    studyDescription: getString('x00081030', ''),
    seriesDescription: getString('x0008103e', ''),
    instanceNumber: getNumber('x00200013', 0),
    windowCenter: getNumber('x00281050', 40),
    windowWidth: getNumber('x00281051', 400),
    sliceLocation: getNumber('x00201041', 0),
    sliceThickness: getNumber('x00180050', 0),
    studyInstanceUID: getString('x0020000d', ''),
    seriesInstanceUID: getString('x0020000e', ''),
    sopInstanceUID: getString('x00080018', ''),
    seriesNumber: getNumber('x00200011', 0),
    modality: getString('x00080060', 'OT'),
    rows: getNumber('x00280010', 0),
    columns: getNumber('x00280011', 0),
  }
}

/**
 * Organize DICOM instances into studies and series
 */
function organizeDicomData(
  instances: Array<{
    file: File
    dataset: any
    metadata: DicomMetadata
  }>
): DicomStudy[] {
  const studiesMap = new Map<string, DicomStudy>()

  for (const { file, metadata } of instances) {
    const studyUID = String(metadata.studyInstanceUID || 'unknown')
    const seriesUID = String(metadata.seriesInstanceUID || 'unknown')

    // Get or create study
    let study = studiesMap.get(studyUID)
    if (!study) {
      study = {
        studyInstanceUID: studyUID,
        studyDate: String(metadata.studyDate || ''),
        studyDescription: String(metadata.studyDescription || ''),
        patientName: String(metadata.patientName || 'Unknown'),
        patientID: String(metadata.patientID || 'Unknown'),
        series: [],
      }
      studiesMap.set(studyUID, study)
    }

    // Get or create series
    let series = study.series.find((s) => s.seriesInstanceUID === seriesUID)
    if (!series) {
      series = {
        seriesInstanceUID: seriesUID,
        seriesNumber: Number(metadata.seriesNumber || 0),
        seriesDescription: String(metadata.seriesDescription || ''),
        modality: String(metadata.modality || 'OT'),
        instances: [],
      }
      study.series.push(series)
    }

    // Create instance
    const instance: DicomInstance = {
      sopInstanceUID: String(metadata.sopInstanceUID || ''),
      instanceNumber: Number(metadata.instanceNumber || 0),
      imageId: createImageId(file),
      rows: Number(metadata.rows || 0),
      columns: Number(metadata.columns || 0),
      metadata,
    }

    series.instances.push(instance)
  }

  // Sort everything
  const studies = Array.from(studiesMap.values())
  studies.forEach((study) => {
    study.series.sort((a, b) => a.seriesNumber - b.seriesNumber)
    study.series.forEach((series) => {
      series.instances.sort((a, b) => a.instanceNumber - b.instanceNumber)
    })
  })

  return studies
}

/**
 * Load a single DICOM file and return metadata
 */
export async function loadSingleDicomFile(file: File): Promise<DicomMetadata> {
  const arrayBuffer = await file.arrayBuffer()
  const byteArray = new Uint8Array(arrayBuffer)
  const dataSet = dicomParser.parseDicom(byteArray)
  return extractMetadata(dataSet)
}
