-- Add routine column to habits table
ALTER TABLE habits 
ADD COLUMN routine VARCHAR(20) DEFAULT 'any' CHECK (routine IN ('morning', 'afternoon', 'evening', 'any'));

-- Update existing habits to have a default routine
UPDATE habits SET routine = 'any' WHERE routine IS NULL;
