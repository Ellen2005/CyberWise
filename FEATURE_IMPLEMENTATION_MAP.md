# CyberWise — Feature Implementation Map

**Version:** 1.0
**Date:** September 6, 2026
**Status:** Active — driving implementation

---

## Implementation Phases & Priority

Priority legend: **P0** = MVP / must-have, **P1** = high value, **P2** = medium, **P3** = later / stretch.

---

### PHASE A — Foundation Hardening (P0, DO FIRST)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| A1 | Env var management | None | None | `.env.example`, config.ts reads env | None | None | No hardcoded keys | Manual | P0 |
| A2 | Firestore security rules | None | All collections | rules file | None | None | RBAC, field validation | Rules emulator | P0 |
| A3 | Route protection (middleware) | Firebase Auth | None | `middleware.ts` | None | None | Server-side auth gate | Manual | P0 |
| A4 | Rate limiting for AI actions | None | None | in-memory limiter | None | Protects Genkit quota | Anti-abuse | Unit test | P0 |
| A5 | Shared TypeScript types | None | mirrors schema | `src/types/` | consumes types | Input schemas | Input validation | Type-check | P0 |
| A6 | Fix dead code / branding | None | None | cleanup | cleanup | None | None | Build passes | P0 |

### PHASE B — Core User & Gamification (P0)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| B1 | User profile extension | A5 | `users/{uid}` schema | rules for writes | Profile components | None | Field whitelist | Unit + rules | P0 |
| B2 | Gamification engine (XP, levels, badges, streaks) | B1 | `users/{uid}`, `achievements`, `badges` | `src/lib/gamification/` pure functions | Hooks/UI | None | Field whitelist | Unit tests | P0 |
| B3 | Onboarding flow | B1, B2 | `users/{uid}.onboardingCompleted` etc. | onboarding action | `/onboarding` wizard | None | Input validation | Unit + UI | P0 |
| B4 | Personalized Dashboard | B1–B3, C1 | reads user + challenges + daily | aggregation | `/dashboard` | Greeting, weak areas | Auth | Integration | P0 |

### PHASE C — Daily Challenge & Content (P0)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| C1 | Challenge content model + seed | A5 | `challenges`, `challengeCategories`, `hints` | admin actions | Challenge cards | None | Signed-in read, admin write | Unit + integration | P0 |
| C2 | Daily challenge engine | C1, B2 | `dailyChallenges/{date}` | assign-today action; record attempt | Challenge card on dashboard | None | Rate limited | Integration | P0 |
| C3 | Challenge submission + attempts | C1, B2 | `users/{uid}/attempts` | submit action, XP, streak, badge | Challenge detail + hints + submit | None | Rate limit, flag validation | Unit + integration | P0 |
| C4 | Leaderboards (global/weekly) | B1, C3 | `leaderboards` | aggregation on XP | Leaderboard components | None | Signed-in read | Integration | P1 |

### PHASE D — Learning System (P0/P1)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| D1 | Lesson model + seed beginner lessons | A5 | `lessons` | seed | `/learn/[slug]` viewer | None | Signed-in read | Unit schema | P0 |
| D2 | Quiz engine (MCQ, TF, scenario) | D1 | `quizzes`, attempts | submit-quiz action, XP | Quiz component | None | Rate limit | Unit + integration | P0 |
| D3 | Learning paths | D1, C1 | `learningPaths`, `skills` | path aggregation | `/paths` | None | Rules | Integration | P1 |
| D4 | Skill tree (visual, prerequisites) | D1, D3, B2 | `skills`, progress | progress calc | Skill tree component | None | Rules | Integration | P1 |
| D5 | Adaptive recommendations | B2, C3, D1–D4 | `users/{uid}/recommendations` | rule-based engine (AI later) | Recommendation cards | AI optional | None | Unit + integration | P1 |

### PHASE E — Cyber Stories (P1)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| E1 | Story model + chapters | A5 | `stories`, `stories/{id}/chapters` | story content | `/stories/[slug]` interactive reader | None | Signed-in read | Unit | P1 |
| E2 | Story engine (choices, evidence, decisions) | E1, B2 | progress, attempts | story action, XP | Interactive chapter UI | None | Rate limit | Integration | P1 |
| E3 | Story quiz / reflection | E1, E2, D2 | quizzes | submit-quiz | Quiz | None | Rate limit | Unit | P1 |

### PHASE F — Advanced Modules (P1/P2)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| F1 | Attack investigation simulator | C1, D1 | `labs`, `situations` | investigation action | `/investigate/[id]` | None | Signed-in, isolated data | Integration | P1 |
| F2 | Log analysis exercises | C1, F1 | `logExercises` | answer action | Log viewer component | None | Signed-in | Integration | P1 |
| F3 | Secure coding challenges | C1, D1 | `codeChallenges` | answer check | Code viewer | None | Signed-in | Integration | P1 |
| F4 | OSINT challenges (fictional) | C1 | `osintChallenges` | answer action | OSINT UI | None | Fictional data only | Integration | P1 |

### PHASE G — AI Mentor & Recommendations (P1)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| G1 | AI Mentor conversation flow | B1, B2, C3, D1–D5 | `users/{uid}/aiConversations` | Genkit flow w/ user context | `/mentor` chat UI | Gemini | Rate limit, prompt guard | Unit + integration | P1 |
| G2 | AI hint escalation (L1→L5) | G1, C1 | attempts (hints used) | mentor flow reads attempts | Hint UI in challenge | Gemini | Rate limit | Unit | P1 |
| G3 | Personalized recommendations | G1, D5 | recommendations | Genkit flow + rules | Recommendation UI | Gemini | Rate limit | Integration | P1 |

### PHASE H — Gamification Expansion (P1/P2)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| H1 | Certificates | B2, D3 | `users/{uid}/certificates` | generate-cert action | Certificate view | None | Admin/owner | Integration | P1 |
| H2 | Notifications | B2, C3, D1 | `users/{uid}/notifications` | notify service | Notification center | None | Owner only | Integration | P1 |
| H3 | Projects | F1, D2 | `projects` | project Eval | Project UI | None | Signed-in | Integration | P2 |
| H4 | Career center | D3, H1 | `careers` | career gap calc | `/careers` | None | None | Integration | P2 |

### PHASE I — Admin / CMS / AI Content (P2/P3)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| I1 | Admin panel | All content models | all content collections | admin actions | `/admin` | None | RBAC admin-only | Integration | P2 |
| I2 | Content management (structured content models) | A5 | all CMS collections | CRUD services | Admin UI | None | RBAC | Integration | P2 |
| I3 | AI-generated content pipeline | G1, I2 | `aiContent` | generate→validate→review→publish | Admin review UI | Gemini | Strict validation, sandbox | Integration | P3 |
| I4 | Searchable knowledge base | D1–D4, E1, F1 | `knowledgeBase` | search service | `/knowledge` | None | Signed-in | Integration | P2 |
| I5 | User feedback/reporting | C1, E1, F1 | `feedback` | feedback action | Report buttons | None | Signed-in | Integration | P2 |

### PHASE J — Settings / Mobile / Polish (P2/P3)

| # | Feature | Dependencies | Database | Backend | Frontend | AI | Security | Testing | Priority |
|---|---------|--------------|----------|---------|----------|----|----------|---------|----------|
| J1 | Settings page (account, security, notifications, appearance, privacy, learning, AI, accessibility) | B1 | `users/{uid}.settings` | settings action | `/settings` | None | Field whitelist | Unit + integration | P2 |
| J2 | Search (lesson/challenge/story/lab/skill/path) | D–H content | indexes | search service | `/search` | None | Signed-in | Integration | P2 |
| J3 | Mobile experience polish | All | None | None | Responsive passes | None | None | Device tests | P2 |
| J4 | Error boundaries, loading.tsx, not-found.tsx | None | None | None | App shell states | None | None | UI tests | P0 |

---

## Connected Ecosystem Requirements

Every completed action (lesson, quiz, story, challenge, investigation) must trigger:

1. **XP / Level update** → `gamification.applyXp(userId, amount, reason)`
2. **Skill progress update** → `skills.updateProgress(userId, skillIds, delta)`
3. **Streak update** (daily activity) → `streaks.touch(userId, date)`
4. **Achievement/Badge check** → `achievements.checkAll(userId)`
5. **Recommendation refresh** → `recommendations.refresh(userId)`
6. **Notification triggers** → `notifications.create(...)`
7. **Audit log entry** → `auditLogs.add(userId, action, detail)`
8. **Leaderboard aggregation update** (async, on schedule or event)

---

## MVP Definition (what we ship first)

1. Foundation hardening (A1–A6)
2. User profile + gamification engine (B1–B2)
3. Onboarding (B3)
4. Personalized dashboard (B4)
5. Daily challenge (C1–C3)
6. Beginner lessons + quizzes (D1–D2)
7. First Cyber Story (E1–E2)
8. Search + Knowledge base (I4, J2)
9. Settings page (J1)
10. Error/Loading/NotFound states (J4)

Post-MVP (next iteration): CTF platform, Labs, AI Mentor, Career center, Admin panel.