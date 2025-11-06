// Custom hook for chat functionality

import { useState, useRef, useEffect } from 'react'
import { Message, UserData } from '../types'
import { chatService } from '../services/chatService'

interface UseChatProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  userData: UserData
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
}

export const useChat = ({ messages, setMessages, userData, setUserData }: UseChatProps) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const message = input
    setInput('')
    setIsLoading(true)

    // Create placeholder assistant message immediately to show loading dots
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      // Build conversation history from existing messages (before the new user message)
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Use streaming method
      await chatService.sendMessageStream(
        message,
        conversationHistory,
        userData,
        (chunk: string) => {
          // Update the streaming message with new chunk
          setMessages(prev => {
            const updated = [...prev]
            const lastIndex = updated.length - 1
            if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + chunk
              }
            } else {
              // Create new assistant message if it doesn't exist
              updated.push({
                role: 'assistant',
                content: chunk,
                timestamp: new Date()
              })
            }
            return updated
          })
        },
        (result) => {
          // Streaming completed - update user data and save if needed
          setIsLoading(false)
          
          // Ensure the final message has the complete content
          setMessages(prev => {
            const updated = [...prev]
            const lastIndex = updated.length - 1
            if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
              // Message already updated via chunks, just ensure it's complete
              return updated
            } else if (result.response) {
              // If no streaming message was created, add the complete response
              updated.push({
                role: 'assistant',
                content: result.response,
                timestamp: new Date()
              })
            }
            return updated
          })
          
          if (result.user_data) {
            setUserData(prev => ({
              ...prev,
              ...result.user_data
            }))

            // Save to database if all data collected
            if (result.user_data.name && result.user_data.email && result.user_data.income) {
              chatService.saveUserData(result.user_data).catch(error => {
                console.error('Error saving user data:', error)
              })
            }
          }
        },
        (error: string) => {
          // Handle error
          setIsLoading(false)
          console.error('Error streaming message:', error)
          setMessages(prev => {
            const updated = [...prev]
            const lastIndex = updated.length - 1
            if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: "Sorry, I'm having a technical hiccup. Give me a moment and try again."
              }
            }
            return updated
          })
        },
        (status: string, message: string) => {
          // Progress updates (optional - can show loading state)
          console.log(`Status: ${status}, Message: ${message}`)
        }
      )
    } catch (error) {
      setIsLoading(false)
      console.error('Error sending message:', error)
      setMessages(prev => {
        const updated = [...prev]
        const lastIndex = updated.length - 1
        if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: "Sorry, I'm having a technical hiccup. Give me a moment and try again."
          }
        }
        return updated
      })
    }
  }

  return {
    input,
    setInput,
    isLoading,
    messagesEndRef,
    handleSend
  }
}

