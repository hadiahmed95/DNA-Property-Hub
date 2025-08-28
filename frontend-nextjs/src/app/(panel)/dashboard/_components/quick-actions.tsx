import { MontserratFont, popinsFont } from '@/app/fonts'
import React from 'react'

const QuickActions = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h2 className={`text-xl font-bold text-gray-900 mb-6 ${MontserratFont.className}`}>
          Quick Actions
        </h2>

        <div className="space-y-3">
          {[
            { label: 'Schedule Meeting', icon: '📅', color: 'bg-blue-500' },
            { label: 'Generate Report', icon: '📊', color: 'bg-purple-500' },
            { label: 'Import Data', icon: '📁', color: 'bg-emerald-500' },
            { label: 'Manage Agents', icon: '👥', color: 'bg-orange-500' }
          ].map((action, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-[var(--primary)]/10 hover:to-amber-50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 group"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-sm">{action.icon}</span>
              </div>
              <span className={`text-gray-700 font-medium group-hover:text-gray-900 ${popinsFont['500'].className}`}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickActions