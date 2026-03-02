/**
 * XP Reward values for various user actions
 */
export const XP_REWARDS = {
    TASK_COMPLETE: 100,
    HABIT_LOG: 50,
    JOURNAL_ENTRY: 150,
    FINANCE_LOG: 25,
    UNIVERSITY_ASSIGNMENT: 200,
} as const;

export type XpAction = keyof typeof XP_REWARDS;
