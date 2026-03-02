-- Seed finance categories for existing users
-- This script ensures that all users have a set of default finance categories.
-- It iterates through all users in the 'users' table and inserts default categories
-- if they don't already have any.

DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN SELECT id FROM public.users LOOP
        -- Check if user already has categories
        IF NOT EXISTS (SELECT 1 FROM public.finance_categories WHERE user_id = u.id) THEN
            INSERT INTO public.finance_categories (user_id, name, type, icon)
            VALUES
                (u.id, 'Alimentação', 'expense', 'utensils'),
                (u.id, 'Transporte', 'expense', 'car'),
                (u.id, 'Moradia', 'expense', 'home'),
                (u.id, 'Saúde', 'expense', 'heart'),
                (u.id, 'Educação', 'expense', 'book'),
                (u.id, 'Lazer', 'expense', 'gamepad-2'),
                (u.id, 'Compras', 'expense', 'shopping-bag'),
                (u.id, 'Contas', 'expense', 'file-text'),
                (u.id, 'Outros', 'expense', 'more-horizontal'),
                (u.id, 'Salário', 'income', 'briefcase'),
                (u.id, 'Freelance', 'income', 'laptop'),
                (u.id, 'Investimentos', 'income', 'trending-up'),
                (u.id, 'Outros', 'income', 'plus-circle');
        END IF;
    END FOR;
END $$;
