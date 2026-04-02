import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...rest }) => {
  const base = 'px-4 py-2 rounded-md font-medium '
  const v = variant === 'primary' ? 'bg-primary text-white hover:opacity-95' : 'bg-secondary text-white'
  return (
    <button className={`${base} ${v} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
