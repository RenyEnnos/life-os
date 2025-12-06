import { PageTitle } from '@/shared/ui/PageTitle';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Zone1_Now } from './components/Zone1_Now';
import { Zone2_Today } from './components/Zone2_Today';
import { Zone3_Context } from './components/Zone3_Context';

import { XPBar } from '@/features/gamification/components/XPBar';

export default function DashboardPage() {
    const { user } = useAuth();
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

    return (
        <div className="space-y-6 pb-20">
            <header className="py-4">
                <PageTitle
                    title="COMMAND CENTER"
                    subtitle={`Welcome back, ${firstName}. Systems nominal.`}
                    action={<XPBar className="w-32 md:w-48" />}
                />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Zone 1: Immediate Focus (Left Column) */}
                <Zone1_Now />

                {/* Zone 2: Overview & Stats (Center / Main) */}
                <Zone2_Today />

                {/* Zone 3: Context & AI (Right Column) */}
                <Zone3_Context />
            </div>
        </div>
    );
}
