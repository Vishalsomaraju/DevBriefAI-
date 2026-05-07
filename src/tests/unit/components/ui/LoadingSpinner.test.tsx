import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<LoadingSpinner label="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('renders small size', () => {
    render(<LoadingSpinner size="sm" />);
    const svg = document.querySelector('svg');
    expect(svg?.className).toContain('h-4');
  });

  it('renders large size', () => {
    render(<LoadingSpinner size="lg" />);
    const svg = document.querySelector('svg');
    expect(svg?.className).toContain('h-12');
  });

  it('has aria-busy attribute', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });
});
