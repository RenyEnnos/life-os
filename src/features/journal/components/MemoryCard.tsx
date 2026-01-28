import type { JournalEntry } from '@/shared/types';
import { cn } from '@/shared/lib/cn';

export type MemoryCard = {
    id: string;
    title: string;
    excerpt: string;
    type: 'Insight' | 'Bookmark' | 'Journal' | 'Inspiration' | 'Voice';
    tags: string[];
    media?: string;
    timestamp?: string;
};

const TYPE_STYLES: Record<MemoryCard['type'], { icon: string; color: string }> = {
    Insight: { icon: 'lightbulb', color: 'text-amber-500/80' },
    Bookmark: { icon: 'link', color: 'text-purple-400/80' },
    Journal: { icon: 'article', color: 'text-blue-400/80' },
    Inspiration: { icon: 'favorite', color: 'text-pink-400/80' },
    Voice: { icon: 'mic', color: 'text-emerald-400/80' },
};

export function mapEntriesToCards(entries: JournalEntry[], label: MemoryCard['type']): MemoryCard[] {
    return entries.map((entry) => ({
        id: entry.id,
        title: entry.title || entry.entry_date,
        excerpt: entry.content || '',
        type: label,
        tags: entry.tags || [],
        timestamp: entry.entry_date,
    }));
}

interface MemoryCardComponentProps {
    card: MemoryCard;
    onClick: (card: MemoryCard) => void;
}

export function MemoryCardComponent({ card, onClick }: MemoryCardComponentProps) {
    const style = TYPE_STYLES[card.type];
    const hasMedia = !!card.media;

    return (
        <article
            onClick={() => onClick(card)}
            className={cn(
                "group flex flex-col gap-3 p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/20 hover:bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] cursor-pointer",
                hasMedia && "md:flex-row"
            )}
        >
            {hasMedia && (
                <div className="w-full md:w-48 h-32 rounded-lg bg-zinc-800 border border-white/5 overflow-hidden relative shrink-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity grayscale hover:grayscale-0 duration-500"
                        style={{ backgroundImage: `url('${card.media}')` }}
                    />
                </div>
            )}
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={cn("material-symbols-outlined text-sm", style.color)}>{style.icon}</span>
                    <span className={cn("text-xs font-medium", style.color)}>{card.type}</span>
                </div>
                <h4 className="text-zinc-200 font-display font-medium text-lg leading-tight group-hover:text-primary transition-colors">{card.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{card.excerpt}</p>
                <div className="flex gap-2 mt-auto pt-2 flex-wrap">
                    {card.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-zinc-400 border border-white/5 group-hover:border-white/10">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}
