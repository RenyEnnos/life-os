import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

class HapticsService {
  private isNative = Capacitor.getPlatform() !== 'web';

  /**
   * Light vibration for subtle feedback (e.g., clicking a button)
   */
  async light() {
    if (!this.isNative) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  /**
   * Medium vibration for meaningful feedback (e.g., toggling a switch)
   */
  async medium() {
    if (!this.isNative) return;
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  /**
   * Heavy vibration for impactful actions (e.g., deleting an item)
   */
  async heavy() {
    if (!this.isNative) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }

  /**
   * Success feedback (e.g., completing a ritual or task)
   */
  async success() {
    if (!this.isNative) return;
    await Haptics.notification({ type: NotificationType.Success });
  }

  /**
   * Warning feedback
   */
  async warning() {
    if (!this.isNative) return;
    await Haptics.notification({ type: NotificationType.Warning });
  }

  /**
   * Error feedback
   */
  async error() {
    if (!this.isNative) return;
    await Haptics.notification({ type: NotificationType.Error });
  }
}

export const haptics = new HapticsService();
