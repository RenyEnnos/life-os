import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { AnalyticsDataPoint } from '../hooks/useAnalyticsData';
import { useTranslation } from 'react-i18next';

interface MetricsTrendChartProps {
    data: AnalyticsDataPoint[];
}

export function MetricsTrendChart({ data }: MetricsTrendChartProps) {
    const { t } = useTranslation();

    const formattedData = useMemo(() => {
        return data.map(d => ({
            ...d,
            displayDate: format(parseISO(d.date), 'dd/MM'),
        }));
    }, [data]);

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <div className="mb-4">
                <h3 className="font-bold text-lg">Metrics Trend</h3>
                <p className="text-xs text-white/50">Tracking habits adherence and sleep over time.</p>
            </div>
            <div className="flex-1 w-full min-h[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="displayDate"
                            stroke="rgba(255,255,255,0.2)"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            minTickGap={20}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.2)"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                backdropFilter: 'blur(8px)',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', opacity: 0.8 }} />

                        <Line
                            name="Habit Adherence (%)"
                            type="monotone"
                            dataKey="habitAdherence"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#f59e0b', stroke: '#000', strokeWidth: 2 }}
                        />
                        <Line
                            name="Sleep Score"
                            type="monotone"
                            dataKey="sleepScore"
                            stroke="#60a5fa"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#60a5fa', stroke: '#000', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
