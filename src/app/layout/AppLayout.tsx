import { useState, useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dock, DockIcon } from '@/shared/ui/premium/Dock';
import { Particles } from '@/shared/ui/premium/Particles';
import { LayoutDashboard, CheckSquare, Book, Settings, PlusCircle, DollarSign, GraduationCap, FolderKanban, ListTodo } from 'lucide-react';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';
import { useRealtime } from '@/shared/hooks/useRealtime';
import { SanctuaryOverlay } from '@/shared/ui/sanctuary/SanctuaryOverlay';
import { useSanctuaryStore } from '@/shared/stores/sanctuaryStore';

import { Sidebar } from './Sidebar';

// Memoize heavy components to prevent re-renders
const MemoizedParticles = memo(Particles);
const MemoizedSanctuaryOverlay = memo(SanctuaryOverlay);

export function AppLayout() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const location = useLocation();
    useRealtime();

    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem('life-os-onboarding-completed');
        if (!hasCompletedOnboarding) {
            setShowOnboarding(true);
        }
    }, []);

    useEffect(() => {
        // Enforce dark mode for Vortex UI
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    }, []);

    const { isActive, enter, exit } = useSanctuaryStore();

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Cmd+Shift+F (Mac) or Ctrl+Shift+F (Win)
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyF') {
                e.preventDefault();
                if (isActive) {
                    exit();
                } else {
                    enter('quick-focus', 'Deep Focus');
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isActive, enter, exit]);

    const handleOnboardingClose = () => {
        localStorage.setItem('life-os-onboarding-completed', 'true');
        setShowOnboarding(false);
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
            <MemoizedParticles
                className="absolute inset-0 z-0 opacity-50"
                quantity={50}
                ease={2400}
                staticity={30}
                refresh
            />

            {/* Camada 1: Iluminação Atmosférica (Fixa) */}
            <div className="absolute inset-0 vignette-radial z-0" />

            {/* Navigation: Glass Blade Sidebar (Desktop) */}
            <Sidebar />

            <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />

            {/* Global Background Elements - reduced intensity */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <main className="relative z-10 pb-32 px-4 md:px-8 max-w-7xl mx-auto pt-8 md:pl-32 transition-all duration-300">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Mobile Navigation (Dock) - Hidden on desktop now that we have Sidebar */}
            <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <Dock className="bg-black/40 border-white/5 shadow-2xl backdrop-blur-xl px-4 py-3 gap-3">
                    <DockIcon href="/" onClick={() => { }}>
                        <LayoutDashboard className="size-6 text-zinc-300" />
                    </DockIcon>
                    <DockIcon href="/tasks" onClick={() => { }}>
                        <ListTodo className="size-6 text-zinc-300" />
                    </DockIcon>
                    <DockIcon href="/habits" onClick={() => { }}>
                        <CheckSquare className="size-6 text-zinc-300" />
                    </DockIcon>
                    <DockIcon href="/finances" onClick={() => { }}>
                        <DollarSign className="size-6 text-zinc-300" />
                    </DockIcon>
                    <DockIcon onClick={() => { /* Open Quick Action */ }} className="bg-primary/20 border-primary/50">
                        <PlusCircle className="size-8 text-primary" />
                    </DockIcon>
                    <DockIcon href="/university" onClick={() => { }}>
                        <GraduationCap className="size-6 text-zinc-300" />
                    </DockIcon>
                    <DockIcon href="/projects" onClick={() => { }}>
                        <FolderKanban className="size-6 text-zinc-300" />
                    </DockIcon>
                    <DockIcon href="/journal" onClick={() => { }}>
                        <Book className="size-6 text-zinc-300" />
                    </DockIcon>
                    <DockIcon href="/settings" onClick={() => { }}>
                        <Settings className="size-6 text-zinc-300" />
                    </DockIcon>
                </Dock>
            </div>

            <MemoizedSanctuaryOverlay />
        </div>
    );
}
