import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useStudioStore } from '../../store/studioStore';
import { formatCents } from '../../lib/generators/document';
import {
  Table2,
  Wrench,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  GitFork,
  FileCheck2,
  RefreshCw,
  Play,
  Pause,
} from 'lucide-react';

export const CursorTrackingShowcase: React.FC = () => {
  const { theme, setCurrentView } = useStudioStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Stage: 0 = Tabular Generation, 1 = Solving Data Problems, 2 = All-in-One Convergence
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Framer Motion spring-smoothed cursor coordinates
  const mouseX = useMotionValue(300);
  const mouseY = useMotionValue(200);
  const springX = useSpring(mouseX, { stiffness: 220, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 25 });

  // Auto-play timer when user isn't hovering
  useEffect(() => {
    if (!autoPlay || isHovering) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay, isHovering]);

  // Handle cursor movement inside container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    // Map horizontal position to stages (0: 0-33%, 1: 34-66%, 2: 67-100%)
    const normalizedX = Math.max(0, Math.min(1, x / rect.width));
    if (normalizedX < 0.35) {
      setActiveStage(0);
    } else if (normalizedX < 0.68) {
      setActiveStage(1);
    } else {
      setActiveStage(2);
    }
  };

  const stageLabels = [
    { title: '01. Tabular Generation', desc: 'Real-time seeded synthesis' },
    { title: '02. Solving Data Problems', desc: 'Privacy, nulls & relational' },
    { title: '03. All-in-One Convergence', desc: 'Unified studio platform' },
  ];

  const cursorBadgeText = [
    'Stage 1: Generating Tabular Data',
    'Stage 2: Resolving Bottlenecks',
    'Stage 3: All-in-One Hub Ready',
  ][activeStage];

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      {/* Stage Controller Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        {/* Stage Indicators */}
        <div className="flex-1 grid grid-cols-3 gap-2">
          {stageLabels.map((st, idx) => {
            const isActive = idx === activeStage;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveStage(idx as 0 | 1 | 2);
                  setAutoPlay(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">{st.title}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate hidden sm:block">
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Auto-play toggle */}
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 self-end sm:self-auto"
          title={autoPlay ? 'Pause auto-transition' : 'Resume auto-transition'}
        >
          {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{autoPlay ? 'Scrubbing Cursor Mode' : 'Resume Auto'}</span>
        </button>
      </div>

      {/* Interactive Cursor-Tracked Viewport */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className={`relative overflow-hidden rounded-2xl border min-h-[460px] flex flex-col justify-between p-6 sm:p-10 transition-colors select-none ${
          theme === 'dark'
            ? 'bg-slate-900/95 border-slate-800 shadow-2xl'
            : 'bg-white border-slate-200 shadow-xl'
        }`}
      >
        {/* Interactive Spring-Smoothed Cursor Follower */}
        {isHovering && (
          <motion.div
            style={{
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            className="pointer-events-none absolute z-30 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold text-white bg-blue-600/90 backdrop-blur-md shadow-lg border border-blue-400/40"
          >
            <Sparkles className="w-3 h-3" />
            <span>{cursorBadgeText}</span>
          </motion.div>
        )}

        {/* Dynamic Radial Spotlight behind cursor */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-40 transition-opacity"
          style={{
            background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(37, 99, 235, 0.15), transparent 75%)`,
          }}
        />

        {/* Stage Content with Motion Fade & Slide */}
        <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* STAGE 1: Tabular Synthetic Generation */}
            {activeStage === 0 && (
              <motion.div
                key="stage-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mb-1">
                      <Table2 className="w-4 h-4" />
                      <span>STAGE 1 · SYNTHETIC TABULAR DATA GENERATION</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      Instant, Seeded Realistic Records
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                      Generate high-fidelity tabular data with deterministic PRNG seeds, customizable null rates, and boundary outlier stress testing.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                      PRNG: Mulberry32
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Seed: #42
                    </span>
                  </div>
                </div>

                {/* Animated Streaming Table */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 overflow-hidden shadow-inner">
                  <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>table: `synthetic_customers_v1`</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Generated 50 Records in 4ms
                    </span>
                  </div>

                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left font-sans">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-400">
                          <th className="py-2.5 px-3">id</th>
                          <th className="py-2.5 px-3">full_name</th>
                          <th className="py-2.5 px-3">email</th>
                          <th className="py-2.5 px-3">arr_cents</th>
                          <th className="py-2.5 px-3">country</th>
                          <th className="py-2.5 px-3">status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono text-[11px]">
                        <motion.tr
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 }}
                          className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                        >
                          <td className="py-2 px-3 text-slate-400">UUID-9812</td>
                          <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">Elena Vance</td>
                          <td className="py-2 px-3 text-slate-500">elena.vance@syntheticmail.org</td>
                          <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                            {formatCents(450000)}
                          </td>
                          <td className="py-2 px-3 text-slate-700 dark:text-slate-300">United States</td>
                          <td className="py-2 px-3 text-blue-600 dark:text-blue-400 font-semibold">Active</td>
                        </motion.tr>

                        <motion.tr
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 bg-amber-500/5"
                        >
                          <td className="py-2 px-3 text-slate-400">UUID-9813</td>
                          <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">Liam Johnson</td>
                          <td className="py-2 px-3 text-amber-500 italic">&lt;null (injected 15%)&gt;</td>
                          <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                            {formatCents(120000)}
                          </td>
                          <td className="py-2 px-3 text-slate-700 dark:text-slate-300">Germany</td>
                          <td className="py-2 px-3 text-amber-500 font-semibold">Pending</td>
                        </motion.tr>

                        <motion.tr
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                        >
                          <td className="py-2 px-3 text-slate-400">UUID-9814</td>
                          <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">Sophia Martinez</td>
                          <td className="py-2 px-3 text-slate-500">sophia.m@datalab.internal</td>
                          <td className="py-2 px-3 text-rose-500 font-semibold tabular-nums">
                            {formatCents(9999999)} <span className="text-[10px] text-slate-400">(outlier)</span>
                          </td>
                          <td className="py-2 px-3 text-slate-700 dark:text-slate-300">Singapore</td>
                          <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">Active</td>
                        </motion.tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Move cursor right to see problem solutions →</span>
                  <button
                    onClick={() => setActiveStage(1)}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Next: Solving Data Problems</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: Solving Specific Data Problems */}
            {activeStage === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                      <Wrench className="w-4 h-4" />
                      <span>STAGE 2 · SOLVING SPECIFIC DATA PROBLEMS</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      Targeted Solutions for Critical Bottlenecks
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                      Eliminate compliance risks, broken child references, and financial float drift with purpose-built generators.
                    </p>
                  </div>
                </div>

                {/* 3 Problem & Solution Transformation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Problem 1: Compliance */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                      <Lock className="w-4 h-4 text-blue-500" />
                      <span>1. Privacy & Compliance</span>
                    </div>
                    <div className="text-[11px] text-rose-500 mb-2 font-mono">
                      PAIN: Real PII cannot enter staging environments.
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Solution:</strong> De-identified synthetic patients & users with realistic names and zero external network transmissions.
                    </div>
                    <div className="mt-3 text-[11px] font-mono text-emerald-500 font-semibold">
                      ✓ GDPR & HIPAA Safe
                    </div>
                  </div>

                  {/* Problem 2: Relational FKs */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                      <GitFork className="w-4 h-4 text-amber-500" />
                      <span>2. Linked Relational Data</span>
                    </div>
                    <div className="text-[11px] text-rose-500 mb-2 font-mono">
                      PAIN: Mock orders crash with orphaned foreign keys.
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Solution:</strong> 3-tier hierarchy (Customers → Orders → Order Items) with 100% verified foreign key consistency.
                    </div>
                    <div className="mt-3 text-[11px] font-mono text-emerald-500 font-semibold">
                      ✓ 0 Orphaned Records
                    </div>
                  </div>

                  {/* Problem 3: Float drift */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-500" />
                      <span>3. Reconciled Financials</span>
                    </div>
                    <div className="text-[11px] text-rose-500 mb-2 font-mono">
                      PAIN: Floating point drift breaks invoice auditing.
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Solution:</strong> Invoices and ledger running balances calculated strictly in integer cents with $0.00 discrepancy.
                    </div>
                    <div className="mt-3 text-[11px] font-mono text-emerald-500 font-semibold">
                      ✓ Exact Cents Parity
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <button
                    onClick={() => setActiveStage(0)}
                    className="hover:underline"
                  >
                    ← Back to Tabular Generation
                  </button>
                  <button
                    onClick={() => setActiveStage(2)}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Next: All-in-One Platform Convergence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: All-in-One Convergence & Get Started CTA */}
            {activeStage === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full text-center py-4"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold mb-3 border border-blue-500/20">
                    <Layers className="w-3.5 h-3.5" />
                    <span>STAGE 3 · ALL-IN-ONE PLATFORM CONVERGENCE</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Every Data Problem.{' '}
                    <span className="text-blue-600 dark:text-blue-500">One Unified Platform.</span>
                  </h3>

                  <p className="mt-3 text-xs sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    No more fragmented mock scripts or compliance delays. Tabular, relational hierarchies, financial documents, and natural-language prompt synthesis — combined in one browser-based studio.
                  </p>

                  {/* Convergence Badges */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span className="px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                      ⚡ 100% Offline
                    </span>
                    <span className="px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                      🔒 Zero Network Leaks
                    </span>
                    <span className="px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                      🎯 Deterministic PRNG
                    </span>
                    <span className="px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                      📦 CSV / JSON / SQL Export
                    </span>
                  </div>

                  {/* Prominent GET STARTED CTA */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setCurrentView('tabular')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                    >
                      <span>Get Started Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentView('ai_prompt')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span>Prompt Your Schema</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Scrubbing Guide */}
        <div className="relative z-10 pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Interactive Cursor Tracking</span>
            <span>·</span>
            <span>Glide cursor horizontally to scrub through stages</span>
          </div>

          <div className="flex items-center gap-2 text-blue-500 font-semibold">
            <span>Current: Stage {activeStage + 1} of 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
