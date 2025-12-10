-- Seed initial achievements
INSERT INTO public.achievements (slug, name, description, icon, xp_reward, condition_type, condition_value) VALUES
('first-steps', 'First Steps', 'Complete your first task.', 'Footprints', 50, 'count', 1),
('task-apprentice', 'Task Apprentice', 'Complete 10 tasks.', 'CheckCircle', 100, 'count', 10),
('centurion', 'Centurion', 'Complete 100 tasks.', 'Crown', 500, 'count', 100),
('habit-starter', 'Habit Starter', 'Log your first habit.', 'Sparkles', 50, 'count', 1),
('week-warrior', 'Week Warrior', 'Maintain a 7-day streak.', 'Calendar', 200, 'streak', 7),
('scholar-initiate', 'Scholar Initiate', 'Reach Level 5.', 'GraduationCap', 100, 'level', 5),
('first-reflection', 'First Reflection', 'Write your first journal entry.', 'BookOpen', 50, 'count', 1),
('mindful-master', 'Mindful Master', 'Write 30 journal entries.', 'Brain', 300, 'count', 30)
ON CONFLICT (slug) DO NOTHING;
