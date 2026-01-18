import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDicomDate(date: string): string {
  if (!date || date.length !== 8) return date
  const year = date.substring(0, 4)
  const month = date.substring(4, 6)
  const day = date.substring(6, 8)
  return `${year}-${month}-${day}`
}

export function formatDicomTime(time: string): string {
  if (!time || time.length < 6) return time
  const hours = time.substring(0, 2)
  const minutes = time.substring(2, 4)
  const seconds = time.substring(4, 6)
  return `${hours}:${minutes}:${seconds}`
}

export function formatPatientName(name: string): string {
  if (!name) return 'Unknown'
  // DICOM names are formatted as "LastName^FirstName^MiddleName"
  const parts = name.split('^')
  if (parts.length >= 2) {
    return `${parts[1]} ${parts[0]}`
  }
  return name
}
