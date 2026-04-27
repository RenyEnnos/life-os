import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { AppLayout } from '@/app/layout/AppLayout';
import { Loader } from '@/shared/ui/Loader';
import {
    DEFAULT_AUTHENTICATED_ROUTE,
    HIDDEN_MVP_ROUTES,
    canAccessMvpInviteOnly,
    getMvpRuntimeAccess,
} from '@/config/routes/access';

// Lazy load pages
const LoginPage = lazy(() => import('@/features/auth/components/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/components/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/components/ResetPasswordPage'));
const MvpPage = lazy(() => import('@/features/mvp'));
const MvpSurfacePage = lazy(() =>
  import('@/features/mvp/pages/MvpSurfacePage').then((module) => ({ default: module.MvpSurfacePage }))
);
const SettingsPage = lazy(() => import('@/features/settings'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading, error } = useAuth();

    useEffect(() => {
        if (!loading && !user?.id) {
            console.log('[ProtectedRoute] No user found, redirecting to /login');
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div id="auth-loading" className="min-h-screen flex items-center justify-center bg-background">
                <Loader text="AUTHENTICATING..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <h2 className="text-xl font-semibold text-red-500 mb-2">AUTH ERROR</h2>
                <p className="text-zinc-400 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-black rounded-lg font-medium"
                >
                    RETRY
                </button>
            </div>
        );
    }

    if (!user?.id) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export function AppRoutes() {
    const { user, profile } = useAuth();
    const { canAccessInternalAdmin } = getMvpRuntimeAccess();
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const canAccessInviteOnlyMvp = canAccessMvpInviteOnly({
      dev: import.meta.env.DEV,
      hostname,
      inviteCode: profile?.invite_code ?? (user?.user_metadata?.invite_code as string | undefined),
      invitedPartner: profile?.is_invited_partner ?? (user?.user_metadata?.is_invited_partner as string | boolean | undefined),
      inviteGateBypassFlag: import.meta.env.VITE_BYPASS_MVP_INVITE_GATE,
    });
    const authenticatedLandingRoute = canAccessInviteOnlyMvp ? DEFAULT_AUTHENTICATED_ROUTE : '/settings';
    const mvpRouteFallback = <Navigate to={authenticatedLandingRoute} replace />;

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
                <Suspense fallback={<Loader text="LOADING LOGIN..." />}>
                    <LoginPage />
                </Suspense>
            } />
            <Route path="/register" element={
                <Suspense fallback={<Loader text="LOADING REGISTER..." />}>
                    <RegisterPage />
                </Suspense>
            } />
            <Route path="/reset-password" element={
                <Suspense fallback={<Loader text="LOADING..." />}>
                    <ResetPasswordPage />
                </Suspense>
            } />

            {/* Protected Routes */}
            <Route element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }>
                <Route path="/" element={<Navigate to={authenticatedLandingRoute} replace />} />
                {HIDDEN_MVP_ROUTES.map((path) => (
                    <Route key={path} path={path} element={<Navigate to={authenticatedLandingRoute} replace />} />
                ))}
                <Route path="/settings" element={
                    <Suspense fallback={<Loader text="LOADING SETTINGS..." />}>
                        <SettingsPage />
                    </Suspense>
                } />
                <Route path="/mvp" element={
                    canAccessInviteOnlyMvp ? (
                        <Suspense fallback={<Loader text="LOADING MVP..." />}>
                            <MvpPage />
                        </Suspense>
                    ) : (
                        mvpRouteFallback
                    )
                } />
                <Route path="/mvp/onboarding" element={
                    canAccessInviteOnlyMvp ? (
                        <Suspense fallback={<Loader text="LOADING MVP..." />}>
                            <MvpSurfacePage surface="onboarding" />
                        </Suspense>
                    ) : (
                        mvpRouteFallback
                    )
                } />
                <Route path="/mvp/weekly-review" element={
                    canAccessInviteOnlyMvp ? (
                        <Suspense fallback={<Loader text="LOADING MVP..." />}>
                            <MvpSurfacePage surface="weekly-review" />
                        </Suspense>
                    ) : (
                        mvpRouteFallback
                    )
                } />
                <Route path="/mvp/today" element={
                    canAccessInviteOnlyMvp ? (
                        <Suspense fallback={<Loader text="LOADING MVP..." />}>
                            <MvpSurfacePage surface="today" />
                        </Suspense>
                    ) : (
                        mvpRouteFallback
                    )
                } />
                <Route path="/mvp/reflection" element={
                    canAccessInviteOnlyMvp ? (
                        <Suspense fallback={<Loader text="LOADING MVP..." />}>
                            <MvpSurfacePage surface="reflection" />
                        </Suspense>
                    ) : (
                        mvpRouteFallback
                    )
                } />
                <Route path="/mvp/admin" element={
                    canAccessInviteOnlyMvp && canAccessInternalAdmin ? (
                        <Suspense fallback={<Loader text="LOADING MVP..." />}>
                            <MvpSurfacePage surface="admin" />
                        </Suspense>
                    ) : (
                        mvpRouteFallback
                    )
                } />
                <Route path="/profile" element={<Navigate to="/settings" replace />} />
            </Route>

            <Route path="*" element={<Navigate to={authenticatedLandingRoute} replace />} />
        </Routes>
    );
}
