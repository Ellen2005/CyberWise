# CyberWise — Phase 1: Repository Assessment

**Date:** September 6, 2026
**Status:** Complete — awaiting approval before Phase 2

---

## 1. Current Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 15.3.8 (App Router, Turbopack) | Server Actions used instead of REST API routes |
| **Language** | TypeScript 5.x | `strict: true` in tsconfig, but build errors are ignored |
| **UI** | Tailwind CSS 3.4 + shadcn/ui (Radix primitives) | Dark-mode only, custom theme (electric blue #7DF9FF, lime green accent) |
| **Auth** | Firebase Auth 11.9 | Google OAuth (redirect) + Email/Password |
| **Database** | Firebase Firestore | 2 collections: `users`, `users/{uid}/savedArticles` |
| **AI** | Google Genkit 1.14 + Gemini 2.5 Flash | 5 structured AI flows + 1 password suggestion flow |
| **State** | React Context + custom hooks | No Redux/Zustand; Firebase provider + `useUser`, `useDoc`, `useCollection` |
| **Forms** | react-hook-form + zod | Used in login page; AI tools use Server Actions + `useActionState` |
| **Deployment** | Firebase App Hosting (`apphosting.yaml`) | Also Vercel/Railway instructions in README |

### Folder Structure (current)
```
src/
├── ai/                    # Genkit AI layer
│   ├── genkit.ts          # Genkit init (Gemini 2.5 Flash)
│   ├── dev.ts             # Dev entry for Genkit CLI
│   ├── ai-password-suggestion.ts
│   └── flows/
│       ├── legitimacy-scanner.ts
│       ├── breach-checker-flow.ts      # ⚠️ DEAD CODE — never used
│       ├── cybersecurity-advice-generator.ts
│       ├── cybersecurity-news-generator.ts
│       └── device-security-audit-flow.ts
├── app/                   # Next.js App Router pages
│   ├── layout.tsx         # Root layout with sidebar navigation
│   ├── page.tsx           # Dashboard (feature card grid)
│   ├── awareness/         # Awareness Hub (18 articles + 15 tips)
│   ├── login/             # Auth page (Google + Email/Password)
│   ├── news/              # AI-generated news feed
│   ├── profile/           # User profile + badges + security score
│   ├── saved/             # Saved articles
│   └── tools/             # 8 tools (7 pages + actions)
├── components/            # UI components (shadcn + custom)
├── firebase/              # Firebase client setup + hooks
├── hooks/                 # use-mobile, use-toast
└── lib/                   # articles.ts, phishing-emails.ts, placeholder-images
```

---

## 2. Current Features (Working)

### ✅ Fully Functional
1. **Dashboard** (`/`) — Grid of feature cards linking to all tools.
2. **Awareness Hub** (`/awareness`) — 18 in-depth articles + 15 "Quick Tips" with static content, images, categories. Static generation for article detail pages.
3. **Phishing Simulator** (`/tools/phishing-simulator`) — 13 realistic emails (7 phishing, 6 legitimate), shuffled, scored, with explanations. Awards "Phishing Detective" badge on perfect score (persisted to Firestore).
4. **Password Analyzer** (`/tools/password-analyzer`) — Client-side strength checker (length, case, numbers, symbols) with progress bar.
5. **Password Generator** (`/tools/password-generator`) — Manual generator (length slider, char-type toggles, copy) + AI suggestion tab.
6. **Legit Scanner** (`/tools/legit-scanner`) — AI-powered phishing/content scanner via Server Action → Genkit flow. Returns verdict (Safe/Suspicious/Malicious), confidence, reason, flags.
7. **Security Troubleshooter** (`/tools/device-scanner`) — AI-powered device-specific troubleshooting (iPhone/Android/Windows/Mac).
8. **AI Advisor** (`/tools/advice-generator`) — AI-generated personalized cybersecurity advice from user-described habits/vulnerabilities.
9. **News Feed** (`/news`) — AI-generated cybersecurity news with 5-min sessionStorage cache, fallback static news, and graceful error handling for quota/API-key issues.
10. **Account Recovery** (`/tools/account-recovery`) — Static accordion guides for Google/Facebook/Instagram/Apple recovery + DIY device fixes.
11. **Authentication** (`/login`) — Google OAuth redirect + Email/Password signup/signin with zod validation, auto-creates Firestore user doc.
12. **Profile** (`/profile`) — Avatar, name/email, badges display, Security Score checklist (7 items, 100-point scale).
13. **Saved Articles** (`/saved`) — Firestore-backed bookmarking with save/unsave toggle, empty state, skeleton loading.
14. **Breach Checker** (`/tools/breach-checker`) — Opens HaveIBeenPwned.com in a new tab (privacy-preserving redirect; does NOT check the email itself).

### ⚠️ Partially Functional / Questionable
- **Breach Checker** — The AI flow `breach-checker-flow.ts` exists but is **never used**. The component simply opens `haveibeenpwned.com` in a new tab. The AI flow generates *fictional* breaches, which would be misleading if wired up.
- **News Feed** — Content is AI-generated *fictional* news, labeled "AI-generated summary. Full article not available." This is acceptable for a demo but not real news.
- **Security Score** — Client-side only, not persisted to the user profile.

---

## 3. Existing Problems & Bugs

### 🔴 Critical
1. **Hardcoded Firebase API keys** in `src/firebase/config.ts` — committed to source control. While Firebase API keys are not secret per se, they should be in environment variables, and the project ID `studio-911075528-53737` is a Firebase Studio template leftover, not a CyberWise-branded project.
2. **`next.config.ts` disables TypeScript and ESLint error checking during builds** (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`). This means the app can ship with type errors and lint violations undetected.
3. **Firestore security rules are dangerously permissive:**
   - `match /users/{userId} { allow read; ... }` — **anyone** (even unauthenticated) can read **all** user profiles (names, emails, photos).
   - No field-level validation on writes — a user can write arbitrary fields to their own profile.
   - No rules for future collections (challenges, attempts, etc.).
4. **No rate limiting** on AI Server Actions — anyone can spam the Gemini API and exhaust quota/costs.
5. **No route protection middleware** — `/profile`, `/saved` handle unauthenticated users client-side only; there is no server-side redirect or protection.

### 🟠 High
6. **No tests at all** — zero unit, integration, or e2e tests.
7. **No `.env.example`** — developers don't know `GEMINI_API_KEY` is required.
8. **Package name is `"nextn"`** — not `"cyberwise"`.
9. **Sidebar links to `https://github.com/firebase/studio`** — wrong repo (Firebase Studio template leftover).
10. **`dangerouslySetInnerHTML` in Phishing Simulator** — XSS-risk pattern (currently safe because data is static, but a dangerous precedent).
11. **No error boundaries / `error.tsx` / `not-found.tsx` / `loading.tsx`** — poor UX on failures.
12. **No audit logging** — no record of user actions, admin actions, or security events.

### 🟡 Medium
13. **Dead code:** `breach-checker-flow.ts` is defined but never imported/used.
14. **Unused imports:** `layout.tsx` imports `Button` and `Bookmark` but never uses them.
15. **`FirebaseErrorListener` throws errors in dev mode** — could crash the dev server on permission errors.
16. **No SEO** — no per-page metadata, no sitemap, no robots.txt, no Open Graph tags.
17. **No accessibility audit** — some icon-only buttons lack `aria-label`; no focus-trap testing; no reduced-motion support.
18. **Security Score checklist state is not persisted** — resets on navigation.
19. **No pagination on News Feed** — 20 items rendered at once (acceptable but not scalable).
20. **README references port 9002** (Gitpod) but standard Next.js dev is 3000 — minor inconsistency.

---

## 4. Missing Features (vs. the CyberWise Vision)

| Vision Feature | Status |
|---------------|--------|
| 1. Cybersecurity Basics learning modules (structured courses/lessons) | ❌ Not present — only static articles |
| 2. Cyber Stories (interactive mystery narratives) | ❌ Not present |
| 3. Daily Cyber Challenge | ❌ Not present |
| 4. CTF System (flags, points, difficulty, hints, attempts, leaderboards, categories, history, achievements, XP) | ❌ Not present |
| 5. Safe Web Security Labs (XSS, SQLi, IDOR, CSRF, etc. in Docker sandboxes) | ❌ Not present |
| 6. AI Cyber Mentor (conversational, hint-based teaching) | ❌ Not present — only one-shot AI tools |
| 7. Adaptive Learning (track topics, performance, recommend path) | ❌ Not present |
| 8. Skill Tree (categories, prerequisites, unlock progression) | ❌ Not present |
| 9. Gamification (XP, levels, badges, streaks, leaderboards, ranks, daily/weekly challenges, milestones, certificates) | 🟡 Partial — only 1 badge (Phishing Detective) |
| 10. Real-World Simulations (phishing incident, company breach investigation) | ❌ Not present |
| 11. Security Career Paths (SOC Analyst, Pentester, etc.) | ❌ Not present |
| 12. User Dashboard (level, XP, streak, daily challenge, weak areas, learning path) | ❌ Not present — current "dashboard" is just a feature grid |
| 13. Admin Dashboard (manage challenges, users, courses, analytics) | ❌ Not present |
| 14. AI Challenge Generation (validated, sandboxed) | ❌ Not present — architecture not prepared for it |

---

## 5. Security Issues Summary

| # | Issue | Severity |
|---|-------|----------|
| 1 | Hardcoded Firebase config in source | 🔴 Critical |
| 2 | Firestore rules allow public read of all user profiles | 🔴 Critical |
| 3 | Build ignores TS/ESLint errors | 🔴 Critical |
| 4 | No rate limiting on AI endpoints | 🟠 High |
| 5 | No RBAC / roles / admin concept | 🟠 High |
| 6 | No route protection middleware | 🟠 High |
| 7 | No input sanitization pattern (dangerouslySetInnerHTML) | 🟠 High |
| 8 | No audit logging | 🟠 High |
| 9 | No CSRF-specific handling (relies on Next.js defaults) | 🟡 Medium |
| 10 | No secrets management / env validation | 🟡 Medium |
| 11 | No dependency vulnerability scanning in CI | 🟡 Medium |
| 12 | No security headers configuration (CSP, HSTS, etc.) | 🟡 Medium |

---

## 6. Technical Debt

1. **No test infrastructure** — no Vitest/Jest/Playwright setup.
2. **No CI/CD pipeline** — no GitHub Actions, no lint/typecheck/test gates.
3. **No linting/typecheck enforcement** — disabled in build.
4. **No structured logging or monitoring** — only `console.error`.
5. **No environment variable management** — `.env` is gitignored but no `.env.example`; config is hardcoded.
6. **Dead code** — `breach-checker-flow.ts`.
7. **Unused imports** — `layout.tsx`.
8. **No data layer abstraction** — Firestore calls are scattered across components.
9. **No error handling strategy** — ad-hoc try/catch with toast messages.
10. **No TypeScript types for Firestore documents** — `useDoc`/`useCollection` use generics loosely; `docs/backend.json` is the only schema reference.
11. **No pagination or query optimization** — all reads are full collection/doc fetches.
12. **No i18n** — English only (fine for now, but worth noting).

---

## 7. Recommended Architecture (Target)

### Keep (working well)
- **Next.js 15 App Router + TypeScript** — solid foundation.
- **Tailwind + shadcn/ui** — clean, consistent, accessible component system.
- **Firebase Auth** — works; add middleware protection + RBAC.
- **Firestore** — works; needs hardened rules + proper schema.
- **Genkit + Gemini** — works; needs rate limiting + structured flows.

### Add / Improve
1. **Environment management:** `.env.example`, validate `GEMINI_API_KEY` at startup, move Firebase config to env vars.
2. **Middleware:** route protection for authenticated pages.
3. **RBAC:** `role` field on user profiles (`user`, `admin`), Firestore rules enforcing it.
4. **Hardened Firestore rules:** no public reads, field validation, per-collection rules for all new entities.
5. **Rate limiting:** in-memory or Redis-based limiter on AI Server Actions.
6. **Data layer:** typed Firestore repositories/services (`src/server/` or `src/lib/db/`).
7. **Feature modules:** organize by domain — `learning/`, `ctf/`, `stories/`, `labs/`, `mentor/`, `gamification/`.
8. **Testing:** Vitest for unit, Playwright for e2e, Firestore emulator for integration.
9. **CI/CD:** GitHub Actions — lint, typecheck, test, build, deploy.
10. **Observability:** structured logging, error tracking (Sentry), analytics.
11. **Security headers:** CSP, HSTS, X-Frame-Options via `next.config.ts` or middleware.

### Recommended Folder Structure (target)
```
src/
├── app/                    # App Router pages (routes only)
│   ├── (marketing)/        # Landing, about
│   ├── (app)/              # Authenticated app shell
│   │   ├── dashboard/
│   │   ├── learn/
│   │   ├── ctf/
│   │   ├── stories/
│   │   ├── labs/
│   │   ├── mentor/
│   │   ├── profile/
│   │   └── admin/
│   └── api/                # (if needed) REST endpoints
├── components/             # Shared UI components
│   └── ui/                 # shadcn primitives
├── features/               # Feature modules (domain-driven)
│   ├── learning/
│   ├── ctf/
│   ├── stories/
│   ├── labs/
│   ├── mentor/
│   ├── gamification/
│   └── admin/
├── lib/                    # Utilities, constants, types
│   ├── db/                 # Firestore repositories (typed)
│   ├── auth/               # Auth helpers, RBAC
│   ├── validation/         # zod schemas
│   └── security/           # rate limiting, sanitization
├── server/                 # Server-only code (actions, services)
├── ai/                     # Genkit flows (existing, expand)
├── hooks/                  # Custom React hooks
└── types/                  # Shared TypeScript types
```

---

## 8. Recommended Development Roadmap

| Phase | Scope | Priority |
|-------|-------|----------|
| **2** | Architecture design (finalize target architecture, data model, API contracts) | Immediate |
| **3** | Database design (Firestore collections: users, courses, lessons, topics, stories, chapters, challenges, categories, hints, attempts, flags, labs, skills, achievements, badges, XP, streaks, leaderboards, AI conversations, recommendations, notifications, certificates, audit logs) | Immediate |
| **4** | Backend hardening (env vars, middleware, RBAC, Firestore rules, rate limiting, validation, audit logging) | Immediate — security first |
| **5** | Frontend foundation (dashboard redesign, navigation, loading/error states, accessibility) | High |
| **6** | Learning system (modules, lessons, quizzes, progress tracking) | High |
| **7** | CTF engine (challenges, flags, points, hints, attempts, leaderboards) | High |
| **8** | Cyber Stories system (interactive narratives, chapters, choices) | Medium |
| **9** | AI Mentor (conversational, hint-based teaching, level-adaptive) | Medium |
| **10** | Adaptive learning (track performance, recommend path, skill tree) | Medium |
| **11** | Safe labs (Docker-sandboxed vulnerable environments, strictly isolated) | Later |
| **12** | Gamification + analytics (XP, levels, streaks, badges, certificates, admin analytics) | Later |
| **13** | Testing (unit, integration, e2e) | Throughout |
| **14** | Security audit (pen-test, dependency scan, rules review) | Before launch |
| **15** | Deployment (CI/CD, monitoring, scaling) | Before launch |

---

## 9. Key Recommendations Before Proceeding

1. **Do NOT rewrite the working foundation.** The Next.js + Tailwind + shadcn + Firebase + Genkit stack is sound and the existing tools (phishing simulator, legit scanner, awareness hub, auth) are genuinely functional. We should build on them.
2. **Fix the critical security issues first** (Phase 4 before/alongside new features): hardcoded config, Firestore rules, build error suppression, rate limiting.
3. **Reuse existing content:** the 18 articles + 15 tips can seed the learning system; the 13 phishing emails can seed the CTF/story system.
4. **The AI flows are a good pattern** — extend them for the AI Mentor (conversational) and adaptive learning rather than replacing Genkit.
5. **The "dashboard" needs a real redesign** — it's currently a static feature grid, not a personalized learning dashboard.

---

*End of Phase 1 Assessment. Awaiting approval to proceed to Phase 2 (Architecture Design).*