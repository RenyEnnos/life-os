import { useState, useEffect, useRef } from 'react';
import { Plus, Book, Zap, Calendar } from 'lucide-react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { useJournal } from '@/features/journal/hooks/useJournal';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { JournalEditor } from './components/JournalEditor';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ResonancePanel } from './components/resonance';
import type { JournalEntry } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { ShimmerButton } from '@/shared/ui/premium/ShimmerButton';

export default function JournalPage() {
    const { entries, isLoading, createEntry, updateEntry } = useJournal();
    const { generateSummary } = useAI();

    // State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
    const [summary, setSummary] = useState<string[] | null>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    // Refs for animations
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setIsEditorOpen(true);
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    // Handlers
    const handleGenerateSummary = async () => {
        if (!entries || entries.length === 0) {
            alert('Nenhuma entrada para resumir.');
            return;
        }
        setIsGeneratingSummary(true);
        try {
            const context = entries.map((e: JournalEntry) => `${e.entry_date}: ${e.content}`).join('\n\n');
            const result = await generateSummary.mutateAsync({ context });
            if (result.summary) {
                setSummary(result.summary);
            }
        } catch (error) {
            console.error('Failed to generate summary', error);
            alert('Falha ao gerar resumo.');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleSave = async (data: Partial<JournalEntry>) => {
        try {
            let savedId: string | undefined;

            if (selectedEntry) {
                await updateEntry.mutateAsync({ id: selectedEntry.id, updates: data });
                savedId = selectedEntry.id;
            } else {
                const newEntry = await createEntry.mutateAsync(data);
                savedId = newEntry?.id; // Assuming createEntry returns the object
            }

            setIsEditorOpen(false);
            setSelectedEntry(undefined);

            // Trigger Neural Resonance Analysis
            if (savedId) {
                import('./hooks/useJournalInsights').then(({ triggerJournalAnalysis }) => {
                    triggerJournalAnalysis(savedId!);
                });
            }
        } catch (error) {
            console.error('Failed to save entry:', error);
            alert('Falha ao salvar entrada. Verifique se você está logado.');
        }
    };


    return (
        <div className="flex gap-6 pb-20">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
                <PageTitle
                    title="MEMÓRIA"
                    subtitle="Logs diários e reflexões."
                    action={
                        !isEditorOpen && (
                            <div className="flex gap-2">
                                <ShimmerButton
                                    onClick={handleGenerateSummary}
                                    disabled={isGeneratingSummary || !entries?.length}
                                    className="h-10 text-xs gap-2"
                                    background="rgba(0,0,0,0.5)"
                                    shimmerColor="#A07CFE"
                                >
                                    <Zap size={16} className={isGeneratingSummary ? "animate-pulse" : ""} />
                                    {isGeneratingSummary ? 'PROCESSANDO...' : 'RESUMO IA'}
                                </ShimmerButton>
                                <Button onClick={() => setIsEditorOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
                                    <Plus size={18} />
                                    NOVA ENTRADA
                                </Button>
                            </div>
                        )
                    }
                />

                <AnimatePresence mode="wait">
                    {isEditorOpen ? (
                        <JournalEditor
                            key="editor"
                            entry={selectedEntry}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsEditorOpen(false);
                                setSelectedEntry(undefined);
                            }}
                        />
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {isLoading ? (
                                <div className="text-center py-20 text-muted-foreground font-mono animate-pulse">
                                    CARREGANDO LOGS...
                                </div>
                            ) : (
                                <>
                                    {!entries?.length ? (
                                        <EmptyState
                                            icon={Book}
                                            title="SEM LOGS"
                                            description="Nenhum registro encontrado. Inicie o log do dia."
                                            action={
                                                <Button onClick={() => setIsEditorOpen(true)} className="gap-2">
                                                    <Plus size={16} /> NOVA ENTRADA
                                                </Button>
                                            }
                                        />
                                    ) : (
                                        <div className="grid gap-4" ref={listRef}>
                                            <AnimatePresence>
                                                {entries.map((entry: JournalEntry, index: number) => (
                                                    <motion.div
                                                        key={entry.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        onClick={() => {
                                                            setSelectedEntry(entry);
                                                            setIsEditorOpen(true);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <MagicCard
                                                            className="p-6 transition-all hover:-translate-y-1"
                                                            gradientColor="#A07CFE"
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                                        <Calendar size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-mono text-sm text-primary font-bold">
                                                                            {new Date(entry.created_at).toLocaleDateString()}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 font-mono">
                                                                            {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {entry.title && (
                                                                    <span className="text-sm font-bold text-gray-300 bg-white/5 px-3 py-1 rounded-full">
                                                                        {entry.title}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="font-mono text-gray-300 line-clamp-2 pl-12 border-l-2 border-white/10 group-hover:border-primary/50 transition-colors">
                                                                {entry.content}
                                                            </div>
                                                            <div className="flex gap-2 mt-4 pl-12">
                                                                {entry.tags?.map((tag: string) => (
                                                                    <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded uppercase tracking-wider">
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </MagicCard>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {summary && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="glass-panel border-primary/20 p-6 rounded-xl max-w-lg w-full">
                            <h3 className="font-bold font-mono text-lg mb-4 flex items-center gap-2 text-white">
                                <Zap size={20} className="text-primary" />
                                RESUMO DO DIA
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-sm font-mono text-gray-300 mb-6">
                                {summary.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <Button onClick={() => setSummary(null)} className="w-full">FECHAR</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Neural Resonance Sidebar */}
            {!isEditorOpen && entries && entries.length > 0 && (
                <aside className="hidden lg:block w-64 shrink-0">
                    <ResonancePanel
                        entryId={selectedEntry?.id}
                        showWeekly={true}
                    />
                </aside>
            )}
        </div>
    );
}
