import type { FacetQuestion, FacetScores, InterviewState, WrittenAnswer } from '@/interview/types';
import { emptyScores } from '@/interview/types';
import { CLICHE_PHRASES } from './cliches';
import type { AnswerAnalysis, InterviewScorer } from './types';

const FILLERS = new Set([
  'i',
  'im',
  "i'm",
  'am',
  'just',
  'really',
  'very',
  'like',
  'a',
  'an',
  'the',
  'and',
  'to',
  'for',
  'with',
  'my',
  'me',
  'be',
  'being',
  'is',
  'are',
  'was',
  'were',
  'so',
  'too',
  'also',
  'or',
  'of',
  'in',
  'on',
  'at',
  'it',
  'that',
  'this',
  'people',
  'person',
  'someone',
  'who',
  'want',
  'wanna',
  'looking',
  'kinda',
  'pretty',
  'about',
  'because',
]);

const PLACE_TIME = [
  'studio',
  'sculpture',
  'dining hall',
  'dining',
  'rec center',
  'behind the rec',
  'the rec',
  'suite',
  'library',
  'dorm',
  'quad',
  'cafe',
  'café',
  'coffee',
  'lecture',
  'classroom',
  'class',
  'apartment',
  'house',
  'floor',
  'lab',
  'field',
  'gym',
  'union',
  'hall',
  'room',
  'kitchen',
  'common room',
  'basement',
  'roof',
  'bus',
  'train',
  'parking',
  'campus',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'weeknight',
  'afternoon',
  'evening',
  'morning',
  'night',
  'after class',
  'last week',
  'this week',
  'pickup',
  'involvement fair',
  'mixer',
  'meeting',
  'board-game',
  'board game',
  'board games',
];

const ACTIVITY = [
  'weld',
  'welding',
  'burrito',
  'soccer',
  'pickup',
  'studio',
  'make',
  'makes',
  'making',
  'played',
  'play',
  'walked',
  'walk',
  'drove',
  'drive',
  'ate',
  'cooked',
  'studied',
  'practiced',
  'built',
  'drew',
  'wrote',
  'ran',
  'watched',
  'helped',
  'left',
  'stayed',
  'sat',
  'sitting',
  'board-game',
  'board game',
  'rehearsal',
  'practice',
  'lab',
  'shift',
];

const CONTRAST = [
  'would leave',
  'would stay',
  'walk out',
  "don't",
  'dont',
  "didn't",
  'didnt',
  'do not',
  'instead',
  'rather',
  'but',
  'left because',
  'no pledge',
  'no retreat',
  'not a',
  'leave',
  'stay past',
  'stayed',
];

const FRIENDSHIP = [
  'weekly',
  'once a month',
  'from class',
  'in lecture',
  'group chat',
  'friendship',
  'sit next',
  'sitting next',
  'walk to',
  'walking to',
  'roommate',
  'suite',
  'cousin',
  'same class',
  'who was around',
  'someone in lecture',
  'dining hall',
];

const CLUB = [
  'club',
  'meeting',
  '15 minutes',
  'fifteen minutes',
  'mixer',
  'roster',
  'pledge',
  'retreat',
  'stay past',
  'starts on time',
  'miss a week',
  'involvement fair',
  'commitment',
  '90-minute',
  '90 minute',
];

const SOCIAL = [
  'one person',
  'small table',
  'loud room',
  'next to people',
  'wanted people',
  'want people',
  'wanted out',
  'want out',
  'who was around',
  'did not talk',
  "didn't talk",
  'new person',
  'alone',
  'by myself',
  'with them',
  'around',
];

const ADJECTIVES = new Set([
  'good',
  'nice',
  'fun',
  'chill',
  'cool',
  'great',
  'friendly',
  'kind',
  'easy',
  'social',
  'outgoing',
  'introverted',
  'extroverted',
  'genuine',
  'open',
  'positive',
  'happy',
]);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[^a-z0-9'/\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isClicheOnly(text: string): boolean {
  const n = normalize(text);
  if (!n) return true;
  let rest = ` ${n} `;
  let hadCliche = false;
  for (const phrase of CLICHE_PHRASES) {
    const padded = ` ${phrase} `;
    if (rest.includes(padded) || rest.includes(` ${phrase}`)) {
      if (n.includes(phrase)) {
        hadCliche = true;
        rest = rest.split(phrase).join(' ');
      }
    }
  }
  rest = rest.replace(/\s+/g, ' ').trim();
  const words = rest.split(' ').filter((w) => w && !FILLERS.has(w));
  if (hadCliche && words.length <= 2) return true;
  if (n === 'idk' || n === 'n/a' || n === 'na' || n === 'whatever' || n === 'fun') return true;
  return false;
}

export function hasProperNoun(text: string): boolean {
  const tokens = text.split(/\s+/);
  let sentenceStart = true;
  for (const raw of tokens) {
    const clean = raw.replace(/[^A-Za-z]/g, '');
    if (!clean) continue;
    if (!sentenceStart && /^[A-Z][a-zA-Z]{2,}/.test(clean)) return true;
    sentenceStart = /[.!?]$/.test(raw);
  }
  return false;
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

export function analyzeAnswer(text: string): AnswerAnalysis {
  const trimmed = text.trim();
  const n = normalize(trimmed);
  const cliche = isClicheOnly(trimmed);
  const words = n.split(' ').filter(Boolean);
  const content = words.filter((w) => !FILLERS.has(w));
  const thinByLength = words.length <= 3 || trimmed.length < 18;
  const thinAdj = content.length <= 3 && content.every((w) => ADJECTIVES.has(w) || CLICHE_PHRASES.includes(w as (typeof CLICHE_PHRASES)[number]));
  const isThin = cliche || thinByLength || thinAdj;

  const hasPlaceTime = includesAny(n, PLACE_TIME) || /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i.test(trimmed);
  const proper = hasProperNoun(trimmed);
  const hasContrast = includesAny(n, CONTRAST);
  const hasActivity = includesAny(n, ACTIVITY);
  const hasFriendship = includesAny(n, FRIENDSHIP);
  const hasClub = includesAny(n, CLUB);
  const hasSocial = includesAny(n, SOCIAL);
  const longEnough = trimmed.length >= 40;
  const sceneHits = [hasPlaceTime, hasActivity, proper, /\blast\b/.test(n)].filter(Boolean).length;
  const hasScene = !cliche && ((longEnough && sceneHits >= 1) || sceneHits >= 2);

  return {
    hasScene,
    isClicheOnly: cliche,
    isThin,
    length: trimmed.length,
    hasPlaceTime,
    hasProperNoun: proper,
    hasContrast,
    hasActivity,
    hasFriendship,
    hasClub,
    hasSocial,
  };
}

function bump(score: FacetScores, facet: keyof FacetScores, value: 1 | 2) {
  if (score[facet] < value) score[facet] = value;
}

function applyWritten(
  scores: FacetScores,
  answer: WrittenAnswer,
  primary: keyof FacetScores,
) {
  const analysis = analyzeAnswer(answer.text);
  if (!answer.text.trim()) return;
  if (answer.acceptedCliche || analysis.isClicheOnly) {
    scores[primary] = 0;
    return;
  }

  const strong = analysis.hasScene && (analysis.hasContrast || analysis.length > 80 || analysis.hasProperNoun);
  const mid = analysis.hasScene || (!analysis.isThin && analysis.length >= 40);

  if (analysis.hasSocial || primary === 'socialEnergy') {
    if (strong && (analysis.hasSocial || analysis.hasPlaceTime)) bump(scores, 'socialEnergy', 2);
    else if (mid || analysis.hasSocial) bump(scores, 'socialEnergy', 1);
  }
  if (analysis.hasActivity) bump(scores, 'activity', strong || (analysis.hasScene && analysis.hasActivity) ? 2 : 1);
  if (analysis.hasContrast || primary === 'values') {
    if (strong && analysis.hasContrast) bump(scores, 'values', 2);
    else if (mid || analysis.hasContrast) bump(scores, 'values', 1);
  }
  if (analysis.hasFriendship) bump(scores, 'friendshipShape', strong || analysis.hasScene ? 2 : 1);
  if (analysis.hasClub) bump(scores, 'clubStayLeave', strong || (analysis.hasScene && analysis.hasContrast) ? 2 : 1);

  if (primary === 'clubStayLeave') {
    if (analysis.hasScene) bump(scores, 'clubStayLeave', analysis.hasContrast ? 2 : 1);
    else if (!analysis.isThin) bump(scores, 'clubStayLeave', 1);
  }
  if (primary === 'friendshipShape') {
    if (analysis.hasScene) bump(scores, 'friendshipShape', 2);
    else if (!analysis.isThin) bump(scores, 'friendshipShape', 1);
  }
  if (primary === 'values' && analysis.hasScene) bump(scores, 'values', strong ? 2 : 1);
  if (primary === 'socialEnergy' && analysis.hasScene) bump(scores, 'socialEnergy', strong ? 2 : 1);
}

export function scoreInterview(state: InterviewState): FacetScores {
  const scores = emptyScores();

  if (state.energy) bump(scores, 'socialEnergy', 1);

  applyWritten(scores, state.belonging, 'values');
  applyWritten(scores, state.thursday, 'socialEnergy');
  if (state.facetQuestion === 'club-fit') {
    applyWritten(scores, state.facet, 'clubStayLeave');
  } else if (state.facetQuestion === 'friendship-shape') {
    applyWritten(scores, state.facet, 'friendshipShape');
  }

  return scores;
}

/** Skip screen 5 when both club-fit and friendship-shape already look palpable (2). */
export function pickFacetQuestion(scores: FacetScores): FacetQuestion | null {
  const club = scores.clubStayLeave;
  const friend = scores.friendshipShape;
  if (club >= 2 && friend >= 2) return null;
  if (club < friend) return 'club-fit';
  if (friend < club) return 'friendship-shape';
  return 'club-fit';
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
}

function concrete(sentence: string): boolean {
  const a = analyzeAnswer(sentence);
  return a.hasScene || a.hasPlaceTime || a.hasActivity || a.hasContrast;
}

export function extractBullets(state: InterviewState): string[] {
  const fromWriting: { text: string; weight: number }[] = [];
  for (const block of [state.belonging.text, state.thursday.text, state.facet.text]) {
    for (const sentence of splitSentences(block)) {
      const a = analyzeAnswer(sentence);
      if (a.isClicheOnly) continue;
      const weight = concrete(sentence) ? 3 : a.isThin ? 0 : 1;
      if (weight > 0) fromWriting.push({ text: sentence, weight });
    }
  }
  fromWriting.sort((a, b) => b.weight - a.weight);

  const bullets: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const text = raw.replace(/\s+/g, ' ').trim();
    const key = normalize(text);
    if (!text || seen.has(key) || bullets.length >= 6) return;
    seen.add(key);
    bullets.push(text);
  };

  for (const item of fromWriting) push(item.text);

  if (state.slackNights.length) {
    push(`Nights with slack this month: ${state.slackNights.join(', ')}`);
  }
  if (state.energy) {
    push(`Default energy: ${state.energy}`);
  }
  if (state.signup.living) {
    push(state.signup.living === 'Commuter' ? "I'm a commuter." : 'Residential.');
  }

  // Still short? use leftover writing even if thin — their words only.
  if (bullets.length < 4) {
    for (const block of [state.belonging.text, state.thursday.text, state.facet.text]) {
      const trimmed = block.trim();
      if (trimmed) push(trimmed);
    }
  }

  return bullets.slice(0, 6);
}

export function defaultPublicCard(bullets: string[]): string {
  const concreteBullets = bullets.filter((b) => concrete(b) && !b.startsWith('Nights with slack') && !b.startsWith('Default energy'));
  const pick = (concreteBullets.length ? concreteBullets : bullets).slice(0, 2);
  return pick.join(' ');
}

export function emptyFacetNote(state: InterviewState): string | null {
  const scores = state.scores;
  const thursdayThin = !state.thursday.text.trim() || state.thursday.acceptedCliche || !analyzeAnswer(state.thursday.text).hasScene;
  if (thursdayThin || scores.socialEnergy === 0) {
    return "We still don't know what a good Thursday looks like for you.";
  }
  if (scores.clubStayLeave === 0) {
    return "We still don't know what would make you stay past 15 minutes.";
  }
  if (scores.friendshipShape === 0) {
    return "We still don't know what a friendship that fits your week looks like.";
  }
  if (scores.activity === 0) {
    return "We still don't know what you do when you have a free night.";
  }
  if (scores.values === 0) {
    return "We still don't know what would make you walk out of a room.";
  }
  return null;
}

export type GateAction = 'bounce' | 'probe' | 'accept';

export function nextAnswerAction(
  text: string,
  flags: { clicheBounced: boolean; probed: boolean },
): GateAction {
  const analysis = analyzeAnswer(text);
  if (analysis.isClicheOnly && !flags.clicheBounced) return 'bounce';
  if (!analysis.hasScene && !analysis.isClicheOnly && !flags.probed) return 'probe';
  return 'accept';
}

export const heuristicScorer: InterviewScorer = {
  analyzeAnswer,
  scoreInterview,
  pickFacetQuestion,
  extractBullets,
  emptyFacetNote,
};
