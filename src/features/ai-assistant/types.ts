export interface AIMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

export interface AIResponse {
    tags?: string[];
    swot?: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    plan?: Record<string, string[]>;
    summary?: string[];
    error?: string;
    message?: string; // For chat
}

export interface AILog {
    id: string;
    function_name: string;
    success: boolean;
    error_message?: string;
    created_at: string;
}

export interface SynapseSuggestion {
    id: string;
    title: string;
    rationale: string;
    action_label: string;
    source: 'gemini' | 'heuristic' | 'cache';
}
