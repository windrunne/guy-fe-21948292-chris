// Main application component

import { useState } from 'react'
import { FileText, MessageSquare, Plus } from 'lucide-react'
import ChatInterface from './components/ChatInterface'
import DocumentUpload from './components/DocumentUpload'
import { View, Message, UserData } from './types'
import { INITIAL_ASSISTANT_MESSAGE } from './constants'

function App() {
  const [currentView, setCurrentView] = useState<View>('chat')
  
  // Lift chat state to App level so it persists across tab switches
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: INITIAL_ASSISTANT_MESSAGE,
      timestamp: new Date()
    }
  ])
  const [userData, setUserData] = useState<UserData>({})
  
  const handleNewChat = () => {
    // Only reset when explicitly clicking "New Chat"
    if (window.confirm('Start a new chat? This will clear your current conversation history.')) {
      setMessages([
        {
          role: 'assistant',
          content: INITIAL_ASSISTANT_MESSAGE,
          timestamp: new Date()
        }
      ])
      setUserData({})
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Market Chatbot
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                AI-powered market analysis
              </p>
            </div>
            
            {/* Navigation */}
            <nav className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentView('chat')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'chat'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Chat interface"
              >
                <MessageSquare size={18} />
                <span className="hidden sm:inline">Chat</span>
              </button>
              <button
                onClick={() => setCurrentView('upload')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'upload'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Document upload"
              >
                <FileText size={18} />
                <span className="hidden sm:inline">Upload</span>
              </button>
              
              {/* New Chat Button - Only show when in chat view */}
              {currentView === 'chat' && (
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 border border-gray-200"
                  aria-label="Start new chat"
                  title="Start a new chat conversation"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-white">
          <div className="h-full max-w-4xl mx-auto">
            {currentView === 'chat' ? (
              <ChatInterface 
                messages={messages}
                setMessages={setMessages}
                userData={userData}
                setUserData={setUserData}
              />
            ) : (
              <div className="h-full overflow-y-auto px-4 sm:px-6 py-6">
                <DocumentUpload />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
