import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', ...rest }) => {
  return (
    <div className={`rounded-lg p-4 shadow-sm bg-surface-border ${className}`} {...rest}>
      {title && <div className="text-lg font-semibold text-ui-foreground">{title}</div>}
      {subtitle && <div className="text-sm text-ui-muted">{subtitle}</div>}
      <div className="mt-2 text-ui-foreground">{children}</div>
    </div>
  )
}

export default Card
