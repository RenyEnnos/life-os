import React, { useMemo, useState } from 'react'
import { cn } from '@/shared/lib/cn'

type Tab = { id: string; label: string; icon?: React.ReactNode }
type Props = {
  tabs: Tab[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: 'pill' | 'underline' | 'segmented';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Tabs aligned with project colors and rounded architecture.
 * Supports controlled (value) and uncontrolled (defaultValue) usage.
 */
export default function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = 'pill',
  fullWidth = false,
  className
}: Props) {
  const firstId = tabs[0]?.id
  const [internal, setInternal] = useState(defaultValue ?? firstId)
  const active = value ?? internal

  const { activeClass, inactiveClass, wrapperClass } = useMemo(() => {
    switch (variant) {
      case 'underline':
        return {
          wrapperClass: 'border-b border-white/10',
          activeClass: 'text-primary border-primary',
          inactiveClass: 'text-muted-foreground border-transparent hover:text-foreground hover:border-white/20'
        }
      case 'segmented':
        return {
          wrapperClass: 'bg-black/30 border border-white/5 rounded-2xl p-1 shadow-inner shadow-black/30',
          activeClass: 'bg-primary/15 text-primary border border-primary/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
          inactiveClass: 'text-muted-foreground border border-transparent hover:border-white/10 hover:bg-white/5'
        }
      case 'pill':
      default:
        return {
          wrapperClass: '',
          activeClass: 'bg-primary/10 text-primary border border-primary/40 shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
          inactiveClass: 'text-muted-foreground border border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground'
        }
    }
  }, [variant])

  const handleClick = (id: string) => {
    setInternal(id)
    onChange?.(id)
  }

  if (!tabs.length) return null

  return (
    <div
      className={cn(
        'flex gap-2 items-center',
        variant === 'segmented' && 'bg-transparent',
        variant !== 'underline' && 'flex-wrap',
        fullWidth && 'w-full',
        wrapperClass,
        className
      )}
      role="tablist"
      aria-label="Tabs"
    >
      {tabs.map(t => {
        const isActive = active === t.id
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleClick(t.id)}
            className={cn(
              'relative font-sans text-sm px-4 py-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              variant === 'underline'
                ? 'border-b-2'
                : 'rounded-xl',
              variant === 'segmented' && 'flex-1 rounded-2xl',
              isActive ? activeClass : inactiveClass,
            )}
          >
            <span className="inline-flex items-center gap-2">
              {t.icon}
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
