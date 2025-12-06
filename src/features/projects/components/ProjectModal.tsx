import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/shared/types';

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">NOVO PROJETO</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome do Projeto"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Descrição e Objetivos"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono h-24 resize-none"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-muted-foreground">Status</label>
                            <select
                                className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono text-sm"
                                value={status}
                                onChange={e => setStatus(e.target.value as any)}
                            >
                                <option value="active">Em Andamento</option>
                                <option value="completed">Concluído</option>
                                <option value="on_hold">Pausado</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-muted-foreground">Prioridade</label>
                            <select
                                className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono text-sm"
                                value={priority}
                                onChange={e => setPriority(e.target.value as any)}
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-muted-foreground">Prazo (Opcional)</label>
                        <input
                            type="date"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ title, description, status, priority, deadline });
                            onClose();
                        }} className="flex-1">CRIAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
