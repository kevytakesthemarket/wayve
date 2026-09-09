import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { initialInterviewState } from '../interview/types';
import { buildNextAction, extractClassTime, livingClause, pickIfNight } from './nextAction';
import { CLUB_CATALOG, clubById } from './slate';

const studio = clubById('sculpture-studio')!;
const soccer = clubById('pickup-soccer')!;
const games = clubById('board-game-night')!;

describe('extractClassTime', () => {
  it('reads a time that already appears in Thursday text', () => {
    assert.equal(extractClassTime('I drive home after my 3:30.', ''), '3:30');
    assert.equal(extractClassTime('Last class was at 3:30pm and then I left.', ''), '3:30pm');
  });

  it('can read belonging, never invents a time', () => {
    assert.equal(extractClassTime('Went home and slept.', 'Sunday board-game night after my 4pm lab.'), '4pm');
    assert.equal(extractClassTime('Went home and slept.', 'Sunday board-game night in a suite.'), null);
  });
});

describe('pickIfNight', () => {
  it('uses the student slack night when it overlaps the club', () => {
    assert.equal(pickIfNight(studio, ['Thursday night']), 'Thursday night');
    assert.equal(pickIfNight(soccer, ['Weeknights after class']), 'a weeknight after class');
    assert.equal(pickIfNight(games, ['Sunday']), 'Sunday afternoon');
  });

  it('falls back to the club’s real night when slack does not overlap', () => {
    assert.equal(pickIfNight(studio, ['Saturday']), 'Thursday night');
    assert.equal(pickIfNight(studio, ['Honestly not many right now']), 'Thursday night');
  });
});

describe('livingClause', () => {
  it('keeps residential on campus and commuters from inventing a drive-home lie', () => {
    assert.equal(livingClause('Residential', null, 'Thursday night'), "you're still on campus");
    assert.equal(livingClause('Commuter', null, 'Thursday night'), "you haven't driven home yet");
  });

  it('attaches a real class time only on weekday nights', () => {
    assert.equal(
      livingClause('Commuter', '3:30', 'Thursday night'),
      "you're still on campus after your 3:30",
    );
    assert.equal(livingClause('Commuter', '3:30', 'Sunday afternoon'), "you haven't driven home yet");
  });
});

describe('buildNextAction', () => {
  it('builds the locked if-then shape from slack + living', () => {
    const state = initialInterviewState();
    state.signup.living = 'Residential';
    state.slackNights = ['Thursday night'];
    const line = buildNextAction(studio, state);
    assert.equal(
      line,
      "If it's Thursday night and you're still on campus, walk to the south-wing studio at 7.",
    );
  });

  it('uses Thursday class time when it already appears, and never invents a host', () => {
    const state = initialInterviewState();
    state.signup.living = 'Commuter';
    state.slackNights = ['Thursday night'];
    state.thursday.text = 'Most Thursdays I drive home after my 3:30.';
    const line = buildNextAction(studio, state);
    assert.equal(
      line,
      "If it's Thursday night and you're still on campus after your 3:30, walk to the south-wing studio at 7.",
    );
    assert.equal(/maya|meet [A-Z]/.test(line.toLowerCase()), false);
    for (const club of CLUB_CATALOG) {
      const built = buildNextAction(club, state);
      assert.match(built, /^If it's .+ and .+, .+\.$/);
      assert.equal(built.toLowerCase().includes('maya'), false);
      assert.equal(built.toLowerCase().includes('say hi'), false);
    }
  });

  it('does not read a class time out of the facet answer', () => {
    const state = initialInterviewState();
    state.signup.living = 'Residential';
    state.slackNights = ['Sunday'];
    state.facet.text = 'I leave after my 9pm lab.';
    const line = buildNextAction(games, state);
    assert.equal(
      line,
      "If it's Sunday afternoon and you're still on campus, walk to the union alcove at 4.",
    );
  });
});
