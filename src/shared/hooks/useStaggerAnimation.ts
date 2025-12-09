import { useEffect, DependencyList } from 'react';
import { animate, stagger } from 'framer-motion';

export const useStaggerAnimation = (selector: string | Element[] | NodeListOf<Element>, deps: DependencyList = []) => {
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timeout = setTimeout(() => {
            // If selector is a string, check if elements exist
            if (typeof selector === 'string') {
                const elements = document.querySelectorAll(selector);
                if (elements.length === 0) return;
            }

            animate(
                selector,
                { opacity: [0, 1], y: [20, 0] },
                {
                    delay: stagger(0.1),
                    duration: 0.6,
                    ease: "easeOut"
                }
            );
        }, 50);

        return () => {
            clearTimeout(timeout);
        };
    }, [selector, ...deps]);
};
