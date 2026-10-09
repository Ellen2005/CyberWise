# WiseTap

WiseTap (a CyberWise learning project) helps ordinary people recognize danger online, make good decisions, and know what to do when something goes wrong. It teaches digital safety through real-life situations — not technical lectures: interactive scenarios, spot-the-scam games, short lessons, stories, guided plans, facilitator-led youth sessions, and emergency checklists for students, young people, and non-technical users.

## Name

The product is **WiseTap**. **CyberWise** is the parent learning program it belongs to (sidebar footer, mentor description). If you see both names, that is intentional — not a leftover.

## How learning works here

Every interactive activity follows one loop: **See → Think → Decide → Consequence → Learn → Protect**. Scores reward careful investigation: guessing (selecting everything, including distractors) costs points. XP is awarded once per content; replays record attempts and say so instead of re-awarding.

## Verification status (actually run, not claimed)

| Check | Command | Status |
|---|---|---|
| Type-check | `npm run typecheck` | Passing, enforced in build |
| Unit tests | `npm test` | 80 passing (Vitest) |
| Production build | `npm run build` | Passing, 82+ prerendered pages |
| CI | GitHub Actions | Typecheck + tests + build on push/PR |

## Architecture

```text
Browser (PWA, EN/FR)
  │  Server Actions (validated with Zod, per-IP rate limits)
  ▼
Next.js 15 (App Router)
  ├── Genkit + Gemini ── AI tools, mentor, call personas (optional key;
  │                       every flow has an offline/scripted fallback)
  ├── Firebase Auth ──── email/password + Google
  └── Cloud Firestore ── profiles, attempts, risk checks, classes,
                          community posts, feedback (owner-scoped rules)
Scheduled: Vercel Cron → /api/news/refresh → shared cache (CISA KEV feed)
```

See `SECURITY.md` for the trust model: what is enforced (rules, validation,
headers, secrets handling) versus best-effort (in-memory rate limits, UX-only
route cookie, client-awarded XP) plus the server-side roadmap.

## What works without an AI key

Everything except live AI personas and judgments: all scenarios, simulators
(scripted scammer + rubric scoring), lessons, quizzes, risk check, plans,
stories, challenges, URL explainer, offline narration, and PWA mode. With a
key you additionally get the AI mentor, AI scam-call personas and judging,
and AI news impact explainers.

## Tech stack

- **Framework**: Next.js 15 (App Router) with React Server Actions
- **Language**: TypeScript (strict, build-enforced)
- **UI**: Tailwind CSS and shadcn/ui components
- **Backend**: Firebase Authentication and Cloud Firestore
- **AI**: Google Gemini via Genkit (optional; offline fallbacks everywhere)
- **Tests**: Vitest (`npm test`)
- **Threat intel**: CISA Known Exploited Vulnerabilities catalog (public feed, no key)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   Required for full functionality:
   - `NEXT_PUBLIC_FIREBASE_*` — from the Firebase console (Project settings > General > Your apps)
   - `GEMINI_API_KEY` — from Google AI Studio (only needed for AI tools and the AI mentor; everything else works without it)

3. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

4. Deploy Firestore rules and enable sign-in providers (Email/Password, Google) in the Firebase console. Add your deployed domain under Authentication > Settings > Authorized domains.

## Useful commands

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Create a production build            |
| `npm start`       | Serve the production build           |
| `npm test`        | Run the Vitest unit test suite       |
| `npm run typecheck` | Type-check the project (enforced; the build fails on type errors) |

## Deployment (Vercel)

1. Push to GitHub and import the repository in Vercel (Framework Preset: Next.js, defaults otherwise).
2. Add the environment variables listed above.
3. Deploy, then add the Vercel domain to Firebase Authentication > Authorized domains.

## Project structure

- `src/app/` — routes: dashboard, learn paths, simulators, stories, challenges, mentor, admin console
- `src/components/` — shared UI, learning widgets, icon mapping
- `src/lib/` — gamification engine, seed content, recommendations, security utilities
- `src/ai/` — Genkit flows (legitimacy scanner, advice generator, mentor, call personas)
- `firestore.rules` — Firestore security rules (deploy with `firebase deploy --only firestore:rules`)

## Known limitations and roadmap

- XP/leaderboards are client-awarded; treat them as motivational, not tamper-proof, until server-side minting lands.
- Rate limiting is per-instance (in-memory); production-grade shared limiting is planned.
- Scenario/lesson/story narratives are English-first with French UI; editorial French translation is in progress per library.
- No end-to-end browser tests yet; unit coverage focuses on engines, scoring, and content integrity.
- Full B2B workspaces and native mobile apps are out of scope until a paying pilot exists.
