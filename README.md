# WiseTap

WiseTap (a CyberWise learning project) helps ordinary people recognize danger online, make good decisions, and know what to do when something goes wrong. It teaches digital safety through real-life situations — not technical lectures: interactive scenarios, spot-the-scam games, short lessons, stories, guided plans, facilitator-led youth sessions, and emergency checklists for students, young people, and non-technical users.

## Tech stack

- **Framework**: Next.js 15 (App Router) with React Server Actions
- **Language**: TypeScript
- **UI**: Tailwind CSS and shadcn/ui components
- **Backend**: Firebase Authentication and Cloud Firestore
- **AI**: Google Gemini via Genkit (optional; the app works without an API key using built-in offline guidance)
- **Tests**: Vitest (`npm test`)

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
| `npm run typecheck` | Type-check the project (informational; `next.config.ts` currently skips type validation during builds due to incomplete Firebase packaging typings) |

## Deployment (Vercel)

1. Push to GitHub and import the repository in Vercel (Framework Preset: Next.js, defaults otherwise).
2. Add the environment variables listed above.
3. Deploy, then add the Vercel domain to Firebase Authentication > Authorized domains.

## Project structure

- `src/app/` — routes: dashboard, learn paths, simulators, stories, challenges, mentor, admin console
- `src/components/` — shared UI, learning widgets, icon mapping
- `src/lib/` — gamification engine, seed content, recommendations, security utilities
- `src/ai/` — Genkit flows (legitimacy scanner, advice generator, mentor, news)
- `firestore.rules` — Firestore security rules (deploy with `firebase deploy --only firestore:rules`)
