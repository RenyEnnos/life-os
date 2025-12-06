import React, { useState } from 'react'
import { cn } from '@/shared/lib/cn'

type TooltipProps = { content: string; children: React.ReactNode }

export default function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn('absolute z-50 -top-8 left-1/2 -translate-x-1/2 rounded-md bg-surface border border-border px-2 py-1 text-xs text-mutedForeground shadow-sm')}
        >
          {content}
        </span>
      )}
    </span>
  )
}
