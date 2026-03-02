import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Tag } from '@/shared/ui/Tag';
import { Pagination } from '@/shared/ui/Pagination';
import type { JournalEntry } from '@/shared/types';
import { cn } from '@/shared/lib/cn';

interface JournalEntryListProps {
    entries: JournalEntry[];
    onEdit: (entry: JournalEntry) => void;
    onDelete: (id: string) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    compact?: boolean;
}

export function JournalEntryList({ entries, onEdit, onDelete, currentPage, totalPages, onPageChange, compact = false }: JournalEntryListProps) {
    if (!entries?.length) {
        return (
            <div className={cn(
                "text-center border border-dashed border-border rounded-lg",
                compact ? "py-10 px-4" : "py-20"
            )}>
                <p className="text-muted-foreground font-mono text-xs">Nenhuma entrada encontrada.</p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", compact && "space-y-3")}>
            <div className={cn("space-y-4", compact && "space-y-2")}>
                {entries.map((entry) => (
                    <Card
                        key={entry.id}
                        className={cn(
                            "border-border hover:border-primary/50 transition-colors group cursor-pointer",
                            compact ? "p-3" : "p-6"
                        )}
                        onClick={() => compact && onEdit(entry)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    "font-bold font-mono text-primary truncate",
                                    compact ? "text-sm mb-0.5" : "text-xl mb-1"
                                )}>
                                    {entry.title || 'Sem Título'}
                                </h3>
                                <p className={cn(
                                    "text-muted-foreground font-mono",
                                    compact ? "text-[10px]" : "text-sm"
                                )}>
                                    {format(new Date(entry.entry_date), compact ? "dd/MM/yyyy" : "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                </p>
                            </div>
                            {!compact && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(entry); }} aria-label="Editar entrada">
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }} className="text-destructive hover:bg-destructive/10" aria-label="Excluir entrada">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {!compact && (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed line-clamp-3">
                                    {entry.content}
                                </p>
                            </div>
                        )}

                        {entry.tags?.length && entry.tags.length > 0 ? (
                            <div className={cn(
                                "flex flex-wrap gap-1",
                                !compact && "mt-4 pt-4 border-t border-border/50"
                            )}>
                                {entry.tags?.slice(0, compact ? 2 : undefined).map((tag: string) => (
                                    <Tag key={tag} variant="outline" size="sm" className={compact ? "text-[9px] px-1.5 py-0 h-4" : ""}>
                                        #{tag}
                                    </Tag>
                                ))}
                                {compact && entry.tags.length > 2 && (
                                    <span className="text-[9px] text-muted-foreground">+{entry.tags.length - 2}</span>
                                )}
                            </div>
                        ) : null}
                    </Card>
                ))}
            </div>

            {!compact && currentPage && totalPages && onPageChange && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

