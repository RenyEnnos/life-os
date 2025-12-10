import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useJournalInsights } from '@/features/journal/hooks/useJournalInsights';
import { getCurrentTimeBlock } from '@/shared/lib/dynamicNow';
import { cn } from '@/shared/lib/cn';

// UI Components
import { BentoGrid, BentoCard } from '@/shared/ui/BentoCard';
import { XPBar } from '@/features/gamification/components/XPBar';

// Dashboard Widgets
import { UrgentCard, QuickActionsCard } from './components/Zone1_Now';
import { StatusCard } from './components/StatusCard';
import { ResonanceCard } from './components/ResonanceCard';
import { ArchetypeCard } from '@/features/gamification/components/ArchetypeCard';
import { VisualLegacy } from '@/features/gamification/components/VisualLegacy';
import { AchievementsPanel } from '@/features/gamification/components/AchievementsPanel';

// Icons
import {
    Sparkles,
    Star,
    Trophy,
    User,
    Gauge,
    Brain,
    Zap
} from 'lucide-react';

// Constants
const GREETINGS: Record<'morning' | 'afternoon' | 'evening', string> = {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite'
};

/**
 * DashboardPage - Cockpit-style Command Center
 * 
 * A high-density Bento Grid layout integrating:
 * - Gamification (Archetype, Level, XP, Achievements)
 * - Focus (Urgent Tasks via Dynamic Now)
 * - Intelligence (Neural Resonance mood & insights)
 */
export default function DashboardPage() {
    const { user } = useAuth();
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Comandante';
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
                BENTO GRID - Command Center
                
                Layout (Desktop 4-col):
                ┌────────┬────────┬────────┬────────┐
                │        │        │        │        │
                │ URGENT │ARCHTYPE│ STATUS │ QUICK  │ Row 1
                │  2x2   │  1x1   │  1x1   │  1x1   │
                │        ├────────┴────────┴────────┤
                │        │                          │ Row 2
                ├────────┤     CONSTELLATION 3x1    │
                │        │                          │
                ├────────┴──────────────────────────┤
                │   RESONANCE 2x1    │ ACHIEVEMENTS │ Row 3
                │                    │     2x1      │
                └────────────────────┴──────────────┘
            ═══════════════════════════════════════════════════════════════ */}
            <BentoGrid className="auto-rows-[160px] md:auto-rows-[180px]">

                {/* ───────────── 1. URGENT CARD (2x2) - Priority Focus ───────────── */}
                <UrgentCard />

                {/* ───────────── 2. ARCHETYPE CARD (1x1) - Identity ───────────── */}
                <BentoCard
                    className="col-span-1 row-span-1 p-0 overflow-hidden"
                    title="Identidade"
                    icon={User}
                    noPadding
                >
                    <ArchetypeCard className="h-full border-none rounded-none shadow-none" />
                </BentoCard>

                {/* ───────────── 3. STATUS CARD (1x1) - Level + XP ───────────── */}
                <BentoCard
                    className="col-span-1 row-span-1"
                    title="Nível"
                    icon={Gauge}
                >
                    <StatusCard />
                </BentoCard>

                {/* ───────────── 4. QUICK ACTIONS (1x1) ───────────── */}
                <QuickActionsCard />

                {/* ───────────── 5. CONSTELLATION (3x1) - Visual Legacy ───────────── */}
                <BentoCard
                    className="col-span-1 md:col-span-3 row-span-1 h-[200px] md:h-auto p-0 overflow-hidden bg-black"
                    title="Constelação"
                    icon={Star}
                    noPadding
                >
                    <VisualLegacy className="h-full w-full border-none rounded-none" />
                </BentoCard>

                {/* ───────────── 6. RESONANCE CARD (2x1) - Mood & Insights ───────────── */}
                <BentoCard
                    className="col-span-1 md:col-span-2 row-span-1"
                    title="Ressonância Neural"
                    icon={Brain}
                >
                    <ResonanceCard />
                </BentoCard>

                {/* ───────────── 7. ACHIEVEMENTS (2x1) ───────────── */}
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
