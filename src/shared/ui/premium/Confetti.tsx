
import confetti from "canvas-confetti";

interface ConfettiOptions extends confetti.Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x: number; y: number };
    colors?: string[];
    shapes?: confetti.Shape[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
}

export const Confetti = (options: ConfettiOptions = {}) => {
    confetti({
        ...options,
        zIndex: options.zIndex || 9999,
    });
};
