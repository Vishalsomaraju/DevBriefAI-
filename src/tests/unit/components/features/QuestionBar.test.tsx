import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuestionBar } from '@/components/features/QuestionBar';

describe('QuestionBar Component', () => {
  it('renders templates and input', () => {
    render(<QuestionBar onSubmit={vi.fn()} />);
    // Check input exists (actual placeholder: "Ask a question about the codebase...")
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    // Template buttons exist – first template label may be "Explain this"
    expect(screen.getByRole('button', { name: /Use template: Explain this/i })).toBeInTheDocument();
  });

  it('submits typed question', async () => {
    const handleSubmit = vi.fn();
    render(<QuestionBar onSubmit={handleSubmit} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'How does it work?' } });
    
    // Submit via the submit button
    const submitBtn = screen.getByRole('button', { name: /Submit question/i });
    fireEvent.click(submitBtn);
    
    expect(handleSubmit).toHaveBeenCalledWith('How does it work?');
  });

  it('submits template question when clicked', () => {
    const handleSubmit = vi.fn();
    render(<QuestionBar onSubmit={handleSubmit} />);
    
    const templateBtn = screen.getByRole('button', { name: /Use template: Explain this/i });
    fireEvent.click(templateBtn);
    
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<QuestionBar onSubmit={vi.fn()} disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /Submit question/i })).toBeDisabled();
  });
});
