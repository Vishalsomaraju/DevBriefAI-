import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { analyticsService } from '@/services/analyticsService';
import { AuthButton } from '@/components/features/AuthButton';
import { User } from 'firebase/auth';

export const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    analyticsService.trackPageView('/');
    const unsubscribe = authService.onAuthStateChange(setUser);
    return () => unsubscribe();
  }, []);

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">DevBrief AI</h1>
        <AuthButton user={user} />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 text-center" aria-label="Main content">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Understand Any Codebase in Seconds
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Paste a GitHub URL or raw code snippet, and let Gemini 2.0 Flash instantly explain architecture, generate PR summaries, and flag vulnerabilities.
        </p>
        
        <div className="flex justify-center mb-16">
          <AuthButton user={user} />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Explanations</h3>
            <p className="text-gray-600">Demystify complex legacy systems or unfamiliar open-source projects with precise, context-aware breakdowns.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Automated PR Summaries</h3>
            <p className="text-gray-600">Generate structured summaries detailing changes, risk levels, and suggested reviewers in a single click.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Security & Performance</h3>
            <p className="text-gray-600">Automatically flag security vulnerabilities, anti-patterns, and performance bottlenecks before they hit production.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
