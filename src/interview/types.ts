export const YEARS = ['First-year', 'Sophomore', 'Junior', 'Senior', 'Grad'] as const;
export type Year = (typeof YEARS)[number];

export const LIVING = ['Residential', 'Commuter'] as const;
export type Living = (typeof LIVING)[number];

export const SLACK_NIGHTS = [
  'Weeknights after class',
  'Thursday night',
  'Friday night',
  'Saturday',
  'Sunday',
  'Honestly not many right now',
] as const;
export type SlackNight = (typeof SLACK_NIGHTS)[number];

export const ENERGIES = [
  'One person',
  'A small table',
  'A loud room',
  'Doing something next to people (not really with them)',
] as const;
export type Energy = (typeof ENERGIES)[number];

export const FACETS = [
  'socialEnergy',
  'activity',
  'values',
  'friendshipShape',
  'clubStayLeave',
] as const;
export type Facet = (typeof FACETS)[number];
export type FacetScore = 0 | 1 | 2;
export type FacetScores = Record<Facet, FacetScore>;

export type FacetQuestion = 'club-fit' | 'friendship-shape';

export type InterviewStep =
  | 'welcome'
  | 'signup'
  | 'taps'
  | 'examples'
  | 'belonging'
  | 'thursday'
  | 'facet'
  | 'member-check'
  | 'unlock';

export interface WrittenAnswer {
  text: string;
  photoUri?: string | null;
  probed: boolean;
  clicheBounced: boolean;
  acceptedCliche: boolean;
}

export interface Signup {
  email: string;
  firstName: string;
  year: Year | null;
  living: Living | null;
  schoolName: string;
}

export interface InterviewState {
  signup: Signup;
  slackNights: SlackNight[];
  energy: Energy | null;
  belonging: WrittenAnswer;
  thursday: WrittenAnswer;
  facetQuestion: FacetQuestion | null;
  facet: WrittenAnswer;
  skippedFacet: boolean;
  scores: FacetScores;
  summaryBullets: string[];
  publicCard: string;
  startedAt: number | null;
  step: InterviewStep;
}

export function emptyAnswer(): WrittenAnswer {
  return {
    text: '',
    photoUri: null,
    probed: false,
    clicheBounced: false,
    acceptedCliche: false,
  };
}

export function emptyScores(): FacetScores {
  return {
    socialEnergy: 0,
    activity: 0,
    values: 0,
    friendshipShape: 0,
    clubStayLeave: 0,
  };
}

export function initialInterviewState(): InterviewState {
  return {
    signup: {
      email: '',
      firstName: '',
      year: null,
      living: null,
      schoolName: 'your school',
    },
    slackNights: [],
    energy: null,
    belonging: emptyAnswer(),
    thursday: emptyAnswer(),
    facetQuestion: null,
    facet: emptyAnswer(),
    skippedFacet: false,
    scores: emptyScores(),
    summaryBullets: [],
    publicCard: '',
    startedAt: null,
    step: 'welcome',
  };
}
