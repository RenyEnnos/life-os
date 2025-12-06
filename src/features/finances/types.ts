export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    description: string;
    category: string; // db: category or tag
    type: 'income' | 'expense';
    date: string;
    created_at?: string;
    updated_at?: string;

    // UI specific
    tag?: string; // mapping to category
    tagColor?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

export interface Budget {
    id: string;
    user_id: string;
    category: string;
    limit_amount: number;
    spent_amount: number;
    period: 'monthly' | 'weekly';
}
