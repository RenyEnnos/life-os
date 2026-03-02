import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { AppLayout } from '@/app/layout/AppLayout';
import { Loader } from '@/shared/ui/Loader';

// Lazy load pages
const LoginPage = lazy(() => import('@/features/auth/components/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/components/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/components/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/features/dashboard'));
const HabitsPage = lazy(() => import('@/features/habits'));
const TasksPage = lazy(() => import('@/features/tasks'));
const CalendarPage = lazy(() => import('@/features/calendar'));
const JournalPage = lazy(() => import('@/features/journal'));
const HealthPage = lazy(() => import('@/features/health'));
const FinancesPage = lazy(() => import('@/features/finances'));
const ProjectsPage = lazy(() => import('@/features/projects'));
const UniversityPage = lazy(() => import('@/features/university'));

const AiAssistantPage = lazy(() => import('@/features/ai-assistant'));
const FocusPage = lazy(() => import('@/features/focus'));
const GamificationPage = lazy(() => import('@/features/gamification'));

const SettingsPage = lazy(() => import('@/features/settings'));
const DesignSystemPreview = lazy(() => import('@/features/design-system/Preview'));

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
                <Route path="/" element={
                    <Suspense fallback={<Loader text="LOADING DASHBOARD..." />}>
                        <DashboardPage />
                    </Suspense>
                } />
                <Route path="/habits" element={
                    <Suspense fallback={<Loader text="LOADING HABITS..." />}>
                        <HabitsPage />
                    </Suspense>
                } />
                <Route path="/tasks" element={
                    <Suspense fallback={<Loader text="LOADING TASKS..." />}>
                        <TasksPage />
                    </Suspense>
                } />
                <Route path="/calendar" element={
                    <Suspense fallback={<Loader text="LOADING CALENDAR..." />}>
                        <CalendarPage />
                    </Suspense>
                } />
                <Route path="/journal" element={
                    <Suspense fallback={<Loader text="LOADING JOURNAL..." />}>
                        <JournalPage />
                    </Suspense>
                } />
                <Route path="/health" element={
                    <Suspense fallback={<Loader text="LOADING HEALTH..." />}>
                        <HealthPage />
                    </Suspense>
                } />
                <Route path="/finances" element={
                    <Suspense fallback={<Loader text="LOADING FINANCES..." />}>
                        <FinancesPage />
                    </Suspense>
                } />
                <Route path="/projects" element={
                    <Suspense fallback={<Loader text="LOADING PROJECTS..." />}>
                        <ProjectsPage />
                    </Suspense>
                } />
                <Route path="/ai-assistant" element={
                    <Suspense fallback={<Loader text="LOADING AI..." />}>
                        <AiAssistantPage />
                    </Suspense>
                } />
                <Route path="/focus" element={
                    <Suspense fallback={<Loader text="LOADING FOCUS..." />}>
                        <FocusPage />
                    </Suspense>
                } />
                <Route path="/gamification" element={
                    <Suspense fallback={<Loader text="LOADING PROGRESS..." />}>
                        <GamificationPage />
                    </Suspense>
                } />

                <Route path="/settings" element={
                    <Suspense fallback={<Loader text="LOADING SETTINGS..." />}>
                        <SettingsPage />
                    </Suspense>
                } />
                <Route path="/design" element={
                    <Suspense fallback={<Loader text="LOADING DESIGN..." />}>
                        <DesignSystemPreview />
                    </Suspense>
                } />
                <Route path="/university" element={
                    <Suspense fallback={<Loader text="LOADING ACADEMIC..." />}>
                        <UniversityPage />
                    </Suspense>
                } />
                <Route path="/profile" element={<Navigate to="/settings" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
