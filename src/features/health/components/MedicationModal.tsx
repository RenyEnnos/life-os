import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import type { MedicationReminder } from '@/shared/types';

interface MedicationModalProps {
    onClose: () => void;
    onSubmit: (payload: Partial<MedicationReminder>) => void;
}

export function MedicationModal({ onClose, onSubmit }: MedicationModalProps) {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState('08:00');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">NOVO MEDICAMENTO</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome (ex: Vitamina C)"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Dosagem (ex: 500mg)"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={dosage}
                        onChange={e => setDosage(e.target.value)}
                    />
                    <input
                        type="time"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                    />
                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ name, dosage, times: [time], active: true });
                            onClose();
                        }} className="flex-1">SALVAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
