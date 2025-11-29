import { describe, it, expect } from 'vitest'
import { tasksService } from '../services/tasksService'

describe('TasksService', () => {
  it('should be defined', () => {
    expect(tasksService).toBeDefined()
  })
})
