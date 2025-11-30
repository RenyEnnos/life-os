import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useRealtime } from '@/hooks/useRealtime';

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary selection:text-black">
            <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />

            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur sticky top-0 z-40 transition-colors duration-300">
                <h1 className="text-xl font-bold text-primary tracking-widest font-mono glow-text">LIFE OS</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <Menu />
                </Button>
                <ThemeToggle inline />
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-colors transition-all duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <main className="md:pl-64 min-h-screen transition-colors transition-all duration-300">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
