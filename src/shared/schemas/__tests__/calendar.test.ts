import { describe, expect, it } from 'vitest'
import {
  calendarConnectSchema,
  calendarEventSchema,
  createCalendarEventSchema,
  updateCalendarEventSchema
} from '../calendar'

describe('calendarConnectSchema', () => {
  it('accepts valid OAuth connection data', () => {
    const result = calendarConnectSchema.safeParse({
      code: 'valid_oauth_code_123',
      state: 'valid_state_456'
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing code', () => {
    const result = calendarConnectSchema.safeParse({
      state: 'valid_state_456'
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing state', () => {
    const result = calendarConnectSchema.safeParse({
      code: 'valid_oauth_code_123'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty code', () => {
    const result = calendarConnectSchema.safeParse({
      code: '',
      state: 'valid_state_456'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty state', () => {
    const result = calendarConnectSchema.safeParse({
      code: 'valid_oauth_code_123',
      state: ''
    })
    expect(result.success).toBe(false)
  })

  it('rejects code that is too long', () => {
    const result = calendarConnectSchema.safeParse({
      code: 'a'.repeat(2049),
      state: 'valid_state_456'
    })
    expect(result.success).toBe(false)
  })

  it('rejects state that is too long', () => {
    const result = calendarConnectSchema.safeParse({
      code: 'valid_oauth_code_123',
      state: 'a'.repeat(2049)
    })
    expect(result.success).toBe(false)
  })
})

describe('calendarEventSchema', () => {
  it('accepts valid event with dateTime', () => {
    const result = calendarEventSchema.safeParse({
      id: 'event-123',
      summary: 'Team Meeting',
      location: 'Conference Room A',
      description: 'Weekly team sync',
      start: {
        dateTime: '2026-02-17T10:00:00Z'
      },
      end: {
        dateTime: '2026-02-17T11:00:00Z'
      }
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid event with date (all-day)', () => {
    const result = calendarEventSchema.safeParse({
      id: 'event-456',
      summary: 'All Day Event',
      start: {
        date: '2026-02-17'
      },
      end: {
        date: '2026-02-18'
      }
    })
    expect(result.success).toBe(true)
  })

  it('accepts minimal event data', () => {
    const result = calendarEventSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts event with conferenceData', () => {
    const result = calendarEventSchema.safeParse({
      id: 'event-789',
      summary: 'Video Call',
      conferenceData: {
        createRequest: {
          requestId: 'some-request-id',
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      start: {
        dateTime: '2026-02-17T14:00:00Z'
      },
      end: {
        dateTime: '2026-02-17T15:00:00Z'
      }
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid dateTime format', () => {
    const result = calendarEventSchema.safeParse({
      start: {
        dateTime: 'not-a-datetime'
      }
    })
    expect(result.success).toBe(false)
  })

  it('rejects summary that is too long', () => {
    const result = calendarEventSchema.safeParse({
      summary: 'a'.repeat(1025)
    })
    expect(result.success).toBe(false)
  })

  it('rejects location that is too long', () => {
    const result = calendarEventSchema.safeParse({
      location: 'a'.repeat(1025)
    })
    expect(result.success).toBe(false)
  })

  it('rejects description that is too long', () => {
    const result = calendarEventSchema.safeParse({
      description: 'a'.repeat(4097)
    })
    expect(result.success).toBe(false)
  })

  it('rejects start with neither dateTime nor date', () => {
    const result = calendarEventSchema.safeParse({
      start: {}
    })
    expect(result.success).toBe(false)
  })
})

describe('createCalendarEventSchema', () => {
  it('accepts valid event with start time', () => {
    const result = createCalendarEventSchema.safeParse({
      summary: 'New Event',
      start: {
        dateTime: '2026-02-17T10:00:00Z'
      },
      end: {
        dateTime: '2026-02-17T11:00:00Z'
      }
    })
    expect(result.success).toBe(true)
  })

  it('accepts event with date (all-day)', () => {
    const result = createCalendarEventSchema.safeParse({
      summary: 'All Day Event',
      start: {
        date: '2026-02-17'
      },
      end: {
        date: '2026-02-18'
      }
    })
    expect(result.success).toBe(true)
  })

  it('rejects event without start time', () => {
    const result = createCalendarEventSchema.safeParse({
      summary: 'Event without start'
    })
    expect(result.success).toBe(false)
  })

  it('rejects event with id (should not be provided on create)', () => {
    const result = createCalendarEventSchema.safeParse({
      id: 'event-123',
      summary: 'Event with ID',
      start: {
        dateTime: '2026-02-17T10:00:00Z'
      }
    })
    expect(result.success).toBe(false)
  })

  it('accepts minimal event with only start time', () => {
    const result = createCalendarEventSchema.safeParse({
      start: {
        dateTime: '2026-02-17T10:00:00Z'
      }
    })
    expect(result.success).toBe(true)
  })
})

describe('updateCalendarEventSchema', () => {
  it('accepts partial event updates', () => {
    const result = updateCalendarEventSchema.safeParse({
      summary: 'Updated Summary'
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty object (no updates)', () => {
    const result = updateCalendarEventSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts updating start time', () => {
    const result = updateCalendarEventSchema.safeParse({
      start: {
        dateTime: '2026-02-17T12:00:00Z'
      }
    })
    expect(result.success).toBe(true)
  })

  it('accepts updating end time', () => {
    const result = updateCalendarEventSchema.safeParse({
      end: {
        dateTime: '2026-02-17T13:00:00Z'
      }
    })
    expect(result.success).toBe(true)
  })

  it('accepts updating multiple fields', () => {
    const result = updateCalendarEventSchema.safeParse({
      summary: 'Updated Event',
      location: 'New Location',
      description: 'Updated description'
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid dateTime in update', () => {
    const result = updateCalendarEventSchema.safeParse({
      start: {
        dateTime: 'invalid-datetime'
      }
    })
    expect(result.success).toBe(false)
  })

  it('rejects summary that is too long', () => {
    const result = updateCalendarEventSchema.safeParse({
      summary: 'a'.repeat(1025)
    })
    expect(result.success).toBe(false)
  })
})
