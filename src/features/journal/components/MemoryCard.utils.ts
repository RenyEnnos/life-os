import type { JournalEntry } from '@/shared/types';

export type MemoryCard = {
    id: string;
    title: string;
    excerpt: string;
    type: 'Insight' | 'Bookmark' | 'Journal' | 'Inspiration' | 'Voice';
    tags: string[];
    media?: string;
    timestamp?: string;
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
