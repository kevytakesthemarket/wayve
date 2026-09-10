/**
 * Day-of fire time from the committed if-then night.
 * Does not invent a new sentence — only a clock time for the same next_action.
 */

const NIGHT_TARGET: Record<string, { weekday: number | 'weekday'; hour: number }> = {
  'Thursday night': { weekday: 4, hour: 17 },
  'Friday night': { weekday: 5, hour: 17 },
  'Weeknights after class': { weekday: 'weekday', hour: 17 },
  'a weeknight after class': { weekday: 'weekday', hour: 17 },
  Saturday: { weekday: 6, hour: 16 },
  Sunday: { weekday: 0, hour: 14 },
  'Sunday afternoon': { weekday: 0, hour: 14 },
};

/** Pull the night phrase out of "If it's Thursday night and …" */
export function nightFromNextAction(nextAction: string): string {
  const match = nextAction.match(/^If it's (.+?) and /);
  return match?.[1] ?? 'Thursday night';
}

export function nextDayOfDate(nightLabel: string, now = new Date()): Date {
  const spec = NIGHT_TARGET[nightLabel] ?? { weekday: 4, hour: 17 };

  if (spec.weekday === 'weekday') {
    for (let add = 0; add <= 8; add++) {
      const candidate = new Date(now.getTime());
      candidate.setDate(now.getDate() + add);
      candidate.setHours(spec.hour, 0, 0, 0);
      const day = candidate.getDay();
      if (day >= 1 && day <= 5 && candidate.getTime() > now.getTime()) return candidate;
    }
  }

  const target = spec.weekday as number;
  const result = new Date(now.getTime());
  result.setHours(spec.hour, 0, 0, 0);
  const delta = (target - now.getDay() + 7) % 7;
  if (delta === 0 && result.getTime() <= now.getTime()) {
    result.setDate(result.getDate() + 7);
  } else {
    result.setDate(result.getDate() + delta);
  }
  return result;
}
