import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Course } from '../types';
import { X, Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (course: Omit<Course, 'id' | 'user_id'>) => void;
}

export function CreateCourseModal({ isOpen, onClose, onSubmit }: CreateCourseModalProps) {
    const [name, setName] = useState('');
    const [professor, setProfessor] = useState('');
    const [grade, setGrade] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [schedule, setSchedule] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            professor,
            grade: parseFloat(grade) || undefined,
            color,
            semester: '2025-1',
            schedule
        });
        // Reset form
        setName('');
        setProfessor('');
        setGrade('');
        setColor('#3b82f6');
        setSchedule('');

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <Card className="w-full max-w-md bg-zinc-950 border border-white/10 p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold font-mono text-primary mb-6 uppercase tracking-wider">Adicionar Matéria</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-zinc-500 uppercase">Nome da Matéria</label>
                        <input
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-700"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Anatomia Humana"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-zinc-500 uppercase">Professor</label>
                        <input
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-700"
                            value={professor}
                            onChange={e => setProfessor(e.target.value)}
                            placeholder="Ex: Dr. Estranho"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-zinc-500 uppercase">Horário</label>
                        <input
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-700"
                            value={schedule}
                            onChange={e => setSchedule(e.target.value)}
                            placeholder="Ex: Seg/Qua 10:00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-zinc-500 uppercase">Média Atual (Opcional)</label>
                            <input
                                type="number"
                                step="0.1"
                                max="10"
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-700"
                                value={grade}
                                onChange={e => setGrade(e.target.value)}
                                placeholder="0.0"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-zinc-500 uppercase">Etiqueta de Cor</label>
                            <div className="flex gap-2 mt-2">
                                {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={cn(
                                            "w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center",
                                            color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''
                                        )}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setColor(c)}
                                    >
                                        {color === c && <Check size={12} className="text-black/50" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-black">SALVAR</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
