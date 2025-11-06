// Message bubble component

import { Message } from '../types'
import { MarkdownRenderer } from './MarkdownRenderer'
import { LoadingDots } from './LoadingDots'

interface MessageBubbleProps {
  message: Message
  isStreaming: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming }) => {
  return (
    <div
      className={`group w-full ${
        message.role === 'user' ? 'bg-gray-50' : 'bg-white'
      } border-b border-gray-100`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              message.role === 'user'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {message.role === 'user' ? 'U' : 'AI'}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-800">
              {message.content ? (
                <>
                  <MarkdownRenderer content={message.content} />
                  {isStreaming && <LoadingDots />}
                </>
              ) : (
                isStreaming && (
                  <div className="inline-flex gap-1.5">
                    <LoadingDots />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

