import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

interface ChartData {
    name: string;
    value: number;
}

interface NeonChartProps {
    title: string;
    data: ChartData[];
    color?: string;
    className?: string;
}

export function NeonChart({ title, data, color = '#8b5cf6', className }: NeonChartProps) {
    return (
        <div className={`w-full h-full flex flex-col ${className}`}>
            <h3 className="text-xs font-medium text-gray-500 font-mono tracking-widest uppercase mb-4 px-2">
                {title}
            </h3>
            <div className="flex-1 w-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="#52525b" // zinc-600
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#18181b', // zinc-900
                                border: '1px solid #27272a', // zinc-800
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                            }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#gradient-${title})`}
                            filter={`drop-shadow(0 0 6px ${color}40)`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
