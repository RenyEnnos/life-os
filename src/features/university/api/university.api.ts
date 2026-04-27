import { IpcClient } from '@/shared/api/ipcClient'
import { apiClient } from '@/shared/api/http'
import { isDesktopApp } from '@/shared/lib/platform'
import { Course, Assignment } from '../types'

const API_BASE = '/' + 'api/university'
const coursesIpc = new IpcClient<Course>('universityCourses')
const assignmentsIpc = new IpcClient<Assignment>('universityAssignments')

function getDesktopAssignmentStatus(assignment: Assignment) {
    const completed = !assignment.completed

    return {
        completed,
        status: completed ? 'submitted' : 'todo',
    } satisfies Pick<Assignment, 'completed' | 'status'>
}

export const universityApi = {
    // Courses
    listCourses: () => isDesktopApp()
        ? coursesIpc.getAll()
        : apiClient.get<Course[]>(`${API_BASE}/courses`),
    createCourse: (data: Omit<Course, 'id' | 'user_id'>) => isDesktopApp()
        ? coursesIpc.create(data)
        : apiClient.post<Course>(`${API_BASE}/courses`, data),
    updateCourse: (id: string, data: Partial<Course>) => isDesktopApp()
        ? coursesIpc.update(id, data)
        : apiClient.put<Course>(`${API_BASE}/courses/${id}`, data),
    deleteCourse: async (id: string) => {
        if (isDesktopApp()) {
            await coursesIpc.delete(id)
            return { success: true }
        }

        return apiClient.delete<{ success: boolean }>(`${API_BASE}/courses/${id}`)
    },

    // Assignments
    listAssignments: async (courseId?: string) => {
        if (isDesktopApp()) {
            const assignments = await assignmentsIpc.getAll()
            return courseId ? assignments.filter((assignment) => assignment.course_id === courseId) : assignments
        }

        const params = courseId ? `?courseId=${courseId}` : ''
        return apiClient.get<Assignment[]>(`${API_BASE}/assignments${params}`)
    },
    createAssignment: (data: Omit<Assignment, 'id'>) => isDesktopApp()
        ? assignmentsIpc.create(data)
        : apiClient.post<Assignment>(`${API_BASE}/assignments`, data),
    updateAssignment: (id: string, data: Partial<Assignment>) => isDesktopApp()
        ? assignmentsIpc.update(id, data)
        : apiClient.put<Assignment>(`${API_BASE}/assignments/${id}`, data),
    toggleAssignment: async (id: string) => {
        if (isDesktopApp()) {
            const assignment = await assignmentsIpc.getById(id)
            if (!assignment) {
                throw new Error(`Assignment ${id} not found`)
            }

            return assignmentsIpc.update(id, getDesktopAssignmentStatus(assignment))
        }

        return apiClient.patch<Assignment>(`${API_BASE}/assignments/${id}/toggle`)
    },
    deleteAssignment: async (id: string) => {
        if (isDesktopApp()) {
            await assignmentsIpc.delete(id)
            return { success: true }
        }

        return apiClient.delete<{ success: boolean }>(`${API_BASE}/assignments/${id}`)
    },
}
