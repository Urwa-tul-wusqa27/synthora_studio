import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import {
  RuleBasedSchemaParser,
  SchemaGenerationPipeline,
  SchemaParseResult,
} from '../../lib/ai/ruleParser';
import { StudioHeader } from '../StudioHeader';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Terminal,
  Zap,
  Sliders,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PROMPT_PRESETS = [
  'Generate 50 healthcare patients with HIPAA anonymized MRN, contact emails, admission dates, and triage status.',
  'Create 100 enterprise SaaS subscriptions with company name, MRR in cents, retention score, and renewal date.',
  'Synthesize 60 e-commerce orders with customer name, basket total in cents, delivery city, and fulfillment status.',
  'Provide 40 employee records with job titles, salary in cents, hire date, and corporate email.',
  'Build 80 cybersecurity incident logs with source IP, threat score, status, and analyst names.',
];

const parser = new RuleBasedSchemaParser();

export const AIPromptStudio: React.FC = () => {
  const { theme, setTabularFields, setRecordCount, setCurrentView } = useStudioStore();
  const [promptInput, setPromptInput] = useState(PROMPT_PRESETS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineState, setPipelineState] = useState<SchemaGenerationPipeline | null>(null);
  const [parseResult, setParseResult] = useState<SchemaParseResult | null>(null);

  const handleGenerate = async () => {
    if (!promptInput.trim() || isGenerating) return;

    setIsGenerating(true);
    setParseResult(null);

    try {
      const result = await parser.parsePrompt(promptInput, (pipeline) => {
        setPipelineState(pipeline);
      });
      setParseResult(result);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } catch {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToStudio = () => {
    if (!parseResult) return;
    setTabularFields(parseResult.fields);
    setRecordCount(parseResult.detectedCount);
    setCurrentView('tabular');
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <StudioHeader title="AI Schema Prompt" tableName="ai_synthesized_schema" />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col gap-6">
        {/* Header & Subtitle */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-500 font-semibold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI NATURAL LANGUAGE TO SCHEMA ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Synthesize Schemas from Natural Language
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Engine: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{parser.label}</span> · Zero network latency · Runs 100% offline in browser
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className={`p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <label className="text-xs font-semibold text-slate-400 block mb-2">
            Enter Prompt Description
          </label>
          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe the dataset you want to create (e.g. 50 SaaS accounts with company, MRR in cents, churn risk...)"
            className="w-full p-3 rounded-lg border text-xs font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent border-slate-300 dark:border-slate-800"
          />

          {/* Quick Presets */}
          <div className="mt-3">
            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Try an example prompt:</span>
            <div className="flex flex-wrap gap-1.5">
              {PROMPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPromptInput(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded text-left transition-colors border ${
                    promptInput === preset
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 font-medium'
                      : theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !promptInput.trim()}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Schema...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Schema Specification</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real Step Animation Pipeline */}
        {pipelineState && (
          <div className={`p-4 rounded-xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">PIPELINE EXECUTION:</span>
              <span className="text-blue-500 font-semibold">{pipelineState.progress}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${pipelineState.progress}%` }}
              />
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>{pipelineState.stepMessage}</span>
            </div>
          </div>
        )}

        {/* Output Schema Preview & Hand-off */}
        {parseResult && (
          <div className={`p-5 rounded-xl border transition-all ${
            theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold">{parseResult.detectedDomain} Schema</h3>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Detected Target: <span className="font-mono text-blue-500 font-semibold">{parseResult.detectedCount} rows</span> · Inferred Entities: {parseResult.inferredEntities.join(', ')}
                </div>
              </div>

              <button
                onClick={handleApplyToStudio}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
              >
                <span>Apply to Tabular Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fields List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {parseResult.fields.map((f) => (
                <div
                  key={f.id}
                  className={`p-3 rounded-lg border text-xs font-mono ${
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="font-semibold text-blue-500">{f.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1">type: {f.type}</div>
                  {f.nullRate > 0 && <div className="text-[10px] text-amber-500">null_rate: {f.nullRate}%</div>}
                  {f.outlierRate > 0 && <div className="text-[10px] text-rose-500">outlier_rate: {f.outlierRate}%</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
