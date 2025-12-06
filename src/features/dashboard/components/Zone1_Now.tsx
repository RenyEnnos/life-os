import { Button } from '@/shared/ui/Button';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { BorderBeam } from '@/shared/ui/premium/BorderBeam';
import { BentoGridItem } from '@/shared/ui/premium/BentoGrid';

export const UrgentCard = () => {
    return (
        <BentoGridItem
            className="col-span-1 row-span-2"
            header={
                <MagicCard className="p-0 overflow-hidden h-full flex flex-col justify-between" gradientColor="#ef4444">
                    <div className="p-4 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-2 z-10">
                            <span className="text-xs font-bold bg-red-500/20 text-red-500 px-2 py-1 rounded">URGENT</span>
                            <span className="text-xs text-gray-500 font-mono">25m</span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight mb-2 z-10">Review PRD v2.2 Refactor Plan</h3>
                        <p className="text-sm text-gray-400 mb-4 z-10">Focus on directory structure alignment.</p>
                        <Button className="w-full text-xs mt-auto z-10" size="sm">START FOCUS</Button>
                    </div>
                    <BorderBeam size={150} duration={10} delay={0} colorFrom="#ef4444" colorTo="#dc2626" />
                </MagicCard>
            }
        />
    );
};

export const QuickActionsCard = () => {
    return (
        <BentoGridItem
            className="col-span-1"
            header={
                <div className="grid grid-cols-2 gap-2 h-full">
                    <Button variant="outline" size="sm" className="h-full flex flex-col gap-2 bg-zinc-900/50 border-zinc-800">
                        <span>📝</span>
                        <span className="text-xs">Note</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-full flex flex-col gap-2 bg-zinc-900/50 border-zinc-800">
                        <span>⚡</span>
                        <span className="text-xs">Task</span>
                    </Button>
                </div>
            }
        />
    );
};

