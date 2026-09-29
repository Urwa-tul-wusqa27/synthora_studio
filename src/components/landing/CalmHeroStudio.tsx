import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudioStore } from '../../store/studioStore';
import { generateTabularData } from '../../lib/generators/tabular';
import { formatCents } from '../../lib/generators/document';
import { convertToCSV, exportSchemaConfigurationJSON, triggerDownload } from '../../lib/export';
import {
  Users,
  ShoppingBag,
  Receipt,
  HeartPulse,
  ArrowRight,
  Download,
  FileCode,
  RefreshCw,
  Sparkles,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BlueprintOption {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  count: number;
  fields: any[];
}

const BLUEPRINTS: BlueprintOption[] = [
  {
    id: 'customers',
    name: 'Customer Accounts',
    desc: 'Names, emails, countries, and MRR in cents',
    icon: Users,
    count: 50,
    fields: [
      { id: 'f1', name: 'customer_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
      { id: 'f2', name: 'full_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
      { id: 'f3', name: 'email', type: 'email', nullRate: 0, outlierRate: 0 },
      { id: 'f4', name: 'mrr_cents', type: 'integer_cents', min: 4900, max: 850000, nullRate: 0, outlierRate: 0 },
      { id: 'f5', name: 'country', type: 'country', nullRate: 0, outlierRate: 0 },
      { id: 'f6', name: 'status', type: 'status', nullRate: 0, outlierRate: 0 },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Orders',
    desc: 'Orders, order items, and shipping statuses',
    icon: ShoppingBag,
    count: 60,
    fields: [
      { id: 'e1', name: 'order_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
      { id: 'e2', name: 'customer_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
      { id: 'e3', name: 'order_date', type: 'date', nullRate: 0, outlierRate: 0 },
      { id: 'e4', name: 'total_cents', type: 'integer_cents', min: 1500, max: 125000, nullRate: 0, outlierRate: 0 },
      { id: 'e5', name: 'delivery_city', type: 'city', nullRate: 0, outlierRate: 0 },
      { id: 'e6', name: 'status', type: 'status', nullRate: 0, outlierRate: 0 },
    ],
  },
  {
    id: 'healthcare',
    name: 'Clinical Patients',
    desc: 'HIPAA-safe anonymized patient admissions',
    icon: HeartPulse,
    count: 40,
    fields: [
      { id: 'h1', name: 'patient_mrn', type: 'uuid', nullRate: 0, outlierRate: 0 },
      { id: 'h2', name: 'patient_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
      { id: 'h3', name: 'admission_date', type: 'date', nullRate: 0, outlierRate: 0 },
      { id: 'h4', name: 'triage_status', type: 'status', nullRate: 0, outlierRate: 0 },
      { id: 'h5', name: 'treatment_cost_cents', type: 'integer_cents', min: 35000, max: 980000, nullRate: 0, outlierRate: 0 },
      { id: 'h6', name: 'emergency_phone', type: 'phone', nullRate: 5, outlierRate: 0 },
    ],
  },
  {
    id: 'invoices',
    name: 'Invoice Billing',
    desc: 'Net 30 invoices with exact calculated totals',
    icon: Receipt,
    count: 30,
    fields: [
      { id: 'i1', name: 'invoice_number', type: 'string', prefix: 'INV-2026', nullRate: 0, outlierRate: 0 },
      { id: 'i2', name: 'client_company', type: 'company', nullRate: 0, outlierRate: 0 },
      { id: 'i3', name: 'due_date', type: 'date', nullRate: 0, outlierRate: 0 },
      { id: 'i4', name: 'amount_due_cents', type: 'integer_cents', min: 85000, max: 1200000, nullRate: 0, outlierRate: 0 },
      { id: 'i5', name: 'contact_email', type: 'email', nullRate: 0, outlierRate: 0 },
      { id: 'i6', name: 'payment_status', type: 'status', nullRate: 0, outlierRate: 0 },
    ],
  },
];

export const CalmHeroStudio: React.FC = () => {
  const { theme, setTabularFields, setRecordCount, setSeed, setCurrentView } = useStudioStore();
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintOption>(BLUEPRINTS[0]);
  const [seed, setLocalSeed] = useState(42);
  const [promptText, setPromptText] = useState('');
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  // Generate 4 live preview rows
  const preview = generateTabularData(selectedBlueprint.fields, 4, seed);

  const handleSelectBlueprint = (bp: BlueprintOption) => {
    setSelectedBlueprint(bp);
    setLocalSeed((s) => s + 1);
  };

  const handleOpenStudioWithBlueprint = () => {
    setTabularFields(selectedBlueprint.fields);
    setRecordCount(selectedBlueprint.count);
    setSeed(seed);
    setCurrentView('tabular');
  };

  const handleDownloadCSV = () => {
    const fullDataset = generateTabularData(selectedBlueprint.fields, selectedBlueprint.count, seed);
    const csv = convertToCSV(fullDataset.rows);
    triggerDownload(csv, `${selectedBlueprint.id}_data.csv`, 'text/csv');
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
    } catch {}
    setCopiedAction('CSV Downloaded!');
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const handleDownloadSchemaJSON = () => {
    const schemaJson = exportSchemaConfigurationJSON({
      name: selectedBlueprint.id,
      seed,
      recordCount: selectedBlueprint.count,
      fields: selectedBlueprint.fields,
    });
    triggerDownload(schemaJson, `${selectedBlueprint.id}_schema.json`, 'application/json');
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
    } catch {}
    setCopiedAction('Schema JSON Saved!');
    setTimeout(() => setCopiedAction(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* The Central Playground Box */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all shadow-md ${
          theme === 'dark'
            ? 'bg-stone-900/90 border-stone-800'
            : 'bg-white border-stone-200/90'
        }`}
      >
        {/* Simple Blueprint Picker Pills */}
        <div className="text-left mb-4">
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2.5">
            Select a starter blueprint:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {BLUEPRINTS.map((bp) => {
              const isSelected = bp.id === selectedBlueprint.id;
              const Icon = bp.icon;
              return (
                <button
                  key={bp.id}
                  onClick={() => handleSelectBlueprint(bp)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'}`} />
                    <span className="font-semibold text-xs truncate text-stone-900 dark:text-white">
                      {bp.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 truncate">{bp.count} sample rows</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Data Preview Table */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-left">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Live Output Preview
              </span>
              <span className="text-stone-400 text-[11px]">· Seed #{seed}</span>
            </div>

            <button
              onClick={() => setLocalSeed((s) => s + 1)}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-600 transition-colors"
              title="Generate new values"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAFAF8] dark:bg-stone-950 p-1">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-mono text-[11px]">
                  {selectedBlueprint.fields.map((f) => (
                    <th key={f.id} className="py-2 px-3 font-medium whitespace-nowrap">
                      {f.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 dark:divide-stone-800/70 text-xs">
                {preview.rows.map((row) => (
                  <tr key={row._id} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors">
                    {selectedBlueprint.fields.map((f) => {
                      const val = row[f.name];
                      return (
                        <td key={f.id} className="py-2.5 px-3 whitespace-nowrap text-stone-800 dark:text-stone-200">
                          {f.type === 'integer_cents' && typeof val === 'number' ? (
                            <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-medium">
                              {formatCents(val)}
                            </span>
                          ) : f.type === 'uuid' ? (
                            <span className="font-mono text-stone-400 text-[11px]">{String(val).slice(0, 13)}...</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-medium">
            {copiedAction ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{copiedAction}</span>
              </span>
            ) : (
              <span>Deterministic reproduction guaranteed</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={handleDownloadSchemaJSON}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/40 hover:bg-amber-200/70 dark:hover:bg-amber-900/40 rounded-lg transition-colors border border-amber-300 dark:border-amber-800"
              title="Download reusable Schema JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Save Schema JSON</span>
            </button>

            <button
              onClick={handleOpenStudioWithBlueprint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-all shadow-sm whitespace-nowrap"
            >
              <span>Open in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
