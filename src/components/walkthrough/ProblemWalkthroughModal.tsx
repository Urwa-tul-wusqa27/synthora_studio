import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudioStore } from '../../store/studioStore';
import {
  ShieldAlert,
  Sliders,
  AlertTriangle,
  FileCode,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Sparkles,
  Lock,
  Layers,
  Database,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalkthroughStep {
  number: string;
  badge: string;
  title: string;
  pain: string;
  solution: string;
  interactiveType: 'privacy' | 'custom_schema' | 'edge_cases' | 'reusable_json';
}

const STEPS: WalkthroughStep[] = [
  {
    number: '01',
    badge: 'PROBLEM #1: PRIVACY & COMPLIANCE',
    title: "You Can't Use Real Production Data in Dev & QA",
    pain: 'Moving real customer data or clinical records into dev/staging environments breaks GDPR, HIPAA, and CCPA compliance, risking severe legal penalties and data leaks.',
    solution:
      'Synthora synthesizes 100% synthetic, zero-PII datasets directly in your browser. Zero server uploads, zero network leaks, and mathematically realistic statistical distributions.',
    interactiveType: 'privacy',
  },
  {
    number: '02',
    badge: 'PROBLEM #2: HARDCODED MOCKS FAIL REAL TEST CASES',
    title: 'Your Tests Need YOUR Exact Custom Columns & Types',
    pain: "Generic mock generators lock you into rigid 'customers & orders'. But your app needs clinical MRNs, IoT sensor packets, flight reservations, or SaaS subscriptions.",
    solution:
      'You are in full control: tell Synthora what columns you need in plain English or add custom columns manually. Select from 22 data types to make your test cases 100% valid.',
    interactiveType: 'custom_schema',
  },
  {
    number: '03',
    badge: 'PROBLEM #3: UNTESTED EDGE CASES & DIRTY FEEDS',
    title: 'Apps Crash on Missing Values & Extreme Outliers',
    pain: 'In production, data feeds are messy: missing phone numbers, negative amounts, leap-year dates, and text overflow that break unhardened validation code.',
    solution:
      'Inject controlled null rates (0–80%) and boundary outliers (negative balances, extreme strings, boundary dates) to stress-test your frontend and backend before deploying.',
    interactiveType: 'edge_cases',
  },
  {
    number: '04',
    badge: 'PROBLEM #4: TEAMMATES CANNOT REUSE TEST SCHEMAS',
    title: 'Mock Scripts Get Discarded & Teams Waste Days',
    pain: 'Engineers rewrite custom data generation scripts every sprint. There is no easy way to share, version control, or reproduce identical test data across the team.',
    solution:
      'Export your generated schema configuration as a reusable JSON file. Teammates can upload it with 1 click to reproduce identical datasets using the same deterministic seed.',
    interactiveType: 'reusable_json',
  },
];

export const ProblemWalkthroughModal: React.FC = () => {
  const { isWalkthroughOpen, closeWalkthrough, setCurrentView, theme, walkthroughStep } = useStudioStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Sync step whenever modal is opened
  React.useEffect(() => {
    if (isWalkthroughOpen) {
      const targetStep = typeof walkthroughStep === 'number' ? walkthroughStep : 0;
      setCurrentStepIndex(Math.min(Math.max(0, targetStep), STEPS.length - 1));
    }
  }, [isWalkthroughOpen, walkthroughStep]);

  // Interactive micro-demos inside each step
  const [privacyToggled, setPrivacyToggled] = useState(true);
  const [simulatedNullRate, setSimulatedNullRate] = useState(25);

  if (!isWalkthroughOpen) return null;

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleFinishAndStart();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinishAndStart = () => {
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}
    closeWalkthrough();
    setCurrentView('tabular');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Header with Step Dots & Skip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              SYNTHORA GUIDE
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-blue-600 dark:bg-blue-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={closeWalkthrough}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors p-1"
          >
            <span>Skip tour</span>
            <X className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Content Body with Smooth Animated Transition */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[75vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.interactiveType}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Step Header */}
              <div>
                <span className="inline-block text-[11px] font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                  {currentStep.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {currentStep.title}
                </h3>
              </div>

              {/* The Pain & Solution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Pain */}
                <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/20 text-slate-800 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400 mb-1.5 text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>The Real-World Bottleneck:</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-400 font-normal">
                    {currentStep.pain}
                  </p>
                </div>

                {/* Solution */}
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>How Synthora Solves It:</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-400 font-normal">
                    {currentStep.solution}
                  </p>
                </div>
              </div>

              {/* Interactive Visual Playground for this Step */}
              <div
                className={`p-4 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-[11px] font-mono font-semibold text-slate-500 mb-2 uppercase">
                  Interactive Live Verification:
                </div>

                {currentStep.interactiveType === 'privacy' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        View: {privacyToggled ? '100% Synthetic Safe Data' : 'Raw Production PII (Dangerous)'}
                      </span>
                      <button
                        onClick={() => setPrivacyToggled(!privacyToggled)}
                        className="text-xs px-3 py-1 rounded-lg border font-semibold bg-white dark:bg-slate-800 hover:border-blue-500 transition-colors shadow-2xs"
                      >
                        {privacyToggled ? 'Simulate Real PII Breach' : 'Switch to Safe Synthetic'}
                      </button>
                    </div>

                    <div className="overflow-x-auto text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b text-slate-400 text-[11px]">
                            <th className="py-1 px-2">record_id</th>
                            <th className="py-1 px-2">patient_mrn</th>
                            <th className="py-1 px-2">full_name</th>
                            <th className="py-1 px-2">ssn_or_tax_id</th>
                            <th className="py-1 px-2">status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                          {privacyToggled ? (
                            <>
                              <tr>
                                <td className="py-1.5 px-2 text-slate-400">SYN-1041</td>
                                <td className="py-1.5 px-2 text-blue-600 font-semibold">MRN-90214-X</td>
                                <td className="py-1.5 px-2">Liam Anderson</td>
                                <td className="py-1.5 px-2 text-emerald-600 font-semibold">SYNTHETIC-HASH</td>
                                <td className="py-1.5 px-2 text-emerald-600">✓ Safe (0% Leak)</td>
                              </tr>
                              <tr>
                                <td className="py-1.5 px-2 text-slate-400">SYN-1042</td>
                                <td className="py-1.5 px-2 text-blue-600 font-semibold">MRN-78142-Y</td>
                                <td className="py-1.5 px-2">Sophia Chen</td>
                                <td className="py-1.5 px-2 text-emerald-600 font-semibold">SYNTHETIC-HASH</td>
                                <td className="py-1.5 px-2 text-emerald-600">✓ Safe (0% Leak)</td>
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr className="bg-rose-500/10 text-rose-700 dark:text-rose-400">
                                <td className="py-1.5 px-2 font-mono">REAL-491</td>
                                <td className="py-1.5 px-2 font-bold">REAL-PATIENT-99</td>
                                <td className="py-1.5 px-2 font-bold">John RealUser</td>
                                <td className="py-1.5 px-2 font-bold">123-45-6789 (PII LEAK!)</td>
                                <td className="py-1.5 px-2 font-bold">⚠️ GDPR Violation</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {currentStep.interactiveType === 'custom_schema' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      You are never limited to default tables. You can add ANY custom column your test requires:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="font-bold text-blue-600">ticket_number</div>
                        <div className="text-[10px] text-slate-400">Sequential String</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="font-bold text-blue-600">blood_pressure</div>
                        <div className="text-[10px] text-slate-400">Decimal / Float</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="font-bold text-blue-600">seat_assigned</div>
                        <div className="text-[10px] text-slate-400">Custom Picklist</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="font-bold text-blue-600">fare_in_cents</div>
                        <div className="text-[10px] text-slate-400">Integer Cents ($)</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.interactiveType === 'edge_cases' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Drag to test null rate tolerance in your code:
                      </span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {simulatedNullRate}% Missing Values
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="75"
                      step="5"
                      value={simulatedNullRate}
                      onChange={(e) => setSimulatedNullRate(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-600 h-2 cursor-pointer"
                    />

                    <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono flex items-center justify-between">
                      <span>Row 1: contact_phone: {simulatedNullRate > 20 ? <span className="text-amber-500 font-bold">&lt;null&gt;</span> : '+1 (555) 019-2834'}</span>
                      <span>Row 2: emergency_contact: {simulatedNullRate > 40 ? <span className="text-amber-500 font-bold">&lt;null&gt;</span> : 'Ava Martinez'}</span>
                    </div>
                  </div>
                )}

                {currentStep.interactiveType === 'reusable_json' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Save your exact custom schema to a <code className="font-mono font-bold text-blue-600">.json</code> file. Drag and drop it back anytime to reuse it across team members:
                    </p>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
                      <code>{`{\n  "version": "1.0",\n  "schema": {\n    "name": "my_exact_test_case",\n    "fields": [ { "name": "user_id", "type": "uuid" }, { "name": "balance_cents", "type": "integer_cents" } ]\n  }\n}`}</code>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation: Back / Next / Get Started */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <span>{isLastStep ? 'Get Started — Build Custom Schema' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
