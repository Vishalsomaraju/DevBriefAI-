/**
 * @module components/ui/CodeBlock
 * @description CodeBlock component for syntax highlighting and displaying code.
 */
import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="relative rounded-md bg-zinc-950 overflow-hidden my-4 group">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 text-zinc-400 text-xs font-mono">
        <span>{language}</span>
        <Button
          variant="ghost"
          className="h-6 px-2 text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-zinc-100">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
