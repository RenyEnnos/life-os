import React, { useEffect } from 'react'
import { cn } from '@/shared/lib/cn'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  ariaDescriptionId?: string
}

export function Modal({ open, onClose, title, children, ariaDescriptionId }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const titleId = title ? 'modal-title' : undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescriptionId}
        className={cn('bg-surface border border-border rounded-lg w-full max-w-md elevate-md transition-transform duration-200')}
      >
        {title && (
          <div className="p-4 border-b border-border">
            <h2 id={titleId} className="text-lg font-semibold text-foreground font-sans">{title}</h2>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
