// File validation utilities

import { ALLOWED_FILE_TYPES, ALLOWED_FILE_EXTENSIONS, FILE_SIZE_LIMIT_MB } from '../constants'

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  const hasValidExtension = ALLOWED_FILE_EXTENSIONS.includes(extension as any)
  
  // Check MIME type
  const hasValidType = ALLOWED_FILE_TYPES.includes(file.type as any)
  
  if (!hasValidExtension && !hasValidType) {
    return {
      valid: false,
      error: `Invalid file type. Please upload: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`
    }
  }
  
  // Check file size
  const fileSizeMB = file.size / 1024 / 1024
  if (fileSizeMB > FILE_SIZE_LIMIT_MB) {
    return {
      valid: false,
      error: `File size exceeds ${FILE_SIZE_LIMIT_MB}MB limit`
    }
  }
  
  return { valid: true }
}

export const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

