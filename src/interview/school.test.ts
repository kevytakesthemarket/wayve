import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { looksLikeEmail, schoolFromEmail, isSchoolEmail } from './school';

describe('schoolFromEmail', () => {
  it('maps known .edu domains', () => {
    assert.equal(schoolFromEmail('sam@northwestern.edu'), 'Northwestern');
    assert.equal(schoolFromEmail('nico@u.northwestern.edu'), 'Northwestern');
    assert.equal(schoolFromEmail('asha@umich.edu'), 'Michigan');
  });

  it('falls back to a title-cased domain slug', () => {
    assert.equal(schoolFromEmail('you@campus.edu'), 'Campus');
    assert.equal(schoolFromEmail('not-an-email'), 'your school');
    assert.equal(schoolFromEmail('you@gmail.com'), 'your school');
  });

  it('validates email shape', () => {
    assert.equal(looksLikeEmail('you@school.edu'), true);
    assert.equal(looksLikeEmail('nope'), false);
  });

  it('gates personal inboxes out of the campus network', () => {
    assert.equal(isSchoolEmail('kevinb27@uw.edu'), true);
    assert.equal(isSchoolEmail('you@school.edu'), true);
    assert.equal(isSchoolEmail('nico@u.northwestern.edu'), true);
    assert.equal(isSchoolEmail('you@gmail.com'), false);
    assert.equal(isSchoolEmail('not-an-email'), false);
  });
});
