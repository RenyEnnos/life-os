import { describe, expect, it } from 'vitest'
import { createJournalSchema, updateJournalSchema } from '../journal'

describe('journalSchema', () => {
    describe('createJournalSchema', () => {
        it('accepts valid journal entry with title', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'My Day',
                mood_score: 7
            })
            expect(result.success).toBe(true)
        })

        it('accepts valid journal entry with content', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                content: 'Today was a good day.',
                mood_score: 8
            })
            expect(result.success).toBe(true)
        })

        it('accepts valid journal entry with both title and content', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'Reflections',
                content: 'Today I learned a lot about validation.',
                tags: ['learning', 'growth'],
                mood_score: 9
            })
            expect(result.success).toBe(true)
        })

        it('accepts journal entry without mood score', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'Quick Note'
            })
            expect(result.success).toBe(true)
        })

        it('accepts journal entry with tags', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                content: 'Productive day',
                tags: ['work', 'accomplishment']
            })
            expect(result.success).toBe(true)
        })

        it('rejects entry without title or content', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                mood_score: 5
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('At least title or content is required')
            }
        })

        it('rejects entry without entry_date', () => {
            const result = createJournalSchema.safeParse({
                title: 'My Day',
                content: 'Good day'
            })
            expect(result.success).toBe(false)
        })

        it('rejects invalid date format', () => {
            const result = createJournalSchema.safeParse({
                entry_date: 'not-a-date',
                title: 'My Day'
            })
            expect(result.success).toBe(false)
        })

        it('rejects title that is too long', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'A'.repeat(201)
            })
            expect(result.success).toBe(false)
        })

        it('rejects content that is too long', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                content: 'A'.repeat(10001)
            })
            expect(result.success).toBe(false)
        })

        it('rejects mood score out of range (too low)', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'My Day',
                mood_score: 0
            })
            expect(result.success).toBe(false)
        })

        it('rejects mood score out of range (too high)', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'My Day',
                mood_score: 11
            })
            expect(result.success).toBe(false)
        })

        it('rejects non-integer mood score', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'My Day',
                mood_score: 7.5
            })
            expect(result.success).toBe(false)
        })

        it('rejects too many tags', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'My Day',
                tags: Array.from({ length: 21 }, (_, i) => `tag${i}`)
            })
            expect(result.success).toBe(false)
        })

        it('rejects unknown fields', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: 'My Day',
                unknown_field: 'should not be allowed'
            })
            expect(result.success).toBe(false)
        })

        it('trims whitespace from title and content', () => {
            const result = createJournalSchema.safeParse({
                entry_date: '2024-02-17T10:00:00Z',
                title: '  My Day  ',
                content: '  Good day  '
            })
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.title).toBe('My Day')
                expect(result.data.content).toBe('Good day')
            }
        })
    })

    describe('updateJournalSchema', () => {
        it('accepts partial updates with title only', () => {
            const result = updateJournalSchema.safeParse({
                title: 'Updated Title'
            })
            expect(result.success).toBe(true)
        })

        it('accepts partial updates with content only', () => {
            const result = updateJournalSchema.safeParse({
                content: 'Updated content'
            })
            expect(result.success).toBe(true)
        })

        it('accepts partial updates with mood score only', () => {
            const result = updateJournalSchema.safeParse({
                mood_score: 8
            })
            expect(result.success).toBe(true)
        })

        it('accepts partial updates with multiple fields', () => {
            const result = updateJournalSchema.safeParse({
                title: 'Updated Title',
                content: 'Updated content',
                mood_score: 9
            })
            expect(result.success).toBe(true)
        })

        it('accepts empty object (no updates)', () => {
            const result = updateJournalSchema.safeParse({})
            expect(result.success).toBe(true)
        })

        it('rejects invalid mood score in update', () => {
            const result = updateJournalSchema.safeParse({
                mood_score: 15
            })
            expect(result.success).toBe(false)
        })

        it('rejects invalid date format in update', () => {
            const result = updateJournalSchema.safeParse({
                entry_date: 'invalid-date'
            })
            expect(result.success).toBe(false)
        })

        it('rejects unknown fields in update', () => {
            const result = updateJournalSchema.safeParse({
                title: 'Updated Title',
                unknown_field: 'not allowed'
            })
            expect(result.success).toBe(false)
        })
    })
})
