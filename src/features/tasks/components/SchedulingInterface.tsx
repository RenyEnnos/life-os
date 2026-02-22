import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Modal from '@/shared/ui/Modal';
import { useScheduling } from '../hooks/useScheduling';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Check from 'lucide-react/dist/esm/icons/check';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { Loader } from '@/shared/ui/Loader';
import { cn } from '@/shared/lib/cn';

interface SchedulingInterfaceProps {
    open: boolean;
    onClose: () => void;
}

export const SchedulingInterface: React.FC<SchedulingInterfaceProps> = ({ open, onClose }) => {
    const { getSuggestions, applySchedule } = useScheduling();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [bufferTime, setBufferTime] = useState(15);

    const { data: suggestions, isLoading, isError, refetch } = getSuggestions(selectedDate, bufferTime);

    // Trigger fetch when modal opens or date changes
    React.useEffect(() => {
        if (open) {
            refetch();
        }
    }, [open, selectedDate, refetch]);

    const handleApply = async () => {
        if (!suggestions) return;
        await applySchedule.mutateAsync(suggestions);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Magical Schedule (IA)"
            className="max-w-2xl"
        >
            <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Data do Planejamento</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-primary/50 transition-all font-sans"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Intervalo (Buffer)</label>
                        <select
                            value={bufferTime}
                            onChange={(e) => setBufferTime(parseInt(e.target.value))}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-primary/50 transition-all cursor-pointer font-sans"
                        >
                            <option value={0}>Sem intervalo</option>
                            <option value={5}>5 minutos</option>
                            <option value={15}>15 minutos</option>
                            <option value={30}>30 minutos</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <Sparkles className="text-primary h-5 w-5" />
                    <p className="text-sm text-zinc-300">
                        A IA do LifeOS analisou seu calendário e tarefas pendentes para encontrar os melhores horários para você hoje.
                    </p>
                </div>

                {isLoading ? (
                    <div className="py-12 flex flex-col items-center gap-4">
                        <Loader text="OTIMIZANDO SUA AGENDA..." />
                        <p className="text-xs text-zinc-500 animate-pulse">Consultando disponibilidade e prioridades...</p>
                    </div>
                ) : isError ? (
                    <div className="py-12 flex flex-col items-center gap-4 text-center">
                        <AlertCircle className="text-red-500 h-10 w-10 opacity-50" />
                        <p className="text-zinc-400">Não foi possível gerar sugestões agora.</p>
                        <button
                            onClick={() => refetch()}
                            className="text-primary text-sm hover:underline"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : suggestions && suggestions.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {suggestions.map((task: any, idx: number) => (
                            <div
                                key={task.taskId + idx}
                                className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all flex items-center justify-between"
                            >
                                <div className="flex flex-col gap-1 min-w-0">
                                    <span className="text-sm font-medium text-white truncate">{task.title}</span>
                                    <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>{format(new Date(task.start), 'dd MMM', { locale: ptBR })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>{format(new Date(task.start), 'HH:mm')} - {format(new Date(task.end), 'HH:mm')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Check size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-zinc-500">Nenhuma tarefa pendente para agendar no momento.</p>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-white/5 text-zinc-400 font-medium hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={!suggestions || suggestions.length === 0 || applySchedule.isPending}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg",
                            applySchedule.isPending
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                : "bg-primary text-black hover:bg-primary/90 shadow-primary/20"
                        )}
                    >
                        {applySchedule.isPending ? 'Sincronizando...' : 'Confirmar Agenda'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
