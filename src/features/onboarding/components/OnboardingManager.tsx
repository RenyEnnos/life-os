import { useEffect, useState } from 'react';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';
import { useOnboardingStore } from '@/shared/stores/onboardingStore';
import { useAuth } from '@/features/auth/contexts/AuthContext';

export function OnboardingManager() {
    const { user, loading, hasCompletedOnboarding: remoteCompleted } = useAuth();
    const { hasCompletedOnboarding: localCompleted } = useOnboardingStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const skipOnboarding = localStorage.getItem('skip_onboarding') === 'true' || 
                              import.meta.env.VITE_SKIP_ONBOARDING === 'true';
        
        if (skipOnboarding) {
            setIsOpen(false);
            return;
        }

        // Render only if user is logged in, not loading, and hasn't completed onboarding either locally or remotely
        if (!loading && user && !remoteCompleted && !localCompleted) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user, loading, remoteCompleted, localCompleted]);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return <OnboardingModal isOpen={isOpen} onClose={handleClose} />;
}
