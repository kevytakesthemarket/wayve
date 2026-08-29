# Wayve

Campus friends + clubs for college students. Not dating.

This repo is the first-session interview: a short, text-rich onboarding students tap through in Expo Go. An interview stays private. Other students only see a short public card the student approves. A later LLM can swap in for matching; v1 scores locally so it works offline.

The leftover `halftone-waves-app.zip` on `main` is unused. Ignore it.

## Run on iOS or Android (Expo Go)

1. Install dependencies (once):

   ```bash
   npm install
   ```

2. Start Metro:

   ```bash
   npx expo start
   ```

3. Install [Expo Go](https://expo.dev/go) on your phone.
4. Scan the QR code.
   - iOS: Camera app or Expo Go
   - Android: Expo Go

Same commands via npm scripts: `npm start`, `npm run ios`, `npm run android`.

Web (layout check only): `npm run web`.

## What this slice includes

Signup (~45s) → easy taps → three example profiles → belonging scene → last Thursday → optional third question (club-fit **or** friendship-shape) → member-check → public card → FIRST PASS mocks (3 people, 3 clubs).

- One question per screen
- Soft cliché bounce once (“good vibes”), then accept and move on
- Heuristic facet scores `0/1/2` (no paid LLM)
- Answers persist in AsyncStorage on device
- Mock school name from the email domain

## Architecture (for later)

| Swap later | Today | File |
| --- | --- | --- |
| LLM interview scorer | Local heuristic | `src/scoring/index.ts` (`InterviewScorer`) |
| School-email auth / Supabase | Local signup | `src/auth/local.ts` (`AuthAdapter`) |

Interview state lives in `src/interview/context.tsx`. Screens are Expo Router files under `src/app/`.

## Checks

```bash
npm test
npm run typecheck
```
