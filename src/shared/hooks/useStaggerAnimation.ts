import { useEffect } from 'react';
// @ts-ignore
import anime from 'animejs';

export const useStaggerAnimation = (selector: string, deps: any[] = []) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) return;

            anime({
                targets: selector,
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                easing: 'easeOutQuad',
                duration: 600
            });
        }, 50);

        return () => clearTimeout(timeout);
    }, [selector, ...deps]);
};
