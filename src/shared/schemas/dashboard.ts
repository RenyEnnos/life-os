import { z } from 'zod';

// Vital Load State
export const vitalLoadStateSchema = z.enum(['balanced', 'overloaded', 'underloaded'], {
    errorMap: () => ({ message: 'State must be balanced, overloaded, or underloaded' })
});

// Vital Load Structure
export const vitalLoadSchema = z.object({
    totalImpact: z.number({
        errorMap: () => ({ message: 'Total impact must be a number' })
    }),
    state: vitalLoadStateSchema,
    label: z.string({
        errorMap: () => ({ message: 'Label is required' })
    }).min(1, 'Label cannot be empty')
});

// Habit Consistency Structure
export const habitConsistencySchema = z.object({
    percentage: z.number({
        errorMap: () => ({ message: 'Percentage must be a number' })
    }).min(0, 'Percentage cannot be negative')
     .max(100, 'Percentage cannot exceed 100'),
    weeklyData: z.array(z.number({
        errorMap: () => ({ message: 'Weekly data values must be numbers' })
    }).nonnegative('Weekly data values cannot be negative'))
      .length(7, 'Weekly data must contain exactly 7 values')
});

// Dashboard Widgets (flexible configuration for future use)
export const dashboardWidgetsSchema = z.record(z.unknown()).optional();

// Dashboard Preferences (for future user customization)
export const dashboardPreferencesSchema = z.object({
    theme: z.enum(['light', 'dark', 'auto'], {
        errorMap: () => ({ message: 'Theme must be light, dark, or auto' })
    }).optional(),
    compactMode: z.boolean().optional(),
    hiddenWidgets: z.array(z.string()).optional(),
    widgetOrder: z.array(z.string()).optional(),
});

// Complete Dashboard Summary
export const dashboardSummarySchema = z.object({
    lifeScore: z.unknown().refine((val) => val !== undefined, {
        message: 'LifeScore is required'
    }),
    habitConsistency: habitConsistencySchema,
    vitalLoad: vitalLoadSchema,
    widgets: dashboardWidgetsSchema.optional().default({}),
});

// Create/Update Schemas (for future dashboard customization features)
export const createDashboardPreferencesSchema = dashboardPreferencesSchema;
export const updateDashboardPreferencesSchema = dashboardPreferencesSchema.partial();

// Export Types
export type VitalLoadState = z.infer<typeof vitalLoadStateSchema>;
export type VitalLoad = z.infer<typeof vitalLoadSchema>;
export type HabitConsistency = z.infer<typeof habitConsistencySchema>;
export type DashboardPreferences = z.infer<typeof dashboardPreferencesSchema>;
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
