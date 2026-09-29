import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudioStore } from '../../store/studioStore';
import {
  Table2,
  GitFork,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  Layers,
  Database,
} from 'lucide-react';
import { formatCents } from '../../lib/generators/document';

interface StepSolution {
  id: string;
  stageNumber: string;
  shortTag: string;
  title: string;
  problem: string;
  solution: string;
  icon: React.ElementType;
  demoType: 'tabular' | 'relational' | 'document' | 'all_in_one';
}

const STAGES: StepSolution[] = [
  {
    id: 'tabular',
    stageNumber: '01',
    shortTag: 'TABULAR SOLVED',
    title: 'Dirty & Scarce Tabular Data',
    problem: 'Missing values, naive test distributions, and privacy compliance blockers.',
    solution: 'Deterministic synthetic tables with custom null rates, boundary outliers, and 20+ real-world types.',
    icon: Table2,
    demoType: 'tabular',
  },
  {
    id: 'relational',
    stageNumber: '02',
    shortTag: 'RELATIONAL SOLVED',
    title: 'Broken Foreign Keys & Isolated Tables',
    problem: 'Mock tables don’t connect: orders orphan without parent customers, breaking demo flows.',
    solution: 'Three-tier relational generation (Customers → Orders → Items) with guaranteed 100% referential integrity.',
    icon: GitFork,
    demoType: 'relational',
  },
  {
    id: 'document',
    stageNumber: '03',
    shortTag: 'DOCUMENTS SOLVED',
    title: 'Financial Drift in Invoices & Ledgers',
    problem: 'Float math drifts, causing tax and total rounding errors that fail billing audits.',
    solution: 'Invoices and bank statements calculated strictly in integer cents with verified $0.00 discrepancy.',
    icon: FileCheck2,
    demoType: 'document',
  },
  {
    id: 'all_in_one',
    stageNumber: '04',
    shortTag: 'ALL-IN-ONE PLATFORM',
    title: 'All Your Data Pains in One Workspace',
    problem: 'Stitching together 4 different mock scripts, fragile CSV generators, and unverified data mocks.',
    solution: 'One unified offline synthetic studio. Zero network leaks, 100% deterministic, instant export.',
    icon: Layers,
    demoType: 'all_in_one',
  },
];

export const InteractiveProblemShowcase: React.FC = () => {
  const { theme, setCurrentView, applyPreset } = useStudioStore();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const activeStep = STAGES[activeStepIndex];

  // Mouse move handler for interactive cursor glow and dynamic slice interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });

    // Optional: guide active slice based on horizontal hover position across the 4 quarters
    const segmentWidth = rect.width / 4;
    const step = Math.min(3, Math.max(0, Math.floor(x / segmentWidth)));
    if (step !== activeStepIndex && e.clientY < rect.top + 100) {
      setActiveStepIndex(step);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      {/* Step Navigation Pill Track */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-1.5 rounded-2xl border bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 mb-6">
        {STAGES.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepIndex(idx)}
              onMouseEnter={() => setActiveStepIndex(idx)}
              className={`flex-1 flex items-center justify-between sm:justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] opacity-60">{step.stageNumber}.</span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <span className="truncate">{step.shortTag}</span>
              </div>
              {isActive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Cursor-Responsive Showcase Box */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-colors ${
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200 shadow-lg'
        }`}
      >
        {/* Subtle dynamic cursor backlight (clean blue/slate radial gradient) */}
        <div
          className="pointer-events-none absolute -inset-px opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(550px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(37, 99, 235, 0.12), transparent 70%)`,
          }}
        />

        {/* Content Section: Left explanation, Right live visual interactive preview */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Problem & Solution Explanation */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mb-2">
                <span>INTERACTIVE SHOWCASE</span>
                <span>·</span>
                <span>STEP {activeStep.stageNumber} OF 04</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeStep.title}
              </h3>

              {/* The Pain */}
              <div className="mt-4 p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/20 text-xs">
                <span className="font-semibold text-rose-700 dark:text-rose-400 block mb-1">
                  The Problem:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeStep.problem}
                </p>
              </div>

              {/* The Solution */}
              <div className="mt-3 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                  How Synthora Solves It:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeStep.solution}
                </p>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2 flex items-center gap-3">
              {activeStep.demoType === 'all_in_one' ? (
                <button
                  onClick={() => setCurrentView('tabular')}
                  className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <span>Get Started — Launch Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeStep.demoType === 'tabular') applyPreset('privacy');
                      else if (activeStep.demoType === 'relational') applyPreset('relational');
                      else if (activeStep.demoType === 'document') applyPreset('documents');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Try {activeStep.shortTag}</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>

                  <button
                    onClick={() => setActiveStepIndex((prev) => (prev + 1) % STAGES.length)}
                    className="text-xs px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    Next Solution →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Interactive Solution Demo */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeStep.demoType === 'tabular' && (
                <motion.div
                  key="tabular-demo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-xl border p-4 ${
                    theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Table2 className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Live Tabular Grid with Controlled Null Injection
                      </span>
                    </div>
                    <span className="font-mono text-emerald-500 font-semibold text-[11px]">
                      100% Deterministic
                    </span>
                  </div>

                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left font-sans">
                      <thead>
                        <tr className="font-mono text-[11px] text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <th className="py-2 px-2">record_id</th>
                          <th className="py-2 px-2">user_name</th>
                          <th className="py-2 px-2">email</th>
                          <th className="py-2 px-2">revenue_cents</th>
                          <th className="py-2 px-2">status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-[11px]">
                        <tr>
                          <td className="py-2 px-2 font-mono text-slate-400">REC-1042</td>
                          <td className="py-2 px-2 font-medium">Liam Johnson</td>
                          <td className="py-2 px-2 text-slate-500">liam.j@syntheticmail.org</td>
                          <td className="py-2 px-2 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                            {formatCents(148500)}
                          </td>
                          <td className="py-2 px-2 font-medium text-blue-500">Active</td>
                        </tr>
                        <tr className="bg-amber-500/5">
                          <td className="py-2 px-2 font-mono text-slate-400">REC-1043</td>
                          <td className="py-2 px-2 font-medium">Sophia Martinez</td>
                          <td className="py-2 px-2 font-mono text-amber-500 italic">&lt;null (simulated)&gt;</td>
                          <td className="py-2 px-2 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                            {formatCents(89000)}
                          </td>
                          <td className="py-2 px-2 font-medium text-amber-500">Pending</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-mono text-slate-400">REC-1044</td>
                          <td className="py-2 px-2 font-medium">Noah Williams</td>
                          <td className="py-2 px-2 text-slate-500">noah.w@testcloud.io</td>
                          <td className="py-2 px-2 font-mono tabular-nums text-rose-500 font-semibold">
                            {formatCents(99999999)} <span className="text-[10px] text-slate-400">(outlier)</span>
                          </td>
                          <td className="py-2 px-2 font-medium text-emerald-500">Completed</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-mono text-slate-400">REC-1045</td>
                          <td className="py-2 px-2 font-medium">Ava Brown</td>
                          <td className="py-2 px-2 text-slate-500">ava.b@datalab.internal</td>
                          <td className="py-2 px-2 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                            {formatCents(342000)}
                          </td>
                          <td className="py-2 px-2 font-medium text-blue-500">Active</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Null Injection: 15% rate simulated</span>
                    <span className="text-emerald-500 font-semibold">Ready for QA & ML Pipelines</span>
                  </div>
                </motion.div>
              )}

              {activeStep.demoType === 'relational' && (
                <motion.div
                  key="relational-demo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-xl border p-4 ${
                    theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <GitFork className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Primary Key / Foreign Key Relational Linkage
                      </span>
                    </div>
                    <span className="font-mono text-emerald-500 font-semibold text-[11px]">
                      Orphans: 0 (100% Match)
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Parent Customer */}
                    <div className="p-2.5 rounded-lg border border-blue-500/30 bg-blue-500/5">
                      <div className="flex justify-between items-center text-[11px] font-mono text-blue-500 font-semibold mb-1">
                        <span>1. Parent: customers</span>
                        <span>PK: CUST-1042</span>
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        Elena Vance · Enterprise Tier · United States
                      </div>
                    </div>

                    {/* Linked Child Order */}
                    <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 ml-4">
                      <div className="flex justify-between items-center text-[11px] font-mono text-amber-500 font-semibold mb-1">
                        <span>2. Child: orders</span>
                        <span>PK: ORD-5089 → FK: CUST-1042</span>
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        Order Date: 2026-03-12 · Shipped · Shipping: {formatCents(2500)}
                      </div>
                    </div>

                    {/* Linked Grandchild Item */}
                    <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 ml-8">
                      <div className="flex justify-between items-center text-[11px] font-mono text-emerald-500 font-semibold mb-1">
                        <span>3. Grandchild: order_items</span>
                        <span>PK: ITEM-9214 → FK: ORD-5089</span>
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        2x Cloud Compute Tier 3 · Unit: {formatCents(245000)} · Total: {formatCents(490000)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Hierarchy Depth: 3 Connected Tables</span>
                    <span className="text-emerald-500 font-semibold">100% Referential Integrity</span>
                  </div>
                </motion.div>
              )}

              {activeStep.demoType === 'document' && (
                <motion.div
                  key="document-demo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-xl border p-4 ${
                    theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Exact Mathematical Document Reconciliation
                      </span>
                    </div>
                    <span className="font-mono text-emerald-500 font-semibold text-[11px]">
                      Rounding Error: $0.00
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-2 font-mono">
                    <div className="flex justify-between border-b pb-2 text-[11px] text-slate-500">
                      <span>INVOICE: INV-2026-88412</span>
                      <span>TERMS: NET 30</span>
                    </div>

                    <div className="space-y-1.5 py-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Dedicated Compute Cluster (1x)</span>
                        <span className="tabular-nums font-semibold">{formatCents(480000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">SOC2 Compliance Audit Package (1x)</span>
                        <span className="tabular-nums font-semibold">{formatCents(320000)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal Cents:</span>
                        <span className="tabular-nums">{formatCents(800000)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Tax Rate (8.5%):</span>
                        <span className="tabular-nums">{formatCents(68000)}</span>
                      </div>
                      <div className="flex justify-between text-rose-500">
                        <span>Corporate Discount:</span>
                        <span className="tabular-nums">-{formatCents(10000)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-blue-600 pt-1 border-t">
                        <span>Total Cents Verified:</span>
                        <span className="tabular-nums">{formatCents(858000)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Math Basis: Integer Cents</span>
                    <span className="text-emerald-500 font-semibold">Zero Floating-Point Drift</span>
                  </div>
                </motion.div>
              )}

              {activeStep.demoType === 'all_in_one' && (
                <motion.div
                  key="all-in-one-demo"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border p-5 bg-gradient-to-br from-blue-600/10 via-slate-900/10 to-emerald-600/10 border-blue-500/30"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      All Data Problems. One Unified Platform.
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-blue-600 mb-1">01. Tabular Generation</div>
                      <p className="text-[11px] text-slate-500">Null rates, outliers & 20+ types</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-blue-600 mb-1">02. Relational PK/FK</div>
                      <p className="text-[11px] text-slate-500">100% referential integrity</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-blue-600 mb-1">03. Documents & Ledgers</div>
                      <p className="text-[11px] text-slate-500">Invoices & statements in exact cents</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-blue-600 mb-1">04. AI Schema Prompt</div>
                      <p className="text-[11px] text-slate-500">Natural language to typed schema</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>100% Offline · Zero Network Leaks</span>
                    </div>

                    <button
                      onClick={() => setCurrentView('tabular')}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                    >
                      <span>Get Started Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
