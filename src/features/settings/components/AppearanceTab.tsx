import { useState } from 'react';
import { useUser } from '@/features/user/hooks/useUser';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Check, Palette, Moon, Sun, Monitor, Laptop } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const THEMES = [
    { id: 'dark', label: 'Dark Matter', icon: Moon, desc: 'Deep black and zinc tones for maximum focus.' },
    { id: 'light', label: 'White Dwarf', icon: Sun, desc: 'Clean, high-contrast light mode.' },
    { id: 'system', label: 'System Sync', icon: Monitor, desc: 'Matches your OS appearance automatically.' },
];

const ACCENT_COLORS = [
    { id: 'blue', value: '#3b82f6', name: 'Neural Blue' },
    { id: 'indigo', value: '#6366f1', name: 'Deep Indigo' },
    { id: 'emerald', value: '#10b981', name: 'Bio Emerald' },
    { id: 'rose', value: '#f43f5e', name: 'Pulse Rose' },
    { id: 'amber', value: '#f59e0b', name: 'Core Amber' },
];

export default function AppearanceTab() {
    const { userProfile, updatePreferences } = useUser();
    const currentTheme = userProfile?.theme || 'dark';
    const currentAccent = (userProfile?.preferences as any)?.accentColor || 'blue';

    const handleThemeChange = (theme: string) => {
        updatePreferences.mutate({ theme });
    };

    const handleAccentChange = (accent: string) => {
        const prefs = (userProfile?.preferences as any) || {};
        updatePreferences.mutate({
            ...prefs,
            accentColor: accent
        });
    };

    return (
        <section className="flex flex-col gap-10 animate-[fadeIn_0.4s_ease-out_forwards]">
            {/* Theme Selector */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-zinc-500">brightness_4</span>
                    <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">Visual Interface</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {THEMES.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={cn(
                                "relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-300 group text-left",
                                currentTheme === theme.id
                                    ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                    : "bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/60"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                                currentTheme === theme.id ? "bg-primary text-black" : "bg-white/5 text-zinc-400 group-hover:text-white"
                            )}>
                                <theme.icon size={20} />
                            </div>
                            <h4 className="font-bold text-white mb-1">{theme.label}</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">{theme.desc}</p>
                            
                            {currentTheme === theme.id && (
                                <div className="absolute top-4 right-4 text-primary">
                                    <Check size={16} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-zinc-500">palette</span>
                    <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">Primary Sync</h3>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                    <p className="text-sm text-zinc-400 mb-6">Select the core frequency for your Life OS interface.</p>
                    
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        {ACCENT_COLORS.map((accent) => (
                            <button
                                key={accent.id}
                                onClick={() => handleAccentChange(accent.id)}
                                className="flex flex-col items-center gap-3 group"
                            >
                                <div 
                                    className={cn(
                                        "w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center relative",
                                        currentAccent === accent.id ? "border-white scale-110 shadow-lg" : "border-transparent scale-100 hover:scale-105"
                                    )}
                                    style={{ backgroundColor: accent.value }}
                                >
                                    {currentAccent === accent.id && <Check size={20} className="text-white" />}
                                    <div className="absolute inset-0 rounded-full blur-[12px] opacity-0 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: accent.value }} />
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase font-bold tracking-tighter transition-colors",
                                    currentAccent === accent.id ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
                                )}>
                                    {accent.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dashboard Layout Preview */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-zinc-500">dashboard_customize</span>
                    <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">Layout Matrix</h3>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <Monitor size={32} className="text-zinc-600" />
                    </div>
                    <h4 className="text-white font-medium mb-2">Advanced Grid Control</h4>
                    <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                        Customizable widget arrangements and density controls are being optimized for your display frequency.
                    </p>
                    <Button variant="ghost" className="mt-6 text-[10px] uppercase tracking-widest text-primary disabled:opacity-50" disabled>
                        Configuration Locked
                    </Button>
                </div>
            </div>
        </section>
    );
}
