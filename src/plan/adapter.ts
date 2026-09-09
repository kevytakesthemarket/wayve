import { clearPlan, loadPlan, savePlan } from './storage';
import { initialPlanState, type PlanState } from './types';

/**
 * Swap point for a later Supabase plan store.
 * v1 is AsyncStorage so Expo Go works offline.
 */
export interface PlanAdapter {
  load(): Promise<PlanState>;
  save(state: PlanState): Promise<void>;
  clear(): Promise<void>;
}

export const localPlan: PlanAdapter = {
  async load() {
    return (await loadPlan()) ?? initialPlanState();
  },
  save: savePlan,
  clear: clearPlan,
};

export const planStore: PlanAdapter = localPlan;
