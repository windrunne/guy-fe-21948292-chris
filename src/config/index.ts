// Application configuration

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  CHAT: '/api/chat/',
  CHAT_STREAM: '/api/chat/stream',
  DOCUMENTS_UPLOAD: '/api/documents/upload',
  DOCUMENTS_STATS: '/api/documents/stats',
  DATA_SAVE: '/api/data/save'
} as const

