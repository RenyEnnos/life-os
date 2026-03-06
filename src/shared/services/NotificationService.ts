import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationOptions {
  id: string;
  title: string;
  body: string;
  scheduledAt?: Date;
  data?: Record<string, unknown>;
}

class NotificationService {
  private isNative = Capacitor.getPlatform() !== 'web';
  private isElectron = typeof window !== 'undefined' && !!window.electron;

  async requestPermissions(): Promise<boolean> {
    if (this.isElectron) return true; // Desktop doesn't strictly need requestPermission for the system-level bridge we built

    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    }

    if (typeof Notification !== 'undefined') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  async notify(options: NotificationOptions) {
    if (this.isElectron) {
      window.electron.notify({
        title: options.title,
        body: options.body,
      });
      return;
    }

    if (this.isNative) {
      await LocalNotifications.schedule({
        notifications: [{
          id: Math.abs(this.hashCode(options.id)),
          title: options.title,
          body: options.body,
          extra: options.data,
        }]
      });
      return;
    }

    // Web Fallback
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(options.title, { body: options.body });
    }
  }

  async schedule(options: NotificationOptions) {
    if (!options.scheduledAt) {
      return this.notify(options);
    }

    if (this.isElectron) {
      window.electron.scheduleNotification({
        id: options.id,
        title: options.title,
        body: options.body,
        scheduledAt: options.scheduledAt.getTime(),
      });
      return;
    }

    if (this.isNative) {
      await LocalNotifications.schedule({
        notifications: [{
          id: Math.abs(this.hashCode(options.id)),
          title: options.title,
          body: options.body,
          schedule: { at: options.scheduledAt },
          extra: options.data,
        }]
      });
      return;
    }

    console.warn('Scheduling is only supported on Native/Desktop platforms.');
  }

  async cancel(id: string) {
    if (this.isElectron) {
      window.electron.cancelNotification(id);
      return;
    }

    if (this.isNative) {
      await LocalNotifications.cancel({
        notifications: [{ id: Math.abs(this.hashCode(id)) }]
      });
    }
  }

  // Helper to convert string IDs to numeric IDs required by Capacitor
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}

export const notificationService = new NotificationService();
