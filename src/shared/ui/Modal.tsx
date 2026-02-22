import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  ariaDescriptionId?: string
  className?: string
  contentClassName?: string
}

const springTransition = {
  type: "spring" as const,
  damping: 20,
  stiffness: 300,
  mass: 0.8
};

export function Modal({ open, onClose, title, children, className, contentClassName }: ModalProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          {/* Backdrop with progressive blur */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, backdropFilter: "blur(8px)" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={onClose}
            transition={reducedMotion ? { duration: 0 } : springTransition}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={reducedMotion ? { duration: 0 } : springTransition}
            className={cn('relative w-full max-w-md bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden', className)}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-1 text-zinc-400 transition-colors rounded-full hover:text-zinc-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            {title && (
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <h2 className="text-lg font-medium text-zinc-100 font-sans">{title}</h2>
              </div>
            )}
            <div className={cn("p-6 text-zinc-300", contentClassName)}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
