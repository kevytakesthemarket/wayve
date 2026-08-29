import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { auth } from '@/auth/local';
import type { SignupInput } from '@/auth/types';
import { defaultPublicCard, scorer } from '@/scoring';
import type { Energy, FacetQuestion, InterviewState, SlackNight, WrittenAnswer } from './types';
import { initialInterviewState } from './types';
import { clearInterview, loadInterview, saveInterview } from './storage';

interface InterviewContextValue {
  state: InterviewState;
  ready: boolean;
  completeSignup: (input: SignupInput) => Promise<void>;
  setTaps: (nights: SlackNight[], energy: Energy) => void;
  setBelonging: (answer: WrittenAnswer) => void;
  setThursday: (answer: WrittenAnswer) => { next: 'facet' | 'member-check'; question: FacetQuestion | null };
  setFacet: (answer: WrittenAnswer) => void;
  skipFacet: () => void;
  setSummary: (bullets: string[], publicCard: string) => void;
  reset: () => Promise<void>;
  markStep: (step: InterviewState['step']) => void;
}

const InterviewContext = createContext<InterviewContextValue | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InterviewState>(initialInterviewState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadInterview().then((saved) => {
      if (cancelled) return;
      if (saved) setState(saved);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveInterview(state);
  }, [ready, state]);

  const value = useMemo<InterviewContextValue>(
    () => ({
      state,
      ready,
      async completeSignup(input) {
        const result = await auth.completeSignup(input);
        setState({
          ...initialInterviewState(),
          signup: result,
          startedAt: Date.now(),
          step: 'taps',
        });
      },
      setTaps(nights, energy) {
        setState((prev) => ({ ...prev, slackNights: nights, energy, step: 'examples' }));
      },
      setBelonging(answer) {
        setState((prev) => ({ ...prev, belonging: answer, step: 'thursday' }));
      },
      setThursday(answer) {
        const draft = { ...state, thursday: answer };
        const scores = scorer.scoreInterview(draft);
        const question = scorer.pickFacetQuestion(scores);
        const next = question ? 'facet' : 'member-check';
        const bullets = !question ? scorer.extractBullets({ ...draft, scores }) : state.summaryBullets;
        setState({
          ...draft,
          scores,
          facetQuestion: question,
          skippedFacet: !question,
          summaryBullets: bullets,
          publicCard: !question ? defaultPublicCard(bullets) : state.publicCard,
          step: next,
        });
        return { next, question };
      },
      setFacet(answer) {
        setState((prev) => {
          const draft = { ...prev, facet: answer, skippedFacet: false };
          const scores = scorer.scoreInterview(draft);
          const bullets = scorer.extractBullets({ ...draft, scores });
          return {
            ...draft,
            scores,
            summaryBullets: bullets,
            publicCard: defaultPublicCard(bullets),
            step: 'member-check',
          };
        });
      },
      skipFacet() {
        setState((prev) => {
          const scores = scorer.scoreInterview(prev);
          const bullets = scorer.extractBullets({ ...prev, scores });
          return {
            ...prev,
            scores,
            summaryBullets: bullets,
            publicCard: defaultPublicCard(bullets),
            skippedFacet: true,
            step: 'member-check',
          };
        });
      },
      setSummary(bullets, publicCard) {
        setState((prev) => ({
          ...prev,
          summaryBullets: bullets.filter((b) => b.trim()),
          publicCard: publicCard.trim(),
          step: 'unlock',
        }));
      },
      async reset() {
        await clearInterview();
        setState(initialInterviewState());
      },
      markStep(step) {
        setState((prev) => ({ ...prev, step }));
      },
    }),
    [ready, state],
  );

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used inside InterviewProvider');
  return ctx;
}
