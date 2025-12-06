import React from 'react'
import { cn } from '@/lib/utils'

type Props = { checked: boolean; onChange: (v: boolean) => void } & Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'>

export default function Toggle({ checked, onChange, className, ...props }: Props) {
  const base = 'w-10 h-5 rounded-full border relative transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
  const off = 'bg-muted border-border'
  const on = 'bg-primary/20 border-primary'
  const knob = 'absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all'
  return (
    <button
      {...props}
      className={cn(base, checked ? on : off, className)}
      onClick={() => onChange(!checked)}
    >
      <span className={cn(knob, checked ? 'left-5' : 'left-0.5')}></span>
    </button>
  )
}
