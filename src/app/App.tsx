import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persister } from "@/shared/lib/react-query";
import { AppRoutes } from "@/config/routes/index";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ToastProvider } from "@/shared/ui/GlassToast";
import { OfflineSyncManager } from "@/shared/components/OfflineSyncManager";

export default function App() {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            <AuthProvider>
                <ToastProvider>
                    <OfflineSyncManager />
                    <Router>
                        <ErrorBoundary>
                            <AppRoutes />
                        </ErrorBoundary>
                    </Router>
                </ToastProvider>
            </AuthProvider>
        </PersistQueryClientProvider>
    );
}
