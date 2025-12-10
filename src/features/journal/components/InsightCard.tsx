import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity } from 'lucide-react';
import type { JournalInsightContent } from '@/shared/types';
import { Tag } from '@/shared/ui/Tag';

interface InsightCardProps {
    content: JournalInsightContent;
}

export function InsightCard({ content }: InsightCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-xl border border-white/5 bg-black/40 backdrop-blur-xl p-6 shadow-2xl"
        >
            {/* Ambient Glow */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-secondary/20 blur-[100px]" />

            <div className="relative z-10 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-primary/80">
                        <BrainCircuit size={18} />
                        <span className="font-mono text-xs uppercase tracking-widest">Neural Resonance</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-white/40" />
                        <span className="font-mono text-2xl font-bold text-white glow-text">
                            {content.mood_score}<span className="text-sm text-white/30">/10</span>
                        </span>
                    </div>
                </div>

                {/* Sentiment & Advice */}
                <div className="space-y-4 py-2">
                    <div>
                        <h4 className="mb-1 text-xs font-medium text-white/40 uppercase">Sentiment</h4>
                        <p className="text-lg text-white/90 font-light leading-relaxed">
                            "{content.sentiment}"
                        </p>
                    </div>

                    <div className="rounded-lg bg-white/5 p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <Sparkles size={14} />
                            <span className="text-xs font-mono uppercase tracking-wider">Nexus Advice</span>
                        </div>
                        <p className="text-sm text-gray-300 italic">
                            {content.advice}
                        </p>
                    </div>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {content.keywords.map((keyword, i) => (
                        <Tag key={i} variant="outline" className="text-xs border-white/10 text-white/60">
                            #{keyword}
                        </Tag>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
