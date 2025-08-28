import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  variant?: 'default' | 'search'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, variant = 'default', className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{icon}</div>
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 border rounded-xl transition-all duration-200
              ${icon ? 'pl-10' : 'pl-4'}
              ${error 
                ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                : 'border-gray-300 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
              }
              ${variant === 'search' ? 'bg-gray-50 border-gray-200' : 'bg-white'}
              placeholder:text-gray-400
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input