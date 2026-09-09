import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { planStore } from './adapter';
import { armDayOfReminder } from './reminder';
import { initialPlanState, type AfterVisitRecord, type PlanState } from './types';

interface PlanContextValue {
  state: PlanState;
  ready: boolean;
  commitIllGo: (clubId: string, nextAction: string) => void;
  recordVisit: (visit: AfterVisitRecord) => void;
  reportClub: (clubId: string, reason: string) => void;
  blockClub: (clubId: string, reason?: string) => void;
  isBlocked: (clubId: string) => boolean;
  commitmentFor: (clubId: string) => PlanState['commitments'][number] | undefined;
  activeCommitment: PlanState['commitments'][number] | null;
  visitFor: (clubId: string) => AfterVisitRecord | undefined;
  reset: () => Promise<void>;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlanState>(initialPlanState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    planStore.load().then((saved) => {
      if (cancelled) return;
      setState(saved);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    planStore.save(state);
  }, [ready, state]);

  const value = useMemo<PlanContextValue>(() => {
    const activeCommitment =
      state.commitments.find((item) => item.clubId === state.activeClubId) ??
      state.commitments[state.commitments.length - 1] ??
      null;

    return {
      state,
      ready,
      commitIllGo(clubId, nextAction) {
        const reminder = armDayOfReminder(clubId, nextAction);
        setState((prev) => ({
          ...prev,
          commitments: [
            ...prev.commitments.filter((item) => item.clubId !== clubId),
            { clubId, nextAction, committedAt: Date.now() },
          ],
          activeClubId: clubId,
          reminder,
        }));
      },
      recordVisit(visit) {
        setState((prev) => ({
          ...prev,
          visits: [...prev.visits.filter((item) => item.clubId !== visit.clubId), visit],
        }));
      },
      reportClub(clubId, reason) {
        setState((prev) => ({
          ...prev,
          safety: [
            ...prev.safety,
            {
              id: `report-${clubId}-${Date.now()}`,
              kind: 'report',
              targetType: 'club',
              targetId: clubId,
              reason: reason.trim(),
              createdAt: Date.now(),
            },
          ],
        }));
      },
      blockClub(clubId, reason = '') {
        setState((prev) => ({
          ...prev,
          blockedClubIds: prev.blockedClubIds.includes(clubId)
            ? prev.blockedClubIds
            : [...prev.blockedClubIds, clubId],
          safety: [
            ...prev.safety,
            {
              id: `block-${clubId}-${Date.now()}`,
              kind: 'block',
              targetType: 'club',
              targetId: clubId,
              reason: reason.trim(),
              createdAt: Date.now(),
            },
          ],
          activeClubId: prev.activeClubId === clubId ? null : prev.activeClubId,
          reminder: prev.reminder?.clubId === clubId ? null : prev.reminder,
        }));
      },
      isBlocked(clubId) {
        return state.blockedClubIds.includes(clubId);
      },
      commitmentFor(clubId) {
        return state.commitments.find((item) => item.clubId === clubId);
      },
      activeCommitment,
      visitFor(clubId) {
        return state.visits.find((item) => item.clubId === clubId);
      },
      async reset() {
        await planStore.clear();
        setState(initialPlanState());
      },
    };
  }, [ready, state]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used inside PlanProvider');
  return ctx;
}
