import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { planStore } from './adapter';
import {
  CAMPUS_PEOPLE_OPEN_COUNT,
  initialCampusState,
  loadCampus,
  saveCampus,
  type CampusState,
} from './campus';
import { cancelNotification, previewDayOfNotification, scheduleDayOfNotification } from './notifications';
import { isPeopleGateOpen } from './peopleGate';
import { armDayOfReminder } from './reminder';
import { CLUB_CATALOG, clubById, mergeCatalog, weeklySlate } from './slate';
import { initialPlanState, type AfterVisitRecord, type Club, type PlanState, type SafetyTarget } from './types';

interface PlanContextValue {
  state: PlanState;
  campus: CampusState;
  catalog: Club[];
  weekly: Club[];
  peopleOpen: boolean;
  ready: boolean;
  commitIllGo: (clubId: string, nextAction: string) => Promise<void>;
  previewReminder: () => Promise<boolean>;
  recordVisit: (visit: AfterVisitRecord) => void;
  reportTarget: (targetType: SafetyTarget, targetId: string, reason: string) => void;
  reportClub: (clubId: string, reason: string) => void;
  blockClub: (clubId: string, reason?: string) => void;
  blockPerson: (personId: string, reason?: string) => void;
  isBlocked: (clubId: string) => boolean;
  isPersonBlocked: (personId: string) => boolean;
  commitmentFor: (clubId: string) => PlanState['commitments'][number] | undefined;
  activeCommitment: PlanState['commitments'][number] | null;
  visitFor: (clubId: string) => AfterVisitRecord | undefined;
  findClub: (id: string) => Club | undefined;
  addOfficerClub: (club: Club) => 'listed' | 'missing-first-15';
  setCampusInterviewCount: (count: number) => void;
  reset: () => Promise<void>;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlanState>(initialPlanState);
  const [campus, setCampus] = useState<CampusState>(initialCampusState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([planStore.load(), loadCampus()]).then(([saved, campusSaved]) => {
      if (cancelled) return;
      setState({ ...initialPlanState(), ...saved, blockedPersonIds: saved.blockedPersonIds ?? [] });
      setCampus(campusSaved);
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

  useEffect(() => {
    if (!ready) return;
    saveCampus(campus);
  }, [ready, campus]);

  const catalog = useMemo(
    () => mergeCatalog(CLUB_CATALOG, campus.officerClubs),
    [campus.officerClubs],
  );
  const weekly = useMemo(
    () => weeklySlate(catalog, state.blockedClubIds),
    [catalog, state.blockedClubIds],
  );
  const peopleOpen = isPeopleGateOpen(campus.interviewCount);

  const value = useMemo<PlanContextValue>(() => {
    const activeCommitment =
      state.commitments.find((item) => item.clubId === state.activeClubId) ??
      state.commitments[state.commitments.length - 1] ??
      null;

    return {
      state,
      campus,
      catalog,
      weekly,
      peopleOpen,
      ready,
      async commitIllGo(clubId, nextAction) {
        const previousId = state.reminder?.notificationId;
        await cancelNotification(previousId);
        const notice = await scheduleDayOfNotification(nextAction);
        const reminder = armDayOfReminder(clubId, nextAction, Date.now(), {
          notificationId: notice.notificationId,
          scheduledFor: notice.scheduledFor,
          notificationReason: notice.reason,
        });
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
      async previewReminder() {
        const body = state.reminder?.nextAction ?? activeCommitment?.nextAction;
        if (!body) return false;
        const notice = await previewDayOfNotification(body);
        return notice.scheduled;
      },
      recordVisit(visit) {
        setState((prev) => ({
          ...prev,
          visits: [...prev.visits.filter((item) => item.clubId !== visit.clubId), visit],
        }));
      },
      reportTarget(targetType, targetId, reason) {
        setState((prev) => ({
          ...prev,
          safety: [
            ...prev.safety,
            {
              id: `report-${targetType}-${targetId}-${Date.now()}`,
              kind: 'report',
              targetType,
              targetId,
              reason: reason.trim(),
              createdAt: Date.now(),
            },
          ],
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
      blockPerson(personId, reason = '') {
        setState((prev) => ({
          ...prev,
          blockedPersonIds: prev.blockedPersonIds.includes(personId)
            ? prev.blockedPersonIds
            : [...prev.blockedPersonIds, personId],
          safety: [
            ...prev.safety,
            {
              id: `block-person-${personId}-${Date.now()}`,
              kind: 'block',
              targetType: 'person',
              targetId: personId,
              reason: reason.trim(),
              createdAt: Date.now(),
            },
          ],
        }));
      },
      isBlocked(clubId) {
        return state.blockedClubIds.includes(clubId);
      },
      isPersonBlocked(personId) {
        return state.blockedPersonIds.includes(personId);
      },
      commitmentFor(clubId) {
        return state.commitments.find((item) => item.clubId === clubId);
      },
      activeCommitment,
      visitFor(clubId) {
        return state.visits.find((item) => item.clubId === clubId);
      },
      findClub(id) {
        return clubById(id, catalog);
      },
      addOfficerClub(club) {
        if (!club.first_15_script.trim()) return 'missing-first-15';
        setCampus((prev) => ({
          ...prev,
          officerClubs: [...prev.officerClubs.filter((item) => item.id !== club.id), club],
        }));
        return 'listed';
      },
      setCampusInterviewCount(count) {
        setCampus((prev) => ({ ...prev, interviewCount: count }));
      },
      async reset() {
        await cancelNotification(state.reminder?.notificationId);
        await planStore.clear();
        setState(initialPlanState());
      },
    };
  }, [ready, state, campus, catalog, weekly, peopleOpen]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used inside PlanProvider');
  return ctx;
}

export { CAMPUS_PEOPLE_OPEN_COUNT };
