export interface MockPerson {
  initials: string;
  name: string;
  year: string;
  note: string;
}

export interface MockClub {
  name: string;
  note: string;
}

export const MOCK_PEOPLE: MockPerson[] = [
  {
    initials: 'S',
    name: 'Sam',
    year: 'Junior',
    note: 'Left studio at 8 last week and stayed to finish a joint. Does not do involvement-fair small talk.',
  },
  {
    initials: 'N',
    name: 'Nico',
    year: 'Sophomore',
    note: 'Pickup soccer behind the rec when enough people show. Walks to the dining hall after lecture.',
  },
  {
    initials: 'A',
    name: 'Asha',
    year: 'Commuter',
    note: 'Sunday board-game night is the one room that worked. Drives home after a 3:30 most Thursdays.',
  },
];

export const MOCK_CLUBS: MockClub[] = [
  {
    name: 'Late Studio Shop',
    note: 'Makes a thing and starts on time. Show up, work, leave when the piece is done.',
  },
  {
    name: 'Rec Pickup',
    note: 'No roster. No 90-minute commitment. If enough people show, you play.',
  },
  {
    name: 'Sunday Suite Games',
    note: 'Still works if you miss a week. No retreat. No pledge. Usually done before 9.',
  },
];
