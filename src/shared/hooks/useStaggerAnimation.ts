import { useEffect, useRef, DependencyList } from 'react';
import anime from 'animejs';

export const useStaggerAnimation = (selector: string | Element[] | NodeListOf<Element>, deps: DependencyList = []) => {
    const animationRef = useRef<anime.AnimeInstance | null>(null);

    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timeout = setTimeout(() => {
            // If selector is a string, check if elements exist
            if (typeof selector === 'string') {
                const elements = document.querySelectorAll(selector);
                if (elements.length === 0) return;
            }

            animationRef.current = anime({
                targets: selector,
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                easing: 'easeOutQuad',
                duration: 600
            });
        }, 50);

        return () => {
            clearTimeout(timeout);
            if (animationRef.current) {
                // anime.js doesn't have a direct 'stop' on instance that clears state perfectly in all versions, 
                // but removing targets is good practice if supported, or just letting it finish.
                // For this hook, simple cleanup of timeout is most critical.
                animationRef.current = null;
            }
        };
    }, [selector, ...deps]);
};
