import React from 'react'
import { cn } from '@/lib/utils'

type Props = { checked: boolean; onChange: (v: boolean) => void } & Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'>

export default function Toggle({ checked, onChange, className, ...props }: Props) {
  const base = 'w-10 h-5 border border-green-700 relative'
  const knob = 'absolute top-0.5 w-4 h-4 bg-green-500 transition-all'
  return (
    <button
      {...props}
      className={cn(base, className)}
      onClick={() => onChange(!checked)}
    >
      <span className={cn(knob, checked ? 'left-5' : 'left-0.5')}></span>
    </button>
  )
}
