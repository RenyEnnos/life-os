import { Button } from '@/shared/ui/Button';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { BorderBeam } from '@/shared/ui/premium/BorderBeam';
import { BentoGridItem } from '@/shared/ui/premium/BentoGrid';
import { NeonGradientCard } from '@/shared/ui/premium/NeonGradientCard';

export const UrgentCard = () => {
    return (
        <BentoGridItem
            className="col-span-1 row-span-2"
            header={
                <NeonGradientCard className="items-center justify-center text-center">
                    <div className="flex flex-col justify-between h-full p-4">
                        <div className="flex justify-between items-start mb-2 z-10 w-full">
                            <span className="text-xs font-bold bg-red-500/20 text-red-500 px-2 py-1 rounded">URGENT</span>
                            <span className="text-xs text-gray-500 font-mono">25m</span>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-grow z-10">
                            <h3 className="text-xl font-bold text-white leading-tight mb-2">Review PRD v2.2 Refactor Plan</h3>
                            <p className="text-sm text-gray-400 mb-4 text-center">Focus on directory structure alignment.</p>
                        </div>
                        <Button className="w-full text-xs mt-auto z-10 bg-red-600 hover:bg-red-700 text-white border-none" size="sm">START FOCUS</Button>
                    </div>
                </NeonGradientCard>
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

