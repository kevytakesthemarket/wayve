import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { draftToClub, intakeErrors, inventsHost, wouldList, type ClubDraft } from './intake';

function draft(overrides: Partial<ClubDraft> = {}): ClubDraft {
  return {
    name: 'Late Kitchen Shift',
    first_15_script:
      'Walk in the basement kitchen. Wash your hands. Take a station that is empty. The first 15 minutes is chopping — nobody assigns you a nametag.',
    stay_leave: 'Stay if people are cooking. Leave if it becomes a mixer.',
    weekly_hours: 'Tuesdays 6–8pm, basement kitchen',
    next_meeting: 'Tuesday 6pm, basement kitchen',
    not_fit_if: 'You need a pledge process or a 9pm social.',
    drop_in_ok: true,
    walk_instruction: 'walk to the basement kitchen at 6',
    slack_nights: ['Weeknights after class'],
    ...overrides,
  };
}

describe('club intake', () => {
  it('lists a complete room with a first_15_script', () => {
    const club = draftToClub(draft(), 1);
    assert.ok(club);
    assert.equal(club.id, 'late-kitchen-shift');
    assert.equal(wouldList(club), true);
    assert.equal(club.drop_in_ok, true);
    assert.equal(club.if_night_label, 'a weeknight after class');
  });

  it('does not list a club missing first_15_script', () => {
    const errors = intakeErrors(draft({ first_15_script: '   ' }));
    assert.ok(errors.some((line) => line.toLowerCase().includes('first 15')));
    assert.equal(draftToClub(draft({ first_15_script: '   ' })), null);
    assert.equal(wouldList({ first_15_script: '' }), false);
  });

  it('rejects invented hosts and Say hi on the walk instruction', () => {
    assert.equal(inventsHost('walk to the studio at 7'), false);
    assert.equal(inventsHost('meet Maya at the door'), true);
    assert.equal(inventsHost('Say hi and DM the host'), true);
    assert.equal(draftToClub(draft({ walk_instruction: 'meet Maya at the door' })), null);
  });
});
