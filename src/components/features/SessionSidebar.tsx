import React from 'react';
import { Session } from '@/types';
import { Button } from '@/components/ui/Button';

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewSession: () => void;
  isLoading?: boolean;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  isLoading
}) => {
  return (
    <aside className="w-64 h-full flex flex-col bg-gray-50 border-r border-gray-200" aria-label="Session History">
      <div className="p-4 border-b border-gray-200">
        <Button 
          onClick={onNewSession} 
          className="w-full justify-center"
          aria-label="Start new session"
        >
          + New Analysis
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500" aria-live="polite">Loading history...</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No past sessions</div>
        ) : (
          <ul className="flex flex-col gap-1" role="list">
            {sessions.map((session) => (
              <li key={session.id} className="group relative flex items-center">
                <button
                  onClick={() => onSelectSession(session.id)}
                  aria-current={activeSessionId === session.id ? 'page' : undefined}
                  className={`flex-1 text-left px-3 py-2 text-sm truncate rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    activeSessionId === session.id 
                      ? 'bg-blue-100 text-blue-900 font-medium' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {session.title || 'Untitled Session'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="absolute right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                  aria-label={`Delete session: ${session.title}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
