import { MontserratFont, popinsFont } from '@/app/fonts'
import React from 'react'

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className={`text-xl font-bold text-gray-900 ${MontserratFont.className}`}>
          Recent Activity
        </h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {[
            { action: 'Property Added', time: '2 min ago', type: 'success' },
            { action: 'Client Meeting', time: '1 hour ago', type: 'info' },
            { action: 'Sale Completed', time: '3 hours ago', type: 'success' },
            { action: 'Document Uploaded', time: '5 hours ago', type: 'info' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className={`w-3 h-3 rounded-full ${activity.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                } animate-pulse`}></div>
              <div className="flex-1">
                <p className={`text-sm font-medium text-gray-900 ${popinsFont['500'].className}`}>
                  {activity.action}
                </p>
                <p className={`text-xs text-gray-500 ${popinsFont['400'].className}`}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentActivity