/**
 * @module config/env
 * @description Typed environment variable access with startup validation.
 * All VITE_ prefixed env vars are accessed here — never directly from import.meta.env
 * in feature code. Fails fast if any required variable is missing so misconfiguration
 * is caught immediately rather than silently failing at runtime.
 * @version 1.0.0
 */

/** All required environment variable keys. Add new vars here first. */
const REQUIRED_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_GA_MEASUREMENT_ID',
] as const;

// Validate at module load time — app won't start with missing config.
// This surfaces misconfiguration in development before users see broken behaviour.
REQUIRED_VARS.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env.local and fill in the values.`
    );
  }
});

/** Typed, validated access to all environment variables. */
export const ENV = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID as string,
  },
} as const;

// =============================================================================

/**
 * @module services/analyticsService
 * @description Centralised GA4 analytics service. All event logging goes through
 * this class — never scatter logEvent() calls across components. This ensures
 * consistent event naming, structured metadata, and a single place to update
 * if the analytics provider changes.
 * @version 1.0.0
 */

import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';
import { app } from '@/config/firebase';

class AnalyticsService {
  private readonly analytics: Analytics;

  constructor() {
    // Defer analytics initialisation until after Firebase app is ready.
    // getAnalytics() is idempotent — safe to call multiple times.
    this.analytics = getAnalytics(app);
  }

  /**
   * Tracks SPA navigation. Call on every route change so GA4 session
   * data is accurate — Firebase Hosting doesn't auto-track SPA nav.
   *
   * @param pageName - Human-readable page name (e.g. 'Dashboard', 'Profile')
   */
  trackPageView(pageName: string): void {
    logEvent(this.analytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }

  /**
   * Tracks when a user completes a meaningful action.
   * Use for primary CTA clicks, form submissions, and feature usage.
   *
   * @param actionName - Snake_case action identifier (e.g. 'search_submitted')
   * @param metadata   - Optional structured context for the action
   */
  trackAction(
    actionName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    logEvent(this.analytics, 'action_completed', {
      action_name: actionName,
      timestamp: Date.now(),
      ...metadata,
    });
  }

  /**
   * Tracks application errors to GA4 for monitoring.
   * Called from every catch block and the ErrorBoundary.
   *
   * @param errorType    - Category of error (e.g. 'firestore_read', 'auth_failure')
   * @param errorMessage - The error message (sanitise before passing)
   */
  trackError(errorType: string, errorMessage: string): void {
    logEvent(this.analytics, 'app_error', {
      error_type: errorType,
      error_message: errorMessage.slice(0, 150), // GA4 property value limit
      page_path: window.location.pathname,
    });
  }

  /**
   * Tracks user search queries. Separated from trackAction because search
   * has its own GA4 event schema that integrates with Site Search reports.
   *
   * @param searchTerm - The query string the user entered
   * @param resultCount - Number of results returned
   */
  trackSearch(searchTerm: string, resultCount: number): void {
    logEvent(this.analytics, 'search', {
      search_term: searchTerm,
      result_count: resultCount,
    });
  }
}

/** Singleton instance — import this everywhere instead of constructing a new one. */
export const analyticsService = new AnalyticsService();

// =============================================================================

/**
 * @module hooks/useAsync
 * @description Generic hook for managing loading, error, and data state for any
 * async operation. Eliminates the boilerplate of writing isLoading/error/data
 * state in every component that fetches data.
 *
 * Usage:
 *   const { isLoading, error, data, execute } = useAsync<User[]>();
 *   await execute(() => userService.fetchAll());
 *
 * @version 1.0.0
 */

import { useState, useCallback } from 'react';

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

interface AsyncState<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  /** Execute the async function and update state accordingly. */
  execute: (asyncFn: () => Promise<ApiResponse<T>>) => Promise<ApiResponse<T>>;
  /** Reset state back to initial values. */
  reset: () => void;
}

const INITIAL_STATE = { isLoading: false, error: null, data: null } as const;

export function useAsync<T>(): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>(INITIAL_STATE);

  const execute = useCallback(
    async (asyncFn: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await asyncFn();

      if (result.error) {
        setState({ isLoading: false, error: result.error, data: null });
      } else {
        setState({ isLoading: false, error: null, data: result.data });
      }

      return result;
    },
    []
  );

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { ...state, execute, reset };
}
