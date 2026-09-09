import type { InterviewState, Living, SlackNight } from '@/interview/types';

import type { Club } from './types';

const CLASS_TIME =
  /\b(\d{1,2}(?::\d{2})?\s?(?:a\.?m\.?|p\.?m\.?)|\d{1,2}:\d{2})\b/i;

const NONE: SlackNight = 'Honestly not many right now';

const NIGHT_PHRASE: Record<string, string> = {
  'Weeknights after class': 'a weeknight after class',
  'Thursday night': 'Thursday night',
  'Friday night': 'Friday night',
  Saturday: 'Saturday',
  Sunday: 'Sunday afternoon',
};

const WEEKDAY_NIGHT = /thursday|friday|weeknight|saturday|after class/i;

/**
 * Class time only from Thursday / belonging text, and only if it already appears.
 * Never invent a 3:30. Never read the facet answer for this.
 */
export function extractClassTime(thursdayText: string, belongingText: string): string | null {
  const fromThursday = thursdayText.match(CLASS_TIME);
  if (fromThursday?.[1]) return normalizeTime(fromThursday[1]);
  const fromBelonging = belongingText.match(CLASS_TIME);
  if (fromBelonging?.[1]) return normalizeTime(fromBelonging[1]);
  return null;
}

function normalizeTime(raw: string): string {
  return raw.replace(/\s+/g, '').replace(/a\.?m\.?/i, 'am').replace(/p\.?m\.?/i, 'pm');
}

export function pickIfNight(club: Club, slackNights: SlackNight[]): string {
  const usable = slackNights.filter((night) => night !== NONE);
  const overlap = usable.find((night) => club.slack_nights.includes(night));
  if (overlap) return NIGHT_PHRASE[overlap] ?? overlap.toLowerCase();
  return club.if_night_label;
}

export function livingClause(living: Living | null, classTime: string | null, night: string): string {
  const attachTime = Boolean(classTime) && WEEKDAY_NIGHT.test(night);
  if (attachTime && classTime) {
    return `you're still on campus after your ${classTime}`;
  }
  if (living === 'Commuter') return "you haven't driven home yet";
  return "you're still on campus";
}

/**
 * One if-then from nights_slack + residential/commuter (+ class time only when it
 * already appears in Thursday/belonging and the night is a weekday).
 * Example: "If it's Thursday night and you're still on campus, walk to the south-wing studio at 7."
 * Do not invent a host name.
 */
export function buildNextAction(club: Club, interview: InterviewState): string {
  const night = pickIfNight(club, interview.slackNights);
  const classTime = extractClassTime(interview.thursday.text, interview.belonging.text);
  const clause = livingClause(interview.signup.living, classTime, night);
  return `If it's ${night} and ${clause}, ${club.walk_instruction}.`;
}
