import { beforeEach, describe, expect, it, vi } from 'vitest'

const ipcMethods = {
  coursesGetAll: vi.fn(),
  coursesCreate: vi.fn(),
  coursesUpdate: vi.fn(),
  coursesDelete: vi.fn(),
  assignmentsGetAll: vi.fn(),
  assignmentsGetById: vi.fn(),
  assignmentsCreate: vi.fn(),
  assignmentsUpdate: vi.fn(),
  assignmentsDelete: vi.fn(),
}

vi.mock('@/shared/lib/platform', () => ({
  isDesktopApp: vi.fn(() => true),
}))

vi.mock('@/shared/api/http', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/shared/api/ipcClient', () => ({
  IpcClient: class {
    private readonly resource: string

    constructor(resource: string) {
      this.resource = resource
    }

    getAll() {
      return this.resource === 'universityCourses'
        ? ipcMethods.coursesGetAll()
        : ipcMethods.assignmentsGetAll()
    }

    getById(id: string) {
      void id
      return ipcMethods.assignmentsGetById(id)
    }

    create(data: unknown) {
      return this.resource === 'universityCourses'
        ? ipcMethods.coursesCreate(data)
        : ipcMethods.assignmentsCreate(data)
    }

    update(id: string, data: unknown) {
      return this.resource === 'universityCourses'
        ? ipcMethods.coursesUpdate(id, data)
        : ipcMethods.assignmentsUpdate(id, data)
    }

    delete(id: string) {
      return this.resource === 'universityCourses'
        ? ipcMethods.coursesDelete(id)
        : ipcMethods.assignmentsDelete(id)
    }
  },
}))

import { universityApi } from '../university.api'

describe('universityApi desktop bridge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists courses through the Electron IPC client', async () => {
    ipcMethods.coursesGetAll.mockResolvedValue([{ id: 'course-1', user_id: 'user-1', name: 'Algorithms' }])

    const courses = await universityApi.listCourses()

    expect(ipcMethods.coursesGetAll).toHaveBeenCalledOnce()
    expect(courses[0]?.name).toBe('Algorithms')
  })

  it('filters assignments in memory for a course', async () => {
    ipcMethods.assignmentsGetAll.mockResolvedValue([
      { id: 'a-1', course_id: 'course-1', title: 'Essay', type: 'essay', due_date: '2026-03-20', weight: 20, status: 'todo', completed: false },
      { id: 'a-2', course_id: 'course-2', title: 'Quiz', type: 'quiz', due_date: '2026-03-22', weight: 10, status: 'todo', completed: false },
    ])

    const assignments = await universityApi.listAssignments('course-1')

    expect(ipcMethods.assignmentsGetAll).toHaveBeenCalledOnce()
    expect(assignments).toHaveLength(1)
    expect(assignments[0]?.id).toBe('a-1')
  })

  it('toggles assignment completion through the Electron IPC client', async () => {
    ipcMethods.assignmentsGetById.mockResolvedValue({
      id: 'a-1',
      course_id: 'course-1',
      title: 'Essay',
      type: 'essay',
      due_date: '2026-03-20',
      weight: 20,
      status: 'todo',
      completed: false,
    })
    ipcMethods.assignmentsUpdate.mockResolvedValue({
      id: 'a-1',
      completed: true,
      status: 'submitted',
    })

    const updated = await universityApi.toggleAssignment('a-1')

    expect(ipcMethods.assignmentsGetById).toHaveBeenCalledWith('a-1')
    expect(ipcMethods.assignmentsUpdate).toHaveBeenCalledWith('a-1', {
      completed: true,
      status: 'submitted',
    })
    expect(updated.completed).toBe(true)
    expect(updated.status).toBe('submitted')
  })
})
