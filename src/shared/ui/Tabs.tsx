import React, { useState } from 'react'
import { cn } from '@/shared/lib/cn'

type Tab = { id: string; label: string; icon?: React.ReactNode }
type Props = { tabs: Tab[]; onChange?: (id: string) => void; variant?: 'pill' | 'underline' | 'segmented'; fullWidth?: boolean }

export default function Tabs({ tabs, onChange, variant = 'pill', fullWidth = false }: Props) {
  const [active, setActive] = useState(tabs[0]?.id)
  const click = (id: string) => { setActive(id); if (onChange) onChange(id) }
  return (
    <div className={cn('flex gap-2', fullWidth && 'w-full')}
    >
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => click(t.id)}
          className={cn(
            variant === 'pill' && 'font-sans text-sm px-3 py-2 rounded-md border transition-colors duration-200',
            variant === 'underline' && 'font-sans text-sm px-3 py-2 border-b-2 transition-colors duration-200',
            variant === 'segmented' && 'font-sans text-sm px-3 py-2 rounded-md border transition-colors duration-200 flex-1',
            active === t.id
              ? (variant === 'underline' ? 'border-primary text-foreground' : 'bg-muted text-foreground border-border')
              : (variant === 'underline' ? 'border-transparent text-mutedForeground hover:text-foreground' : 'text-mutedForeground border-transparent hover:bg-muted hover:text-foreground')
          )}
        >
          <span className="inline-flex items-center gap-2">
            {t.icon}
            {t.label}
          </span>
        </button>
      ))}
    </div>
  )
}
