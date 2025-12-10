import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Moon } from 'lucide-react';
import { useSanctuaryStore, SoundType } from '../../stores/sanctuaryStore';
import { startNoise, stopNoise, setNoiseVolume } from '../../lib/audio';
import './sanctuary.css';

/**
 * Sanctuary Mode Overlay
 * 
 * A distraction-free focus mode that removes UI chrome
 * and optionally plays ambient noise.
 */
export function SanctuaryOverlay() {
    const {
        isActive,
        activeTaskTitle,
        soundEnabled,
        soundType,
        volume,
        exit,
        toggleSound,
        setSoundType,
        setVolume
    } = useSanctuaryStore();

    // Handle audio playback
    useEffect(() => {
        if (isActive && soundEnabled && soundType !== 'none') {
            startNoise(soundType as 'white' | 'pink' | 'brown', volume);
        } else {
            stopNoise();
        }

        return () => {
            stopNoise();
        };
    }, [isActive, soundEnabled, soundType, volume]);

    // Update volume when it changes
    useEffect(() => {
        if (isActive && soundEnabled) {
            setNoiseVolume(volume);
        }
    }, [volume, isActive, soundEnabled]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                exit();
            } else if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey) {
                toggleSound();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, exit, toggleSound]);

    const handleSoundTypeChange = useCallback((type: SoundType) => {
        setSoundType(type);
    }, [setSoundType]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    role="dialog"
                    aria-label="Sanctuary Mode"
                >
                    {/* Vignette */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 0%, #050505 90%)'
                        }}
                    />

                    {/* Exit Button - Subtle top right */}
                    <button
                        onClick={exit}
                        className="absolute top-8 right-8 text-white/20 hover:text-white/80 transition-colors p-2 z-20"
                        aria-label="Exit Sanctuary"
                    >
                        <X size={24} strokeWidth={1.5} />
                    </button>

                    {/* Main Content */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center max-w-4xl px-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        {/* Icon/Symbol */}
                        <div className="mb-8 text-white/10">
                            <Moon size={48} strokeWidth={1} />
                        </div>

                        {/* Active Task Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-white/90 leading-tight">
                            {activeTaskTitle || 'Deep Focus'}
                        </h1>

                        {/* Hint */}
                        <p className="mt-6 text-sm text-white/30 font-light tracking-widest uppercase">
                            Ritual in progress
                        </p>
                    </motion.div>

                    {/* Controls Bar - Bottom Center */}
                    <motion.div
                        className="absolute bottom-12 z-20 flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 opacity-50 hover:opacity-100 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.5, y: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {/* Sound Toggle */}
                        <button
                            onClick={toggleSound}
                            className="text-white/60 hover:text-white transition-colors"
                            title="Toggle Sound (S)"
                        >
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>

                        {/* Separator */}
                        <div className="w-px h-4 bg-white/10" />

                        {/* Sound Types */}
                        <div className="flex items-center gap-2">
                            {(['brown', 'pink', 'white'] as SoundType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleSoundTypeChange(type)}
                                    className={`
                                        px-3 py-1 rounded-full text-xs font-medium transition-all
                                        ${soundType === type && soundEnabled
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/40 hover:text-white/70'
                                        }
                                    `}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Separator */}
                        <div className="w-px h-4 bg-white/10" />

                        {/* Exit Action */}
                        <button
                            onClick={exit}
                            className="text-xs text-white/40 hover:text-red-300 transition-colors uppercase tracking-wider"
                        >
                            Esc
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default SanctuaryOverlay;
