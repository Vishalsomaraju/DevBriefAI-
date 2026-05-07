import React, { useState } from 'react';
import { StreamingText } from '@/components/ui/StreamingText';
import { QAEntry } from '@/types';

interface ResponseBlockProps {
  entry: QAEntry;
  isStreaming?: boolean;
}

export const ResponseBlock: React.FC<ResponseBlockProps> = ({ entry, isStreaming }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Question</h3>
        <p className="text-gray-900">{entry.question}</p>
      </div>
      
      <div className="flex flex-col gap-2 relative group">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">AI Response</h3>
          {!isStreaming && entry.answer && (
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
              aria-label="Copy response to clipboard"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        
        <StreamingText content={entry.answer} isStreaming={isStreaming} />
      </div>
    </div>
  );
};
