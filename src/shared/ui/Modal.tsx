import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { createPortal } from 'react-dom'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  ariaDescriptionId?: string
}

// Spring Physics para entrada orgânica (Pop-up fluido)
const springTransition = {
  type: "spring" as const,
  damping: 30,
  stiffness: 300,
  mass: 0.8
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Uso de Portal para garantir z-index correto sobre o AppLayout
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop com Blur progressivo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Container do Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springTransition}
            className={cn('relative w-full max-w-md bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden')}
          >
            {title && (
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <h2 className="text-lg font-medium text-zinc-100 font-sans">{title}</h2>
              </div>
            )}
            <div className="p-6 text-zinc-300">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
