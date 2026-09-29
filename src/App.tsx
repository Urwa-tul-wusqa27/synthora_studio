import React, { useEffect } from 'react';
import { useStudioStore } from './store/studioStore';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { TabularStudio } from './components/tabular/TabularStudio';
import { RelationalStudio } from './components/relational/RelationalStudio';
import { DocumentStudio } from './components/documents/DocumentStudio';
import { AIPromptStudio } from './components/ai/AIPromptStudio';
import { ProblemWalkthroughModal } from './components/walkthrough/ProblemWalkthroughModal';

export default function App() {
  const { currentView, theme } = useStudioStore();

  // Apply dark class to document root for dark mode styling
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Navbar />

      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'tabular' && <TabularStudio />}
        {currentView === 'relational' && <RelationalStudio />}
        {currentView === 'documents' && <DocumentStudio />}
        {currentView === 'ai_prompt' && <AIPromptStudio />}
      </main>

      {/* Interactive Problem Solver Walkthrough Guide */}
      <ProblemWalkthroughModal />
    </div>
  );
}
