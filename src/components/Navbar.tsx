import React, { useState, useRef, useEffect } from 'react';
import { useStudioStore, StudioView } from '../store/studioStore';
import {
  Moon,
  Sun,
  ArrowRight,
  FileCode,
  ChevronDown,
  ShieldAlert,
  Layers,
  Sliders,
  Share2,
  Sparkles,
  Table,
  Link2,
  FileText,
  Bot,
  Menu,
  X,
  Check,
} from 'lucide-react';
import { SchemaManagerModal } from './schema/SchemaManagerModal';

const CORE_PROBLEMS = [
  {
    step: 0,
    number: '01',
    title: 'Privacy & Compliance',
    desc: 'Real PII leaks in dev and breaks GDPR/HIPAA laws',
    icon: ShieldAlert,
  },
  {
    step: 1,
    number: '02',
    title: 'Rigid Mock Schemas',
    desc: 'Generic mocks fail your exact custom column rules',
    icon: Layers,
  },
  {
    step: 2,
    number: '03',
    title: 'Missing Edge Cases & Nulls',
    desc: 'Services crash on unhandled nulls and dirty feeds',
    icon: Sliders,
  },
  {
    step: 3,
    number: '04',
    title: 'Schema Portability & Drift',
    desc: 'Disposable mock scripts waste hours every sprint',
    icon: Share2,
  },
];

const STUDIO_ITEMS: {
  view: StudioView;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    view: 'tabular',
    title: 'Tabular Studio',
    desc: 'Custom schemas, statistical noise & PapaParse CSV export',
    icon: Table,
  },
  {
    view: 'relational',
    title: 'Relational Links',
    desc: 'Multi-table schemas with foreign keys & referential integrity',
    icon: Link2,
  },
  {
    view: 'documents',
    title: 'Financial Documents',
    desc: 'Realistic invoices, receipts & business drift simulation',
    icon: FileText,
  },
  {
    view: 'ai_prompt',
    title: 'AI Schema Prompt',
    desc: 'Synthesize production-grade schemas from plain English',
    icon: Bot,
  },
];

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, theme, toggleTheme, openWalkthrough } = useStudioStore();
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isStudiosOpen, setIsStudiosOpen] = useState(false);
  const [isProblemsOpen, setIsProblemsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studiosRef = useRef<HTMLDivElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);

  const isStudioActive =
    currentView === 'tabular' ||
    currentView === 'relational' ||
    currentView === 'documents' ||
    currentView === 'ai_prompt';

  // Close dropdowns on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (studiosRef.current && !studiosRef.current.contains(target)) {
        setIsStudiosOpen(false);
      }
      if (problemsRef.current && !problemsRef.current.contains(target)) {
        setIsProblemsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsStudiosOpen(false);
        setIsProblemsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectStudio = (view: StudioView) => {
    setCurrentView(view);
    setIsStudiosOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSelectProblem = (stepIndex: number) => {
    setIsProblemsOpen(false);
    setIsMobileMenuOpen(false);
    openWalkthrough(stepIndex);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors border-b ${
          theme === 'dark'
            ? 'bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-md'
            : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-md shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              setCurrentView('landing');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
            aria-label="Synthora Home"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-sm">
              S
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight font-sans text-slate-900 dark:text-white">
                Synthora
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>
          </button>

          {/* Zone 2: Categorized, Minimal Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide">
            {/* 1. Overview */}
            <button
              onClick={() => setCurrentView('landing')}
              className={`transition-colors py-1.5 cursor-pointer ${
                currentView === 'landing'
                  ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 -mb-[2px]'
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Overview
            </button>

            {/* 2. Categorized Studios Dropdown */}
            <div className="relative" ref={studiosRef}>
              <button
                type="button"
                onClick={() => {
                  setIsStudiosOpen(!isStudiosOpen);
                  setIsProblemsOpen(false);
                }}
                className={`flex items-center gap-1.5 py-1.5 transition-colors cursor-pointer ${
                  isStudioActive || isStudiosOpen
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
                aria-expanded={isStudiosOpen}
                aria-haspopup="true"
              >
                <span>Studios</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isStudiosOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Studios Dropdown Menu */}
              {isStudiosOpen && (
                <div
                  className={`absolute left-0 mt-2 w-84 rounded-2xl shadow-xl border p-2 z-50 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-md'
                      : 'bg-white border-slate-200 text-slate-900 shadow-lg'
                  }`}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    Synthesis Studios
                  </div>

                  <div className="space-y-1">
                    {STUDIO_ITEMS.map((item) => {
                      const IconComponent = item.icon;
                      const isCurrent = currentView === item.view;
                      return (
                        <button
                          key={item.view}
                          onClick={() => handleSelectStudio(item.view)}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-3 group cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          <div
                            className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isCurrent
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-semibold ${
                                  isCurrent
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                }`}
                              >
                                {item.title}
                              </span>
                              {isCurrent && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug truncate mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Schema JSON Action tucked inside menu to keep navbar minimal */}
                  <div className="my-1.5 border-t border-slate-100 dark:border-slate-800/80" />
                  <button
                    onClick={() => {
                      setIsStudiosOpen(false);
                      setIsSchemaModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Schema JSON Config</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Import/Export</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Categorized Problems Dropdown */}
            <div className="relative" ref={problemsRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProblemsOpen(!isProblemsOpen);
                  setIsStudiosOpen(false);
                }}
                className={`flex items-center gap-1.5 py-1.5 transition-colors cursor-pointer ${
                  isProblemsOpen
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
                aria-expanded={isProblemsOpen}
                aria-haspopup="true"
              >
                <span>Problems</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isProblemsOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Problems Dropdown Menu */}
              {isProblemsOpen && (
                <div
                  className={`absolute left-0 mt-2 w-84 rounded-2xl shadow-xl border p-2 z-50 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-md'
                      : 'bg-white border-slate-200 text-slate-900 shadow-lg'
                  }`}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    Core Data Challenges Solved
                  </div>

                  <div className="space-y-1">
                    {CORE_PROBLEMS.map((prob) => {
                      const IconComponent = prob.icon;
                      return (
                        <button
                          key={prob.step}
                          onClick={() => handleSelectProblem(prob.step)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 group cursor-pointer"
                        >
                          <div className="mt-0.5 w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono text-slate-400 font-normal">
                                {prob.number}.
                              </span>
                              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {prob.title}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug truncate mt-0.5">
                              {prob.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="my-1.5 border-t border-slate-100 dark:border-slate-800/80" />

                  <button
                    onClick={() => handleSelectProblem(0)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Interactive Problem Tour</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Actions & Theme Toggle (Minimal) */}
          <div className="flex items-center gap-3">
            {/* Tactile Theme Toggle Switch */}
            <div className="flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                onClick={toggleTheme}
                className={`relative inline-flex h-8 w-[60px] shrink-0 cursor-pointer items-center rounded-full p-1 border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-200 border-slate-300 hover:border-slate-400'
                }`}
                title={`Currently in ${theme} mode. Click to toggle to ${theme === 'dark' ? 'light' : 'dark'} mode.`}
              >
                <span className="sr-only">Toggle theme</span>
                <div className="flex w-full justify-between items-center px-0.5 pointer-events-none select-none">
                  <Sun
                    className={`w-3.5 h-3.5 transition-colors ${
                      theme === 'light' ? 'text-amber-500 opacity-100' : 'text-slate-600 opacity-40'
                    }`}
                  />
                  <Moon
                    className={`w-3.5 h-3.5 transition-colors ${
                      theme === 'dark' ? 'text-blue-400 opacity-100' : 'text-slate-400 opacity-40'
                    }`}
                  />
                </div>

                <span
                  className={`absolute top-0.5 left-0.5 flex h-6.5 w-6.5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                    theme === 'dark'
                      ? 'translate-x-7 bg-slate-800 text-blue-400 border border-slate-700'
                      : 'translate-x-0 bg-white text-amber-500 border border-slate-200'
                  }`}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-3.5 h-3.5 fill-blue-400/20" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 fill-amber-500/20" />
                  )}
                </span>
              </button>
            </div>

            {/* Quick Open Studio Button when on landing page */}
            {currentView === 'landing' ? (
              <button
                onClick={() => setCurrentView('tabular')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
              >
                <span>Open Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden border-t px-4 pt-3 pb-5 space-y-4 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <button
                onClick={() => {
                  setCurrentView('landing');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 text-sm font-semibold ${
                  currentView === 'landing' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Overview
              </button>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Studios
              </div>
              <div className="space-y-1">
                {STUDIO_ITEMS.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => handleSelectStudio(item.view)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                      currentView === item.view
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{item.title}</span>
                    {currentView === item.view && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSchemaModalOpen(true);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Schema JSON Config</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Problems Solved
              </div>
              <div className="space-y-1">
                {CORE_PROBLEMS.map((prob) => (
                  <button
                    key={prob.step}
                    onClick={() => handleSelectProblem(prob.step)}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <span className="font-mono text-slate-400 mr-1.5">{prob.number}.</span>
                    {prob.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Schema Manager Modal */}
      <SchemaManagerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </>
  );
};
