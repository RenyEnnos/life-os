import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { BentoCard } from '@/shared/ui/BentoCard';
import { UniversityUrgentWidget } from './UniversityUrgentWidget';

export const UniversityCard = () => {
    return (
        <BentoCard
            className="col-span-1 row-span-2"
        >
            <UniversityUrgentWidget />
        </BentoCard>
    );
};

export const ScheduleCard = () => {
    return (
        <BentoCard
            className="hidden md:block col-span-1 p-0"
            noPadding
        >
            <MagicCard className="p-4 flex flex-col justify-center h-full w-full" gradientColor="#a855f7">
                <h3 className="text-sm font-bold text-gray-400 mb-4 z-10">SCHEDULE</h3>
                <div className="space-y-3 z-10">
                    <div className="flex gap-3 text-sm">
                        <span className="text-primary font-mono">10:00</span>
                        <span className="text-white">Daily Standup</span>
                    </div>
                </div>
            </MagicCard>
        </BentoCard>
    );
};

export const AiInsightCard = () => {
    return (
        <BentoCard
            className="col-span-1 p-0"
            noPadding
        >
            <MagicCard className="p-4 flex flex-col justify-center h-full w-full" gradientColor="#6e56cf">
                <h3 className="text-xs font-bold text-purple-400 mb-2 z-10">AI INSIGHT</h3>
                <p className="text-xs text-gray-300 leading-relaxed z-10">
                    You're most productive between 09:00 and 11:00. Schedule complex tasks then.
                </p>
            </MagicCard>
        </BentoCard>
    );
};

