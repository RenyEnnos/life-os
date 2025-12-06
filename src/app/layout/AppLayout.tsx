import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FloatingDock } from '@/shared/ui/FloatingDock';
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
        const t = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (t) {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(t)
        }
    }, [])

    const handleOnboardingClose = () => {
        localStorage.setItem('life-os-onboarding-completed', 'true');
        setShowOnboarding(false);
    };

    return (
        <div className="min-h-screen animated-gradient-bg text-foreground font-sans selection:bg-primary/30">
            <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />

            {/* Global Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <main className="relative z-10 pb-32 px-4 md:px-8 max-w-7xl mx-auto pt-8">
                <Outlet />
            </main>

            <FloatingDock />
        </div>
    );
}
