import { useState } from 'react';
import { NotebookPen, Save, Plus } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import { useDashboardIdentity } from '@/features/dashboard/hooks/useDashboardIdentity';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '@/features/journal/api/journal.api';
import type { JournalEntry } from '@/shared/types';
import { cn } from '@/shared/lib/cn';
import { useUIStore } from '@/shared/stores/uiStore';

export function JournalWidget() {
    const { user } = useDashboardIdentity();
    const qc = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
        queryKey: ['journal', user?.id],
        queryFn: () => journalApi.list(user?.id),
        enabled: !!user
    });

    const createJournal = useMutation({
        mutationFn: () => journalApi.create({
            title: title || 'Entrada rápida',
            content,
            entry_date: new Date().toISOString().split('T')[0]
        }),
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['journal', user?.id] });
            setTitle('');
            setContent('');
            setIsAdding(false);
        }
    });

    return (
        <WidgetShell
            title="Journal"
            subtitle="Reflexões"
            icon={<NotebookPen size={18} className="text-pink-400" />}
            className="h-full min-h-[320px]"
            action={
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                    <Plus size={18} className={cn("transition-transform", isAdding && "rotate-45")} />
                </button>
            }
        >
            {isAdding ? (
                <div className="flex flex-col h-full gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <input
                        placeholder="Título (opcional)"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-white/20 outline-none"
                    />
                    <textarea
                        placeholder="Escreva sua reflexão..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-white/20 outline-none resize-none"
                        autoFocus
                    />
                    <button
                        disabled={!content.trim() || createJournal.isPending}
                        onClick={() => createJournal.mutate()}
                        className="inline-flex items-center justify-center gap-2 bg-white text-black font-medium py-2 rounded-lg text-sm hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                    >
                        <Save size={14} />
                        {createJournal.isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col h-full gap-2 overflow-y-auto custom-scrollbar pr-1">
                    {isLoading && <p className="text-xs text-zinc-500">Carregando...</p>}
                    {!isLoading && entries.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2 border border-dashed border-white/10 rounded-xl m-2">
                            <span className="text-xs">Nenhuma entrada recente</span>
                            <button onClick={() => setIsAdding(true)} className="text-xs text-primary hover:underline">Escrever agora</button>
                        </div>
                    )}
                    {entries.slice(0, 5).map(entry => (
                        <div
                            key={entry.id}
                            onClick={() => useUIStore.getState().openModal('journal', entry)}
                            className="group p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer"
                        >
                            <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{entry.title || 'Sem título'}</h4>
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{entry.content}</p>
                            <span className="text-[10px] text-zinc-600 mt-2 block">{new Date(entry.entry_date).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </WidgetShell>
    );
}
