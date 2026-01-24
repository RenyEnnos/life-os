import { supabase } from '../lib/supabase'

export interface Course {
    id: string
    user_id: string
    name: string
    professor?: string
    schedule?: string
    color?: string
    semester?: string
    grade?: number
    credits?: number
    created_at?: string
    updated_at?: string
}

export interface Assignment {
    id: string
    user_id: string
    course_id: string
    title: string
    description?: string
    type: 'exam' | 'homework' | 'project' | 'quiz' | 'presentation' | 'other'
    due_date?: string
    status: 'todo' | 'in_progress' | 'submitted' | 'graded'
    weight?: number
    grade?: number
    completed: boolean
    created_at?: string
    updated_at?: string
}

class UniversityService {
    // ==================== COURSES ====================

    async listCourses(userId: string): Promise<Course[]> {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('user_id', userId)
            .order('name')

        if (error) throw error
        return data ?? []
    }

    async createCourse(userId: string, course: Omit<Course, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Course> {
        const { data, error } = await supabase
            .from('courses')
            .insert({ ...course, user_id: userId })
            .select()
            .single()

        if (error) throw error
        return data
    }

    async updateCourse(userId: string, courseId: string, updates: Partial<Course>): Promise<Course> {
        const { data, error } = await supabase
            .from('courses')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('id', courseId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async deleteCourse(userId: string, courseId: string): Promise<boolean> {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('user_id', userId)
            .eq('id', courseId)

        if (error) throw error
        return true
    }

    // ==================== ASSIGNMENTS ====================

    async listAssignments(userId: string, courseId?: string): Promise<Assignment[]> {
        let query = supabase
            .from('assignments')
            .select('*, courses(name, color)')
            .eq('user_id', userId)
            .order('due_date', { ascending: true, nullsFirst: false })

        if (courseId) {
            query = query.eq('course_id', courseId)
        }

        const { data, error } = await query

        if (error) throw error
        return data ?? []
    }

    async createAssignment(userId: string, assignment: Omit<Assignment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Assignment> {
        const { data, error } = await supabase
            .from('assignments')
            .insert({ ...assignment, user_id: userId })
            .select()
            .single()

        if (error) throw error
        return data
    }

    async updateAssignment(userId: string, assignmentId: string, updates: Partial<Assignment>): Promise<Assignment> {
        const { data, error } = await supabase
            .from('assignments')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('id', assignmentId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async deleteAssignment(userId: string, assignmentId: string): Promise<boolean> {
        const { error } = await supabase
            .from('assignments')
            .delete()
            .eq('user_id', userId)
            .eq('id', assignmentId)

        if (error) throw error
        return true
    }

    async toggleAssignmentComplete(userId: string, assignmentId: string): Promise<Assignment> {
        // First get current state
        const { data: current, error: fetchError } = await supabase
            .from('assignments')
            .select('completed')
            .eq('user_id', userId)
            .eq('id', assignmentId)
            .single()

        if (fetchError) throw fetchError

        // Toggle
        const { data, error } = await supabase
            .from('assignments')
            .update({
                completed: !current.completed,
                status: !current.completed ? 'submitted' : 'todo',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('id', assignmentId)
            .select()
            .single()

        if (error) throw error
        return data
    }
}

export const universityService = new UniversityService()
