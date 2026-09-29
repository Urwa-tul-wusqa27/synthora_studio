import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudioStore } from '../../store/studioStore';
import { formatCents } from '../../lib/generators/document';
import { exportSchemaConfigurationJSON, triggerDownload } from '../../lib/export';
import {
  Table2,
  GitFork,
  FileCheck2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Download,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  FileCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DelightfulHeroShowcase: React.FC = () => {
  const { theme, setCurrentView, applyPreset, tabularFields } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'tabular' | 'relational' | 'documents'>('tabular');
  const [seed, setSeed] = useState(42);
  const [simulateNulls, setSimulateNulls] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleQuickDownloadSchema = () => {
    const json = exportSchemaConfigurationJSON({
      name: `synthora_${activeTab}_template`,
      seed,
      recordCount: 50,
      fields: tabularFields,
    });
    triggerDownload(json, `synthora_${activeTab}_schema.json`, 'application/json');
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  // 3 sample rows based on seed and simulateNulls
  const sampleTabularRows = [
    {
      id: 'REC-101',
      name: seed % 2 === 0 ? 'Liam Anderson' : 'Sophia Chen',
      email: seed % 2 === 0 ? 'liam.a@syntheticmail.org' : 'sophia.c@testcloud.io',
      role: 'Staff Engineer',
      revenue: 125000,
      status: 'Active',
    },
    {
      id: 'REC-102',
      name: seed % 3 === 0 ? 'Elena Vance' : 'Noah Williams',
      email: simulateNulls ? null : 'elena.v@datalab.internal',
      role: simulateNulls ? null : 'Product Lead',
      revenue: 89000,
      status: 'Pending',
    },
    {
      id: 'REC-103',
      name: seed % 5 === 0 ? 'Marcus Brody' : 'Ava Martinez',
      email: 'ava.m@quantumsafe.dev',
      role: 'Security Analyst',
      revenue: 240000,
      status: 'Active',
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full max-w-5xl mx-auto my-8 relative"
    >
      {/* Dynamic ambient cursor glow (gentle, warm blue/emerald, zero purple) */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-40 blur-3xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x * 100}% ${
            mousePos.y * 100
          }%, rgba(37, 99, 235, 0.18), rgba(16, 185, 129, 0.08), transparent 70%)`,
        }}
      />

      <div
        className={`relative rounded-3xl border p-6 sm:p-8 backdrop-blur-md transition-all shadow-xl ${
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white/95 border-slate-200/90'
        }`}
      >
        {/* Friendly Top Switcher: 3 Simple Modes */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('tabular')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tabular'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Spreadsheets</span>
            </button>

            <button
              onClick={() => setActiveTab('relational')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'relational'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Connected Data</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'documents'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Invoices & Ledgers</span>
            </button>
          </div>

          {/* Interactive controls: Re-seed & Schema JSON */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Click to generate new random data values"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span>Re-seed Live</span>
            </button>

            <button
              onClick={handleQuickDownloadSchema}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-900"
              title="Download this schema configuration as a reusable JSON file"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{copiedSchema ? 'Schema Downloaded!' : 'Export Schema JSON'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="py-6">
          <AnimatePresence mode="wait">
            {activeTab === 'tabular' && (
              <motion.div
                key="tabular"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      Clean Tabular Synthesis
                    </h4>
                    <p className="text-slate-500 text-xs">
                      Realistic users, emails, job roles, and revenue numbers with custom noise controls.
                    </p>
                  </div>

                  <button
                    onClick={() => setSimulateNulls(!simulateNulls)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-colors border ${
                      simulateNulls
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{simulateNulls ? '15% Null Noise Injected' : 'Inject Realistic Nulls'}</span>
                  </button>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-1">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-3">record_id</th>
                        <th className="py-2.5 px-3">full_name</th>
                        <th className="py-2.5 px-3">work_email</th>
                        <th className="py-2.5 px-3">job_role</th>
                        <th className="py-2.5 px-3">arr_revenue</th>
                        <th className="py-2.5 px-3">account_status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                      {sampleTabularRows.map((row) => (
                        <tr key={row.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{row.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                            {row.email ? row.email : <span className="text-amber-500 italic font-mono">&lt;null (simulated)&gt;</span>}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                            {row.role ? row.role : <span className="text-amber-500 italic font-mono">&lt;null&gt;</span>}
                          </td>
                          <td className="py-2.5 px-3 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                            {formatCents(row.revenue)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'relational' && (
              <motion.div
                key="relational"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Guaranteed Relational Integrity (PK/FK)
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Customers seamlessly link to their orders, and orders link to items. Zero broken foreign keys or missing rows.
                  </p>
                </div>

                {/* 3 Step Visual Relational Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex justify-between items-center text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold mb-1">
                      <span>1. Customer (Parent)</span>
                      <span>PK: CUST-1042</span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">Elena Vance</div>
                    <div className="text-[11px] text-slate-500">Enterprise · United States</div>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20">
                    <div className="flex justify-between items-center text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold mb-1">
                      <span>2. Order (Child)</span>
                      <span>FK → CUST-1042</span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">ORD-5089</div>
                    <div className="text-[11px] text-slate-500">Shipped · 2 items</div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex justify-between items-center text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                      <span>3. Item (Grandchild)</span>
                      <span>FK → ORD-5089</span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">Compute Cluster vGPU</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                      {formatCents(480000)} (Reconciled)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified 100% Referential Integrity · 0 Orphaned Records</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Mathematically Exact Financial Documents
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Calculated in integer cents so tax, discount, and grand total math reconcile to the exact penny with zero float drift.
                  </p>
                </div>

                {/* Simulated Invoice Card */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b pb-2 text-slate-500">
                    <span>INVOICE: INV-2026-88412</span>
                    <span>TERMS: NET 30</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Dedicated Compute Cluster (1x)</span>
                    <span className="font-mono tabular-nums">{formatCents(480000)}</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="font-medium text-slate-800 dark:text-slate-200">SOC2 Audit Compliance SLA (1x)</span>
                    <span className="font-mono tabular-nums">{formatCents(320000)}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between font-bold text-blue-600 dark:text-blue-400 text-sm">
                    <span>Reconciled Total Due:</span>
                    <span className="tabular-nums">{formatCents(858000)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Integer Cents Arithmetic · $0.00 Discrepancy Guaranteed</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Runs 100% offline in your browser · No signup required</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                if (activeTab === 'tabular') applyPreset('privacy');
                else if (activeTab === 'relational') applyPreset('relational');
                else applyPreset('documents');
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <span>Get Started in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
