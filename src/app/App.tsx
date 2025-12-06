import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/react-query";
import { AppRoutes } from "@/config/routes/index";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ToastProvider } from "@/shared/ui/GlassToast";

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastProvider>
                    <Router>
                        <ErrorBoundary>
                            <AppRoutes />
                        </ErrorBoundary>
                    </Router>
                </ToastProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
