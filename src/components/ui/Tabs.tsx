import React, { useState } from 'react'
import { cn } from '@/lib/utils'

type Tab = { id: string; label: string }
type Props = { tabs: Tab[]; onChange?: (id: string) => void }

export default function Tabs({ tabs, onChange }: Props) {
  const [active, setActive] = useState(tabs[0]?.id)
  const click = (id: string) => { setActive(id); onChange && onChange(id) }
  return (
    <div className="flex gap-2">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => click(t.id)}
          className={cn(
            "font-mono px-3 py-2 border",
            active === t.id ? 'border-green-600 text-green-400' : 'border-gray-700 text-gray-400'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
