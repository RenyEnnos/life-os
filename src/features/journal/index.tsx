import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useJournal } from '@/features/journal/hooks/useJournal';
import type { JournalEntry } from '@/shared/types';
import { cn } from '@/shared/lib/cn';

const profileAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqcPWDT3hPr01e2HDirC5oJIReGS_I9VQWtVcd9Jeg7-ZvWFgDQfCv6EutPiYTzuE-re3TH5gEjialXzk5Eb8SJ3m82eLKwBuKSLDpWKr4JkJ_yftg1ioQEeRmNNBPiKJhA7IAj11REAjyt_eN6G3ka3T_PoSQNNU9d7cQ6Af9A6u-pdRHLfzCaPzGvoxAzXj6ge63w7ZFJhPW4J6cxpsTQe-UV2JJuJ124QPZ8DgIYXHP4uJji-EBFIe1WQsTDEKAGbz-RlcuI";

const materialIconByPath: Record<string, string> = {
    '/': 'grid_view',
    '/tasks': 'check_circle',
    '/calendar': 'calendar_month',
    '/habits': 'timer',
    '/health': 'monitor_heart',
    '/finances': 'show_chart',
    '/projects': 'folder_open',
    '/journal': 'psychology',
    '/rewards': 'emoji_events',
    '/university': 'school',
    '/settings': 'settings',
};

type MemoryCard = {
    id: string;
    title: string;
    excerpt: string;
    type: 'Insight' | 'Bookmark' | 'Journal' | 'Inspiration' | 'Voice';
    tags: string[];
    media?: string;
    timestamp?: string;
};

const typeStyle: Record<MemoryCard['type'], { icon: string; color: string }> = {
    Insight: { icon: 'lightbulb', color: 'text-amber-500/80' },
    Bookmark: { icon: 'link', color: 'text-purple-400/80' },
    Journal: { icon: 'article', color: 'text-blue-400/80' },
    Inspiration: { icon: 'favorite', color: 'text-pink-400/80' },
    Voice: { icon: 'mic', color: 'text-emerald-400/80' },
};

function mapEntriesToCards(entries: JournalEntry[], label: MemoryCard['type']): MemoryCard[] {
    return entries.map((entry) => ({
        id: entry.id,
        title: entry.title || entry.entry_date,
        excerpt: entry.content || '',
        type: label,
        tags: entry.tags || [],
        timestamp: entry.entry_date,
    }));
}

 

export default function JournalPage() {
    const { entries, isLoading } = useJournal();

    const today = new Date();
    const todayKey = today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = yesterday.toDateString();

    const { todayCards, yesterdayCards } = useMemo(() => {
        if (!entries?.length) {
            return { todayCards: [], yesterdayCards: [] };
        }
        const todayEntries = entries.filter((e) => new Date(e.entry_date).toDateString() === todayKey);
        const yEntries = entries.filter((e) => new Date(e.entry_date).toDateString() === yesterdayKey);
        return {
            todayCards: mapEntriesToCards(todayEntries, 'Journal'),
            yesterdayCards: mapEntriesToCards(yEntries, 'Journal'),
        };
    }, [entries, todayKey, yesterdayKey]);

    const renderCard = (card: MemoryCard) => {
        const style = typeStyle[card.type];
        const hasMedia = !!card.media;
        return (
            <article
                key={card.id}
                className={cn(
                    "group flex flex-col gap-3 p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/20 hover:bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] cursor-pointer",
                    hasMedia && "md:flex-row"
                )}
            >
                {hasMedia && (
                    <div className="w-full md:w-48 h-32 rounded-lg bg-zinc-800 border border-white/5 overflow-hidden relative shrink-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity grayscale hover:grayscale-0 duration-500"
                            style={{ backgroundImage: `url('${card.media}')` }}
                        />
                    </div>
                )}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn("material-symbols-outlined text-sm", style.color)}>{style.icon}</span>
                        <span className={cn("text-xs font-medium", style.color)}>{card.type}</span>
                    </div>
                    <h4 className="text-zinc-200 font-display font-medium text-lg leading-tight group-hover:text-primary transition-colors">{card.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{card.excerpt}</p>
                    <div className="flex gap-2 mt-auto pt-2 flex-wrap">
                        {card.tags.map((tag) => (
                            <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-zinc-400 border border-white/5 group-hover:border-white/10">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        );
    };

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
            <div className="fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[0%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">
                {/* Sidebar Navigation removed - using global AppLayout Sidebar */}
                <main className="flex-1 h-full overflow-hidden flex flex-col relative custom-scrollbar">
                    <div className="flex-1 overflow-y-auto w-full relative z-0 scroll-smooth">
                        <div className="max-w-7xl mx-auto px-4 lg:px-12 py-8 lg:py-12 flex flex-col min-h-full">

                            <section className="flex flex-col items-center justify-center w-full mb-12 lg:sticky lg:top-4 z-40 transition-all">
                                <div className="w-full max-w-2xl relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center h-14 w-full bg-zinc-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 ring-1 ring-primary/50 shadow-[0_0_40px_rgba(48,140,232,0.15)] transition-all">
                                        <span className="material-symbols-outlined text-primary/80 ml-4 mr-3 animate-pulse">spark</span>
                                        <input
                                            className="w-full bg-transparent border-none text-zinc-200 placeholder-zinc-500 focus:ring-0 text-lg font-light h-full rounded-2xl"
                                            placeholder="Ask your second brain or type a thought..."
                                            type="text"
                                        />
                                        <div className="hidden sm:flex items-center gap-2 mr-4 text-xs text-zinc-600 border border-white/5 rounded-lg px-2 py-1 bg-white/5">
                                            <span className="material-symbols-outlined text-[14px]">keyboard_command_key</span>
                                            <span>K</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:hidden w-full overflow-x-auto no-scrollbar mt-6 flex gap-3 pb-2">
                                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/20 text-xs font-medium">All Memories</button>
                                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-900/40 text-zinc-400 border border-white/10 text-xs hover:bg-white/5">Insights</button>
                                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-900/40 text-zinc-400 border border-white/10 text-xs hover:bg-white/5">Journal</button>
                                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-900/40 text-zinc-400 border border-white/10 text-xs hover:bg-white/5">Bookmarks</button>
                                </div>
                            </section>

                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1">
                                <div className="flex-1 flex flex-col gap-10">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <h3 className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Today</h3>
                                            <span className="text-zinc-700 text-xs">{formatDate(today)}</span>
                                        </div>
                                        {todayCards.length === 0 ? (
                                            <div className="w-full py-8 rounded-xl border border-dashed border-white/5 text-zinc-500 text-sm">
                                                Sem entradas para hoje.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {todayCards.map(renderCard)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <h3 className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Yesterday</h3>
                                            <span className="text-zinc-700 text-xs">{formatDate(yesterday)}</span>
                                        </div>
                                        {yesterdayCards.length === 0 ? (
                                            <div className="w-full py-8 rounded-xl border border-dashed border-white/5 text-zinc-500 text-sm">
                                                Sem entradas de ontem.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {yesterdayCards.map(renderCard)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <aside className="hidden lg:block w-72 h-fit sticky top-6">
                                    <div className="bg-zinc-900/10 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Neural Clusters</h3>
                                                <span className="material-symbols-outlined text-zinc-600 text-sm">hub</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {[{ label: 'Productivity', color: 'bg-blue-500/50', count: 42 }, { label: 'Design Systems', color: 'bg-emerald-500/50', count: 18 }, { label: 'Philosophy', color: 'bg-purple-500/50', count: 12 }, { label: 'AI Research', color: 'bg-amber-500/50', count: 8 }].map((item) => (
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
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Recent Activity</h3>
                                            </div>
                                            <div className="relative pl-4 border-l border-white/5 space-y-4">
                                                {[
                                                    { text: 'Added "Rust Guide" to #dev', time: '2h ago' },
                                                    { text: 'Created new cluster Minimalism', time: '5h ago' },
                                                ].map((item) => (
                                                    <div className="relative" key={item.text}>
                                                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-600"></div>
                                                        <p className="text-xs text-zinc-400">{item.text}</p>
                                                        <span className="text-[10px] text-zinc-600">{item.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 p-3 rounded-xl border border-dashed border-white/10 text-zinc-500 text-xs uppercase tracking-wide hover:border-white/20 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
                                        <span className="material-symbols-outlined text-[16px] group-hover:rotate-90 transition-transform">add</span>
                                        Connect Source
                                    </button>
                                </aside>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
}
