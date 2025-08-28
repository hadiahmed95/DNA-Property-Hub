import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'lite' | 'secondary' | 'dark' | 'ghost' | 'gradient' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children: React.ReactNode
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Button = ({ 
  variant = 'primary', 
  size = 'md',
  className = '', 
  children, 
  loading = false, 
  disabled,
  icon,
  fullWidth = false,
  ...props 
}: ButtonProps) => {
  
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm min-h-[36px]'
      case 'lg':
        return 'px-8 py-4 text-lg min-h-[52px]'
      case 'xl':
        return 'px-10 py-5 text-xl min-h-[60px]'
      default:
        return 'px-6 py-3 text-base min-h-[44px]'
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-gradient-to-r from-[var(--primary)] to-amber-500 
          hover:from-amber-600 hover:to-orange-600 
          text-white shadow-lg hover:shadow-xl 
          hover:shadow-[var(--primary)]/25
          border-0
        `
      case 'lite':
        return 'bg-[#9e8f72a6] hover:bg-[#9e8f7280] text-white'
      case 'gradient':
        return `
          bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500
          hover:from-amber-600 hover:via-orange-500 hover:to-red-500
          text-white shadow-lg hover:shadow-xl
          hover:shadow-orange-500/25
          border-0
        `
      case 'dark':
        return `
          bg-[var(--secondary)] hover:bg-gray-800 
          text-white shadow-lg hover:shadow-xl
          border-0
        `
      case 'secondary':
        return `
          bg-gray-100 hover:bg-gray-200 
          text-gray-900 shadow-sm hover:shadow-md
          border border-gray-200 hover:border-gray-300
        `
      case 'ghost':
        return `
          bg-transparent hover:bg-[var(--primary)]/10 
          text-[var(--primary)] hover:text-amber-600
          border border-[var(--primary)]/20 hover:border-[var(--primary)]/40
        `
      case 'outline':
        return `
          bg-white hover:bg-[var(--primary)] 
          text-[var(--primary)] hover:text-white
          border-2 border-[var(--primary)] 
          shadow-sm hover:shadow-lg hover:shadow-[var(--primary)]/25
        `
      default:
        return `
          bg-gray-200 hover:bg-gray-300 
          text-black border border-gray-300
        `
    }
  }

  const getWidthStyle = () => {
    return fullWidth ? 'w-full' : 'min-w-[120px]'
  }

  return (
    <button
      className={`
        ${getSizeStyles()}
        ${getVariantStyles()}
        ${getWidthStyle()}
        font-semibold rounded-xl lg:rounded-2xl
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20
        inline-flex items-center justify-center
        relative overflow-hidden
        group
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{typeof children === 'string' ? 'Loading...' : children}</span>
          </>
        ) : (
          <>
            {icon && <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>}
            <span className="transition-all duration-200">{children}</span>
          </>
        )}
      </div>
    </button>
  )
}

export default Button