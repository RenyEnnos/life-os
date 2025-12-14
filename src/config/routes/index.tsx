import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { AppLayout } from '@/app/layout/AppLayout';
import { Loader } from '@/shared/ui/Loader';

// Lazy load pages
const LoginPage = lazy(() => import('@/features/auth/components/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/components/RegisterPage'));
const DashboardPage = lazy(() => import('@/features/dashboard'));
const HabitsPage = lazy(() => import('@/features/habits'));
const TasksPage = lazy(() => import('@/features/tasks'));
const CalendarPage = lazy(() => import('@/features/calendar'));
const JournalPage = lazy(() => import('@/features/journal'));
const HealthPage = lazy(() => import('@/features/health'));
const FinancesPage = lazy(() => import('@/features/finances'));
const ProjectsPage = lazy(() => import('@/features/projects'));
const UniversityPage = lazy(() => import('@/features/university'));
const RewardsPage = lazy(() => import('@/features/rewards/index'));
const SettingsPage = lazy(() => import('@/features/settings'));
const DesignSystemPreview = lazy(() => import('@/features/design-system/Preview'));
const ProfilePage = lazy(() => import('@/features/profile'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader text="CHECKING ACCESS..." />
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
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader text="INITIALIZING SYSTEM..." />
            </div>
        }>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/habits" element={<HabitsPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/health" element={<HealthPage />} />
                    <Route path="/finances" element={<FinancesPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/design" element={<DesignSystemPreview />} />
                    <Route path="/university" element={<UniversityPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}
