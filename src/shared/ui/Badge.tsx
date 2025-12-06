import React from 'react'
import { cn } from '@/shared/lib/cn'

export type BadgeProps = { children: React.ReactNode; tone?: 'success' | 'warning' | 'danger' | 'outline' } & React.HTMLAttributes<HTMLSpanElement>

export function Badge({ children, tone = 'success', className, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    success: 'bg-success/10 text-success border border-success/30',
    warning: 'bg-warning/10 text-warning border border-warning/30',
    danger: 'bg-destructive/10 text-destructive border border-destructive/30',
    outline: 'bg-transparent text-zinc-400 border border-zinc-700'
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
