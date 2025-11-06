// Server-Sent Events parser utilities

import { SSEEvent } from '../types'

export const parseSSELine = (line: string): SSEEvent | null => {
  if (!line.startsWith('data: ')) {
    return null
  }
  
  try {
    const event = JSON.parse(line.slice(6))
    return event
  } catch (error) {
    console.warn('Failed to parse SSE data:', line, error)
    return null
  }
}

export const createSSEReader = async (
  response: Response,
  onEvent: (event: SSEEvent) => void
): Promise<void> => {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body reader available')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const event = parseSSELine(line)
      if (event) {
        onEvent(event)
      }
    }
  }
}

