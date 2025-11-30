import { useState } from 'react';
import { Plus, Book, Zap } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/Button';
import { useJournal } from '@/hooks/useJournal';
import { useAI } from '@/hooks/useAI';
import { JournalEditor } from './components/JournalEditor';
import { EmptyState } from '@/components/ui/EmptyState';
import type { JournalEntry } from '@/shared/types';

export default function JournalPage() {
    const { entries, isLoading, createEntry, updateEntry } = useJournal();
    const { generateSummary } = useAI();

    // State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
    const [summary, setSummary] = useState<string[] | null>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

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
                                className="gap-2"
                            >
                                <Zap size={18} className={isGeneratingSummary ? "animate-pulse" : ""} />
                                {isGeneratingSummary ? 'PROCESSANDO...' : 'RESUMO IA'}
                            </Button>
                            <Button onClick={() => setIsEditorOpen(true)} className="gap-2">
                                <Plus size={18} />
                                NOVA ENTRADA
                            </Button>
                        </div>
                    )
                }
            />

            {isEditorOpen ? (
                    <JournalEditor
                    entry={selectedEntry}
                    onSave={handleSave}
                    onCancel={() => {
                        setIsEditorOpen(false);
                        setSelectedEntry(undefined);
                    }}
                />
            ) : (
                <>
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
                                    {entries.map((entry: JournalEntry) => (
                                        <div
                                            key={entry.id}
                                            className="p-4 bg-card rounded border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                                            onClick={() => {
                                                setSelectedEntry(entry);
                                                setIsEditorOpen(true);
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-primary font-bold">
                                                        {new Date(entry.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {/* mood removido do tipo JournalEntry */}
                                            </div>
                                            <div className="font-mono text-foreground line-clamp-2">
                                                {entry.content}
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {entry.tags?.map((tag: string) => (
                                                    <span key={tag} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {summary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card border border-primary/20 p-6 rounded-lg max-w-lg w-full">
                        <h3 className="font-bold font-mono text-lg mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-primary" />
                            RESUMO DO DIA
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm font-mono text-muted-foreground mb-6">
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
