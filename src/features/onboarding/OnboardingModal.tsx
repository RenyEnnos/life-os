import { OnboardingFlow } from './components/OnboardingFlow';
import { Card } from '@/shared/ui/Card';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <Card className="w-full max-w-2xl p-0 overflow-hidden border-primary/50 shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)] bg-background">
                <div className="p-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
                <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <OnboardingFlow onClose={onClose} />
                </div>
            </Card>
        </div>
    );
}
