import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface StreamingTextProps {
  content: string;
  isStreaming?: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({ content, isStreaming = false }) => {
  const sanitizedHtml = useMemo(() => {
    try {
      const rawHtml = marked.parse(content, { async: false }) as string;
      return DOMPurify.sanitize(rawHtml);
    } catch (e) {
      console.error('[StreamingText] Parse error:', e);
      return 'Error parsing content.';
    }
  }, [content]);

  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words">
      <div 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      />
      {isStreaming && (
        <span 
          className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" 
          aria-hidden="true" 
        />
      )}
    </div>
  );
};
