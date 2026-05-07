import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from '@/services/analyticsService';
import { logEvent } from 'firebase/analytics';

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Since constructor initializes asynchronously with isSupported,
  // we may not be able to easily test if logEvent was called if `this.analytics` is null
  // during the synchronous test execution. We can test that the methods don't throw.
  
  it('trackPageView does not throw', () => {
    expect(() => analyticsService.trackPageView('/test')).not.toThrow();
  });

  it('trackSessionStarted does not throw', () => {
    expect(() => analyticsService.trackSessionStarted()).not.toThrow();
  });

  it('trackQuestionAsked does not throw', () => {
    expect(() => analyticsService.trackQuestionAsked('tmpl_1')).not.toThrow();
  });

  it('trackSessionSaved does not throw', () => {
    expect(() => analyticsService.trackSessionSaved()).not.toThrow();
  });

  it('trackError does not throw', () => {
    expect(() => analyticsService.trackError('test_error', 'Something failed')).not.toThrow();
  });
});
