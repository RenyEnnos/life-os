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
import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/i18n';
import { SEOProvider, SEOWrapper } from '@/shared/seo';

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <SEOProvider>
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
                                    <SEOWrapper>
                                        <AppRoutes />
                                    </SEOWrapper>
                                </ErrorBoundary>
                            </Router>
                        </ToastProvider>
                    </AuthProvider>
                </PersistQueryClientProvider>
            </SEOProvider>
        </I18nextProvider>
    );
}
