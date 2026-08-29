import { schoolFromEmail } from '@/interview/school';

import type { AuthAdapter, SignupInput, SignupResult } from './types';

export const localAuth: AuthAdapter = {
  async completeSignup(input: SignupInput): Promise<SignupResult> {
    return {
      ...input,
      email: input.email.trim().toLowerCase(),
      firstName: input.firstName.trim(),
      schoolName: schoolFromEmail(input.email),
    };
  },
};

/** Active auth. Later: school-email magic link + Supabase session. */
export const auth: AuthAdapter = localAuth;
