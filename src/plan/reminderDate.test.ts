import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { nightFromNextAction, nextDayOfDate } from './reminderDate';

describe('day-of reminder clock', () => {
  it('reads the night from the committed if-then and does not invent a new sentence', () => {
    const line =
      "If it's Thursday night and you're still on campus, walk to the south-wing studio at 7.";
    assert.equal(nightFromNextAction(line), 'Thursday night');
  });

  it('fires Thursday night at 5pm on the next Thursday, not in the past', () => {
    const wednesday = new Date('2026-09-09T12:00:00');
    const fire = nextDayOfDate('Thursday night', wednesday);
    assert.equal(fire.getDay(), 4);
    assert.equal(fire.getHours(), 17);
    assert.ok(fire.getTime() > wednesday.getTime());
  });

  it('uses Sunday afternoon at 2pm', () => {
    const friday = new Date('2026-09-11T12:00:00');
    const fire = nextDayOfDate('Sunday afternoon', friday);
    assert.equal(fire.getDay(), 0);
    assert.equal(fire.getHours(), 14);
  });
});
