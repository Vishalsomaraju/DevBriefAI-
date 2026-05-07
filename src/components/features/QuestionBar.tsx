import React, { useState } from 'react';
import { GEMINI } from '@/constants';
import { Button } from '@/components/ui/Button';

interface QuestionBarProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export const QuestionBar: React.FC<QuestionBarProps> = ({ onSubmit, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleTemplateClick = (prompt: string) => {
    if (!disabled) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Quick prompt templates">
        {GEMINI.PROMPT_TEMPLATES.map((template) => (
          <Button
            key={template.id}
            variant="secondary"
            onClick={() => handleTemplateClick(template.prompt)}
            disabled={disabled}
            className="text-xs py-1 px-3"
            aria-label={`Use template: ${template.label}`}
          >
            {template.label}
          </Button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <label htmlFor="question-input" className="sr-only">Ask a question about the code</label>
        <input
          id="question-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Ask a question about the codebase..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:border-blue-500"
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || disabled}
          aria-label="Submit question"
        >
          Send
        </Button>
      </form>
    </div>
  );
};
