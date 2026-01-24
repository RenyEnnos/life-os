import { apiClient } from '@/shared/api/http'
import { Course, Assignment } from '../types'

const API_BASE = '/api/university'

export const universityApi = {
    // Courses
    listCourses: () => apiClient.get<Course[]>(`${API_BASE}/courses`),
    createCourse: (data: Omit<Course, 'id' | 'user_id'>) => apiClient.post<Course>(`${API_BASE}/courses`, data),
    updateCourse: (id: string, data: Partial<Course>) => apiClient.put<Course>(`${API_BASE}/courses/${id}`, data),
    deleteCourse: (id: string) => apiClient.delete<{ success: boolean }>(`${API_BASE}/courses/${id}`),

    // Assignments
    listAssignments: (courseId?: string) => {
        const params = courseId ? `?courseId=${courseId}` : ''
        return apiClient.get<Assignment[]>(`${API_BASE}/assignments${params}`)
    },
    createAssignment: (data: Omit<Assignment, 'id'>) => apiClient.post<Assignment>(`${API_BASE}/assignments`, data),
    updateAssignment: (id: string, data: Partial<Assignment>) => apiClient.put<Assignment>(`${API_BASE}/assignments/${id}`, data),
    toggleAssignment: (id: string) => apiClient.patch<Assignment>(`${API_BASE}/assignments/${id}/toggle`),
    deleteAssignment: (id: string) => apiClient.delete<{ success: boolean }>(`${API_BASE}/assignments/${id}`),
}
