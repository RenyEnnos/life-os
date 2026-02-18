import { z } from 'zod';

// OAuth connection schemas
export const calendarConnectSchema = z.object({
  code: z.string()
    .min(1, 'OAuth code is required')
    .max(2048, 'OAuth code is too long'),
  state: z.string()
    .min(1, 'OAuth state is required')
    .max(2048, 'OAuth state is too long'),
});

// Calendar event schemas (Google Calendar format)
const eventDateTimeSchema = z.object({
  dateTime: z.string().datetime().optional(),
  date: z.string().optional(),
}).refine(
  (data) => data.dateTime !== undefined || data.date !== undefined,
  { message: 'Either dateTime or date must be provided' }
);

export const calendarEventSchema = z.object({
  id: z.string().optional(),
  summary: z.string().max(1024, 'Summary is too long').optional(),
  location: z.string().max(1024, 'Location is too long').optional(),
  description: z.string().max(4096, 'Description is too long').optional(),
  conferenceData: z.unknown().optional(),
  start: eventDateTimeSchema.optional(),
  end: eventDateTimeSchema.optional(),
});

export const createCalendarEventSchema = calendarEventSchema
  .omit({ id: true })
  .strict()
  .refine(
    (data) => data.start !== undefined,
    { message: 'Start time is required' }
  );

export const updateCalendarEventSchema = calendarEventSchema.partial();

// Type exports
export type CalendarConnectInput = z.infer<typeof calendarConnectSchema>;
export type CalendarEventInput = z.infer<typeof calendarEventSchema>;
export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;
export type UpdateCalendarEventInput = z.infer<typeof updateCalendarEventSchema>;
