import type { FacetQuestion, FacetScores, InterviewState } from '@/interview/types';

export interface AnswerAnalysis {
  hasScene: boolean;
  isClicheOnly: boolean;
  isThin: boolean;
  length: number;
  hasPlaceTime: boolean;
  hasProperNoun: boolean;
  hasContrast: boolean;
  hasActivity: boolean;
  hasFriendship: boolean;
  hasClub: boolean;
  hasSocial: boolean;
}

/**
 * Swap point for a later LLM scorer.
 * v1 is a local heuristic. Keep this interface stable.
 */
export interface InterviewScorer {
  analyzeAnswer(text: string): AnswerAnalysis;
  scoreInterview(state: InterviewState): FacetScores;
  pickFacetQuestion(scores: FacetScores): FacetQuestion | null;
  extractBullets(state: InterviewState): string[];
  emptyFacetNote(state: InterviewState): string | null;
}

/** Later: `export const scorer: InterviewScorer = llmScorer`. */
export type ScorerFactory = () => InterviewScorer;
