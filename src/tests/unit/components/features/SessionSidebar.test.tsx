import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionSidebar } from '@/components/features/SessionSidebar';
import { Session } from '@/types';

const mockSessions: Session[] = [
  { id: '1', title: 'Session 1', userId: 'u1', entries: [], codeContext: '', createdAt: 1, updatedAt: 2 },
  { id: '2', title: 'Session 2', userId: 'u1', entries: [], codeContext: '', createdAt: 3, updatedAt: 4 }
];

describe('SessionSidebar Component', () => {
  it('renders loading state', () => {
    render(<SessionSidebar sessions={[]} onSelectSession={vi.fn()} onDeleteSession={vi.fn()} onNewSession={vi.fn()} isLoading={true} />);
    // Component shows "Loading history..." with aria-live polite
    expect(screen.getByText(/Loading history/i)).toBeInTheDocument();
  });

  it('renders session list', () => {
    render(<SessionSidebar sessions={mockSessions} onSelectSession={vi.fn()} onDeleteSession={vi.fn()} onNewSession={vi.fn()} />);
    expect(screen.getByText('Session 1')).toBeInTheDocument();
    expect(screen.getByText('Session 2')).toBeInTheDocument();
  });

  it('calls onNewSession when new analysis is clicked', () => {
    const handleNew = vi.fn();
    render(<SessionSidebar sessions={[]} onSelectSession={vi.fn()} onDeleteSession={vi.fn()} onNewSession={handleNew} />);
    // Button text is "+ New Analysis"
    fireEvent.click(screen.getByRole('button', { name: /Start new session/i }));
    expect(handleNew).toHaveBeenCalled();
  });

  it('calls onSelectSession when a session is clicked', () => {
    const handleSelect = vi.fn();
    render(<SessionSidebar sessions={mockSessions} onSelectSession={handleSelect} onDeleteSession={vi.fn()} onNewSession={vi.fn()} />);
    fireEvent.click(screen.getByText('Session 1'));
    expect(handleSelect).toHaveBeenCalledWith('1');
  });

  it('calls onDeleteSession when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<SessionSidebar sessions={mockSessions} onSelectSession={vi.fn()} onDeleteSession={handleDelete} onNewSession={vi.fn()} />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete session/i });
    fireEvent.click(deleteButtons[0]);
    expect(handleDelete).toHaveBeenCalledWith('1');
  });
});
