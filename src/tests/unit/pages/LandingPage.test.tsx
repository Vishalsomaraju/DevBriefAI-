import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage } from '@/pages/LandingPage';
import { authService } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  authService: {
    signInWithGoogle: vi.fn(),
    signOutUser: vi.fn(),
    onAuthStateChange: vi.fn(() => vi.fn()), // returns unsubscribe fn
  }
}));

vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackPageView: vi.fn(),
    trackError: vi.fn(),
  }
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />
}));

describe('LandingPage', () => {
  it('renders hero content', () => {
    render(<LandingPage />);
    // Check h1 logo text
    expect(screen.getByRole('heading', { level: 1, name: /DevBrief AI/i })).toBeInTheDocument();
    // Check actual h2 hero headline
    expect(screen.getByRole('heading', { level: 2, name: /Understand Any Codebase in Seconds/i })).toBeInTheDocument();
  });

  it('renders Sign in with Google buttons', () => {
    render(<LandingPage />);
    // LandingPage has two AuthButton instances (header + hero)
    const signInBtns = screen.getAllByRole('button', { name: /Sign in with Google/i });
    expect(signInBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('calls signInWithGoogle when sign-in button is clicked', async () => {
    (authService.signInWithGoogle as any).mockResolvedValueOnce({ data: null, error: null });
    render(<LandingPage />);
    
    const signInBtns = screen.getAllByRole('button', { name: /Sign in with Google/i });
    fireEvent.click(signInBtns[0]);
    
    await waitFor(() => {
      expect(authService.signInWithGoogle).toHaveBeenCalled();
    });
  });

  it('renders feature cards', () => {
    render(<LandingPage />);
    expect(screen.getByText('Instant Explanations')).toBeInTheDocument();
    expect(screen.getByText('Automated PR Summaries')).toBeInTheDocument();
    expect(screen.getByText(/Security/)).toBeInTheDocument();
  });
});
