import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { initialInterviewState } from '../interview/types';
import { CLICHE_BOUNCE_COPY } from './cliches';
import {
  analyzeAnswer,
  defaultPublicCard,
  emptyFacetNote,
  extractBullets,
  heuristicScorer,
  isClicheOnly,
  nextAnswerAction,
  pickFacetQuestion,
  scoreInterview,
} from './heuristic';

describe('cliché detection', () => {
  it('treats good vibes as cliché-only', () => {
    assert.equal(isClicheOnly('good vibes'), true);
    assert.equal(analyzeAnswer('good vibes').isClicheOnly, true);
    assert.equal(analyzeAnswer('good vibes').hasScene, false);
  });

  it('treats looking for my people / idk / n/a as cliché-only', () => {
    assert.equal(isClicheOnly('looking for my people'), true);
    assert.equal(isClicheOnly('idk'), true);
    assert.equal(isClicheOnly('n/a'), true);
    assert.equal(isClicheOnly('genuine connections'), true);
  });

  it('does not bounce a real night that mentions fun', () => {
    const text =
      'Last Thursday I left studio at 8, ate a burrito on the floor, and it was actually fun until 11.';
    assert.equal(isClicheOnly(text), false);
    assert.equal(analyzeAnswer(text).hasScene, true);
  });
});

describe('scene detection', () => {
  it('flags adjectives and one-word answers as thin / no scene', () => {
    assert.equal(analyzeAnswer("I'm a good friend").hasScene, false);
    assert.equal(analyzeAnswer('outgoing').isThin, true);
    assert.equal(analyzeAnswer('chill').hasScene, false);
  });

  it('sees a belonging scene', () => {
    const text =
      'The one time I thought these are my people was a Sunday board-game night in a suite I was only in because my cousin lives there.';
    assert.equal(analyzeAnswer(text).hasScene, true);
  });
});

describe('facet scoring and screen 5', () => {
  it('marks the primary facet 0 if they submit a cliché after the bounce', () => {
    const state = initialInterviewState();
    state.energy = 'A small table';
    state.belonging = {
      text: 'good vibes',
      probed: false,
      clicheBounced: true,
      acceptedCliche: true,
    };
    const scores = scoreInterview(state);
    assert.equal(scores.values, 0);
    assert.equal(scores.socialEnergy, 1);
  });

  it('asks the thinner of club-fit vs friendship-shape', () => {
    const state = initialInterviewState();
    state.thursday = {
      text: 'Last Thursday I sat next to someone in lecture and walked to the dining hall. That friendship actually fit my week.',
      probed: false,
      clicheBounced: false,
      acceptedCliche: false,
    };
    const scores = scoreInterview(state);
    assert.ok(scores.friendshipShape >= 1);
    assert.equal(pickFacetQuestion(scores), 'club-fit');
  });

  it('asks a third question when both club and friendship are still thin', () => {
    const state = initialInterviewState();
    state.energy = 'Doing something next to people (not really with them)';
    state.belonging = {
      text: "I'm a good friend.",
      probed: true,
      clicheBounced: false,
      acceptedCliche: false,
    };
    state.thursday = {
      text: 'Went home and slept.',
      probed: true,
      clicheBounced: false,
      acceptedCliche: false,
    };
    const scores = scoreInterview(state);
    assert.ok(scores.clubStayLeave < 2);
    assert.ok(scores.friendshipShape < 2);
    assert.equal(pickFacetQuestion(scores), 'club-fit');
  });

  it('skips screen 5 when both club and friendship already look palpable', () => {
    const state = initialInterviewState();
    state.belonging = {
      text: 'Sunday board-game night in a suite. I would stay past 15 minutes at a club that makes a thing and starts on time. I would leave a mixer.',
      probed: false,
      clicheBounced: false,
      acceptedCliche: false,
    };
    state.thursday = {
      text: 'Last Thursday I left studio at 8 and walked to the dining hall with someone from lecture. I wanted people until 9, then I wanted out. A friendship that fits my week is sitting next to someone in class.',
      probed: false,
      clicheBounced: false,
      acceptedCliche: false,
    };
    const scores = scoreInterview(state);
    assert.equal(pickFacetQuestion(scores), null);
  });
});

describe('member-check bullets', () => {
  it('only restates their phrases — no invented personality labels', () => {
    const state = initialInterviewState();
    state.energy = 'A small table';
    state.slackNights = ['Friday night', 'Saturday'];
    state.belonging = {
      text: 'Sunday board-game night in a suite. I would leave a mixer.',
      probed: false,
      clicheBounced: false,
      acceptedCliche: false,
    };
    const bullets = extractBullets(state);
    assert.ok(bullets.length >= 4 && bullets.length <= 6);
    assert.ok(bullets.some((b) => b.includes('board-game night')));
    assert.ok(bullets.some((b) => b.includes('Friday night')));
    assert.ok(bullets.some((b) => b.includes('A small table')));
    const joined = bullets.join(' ').toLowerCase();
    assert.equal(joined.includes('introvert'), false);
    assert.equal(joined.includes("you're"), false);
  });

  it('defaults the public card to the first two concrete bullets', () => {
    const bullets = [
      'Sunday board-game night in a suite.',
      'I would leave a mixer.',
      'Nights with slack this month: Friday night',
    ];
    const card = defaultPublicCard(bullets);
    assert.ok(card.includes('board-game'));
    assert.ok(card.includes('mixer'));
  });

  it('says we still do not know Thursday when that picture is empty', () => {
    const state = initialInterviewState();
    state.scores = scoreInterview(state);
    const note = emptyFacetNote(state);
    assert.equal(note, "We still don't know what a good Thursday looks like for you.");
  });
});

describe('answer gate', () => {
  it('bounces a cliché once, then accepts it', () => {
    assert.equal(nextAnswerAction('good vibes', { clicheBounced: false, probed: false }), 'bounce');
    assert.equal(nextAnswerAction('good vibes', { clicheBounced: true, probed: false }), 'accept');
  });

  it('probes a thin non-cliché once, then lets them move on', () => {
    assert.equal(nextAnswerAction("I'm a good friend.", { clicheBounced: false, probed: false }), 'probe');
    assert.equal(nextAnswerAction("I'm a good friend.", { clicheBounced: false, probed: true }), 'accept');
  });
});

describe('scorer contract', () => {
  it('exposes the swap-point methods', () => {
    assert.equal(typeof heuristicScorer.analyzeAnswer, 'function');
    assert.equal(typeof heuristicScorer.scoreInterview, 'function');
    assert.equal(typeof heuristicScorer.pickFacetQuestion, 'function');
    assert.ok(CLICHE_BOUNCE_COPY.includes('type of person'));
  });
});
