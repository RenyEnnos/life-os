import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { getUserXP } from '@/features/gamification/api/xpService';
import { XPHistoryEntry } from '@/features/gamification/api/types';
import { format, subDays, addDays, startOfDay } from 'date-fns';
import { useLifeScoreForecast, ForecastDataPoint } from '../hooks/useLifeScoreForecast';
import { motion } from 'framer-motion';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';

export const LifeScoreForecastChart = () => {
    const { data: forecast = [], isLoading } = useLifeScoreForecast();

    if (isLoading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <div className="animate-pulse text-primary/50 font-mono text-sm">Calculando Projeções...</div>
            </div>
        );
    }

    const lastHistoricalIndex = forecast.findIndex((p: ForecastDataPoint) => p.isForecast) - 1;
    const historicalData = forecast.slice(0, lastHistoricalIndex + 1);
    const forecastData = forecast.slice(lastHistoricalIndex);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <TrendingUp size={18} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Life Score Forecast</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Projeção Baseada em Ritmo Atual</p>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecast} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickFormatter={(str) => {
                                const d = new Date(str);
                                return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                            }}
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '12px'
                            }}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                            formatter={(value: any, name: any, props: any) => {
                                const payload = props.payload;
                                return [
                                    <div className="flex flex-col gap-1" key="tooltip-complex">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/40 uppercase text-[10px] font-bold">Progress</span>
                                            <span className="font-black text-primary">{payload.lifeScore}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/40 uppercase text-[10px] font-bold">Total XP</span>
                                            <span className="font-bold text-white/90">{payload.score}</span>
                                        </div>
                                    </div>,
                                    payload.isForecast ? 'PROJEÇÃO' : 'ATUAL'
                                ];
                            }}
                        />

                        {/* Historical Line */}
                        <Line
                            type="monotone"
                            dataKey="lifeScore"
                            data={historicalData}
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                        />

                        {/* Forecast Line */}
                        <Line
                            type="monotone"
                            dataKey="lifeScore"
                            data={forecastData}
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{ fill: 'transparent', stroke: '#8b5cf6', r: 3, strokeWidth: 2 }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-white/70 leading-relaxed">
                    <span className="text-primary font-bold">Insight:</span> Se mantiver o ritmo, seu Life Score chegará a <span className="text-white font-bold">{forecast[forecast.length - 1]?.lifeScore}%</span> ({forecast[forecast.length - 1]?.score} XP) nos próximos 7 dias.
                </p>
            </div>
        </div>
    );
};
