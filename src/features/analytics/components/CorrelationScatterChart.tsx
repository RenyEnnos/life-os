import { useMemo } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
    Cell
} from 'recharts';
import { AnalyticsDataPoint } from '../hooks/useAnalyticsData';
import { format, parseISO } from 'date-fns';

interface CorrelationScatterChartProps {
    data: AnalyticsDataPoint[];
}

export function CorrelationScatterChart({ data }: CorrelationScatterChartProps) {

    const validData = useMemo(() => {
        // We only plot points that have both productivity and sleep score
        return data
            .filter(d => typeof d.productivity === 'number' && typeof d.sleepScore === 'number' && d.productivity > 0)
            .map(d => ({
                ...d,
                displayDate: format(parseISO(d.date), 'MMM dd')
            }));
    }, [data]);

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <div className="mb-4">
                <h3 className="font-bold text-lg">Productivity vs Sleep Score</h3>
                <p className="text-xs text-white/50">Scatter plot showing the correlation between completed tasks and tracked sleep.</p>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
                {validData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-white/30 text-sm">
                        Not enough overlapping data pairs (Tasks + Sleep).
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                type="number"
                                dataKey="sleepScore"
                                name="Sleep Score"
                                stroke="rgba(255,255,255,0.2)"
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="productivity"
                                name="Completed Tasks"
                                stroke="rgba(255,255,255,0.2)"
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            />
                            <ZAxis type="category" dataKey="displayDate" name="Date" />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Scatter name="Correlation" data={validData} fill="#c084fc">
                                {validData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={'#c084fc'} fillOpacity={0.6} className="hover:fillOpacity-100 transition-opacity" />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
