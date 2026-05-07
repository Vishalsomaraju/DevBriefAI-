import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LandingPage } from '@/pages/LandingPage';
import { AppPage } from '@/pages/AppPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AuthGuard } from '@/components/ui/AuthGuard';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:text-blue-600 focus:z-50">
          Skip to main content
        </a>
        
        <div id="main-content" className="min-h-screen">
          <Routes>
            <Route path="/" element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
            <Route 
              path="/app" 
              element={
                <ErrorBoundary>
                  <AuthGuard>
                    <AppPage />
                  </AuthGuard>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ErrorBoundary>
                  <AuthGuard>
                    <HistoryPage />
                  </AuthGuard>
                </ErrorBoundary>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
