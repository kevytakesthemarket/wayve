/**
 * People stay off home until a real interview corpus exists (~40–60).
 * Prototype has no corpus, so the gate stays closed.
 * After the gate: optional "also at this meeting" on a club, never a people grid.
 */
export const PEOPLE_GATE_MIN_INTERVIEWS = 50;

export function isPeopleGateOpen(interviewCount = 0): boolean {
  return interviewCount >= PEOPLE_GATE_MIN_INTERVIEWS;
}
