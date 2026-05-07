import React, { useState } from 'react';
import { APP_CONFIG } from '@/constants';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, disabled }) => {
  const [activeTab, setActiveTab] = useState<'raw' | 'url'>('raw');
  const [url, setUrl] = useState('');

  const isTruncated = value.length > APP_CONFIG.maxCodeContextLength;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex border-b border-gray-200" role="tablist" aria-label="Code input methods">
        <button
          role="tab"
          aria-selected={activeTab === 'raw'}
          aria-controls="raw-code-panel"
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            activeTab === 'raw' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Raw Code
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'url'}
          aria-controls="url-panel"
          onClick={() => setActiveTab('url')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            activeTab === 'url' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          GitHub URL
        </button>
      </div>

      <div id="raw-code-panel" role="tabpanel" hidden={activeTab !== 'raw'} className="flex flex-col gap-1">
        <label htmlFor="code-textarea" className="sr-only">Paste raw code here</label>
        <textarea
          id="code-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste your raw code here..."
          className="w-full h-48 p-3 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:border-blue-500 resize-y"
          aria-describedby="code-textarea-hint"
        />
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span id="code-textarea-hint">
            {value.length} / {APP_CONFIG.maxCodeContextLength} characters
          </span>
          {isTruncated && (
            <span className="text-orange-600 font-medium" role="alert">
              Warning: Code exceeds limit and will be truncated.
            </span>
          )}
        </div>
      </div>

      <div id="url-panel" role="tabpanel" hidden={activeTab !== 'url'} className="flex flex-col gap-2">
        <label htmlFor="github-url-input" className="text-sm font-medium text-gray-700">
          GitHub Repository or File URL
        </label>
        <div className="flex gap-2">
          <input
            id="github-url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            placeholder="https://github.com/user/repo"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:border-blue-500"
          />
          <button
            onClick={() => {/* Implement URL fetch logic here */}}
            disabled={disabled || !url}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            Fetch
          </button>
        </div>
      </div>
    </div>
  );
};
