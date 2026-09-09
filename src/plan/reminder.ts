import type { ArmedReminder } from './types';

/**
 * Day-of reminder hook.
 * Today: persist the exact committed next_action string.
 * Later: Notifications.scheduleNotificationAsync({ content: { body: nextAction } })
 *        or a Supabase / server push. Do not invent a new sentence.
 */
export function armDayOfReminder(clubId: string, nextAction: string, now = Date.now()): ArmedReminder {
  return { clubId, nextAction, armedAt: now };
}

export function reminderBody(reminder: ArmedReminder | null, fallback?: string): string | null {
  if (reminder?.nextAction) return reminder.nextAction;
  if (fallback) return fallback;
  return null;
}
