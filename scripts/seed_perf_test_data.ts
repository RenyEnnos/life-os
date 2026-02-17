/**
 * Seed Performance Test Data
 *
 * This script populates the database with a large dataset for performance testing:
 * - 1000+ tasks
 * - 365+ days of habit data across 10 habits
 *
 * Usage:
 *   tsx scripts/seed_perf_test_data.ts
 *
 * Note: Run this before running the performance tests to get accurate measurements
 * with realistic data volumes.
 */

import 'dotenv/config';
import { supabase } from '../api/lib/supabase';
import bcrypt from 'bcryptjs';

const PERF_USER_EMAIL = 'test@life-os.app';
const PERF_USER_PASSWORD = 'TestPass123!';
const PERF_USER_NAME = 'Performance Test User';

interface Task {
  user_id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  tags: string[];
}

interface Habit {
  user_id: string;
  title: string;
  description: string;
  type: 'binary' | 'numeric';
  goal: number;
  active: boolean;
}

interface HabitLog {
  habit_id: string;
  user_id: string;
  value: number;
  logged_date: string;
}

async function getOrCreateUser(): Promise<string> {
  console.log('Checking for performance test user...');

  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('email', PERF_USER_EMAIL)
    .single();

  if (existingUser) {
    console.log('Found existing user:', existingUser.id);
    return existingUser.id;
  }

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking user:', checkError);
    throw checkError;
  }

  console.log('Creating performance test user...');
  const passwordHash = await bcrypt.hash(PERF_USER_PASSWORD, 10);

  const { data: user, error } = await supabase
    .from('users')
    .insert([
      {
        email: PERF_USER_EMAIL,
        password_hash: passwordHash,
        name: PERF_USER_NAME,
        preferences: {},
        theme: 'dark',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Failed to create user:', error);
    throw error;
  }

  console.log('User created successfully:', user.id);
  return user.id;
}

async function cleanupExistingData(userId: string): Promise<void> {
  console.log('Cleaning up existing performance test data...');

  // Delete existing habit logs (they have foreign key constraints)
  const { error: logsError } = await supabase
    .from('habit_logs')
    .delete()
    .eq('user_id', userId);

  if (logsError) {
    console.error('Error deleting habit logs:', logsError);
  }

  // Delete existing habits
  const { error: habitsError } = await supabase
    .from('habits')
    .delete()
    .eq('user_id', userId);

  if (habitsError) {
    console.error('Error deleting habits:', habitsError);
  }

  // Delete existing tasks
  const { error: tasksError } = await supabase
    .from('tasks')
    .delete()
    .eq('user_id', userId);

  if (tasksError) {
    console.error('Error deleting tasks:', tasksError);
  }

  console.log('Cleanup complete.');
}

async function seedTasks(userId: string, count: number): Promise<void> {
  console.log(`Seeding ${count} tasks...`);

  const batchSize = 50;
  const batches = Math.ceil(count / batchSize);

  for (let i = 0; i < batches; i++) {
    const tasks: Task[] = Array.from({ length: batchSize }, (_, index) => {
      const globalIndex = i * batchSize + index;
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 365));

      return {
        user_id: userId,
        title: `Performance Test Task ${globalIndex + 1}`,
        description: `Task for performance testing - ${globalIndex + 1}`,
        due_date: date.toISOString(),
        completed: Math.random() > 0.7, // 30% completed
        tags: ['performance-test'],
      };
    });

    const { error } = await supabase.from('tasks').insert(tasks);

    if (error) {
      console.error(`Error inserting batch ${i + 1}:`, error);
      throw error;
    }

    process.stdout.write(`\rProgress: ${Math.min((i + 1) * batchSize, count)}/${count} tasks`);
  }

  console.log('\nTasks seeded successfully.');
}

async function seedHabitsAndLogs(
  userId: string,
  habitCount: number,
  daysOfData: number
): Promise<void> {
  console.log(`Seeding ${habitCount} habits with ${daysOfData} days of data...`);

  // Create habits
  const habits: Habit[] = Array.from({ length: habitCount }, (_, index) => ({
    user_id: userId,
    title: `Performance Test Habit ${index + 1}`,
    description: `Habit for performance testing - ${index + 1}`,
    type: 'binary' as const,
    goal: 1,
    active: true,
  }));

  const { data: createdHabits, error: habitsError } = await supabase
    .from('habits')
    .insert(habits)
    .select();

  if (habitsError) {
    console.error('Error creating habits:', habitsError);
    throw habitsError;
  }

  console.log(`Created ${createdHabits.length} habits.`);

  // Generate habit logs
  const logsBatchSize = 100;
  let totalLogs = 0;

  for (const habit of createdHabits) {
    console.log(`\nGenerating logs for habit: ${habit.title}`);

    for (let day = 0; day < daysOfData; day += logsBatchSize) {
      const logs: HabitLog[] = Array.from(
        { length: Math.min(logsBatchSize, daysOfData - day) },
        (_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (day + index));

          return {
            habit_id: habit.id,
            user_id: userId,
            value: Math.random() > 0.3 ? 1 : 0, // 70% completion rate
            logged_date: date.toISOString().split('T')[0],
          };
        }
      );

      const { error: logsError } = await supabase.from('habit_logs').insert(logs);

      if (logsError) {
        console.error(`Error inserting logs batch for habit ${habit.id}:`, logsError);
        throw logsError;
      }

      totalLogs += logs.length;
      process.stdout.write(
        `\r  Progress: ${Math.min(day + logsBatchSize, daysOfData)}/${daysOfData} days`
      );
    }
  }

  console.log(`\nHabit logs seeded successfully. Total logs: ${totalLogs}`);
}

async function printStats(userId: string): Promise<void> {
  console.log('\n=== Performance Test Data Stats ===');

  const { count: taskCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { count: habitCount } = await supabase
    .from('habits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { count: logCount } = await supabase
    .from('habit_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  console.log(`Tasks: ${taskCount || 0}`);
  console.log(`Habits: ${habitCount || 0}`);
  console.log(`Habit Logs: ${logCount || 0}`);
  console.log('================================\n');
}

async function main() {
  try {
    console.log('=== Performance Test Data Seeder ===\n');

    // Get or create user
    const userId = await getOrCreateUser();

    // Clean up existing data
    await cleanupExistingData(userId);

    // Seed data
    await seedTasks(userId, 1000);
    await seedHabitsAndLogs(userId, 100, 365);

    // Print statistics
    await printStats(userId);

    console.log('✅ Performance test data seeded successfully!');
    console.log('\nYou can now run the performance tests:');
    console.log('  npm run test:e2e -- tests/performance/dashboard-load.test.ts');
  } catch (error) {
    console.error('❌ Error seeding performance test data:', error);
    process.exit(1);
  }
}

main();
