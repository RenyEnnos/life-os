import React from 'react'
import { cn } from '@/lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={cn(
        'bg-surface border border-border px-3 py-2 text-foreground placeholder-mutedForeground rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200',
        className
      )}
    />
  )
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        'bg-surface border border-border px-3 py-2 text-foreground placeholder-mutedForeground rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200',
        className
      )}
    />
  )
}
