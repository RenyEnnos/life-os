import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Tag } from '@/shared/ui/Tag';
import type { JournalEntry } from '@/shared/types';

interface JournalEntryListProps {
    entries: JournalEntry[];
    onEdit: (entry: JournalEntry) => void;
    onDelete: (id: string) => void;
}

export function JournalEntryList({ entries, onEdit, onDelete }: JournalEntryListProps) {
    if (!entries?.length) {
        return (
            <div className="text-center py-20 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground font-mono">Nenhuma entrada encontrada.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {entries.map((entry) => (
                <Card key={entry.id} className="p-6 border-border hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold font-mono text-primary mb-1">
                                {entry.title || 'Sem Título'}
                            </h3>
                            <p className="text-sm text-muted-foreground font-mono">
                                {format(new Date(entry.entry_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(entry)}
                                aria-label="Editar entrada"
                                title="Editar entrada"
                            >
                                <Edit2 size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(entry.id)}
                                className="text-destructive hover:bg-destructive/10"
                                aria-label="Excluir entrada"
                                title="Excluir entrada"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {entry.content}
                        </p>
                    </div>

                    {entry.tags?.length && entry.tags.length > 0 ? (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                            {entry.tags?.map((tag: string) => (
                                <Tag key={tag} variant="outline" size="sm">#{tag}</Tag>
                            ))}
                        </div>
                    ) : null}
                </Card>
            ))}
        </div>
    );
}
