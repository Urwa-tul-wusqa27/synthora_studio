import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { RuleBasedSchemaParser } from '../../lib/ai/ruleParser';
import { generateTabularData } from '../../lib/generators/tabular';
import { formatCents } from '../../lib/generators/document';
import { Sparkles, ArrowRight, Table, RefreshCw, CheckCircle2, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

const parser = new RuleBasedSchemaParser();

const QUICK_IDEAS = [
  '50 SaaS accounts with company, billing email, MRR in cents, and churn risk',
  '40 healthcare patients with anonymized MRN, admission date, and clinical triage',
  '60 e-commerce orders with customer name, basket total in cents, and shipping city',
  '30 employees with job title, salary in cents, hire date, and work email',
];

export const QuickSchemaGenerator: React.FC = () => {
  const { theme, setTabularFields, setRecordCount, setCurrentView } = useStudioStore();
  const [prompt, setPrompt] = useState(QUICK_IDEAS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [generatedFields, setGeneratedFields] = useState<any[]>([]);
  const [generatedCount, setGeneratedCount] = useState(50);
  const [seed, setSeed] = useState(101);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const parsed = await parser.parsePrompt(prompt);
      const sample = generateTabularData(parsed.fields, parsed.detectedCount, seed);
      setGeneratedFields(parsed.fields);
      setGeneratedCount(parsed.detectedCount);
      setPreviewData(sample.rows.slice(0, 5));

      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInStudio = () => {
    if (generatedFields.length > 0) {
      setTabularFields(generatedFields);
      setRecordCount(generatedCount);
      setCurrentView('tabular');
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
      theme === 'dark'
        ? 'bg-slate-900/80 border-slate-800 shadow-xl'
        : 'bg-white border-slate-200 shadow-md'
    }`}>
      <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>TELL YOUR SCHEMA & GENERATE INSTANTLY</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Describe Your Schema in Plain English
      </h3>
      <p className="text-xs text-slate-500 mt-1 mb-4">
        Type what data you need — Synthora automatically extracts data types, sets null rates, and generates realistic synthetic records.
      </p>

      {/* Input row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleGenerate();
          }}
          placeholder="e.g. 50 SaaS users with company name, MRR in cents, and churn status..."
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl transition-all shadow-sm whitespace-nowrap"
        >
          {isGenerating ? (
            <span>Generating Data...</span>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Generate Dataset</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-400 mr-1">Quick ideas:</span>
        {QUICK_IDEAS.map((idea, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(idea)}
            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
              prompt === idea
                ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {idea.slice(0, 36)}...
          </button>
        ))}
      </div>

      {/* Live Generated Preview if ready */}
      {previewData && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-slate-900 dark:text-white">
                Generated {generatedCount} Records with {generatedFields.length} Typed Columns
              </span>
              <span className="text-slate-400 text-[11px]">· Showing preview</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSeed((s) => s + 1);
                  const sample = generateTabularData(generatedFields, generatedCount, seed + 1);
                  setPreviewData(sample.rows.slice(0, 5));
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-slate-500 hover:text-blue-500 transition-colors border border-slate-200 dark:border-slate-800"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-seed</span>
              </button>

              <button
                onClick={handleOpenInStudio}
                className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
              >
                <span>Open Full Dataset in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-400">
                  <th className="py-2 px-3">#</th>
                  {generatedFields.map((f) => (
                    <th key={f.id} className="py-2 px-3 font-medium whitespace-nowrap">
                      {f.name} <span className="text-[10px] text-slate-400">({f.type})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {previewData.map((row) => (
                  <tr key={row._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20">
                    <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">{row._id}</td>
                    {generatedFields.map((f) => {
                      const val = row[f.name];
                      return (
                        <td key={f.id} className="py-2 px-3 whitespace-nowrap text-slate-800 dark:text-slate-200">
                          {f.type === 'integer_cents' && typeof val === 'number'
                            ? <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">{formatCents(val)}</span>
                            : val === null
                            ? <span className="text-slate-400 font-mono italic">&lt;null&gt;</span>
                            : String(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
