import type { Club } from './types';

const NIGHT_PHRASE: Record<string, string> = {
  'Weeknights after class': 'a weeknight after class',
  'Thursday night': 'Thursday night',
  'Friday night': 'Friday night',
  Saturday: 'Saturday',
  Sunday: 'Sunday afternoon',
};

export const INTAKE_NIGHTS = [
  'Weeknights after class',
  'Thursday night',
  'Friday night',
  'Saturday',
  'Sunday',
] as const;

export type IntakeNight = (typeof INTAKE_NIGHTS)[number];

export interface ClubDraft {
  name: string;
  first_15_script: string;
  stay_leave: string;
  weekly_hours: string;
  next_meeting: string;
  not_fit_if: string;
  drop_in_ok: boolean;
  walk_instruction: string;
  slack_nights: string[];
}

/** Host names and DMs do not belong on a club row. */
export function inventsHost(text: string): boolean {
  const n = text.toLowerCase();
  return /\bsay hi\b/.test(n) || /\bmeet [a-z]/.test(n) || /\bhost\b/.test(n) || /\bdm\b/.test(n);
}

export function clubSlug(name: string, fallback = `club-${Date.now()}`): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || fallback;
}

/**
 * Required-to-list fields. Missing first_15_script is a hard no-list.
 * Other empties also keep the room off the weekly plan.
 */
export function intakeErrors(draft: ClubDraft): string[] {
  const errors: string[] = [];
  if (!draft.name.trim()) errors.push('Name the room.');
  if (!draft.first_15_script.trim()) {
    errors.push('Write the first 15 minutes (what a newcomer actually does). Clubs without this are not listed.');
  }
  if (!draft.stay_leave.trim()) errors.push('Stay / leave — when to walk out.');
  if (!draft.weekly_hours.trim()) errors.push('Hours this actually meets.');
  if (!draft.not_fit_if.trim()) errors.push('Not a fit if.');
  if (!draft.walk_instruction.trim()) {
    errors.push('The walk instruction for the if-then. A place and a time — no host names.');
  }
  if (inventsHost(draft.walk_instruction) || inventsHost(draft.first_15_script)) {
    errors.push('Do not invent a host or a Say hi. Describe the room.');
  }
  if (!draft.slack_nights.length) errors.push('Which night this actually meets.');
  return errors;
}

export function wouldList(club: Pick<Club, 'first_15_script'>): boolean {
  return club.first_15_script.trim().length > 0;
}

export function draftToClub(draft: ClubDraft, now = Date.now()): Club | null {
  if (intakeErrors(draft).length) return null;
  const night = draft.slack_nights[0];
  const ifNight = NIGHT_PHRASE[night] ?? night.toLowerCase();
  const hours = draft.weekly_hours.trim();
  return {
    id: clubSlug(draft.name, `club-${now}`),
    name: draft.name.trim(),
    first_15_script: draft.first_15_script.trim(),
    stay_leave: draft.stay_leave.trim(),
    weekly_hours: hours,
    next_meeting: draft.next_meeting.trim() || hours,
    not_fit_if: draft.not_fit_if.trim(),
    drop_in_ok: draft.drop_in_ok,
    walk_instruction: draft.walk_instruction.trim().replace(/\.$/, ''),
    if_night_label: ifNight,
    slack_nights: draft.slack_nights,
  };
}
