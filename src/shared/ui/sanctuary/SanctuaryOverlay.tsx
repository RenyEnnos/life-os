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

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isActive, exit, toggleSound]);

    const handleSoundTypeChange = useCallback((type: SoundType) => {
        setSoundType(type);
    }, [setSoundType]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="sanctuary-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Vignette gradient */}
                    <div className="sanctuary-vignette" />

                    {/* Exit button */}
                    <motion.button
                        className="sanctuary-exit"
                        onClick={exit}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.2 }}
                        aria-label="Exit Sanctuary Mode"
                    >
                        <X size={20} />
                    </motion.button>

                    {/* Centered task */}
                    <motion.div
                        className="sanctuary-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: 0.1, type: 'spring', damping: 25 }}
                    >
                        <motion.div
                            className="sanctuary-icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Moon size={32} />
                        </motion.div>

                        <h1 className="sanctuary-title">
                            {activeTaskTitle || 'Focus Mode'}
                        </h1>

                        <p className="sanctuary-hint">
                            Press <kbd>Esc</kbd> to exit • <kbd>S</kbd> to toggle sound
                        </p>
                    </motion.div>

                    {/* Sound controls */}
                    <motion.div
                        className="sanctuary-controls"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            className={`sanctuary-sound-toggle ${soundEnabled ? 'enabled' : ''}`}
                            onClick={toggleSound}
                            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
                        >
                            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>

                        {soundEnabled && (
                            <div className="sanctuary-sound-types">
                                {(['brown', 'pink', 'white'] as SoundType[]).map((type) => (
                                    <button
                                        key={type}
                                        className={`sanctuary-sound-type ${soundType === type ? 'active' : ''}`}
                                        onClick={() => handleSoundTypeChange(type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default SanctuaryOverlay;
