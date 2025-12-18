export interface SymbiosisLink {
    id: string;
    task_id: string;
    habit_id: string;
    impact_vital: number;
    custo_financeiro?: number | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type VitalLoadState = 'balanced' | 'overloaded' | 'underloaded';

export interface VitalLoadSummary {
    totalImpact: number;
    state: VitalLoadState;
    label: string;
}
