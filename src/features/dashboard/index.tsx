import React from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { XPBar } from '@/features/gamification/components/XPBar';
import { BentoGrid, BentoCard } from '@/shared/ui/BentoCard';
import {
    Zap,
    Activity,
    BarChart3,
    Clock,
    School
} from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

    return (
        <div className="space-y-8 pb-20 px-4 md:px-0">
            {/* Header Limpo e Semântico */}
            <header className="py-6 border-b border-border/40">
                <PageTitle
                    title="COMMAND CENTER"
                    subtitle={`Sistemas nominais. Bem-vindo de volta, ${firstName}.`}
                    action={<XPBar className="w-32 md:w-48" />}
                />
            </header>

            {/* O Grid Bento Declarativo */}
            <BentoGrid>
                {/* 1. Card de Foco (Destaque - Alto) */}
                <BentoCard
                    className="col-span-1 md:col-span-1 row-span-2 bg-gradient-to-b from-surface to-surface/50"
                    title="Prioridade 0"
                    icon={Zap}
                >
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-xl font-medium text-foreground mb-2">Revisão PRD v2.2</h3>
                            <p className="text-sm text-muted-foreground">Alinhamento de estrutura de diretórios e limpeza técnica.</p>
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-bold bg-white text-black rounded hover:opacity-90 transition-opacity">
                            INICIAR FOCO
                        </button>
                    </div>
                </BentoCard>

                {/* 2. Status Geral (Largo) */}
                <BentoCard
                    className="col-span-1 md:col-span-2 lg:col-span-2"
                    title="Visão Geral"
                    icon={Activity}
                >
                    <div className="grid grid-cols-3 gap-4 h-full items-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">12</div>
                            <div className="text-xs text-muted-foreground">Tarefas</div>
                        </div>
                        <div className="text-center border-l border-border">
                            <div className="text-2xl font-bold text-success">92%</div>
                            <div className="text-xs text-muted-foreground">Saúde</div>
                        </div>
                        <div className="text-center border-l border-border">
                            <div className="text-2xl font-bold text-foreground">4h</div>
                            <div className="text-xs text-muted-foreground">Foco</div>
                        </div>
                    </div>
                </BentoCard>

                {/* 3. Cards Pequenos (Métricas) */}
                <BentoCard title="Finanças" icon={BarChart3}>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-semibold">$4.2k</span>
                    </div>
                </BentoCard>

                {/* 4. University (Contexto - Largo) */}
                <BentoCard
                    className="col-span-1 md:col-span-2 lg:col-span-2"
                    title="University"
                    icon={School}
                >
                    <div className="flex justify-between items-center h-full">
                        <div>
                            <div className="text-lg font-medium">Algoritmos Avançados</div>
                            <div className="text-sm text-muted-foreground">Entrega em 2 dias</div>
                        </div>
                        <div className="h-2 w-24 bg-surface rounded-full overflow-hidden border border-border">
                            <div className="h-full bg-primary w-[60%]" />
                        </div>
                    </div>
                </BentoCard>

                {/* 5. Ações Rápidas */}
                <BentoCard title="Quick Actions" icon={Clock}>
                    <div className="grid grid-cols-2 gap-2 h-full">
                        <button className="border border-border rounded hover:bg-surface-hover transition-colors flex flex-col items-center justify-center gap-1">
                            <span className="text-xs text-muted-foreground">Note</span>
                        </button>
                        <button className="border border-border rounded hover:bg-surface-hover transition-colors flex flex-col items-center justify-center gap-1">
                            <span className="text-xs text-muted-foreground">Task</span>
                        </button>
                    </div>
                </BentoCard>
            </BentoGrid>
        </div>
    );
}
