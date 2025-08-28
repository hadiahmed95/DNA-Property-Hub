import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'lite' | 'secondary' | 'dark'
  className?: string
  children: React.ReactNode
  loading?: boolean
}

const Button = ({ variant = 'primary', className, children, loading = false, disabled, ...props }: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--primary)] hover:bg-amber-600 text-white shadow-lg hover:shadow-xl'
      case 'lite':
        return 'bg-[#9e8f72a6] hover:bg-[#9e8f7280] text-white'
      case 'dark':
        return 'bg-gray-800 hover:bg-gray-900 text-white shadow-lg'
      case 'secondary':
      default:
        return 'bg-gray-200 hover:bg-gray-300 text-black'
    }
  }

  return (
    <button
      className={`px-4 py-2 rounded-full min-w-[150px] font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none ${getVariantStyles()} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{typeof children === 'string' ? 'Loading...' : children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button