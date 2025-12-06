import { useEffect, useState } from 'react';
import { OnboardingModal } from '@/features/onboarding/OnboardingModal';
import { useOnboardingStore } from '@/shared/stores/onboardingStore';
import { useAuth } from '@/features/auth/contexts/AuthContext';

export function OnboardingManager() {
    const { user, loading } = useAuth();
    const { hasCompletedOnboarding, completeOnboarding } = useOnboardingStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Render only if user is logged in, not loading, and hasn't completed onboarding
        if (!loading && user && !hasCompletedOnboarding) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user, loading, hasCompletedOnboarding]);

    const handleClose = () => {
        completeOnboarding();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return <OnboardingModal isOpen={isOpen} onClose={handleClose} />;
}
