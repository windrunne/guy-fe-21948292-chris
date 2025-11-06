// Main chat interface component

import { Message, UserData } from '../types'
import { useChat } from '../hooks/useChat'
import { MessageBubble } from './MessageBubble'
import { UserDataIndicator } from './UserDataIndicator'
import { ChatInput } from './ChatInput'

interface ChatInterfaceProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  userData: UserData
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  userData,
  setUserData
}) => {
  const { input, setInput, isLoading, messagesEndRef, handleSend } = useChat({
    messages,
    setMessages,
    userData,
    setUserData
  })

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-0">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1
          const isStreaming = isLoading && isLastMessage && message.role === 'assistant'
          
          return (
            <MessageBubble
              key={index}
              message={message}
              isStreaming={isStreaming}
            />
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* User Data Collection Indicator */}
      <UserDataIndicator userData={userData} />

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSend={handleSend}
      />
    </div>
  )
}

export default ChatInterface
