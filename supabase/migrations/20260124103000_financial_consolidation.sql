-- Create Finance Categories Table
CREATE TABLE finance_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Categories
ALTER TABLE finance_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own categories" ON finance_categories
    USING (auth.uid() = user_id);

-- Create Budgets Table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES finance_categories(id) ON DELETE CASCADE,
    amount_limit DECIMAL(12, 2) NOT NULL,
    period TEXT CHECK (period IN ('monthly', 'weekly', 'yearly')) DEFAULT 'monthly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own budgets" ON budgets
    USING (auth.uid() = user_id);

-- Link Transactions to Categories (Optional for migration, enforced later if desired)
ALTER TABLE transactions
ADD COLUMN category_id UUID REFERENCES finance_categories(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_finance_categories_user ON finance_categories(user_id);
CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
