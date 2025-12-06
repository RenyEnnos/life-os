import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ChartData {
    name: string;
    value: number;
}

interface NeonChartProps {
    title: string;
    data: ChartData[];
    type?: 'area' | 'bar';
    color?: string;
    className?: string;
}

export function NeonChart({ title, data, type = 'area', color = '#22d3ee', className }: NeonChartProps) {
    return (
        <Card className={`glass-panel border-primary/20 ${className}`}>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-400 font-mono tracking-wider uppercase">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {type === 'area' ? (
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${title})`}
                                    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                                />
                            </AreaChart>
                        ) : (
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={color}
                                    radius={[4, 4, 0, 0]}
                                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
