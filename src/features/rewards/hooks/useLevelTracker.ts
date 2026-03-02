import { useState, useEffect, useRef } from 'react';
import { useRewards } from './useRewards';

export function useLevelTracker() {
    const { lifeScore } = useRewards();
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState<number | null>(null);
    const prevLevelRef = useRef<number | null>(null);

    useEffect(() => {
        if (lifeScore?.level !== undefined) {
            if (prevLevelRef.current !== null && lifeScore.level > prevLevelRef.current) {
                setNewLevel(lifeScore.level);
                setShowLevelUp(true);
            }
            prevLevelRef.current = lifeScore.level;
        }
    }, [lifeScore?.level]);

    const dismissLevelUp = () => {
        setShowLevelUp(false);
        setNewLevel(null);
    };

    return {
        showLevelUp,
        newLevel,
        dismissLevelUp
    };
}
