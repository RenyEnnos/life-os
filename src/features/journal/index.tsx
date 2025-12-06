import { useState, useEffect } from 'react';
import { Plus, Book, Zap, Calendar } from 'lucide-react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { useJournal } from '@/features/journal/hooks/useJournal';
import { useAI } from '@/hooks/useAI';
import { JournalEditor } from './components/JournalEditor';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { JournalEntry } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function JournalPage() {
    const { entries, isLoading, createEntry, updateEntry } = useJournal();
    const { generateSummary } = useAI();

    // State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
    const [summary, setSummary] = useState<string[] | null>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

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
        if (selectedEntry) {
            await updateEntry.mutateAsync({ id: selectedEntry.id, updates: data });
        } else {
            await createEntry.mutateAsync(data);
        }
        setIsEditorOpen(false);
        setSelectedEntry(undefined);
    };


    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="DIÁRIO"
                subtitle="Logs diários e reflexões."
                action={
                    !isEditorOpen && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleGenerateSummary}
                                disabled={isGeneratingSummary || !entries?.length}
                                className="gap-2 border-primary/20 hover:bg-primary/10"
                            >
                                <Zap size={18} className={isGeneratingSummary ? "animate-pulse" : ""} />
                                {isGeneratingSummary ? 'PROCESSANDO...' : 'RESUMO IA'}
                            </Button>
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
                                    <div className="grid gap-4">
                                        {entries.map((entry: JournalEntry, index: number) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={entry.id}
                                                className="p-6 glass-panel rounded-xl hover:border-primary/50 transition-all cursor-pointer group hover:-translate-y-1"
                                                onClick={() => {
                                                    setSelectedEntry(entry);
                                                    setIsEditorOpen(true);
                                                }}
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
                                            </motion.div>
                                        ))}
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
    );
}
