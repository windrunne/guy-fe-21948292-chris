// Application constants

export const ALLOWED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/pdf',
  'text/plain'
] as const

export const ALLOWED_FILE_EXTENSIONS = ['.docx', '.doc', '.pdf', '.txt'] as const

export const INITIAL_ASSISTANT_MESSAGE = "Hey there, market maverick! What's on your mind today? Looking to dissect some earnings, talk macro trends, or explore a trading setup?"

export const FILE_SIZE_LIMIT_MB = 50 // Maximum file size in MB

export const SSE_EVENT_TYPES = {
  START: 'start',
  PROGRESS: 'progress',
  CHUNK: 'chunk',
  COMPLETE: 'complete',
  ERROR: 'error'
} as const

