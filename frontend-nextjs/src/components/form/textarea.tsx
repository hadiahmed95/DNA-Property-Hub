import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none
            ${error 
              ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
              : 'border-gray-300 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
            }
            placeholder:text-gray-400 bg-white
            ${className}
          `}
          {...props}
        />
        {helperText && !error && (
          <p className="text-sm text-gray-600">{helperText}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea