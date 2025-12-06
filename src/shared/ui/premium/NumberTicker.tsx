import { useEffect, useRef } from 'react';
// @ts-ignore
import anime from 'animejs';

export const NumberTicker = ({ value, className, suffix = "" }: { value: number, className?: string, suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const obj = { val: 0 };

        anime({
            targets: obj,
            val: value,
            easing: "easeOutExpo",
            round: 1,
            duration: 2000,
            update: function () {
                if (ref.current) {
                    ref.current.innerHTML = obj.val + suffix;
                }
            }
        });
    }, [value, suffix]);

    return <span ref={ref} className={className}>0{suffix}</span>;
};
