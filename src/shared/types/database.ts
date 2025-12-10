export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            achievements: {
                Row: {
                    condition_type: string
                    condition_value: number
                    created_at: string
                    description: string
                    icon: string
                    id: string
                    name: string
                    slug: string
                    xp_reward: number
                }
                Insert: {
                    condition_type: string
                    condition_value: number
                    created_at?: string
                    description: string
                    icon: string
                    id?: string
                    name: string
                    slug: string
                    xp_reward: number
                }
                Update: {
                    condition_type?: string
                    condition_value?: number
                    created_at?: string
                    description?: string
                    icon?: string
                    id?: string
                    name?: string
                    slug?: string
                    xp_reward?: number
                }
                Relationships: []
            }
            ai_cache: {
                Row: {
                    function_name: string
                    id: string
                    input_hash: string
                    output: Json
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    function_name: string
                    id?: string
                    input_hash: string
                    output: Json
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    function_name?: string
                    id?: string
                    input_hash?: string
                    output?: Json
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            habits: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    name: string
                    schedule: Json
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    name: string
                    schedule?: Json
                    user_id: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    name?: string
                    schedule?: Json
                    user_id?: string
                }
                Relationships: []
            }
            journal_entries: {
                Row: {
                    content: string | null
                    created_at: string
                    entry_date: string
                    id: string
                    last_analyzed_at: string | null
                    mood_score: number | null
                    tags: string[] | null
                    title: string | null
                    user_id: string
                }
                Insert: {
                    content?: string | null
                    created_at?: string
                    entry_date: string
                    id?: string
                    last_analyzed_at?: string | null
                    mood_score?: number | null
                    tags?: string[] | null
                    title?: string | null
                    user_id: string
                }
                Update: {
                    content?: string | null
                    created_at?: string
                    entry_date?: string
                    id?: string
                    last_analyzed_at?: string | null
                    mood_score?: number | null
                    tags?: string[] | null
                    title?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            journal_insights: {
                Row: {
                    content: Json
                    created_at: string
                    id: string
                    insight_type: string
                    journal_entry_id: string | null
                    user_id: string
                }
                Insert: {
                    content: Json
                    created_at?: string
                    id?: string
                    insight_type: string
                    journal_entry_id?: string | null
                    user_id: string
                }
                Update: {
                    content?: Json
                    created_at?: string
                    id?: string
                    insight_type?: string
                    journal_entry_id?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "journal_insights_journal_entry_id_fkey"
                        columns: ["journal_entry_id"]
                        isOneToOne: false
                        referencedRelation: "journal_entries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    active: boolean | null
                    created_at: string
                    deadline: string | null
                    description: string | null
                    id: string
                    name: string
                    priority: string | null
                    status: string | null
                    tags: string[] | null
                    title: string | null
                    user_id: string
                }
                Insert: {
                    active?: boolean | null
                    created_at?: string
                    deadline?: string | null
                    description?: string | null
                    id?: string
                    name: string
                    priority?: string | null
                    status?: string | null
                    tags?: string[] | null
                    title?: string | null
                    user_id: string
                }
                Update: {
                    active?: boolean | null
                    created_at?: string
                    deadline?: string | null
                    description?: string | null
                    id?: string
                    name?: string
                    priority?: string | null
                    status?: string | null
                    tags?: string[] | null
                    title?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            tasks: {
                Row: {
                    completed: boolean | null
                    created_at: string
                    description: string | null
                    due_date: string | null
                    id: string
                    priority: string | null
                    project_id: string | null
                    status: string | null
                    tags: string[] | null
                    title: string
                    user_id: string
                }
                Insert: {
                    completed?: boolean | null
                    created_at?: string
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    priority?: string | null
                    project_id?: string | null
                    status?: string | null
                    tags?: string[] | null
                    title: string
                    user_id: string
                }
                Update: {
                    completed?: boolean | null
                    created_at?: string
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    priority?: string | null
                    project_id?: string | null
                    status?: string | null
                    tags?: string[] | null
                    title?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tasks_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            transactions: {
                Row: {
                    amount: number
                    category: string
                    created_at: string
                    date: string
                    description: string | null
                    id: string
                    tags: string[] | null
                    type: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: string
                    created_at?: string
                    date: string
                    description?: string | null
                    id?: string
                    tags?: string[] | null
                    type: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string
                    date?: string
                    description?: string | null
                    id?: string
                    tags?: string[] | null
                    type?: string
                    user_id?: string
                }
                Relationships: []
            },
            user_achievements: {
                Row: {
                    achievement_id: string
                    unlocked_at: string
                    user_id: string
                }
                Insert: {
                    achievement_id: string
                    unlocked_at?: string
                    user_id: string
                }
                Update: {
                    achievement_id?: string
                    unlocked_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_achievements_achievement_id_fkey"
                        columns: ["achievement_id"]
                        isOneToOne: false
                        referencedRelation: "achievements"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_achievements_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            },
            user_xp: {
                Row: {
                    attributes: Json
                    created_at: string
                    level: number
                    total_xp: number
                    updated_at: string
                    user_id: string
                    xp_history: Json
                }
                Insert: {
                    attributes?: Json
                    created_at?: string
                    level?: number
                    total_xp?: number
                    updated_at?: string
                    user_id: string
                    xp_history?: Json
                }
                Update: {
                    attributes?: Json
                    created_at?: string
                    level?: number
                    total_xp?: number
                    updated_at?: string
                    user_id?: string
                    xp_history?: Json
                }
                Relationships: [
                    {
                        foreignKeyName: "user_xp_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            match_journal_entries: {
                Args: {
                    query_embedding: string
                    match_threshold: number
                    match_count: number
                }
                Returns: {
                    id: string
                    content: string
                    similarity: number
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
