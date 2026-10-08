import type { ArmedReminder } from './types';

/**
 * Day-of reminder hook.
 * Persist the exact committed next_action string. The notification (when Expo Go
 * allows it) restates this same body. Do not invent a new sentence.
 */
export function armDayOfReminder(
  clubId: string,
  nextAction: string,
  now = Date.now(),
  extra: Partial<Pick<ArmedReminder, 'notificationId' | 'scheduledFor' | 'notificationReason'>> = {},
): ArmedReminder {
  return { clubId, nextAction, armedAt: now, ...extra };
}

export function reminderBody(reminder: ArmedReminder | null, fallback?: string): string | null {
  if (reminder?.nextAction) return reminder.nextAction;
  if (fallback) return fallback;
  return null;
}
