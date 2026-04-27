import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { NavigationSystem } from './NavigationSystem';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';

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

    useEffect(() => {
        if (!localStorage.getItem('life-os-onboarding-completed')) {
            setShowOnboarding(true);
        }
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <div className="relative min-h-[100dvh] w-full bg-background-dark text-zinc-200 font-display selection:bg-primary/30 flex flex-row overflow-x-hidden">
            <ScrollToTop />

            {/* ATMOSPHERE LAYER - Fixed Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* 1. Global Noise */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
            </div>



            <OnboardingModal isOpen={showOnboarding} onClose={() => {
                localStorage.setItem('life-os-onboarding-completed', 'true');
                setShowOnboarding(false);
            }} />

            {/* Sidebar Navigation - Always Visible on Desktop */}
            <aside className="hidden lg:flex flex-col w-24 h-screen shrink-0 z-50">
                <NavigationSystem />
            </aside>

            {/* Mobile Navigation - Always Visible on Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
                <div className="pointer-events-auto">
                    <NavigationSystem />
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen overflow-y-auto relative z-10 w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full min-h-screen"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

        </div>
    );
}
