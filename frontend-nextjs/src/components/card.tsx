import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'gradient' | 'glass' | 'elevated'
  hover?: boolean
  gradient?: string
}

const Card = ({ 
  children, 
  className = '', 
  padding = 'md', 
  shadow = 'md',
  variant = 'default',
  hover = true,
  gradient,
  ...props 
}: CardProps) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'none': return ''
      case 'sm': return 'p-4'
      case 'lg': return 'p-8'
      case 'xl': return 'p-12'
      default: return 'p-6'
    }
  }

  const getShadowClass = () => {
    switch (shadow) {
      case 'none': return ''
      case 'sm': return 'shadow-sm'
      case 'lg': return 'shadow-lg'
      case 'xl': return 'shadow-2xl'
      default: return 'shadow-md'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return `bg-gradient-to-br ${gradient || 'from-[var(--primary)]/10 via-white to-amber-50/50'} border border-[var(--primary)]/20`
      case 'glass':
        return 'bg-white/80 backdrop-blur-xl border border-white/20'
      case 'elevated':
        return 'bg-white border border-gray-100 shadow-xl hover:shadow-2xl'
      default:
        return 'bg-white border border-gray-100'
    }
  }

  const getHoverEffects = () => {
    if (!hover) return ''
    
    switch (variant) {
      case 'gradient':
        return 'hover:shadow-xl hover:shadow-[var(--primary)]/10 hover:-translate-y-1 hover:scale-[1.02]'
      case 'glass':
        return 'hover:bg-white/90 hover:shadow-xl hover:-translate-y-1'
      case 'elevated':
        return 'translate-y-0 hover:-translate-y-2'
      default:
        return 'hover:shadow-xl hover:border-[var(--primary)]/20 hover:-translate-y-1'
    }
  }

  return (
    <div 
      className={`
        ${getVariantClasses()}
        ${getShadowClass()} 
        ${getPaddingClass()} 
        ${getHoverEffects()}
        rounded-2xl lg:rounded-3xl
        transition-all duration-500 ease-out
        group overflow-hidden
        ${className}
      `}
      {...props}
    >
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl lg:rounded-3xl z-[-1]"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default Card