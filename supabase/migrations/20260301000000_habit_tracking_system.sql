-- Migration to add support for quantified habits, colors and icons
ALTER TABLE habits
ADD COLUMN IF NOT EXISTS unit VARCHAR(50),
ADD COLUMN IF NOT EXISTS color VARCHAR(50),
ADD COLUMN IF NOT EXISTS icon VARCHAR(50),
ADD COLUMN IF NOT EXISTS target_value INTEGER DEFAULT 1;

-- If 'goal' column exists, we can migrate it to 'target_value'
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'goal') THEN
        UPDATE habits SET target_value = goal WHERE target_value = 1;
    END IF;
END $$;
