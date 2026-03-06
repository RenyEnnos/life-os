import { useMemo } from 'react';
import { Card, Title, Text, Tracker, Flex, Color } from "@tremor/react";
import { subDays, eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HabitLog } from '@/features/habits/types';
import { Activity } from 'lucide-react';

interface HabitContributionGraphProps {
    logs: HabitLog[];
    className?: string;
}

interface TrackerData {
    color: Color;
    tooltip: string;
}

export const HabitContributionGraph = ({ logs, className }: HabitContributionGraphProps) => {
    // Generate last 30 days for the Tracker
    const days = useMemo(() => {
        const today = new Date();
        const start = subDays(today, 29); // Last 30 days
        return eachDayOfInterval({ start, end: today });
    }, []);

    const trackerData: TrackerData[] = useMemo(() => {
        const getActivityLevel = (date: Date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayLogs = logs.filter(l => l.date.startsWith(dateStr) && l.value > 0);
            return dayLogs.length;
        };

        return days.map(day => {
            const count = getActivityLevel(day);
            let color: Color = "zinc";
            
            if (count > 0 && count <= 2) color = "blue";
            else if (count > 2 && count <= 4) color = "indigo";
            else if (count > 4) color = "violet";

            return {
                color,
                tooltip: `${format(day, "d 'de' MMMM", { locale: ptBR })}: ${count} hábitos concluídos`
            };
        });
    }, [days, logs]);

    return (
        <Card className={className}>
            <Flex justifyContent="start" className="space-x-2">
                <Activity className="text-zinc-400" size={20} />
                <Title>Consistência de Hábitos</Title>
            </Flex>
            <Text className="mt-2 text-zinc-400">Atividade nos últimos 30 dias</Text>
            
            <div className="mt-6">
                <Tracker data={trackerData} className="mt-2" />
            </div>

            <Flex justifyContent="between" className="mt-4 text-xs font-mono text-zinc-500">
                <span>{format(days[0], "d 'de' MMM", { locale: ptBR })}</span>
                <span>{format(days[days.length - 1], "d 'de' MMM", { locale: ptBR })}</span>
            </Flex>
            
            <Flex justifyContent="end" className="mt-4 space-x-4">
                <Flex justifyContent="start" className="space-x-1.5">
                    <div className="h-2 w-2 rounded-full bg-zinc-500" />
                    <Text className="text-xs">Nenhum</Text>
                </Flex>
                <Flex justifyContent="start" className="space-x-1.5">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <Text className="text-xs">1-2</Text>
                </Flex>
                <Flex justifyContent="start" className="space-x-1.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <Text className="text-xs">3-4</Text>
                </Flex>
                <Flex justifyContent="start" className="space-x-1.5">
                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                    <Text className="text-xs">5+</Text>
                </Flex>
            </Flex>
        </Card>
    );
};
