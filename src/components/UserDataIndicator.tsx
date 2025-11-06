// User data collection indicator component

import { UserData } from '../types'
import { Mail } from 'lucide-react'

interface UserDataIndicatorProps {
  userData: UserData
}

export const UserDataIndicator: React.FC<UserDataIndicatorProps> = ({ userData }) => {
  const isComplete = userData.name && userData.email && userData.income

  if (isComplete) {
    return (
      <div className="border-t border-gray-200 bg-green-50 px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="text-green-600" size={16} />
            <span className="text-green-700 font-medium">
              ✅ All data collected and email sent automatically
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium text-gray-600 mb-2">Collecting information:</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className={userData.name ? 'text-green-600 font-medium' : ''}>
            ✓ Name: {userData.name || 'Pending'}
          </span>
          <span className={userData.email ? 'text-green-600 font-medium' : ''}>
            ✓ Email: {userData.email || 'Pending'}
          </span>
          <span className={userData.income ? 'text-green-600 font-medium' : ''}>
            ✓ Income: {userData.income || 'Pending'}
          </span>
        </div>
      </div>
    </div>
  )
}

