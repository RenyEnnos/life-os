import { describe, expect, it } from 'vitest'
import {
    vitalLoadSchema,
    vitalLoadStateSchema,
    habitConsistencySchema,
    dashboardWidgetsSchema,
    dashboardPreferencesSchema,
    dashboardSummarySchema,
    createDashboardPreferencesSchema,
    updateDashboardPreferencesSchema
} from '../dashboard'

describe('vitalLoadStateSchema', () => {
    it('accepts balanced state', () => {
        const result = vitalLoadStateSchema.safeParse('balanced')
        expect(result.success).toBe(true)
    })

    it('accepts overloaded state', () => {
        const result = vitalLoadStateSchema.safeParse('overloaded')
        expect(result.success).toBe(true)
    })

    it('accepts underloaded state', () => {
        const result = vitalLoadStateSchema.safeParse('underloaded')
        expect(result.success).toBe(true)
    })

    it('rejects invalid state', () => {
        const result = vitalLoadStateSchema.safeParse('invalid')
        expect(result.success).toBe(false)
    })

    it('rejects empty string', () => {
        const result = vitalLoadStateSchema.safeParse('')
        expect(result.success).toBe(false)
    })
})

describe('vitalLoadSchema', () => {
    it('accepts valid vital load with balanced state', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: 0,
            state: 'balanced',
            label: 'Carga vital equilibrada'
        })
        expect(result.success).toBe(true)
    })

    it('accepts valid vital load with overloaded state', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: 5,
            state: 'overloaded',
            label: 'Carga vital alta — priorize recuperação'
        })
        expect(result.success).toBe(true)
    })

    it('accepts valid vital load with underloaded state', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: -2,
            state: 'underloaded',
            label: 'Carga vital baixa — adicione estímulos leves'
        })
        expect(result.success).toBe(true)
    })

    it('accepts negative totalImpact', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: -3,
            state: 'underloaded',
            label: 'Low load'
        })
        expect(result.success).toBe(true)
    })

    it('rejects missing totalImpact', () => {
        const result = vitalLoadSchema.safeParse({
            state: 'balanced',
            label: 'Test'
        })
        expect(result.success).toBe(false)
    })

    it('rejects non-numeric totalImpact', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: 'not-a-number',
            state: 'balanced',
            label: 'Test'
        })
        expect(result.success).toBe(false)
    })

    it('rejects missing state', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: 0,
            label: 'Test'
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid state', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: 0,
            state: 'invalid',
            label: 'Test'
        })
        expect(result.success).toBe(false)
    })

    it('rejects missing label', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: 0,
            state: 'balanced'
        })
        expect(result.success).toBe(false)
    })

    it('rejects empty label', () => {
        const result = vitalLoadSchema.safeParse({
            totalImpact: 0,
            state: 'balanced',
            label: ''
        })
        expect(result.success).toBe(false)
    })
})

describe('habitConsistencySchema', () => {
    it('accepts valid habit consistency with full data', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 75,
            weeklyData: [5, 6, 4, 7, 5, 3, 2]
        })
        expect(result.success).toBe(true)
    })

    it('accepts zero percentage', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 0,
            weeklyData: [0, 0, 0, 0, 0, 0, 0]
        })
        expect(result.success).toBe(true)
    })

    it('accepts 100 percentage', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 100,
            weeklyData: [7, 7, 7, 7, 7, 7, 7]
        })
        expect(result.success).toBe(true)
    })

    it('accepts weekly data with zeros', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 50,
            weeklyData: [0, 1, 0, 2, 0, 1, 0]
        })
        expect(result.success).toBe(true)
    })

    it('rejects missing percentage', () => {
        const result = habitConsistencySchema.safeParse({
            weeklyData: [1, 2, 3, 4, 5, 6, 7]
        })
        expect(result.success).toBe(false)
    })

    it('rejects non-numeric percentage', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 'not-a-number',
            weeklyData: [1, 2, 3, 4, 5, 6, 7]
        })
        expect(result.success).toBe(false)
    })

    it('rejects negative percentage', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: -1,
            weeklyData: [1, 2, 3, 4, 5, 6, 7]
        })
        expect(result.success).toBe(false)
    })

    it('rejects percentage over 100', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 101,
            weeklyData: [1, 2, 3, 4, 5, 6, 7]
        })
        expect(result.success).toBe(false)
    })

    it('rejects missing weeklyData', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 50
        })
        expect(result.success).toBe(false)
    })

    it('rejects weeklyData with less than 7 values', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 50,
            weeklyData: [1, 2, 3, 4, 5, 6]
        })
        expect(result.success).toBe(false)
    })

    it('rejects weeklyData with more than 7 values', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 50,
            weeklyData: [1, 2, 3, 4, 5, 6, 7, 8]
        })
        expect(result.success).toBe(false)
    })

    it('rejects negative values in weeklyData', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 50,
            weeklyData: [1, 2, -1, 4, 5, 6, 7]
        })
        expect(result.success).toBe(false)
    })

    it('rejects non-numeric values in weeklyData', () => {
        const result = habitConsistencySchema.safeParse({
            percentage: 50,
            weeklyData: [1, 2, 'three', 4, 5, 6, 7]
        })
        expect(result.success).toBe(false)
    })
})

describe('dashboardWidgetsSchema', () => {
    it('accepts empty object', () => {
        const result = dashboardWidgetsSchema.safeParse({})
        expect(result.success).toBe(true)
    })

    it('accepts object with various properties', () => {
        const result = dashboardWidgetsSchema.safeParse({
            lifeScore: { enabled: true },
            habits: { position: 'top' },
            calendar: { view: 'month' }
        })
        expect(result.success).toBe(true)
    })

    it('accepts nested objects', () => {
        const result = dashboardWidgetsSchema.safeParse({
            layout: {
                columns: 3,
                widgets: ['lifeScore', 'habits', 'tasks']
            }
        })
        expect(result.success).toBe(true)
    })

    it('accepts arrays as values', () => {
        const result = dashboardWidgetsSchema.safeParse({
            widgetOrder: ['lifeScore', 'habits', 'tasks', 'calendar']
        })
        expect(result.success).toBe(true)
    })
})

describe('dashboardPreferencesSchema', () => {
    it('accepts empty object', () => {
        const result = dashboardPreferencesSchema.safeParse({})
        expect(result.success).toBe(true)
    })

    it('accepts preferences with light theme', () => {
        const result = dashboardPreferencesSchema.safeParse({
            theme: 'light',
            compactMode: false
        })
        expect(result.success).toBe(true)
    })

    it('accepts preferences with dark theme', () => {
        const result = dashboardPreferencesSchema.safeParse({
            theme: 'dark',
            compactMode: true
        })
        expect(result.success).toBe(true)
    })

    it('accepts preferences with auto theme', () => {
        const result = dashboardPreferencesSchema.safeParse({
            theme: 'auto'
        })
        expect(result.success).toBe(true)
    })

    it('accepts hiddenWidgets array', () => {
        const result = dashboardPreferencesSchema.safeParse({
            hiddenWidgets: ['deprecated-widget']
        })
        expect(result.success).toBe(true)
    })

    it('accepts widgetOrder array', () => {
        const result = dashboardPreferencesSchema.safeParse({
            widgetOrder: ['lifeScore', 'habits', 'tasks', 'calendar']
        })
        expect(result.success).toBe(true)
    })

    it('accepts all preferences', () => {
        const result = dashboardPreferencesSchema.safeParse({
            theme: 'dark',
            compactMode: true,
            hiddenWidgets: ['old-widget'],
            widgetOrder: ['lifeScore', 'habits', 'tasks']
        })
        expect(result.success).toBe(true)
    })

    it('rejects invalid theme', () => {
        const result = dashboardPreferencesSchema.safeParse({
            theme: 'invalid'
        })
        expect(result.success).toBe(false)
    })

    it('rejects empty string theme', () => {
        const result = dashboardPreferencesSchema.safeParse({
            theme: ''
        })
        expect(result.success).toBe(false)
    })
})

describe('dashboardSummarySchema', () => {
    it('accepts valid dashboard summary with all fields', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: { score: 75, level: 5 },
            habitConsistency: {
                percentage: 80,
                weeklyData: [5, 6, 7, 4, 5, 6, 7]
            },
            vitalLoad: {
                totalImpact: 1,
                state: 'balanced',
                label: 'Carga vital equilibrada'
            },
            widgets: {
                lifeScore: { enabled: true }
            }
        })
        expect(result.success).toBe(true)
    })

    it('accepts dashboard summary without widgets (defaults to empty object)', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: { score: 60, level: 4 },
            habitConsistency: {
                percentage: 50,
                weeklyData: [3, 4, 5, 3, 4, 5, 6]
            },
            vitalLoad: {
                totalImpact: 4,
                state: 'overloaded',
                label: 'Carga vital alta'
            }
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.widgets).toEqual({})
        }
    })

    it('accepts null lifeScore (unknown structure)', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: null,
            habitConsistency: {
                percentage: 100,
                weeklyData: [7, 7, 7, 7, 7, 7, 7]
            },
            vitalLoad: {
                totalImpact: -2,
                state: 'underloaded',
                label: 'Low load'
            }
        })
        expect(result.success).toBe(true)
    })

    it('accepts complex lifeScore object', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: {
                score: 85,
                level: 6,
                xp: 1250,
                nextLevelXp: 1500,
                attributes: {
                    body: 80,
                    mind: 90,
                    spirit: 85
                }
            },
            habitConsistency: {
                percentage: 75,
                weeklyData: [5, 6, 5, 7, 5, 6, 7]
            },
            vitalLoad: {
                totalImpact: 0,
                state: 'balanced',
                label: 'Balanced'
            }
        })
        expect(result.success).toBe(true)
    })

    it('rejects missing lifeScore', () => {
        const result = dashboardSummarySchema.safeParse({
            habitConsistency: {
                percentage: 50,
                weeklyData: [1, 2, 3, 4, 5, 6, 7]
            },
            vitalLoad: {
                totalImpact: 0,
                state: 'balanced',
                label: 'Test'
            }
        })
        expect(result.success).toBe(false)
    })

    it('rejects missing habitConsistency', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: {},
            vitalLoad: {
                totalImpact: 0,
                state: 'balanced',
                label: 'Test'
            }
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid habitConsistency', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: {},
            habitConsistency: {
                percentage: 150, // Invalid: > 100
                weeklyData: [1, 2, 3, 4, 5, 6, 7]
            },
            vitalLoad: {
                totalImpact: 0,
                state: 'balanced',
                label: 'Test'
            }
        })
        expect(result.success).toBe(false)
    })

    it('rejects missing vitalLoad', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: {},
            habitConsistency: {
                percentage: 50,
                weeklyData: [1, 2, 3, 4, 5, 6, 7]
            }
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid vitalLoad state', () => {
        const result = dashboardSummarySchema.safeParse({
            lifeScore: {},
            habitConsistency: {
                percentage: 50,
                weeklyData: [1, 2, 3, 4, 5, 6, 7]
            },
            vitalLoad: {
                totalImpact: 0,
                state: 'invalid',
                label: 'Test'
            }
        })
        expect(result.success).toBe(false)
    })
})

describe('createDashboardPreferencesSchema', () => {
    it('is same as dashboardPreferencesSchema', () => {
        expect(createDashboardPreferencesSchema).toBe(dashboardPreferencesSchema)
    })
})

describe('updateDashboardPreferencesSchema', () => {
    it('accepts partial update with theme', () => {
        const result = updateDashboardPreferencesSchema.safeParse({
            theme: 'dark'
        })
        expect(result.success).toBe(true)
    })

    it('accepts partial update with compactMode', () => {
        const result = updateDashboardPreferencesSchema.safeParse({
            compactMode: true
        })
        expect(result.success).toBe(true)
    })

    it('accepts partial update with hiddenWidgets', () => {
        const result = updateDashboardPreferencesSchema.safeParse({
            hiddenWidgets: ['old-widget', 'another-old-widget']
        })
        expect(result.success).toBe(true)
    })

    it('accepts partial update with widgetOrder', () => {
        const result = updateDashboardPreferencesSchema.safeParse({
            widgetOrder: ['habits', 'lifeScore', 'tasks']
        })
        expect(result.success).toBe(true)
    })

    it('accepts multiple fields in partial update', () => {
        const result = updateDashboardPreferencesSchema.safeParse({
            theme: 'light',
            compactMode: false
        })
        expect(result.success).toBe(true)
    })

    it('accepts empty object', () => {
        const result = updateDashboardPreferencesSchema.safeParse({})
        expect(result.success).toBe(true)
    })

    it('rejects invalid theme in partial update', () => {
        const result = updateDashboardPreferencesSchema.safeParse({
            theme: 'invalid'
        })
        expect(result.success).toBe(false)
    })
})
