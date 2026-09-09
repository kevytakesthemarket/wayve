/**
 * People slate for after the 40–60 interview gate.
 * Home must not import this to fill the screen. No host names on club cards
 * unless the gate is open AND the id is a real row here.
 */
export interface PersonRow {
  id: string;
  name: string;
  note: string;
}

export const PEOPLE_SLATE: PersonRow[] = [
  {
    id: 'sam-studio',
    name: 'Sam',
    note: 'Left studio at 8 last week and stayed to finish a joint. Does not do involvement-fair small talk.',
  },
  {
    id: 'nico-rec',
    name: 'Nico',
    note: 'Pickup soccer behind the rec when enough people show. Walks to the dining hall after lecture.',
  },
  {
    id: 'asha-games',
    name: 'Asha',
    note: 'Sunday board-game night is the one room that worked. Drives home after a 3:30 most Thursdays.',
  },
];

export function personById(id: string): PersonRow | undefined {
  return PEOPLE_SLATE.find((row) => row.id === id);
}
