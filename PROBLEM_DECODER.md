# PROMPTWARS — PROBLEM STATEMENT DECODER
## Run this BEFORE opening Antigravity. Takes 5 minutes. Saves 2 hours.

---

## STEP 1 — READ TWICE, EXTRACT THESE 4 THINGS

Paste the problem statement. Answer these before touching any tool:

```
CORE USER ACTION (one verb):
→ What is the single thing a user DOES in this app?
  (submit / search / track / find / compare / book / learn / report)

CORE USER PAIN:
→ What problem does this solve in one sentence?

SIMPLEST VERSION THAT FULLY SATISFIES THE PROMPT:
→ If you stripped everything optional, what's left?
  This is your MVP. Build this first, extras second.

WHAT DATA DOES THIS APP NEED:
→ Static (hardcoded JSON) / User-generated (Firestore) / External API / AI-generated
```

---

## STEP 2 — MAP TO THE 6 RUBRIC CATEGORIES

For each category, decide the specific implementation BEFORE Antigravity touches anything:

### Code Quality — What's the architecture?
```
Folder split: How many feature areas? (1-2 features = simpler structure, 3+ = more separation)
State management: useState only / Context / Zustand
Key components needed:
  - [ ] 
  - [ ]
  - [ ]
Tricky logic that needs careful typing:
```

### Security — What are the threats here?
```
User inputs: Does the user type anything that gets displayed? → sanitize with DOMPurify
Auth needed? Y/N → Firebase Auth
Data sensitive? Y/N → strict firestore.rules
API keys exposed to browser? → restrict in GCP Console
```

### Efficiency — What could be slow?
```
Heavy operations: (AI calls / image processing / large lists / map rendering)
Debounce needed on: (search inputs, API calls)
Memoization needed: (expensive computed values, large lists)
Loading states needed on: (every async operation)
```

### Testing — What are the testable units?
```
Utils to unit test: (date formatters, validators, sanitizers, calculators)
Components to integration test: (forms, search, filters, key user flows)
Edge cases: (empty results, API error, invalid input, network failure)
```

### Accessibility — Any tricky a11y scenarios?
```
Modal/dialog needed? → focus trap required
Dynamic content updates? → aria-live regions
Map or canvas? → text alternatives needed
Form-heavy? → label association, error announcements
Multi-step flow? → heading hierarchy, step indicators
```

### Google Services — Which ones fit NATURALLY?
```
Pick 2-3 max. Forced integrations score lower than natural ones.

Options:
  Firebase Auth    → if the app has user accounts / saved preferences
  Firestore        → if the app has real-time data or user-generated content  
  GA4              → ALWAYS (every project, non-negotiable)
  Google Maps      → if location/geography is core to the problem
  Gemini API       → if AI generation/analysis is core to the problem
  Cloud Storage    → if users upload files/images
  Google Fonts     → ALWAYS (non-negotiable, 10 seconds)
  Firebase Hosting → ALWAYS (deploy target, non-negotiable)

Selected for this problem:
  Primary:   
  Secondary: 
  Always-on: GA4 + Google Fonts + Firebase Hosting
```

---

## STEP 3 — SCORE EACH FEATURE IDEA

Before building anything beyond MVP, score every feature idea:

| Feature Idea | Code Quality | Security | Efficiency | Testing | Accessibility | Google Services | TOTAL |
|---|---|---|---|---|---|---|---|
| [idea 1] | +/- | +/- | +/- | +/- | +/- | +/- | |
| [idea 2] | +/- | +/- | +/- | +/- | +/- | +/- | |

**Rule:** Only build features that score +2 or higher across the rubric categories.
A flashy feature that adds testing complexity, breaks accessibility, or adds no Google Service = skip it.

---

## STEP 4 — WRITE YOUR ARCHITECTURE SPEC

Write this BEFORE message 3 to Antigravity. Paste it as your architecture brief:

```
APP NAME: 
ONE-LINE DESCRIPTION: 

FOLDER STRUCTURE:
src/
├── components/
│   ├── ui/         (Button, Input, Card, Modal, LoadingSpinner, FormField, ErrorBoundary)
│   └── features/   ([feature1]/, [feature2]/)
├── hooks/          (useAsync, use[Feature])
├── services/       (analyticsService, [domain]Service)
├── types/          (index.ts — all interfaces here)
├── constants/      (index.ts — all magic values here)
├── config/         (firebase.ts, env.ts)
├── utils/          ([validator].ts, [formatter].ts)
└── pages/          ([Page].tsx per route)

TYPESCRIPT INTERFACES NEEDED:
interface [Name] {
  id: string;
  ...
}

CONSTANTS NEEDED:
ROUTES, APP_CONFIG, [DOMAIN]_CONFIG, UI constants

COMPONENTS + THEIR SINGLE RESPONSIBILITY:
- [ComponentName]: renders [one thing], props: [list]
- [ComponentName]: renders [one thing], props: [list]

GOOGLE SERVICES + WHY:
- Firebase Auth: [specific reason tied to problem]
- Firestore: [specific reason tied to problem]  
- GA4: user action tracking (always)
- [Other]: [specific reason]

TEST PLAN:
- Unit: [list 3 utils to test]
- Integration: [list 3 components to test]
- Security: firebase.json headers, firestore rules, env exposure
- Accessibility: landmarks, skip link, ARIA labels
- Edge cases: [list 3 edge cases specific to this problem]
```

---

## STEP 5 — ANTIGRAVITY MESSAGE SEQUENCE

Once you have the above filled in, send to Antigravity in this exact order:

```
Message 1: [Full contents of PROMPTWARS_SKILL.md]
Message 2: [Full contents of SESSION_LOG.md]  
Message 3: [Your filled-in architecture spec from Step 4]
           + "This is the architecture for challenge [N]. 
              Do you see any gaps before we start building?
              Wait for my approval before writing any implementation code."
Message 4: [After you review and approve] "Approved. Build Phase 1."
```

---

## QUICK ANTI-PATTERNS — THINGS TO REJECT IMMEDIATELY

If Antigravity suggests any of these, reject and redirect:

| Antigravity suggests | Why reject | What to say |
|---|---|---|
| Using `.jsx` or `.js` files | Loses Code Quality points | "All files must be .tsx/.ts strict mode" |
| Inline styles | Loses Code Quality | "Tailwind classes only, no inline styles" |
| `any` type | Loses Security + Quality | "Fix the type, don't use any" |
| Skipping error handling | Loses Code Quality | "Every async needs try/catch returning ApiResponse<T>" |
| Adding Terraform / k6 | NOT scored | "Skip, not in the rubric" |
| Prompt journey docs | NOT scored | "Skip, not in the rubric" |
| Skipping @module JSDoc | Loses Code Quality | "Add @module JSDoc block at top of this file" |
| Comments that say what the code does | Loses Quality | "Comment must explain WHY, not WHAT" |
| Coverage threshold below 70% | Loses Testing | "Set thresholds to lines: 70 minimum" |

---

*Fill this out fresh for each challenge. Takes 5 minutes. The architecture spec becomes your message 3 to Antigravity.*
