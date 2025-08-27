import React from 'react'

interface SectionProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
}

const Section = ({ children, className, ...rest }: SectionProps) => {
  return (
    <div className={`max-w-[1280px] mx-auto ${className}`} {...rest}>
      {children}
    </div>
  )
}

export default Section