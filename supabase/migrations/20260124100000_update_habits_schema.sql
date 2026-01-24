-- Create enum for Habit Attribute (Life Score Symbiosis)
CREATE TYPE habit_attribute AS ENUM ('BODY', 'MIND', 'SPIRIT', 'OUTPUT');

-- Add new columns to habits table
ALTER TABLE habits 
ADD COLUMN attribute habit_attribute DEFAULT 'BODY',
ADD COLUMN streak_current INTEGER DEFAULT 0,
ADD COLUMN streak_longest INTEGER DEFAULT 0;

-- Add index for analytics (e.g., "Top Mind Habits")
CREATE INDEX idx_habits_attribute ON habits(attribute);

-- Add constraint to ensure streak logic integrity
ALTER TABLE habits
ADD CONSTRAINT check_streak_integrity CHECK (streak_current <= streak_longest);

-- Comment to document logical link to Gamification
COMMENT ON COLUMN habits.attribute IS 'Links habit to specific Life Score dimension (Body/Mind/Spirit)';
