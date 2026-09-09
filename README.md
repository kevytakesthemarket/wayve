# Wayve

Campus friends + clubs for college students. Not dating.

This repo is the first-session interview plus a clubs-only weekly plan. An interview stays private. Other students only see a short public card the student edits. A later LLM can swap in for matching; v1 scores locally so it works offline. Club commitments are local too, with a swap point for Supabase later.

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

School-email signup (~45s) → easy taps → three example profiles → belonging scene → last Thursday → optional third question (club-fit **or** friendship-shape) → member-check → public card → unlock (**3 clubs**, not 3 people) → home weekly plan.

Home is clubs only:

- First-pass label
- 1–3 club cards this week (exactly 3 when a slate exists; one is drop-in / low commitment)
- Each card: name, `first_15_script`, stay/leave, weekly hours / next meeting, `not_fit_if`, one if-then `next_action`
- **I'll go** writes that same if-then. No Say hi. No message box.
- Honest gap line when a facet is empty
- People stay off home until ~40–60 interviews exist. No people grid.

After I'll go:

- Day-of reminder restates the committed `next_action` (no new inventing)
- After a visit: stay past 15? go back next week? plus “What was true in the room that wasn't in the profile?” Tags: `stay_past_15`, `return_14d`
- Report and block from day one
- Public card editor (interview stays private)

Hard bans still hold: no swipe UI, chat inbox, personality quiz, major/year filters, “similar to you” score, dating chrome, invented hosts.

## Architecture (for later)

| Swap later | Today | File |
| --- | --- | --- |
| LLM interview scorer | Local heuristic | `src/scoring/index.ts` (`InterviewScorer`) |
| School-email auth / Supabase | Local signup | `src/auth/local.ts` (`AuthAdapter`) |
| Club catalog / Supabase | Mock campus slate | `src/plan/slate.ts` (`Club`) |
| Commitments, visits, safety | AsyncStorage | `src/plan/adapter.ts` (`PlanAdapter`) |
| Push / local notification | Persist the same next_action | `src/plan/reminder.ts` |

Interview state lives in `src/interview/context.tsx`. Weekly-plan state lives in `src/plan/context.tsx`. Screens are Expo Router files under `src/app/`.

## Checks

```bash
npm test
npm run typecheck
```
