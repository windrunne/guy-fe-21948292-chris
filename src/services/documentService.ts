// Document service for API communication

import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../config'
import { UploadResponse, SSEEvent } from '../types'
import { createSSEReader } from '../utils/sseParser'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const documentService = {
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadResponse>(
      API_ENDPOINTS.DOCUMENTS_UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  async uploadDocumentStream(
    file: File,
    onProgress: (status: string, message: string, progress: number) => void,
    onComplete: (result: UploadResponse) => void,
    onError: (error: string) => void
  ): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DOCUMENTS_UPLOAD}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      let finalResponse: UploadResponse | null = null

      await createSSEReader(response, (event: SSEEvent) => {
        switch (event.type) {
          case 'start':
            onProgress(event.status || 'uploading', event.message || 'Starting...', event.progress || 0)
            break
          case 'progress':
            onProgress(event.status || 'uploading', event.message || '', event.progress || 0)
            break
          case 'complete':
            finalResponse = {
              success: event.success !== false,
              message: event.message || 'Upload successful',
              filename: event.filename,
              chunks_processed: event.chunks_processed,
              total_chars: event.total_chars,
            }
            break
          case 'error':
            onError(event.error || 'Unknown error occurred')
            return
        }
      })

      if (finalResponse) {
        onComplete(finalResponse)
      } else {
        onError('Stream completed but no final response received')
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to upload document')
    }
  },

  async getStats(): Promise<any> {
    const response = await api.get(API_ENDPOINTS.DOCUMENTS_STATS)
    return response.data
  },
}

