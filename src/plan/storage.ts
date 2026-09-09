import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialPlanState, type PlanState } from './types';

export const PLAN_STORAGE_KEY = 'wayve.plan.v1';

/**
 * Local plan store. Later: Supabase rows for commitments, visits, safety.
 * Keep PlanState the wire shape.
 */
export async function loadPlan(): Promise<PlanState | null> {
  try {
    const raw = await AsyncStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlanState;
    return { ...initialPlanState(), ...parsed };
  } catch {
    return null;
  }
}

export async function savePlan(state: PlanState): Promise<void> {
  try {
    await AsyncStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Local-only slice; ignore quota / private-mode failures.
  }
}

export async function clearPlan(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PLAN_STORAGE_KEY);
  } catch {
    // ignore
  }
}
