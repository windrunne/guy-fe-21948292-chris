// Shared types across the application

export type View = 'chat' | 'upload'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface UserData {
  name?: string
  email?: string
  income?: string
}

export interface ChatMessage {
  message: string
  conversation_history: Array<{ role: string; content: string }>
  user_data?: UserData
}

export interface ChatResponse {
  response: string
  user_data: UserData
  rag_used: boolean
}

export interface UploadResponse {
  success: boolean
  message: string
  filename?: string
  chunks_processed?: number
  total_chars?: number
}

export interface UploadProgress {
  status: string
  message: string
  progress: number
}

export interface SSEEvent {
  type: 'start' | 'progress' | 'chunk' | 'complete' | 'error'
  status?: string
  message?: string
  data?: string
  response?: string
  user_data?: UserData
  rag_used?: boolean
  progress?: number
  success?: boolean
  filename?: string
  chunks_processed?: number
  total_chars?: number
  error?: string
}

