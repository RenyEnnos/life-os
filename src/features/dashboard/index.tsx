import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useJournalInsights } from '@/features/journal/hooks/useJournalInsights';
import { getCurrentTimeBlock } from '@/shared/lib/dynamicNow';
import { cn } from '@/shared/lib/cn';

// UI Components
import { BentoGrid, BentoCard } from '@/shared/ui/BentoCard';
import { XPBar } from '@/features/gamification/components/XPBar';

// Dashboard Widgets
import { Zone1_Now } from './components/Zone1_Now';
import { Zone2_Today } from './components/Zone2_Today';
import { Zone3_Context } from './components/Zone3_Context';
import { StatusCard } from './components/StatusCard';
import { ResonanceCard } from './components/ResonanceCard';
import { ArchetypeCard } from '@/features/gamification/components/ArchetypeCard';
import { AchievementsPanel } from '@/features/gamification/components/AchievementsPanel';

// Icons
import {
    Sparkles,
    Trophy,
    User,
    Gauge,
    Brain,
} from 'lucide-react';

// Constants
const GREETINGS: Record<'morning' | 'afternoon' | 'evening', string> = {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite'
};

/**
 * DashboardPage - The "Cockpit"
 * 
 * Refactored Phase 6 Layout:
 * Zone 1: Focus (2x2)
 * Zone 2: Mission (1x2)
 * Zone 3: Context (2x1)
 */
export default function DashboardPage() {
    const { user } = useAuth();
    const firstName = user?.name?.split(' ')[0] || 'Comandante';
    const timeBlock = getCurrentTimeBlock();

    // Get weekly advice from Neural Resonance
    const { weeklySummary } = useJournalInsights();
    const nexusAdvice = weeklySummary?.content?.advice
        || 'O Nexus está analisando seus padrões...';

    return (
        <div className="space-y-6 pb-20 px-4 md:px-0 min-h-screen">

            {/* ═══════════════════════════════════════════════════════════════
                HEADER - Horizon Greeting
            ═══════════════════════════════════════════════════════════════ */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-6 pb-4 border-b border-border/40"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Greeting */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                            {GREETINGS[timeBlock]}, <span className="text-primary">{firstName}</span>
                        </h1>

                        {/* Nexus Advice */}
                        <div className="flex items-start gap-2 mt-2 max-w-lg">
                            <Sparkles size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground line-clamp-1">
                                {nexusAdvice}
                            </p>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <XPBar className="w-full md:w-48" />
                </div>
            </motion.header>

            {/* ═══════════════════════════════════════════════════════════════
                BENTO GRID - Cockpit Layout
            ═══════════════════════════════════════════════════════════════ */}
            <BentoGrid className="auto-rows-[160px] md:auto-rows-[180px]">

                {/* ───────────── Zone 1. NOW (1x2 on Tablet, 1x2 on Desktop) ───────────── */}
                <Zone1_Now className="col-span-1 row-span-1 md:row-span-2" />

                {/* ───────────── Zone 2. TODAY (1x2 on Tablet) ───────────── */}
                <Zone2_Today className="col-span-1 row-span-1 md:row-span-2" />

                {/* ───────────── Identity & Status (1x2 Stack) ───────────── */}
                <div className="col-span-1 row-span-1 md:row-span-2 flex flex-col gap-4 h-full">
                    <BentoCard
                        className="flex-1 p-0 overflow-hidden"
                        title="Identidade"
                        icon={User}
                        noPadding
                    >
                        <ArchetypeCard variant="compact" className="h-full border-none rounded-none shadow-none" />
                    </BentoCard>

                    <BentoCard
                        className="flex-1"
                        title="Nível"
                        icon={Gauge}
                    >
                        <StatusCard />
                    </BentoCard>
                </div>

                {/* ───────────── Zone 3. CONTEXT (2x1) ───────────── */}
                <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 md:row-span-2">
                    {/* FIX: Zone3 fits better as a vertical stack in 4-col layout or needs 2-col? 
                         If 4-col: Zone1(1), Zone2(1), Stack(1), Zone3(1) fills row 1 (height 2).
                         Perfect. 
                     */}
                    <Zone3_Context />
                </div>

                {/* ───────────── Intelligence (Span 2) ───────────── */}
                <BentoCard
                    className="col-span-1 md:col-span-2 row-span-1"
                    title="Ressonância Neural"
                    icon={Brain}
                >
                    <ResonanceCard />
                </BentoCard>

                {/* ───────────── Gamification (Span 2) ───────────── */}
                <BentoCard
                    className="col-span-1 md:col-span-2 row-span-1"
                    title="Conquistas"
                    icon={Trophy}
                >
                    <AchievementsPanel />
                </BentoCard>

            </BentoGrid>
        </div>
    );
}
