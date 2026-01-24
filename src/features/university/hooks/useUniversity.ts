import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { universityApi } from '../api/university.api'
import { Course, Assignment } from '../types'

const QUERY_KEYS = {
    courses: ['university', 'courses'] as const,
    assignments: ['university', 'assignments'] as const,
}

export function useUniversity() {
    const queryClient = useQueryClient()

    // ==================== COURSES ====================

    const coursesQuery = useQuery({
        queryKey: QUERY_KEYS.courses,
        queryFn: universityApi.listCourses,
    })

    const createCourseMutation = useMutation({
        mutationFn: (data: Omit<Course, 'id' | 'user_id'>) => universityApi.createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses })
        },
    })

    const updateCourseMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => universityApi.updateCourse(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses })
        },
    })

    const deleteCourseMutation = useMutation({
        mutationFn: (id: string) => universityApi.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments })
        },
    })

    // ==================== ASSIGNMENTS ====================

    const assignmentsQuery = useQuery({
        queryKey: QUERY_KEYS.assignments,
        queryFn: () => universityApi.listAssignments(),
    })

    const createAssignmentMutation = useMutation({
        mutationFn: (data: Omit<Assignment, 'id'>) => universityApi.createAssignment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments })
        },
    })

    const updateAssignmentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Assignment> }) => universityApi.updateAssignment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments })
        },
    })

    const toggleAssignmentMutation = useMutation({
        mutationFn: (id: string) => universityApi.toggleAssignment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments })
        },
    })

    const deleteAssignmentMutation = useMutation({
        mutationFn: (id: string) => universityApi.deleteAssignment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments })
        },
    })

    return {
        // Courses
        courses: coursesQuery.data ?? [],
        coursesLoading: coursesQuery.isLoading,
        coursesError: coursesQuery.error,
        addCourse: createCourseMutation.mutate,
        updateCourse: (id: string, data: Partial<Course>) => updateCourseMutation.mutate({ id, data }),
        removeCourse: deleteCourseMutation.mutate,

        // Assignments
        assignments: assignmentsQuery.data ?? [],
        assignmentsLoading: assignmentsQuery.isLoading,
        assignmentsError: assignmentsQuery.error,
        addAssignment: createAssignmentMutation.mutate,
        updateAssignment: (id: string, data: Partial<Assignment>) => updateAssignmentMutation.mutate({ id, data }),
        toggleAssignment: toggleAssignmentMutation.mutate,
        removeAssignment: deleteAssignmentMutation.mutate,

        // Loading state
        isLoading: coursesQuery.isLoading || assignmentsQuery.isLoading,

        // Refetch
        refetch: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments })
        },
    }
}
