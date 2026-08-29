import type { Living, Year } from '@/interview/types';

export interface SignupInput {
  email: string;
  firstName: string;
  year: Year;
  living: Living;
}

export interface SignupResult {
  email: string;
  firstName: string;
  year: Year;
  living: Living;
  schoolName: string;
}

/**
 * Swap point for school-email auth / Supabase later.
 * v1 accepts a local signup and never talks to a server.
 */
export interface AuthAdapter {
  completeSignup(input: SignupInput): Promise<SignupResult>;
}
