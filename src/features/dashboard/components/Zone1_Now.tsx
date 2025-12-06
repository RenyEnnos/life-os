import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { motion } from 'framer-motion';

export const Zone1_Now = () => {
    return (
        <div className="col-span-12 lg:col-span-3 space-y-4">
            <h2 className="text-sm font-mono text-gray-500 tracking-widest uppercase">01 // NOW</h2>

            {/* Urgent / On Deck Card */}
            <Card className="p-4 border-l-4 border-l-primary bg-zinc-900/50 backdrop-blur">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded">URGENT</span>
                    <span className="text-xs text-gray-500 font-mono">25m</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight mb-2">Review PRD v2.2 Refactor Plan</h3>
                <p className="text-sm text-gray-400 mb-4">Focus on directory structure alignment.</p>
                <Button className="w-full text-xs" size="sm">START FOCUS</Button>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-20 flex flex-col gap-2">
                    <span>📝</span>
                    <span className="text-xs">Note</span>
                </Button>
                <Button variant="outline" size="sm" className="h-20 flex flex-col gap-2">
                    <span>⚡</span>
                    <span className="text-xs">Task</span>
                </Button>
            </div>
        </div>
    );
};
