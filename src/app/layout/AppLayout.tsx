import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Dock, DockIcon } from '@/shared/ui/premium/Dock';
import { Particles } from '@/shared/ui/premium/Particles';
import { LayoutDashboard, CheckSquare, Book, Settings, PlusCircle, DollarSign, GraduationCap, FolderKanban, ListTodo } from 'lucide-react';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';
import { useRealtime } from '@/shared/hooks/useRealtime';

export function AppLayout() {
    const [showOnboarding, setShowOnboarding] = useState(false);
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

    const handleOnboardingClose = () => {
        localStorage.setItem('life-os-onboarding-completed', 'true');
        setShowOnboarding(false);
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
            <Particles
                className="absolute inset-0 z-0"
                quantity={50}
                ease={2400} // Slower movement
                staticity={30}
                refresh
            />

            <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />

            {/* Global Background Elements - reduced intensity */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <main className="relative z-10 pb-32 px-4 md:px-8 max-w-7xl mx-auto pt-8">
                <Outlet />
            </main>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
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
        </div>
    );
}
