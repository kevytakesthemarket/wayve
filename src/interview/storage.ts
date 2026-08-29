import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialInterviewState, type InterviewState } from './types';

export const STORAGE_KEY = 'wayve.interview.v1';

export async function loadInterview(): Promise<InterviewState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InterviewState;
    return { ...initialInterviewState(), ...parsed };
  } catch {
    return null;
  }
}

export async function saveInterview(state: InterviewState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Local-only slice; ignore quota / private-mode failures.
  }
}

export async function clearInterview(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
