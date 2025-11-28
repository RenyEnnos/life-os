import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'neon' | 'minimal'
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default' }) => {
  const baseClasses = 'border bg-transparent backdrop-blur-sm'
  
  const variantClasses = {
    default: 'border-green-500/30 hover:border-green-500/50',
    neon: 'border-green-400 shadow-lg shadow-green-400/20 hover:shadow-green-400/30',
    minimal: 'border-gray-700 hover:border-gray-600'
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('p-4 border-b border-inherit', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-mono text-green-400', className)}>
      {children}
    </h3>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  )
}