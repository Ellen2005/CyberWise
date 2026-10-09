# Security model

WiseTap teaches cybersecurity, so it must demonstrate the practices it teaches.
This document states the trust model honestly: what is enforced, what is
best-effort, and what still needs a trusted server.

## Enforced

- **No self-granted admin.** `firestore.rules` forbids clients from writing the
  `role` field on user profiles. Admin access is granted only by editing the
  user document in the Firebase console (or another trusted server process).
  The admin console additionally checks `role == 'admin'` client-side for UI
  gating, but every privileged read/write is enforced by the rules.
- **Owner-only data.** Profiles, attempts, risk checks, incident reports, saved
  articles, and class memberships are readable/writable only by their owner
  (plus narrowly scoped admin reads). Community posts are public only after
  moderator approval; authors see their own pending posts.
- **Secrets stay server-side.** `GEMINI_API_KEY`, `CRON_SECRET`, and
  `FIREBASE_SERVICE_ACCOUNT_JSON` are server environment variables only.
  Firebase client keys in `src/firebase/config.ts` are public identifiers by
  design; protection comes from the rules, API restrictions, and authorized
  domains — never from hiding them.
- **Input validation.** All server actions validate with Zod (length caps
  included). AI outputs are schema-constrained.
- **Security headers** are set in `next.config.ts` (frame denial, MIME
  sniffing protection, referrer and permissions policies).

## Best-effort (documented, not oversold)

- **Per-IP rate limiting** (`src/lib/security/rate-limiter.ts`) is in-memory
  and therefore per-instance. On serverless deployments each instance counts
  separately. Treat it as abuse friction, not a guarantee. AI actions are
  additionally capped by design (short outputs, low call counts).
- **Middleware route protection** checks a client-written session cookie, so it
  is UX routing, not an authentication boundary. Real data protection lives in
  Firestore rules and server-side checks.
- **Progress integrity (XP, badges, streaks)** is currently client-awarded:
  the client submits completions and computes awards. A motivated user could
  inflate their own totals. Do not treat XP/leaderboards/certificates as
  tamper-proof evidence until awarding moves server-side (planned: validate
  attempts and mint XP in a trusted function; see roadmap below).
- **AI news** must be source-grounded (see README verification status).
  Fictional or filler items are never acceptable in the feed.

## Operational checklist

- Rotate any API key that was ever committed or pasted publicly.
- After changing `firestore.rules`: `firebase deploy --only firestore:rules`.
- After deploying: add the domain to Authentication → Authorized domains.
- Grant admin by setting `role: 'admin'` on the user document in the console.
- Review `communityPosts` pending queue and `feedback` reports regularly.

## Roadmap (trusted server)

1. Server-side XP minting from validated attempts.
2. Firestore rules unit tests in CI (emulator).
3. Content-Security-Policy and dependency scanning in CI.
