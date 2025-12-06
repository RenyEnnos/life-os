import React from 'react'
import { cn } from '@/lib/utils'

type Props = { children: React.ReactNode; tone?: 'success' | 'warning' | 'danger' } & React.HTMLAttributes<HTMLSpanElement>

export default function Badge({ children, tone = 'success', className, ...props }: Props) {
  const variants: Record<string, string> = {
    success: 'bg-success/10 text-success border border-success/30',
    warning: 'bg-warning/10 text-warning border border-warning/30',
    danger: 'bg-destructive/10 text-destructive border border-destructive/30'
  }

  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-sans font-semibold',
        variants[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
