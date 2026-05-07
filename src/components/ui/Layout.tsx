/**
 * @module components/ui/Layout
 * @description Application shell providing the main structural layout including sidebar and main content area.
 */
import React from 'react';

interface LayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {sidebar && (
        <aside className="w-64 border-r border-border bg-card flex-shrink-0 flex flex-col">
          {sidebar}
        </aside>
      )}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {children}
      </main>
    </div>
  );
};
