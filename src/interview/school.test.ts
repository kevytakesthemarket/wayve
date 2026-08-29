import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { looksLikeEmail, schoolFromEmail } from './school';

describe('schoolFromEmail', () => {
  it('maps known .edu domains', () => {
    assert.equal(schoolFromEmail('sam@northwestern.edu'), 'Northwestern');
    assert.equal(schoolFromEmail('nico@u.northwestern.edu'), 'Northwestern');
    assert.equal(schoolFromEmail('asha@umich.edu'), 'Michigan');
  });

  it('falls back to a title-cased domain slug', () => {
    assert.equal(schoolFromEmail('you@campus.edu'), 'Campus');
    assert.equal(schoolFromEmail('not-an-email'), 'your school');
  });

  it('validates email shape', () => {
    assert.equal(looksLikeEmail('you@school.edu'), true);
    assert.equal(looksLikeEmail('nope'), false);
  });
});
