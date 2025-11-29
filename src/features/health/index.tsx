import { useState } from 'react';
import { Activity, Heart, Moon, Scale, Plus, Pill, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useHealth } from '@/hooks/useHealth';
import { clsx } from 'clsx';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

export default function HealthPage() {
    const { metrics, medications, isLoading, createMetric, createMedication, deleteMedication } = useHealth();
    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
    const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);

    // Mock data for charts if no real data
    const chartData = metrics?.length ? metrics.slice(0, 7).reverse().map((m: any) => ({
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
        return metrics?.find((m: any) => m.metric_type === type);
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
                                            {medications.map((med: any) => (
                                                <div key={med.id} className="flex items-center justify-between p-3 bg-surface rounded border border-border group">
                                                    <div>
                                                        <div className="font-bold font-mono text-foreground">{med.name}</div>
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            {med.dosage} • {Array.isArray(med.schedule) ? med.schedule.join(', ') : med.schedule}
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
            )
            }

            {/* Simple Modals (Implementation simplified for brevity) */}
            {
                isMetricModalOpen && (
                    <MetricModal onClose={() => setIsMetricModalOpen(false)} onSubmit={createMetric.mutate} />
                )
            }
            {
                isMedicationModalOpen && (
                    <MedicationModal onClose={() => setIsMedicationModalOpen(false)} onSubmit={createMedication.mutate} />
                )
            }
        </div >
    );
}

function MetricCard({ title, value, unit, icon, date }: any) {
    return (
        <Card className="p-4 border-border bg-card flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-muted-foreground font-bold tracking-wider">{title}</span>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold font-mono text-foreground">
                    {value} <span className="text-sm text-muted-foreground font-normal">{unit}</span>
                </div>
                {date && (
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        {new Date(date).toLocaleDateString('pt-BR')}
                    </div>
                )}
            </div>
        </Card>
    );
}

function MetricModal({ onClose, onSubmit }: any) {
    const [type, setType] = useState('weight');
    const [value, setValue] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">REGISTRAR MÉTRICA</h3>
                <div className="space-y-4">
                    <select
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="weight">Peso (kg)</option>
                        <option value="steps">Passos</option>
                        <option value="sleep">Sono (horas)</option>
                        <option value="heart_rate">Batimentos (bpm)</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Valor"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ metric_type: type, value: Number(value), recorded_date: new Date().toISOString() });
                            onClose();
                        }} className="flex-1">SALVAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function MedicationModal({ onClose, onSubmit }: any) {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState('08:00');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">NOVO MEDICAMENTO</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome (ex: Vitamina C)"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Dosagem (ex: 500mg)"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={dosage}
                        onChange={e => setDosage(e.target.value)}
                    />
                    <input
                        type="time"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                    />
                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ name, dosage, schedule: [time], active: true });
                            onClose();
                        }} className="flex-1">SALVAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
