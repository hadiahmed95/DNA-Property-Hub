import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
}

const Card = ({ 
  children, 
  className = '', 
  padding = 'md', 
  shadow = 'md',
  ...props 
}: CardProps) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'sm': return 'p-4'
      case 'lg': return 'p-8'
      default: return 'p-6'
    }
  }

  const getShadowClass = () => {
    switch (shadow) {
      case 'sm': return 'shadow-sm'
      case 'lg': return 'shadow-xl'
      default: return 'shadow-lg'
    }
  }

  return (
    <div 
      className={`bg-white rounded-2xl ${getShadowClass()} ${getPaddingClass()} transition-all duration-200 hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card