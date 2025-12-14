import { useState, useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationSystem } from './NavigationSystem';
import { Particles } from '@/shared/ui/premium/Particles';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';
import { useRealtime } from '@/shared/hooks/useRealtime';
import { SanctuaryOverlay } from '@/shared/ui/sanctuary/SanctuaryOverlay';
import { useSanctuaryStore } from '@/shared/stores/sanctuaryStore';

const MemoizedParticles = memo(Particles);
const MemoizedSanctuaryOverlay = memo(SanctuaryOverlay);

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

// FÍSICA ATMOSFÉRICA & TRANSIÇÕES
// Refined: Removed y-axis translation for pure optical focus effect
const pageVariants = {
    initial: { opacity: 0, scale: 0.99, filter: "blur(2px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.99, filter: "blur(2px)" }
};

const pageTransition = {
    type: "tween" as const,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    duration: 0.3
};

export function AppLayout() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const location = useLocation();
    useRealtime();

    useEffect(() => {
        if (!localStorage.getItem('life-os-onboarding-completed')) {
            setShowOnboarding(true);
        }
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    const { isActive, enter, exit } = useSanctuaryStore();

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyF') {
                e.preventDefault();
                isActive ? exit() : enter('quick-focus', 'Deep Focus');
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isActive, enter, exit]);

    return (
        <div className="relative min-h-[100dvh] w-full bg-background text-foreground font-sans selection:bg-white/10 flex flex-col md:flex-row overflow-x-hidden">
            {/* Global Scrollbar Customization - Invisible until hover */}
            <style>{`
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>

            <ScrollToTop />

            {/* ATMOSPHERE LAYER */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* 1. Global Noise (Cached SVG in CSS) */}
                <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />

                {/* 2. Vignette (Focus guide) */}
                <div className="absolute inset-0 vignette-radial opacity-70" />

                {/* 3. Ambient Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/05 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/05 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <MemoizedParticles className="absolute inset-0 z-0 opacity-40 pointer-events-none" quantity={40} ease={200} staticity={40} refresh />

            <OnboardingModal isOpen={showOnboarding} onClose={() => {
                localStorage.setItem('life-os-onboarding-completed', 'true');
                setShowOnboarding(false);
            }} />

            {/* Unified Navigation System */}
            <NavigationSystem isSanctuaryActive={isActive} />

            {/* Main Content with Mobile Safe Area Handling */}
            <main className="relative z-10 flex-1 w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 pb-32 md:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <MemoizedSanctuaryOverlay />
        </div>
    );
}
