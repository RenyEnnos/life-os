import { Card } from '@/shared/ui/Card';
import { UniversityUrgentWidget } from './UniversityUrgentWidget';

export const Zone3_Context = () => {
    return (
        <div className="lg:col-span-3 space-y-4">
            <h2 className="text-sm font-mono text-gray-500 tracking-widest uppercase">03 // CONTEXT</h2>

            {/* University Urgent */}
            <UniversityUrgentWidget />

            {/* Calendar / Schedule Placeholder */}
            <Card className="p-4 h-[250px] bg-zinc-900/30 border-zinc-800 hidden md:block">
                <h3 className="text-sm font-bold text-gray-400 mb-4">SCHEDULE</h3>
                <div className="space-y-3">
                    <div className="flex gap-3 text-sm">
                        <span className="text-primary font-mono">10:00</span>
                        <span className="text-white">Daily Standup</span>
                    </div>
                </div>
            </Card>

            {/* AI Insight Placeholder */}
            <Card className="p-4 bg-gradient-to-b from-purple-500/10 to-transparent border-purple-500/20">
                <h3 className="text-xs font-bold text-purple-400 mb-2">AI INSIGHT</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                    You're most productive between 09:00 and 11:00. Schedule complex tasks then.
                </p>
            </Card>
        </div>
    );
};
