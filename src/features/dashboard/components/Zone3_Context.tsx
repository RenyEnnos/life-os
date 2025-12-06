import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { BentoGridItem } from '@/shared/ui/premium/BentoGrid';
import { UniversityUrgentWidget } from './UniversityUrgentWidget';

export const UniversityCard = () => {
    return (
        <BentoGridItem
            className="col-span-1 row-span-2"
            header={<UniversityUrgentWidget />}
        />
    );
};

export const ScheduleCard = () => {
    return (
        <BentoGridItem
            className="hidden md:block col-span-1"
            header={
                <MagicCard className="p-4 flex flex-col justify-center h-full" gradientColor="#a855f7">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 z-10">SCHEDULE</h3>
                    <div className="space-y-3 z-10">
                        <div className="flex gap-3 text-sm">
                            <span className="text-primary font-mono">10:00</span>
                            <span className="text-white">Daily Standup</span>
                        </div>
                    </div>
                </MagicCard>
            }
        />
    );
};

export const AiInsightCard = () => {
    return (
        <BentoGridItem
            className="col-span-1"
            header={
                <MagicCard className="p-4 flex flex-col justify-center h-full" gradientColor="#6e56cf">
                    <h3 className="text-xs font-bold text-purple-400 mb-2 z-10">AI INSIGHT</h3>
                    <p className="text-xs text-gray-300 leading-relaxed z-10">
                        You're most productive between 09:00 and 11:00. Schedule complex tasks then.
                    </p>
                </MagicCard>
            }
        />
    );
};

