import { BrowserRouter, HashRouter } from 'react-router-dom'
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persister } from "@/shared/lib/react-query";
import { AppRoutes } from "@/config/routes/index";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ToastProvider } from "@/shared/ui/GlassToast";
import { AnalyticsProvider } from '@/shared/analytics';
import { AnalyticsTracker } from '@/shared/analytics/AnalyticsTracker';
import { initializeErrorTracking } from '@/shared/errors';

import { PWAManager } from "@/shared/components/PWAManager";
import { Toaster } from 'sonner';

import { OnboardingManager } from "@/features/onboarding/components/OnboardingManager";
import { SanctuaryOverlay } from "@/shared/ui/sanctuary";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/i18n';
import { SEOProvider, SEOWrapper } from '@/shared/seo';
import { AccessibilityProvider } from '@/shared/providers/AccessibilityProvider';
import { ConflictResolutionModal } from "@/shared/components/ConflictResolutionModal";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { isDesktopApp } from '@/shared/lib/platform'
import { useEffect } from 'react';

function TelemetryBootstrap() {
    useEffect(() => {
        initializeErrorTracking();
    }, []);

    return null;
}

export default function App() {
    const Router = isDesktopApp() ? HashRouter : BrowserRouter

    return (
        <I18nextProvider i18n={i18n}>
            <AccessibilityProvider>
                <ThemeProvider>
                    <SEOProvider>
                        <PersistQueryClientProvider
                            client={queryClient}
                            persistOptions={{ persister }}
                        >
                            <AuthProvider>
                                <AnalyticsProvider>
                                    <ToastProvider>
                                        <TelemetryBootstrap />
                                        <ConflictResolutionModal />
                                        {!isDesktopApp() ? <PWAManager /> : null}
                                        <Toaster position="bottom-right" toastOptions={{ className: 'glass-panel text-white border-blue-500/30' }} />
                                        <OnboardingManager />
                                        <SanctuaryOverlay />
                                        <Router>
                                            <AnalyticsTracker />
                                            <ErrorBoundary>
                                                <SEOWrapper>
                                                    <AppRoutes />
                                                </SEOWrapper>
                                            </ErrorBoundary>
                                        </Router>
                                    </ToastProvider>
                                </AnalyticsProvider>
                            </AuthProvider>
                        </PersistQueryClientProvider>
                    </SEOProvider>
                </ThemeProvider>
            </AccessibilityProvider>
        </I18nextProvider>
    );
}
