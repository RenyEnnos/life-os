import { useEffect } from 'react';
import { useFocusStore } from '../stores/useFocusStore';

export function FocusTimerLogic() {
    const { timerState, tick } = useFocusStore();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerState === 'running') {
            interval = setInterval(() => {
                tick();
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timerState, tick]);

    return null; // Headless component
}
