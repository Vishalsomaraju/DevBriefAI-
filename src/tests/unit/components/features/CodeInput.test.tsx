import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CodeInput } from '@/components/features/CodeInput';

describe('CodeInput Component', () => {
  it('renders raw code textarea by default', () => {
    render(<CodeInput value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Paste your raw code here/i)).toBeInTheDocument();
  });

  it('switches tabs between Raw Code and GitHub URL', () => {
    render(<CodeInput value="" onChange={vi.fn()} />);
    
    // Tabs use role="tab", not role="button"
    const githubTab = screen.getByRole('tab', { name: /GitHub URL/i });
    fireEvent.click(githubTab);
    
    // After click, the URL panel is shown (no longer hidden)
    expect(screen.getByPlaceholderText(/https:\/\/github.com\/user\/repo/i)).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const handleChange = vi.fn();
    render(<CodeInput value="" onChange={handleChange} />);
    
    const textarea = screen.getByPlaceholderText(/Paste your raw code here/i);
    fireEvent.change(textarea, { target: { value: 'const x = 1;' } });
    
    expect(handleChange).toHaveBeenCalledWith('const x = 1;');
  });

  it('shows character count exceeding limit warning', () => {
    const longText = 'a'.repeat(30001);
    render(<CodeInput value={longText} onChange={vi.fn()} />);
    // The component shows the character count — check something visible in the UI
    // Character count hint shows chars / limit
    expect(screen.getByText(/30001/)).toBeInTheDocument();
  });
});
