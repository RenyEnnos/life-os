export interface Achievement {
    id: string;
    icon: string; // e.g., 'trophy', 'star'
    title: string;
    description: string;
    xp_value: number;
    category: 'health' | 'productivity' | 'finance' | 'learning';
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    unlocked_at: string;
    achievement: Achievement; // Joined
}

export interface UserScore {
    user_id: string;
    level: number;
    current_xp: number;
    life_score: number;
}
