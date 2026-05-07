import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '@/services/analyticsService';
import { authService } from '@/services/authService';
import { sessionService } from '@/services/sessionService';
import { geminiService } from '@/services/geminiService';
import { SessionSidebar } from '@/components/features/SessionSidebar';
import { CodeInput } from '@/components/features/CodeInput';
import { QuestionBar } from '@/components/features/QuestionBar';
import { ResponseBlock } from '@/components/features/ResponseBlock';
import { Session, QAEntry } from '@/types';
import { User } from 'firebase/auth';

export const AppPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [codeContext, setCodeContext] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  useEffect(() => {
    analyticsService.trackPageView('/app');
    const unsub = authService.onAuthStateChange(async (u) => {
      setUser(u);
      if (u) {
        const res = await sessionService.getUserSessions(u.uid);
        if (!res.error) setSessions(res.data || []);
      } else {
        // Guard: Redirect if not authenticated
        navigate('/', { replace: true });
      }
      setSidebarLoading(false);
    });
    return () => unsub();
  }, []);

  const handleNewSession = () => {
    setActiveSession(null);
    setCodeContext('');
  };

  const handleSelectSession = async (id: string) => {
    const res = await sessionService.getSessionById(id);
    if (!res.error && res.data) {
      setActiveSession(res.data);
      setCodeContext(res.data.codeContext);
    }
  };

  const handleDeleteSession = async (id: string) => {
    await sessionService.deleteSession(id);
    if (user) {
      const res = await sessionService.getUserSessions(user.uid);
      if (!res.error) setSessions(res.data || []);
    }
    if (activeSession?.id === id) {
      handleNewSession();
    }
  };

  const handleAskQuestion = async (question: string) => {
    if (!user) return;
    setIsStreaming(true);

    const newEntryId = crypto.randomUUID();
    const newEntry: QAEntry = {
      id: newEntryId,
      question,
      answer: '',
      timestamp: Date.now()
    };

    let sessionToUpdate = activeSession;
    if (!sessionToUpdate) {
      sessionToUpdate = {
        id: crypto.randomUUID(),
        userId: user.uid,
        title: question.substring(0, 40) + '...',
        codeContext,
        entries: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    }

    sessionToUpdate = {
      ...sessionToUpdate,
      entries: [...sessionToUpdate.entries, newEntry],
      updatedAt: Date.now(),
      codeContext
    };

    setActiveSession(sessionToUpdate);

    const res = await geminiService.streamCodeAnalysis(question, codeContext, (chunk) => {
      setActiveSession((prev) => {
        if (!prev) return prev;
        const updatedEntries = prev.entries.map((entry) => {
          if (entry.id === newEntryId) {
            return { ...entry, answer: entry.answer + chunk };
          }
          return entry;
        });
        return { ...prev, entries: updatedEntries };
      });
    });

    if (res.error) {
      alert(`AI Error: ${res.error}`);
      // Clean up the empty entry on error
      setActiveSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          entries: prev.entries.filter(e => e.id !== newEntryId)
        };
      });
    }

    setIsStreaming(false);

    setActiveSession((prev) => {
      if (prev) {
        sessionService.saveSession(prev).then(() => {
          sessionService.getUserSessions(user.uid).then((res) => {
            if (!res.error) setSessions(res.data || []);
          });
        });
      }
      return prev;
    });
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="hidden md:block">
        <SessionSidebar 
          sessions={sessions}
          activeSessionId={activeSession?.id}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          onNewSession={handleNewSession}
          isLoading={sidebarLoading}
        />
      </div>
      
      <main className="flex-1 flex flex-col h-full overflow-hidden" aria-label="Workspace">
        <header className="h-14 border-b border-gray-200 flex items-center px-4 md:px-6">
          <h2 className="font-semibold text-gray-800">
            {activeSession ? activeSession.title : 'New Analysis'}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-8">
          <section aria-label="Code Input">
            <h3 className="text-lg font-bold mb-4 text-gray-900">1. Provide Code Context</h3>
            <CodeInput value={codeContext} onChange={setCodeContext} disabled={isStreaming} />
          </section>

          <section aria-label="Analysis Output">
            <h3 className="text-lg font-bold mb-4 text-gray-900">2. Ask Gemini</h3>
            <div className="flex flex-col gap-6">
              {activeSession?.entries.map((entry) => (
                <ResponseBlock 
                  key={entry.id} 
                  entry={entry} 
                  isStreaming={isStreaming && entry.id === activeSession.entries[activeSession.entries.length - 1].id} 
                />
              ))}
              <QuestionBar onSubmit={handleAskQuestion} disabled={isStreaming || !codeContext.trim()} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
