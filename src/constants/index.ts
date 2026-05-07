/**
 * @module constants
 * @description All application-wide magic strings, configuration values, and defaults.
 */

export const APP_CONFIG = {
  name: "DevBrief AI",
  version: "1.0.0",
  maxCodeContextLength: 30000,
} as const;

export const ROUTES = {
  HOME: "/",
  APP: "/app",
  HISTORY: "/history",
} as const;

export const UI = {
  DEBOUNCE_MS: 2000,
  TOAST_DURATION_MS: 4000,
  ANIMATION_DURATION_MS: 200,
} as const;

export const GEMINI = {
  MODEL: "gemini-2.0-flash",
  PROMPT_TEMPLATES: [
    { id: "explain", label: "Explain this", prompt: "Explain the architecture and purpose of this codebase." },
    { id: "pr_summary", label: "Summarise as PR", prompt: "Generate a structured PR summary including changes, risk level, and suggested reviewers based on this code." },
    { id: "flag_issues", label: "Flag issues", prompt: "Review this code and flag any potential security vulnerabilities, performance issues, or anti-patterns." },
  ]
} as const;

export const NETWORK = {
  RETRY_COUNT: 3,
  TIMEOUT_MS: 15000,
} as const;

export const FIRESTORE_COLLECTIONS = {
  USERS: "users",
  SESSIONS: "sessions",
} as const;

export const GA_EVENTS = {
  SESSION_STARTED: "session_started",
  QUESTION_ASKED: "question_asked",
  SESSION_SAVED: "session_saved",
  AUTH_SIGN_IN: "auth_sign_in",
  AUTH_SIGN_OUT: "auth_sign_out",
  ERROR_ENCOUNTERED: "app_error",
} as const;
