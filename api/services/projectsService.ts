import { supabase } from '../lib/supabase'

export const projectsService = {
  async list(userId: string, query: any) {
    const { status, limit } = query
    let q = supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) q = q.eq('active', status === 'active')
    if (limit) q = q.limit(Number(limit))

    const { data, error } = await q
    if (error) throw error
    return data
  },

  async create(userId: string, payload: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(userId: string, id: string, payload: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async remove(userId: string, id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return true
  },

  // SWOT
  async listSwot(userId: string, projectId: string) {
    // Verify project ownership first
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (!project) throw new Error('Project not found or access denied')

    const { data, error } = await supabase
      .from('swot_entries')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  async addSwot(userId: string, projectId: string, payload: any) {
    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (!project) throw new Error('Project not found or access denied')

    const { data, error } = await supabase
      .from('swot_entries')
      .insert([{ ...payload, project_id: projectId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSwot(userId: string, swotId: string, payload: any) {
    // RLS handles permission check via project_id join, but we can double check if needed.
    // For simplicity rely on RLS policies defined in migration.
    const { data, error } = await supabase
      .from('swot_entries')
      .update(payload)
      .eq('id', swotId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeSwot(userId: string, swotId: string) {
    const { error } = await supabase
      .from('swot_entries')
      .delete()
      .eq('id', swotId)

    if (error) throw error
    return true
  }
}
