import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StreamingText } from '@/components/ui/StreamingText';

// Mock marked to avoid jsdom parse issues
vi.mock('marked', () => ({
  marked: {
    parse: vi.fn((str: string) => `<p>${str}</p>`),
  },
}));

// Mock DOMPurify since it relies on browser DOM APIs
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((str: string) => str),
  },
}));

describe('StreamingText Component', () => {
  it('renders content correctly', () => {
    render(<StreamingText content="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('shows cursor when isStreaming is true', () => {
    const { container } = render(<StreamingText content="Streaming" isStreaming={true} />);
    const cursor = container.querySelector('.animate-pulse');
    expect(cursor).toBeInTheDocument();
  });

  it('hides cursor when isStreaming is false', () => {
    const { container } = render(<StreamingText content="Done" isStreaming={false} />);
    const cursor = container.querySelector('.animate-pulse');
    expect(cursor).not.toBeInTheDocument();
  });

  it('renders empty content without crashing', () => {
    const { container } = render(<StreamingText content="" />);
    expect(container.querySelector('.prose')).toBeInTheDocument();
  });
});
