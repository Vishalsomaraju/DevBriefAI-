import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HistoryPage } from '@/pages/HistoryPage';
import { analyticsService } from '@/services/analyticsService';

vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackPageView: vi.fn(),
  }
}));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate-redirect" data-to={to} />
}));

describe('HistoryPage', () => {
  it('redirects to /app', () => {
    render(<HistoryPage />);
    const nav = screen.getByTestId('navigate-redirect');
    expect(nav).toBeInTheDocument();
    expect(nav.getAttribute('data-to')).toBe('/app');
  });

  it('tracks page view on mount', () => {
    render(<HistoryPage />);
    expect(analyticsService.trackPageView).toHaveBeenCalledWith('/history');
  });
});
