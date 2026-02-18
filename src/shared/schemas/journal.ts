import { z } from 'zod';

const journalSchemaBase = z.object({
    entry_date: z.string()
        .min(1, 'Entry date is required')
        .datetime('Invalid date format. Use ISO 8601 format'),
    title: z.string()
        .trim()
        .max(200, 'Title must be less than 200 characters')
        .optional(),
    content: z.string()
        .trim()
        .max(10000, 'Content must be less than 10000 characters')
        .optional(),
    tags: z.array(z.string()).max(20, 'Maximum 20 tags allowed').optional(),
    mood_score: z.number()
        .int('Mood score must be an integer')
        .min(1, 'Mood score must be between 1 and 10')
        .max(10, 'Mood score must be between 1 and 10')
        .optional(),
}).strict();

export const createJournalSchema = journalSchemaBase.refine(
    (data) => data.title || data.content,
    {
        message: 'At least title or content is required',
        path: ['content'],
    }
);

export const updateJournalSchema = journalSchemaBase.partial();

export type JournalInput = z.infer<typeof journalSchemaBase>;
