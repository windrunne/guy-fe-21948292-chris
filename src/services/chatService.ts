// Chat service for API communication

import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../config'
import { ChatResponse, UserData, SSEEvent } from '../types'
import { createSSEReader } from '../utils/sseParser'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const chatService = {
  async sendMessage(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    userData?: UserData
  ): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>(API_ENDPOINTS.CHAT, {
      message,
      conversation_history: conversationHistory,
      user_data: userData || {},
    })
    return response.data
  },

  async sendMessageStream(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    userData: UserData | undefined,
    onChunk: (chunk: string) => void,
    onComplete: (result: ChatResponse) => void,
    onError: (error: string) => void,
    onProgress?: (status: string, message: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHAT_STREAM}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_history: conversationHistory,
          user_data: userData || {},
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let finalResponse: ChatResponse | null = null

      await createSSEReader(response, (event: SSEEvent) => {
        switch (event.type) {
          case 'start':
            if (onProgress) {
              onProgress(event.status || 'processing', 'Starting...')
            }
            break
          case 'progress':
            if (onProgress) {
              onProgress(event.status || 'processing', event.message || '')
            }
            break
          case 'chunk':
            if (event.data) {
              onChunk(event.data)
            }
            break
          case 'complete':
            finalResponse = {
              response: event.response || '',
              user_data: event.user_data || {},
              rag_used: event.rag_used || false,
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
      onError(error instanceof Error ? error.message : 'Failed to send streaming message')
    }
  },

  async saveUserData(userData: UserData): Promise<void> {
    await api.post(API_ENDPOINTS.DATA_SAVE, userData)
  },
}

