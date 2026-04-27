/**
 * Shared allowlist of table names and their resource mappings.
 * Used by both resourceHandler and legacyHandler.
 */
export const ALLOWED_RESOURCES: Record<string, string> = {
  habits: 'habits',
  journalEntries: 'journal_entries',
  transactions: 'transactions',
  healthMetrics: 'health_metrics',
  tasks: 'tasks',
  rewards: 'rewards',
  achievements: 'achievements',
  projects: 'projects',
  medications: 'medications',
  universityCourses: 'university_courses',
  universityAssignments: 'university_assignments',
};

export const ALLOWED_TABLES = new Set(Object.values(ALLOWED_RESOURCES));
