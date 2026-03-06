import { getDb } from '@/shared/lib/sqlite';
import { logger } from '@/shared/lib/logger';
import { notificationService } from './NotificationService';
import { addDays, setHours, setMinutes, isAfter } from 'date-fns';

interface LocalHabitRow {
  id: string;
  name?: string;
  title?: string;
  active?: number;
  is_deleted?: number;
  reminder_time?: string;
}

interface LocalTaskRow {
  id: string;
  title: string;
  status?: string;
  is_deleted?: number;
  due_date?: string;
}

export class NotificationReconciler {
  /**
   * Reconciles all notifications based on the local database state.
   * Clears old ones and schedules future ones for the next 7 days.
   */
  static async reconcile() {
    logger.log('Starting Notification Reconciliation...');
    const db = getDb();
    if (!db) return;

    try {
      // 1. Fetch Habits
      const habitsResult = await db.query('SELECT * FROM habits WHERE active = 1 AND is_deleted = 0');
      const habits = habitsResult.values || [];

      for (const habit of habits) {
        await this.scheduleHabitReminders(habit);
      }

      // 2. Fetch Tasks with due dates
      const tasksResult = await db.query('SELECT * FROM tasks WHERE status != "done" AND is_deleted = 0 AND due_date IS NOT NULL');
      const tasks = tasksResult.values || [];

      for (const task of tasks) {
        await this.scheduleTaskReminder(task);
      }

      logger.log('Notification Reconciliation completed.');
    } catch (err) {
      logger.error('Failed to reconcile notifications:', err);
    }
  }

  private static async scheduleHabitReminders(habit: LocalHabitRow) {
    // Basic implementation: assuming habits have a 'reminder_time' (HH:mm)
    // If not, we could default to morning or specific routine times.
    const reminderTime = habit.reminder_time || '09:00';
    const [hour, minute] = reminderTime.split(':').map(Number);

    // Schedule for the next 7 days
    for (let i = 0; i < 7; i++) {
      let date = addDays(new Date(), i);
      date = setHours(date, hour);
      date = setMinutes(date, minute);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if (isAfter(date, new Date())) {
        await notificationService.schedule({
          id: `habit-${habit.id}-${i}`,
          title: 'Lembrete de Ritual',
          body: `Está na hora de: ${habit.name || habit.title}`,
          scheduledAt: date,
          data: { type: 'habit', id: habit.id }
        });
      }
    }
  }

  private static async scheduleTaskReminder(task: LocalTaskRow) {
    if (!task.due_date) return;
    const dueDate = new Date(task.due_date);

    // Remind 15 minutes before the task is due
    const reminderDate = new Date(dueDate.getTime() - 15 * 60000);

    if (isAfter(reminderDate, new Date())) {
      await notificationService.schedule({
        id: `task-${task.id}`,
        title: 'Missão Pendente',
        body: `Sua tarefa "${task.title}" vence em 15 minutos.`,
        scheduledAt: reminderDate,
        data: { type: 'task', id: task.id }
      });
    }
  }
}
