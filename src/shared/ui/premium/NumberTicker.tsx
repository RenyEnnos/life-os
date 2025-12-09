import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export const NumberTicker = ({ value, className, suffix = "" }: { value: number, className?: string, suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} className={className} />;
};
