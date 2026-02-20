import { useState, useEffect } from 'react';
import { useAccessibilityStore } from '../stores/accessibilityStore';

export function useReducedMotion(): boolean {
    // Get user's explicit preference from store (persisted in localStorage)
    const userReducedMotion = useAccessibilityStore((state) => state.reducedMotion);

    // Check system preference
    const [systemReducedMotion, setSystemReducedMotion] = useState(() => {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        return false;
    });

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (media.matches !== systemReducedMotion) {
            setSystemReducedMotion(media.matches);
        }
        const listener = () => setSystemReducedMotion(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [systemReducedMotion]);

    // Return user preference if set, otherwise use system preference
    // User override from store takes precedence
    return userReducedMotion !== undefined ? userReducedMotion : systemReducedMotion;
}
