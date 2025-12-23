import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/features/auth/contexts/AuthProvider";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persister } from "@/shared/lib/react-query";
import { AppRoutes } from "@/config/routes/index";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ToastProvider } from "@/shared/ui/GlassToast";
import { OfflineSyncManager } from "@/shared/components/OfflineSyncManager";

import { PWAManager } from "@/shared/components/PWAManager";
import { Toaster } from 'react-hot-toast';

import { OnboardingManager } from "@/features/onboarding/components/OnboardingManager";
import { Synapse } from "@/shared/ui/synapse";
import { SanctuaryOverlay } from "@/shared/ui/sanctuary";

export default function App() {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            <AuthProvider>
                <ToastProvider>
                    <OfflineSyncManager />
                    <PWAManager />
                    <Toaster position="bottom-right" toastOptions={{ className: 'glass-panel text-white border-blue-500/30' }} />
                    <OnboardingManager />
                    <SanctuaryOverlay />
                    <Router>
                        <Synapse />
                        <ErrorBoundary>
                            <AppRoutes />
                        </ErrorBoundary>
                    </Router>
                </ToastProvider>
            </AuthProvider>
        </PersistQueryClientProvider>
    );
}
