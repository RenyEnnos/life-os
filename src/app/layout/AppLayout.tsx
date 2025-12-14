import { useState, useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { NavigationSystem } from './NavigationSystem';
import { Particles } from '@/shared/ui/premium/Particles';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';
import { useRealtime } from '@/shared/hooks/useRealtime';
import { SanctuaryOverlay } from '@/shared/ui/sanctuary/SanctuaryOverlay';
import { useSanctuaryStore } from '@/shared/stores/sanctuaryStore';
import { cn } from '@/shared/lib/cn';

const MemoizedParticles = memo(Particles);
const MemoizedSanctuaryOverlay = memo(SanctuaryOverlay);

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

// FÍSICA ATMOSFÉRICA & TRANSIÇÕES
const pageVariants = {
    initial: { opacity: 0, scale: 0.99, filter: "blur(4px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.01, filter: "blur(4px)" }
};

const pageTransition: Transition = {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.4
};

export function AppLayout() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const location = useLocation();
    const isCustomShell =
        location.pathname === '/'
        || location.pathname.startsWith('/tasks')
        || location.pathname.startsWith('/calendar')
        || location.pathname.startsWith('/journal')
        || location.pathname.startsWith('/habits')
        || location.pathname.startsWith('/finances');
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
        <div className="relative min-h-[100dvh] w-full bg-background-dark text-zinc-200 font-display selection:bg-primary/30 flex flex-row overflow-hidden">
            <ScrollToTop />

            {/* ATMOSPHERE LAYER - Fixed Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* 1. Global Noise */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />

                {/* 2. Deep Glows */}
                <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[0%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />
            </div>

            <MemoizedParticles className="absolute inset-0 z-0 opacity-20 pointer-events-none" quantity={30} ease={100} staticity={50} refresh />

            <OnboardingModal isOpen={showOnboarding} onClose={() => {
                localStorage.setItem('life-os-onboarding-completed', 'true');
                setShowOnboarding(false);
            }} />

            {/* Sidebar Navigation */}
            {!isCustomShell && (
                <aside className="hidden lg:flex flex-col w-24 h-screen shrink-0 border-r border-white/5 bg-zinc-900/20 backdrop-blur-xl z-20">
                    <NavigationSystem isSanctuaryActive={isActive} />
                </aside>
            )}

            {/* Mobile Navigation (Floating or Bottom) - handled by NavigationSystem mostly, but ensuring structure */}
            {!isCustomShell && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4">
                    <NavigationSystem isSanctuaryActive={isActive} />
                </div>
            )}

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 h-screen overflow-x-hidden relative z-10 w-full",
                isCustomShell ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"
            )}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className={cn(
                            "w-full min-h-full p-4 lg:p-10 pb-32 lg:pb-10",
                            isCustomShell && "p-0 lg:p-0"
                        )}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <MemoizedSanctuaryOverlay />
        </div>
    );
}
