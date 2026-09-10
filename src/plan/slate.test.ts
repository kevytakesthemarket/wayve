import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPeopleGateOpen, PEOPLE_GATE_MIN_INTERVIEWS } from './peopleGate';
import { reminderBody } from './reminder';
import { CLUB_CATALOG, hasFirst15, weeklySlate } from './slate';
import type { Club } from './types';

describe('weekly slate', () => {
  it('ships exactly 3 campus clubs, one drop-in, all with a first-15 script', () => {
    const slate = weeklySlate();
    assert.equal(slate.length, 3);
    assert.equal(slate.filter((club) => club.drop_in_ok).length, 1);
    assert.ok(slate.every((club) => hasFirst15(club)));
    assert.ok(slate.some((club) => club.id === 'pickup-soccer' && club.drop_in_ok));
  });

  it('caps the week at 3 and keeps a drop-in when one exists', () => {
    const extra = { ...CLUB_CATALOG[0], id: 'zine-table', name: 'Union Zine Table', drop_in_ok: false };
    const slate = weeklySlate([extra, ...CLUB_CATALOG.filter((club) => !club.drop_in_ok), CLUB_CATALOG[1]]);
    assert.equal(slate.length, 3);
    assert.equal(slate.filter((club) => club.drop_in_ok).length, 1);
    assert.ok(slate.some((club) => club.id === 'pickup-soccer'));
  });

  it('does not list a club that lacks first_15_script', () => {
    const ghost: Club = {
      ...CLUB_CATALOG[0],
      id: 'nameless-mixer',
      name: 'Nameless Mixer',
      first_15_script: '   ',
    };
    const slate = weeklySlate([...CLUB_CATALOG, ghost]);
    assert.equal(slate.some((club) => club.id === 'nameless-mixer'), false);
    assert.equal(slate.length, 3);
  });

  it('drops blocked clubs and does not invent a replacement', () => {
    const slate = weeklySlate(CLUB_CATALOG, ['sculpture-studio']);
    assert.equal(slate.length, 2);
    assert.equal(slate.some((club) => club.id === 'sculpture-studio'), false);
  });

  it('does not put a host name on the club row', () => {
    const blob = JSON.stringify(CLUB_CATALOG).toLowerCase();
    assert.equal(blob.includes('maya'), false);
    assert.equal(blob.includes('meet '), false);
    assert.equal(blob.includes('say hi'), false);
  });
});

describe('people gate', () => {
  it('stays closed until ~40–60 interviews exist', () => {
    assert.equal(PEOPLE_GATE_MIN_INTERVIEWS, 50);
    assert.equal(isPeopleGateOpen(0), false);
    assert.equal(isPeopleGateOpen(39), false);
    assert.equal(isPeopleGateOpen(50), true);
  });
});

describe('reminder hook', () => {
  it('restates the committed next_action and does not invent a new one', () => {
    const nextAction =
      "If it's Thursday night and you're still on campus, walk to the south-wing studio at 7.";
    assert.equal(reminderBody({ clubId: 'sculpture-studio', nextAction, armedAt: 1 }), nextAction);
    assert.equal(reminderBody(null), null);
  });
});
