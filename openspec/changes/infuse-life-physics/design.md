# Design: Life & Physics Infusion

## 1. Atmosphere System
The "Deep Glass" aesthetic relies on subtle imperfections (noise) and lighting control (vignette) to create depth.

### Global Texture strategy
- **Noise**: Use `mix-blend-mode: overlay` opacity `0.03-0.05`.
- **Implementation**: Applied at `AppLayout` level to avoid stacking noise on every card which creates "muddy" visuals.
- **Scrollbars**: Custom webkit styling for "invisible until hover" feel.

### Reference Implementation: `src/app/layout/AppLayout.tsx`
```tsx
// [Refactor Focus] Adding Background Noise and Scrollbar handling
import { useEffect } from 'react';
// ... existing imports ...

export function AppLayout() {
  // ... existing hook logic ...

    return (
        <div className="relative min-h-[100dvh] w-full bg-background text-foreground font-sans selection:bg-white/10 flex flex-col md:flex-row overflow-x-hidden">
             {/* Global Scrollbar Styles Injection */}
            <style>{`
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
            `}</style>
            
            <ScrollToTop />
            
            {/* ATMOSPHERE LAYER */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* 1. Global Noise (Cached SVG in CSS) */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
                
                {/* 2. Vignette (Focus guide) */}
                <div className="absolute inset-0 vignette-radial opacity-60" />
                
                {/* 3. Ambient Orbs (Existing) */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/05 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/05 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <MemoizedParticles className="absolute inset-0 z-0 opacity-40 pointer-events-none" quantity={40} />

            {/* ... Navigation and Main Content ... */}
             <main className="relative z-10 flex-1 w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 pb-32 md:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                {/* ... existing AnimatePresence ... */}
            </main>
            
            {/* ... SanctuaryOverlay ... */}
        </div>
    );
}
```

## 2. Interaction Physics
We move from "Instant" -> "Fluid".

### Bento Card Physics
- **Hover**: Scale `1.01` (subtle breath) instead of Y translation.
- **Border**: Standardize to `border-white/5` (matches tokens).
- **Surface**: `bg-white/[0.02]` on hover.

### Reference Implementation: `src/shared/ui/BentoCard.tsx`
```tsx
// ... existing imports
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export const BentoCard = ({ /*...*/ }: BentoCardProps) => {
    // ... existing mouseX/Y logic ...

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onClick={onClick}
            // PHYSICS UPDATE
            whileHover={{ scale: 1.01, transition: { duration: 0.3, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                // REMOVED: margins if gaps handled by grid
                "group relative overflow-hidden rounded-xl glass-panel text-zinc-100 transition-colors duration-300",
                "border border-white/5", // Hardcoded consistency
                onClick && "cursor-pointer hover:bg-white/[0.02]", // Tactile surface change
                className
            )}
        >
           {/* ... existing Spotlight layers ... */}
        </motion.div>
    );
};
```

## 3. Modal Physics
Refactor `Modal.tsx` to use Framer Motion with Spring physics.

### Reference Implementation: `src/shared/ui/Modal.tsx`
```tsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/cn';
import { createPortal } from 'react-dom';

// Spring Physics
const modalTransition = { type: 'spring', damping: 30, stiffness: 300 };

export function Modal({ open, onClose, title, children }: ModalProps) {
  // ... existing escape key logic ...

  // Use Portal for safer z-index management
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={onClose}
               className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={modalTransition}
                role="dialog"
                className={cn('relative w-full max-w-md bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden')}
            >
                {title && (
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <h2 className="text-lg font-medium text-zinc-100">{title}</h2>
                    </div>
                )}
                <div className="p-6 text-zinc-300">{children}</div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
```
