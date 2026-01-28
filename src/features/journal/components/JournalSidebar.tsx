import { cn } from '@/shared/lib/cn';

interface Cluster {
    label: string;
    count: number;
    color: string;
}

interface RecentActivity {
    text: string;
    time: string;
}

interface JournalSidebarProps {
    clusters: Cluster[];
    recent: RecentActivity[];
    onNewEntry: () => void;
}

export function JournalSidebar({ clusters, recent, onNewEntry }: JournalSidebarProps) {
    return (
        <aside className="hidden lg:block w-72 h-fit sticky top-6">
            <div className="bg-zinc-900/10 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
                {/* Neural Clusters */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Neural Clusters</h3>
                        <span className="material-symbols-outlined text-zinc-600 text-sm">hub</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        {clusters.length === 0 ? (
                            <p className="text-xs text-zinc-600 italic">No clusters yet.</p>
                        ) : clusters.map((item) => (
                            <button
                                key={item.label}
                                className="flex items-center justify-between p-2 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all group w-full text-left"
                            >
                                <span className="flex items-center gap-3">
                                    <span className={cn('w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]', item.color)}></span>
                                    {item.label}
                                </span>
                                <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md border border-primary/10 group-hover:bg-primary/20">
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-white/5"></div>

                {/* Recent Activity */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Recent Activity</h3>
                    </div>
                    <div className="relative pl-4 border-l border-white/5 space-y-4">
                        {recent.map((item, idx) => (
                            <div className="relative" key={idx}>
                                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-600"></div>
                                <p className="text-xs text-zinc-400">{item.text}</p>
                                <span className="text-[10px] text-zinc-600">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={onNewEntry}
                className="w-full mt-4 p-3 rounded-xl border border-dashed border-white/10 text-zinc-500 text-xs uppercase tracking-wide hover:border-white/20 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
            >
                <span className="material-symbols-outlined text-[16px] group-hover:rotate-90 transition-transform">add</span>
                Nova Entrada
            </button>
        </aside>
    );
}
