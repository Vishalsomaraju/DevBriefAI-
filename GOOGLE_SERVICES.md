# Google Services Integration

DevBrief AI is deeply integrated with the Google ecosystem to provide a seamless, secure, and highly performant experience.

## 1. Firebase Authentication
- Used exclusively for Google Sign-In (`signInWithPopup`).
- Secures user routes and provides unique `uid`s for Firestore ownership.

## 2. Cloud Firestore
- Stores persistent user sessions (Q&A history).
- Secured via strict `firestore.rules` (allow create/update only if `request.auth.uid == resource.data.userId`).

## 3. Firebase Hosting
- Serves the compiled Vite SPA.
- Enforces top-tier security headers (CSP, HSTS, X-Frame-Options) defined in `firebase.json`.

## 4. Google Analytics 4 (GA4)
- Tracks user behavior events via `src/services/analyticsService.ts`.
- Key events: `auth_sign_in`, `session_started`, `question_asked`, `app_error`.

## 5. Google Gemini API (2.0 Flash)
- Powers the core codebase analysis engine.
- Accessed via `@google/generative-ai` with streaming generator support to deliver fast, incremental UX.
