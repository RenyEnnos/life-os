export interface UserProfile {
    id: string;
    full_name?: string;
    nickname?: string;
    invite_code?: string;
    is_invited_partner?: boolean;
    avatar_url?: string;
    theme?: string;
    onboarding_completed?: boolean;
    created_at?: string;
    updated_at?: string;
    level?: number;
    current_xp?: number;
    points?: number;
}
