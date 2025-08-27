import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'lite' | 'secondary' | 'dark'
  className?: string
  children: React.ReactNode
}

const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-full min-w-[150px] ${variant === 'primary' ? 'bg-[var(--primary)] text-white' : variant === 'lite' ? 'bg-[#9e8f72a6] text-white' : variant === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button