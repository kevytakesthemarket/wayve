# Wayve

Campus friends + clubs for college students. Not dating.

This repo is the v1 Expo app Kevin can tap through in Expo Go: school-email gate, first-session interview, clubs-only weekly plan, I'll go → if-then, day-of reminder, after-visit, report/block. An interview stays private. Other students only see a short public card the student edits. A later LLM can swap in for matching; v1 scores locally so it works offline. Club commitments are local too, with a swap point for Supabase later.

Visual: wayve.bio chrome (purple→blue canvas, zinc header/footer, script logo, Georgia italic titles, gradient CTAs) — still friends+clubs, not FreedomFest / dating chrome.

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

Web (layout check only): `npm run web`. Local notifications do not fire on web; the day-of reminder **screen** still restates the committed if-then. On a phone in Expo Go, I'll go also arms a local notification with that same line. The reminder screen can preview it a few seconds out so you do not wait until Thursday 5pm.

## What v1 includes

School-email signup (~45s, `.edu` required) → easy taps → three example profiles → belonging scene → last Thursday → optional third question (club-fit **or** friendship-shape) → member-check → public card → unlock (**3 clubs**, not 3 people) → home weekly plan.

Home is clubs only:

- First-pass label
- 1–3 club cards this week (exactly 3 when a slate exists; one is drop-in / low commitment)
- Each card: name, `first_15_script`, stay/leave, weekly hours / next meeting, `not_fit_if`, one if-then `next_action`
- **I'll go** writes that same if-then. No Say hi. No message box.
- Honest gap line when a facet is empty
- People stay off home until ~40–60 interviews exist on the campus (Campus settings can simulate 50). Then a club may show **also at this meeting** — never a people grid, never a DM.

After I'll go:

- Day-of reminder restates the committed `next_action` (screen always; local notification in Expo Go when allowed)
- After a visit: stay past 15? go back next week? plus “What was true in the room that wasn't in the profile?” Tags: `stay_past_15`, `return_14d`
- Report and block from day one (clubs; people too once the gate is open)
- Public card editor (interview stays private)

Club officers can list a room (`Club officers: list a room` on home). Required to list: `first_15_script` (newcomer body), stay/leave, hours, `not_fit_if`, `drop_in_ok`. Clubs missing `first_15_script` are not listed. Seeded mocks already pass the rule.

Hard bans still hold: no swipe UI, chat inbox, personality quiz, major/year filters, “similar to you” score, dating chrome, invented hosts, FreedomFest copy.

## Architecture (for later)

| Swap later | Today | File |
| --- | --- | --- |
| LLM interview scorer | Local heuristic | `src/scoring/index.ts` (`InterviewScorer`) |
| School-email auth / Supabase | Local signup, `.edu` gate | `src/auth/local.ts` (`AuthAdapter`) |
| Club catalog / Supabase | Mock campus slate + officer intake | `src/plan/slate.ts` (`Club`) |
| Commitments, visits, safety | AsyncStorage | `src/plan/adapter.ts` (`PlanAdapter`) |
| Push / local notification | Same `next_action` body | `src/plan/reminder.ts`, `src/plan/notifications.ts` |
| People after ~50 interviews | Campus mock flag | `src/plan/peopleGate.ts`, `src/app/campus.tsx` |

Interview state lives in `src/interview/context.tsx`. Weekly-plan state lives in `src/plan/context.tsx`. Screens are Expo Router files under `src/app/`.

## Checks

```bash
npm test
npm run typecheck
```
