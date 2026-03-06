import { useState } from 'react';
import { useHealth } from '../hooks/useHealth';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from '@/shared/ui/Loader';

const METRIC_TYPES = ['heart_rate', 'steps', 'sleep', 'calories', 'weight', 'water'];

export const HealthPage = () => {
    const queryClient = useQueryClient();
    const { metrics, medications, isLoading, createMetric, deleteMedication } = useHealth();
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [logType, setLogType] = useState('steps');
    const [logValue, setLogValue] = useState('');
    const [logUnit, setLogUnit] = useState('');

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
        queryClient.invalidateQueries({ queryKey: ['medications'] });
    };

    const handleAddLog = () => {
        if (!logValue) return;
        createMetric.mutate({
            metric_type: logType,
            value: parseFloat(logValue),
            unit: logUnit,
            recorded_date: new Date().toISOString().split('T')[0],
        });
        setLogValue('');
        setIsLogOpen(false);
    };

    const getMetricValue = (type: string) =>
        metrics?.filter(m => m.metric_type === type).slice(-1)[0]?.value;

    const heartRate = getMetricValue('heart_rate');
    const steps = getMetricValue('steps');
    const sleep = getMetricValue('sleep');
    const stepsGoal = 10000;
    const stepsPercent = steps ? Math.min((steps / stepsGoal) * 100, 100) : 0;

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[400px]">
                <Loader text="LOADING HEALTH DATA..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
            <div className="flex h-screen w-full">
                <main className="flex-1 flex flex-col overflow-y-auto bg-background-dark p-8">
                    {/* Header */}
                    <header className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight mb-1">Health Center</h2>
                            <div className="flex items-center gap-2 text-white/40">
                                <span className="material-symbols-outlined text-sm text-activity-green">watch</span>
                                <span className="text-sm font-medium">{metrics?.length ? `${metrics.length} metrics recorded` : 'No data yet'}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="glass px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Refresh Vitals
                        </button>
                    </header>

                    {/* Top Vitals Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Heart Rate Widget */}
                        <div className="glass p-6 rounded-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-white/50 text-sm font-medium">Heart Rate</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <h3 className="text-3xl font-black">{heartRate ?? '—'}</h3>
                                        <span className="text-white/40 text-sm font-bold uppercase tracking-widest">bpm</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-vital-red/10 flex items-center justify-center text-vital-red">
                                    <span className="material-symbols-outlined">favorite</span>
                                </div>
                            </div>
                            <div className="h-24 w-full flex items-end">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                    <path d="M0,30 Q10,10 20,25 T40,15 T60,20 T80,5 T100,25" fill="none" stroke="#f43f5e" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                    <path d="M0,30 Q10,10 20,25 T40,15 T60,20 T80,5 T100,25 L100,40 L0,40 Z" fill="url(#grad-red)" opacity="0.1"></path>
                                    <defs>
                                        <linearGradient id="grad-red" x1="0%" x2="0%" y1="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: "#f43f5e", stopOpacity: "1" }}></stop>
                                            <stop offset="100%" style={{ stopColor: "#f43f5e", stopOpacity: "0" }}></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        {/* Sleep Score Widget */}
                        <div className="glass p-6 rounded-lg flex items-center gap-6">
                            <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="#60a5fa" strokeDasharray="251.2" strokeDashoffset={sleep ? 251.2 - (sleep / 9) * 251.2 : 200} strokeWidth="8"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black leading-none">{sleep ? Math.round((sleep / 9) * 100) : '—'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm font-medium">Sleep Score</p>
                                <h3 className="text-xl font-bold mt-1">{sleep ? `${sleep}h` : 'No data'}</h3>
                                <div className="flex items-center gap-1.5 mt-2 text-sleep-blue">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="text-sm font-semibold">{sleep ? `${sleep}h recorded` : 'Log sleep'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Steps Widget */}
                        <div className="glass p-6 rounded-lg flex items-center gap-6">
                            <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="#4ade80" strokeDasharray="251.2" strokeDashoffset={251.2 - (stepsPercent / 100) * 251.2} strokeWidth="8"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="material-symbols-outlined text-activity-green">directions_run</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm font-medium">Daily Steps</p>
                                <h3 className="text-xl font-bold mt-1">{steps ? steps.toLocaleString() : '0'}</h3>
                                <p className="text-white/30 text-xs font-bold uppercase mt-1">Goal: {stepsGoal.toLocaleString()}</p>
                                <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-activity-green rounded-full transition-all" style={{ width: `${stepsPercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                        {/* Metrics Log */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <h4 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Recent Metrics
                            </h4>
                            <div className="glass rounded-lg overflow-hidden divide-y divide-white/5">
                                {(!metrics || metrics.length === 0) && (
                                    <div className="p-10 text-center text-white/30 text-sm">No metrics recorded yet</div>
                                )}
                                {(metrics || []).slice(-10).reverse().map(metric => (
                                    <div key={metric.id} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                                        <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <span className="material-symbols-outlined">monitor_heart</span>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-bold capitalize">{metric.metric_type.replace(/_/g, ' ')}</h5>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-white/40 text-xs flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">straighten</span>
                                                    {metric.value} {metric.unit || ''}
                                                </span>
                                                <span className="text-white/40 text-xs flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                                                    {new Date(metric.recorded_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Medications + Log */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-400">medication</span>
                                Medications
                            </h4>
                            <div className="glass p-6 rounded-lg flex-1">
                                {(!medications || medications.length === 0) && (
                                    <p className="text-white/30 text-sm text-center py-4">No medications</p>
                                )}
                                <div className="space-y-3 mb-4">
                                    {(medications || []).map(med => (
                                        <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                            <div>
                                                <p className="text-sm font-bold">{med.name}</p>
                                                <p className="text-xs text-white/40">{med.dosage} · {med.times?.join(', ')}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteMedication.mutate(med.id)}
                                                className="material-symbols-outlined text-white/20 hover:text-red-400 transition-colors text-sm"
                                            >
                                                delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    {isLogOpen ? (
                                        <div className="flex flex-col gap-3">
                                            <select
                                                value={logType}
                                                onChange={e => setLogType(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            >
                                                {METRIC_TYPES.map(t => (
                                                    <option key={t} value={t} className="bg-[#18181b]">{t.replace(/_/g, ' ')}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Value"
                                                value={logValue}
                                                onChange={e => setLogValue(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Unit (e.g. bpm, steps)"
                                                value={logUnit}
                                                onChange={e => setLogUnit(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleAddLog}
                                                    className="flex-1 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setIsLogOpen(false)}
                                                    className="flex-1 py-2 rounded-lg bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsLogOpen(true)}
                                            className="w-full glass py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                                        >
                                            Add Log Entry
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
