import { useState, useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dock, DockIcon } from '@/shared/ui/premium/Dock';
import { Particles } from '@/shared/ui/premium/Particles';
import {
    LayoutDashboard, CheckSquare, Book, Settings,
    PlusCircle, DollarSign, GraduationCap, FolderKanban, ListTodo
} from 'lucide-react';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';
import { useRealtime } from '@/shared/hooks/useRealtime';
import { SanctuaryOverlay } from '@/shared/ui/sanctuary/SanctuaryOverlay';
import { useSanctuaryStore } from '@/shared/stores/sanctuaryStore';
import { Sidebar } from './Sidebar';

const MemoizedParticles = memo(Particles);
const MemoizedSanctuaryOverlay = memo(SanctuaryOverlay);

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

// FÍSICA CINEMATOGRÁFICA "DEEP FLOW"
// Refined: Removed y-axis translation for pure optical focus effect
const pageVariants = {
    initial: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.98, filter: "blur(4px)" }
};

const pageTransition = {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.4
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
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-white/10">
            <ScrollToTop />
            <MemoizedParticles className="absolute inset-0 z-0 opacity-40 pointer-events-none" quantity={40} ease={200} staticity={40} refresh />
            <div className="absolute inset-0 vignette-radial z-0" />

            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <OnboardingModal isOpen={showOnboarding} onClose={() => {
                localStorage.setItem('life-os-onboarding-completed', 'true');
                setShowOnboarding(false);
            }} />

            <Sidebar />

            <main className="relative z-10 pl-24 pr-4 md:pr-8 pt-8 pb-32 min-h-screen w-full max-w-[1920px] mx-auto">
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

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 md:hidden">
                <Dock className="bg-black/40 border-white/5 shadow-2xl backdrop-blur-xl px-4 py-3 gap-3">
                    <DockIcon href="/" onClick={() => { }}><LayoutDashboard className="size-6 text-zinc-300" /></DockIcon>
                    <DockIcon href="/tasks" onClick={() => { }}><ListTodo className="size-6 text-zinc-300" /></DockIcon>
                    <DockIcon href="/habits" onClick={() => { }}><CheckSquare className="size-6 text-zinc-300" /></DockIcon>
                    <DockIcon href="/finances" onClick={() => { }}><DollarSign className="size-6 text-zinc-300" /></DockIcon>
                    <DockIcon onClick={() => { }} className="bg-white/10 border-white/20"><PlusCircle className="size-8 text-zinc-100" /></DockIcon>
                    <DockIcon href="/university" onClick={() => { }}><GraduationCap className="size-6 text-zinc-300" /></DockIcon>
                    <DockIcon href="/projects" onClick={() => { }}><FolderKanban className="size-6 text-zinc-300" /></DockIcon>
                    <DockIcon href="/journal" onClick={() => { }}><Book className="size-6 text-zinc-300" /></DockIcon>
                    <DockIcon href="/settings" onClick={() => { }}><Settings className="size-6 text-zinc-300" /></DockIcon>
                </Dock>
            </div>
            <MemoizedSanctuaryOverlay />
        </div>
    );
}
