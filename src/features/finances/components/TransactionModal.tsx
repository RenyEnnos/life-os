import { Card } from '@/shared/ui/Card';
import { TransactionForm } from './TransactionForm';
import type { Transaction } from '@/shared/types';

interface TransactionModalProps {
    onClose: () => void;
    onSubmit: (payload: Partial<Transaction> & { category?: string }) => void;
}

export function TransactionModal({ onClose, onSubmit }: TransactionModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">NOVA TRANSAÇÃO</h3>
                <TransactionForm
                    onSubmit={(data) => {
                        onSubmit(data);
                        onClose();
                    }}
                    onCancel={onClose}
                />
            </Card>
        </div>
    );
}
