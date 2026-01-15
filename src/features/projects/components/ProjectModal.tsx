import { useState, useEffect } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import type { Project } from '@/shared/types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { RefreshCw, Image as ImageIcon } from 'lucide-react';
import { apiFetch } from '@/shared/api/http';

interface ProjectModalProps {
    onClose: () => void;
    onSubmit: (project: Partial<Project>) => void;
}

export function ProjectModal({ onClose, onSubmit }: ProjectModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Project['status']>('active');
    const [priority, setPriority] = useState<Project['priority']>('medium');
    const [deadline, setDeadline] = useState('');

    // Auto-Aesthetic State
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [isLoadingCover, setIsLoadingCover] = useState(false);
    const debouncedTitle = useDebounce(title, 800);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        if (debouncedTitle && debouncedTitle.length > 3) {
            fetchCover(debouncedTitle, page);
        }
    }, [debouncedTitle, page]);

    const fetchCover = async (query: string, pageNum: number) => {
        setIsLoadingCover(true);
        try {
            const data = await apiFetch<{ images?: Array<{ coverUrl?: string }> }>(
                `/api/media/images?query=${encodeURIComponent(query)}&page=${pageNum}`
            );
            const cover = data.images?.[0]?.coverUrl;
            setCoverUrl(cover || null);
        } catch (err) {
            console.error('Failed to fetch cover', err);
        } finally {
            setIsLoadingCover(false);
        }
    };

    const handleShuffle = () => {
        setPage(p => p + 1);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <Card className="w-full max-w-md p-0 bg-background border-primary/20 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Cover Area */}
                <div className="relative h-32 w-full bg-surface-hover shrink-0 group">
                    {coverUrl ? (
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-r from-gray-900 to-gray-800">
                            <ImageIcon className="opacity-20" />
                        </div>
                    )}

                    {isLoadingCover && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => { e.preventDefault(); handleShuffle(); }}
                        aria-label="Shuffle cover image"
                    >
                        <RefreshCw size={14} />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <h3 id="project-modal-title" className="font-bold font-mono text-lg mb-4 text-primary">NOVO PROJETO</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nome do Projeto (ex: Viagem Japão)"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            aria-label="Project name"
                        />
                        <textarea
                            placeholder="Descrição e Objetivos"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono h-24 resize-none"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            aria-label="Project description"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="project-status" className="text-xs font-mono text-muted-foreground">Status</label>
                                <select
                                    id="project-status"
                                    className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono text-sm"
                                    value={status}
                                    onChange={e => setStatus(e.target.value as Project['status'])}
                                >
                                    <option value="active">Em Andamento</option>
                                    <option value="completed">Concluído</option>
                                    <option value="on_hold">Pausado</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="project-priority" className="text-xs font-mono text-muted-foreground">Prioridade</label>
                                <select
                                    id="project-priority"
                                    className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono text-sm"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value as Project['priority'])}
                                >
                                    <option value="low">Baixa</option>
                                    <option value="medium">Média</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="project-deadline" className="text-xs font-mono text-muted-foreground">Prazo (Opcional)</label>
                            <input
                                id="project-deadline"
                                type="date"
                                className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                            <Button onClick={() => {
                                onSubmit({ title, description, status, priority, deadline, cover: coverUrl || undefined });
                                onClose();
                            }} className="flex-1">CRIAR</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
