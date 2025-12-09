import { useState, useEffect } from 'react';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function ThemeToggler() {
    const { isDark, toggleTheme } = useTheme();
    const { updateThemePreference } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = () => {
        const next = isDark ? 'light' : 'dark';
        toggleTheme();
        updateThemePreference(next);
    };

    if (!mounted) return null;

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "relative inline-flex h-10 w-16 items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isDark ? "bg-slate-950 border border-slate-800" : "bg-amber-100 border border-amber-200"
            )}
            aria-label="Toggle Theme"
        >
            <span className="sr-only">Toggle Theme</span>
            <div
                className={cn(
                    "absolute flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 md:h-8 md:w-8",
                    isDark ? "translate-x-7 bg-slate-800 text-slate-200" : "translate-x-1 bg-white text-amber-500 shadow-sm"
                )}
            >
                {isDark ? (
                    <Moon className="h-5 w-5" />
                ) : (
                    <Sun className="h-5 w-5" />
                )}
            </div>
        </button>
    );
}
