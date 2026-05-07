import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppPage } from '@/pages/AppPage';
import { authService } from '@/services/authService';
import { sessionService } from '@/services/sessionService';
import { geminiService } from '@/services/geminiService';

// Mock all services
vi.mock('@/services/analyticsService', () => ({
  analyticsService: { trackPageView: vi.fn(), trackError: vi.fn() }
}));

vi.mock('@/services/sessionService', () => ({
  sessionService: {
    getUserSessions: vi.fn().mockResolvedValue({ data: [], error: null }),
    getSessionById: vi.fn().mockResolvedValue({ data: null, error: null }),
    saveSession: vi.fn().mockResolvedValue({ data: null, error: null }),
    deleteSession: vi.fn().mockResolvedValue({ data: null, error: null }),
  }
}));

vi.mock('@/services/geminiService', () => ({
  geminiService: {
    streamCodeAnalysis: vi.fn().mockResolvedValue({ data: 'mocked answer', error: null })
  }
}));

vi.mock('@/services/authService', () => ({
  authService: {
    onAuthStateChange: vi.fn((callback) => {
      callback({ uid: 'test-user', displayName: 'Test User' });
      return vi.fn();
    })
  }
}));

// Mock subcomponents to prevent deep render issues
vi.mock('@/components/features/SessionSidebar', () => ({
  SessionSidebar: ({ onNewSession, onSelectSession, onDeleteSession }: any) => (
    <div data-testid="session-sidebar">
      <button onClick={onNewSession} aria-label="Start new session">New</button>
      <button onClick={() => onSelectSession('sess-1')} aria-label="Select session">Select</button>
      <button onClick={() => onDeleteSession('sess-1')} aria-label="Delete session sess-1">Delete</button>
    </div>
  )
}));

vi.mock('@/components/features/CodeInput', () => ({
  CodeInput: ({ value, onChange }: any) => (
    <textarea 
      data-testid="code-input" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      aria-label="Code input"
    />
  )
}));

vi.mock('@/components/features/QuestionBar', () => ({
  QuestionBar: ({ onSubmit, disabled }: any) => (
    <button 
      data-testid="question-submit" 
      onClick={() => onSubmit('What does this do?')}
      disabled={disabled}
      aria-label="Submit question"
    >
      Ask
    </button>
  )
}));

vi.mock('@/components/features/ResponseBlock', () => ({
  ResponseBlock: ({ entry }: any) => <div data-testid="response-block">{entry.question}</div>
}));

describe('AppPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-set default auth mock after clearAllMocks
    vi.mocked(authService.onAuthStateChange).mockImplementation((callback: any) => {
      callback({ uid: 'test-user', displayName: 'Test User' });
      return vi.fn();
    });
  });

  it('renders workspace layout', async () => {
    await act(async () => { render(<MemoryRouter><AppPage /></MemoryRouter>); });
    expect(screen.getByRole('main', { name: /Workspace/i })).toBeInTheDocument();
  });

  it('shows "New Analysis" heading by default', async () => {
    await act(async () => { render(<MemoryRouter><AppPage /></MemoryRouter>); });
    expect(screen.getByText('New Analysis')).toBeInTheDocument();
  });

  it('handles new session button click', async () => {
    await act(async () => { render(<MemoryRouter><AppPage /></MemoryRouter>); });
    const newBtn = screen.getByRole('button', { name: /Start new session/i });
    await act(async () => { fireEvent.click(newBtn); });
    expect(screen.getByText('New Analysis')).toBeInTheDocument();
  });

  it('handles session selection', async () => {
    vi.mocked(sessionService.getSessionById).mockResolvedValueOnce({
      data: { id: 'sess-1', title: 'My Session', entries: [], codeContext: 'const x = 1;', userId: 'u1', createdAt: 1, updatedAt: 2 },
      error: null
    });
    await act(async () => { render(<MemoryRouter><AppPage /></MemoryRouter>); });
    const selectBtn = screen.getByRole('button', { name: /Select session/i });
    await act(async () => { fireEvent.click(selectBtn); });
    await waitFor(() => {
      expect(screen.getByText('My Session')).toBeInTheDocument();
    });
  });

  it('handles delete session', async () => {
    await act(async () => { render(<MemoryRouter><AppPage /></MemoryRouter>); });
    const deleteBtn = screen.getByRole('button', { name: /Delete session/i });
    await act(async () => { fireEvent.click(deleteBtn); });
    expect(sessionService.deleteSession).toHaveBeenCalledWith('sess-1');
  });

  it('submits a question and calls geminiService', async () => {
    await act(async () => { render(<MemoryRouter><AppPage /></MemoryRouter>); });
    
    // Set code context first
    const codeInput = screen.getByTestId('code-input');
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: 'function hello() {}' } });
    });

    const askBtn = screen.getByRole('button', { name: /Submit question/i });
    await act(async () => { fireEvent.click(askBtn); });

    await waitFor(() => {
      expect(geminiService.streamCodeAnalysis).toHaveBeenCalled();
    });
  });

  it('shows loading state during stream', async () => {
    vi.mocked(geminiService.streamCodeAnalysis).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    await act(async () => { render(<MemoryRouter><AppPage /></MemoryRouter>); });
    
    const codeInput = screen.getByTestId('code-input');
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: 'some code' } });
    });
    
    const askBtn = screen.getByRole('button', { name: /Submit question/i });
    fireEvent.click(askBtn);
    
    // QuestionBar submit button should be disabled during streaming
    await waitFor(() => {
      expect(askBtn).toBeDisabled();
    });
  });
});
