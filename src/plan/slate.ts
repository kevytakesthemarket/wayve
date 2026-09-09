import type { Club } from './types';

/**
 * Campus club catalog for the prototype.
 * A later Supabase table can replace this file; keep the Club shape stable.
 * Clubs without a first_15_script are never listed.
 */
export const CLUB_CATALOG: Club[] = [
  {
    id: 'sculpture-studio',
    name: 'South-wing Sculpture Studio',
    first_15_script:
      'Walk in through the shop door. Take a smock off the hook on the left. Sit at an empty wheel or bench and start wedging a ball of clay. The first 15 minutes is your hands in the material — nobody assigns you a partner or a nametag.',
    stay_leave:
      'Stay if someone is already making a thing and the room is quiet enough to hear the kiln fans. Leave if it turns into a mixer or an involvement-fair pitch.',
    weekly_hours: 'Thursdays 7–10pm, south-wing studio',
    next_meeting: 'Thursday 7pm, south-wing studio',
    not_fit_if: 'You need a social hour or a host to tell you where to stand before you can start.',
    drop_in_ok: false,
    walk_instruction: 'walk to the south-wing studio at 7',
    if_night_label: 'Thursday night',
    slack_nights: ['Thursday night', 'Weeknights after class'],
  },
  {
    id: 'pickup-soccer',
    name: 'Rec Pickup Soccer',
    first_15_script:
      'Walk behind the rec. Put your bag on the fence. Join whichever side is short a player. The first 15 minutes is just running — no roster check, no warm-up speech.',
    stay_leave:
      'Stay if they keep rotating people in when someone gets tired. Leave if it is a 90-minute commitment with a roster and a coach watching the door.',
    weekly_hours: 'Weeknights 6–7:30pm behind the rec, when enough people show',
    next_meeting: 'Next weeknight at 6pm, behind the rec',
    not_fit_if: 'You need a jersey, a season schedule, or someone to text you a lineup.',
    drop_in_ok: true,
    walk_instruction: 'walk behind the rec at 6',
    if_night_label: 'a weeknight after class',
    slack_nights: ['Weeknights after class', 'Thursday night', 'Friday night'],
  },
  {
    id: 'board-game-night',
    name: 'Sunday Union Games',
    first_15_script:
      'Sit at the open table in the union alcove. Watch a round. Say you will take the next seat. You do not have to bring a game. The first 15 minutes is listening to the rules out loud.',
    stay_leave:
      'Stay if people are teaching the rules as they go and you can miss a week. Leave if it is a closed campaign that started last semester or a pledge meeting.',
    weekly_hours: 'Sundays 4–8pm, union alcove',
    next_meeting: 'Sunday 4pm, union alcove',
    not_fit_if: 'You need a retreat, a pledge process, or a 9pm social.',
    drop_in_ok: false,
    walk_instruction: 'walk to the union alcove at 4',
    if_night_label: 'Sunday afternoon',
    slack_nights: ['Sunday', 'Saturday'],
  },
];

export function hasFirst15(club: Pick<Club, 'first_15_script'>): boolean {
  return club.first_15_script.trim().length > 0;
}

/** Clubs this week: required first-15, not blocked. Do not invent replacements. */
export function weeklySlate(catalog: Club[] = CLUB_CATALOG, blockedIds: string[] = []): Club[] {
  return catalog.filter((club) => hasFirst15(club) && !blockedIds.includes(club.id));
}

export function clubById(id: string, catalog: Club[] = CLUB_CATALOG): Club | undefined {
  return catalog.find((club) => club.id === id && hasFirst15(club));
}
