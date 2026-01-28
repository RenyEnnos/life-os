import { useMemo, useState } from 'react';
import { useJournal } from '@/features/journal/hooks/useJournal';
import { JournalEditor } from '@/features/journal/components/JournalEditor';
import { MemoryCardComponent, mapEntriesToCards, type MemoryCard } from '@/features/journal/components/MemoryCard';
import { JournalSidebar } from '@/features/journal/components/JournalSidebar';
import { Modal } from '@/shared/ui/Modal';
import type { JournalEntry } from '@/shared/types';

const CLUSTER_COLORS = ['bg-blue-500/50', 'bg-emerald-500/50', 'bg-purple-500/50', 'bg-amber-500/50', 'bg-pink-500/50'];

function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return diffInHours < 24 ? `${diffInHours}h ago` : `${Math.floor(diffInHours / 24)}d ago`;
}

export default function JournalPage() {
    const { entries, createEntry, updateEntry } = useJournal();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);

    const today = new Date();
    const todayKey = today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = yesterday.toDateString();

    const { todayCards, yesterdayCards } = useMemo(() => {
        if (!entries?.length) return { todayCards: [], yesterdayCards: [] };

        const todayEntries = entries.filter((e) => new Date(e.entry_date).toDateString() === todayKey);
        const yEntries = entries.filter((e) => new Date(e.entry_date).toDateString() === yesterdayKey);

        return {
            todayCards: mapEntriesToCards(todayEntries, 'Journal'),
            yesterdayCards: mapEntriesToCards(yEntries, 'Journal'),
        };
    }, [entries, todayKey, yesterdayKey]);

    const sidebarData = useMemo(() => {
        if (!entries?.length) return { clusters: [], recent: [] };

        const tagCounts = new Map<string, number>();
        entries.forEach(entry => {
            entry.tags?.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        const clusters = Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([label, count], index) => ({
                label,
                count,
                color: CLUSTER_COLORS[index % CLUSTER_COLORS.length]
            }));

        const sortedEntries = [...entries].sort((a, b) =>
            new Date(b.created_at || b.entry_date).getTime() - new Date(a.created_at || a.entry_date).getTime()
        );

        const recent = sortedEntries.slice(0, 3).map(entry => ({
            text: `New entry: "${entry.title || 'Untitled'}"`,
            time: formatRelativeTime(new Date(entry.created_at || entry.entry_date))
        }));

        return { clusters, recent };
    }, [entries]);

    const handleSaveEntry = async (data: Partial<JournalEntry>) => {
        try {
            if (selectedEntry?.id) {
                await updateEntry.mutateAsync({ id: selectedEntry.id, updates: data });
            } else {
                await createEntry.mutateAsync(data);
            }
            setIsEditorOpen(false);
            setSelectedEntry(undefined);
        } catch (error) {
            console.error("Failed to save entry", error);
        }
    };

    const handleNewEntry = () => {
        setSelectedEntry(undefined);
        setIsEditorOpen(true);
    };

    const handleCardClick = (card: MemoryCard) => {
        const entry = entries?.find(e => e.id === card.id);
        if (entry) {
            setSelectedEntry(entry);
            setIsEditorOpen(true);
        }
    };

    const renderCardSection = (title: string, date: Date, cards: MemoryCard[], emptyMessage: string) => (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <h3 className="text-zinc-500 text-sm font-medium tracking-widest uppercase">{title}</h3>
                <span className="text-zinc-700 text-xs">{formatDate(date)}</span>
            </div>
            {cards.length === 0 ? (
                <div className="w-full py-8 rounded-xl border border-dashed border-white/5 text-zinc-500 text-sm">
                    {emptyMessage}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map(card => (
                        <MemoryCardComponent key={card.id} card={card} onClick={handleCardClick} />
                    ))}
                </div>
            )}
        </div>
    );

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
                                            className="w-full bg-transparent border-none text-zinc-200 placeholder-zinc-500 focus:ring-0 text-lg font-light h-full rounded-2xl cursor-pointer"
                                            placeholder="Ask your second brain or type a thought..."
                                            type="text"
                                            onClick={handleNewEntry}
                                            readOnly
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
                                    {renderCardSection("Today", today, todayCards, "Sem entradas para hoje.")}
                                    {renderCardSection("Yesterday", yesterday, yesterdayCards, "Sem entradas de ontem.")}
                                </div>

                                <JournalSidebar
                                    clusters={sidebarData.clusters}
                                    recent={sidebarData.recent}
                                    onNewEntry={handleNewEntry}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Modal
                open={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                title={selectedEntry ? "Editar Entrada" : "Nova Entrada"}
                className="w-full h-full max-w-none md:max-w-4xl md:h-[85vh] p-0 md:p-6 rounded-none md:rounded-3xl"
                contentClassName="p-0 md:p-6"
            >
                <JournalEditor
                    entry={selectedEntry}
                    onSave={handleSaveEntry}
                    onCancel={() => setIsEditorOpen(false)}
                />
            </Modal>
        </div>
    );
}

