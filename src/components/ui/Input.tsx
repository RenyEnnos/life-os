import React from 'react'
import { cn } from '@/lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={cn(
        'bg-transparent border border-green-700 p-2 text-green-300 placeholder-green-700 focus:outline-none',
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
        'bg-transparent border border-green-700 p-2 text-green-300 placeholder-green-700 focus:outline-none',
        className
      )}
    />
  )
}
