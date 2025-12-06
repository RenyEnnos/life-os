import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import type { HealthMetric } from '@/shared/types';

interface MetricModalProps {
    onClose: () => void;
    onSubmit: (payload: Partial<HealthMetric>) => void;
}

export function MetricModal({ onClose, onSubmit }: MetricModalProps) {
    const [type, setType] = useState('weight');
    const [value, setValue] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">REGISTRAR MÉTRICA</h3>
                <div className="space-y-4">
                    <select
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="weight">Peso (kg)</option>
                        <option value="steps">Passos</option>
                        <option value="sleep">Sono (horas)</option>
                        <option value="heart_rate">Batimentos (bpm)</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Valor"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ metric_type: type, value: Number(value), recorded_date: new Date().toISOString() });
                            onClose();
                        }} className="flex-1">SALVAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
