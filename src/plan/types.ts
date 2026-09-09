export type SafetyKind = 'report' | 'block';

/**
 * Club row for the weekly plan.
 * first_15_script is required — weeklySlate() drops any club that lacks it.
 * Host names do not live here. Do not invent a person on the card.
 */
export interface Club {
  id: string;
  name: string;
  first_15_script: string;
  stay_leave: string;
  weekly_hours: string;
  next_meeting: string;
  not_fit_if: string;
  drop_in_ok: boolean;
  /** Verb phrase after the if-then comma. Example: "walk to the south-wing studio at 7" */
  walk_instruction: string;
  /** Default night phrase when the student's slack nights do not overlap. */
  if_night_label: string;
  /** Slack-night labels that honestly match this club's real hours. */
  slack_nights: string[];
  /**
   * Real people-slate row ids who are also at this meeting.
   * Render "also at this meeting" only when the people gate is open.
   */
  also_at_meeting?: string[];
}

export interface CommittedAction {
  clubId: string;
  /** Exact if-then string shown when they tapped I'll go. Reminder restates this — no new inventing. */
  nextAction: string;
  committedAt: number;
}

export interface AfterVisitRecord {
  clubId: string;
  stay_past_15: boolean | null;
  return_14d: boolean | null;
  sceneNote: string;
  completedAt: number | null;
}

export interface SafetyRecord {
  id: string;
  kind: SafetyKind;
  targetType: 'club';
  targetId: string;
  reason: string;
  createdAt: number;
}

export interface ArmedReminder {
  clubId: string;
  nextAction: string;
  armedAt: number;
}

export interface PlanState {
  commitments: CommittedAction[];
  activeClubId: string | null;
  visits: AfterVisitRecord[];
  safety: SafetyRecord[];
  blockedClubIds: string[];
  reminder: ArmedReminder | null;
}

export function initialPlanState(): PlanState {
  return {
    commitments: [],
    activeClubId: null,
    visits: [],
    safety: [],
    blockedClubIds: [],
    reminder: null,
  };
}
