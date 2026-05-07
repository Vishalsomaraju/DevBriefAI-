/**
 * @module services/analyticsService
 * @description Centralized analytics service for tracking user engagement and application errors via Google Analytics 4.
 */

import { getAnalytics, logEvent, Analytics, isSupported } from 'firebase/analytics';
import { app } from '@/config/firebase';
import { GA_EVENTS } from '@/constants';

class AnalyticsService {
  private analytics: Analytics | null = null;

  constructor() {
    isSupported().then(supported => {
      if (supported) {
        this.analytics = getAnalytics(app);
      }
    });
  }

  /**
   * Tracks a page view event.
   * @param {string} pagePath - The path of the page being viewed.
   */
  public trackPageView(pagePath: string): void {
    try {
      if (this.analytics) {
        logEvent(this.analytics, 'page_view', { page_path: pagePath });
      }
    } catch (error) {
      console.error('[AnalyticsService] Failed to track page view:', error);
    }
  }

  /**
   * Tracks when a user starts a new session.
   */
  public trackSessionStarted(): void {
    try {
      if (this.analytics) {
        logEvent(this.analytics, GA_EVENTS.SESSION_STARTED);
      }
    } catch (error) {
      console.error('[AnalyticsService] Failed to track session start:', error);
    }
  }

  /**
   * Tracks when a user asks a question to Gemini.
   * @param {string} [templateId] - Optional template ID if a preset was used.
   */
  public trackQuestionAsked(templateId?: string): void {
    try {
      if (this.analytics) {
        logEvent(this.analytics, GA_EVENTS.QUESTION_ASKED, { template_id: templateId });
      }
    } catch (error) {
      console.error('[AnalyticsService] Failed to track question asked:', error);
    }
  }

  /**
   * Tracks when a session is saved to Firestore.
   */
  public trackSessionSaved(): void {
    try {
      if (this.analytics) {
        logEvent(this.analytics, GA_EVENTS.SESSION_SAVED);
      }
    } catch (error) {
      console.error('[AnalyticsService] Failed to track session save:', error);
    }
  }

  /**
   * Tracks application errors.
   * @param {string} errorType - Categorized error type (e.g., 'auth', 'gemini', 'firestore').
   * @param {string} errorMessage - Specific error message.
   */
  public trackError(errorType: string, errorMessage: string): void {
    try {
      if (this.analytics) {
        logEvent(this.analytics, GA_EVENTS.ERROR_ENCOUNTERED, {
          error_type: errorType,
          error_message: errorMessage
        });
      }
    } catch (error) {
      console.error('[AnalyticsService] Failed to track error:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
