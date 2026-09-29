import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { useStudioStore } from '../../store/studioStore';
import {
  ShieldAlert,
  ShieldCheck,
  TableProperties,
  Sliders,
  FileCheck2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  FileCode,
  Layers,
  Database,
  Shuffle,
} from 'lucide-react';
import darkBg from '../../assets/images/hero_data_canvas_1790710263307.jpg';
import lightBg from '../../assets/images/light_hero_canvas_1790710285040.jpg';

export const CursorProblemStory: React.FC = () => {
  const { theme, setCurrentView } = useStudioStore();
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion spring-physics cursor tracking
  const mouseX = useMotionValue(200);
  const mouseY = useMotionValue(150);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 24 });

  const problems = [
    {
      id: 0,
      badge: 'Problem 01',
      title: 'Generic Mocks Ruin Real Test Cases',
      pain: 'Pre-canned mock generators only give you generic names and numbers. Your application needs specific schema: flight numbers, medical MRNs, IoT telemetry, and custom SKUs.',
      solution: 'Custom Schema on Demand',
      solutionDesc: 'Define any table and column name with 22+ real-world generators. Test with authentic, valid domain data.',
      icon: TableProperties,
      accent: 'amber',
      preview: {
        type: 'schema',
        table: 'telemetry_stream',
        cols: ['device_uuid', 'firmware_version', 'temperature_c', 'battery_status'],
        sample: ['550e8400-e29b', 'v4.18.2-rc', '74.2 °C', 'Nominal (98%)'],
      },
    },
    {
      id: 1,
      badge: 'Problem 02',
      title: 'Real Data Violates Privacy & GDPR',
      pain: 'Copying production dumps to staging or QA environments risks catastrophic data leaks, credential theft, and non-compliance fines.',
      solution: '100% Offline Browser Synthesis',
      solutionDesc: 'All data is mathematically computed client-side using deterministic PRNG. Zero network requests, 0% PII leak risk.',
      icon: ShieldCheck,
      accent: 'emerald',
      preview: {
        type: 'privacy',
        real: 'Elena Vance · elena.vance@citadel-corp.com · SSN ***-**-8812',
        synthetic: 'Sophia Mercer · s.mercer@testbox.internal · [PII Masked]',
      },
    },
    {
      id: 2,
      badge: 'Problem 03',
      title: 'Clean Data Masks Production Outages',
      pain: 'Testing only with happy-path data means your pipeline breaks the moment a missing value, null field, or extreme boundary outlier arrives.',
      solution: 'Controllable Noise & Outlier Injection',
      solutionDesc: 'Stress-test pipelines before deployment with dialable null rates (0–80%) and edge-case extreme multipliers.',
      icon: Sliders,
      accent: 'rose',
      preview: {
        type: 'noise',
        normal: 'Order $149.00 · Status: COMPLETED',
        nullRow: 'Order <null> · Status: <missing_token>',
        outlier: 'Order $9,999,999.00 [OUTLIER STRESS-TEST]',
      },
    },
    {
      id: 3,
      badge: 'Problem 04',
      title: 'Broken Relations & Financial Rounding Drift',
      pain: 'Foreign keys in mock tables frequently orphan parent records, and JavaScript floating-point math causes invoice pennies to drift.',
      solution: 'Verified PK/FK & Integer-Cent Arithmetic',
      solutionDesc: '100% referential tree integrity guaranteed, and financial invoices computed in exact integer cents with $0.00 drift.',
      icon: FileCheck2,
      accent: 'blue',
      preview: {
        type: 'relational',
        p1: 'Parent: Customer #1089',
        c1: 'Child: Order #ORD-4491 (Linked)',
        g1: 'Invoice Total: $1,240.50 (Exact Penny Math)',
      },
    },
    {
      id: 4,
      badge: 'All Solved',
      title: 'One Unified Studio for All Data Needs',
      pain: 'No more jumping between scripts, spreadsheet templates, and dummy APIs. Everything you need lives in one seamless workspace.',
      solution: 'Ready to build your custom schema?',
      solutionDesc: 'Create tabular data, linked relational tables, and reconciled invoices. Download as CSV, JSON, SQL, or save the schema configuration.',
      icon: Sparkles,
      accent: 'indigo',
      preview: {
        type: 'ready',
      },
    },
  ];

  // Moving cursor over container smoothly guides user across problems
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    // Calculate progression based on cursor X position across the width
    const ratio = Math.max(0, Math.min(0.999, x / rect.width));
    const step = Math.floor(ratio * problems.length);
    if (step !== activeStep) {
      setActiveStep(step);
    }
  };

  const curr = problems[activeStep];
  const Icon = curr.icon;

  return (
    <div className="relative w-full max-w-6xl mx-auto my-6 px-4">
      {/* Background Graphic Canvas */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-800 transition-all">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-90 dark:opacity-80 scale-105"
          style={{
            backgroundImage: `url(${theme === 'dark' ? darkBg : lightBg})`,
          }}
        />

        {/* High-Contrast Adaptable Overlay */}
        <div
          className={`absolute inset-0 backdrop-blur-xs transition-colors duration-500 ${
            theme === 'dark'
              ? 'bg-slate-950/85'
              : 'bg-white/92 backdrop-blur-md'
          }`}
        />

        {/* Spring cursor spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-35 dark:opacity-25 transition-opacity"
          style={{
            background: `radial-gradient(450px circle at ${springX}px ${springY}px, rgba(37,99,235,0.25), transparent 70%)`,
          }}
        />

        {/* Content Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative z-10 p-6 sm:p-10 lg:p-12 min-h-[520px] flex flex-col justify-between"
        >
          {/* Top Bar: Progress Indicator & Cursor Hint */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-300 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-800 dark:text-slate-200">
                Interactive Problem Navigator
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline">
                Move cursor across the card to explore problems solved
              </span>
            </div>

            {/* Step Pills */}
            <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-900/90 p-1 rounded-xl self-start sm:self-auto border border-slate-300 dark:border-slate-800">
              {problems.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveStep(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeStep === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Animated Problem & Solution Card */}
          <div className="my-auto py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={curr.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Column: Problem & Solution Explanation */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                    <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{curr.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {curr.title}
                  </h3>

                  <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1">
                      The Pain Point
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {curr.pain}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>How Synthora Solves It: {curr.solution}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {curr.solutionDesc}
                    </p>
                  </div>
                </div>

                {/* Right Column: Visual Live Representation */}
                <div className="lg:col-span-5">
                  <div className="p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-lg text-slate-900 dark:text-slate-100">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Live Engine Verification</span>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">Deterministic #42</span>
                    </div>

                    {curr.preview.type === 'schema' && (
                      <div className="space-y-2 text-xs">
                        <div className="font-mono text-[11px] text-slate-500 font-semibold">Table: {curr.preview.table}</div>
                        <div className="grid grid-cols-2 gap-2">
                          {curr.preview.cols?.map((c, i) => (
                            <div key={c} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                              <div className="font-mono text-[10px] text-blue-700 dark:text-blue-400 font-bold">{c}</div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{curr.preview.sample?.[i]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {curr.preview.type === 'privacy' && (
                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                          <div className="font-bold text-[11px] text-rose-700 dark:text-rose-400 mb-0.5">Dangerous: Real Customer Data</div>
                          <div className="font-mono text-[11px]">{curr.preview.real}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
                          <div className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 mb-0.5">Protected: Synthora Synthetic</div>
                          <div className="font-mono text-[11px]">{curr.preview.synthetic}</div>
                        </div>
                      </div>
                    )}

                    {curr.preview.type === 'noise' && (
                      <div className="space-y-2 text-xs font-mono">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                          {curr.preview.normal}
                        </div>
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300">
                          {curr.preview.nullRow}
                        </div>
                        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300">
                          {curr.preview.outlier}
                        </div>
                      </div>
                    )}

                    {curr.preview.type === 'relational' && (
                      <div className="space-y-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 font-semibold">
                          {curr.preview.p1}
                        </div>
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-300 font-semibold">
                          {curr.preview.c1}
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300 font-semibold">
                          {curr.preview.g1}
                        </div>
                      </div>
                    )}

                    {curr.preview.type === 'ready' && (
                      <div className="text-center py-4 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          Ready to build your custom schema?
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Click below to launch the studio, define custom columns, and export valid datasets.
                        </p>
                        <button
                          onClick={() => setCurrentView('tabular')}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all"
                        >
                          <span>Get Started — Launch Studio</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Bar: Manual Controls & Final Get Started */}
          <div className="pt-6 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-800 disabled:opacity-30 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setActiveStep((prev) => Math.min(problems.length - 1, prev + 1))}
                disabled={activeStep === problems.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-800 disabled:opacity-30 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Next Problem</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('tabular')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Get Started — Main Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
