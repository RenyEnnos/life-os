import { useState } from 'react';
import { Activity, Heart, Moon, Scale, Plus, Pill, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useHealth } from '@/features/health/hooks/useHealth';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { HealthMetric, MedicationReminder } from '@/shared/types';
import { MetricModal } from './components/MetricModal';
import { MedicationModal } from './components/MedicationModal';
import { MetricCard } from './components/MetricCard';

export default function HealthPage() {
    const { metrics, medications, isLoading, createMetric, createMedication, deleteMedication } = useHealth();
    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
    const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);

    // Mock data for charts if no real data
    const chartData = metrics?.length ? metrics.slice(0, 7).reverse().map((m: HealthMetric) => ({
        date: new Date(m.recorded_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: Number(m.value)
    })) : [
        { date: '01/11', value: 70 },
        { date: '02/11', value: 72 },
        { date: '03/11', value: 68 },
        { date: '04/11', value: 75 },
        { date: '05/11', value: 71 },
        { date: '06/11', value: 73 },
        { date: '07/11', value: 70 },
    ];

    const getLatestMetric = (type: string) => {
        return metrics?.find((m: HealthMetric) => m.metric_type === type);
    };

    const weight = getLatestMetric('weight');
    const steps = getLatestMetric('steps');
    const sleep = getLatestMetric('sleep');
    const heartRate = getLatestMetric('heart_rate');

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="SAÚDE & BEM-ESTAR"
                subtitle="Métricas vitais e manutenção biológica."
                action={
                    <div className="flex gap-2">
                        <Button onClick={() => setIsMetricModalOpen(true)} variant="outline" className="gap-2">
                            <Plus size={18} />
                            REGISTRAR MÉTRICA
                        </Button>
                        <Button onClick={() => setIsMedicationModalOpen(true)} className="gap-2">
                            <Pill size={18} />
                            ADICIONAR MEDICAMENTO
                        </Button>
                    </div>
                }
            />

            {isLoading ? (
                <div className="text-center py-20 text-muted-foreground font-mono animate-pulse">
                    CARREGANDO DADOS DE SAÚDE...
                </div>
            ) : (
                <>
                    {(!metrics?.length && !medications?.length) ? (
                        <EmptyState
                            icon={Heart}
                            title="SISTEMA BIOLÓGICO"
                            description="Nenhum dado vital registrado. Inicie o monitoramento."
                            action={
                                <div className="flex gap-2 justify-center">
                                    <Button onClick={() => setIsMetricModalOpen(true)} variant="outline" className="gap-2">
                                        <Plus size={16} /> REGISTRAR MÉTRICA
                                    </Button>
                                    <Button onClick={() => setIsMedicationModalOpen(true)} className="gap-2">
                                        <Plus size={16} /> ADICIONAR MEDICAMENTO
                                    </Button>
                                </div>
                            }
                        />
                    ) : (
                        <>
                            {/* Metrics Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <MetricCard
                                    title="PESO"
                                    value={weight?.value || '--'}
                                    unit="kg"
                                    icon={<Scale className="text-blue-400" />}
                                    date={weight?.recorded_date}
                                />
                                <MetricCard
                                    title="PASSOS"
                                    value={steps?.value || '--'}
                                    unit=""
                                    icon={<Activity className="text-green-400" />}
                                    date={steps?.recorded_date}
                                />
                                <MetricCard
                                    title="SONO"
                                    value={sleep?.value || '--'}
                                    unit="h"
                                    icon={<Moon className="text-purple-400" />}
                                    date={sleep?.recorded_date}
                                />
                                <MetricCard
                                    title="BATIMENTOS"
                                    value={heartRate?.value || '--'}
                                    unit="bpm"
                                    icon={<Heart className="text-red-400" />}
                                    date={heartRate?.recorded_date}
                                />
                            </div>

                            {/* Charts Section */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="p-6 border-border bg-card">
                                    <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                                        <Activity size={20} className="text-primary" />
                                        EVOLUÇÃO RECENTE
                                    </h3>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                                                <YAxis stroke="#666" fontSize={12} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#adfa1d"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#adfa1d', r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                {/* Medications List */}
                                <Card className="p-6 border-border bg-card">
                                    <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                                        <Pill size={20} className="text-primary" />
                                        MEDICAMENTOS & SUPLEMENTOS
                                    </h3>

                                    {!medications?.length ? (
                                        <div className="text-center py-10 text-muted-foreground font-mono text-sm">
                                            Nenhum protocolo medicamentoso ativo.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {medications.map((med: MedicationReminder) => (
                                                <div key={med.id} className="flex items-center justify-between p-3 bg-surface rounded border border-border group">
                                                    <div>
                                                        <div className="font-bold font-mono text-foreground">{med.name}</div>
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            {med.dosage} • {Array.isArray(med.times) ? med.times.join(', ') : med.times}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                                        onClick={() => deleteMedication.mutate(med.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </>
                    )}
                </>
            )}

            {isMetricModalOpen && (
                <MetricModal onClose={() => setIsMetricModalOpen(false)} onSubmit={createMetric.mutate} />
            )}
            {isMedicationModalOpen && (
                <MedicationModal onClose={() => setIsMedicationModalOpen(false)} onSubmit={createMedication.mutate} />
            )}
        </div>
    );
}
