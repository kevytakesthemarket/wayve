import { heuristicScorer } from './heuristic';
import type { InterviewScorer } from './types';

/**
 * Active scorer. v1 is offline heuristics so Expo Go works without a key.
 * Later: swap in an LLM implementation that satisfies InterviewScorer.
 */
export const scorer: InterviewScorer = heuristicScorer;

export type { AnswerAnalysis, InterviewScorer } from './types';
export { heuristicScorer } from './heuristic';
export { defaultPublicCard } from './heuristic';
