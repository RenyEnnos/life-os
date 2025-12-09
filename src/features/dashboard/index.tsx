import React from 'react';
import anime from 'animejs';
import { PageTitle } from '@/shared/ui/PageTitle';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { XPBar } from '@/features/gamification/components/XPBar';
import { BentoGrid } from '@/shared/ui/premium/BentoGrid';
import { UrgentCard, QuickActionsCard } from './components/Zone1_Now';
import { StatusCard, StatsCard, ChartCard, QuickCaptureCard } from './components/Zone2_Today';
import { UniversityCard, ScheduleCard, AiInsightCard } from './components/Zone3_Context';

export default function DashboardPage() {
    const { user } = useAuth();
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        // Anime.js stagger animation
        anime({
            targets: containerRef.current.children,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            easing: 'easeOutExpo',
            duration: 800
        });
    }, []);

    return (
        <div className="space-y-6 pb-20">
            <header className="py-4">
                <PageTitle
                    title="COMMAND CENTER"
                    subtitle={`Welcome back, ${firstName}. Systems nominal.`}
                    action={<XPBar className="w-32 md:w-48" />}
                />
            </header>

            <BentoGrid ref={containerRef} className="grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4 opacity-0">
                {/* Top Row: Urgent (Tall), Status (Wide), Stats */}
                <UrgentCard />
                <StatusCard />
                <StatsCard />

                {/* Second Row: Chart (Wide), Quick Actions */}
                <ChartCard />
                <QuickActionsCard />

                {/* Third Row: University (Tall), Schedule, Context */}
                <UniversityCard />
                <ScheduleCard />
                <AiInsightCard />

                {/* Bottom: Quick Capture */}
                <QuickCaptureCard />
            </BentoGrid>
        </div>
    );
}

