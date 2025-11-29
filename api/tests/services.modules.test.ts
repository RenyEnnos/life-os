import { describe, it, expect } from 'vitest'
import { habitsService } from '../services/habitsService'
import { journalService } from '../services/journalService'

describe('HabitsService', () => {
  it('should be defined', () => {
    expect(habitsService).toBeDefined()
  })
})

describe('JournalService', () => {
  it('should be defined', () => {
    expect(journalService).toBeDefined()
  })
})
