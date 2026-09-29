import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStudioStore, StudioView } from '../../store/studioStore';
import { SchemaManagerModal } from '../schema/SchemaManagerModal';
import { RuleBasedSchemaParser } from '../../lib/ai/ruleParser';
import { exportSchemaConfigurationJSON, triggerDownload } from '../../lib/export';
import { formatCents } from '../../lib/generators/document';
import darkBgImage from '../../assets/images/hero_data_canvas_1790710263307.jpg';
import lightBgImage from '../../assets/images/light_hero_canvas_1790710285040.jpg';
import {
  ArrowRight,
  Sparkles,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Table2,
  GitFork,
  FileCheck2,
  SlidersHorizontal,
  Download,
  Layers,
  Check,
  Copy,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SCHEMA_QUICK_PRESETS = [
  {
    title: 'Hospital Clinical Records',
    prompt: '50 clinical patient records with patient_mrn, blood_group, doctor_name, admitted_date, and triage_status',
    cols: 'MRN · Blood Group · Doctor · Admitted Date · Triage Status',
  },
  {
    title: 'Airline Flight Bookings',
    prompt: '40 airline booking rows with flight_number, passenger_name, seat_assigned, fare_cents, and ticket_status',
    cols: 'Flight No · Passenger · Seat · Fare Cents · Ticket Status',
  },
  {
    title: 'SaaS Customer Subscriptions',
    prompt: '60 tenant subscriptions with company_name, billing_email, mrr_cents, churn_risk_score, and renewal_date',
    cols: 'Company · Work Email · MRR Cents · Risk Score · Renewal',
  },
  {
    title: 'IoT Telemetry Logs',
    prompt: '100 IoT device logs with device_id, temperature_celsius, ip_address, battery_level, and status',
    cols: 'Device ID · Temperature · IPv4 · Battery · Status',
  },
];

export const LandingPage: React.FC = () => {
  const { theme, setCurrentView, setCustomSchema, tabularFields, seed, recordCount } = useStudioStore();
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [schemaPrompt, setSchemaPrompt] = useState(SCHEMA_QUICK_PRESETS[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulateNulls, setSimulateNulls] = useState(false);
  const [copiedSchemaSnippet, setCopiedSchemaSnippet] = useState(false);

  const handleSynthesizePrompt = async (promptText?: string) => {
    const text = promptText || schemaPrompt;
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const parser = new RuleBasedSchemaParser();
      const res = await parser.parsePrompt(text);
      setCustomSchema(
        res.detectedDomain.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        res.fields,
        res.detectedCount
      );
      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
      } catch {}
      setCurrentView('tabular');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickDownloadSchema = () => {
    const json = exportSchemaConfigurationJSON({
      name: 'synthora_demo_schema',
      seed: 42,
      recordCount: 50,
      fields: tabularFields,
    });
    triggerDownload(json, 'synthora_schema.json', 'application/json');
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    } catch {}
    setCopiedSchemaSnippet(true);
    setTimeout(() => setCopiedSchemaSnippet(false), 2000);
  };

  const sampleRows = [
    {
      id: 'REC-1001',
      patient_mrn: 'MRN-84920',
      name: 'Eleanor Vance',
      blood_group: 'O+',
      doctor: 'Dr. Sarah Connor',
      admitted: '2026-03-14',
      status: 'Admitted',
    },
    {
      id: 'REC-1002',
      patient_mrn: 'MRN-84921',
      name: 'Marcus Brody',
      blood_group: simulateNulls ? null : 'A-',
      doctor: simulateNulls ? null : 'Dr. Alan Grant',
      admitted: '2026-03-15',
      status: 'Discharged',
    },
    {
      id: 'REC-1003',
      patient_mrn: 'MRN-84922',
      name: 'Sophia Chen',
      blood_group: 'B+',
      doctor: 'Dr. Henry Wu',
      admitted: '2026-03-16',
      status: 'Observation',
    },
  ];

  return (
    <div
      className={`min-h-screen relative selection:bg-blue-500 selection:text-white transition-colors font-sans ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-[#FAFBFD] text-slate-900'
      }`}
    >
      {/* Subtle, non-intrusive background art overlay (zero purple) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={theme === 'dark' ? darkBgImage : lightBgImage}
          alt="Architectural grid canvas"
          className="w-full h-full object-cover object-center opacity-15 dark:opacity-20 transition-opacity duration-700"
        />
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950'
              : 'bg-gradient-to-b from-white/70 via-[#FAFBFD]/85 to-[#FAFBFD]'
          }`}
        />
      </div>

      <div className="relative z-10">
        {/* ========================================================================= */}
        {/* CHAPTER 1: HERO & ALL-IN-ONE THESIS */}
        {/* ========================================================================= */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Minimalist pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Offline-First Synthetic Studio</span>
              <span className="text-slate-400">·</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">v2.4 Pure PRNG</span>
            </div>

            {/* Human-centric headline */}
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Everything you need to test data. <br className="hidden sm:inline" />
              <span className="text-blue-600 dark:text-blue-400">All in one studio.</span>
            </h1>

            {/* Clear, approachable subheadline */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Stop stitching together generic faker libraries, fragile SQL dumps, and privacy-risking production copies. Synthora unifies custom schema generation, verified foreign key trees, and exact penny math in your browser.
            </p>

            {/* Primary actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('tabular')}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Open All-In-One Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSchemaModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs'
                }`}
              >
                <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Save / Load Schema JSON</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE SCHEMA PROMPT HUB */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className={`p-6 sm:p-8 rounded-2xl border shadow-sm transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  Define Your Custom Schema in Plain English
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  No fixed schemas or hardcoded mocks. Describe any entity and our rule-parser will generate exact columns.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Uploads</span>
              </div>
            </div>

            {/* Input & Action */}
            <div className="pt-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={schemaPrompt}
                  onChange={(e) => setSchemaPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSynthesizePrompt();
                  }}
                  placeholder="e.g. 50 clinical records with mrn, doctor_name, blood_group, triage_status..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />

                <button
                  onClick={() => handleSynthesizePrompt()}
                  disabled={isGenerating || !schemaPrompt.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Building Schema...' : 'Generate In Studio'}</span>
                </button>
              </div>

              {/* Quick Starters */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Or start with a verified domain blueprint:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SCHEMA_QUICK_PRESETS.map((p) => (
                    <button
                      key={p.title}
                      onClick={() => {
                        setSchemaPrompt(p.prompt);
                        handleSynthesizePrompt(p.prompt);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-950/60 border-slate-800 hover:border-blue-500 hover:bg-slate-900/60'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {p.title}
                        </span>
                        <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400 opacity-60" />
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
                        {p.cols}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 2: SCROLL NARRATIVE — THE 4 PILLARS OF THE ALL-IN-ONE PLATFORM */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              The All-In-One Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Every data tier built into a single cohesive engine
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Scroll through the four specialized engines that run concurrently in Synthora.
            </p>
          </div>

          <div className="space-y-16">
            {/* ==================== Narrative 01: Tabular & Dirty Data ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    <Table2 className="w-4 h-4" />
                    <span>01. TABULAR SYNTHESIZER</span>
                  </div>

                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Custom schemas with realistic dirty-data stress tests
                  </h4>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Build datasets using 22+ specialized domain types. Inject controlled null rates (0–80%) and boundary outliers to ensure your backend pipelines gracefully survive malformed real-world data before deploying.
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Deterministic Seed PRNG
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Zero PII In Staging
                    </span>
                  </div>
                </div>

                {/* Interactive Preview Card */}
                <div className="w-full lg:w-[420px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                    <span className="font-mono text-slate-500">clinical_records (3 rows)</span>
                    <button
                      onClick={() => setSimulateNulls(!simulateNulls)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                        simulateNulls
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>{simulateNulls ? 'Nulls Active (33%)' : 'Simulate Null Noise'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    {sampleRows.map((r) => (
                      <div
                        key={r.id}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {r.name} · <span className="text-slate-500 font-normal">{r.patient_mrn}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Doctor:{' '}
                            {r.doctor ? (
                              <span className="text-slate-700 dark:text-slate-300">{r.doctor}</span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 font-bold">&lt;null&gt;</span>
                            )}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ==================== Narrative 02: Relational Integrity ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    <GitFork className="w-4 h-4" />
                    <span>02. RELATIONAL TOPOLOGY</span>
                  </div>

                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Guaranteed parent-to-child referential integrity
                  </h4>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Say goodbye to broken foreign keys and orphaned children in your test databases. Synthora generates hierarchical entity networks where every child points to a confirmed, mathematically valid parent key.
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      100% Cascade Integrity
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Zero Orphaned Records
                    </span>
                  </div>
                </div>

                {/* Relational Visual Cascade */}
                <div className="w-full lg:w-[420px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 p-4 space-y-2.5">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">1. Organization (Parent)</span>
                      <span>PK: ORG-4091</span>
                    </div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">Acme Enterprise Labs</div>
                  </div>

                  <div className="ml-4 pl-3 border-l-2 border-blue-500/40 space-y-2">
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">2. Team (Child)</span>
                        <span>FK → ORG-4091</span>
                      </div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">Platform Infrastructure</div>
                    </div>

                    <div className="ml-4 pl-3 border-l-2 border-emerald-500/40">
                      <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-0.5">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">3. Engineer (Grandchild)</span>
                          <span>FK → TEAM-88</span>
                        </div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">Devon Miles · SRE Lead</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ==================== Narrative 03: Reconciled Financials ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    <FileCheck2 className="w-4 h-4" />
                    <span>03. RECONCILED DOCUMENTS</span>
                  </div>

                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Exact penny calculations with zero floating-point drift
                  </h4>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Financial software breaks when test data doesn&apos;t reconcile. Synthora computes line items, sales tax, shipping rates, and invoice subtotals strictly using integer cents math, ensuring that every total matches to the exact cent.
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Integer Cents Arithmetic
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      $0.00 Ledger Discrepancy
                    </span>
                  </div>
                </div>

                {/* Financial Ledger Receipt Preview */}
                <div className="w-full lg:w-[420px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 font-mono text-xs shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                    <span>INVOICE: INV-2026-9042</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">RECONCILED</span>
                  </div>

                  <div className="space-y-1 py-1 font-sans text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Compute Cluster Tier-4 (1x)</span>
                      <span className="font-mono">{formatCents(450000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Dedicated Enterprise Support (1x)</span>
                      <span className="font-mono">{formatCents(120000)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Tax Assessment (8.5%)</span>
                      <span className="font-mono">{formatCents(48450)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Grand Total:</span>
                    <span className="text-blue-600 dark:text-blue-400 tabular-nums">{formatCents(618450)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ==================== Narrative 04: Schema Portability ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    <FileCode className="w-4 h-4" />
                    <span>04. SCHEMA REUSABILITY</span>
                  </div>

                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Export schema JSON once, reuse across your team
                  </h4>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Never re-configure column definitions twice. Export your complete schema configuration into a lightweight, versioned JSON file. Teammates can upload or paste the file to generate identical datasets in seconds.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleQuickDownloadSchema}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{copiedSchemaSnippet ? 'Downloaded Schema!' : 'Download Sample Schema JSON'}</span>
                    </button>

                    <button
                      onClick={() => setIsSchemaModalOpen(true)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>Open Schema Manager</span>
                    </button>
                  </div>
                </div>

                {/* Code Snippet Preview */}
                <div className="w-full lg:w-[420px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 border-b border-slate-800 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3" />
                      <span>schema.json</span>
                    </span>
                    <span>version: &quot;1.0&quot;</span>
                  </div>
                  <pre className="text-emerald-400 leading-relaxed">{`{
  "version": "1.0",
  "generator": "Synthora Synthetic Studio",
  "schema": {
    "name": "patient_records",
    "recordCount": 50,
    "fields": [
      { "name": "patient_mrn", "type": "uuid" },
      { "name": "doctor_name", "type": "fullName" },
      { "name": "blood_group", "type": "bloodGroup" }
    ]
  }
}`}</pre>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 3: BOTTOM CONVERGENCE CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-slate-200 dark:border-slate-800">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Ready to generate your data?
            </h2>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Launch the studio to customize column definitions, configure foreign key graphs, and export CSV, JSON, or SQL inserts.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('tabular')}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Launch Studio Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSchemaModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Upload Saved Schema JSON</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Minimal, Human Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">Synthora</span>
              <span>—</span>
              <span>All-In-One Synthetic Data Studio</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button
                onClick={() => setCurrentView('tabular')}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                Tabular Studio
              </button>
              <button
                onClick={() => setCurrentView('relational')}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                Relational PK/FK
              </button>
              <button
                onClick={() => setCurrentView('documents')}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                Documents
              </button>
              <button
                onClick={() => setIsSchemaModalOpen(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                Schema JSON
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Schema Export/Import Reusable Modal */}
      <SchemaManagerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </div>
  );
};
