import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { LifeScore } from '@/shared/types';
import { cn } from '@/shared/lib/cn';

interface AttributeRadarProps {
    lifeScore: LifeScore | null;
    isLoading?: boolean;
    className?: string; // Add className prop
}

const ATTRIBUTE_LABELS: Record<string, string> = {
    'BODY': 'Corpo',
    'MIND': 'Mente',
    'SPIRIT': 'Espírito',
    'OUTPUT': 'Output'
};

const ATTRIBUTE_COLORS: Record<string, string> = {
    'BODY': '#10b981', // emerald-500
    'MIND': '#0ea5e9', // sky-500
    'SPIRIT': '#a855f7', // purple-500
    'OUTPUT': '#f59e0b', // amber-500
};

export function AttributeRadar({ lifeScore, isLoading, className }: AttributeRadarProps) { // Accept className
    if (isLoading || !lifeScore || !lifeScore.attributes) {
        return (
            <div className={cn("w-full h-[250px] md:h-[300px] flex items-center justify-center bg-white/5 rounded-2xl animate-pulse", className)}>
                <span className="text-zinc-500 text-sm">Carregando atributos...</span>
            </div>
        );
    }

    // Transform attributes object to array for Recharts
    const data = Object.entries(lifeScore.attributes).map(([key, value]) => ({
        subject: ATTRIBUTE_LABELS[key] || key,
        A: value as number,
        fullMark: 100,
        key: key
    }));

    // Ensure strictly 4 points or handle missing?
    // Current implementation assumes keys exist.

    return (
        <div className={cn("w-full h-[250px] md:h-[300px] relative", className)}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Atributos"
                        dataKey="A"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#fff', strokeOpacity: 0.1 }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Legend / Overlay Stats */}
            <div className="absolute bottom-2 left-2 flex flex-col gap-1 pointer-events-none">
                {data.map((item) => (
                    <div key={item.key} className="flex items-center gap-1.5 text-[10px]">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ATTRIBUTE_COLORS[item.key] }} />
                        <span className="text-zinc-400">{item.subject}</span>
                        <span className="text-white font-mono">{item.A}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
