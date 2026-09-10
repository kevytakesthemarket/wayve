import { Platform } from 'react-native';

import { nightFromNextAction, nextDayOfDate } from './reminderDate';

export type NotificationArmResult = {
  scheduled: boolean;
  notificationId: string | null;
  scheduledFor: number | null;
  reason?: 'web' | 'denied' | 'unavailable';
};

const CHANNEL = 'wayve-reminders';

async function loadNotifications(): Promise<typeof import('expo-notifications') | null> {
  if (Platform.OS === 'web') return null;
  try {
    return await import('expo-notifications');
  } catch {
    return null;
  }
}

/**
 * Local day-of reminder. Body is the committed next_action — never a new sentence.
 * Expo Go on iOS/Android can show this. Web cannot; the reminder screen still works.
 */
export async function scheduleDayOfNotification(
  nextAction: string,
  when?: Date,
): Promise<NotificationArmResult> {
  const fireAt = when ?? nextDayOfDate(nightFromNextAction(nextAction));
  const Notifications = await loadNotifications();
  if (!Notifications) {
    return {
      scheduled: false,
      notificationId: null,
      scheduledFor: fireAt.getTime(),
      reason: Platform.OS === 'web' ? 'web' : 'unavailable',
    };
  }

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const asked = await Notifications.requestPermissionsAsync();
      status = asked.status;
    }
    if (status !== 'granted') {
      return {
        scheduled: false,
        notificationId: null,
        scheduledFor: fireAt.getTime(),
        reason: 'denied',
      };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL, {
        name: 'Day-of club reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Wayve',
        body: nextAction,
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
        channelId: Platform.OS === 'android' ? CHANNEL : undefined,
      },
    });

    return {
      scheduled: true,
      notificationId: id,
      scheduledFor: fireAt.getTime(),
    };
  } catch {
    return {
      scheduled: false,
      notificationId: null,
      scheduledFor: fireAt.getTime(),
      reason: 'unavailable',
    };
  }
}

/** Same next_action body, a few seconds out — so Expo Go review does not wait until Thursday 5pm. */
export async function previewDayOfNotification(nextAction: string, seconds = 2): Promise<NotificationArmResult> {
  const Notifications = await loadNotifications();
  const scheduledFor = Date.now() + seconds * 1000;
  if (!Notifications) {
    return {
      scheduled: false,
      notificationId: null,
      scheduledFor,
      reason: Platform.OS === 'web' ? 'web' : 'unavailable',
    };
  }

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const asked = await Notifications.requestPermissionsAsync();
      status = asked.status;
    }
    if (status !== 'granted') {
      return { scheduled: false, notificationId: null, scheduledFor, reason: 'denied' };
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL, {
        name: 'Day-of club reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Wayve',
        body: nextAction,
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, seconds),
        channelId: Platform.OS === 'android' ? CHANNEL : undefined,
      },
    });
    return { scheduled: true, notificationId: id, scheduledFor };
  } catch {
    return { scheduled: false, notificationId: null, scheduledFor, reason: 'unavailable' };
  }
}

export async function cancelNotification(id: string | null | undefined): Promise<void> {
  if (!id) return;
  const Notifications = await loadNotifications();
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // ignore
  }
}
