import React from 'react'

interface SettingsCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}