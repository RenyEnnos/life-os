import { useEffect, type ReactNode } from 'react';
import { useAccessibilityStore } from '../stores/accessibilityStore';

// Map font size from store values to CSS data attribute values
const FONT_SIZE_MAP: Record<string, string> = {
    'small': 'sm',
    'medium': 'md',
    'large': 'lg',
    'extra-large': 'xl',
};

interface AccessibilityProviderProps {
    children: ReactNode;
}

/**
 * AccessibilityProvider component that initializes accessibility preferences
 * and applies data attributes to document.documentElement on mount and updates.
 *
 * This provider ensures that:
 * - data-reduced-motion attribute reflects the user's reduced motion preference
 * - data-high-contrast attribute reflects the user's high contrast preference
 * - data-font-scale attribute reflects the user's font size preference
 *
 * These data attributes are used by CSS to apply appropriate styling.
 */
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
    const reducedMotion = useAccessibilityStore((state) => state.reducedMotion);
    const highContrast = useAccessibilityStore((state) => state.highContrast);
    const fontSize = useAccessibilityStore((state) => state.fontSize);

    useEffect(() => {
        // Apply reduced motion data attribute
        if (reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduced-motion');
        }
    }, [reducedMotion]);

    useEffect(() => {
        // Apply high contrast data attribute
        if (highContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        } else {
            document.documentElement.removeAttribute('data-high-contrast');
        }
    }, [highContrast]);

    useEffect(() => {
        // Apply font scale data attribute
        const fontScaleValue = FONT_SIZE_MAP[fontSize] || 'md';
        document.documentElement.setAttribute('data-font-scale', fontScaleValue);
    }, [fontSize]);

    return <>{children}</>;
}
