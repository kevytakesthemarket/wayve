import AsyncStorage from '@react-native-async-storage/async-storage';

import { PEOPLE_GATE_MIN_INTERVIEWS } from './peopleGate';
import type { Club } from './types';

export const CAMPUS_STORAGE_KEY = 'wayve.campus.v1';

/**
 * Campus-level prototype settings. Survives a student "start another first pass"
 * because the corpus and officer-listed rooms belong to the school, not the interview.
 */
export interface CampusState {
  /** Mock interview corpus size. People stay off clubs until this hits ~40–60. */
  interviewCount: number;
  officerClubs: Club[];
}

export function initialCampusState(): CampusState {
  return {
    interviewCount: 0,
    officerClubs: [],
  };
}

export const CAMPUS_PEOPLE_OPEN_COUNT = PEOPLE_GATE_MIN_INTERVIEWS;

export async function loadCampus(): Promise<CampusState> {
  try {
    const raw = await AsyncStorage.getItem(CAMPUS_STORAGE_KEY);
    if (!raw) return initialCampusState();
    const parsed = JSON.parse(raw) as Partial<CampusState>;
    return {
      ...initialCampusState(),
      interviewCount: typeof parsed.interviewCount === 'number' ? parsed.interviewCount : 0,
      officerClubs: Array.isArray(parsed.officerClubs) ? parsed.officerClubs : [],
    };
  } catch {
    return initialCampusState();
  }
}

export async function saveCampus(state: CampusState): Promise<void> {
  try {
    await AsyncStorage.setItem(CAMPUS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Local-only slice; ignore quota / private-mode failures.
  }
}

export async function clearCampus(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CAMPUS_STORAGE_KEY);
  } catch {
    // ignore
  }
}
