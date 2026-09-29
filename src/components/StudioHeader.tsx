import React, { useState } from 'react';
import { useStudioStore } from '../store/studioStore';
import {
  RefreshCw,
  Download,
  FileSpreadsheet,
  FileCode,
  Database,
  Sliders,
  Settings,
  Sparkles,
} from 'lucide-react';
import {
  convertToCSV,
  convertToJSON,
  convertToSQL,
  exportSchemaConfigurationJSON,
  exportWithPapaParseCSV,
  triggerDownload,
} from '../lib/export';
import confetti from 'canvas-confetti';
import { PROBLEM_PRESETS } from '../lib/presets';
import { SchemaManagerModal } from './schema/SchemaManagerModal';

interface StudioHeaderProps {
  currentDataRows?: Record<string, any>[];
  title: string;
  tableName?: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentDataRows = [],
  title,
  tableName = 'synthetic_dataset',
}) => {
  const {
    seed,
    setSeed,
    randomizeSeed,
    recordCount,
    setRecordCount,
    tabularFields,
    theme,
    activePresetId,
    currentView,
  } = useStudioStore();

  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  const activePreset = PROBLEM_PRESETS.find((p) => p.id === activePresetId);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}
  };

  const handleExportCSV = () => {
    if (currentDataRows.length === 0) return;
    exportWithPapaParseCSV(currentDataRows, tabularFields, tableName, seed);
    fireConfetti();
    setCopiedFormat('CSV');
    setTimeout(() => setCopiedFormat(null), 2000);
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    if (currentDataRows.length === 0) return;
    const json = convertToJSON(currentDataRows);
    triggerDownload(json, `${tableName}_seed${seed}.json`, 'application/json');
    fireConfetti();
    setCopiedFormat('JSON');
    setTimeout(() => setCopiedFormat(null), 2000);
    setShowExportMenu(false);
  };

  const handleExportSQL = () => {
    if (currentDataRows.length === 0) return;
    const sql = convertToSQL(tableName, currentDataRows);
    triggerDownload(sql, `${tableName}_seed${seed}.sql`, 'text/plain;charset=utf-8;');
    fireConfetti();
    setCopiedFormat('SQL');
    setTimeout(() => setCopiedFormat(null), 2000);
    setShowExportMenu(false);
  };

  const handleExportSchemaJSON = () => {
    const schemaJson = exportSchemaConfigurationJSON({
      name: tableName,
      seed,
      recordCount,
      fields: tabularFields,
    });
    triggerDownload(schemaJson, `${tableName}_schema.json`, 'application/json');
    fireConfetti();
    setCopiedFormat('Schema');
    setTimeout(() => setCopiedFormat(null), 2000);
    setShowExportMenu(false);
  };

  return (
    <>
      <div
        className={`border-b transition-colors px-4 sm:px-6 py-3 ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Breadcrumbs & Active preset indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="font-semibold text-blue-600 dark:text-blue-400">STUDIO</span>
              <span>/</span>
              <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}>{title}</span>
            </div>

            {activePreset && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-3 border-l border-slate-300 dark:border-slate-800">
                <span className="text-slate-400">Preset:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{activePreset.title}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{activePreset.badge}</span>
              </div>
            )}
          </div>

          {/* Right: Schema Manager, Seed control, Record Count, and Export Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Schema JSON Save & Reuse Button */}
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Save or reuse schema configuration"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Save & Reuse Schema</span>
            </button>

            {/* Seed Input & Randomize */}
            <div
              className={`flex items-center rounded-lg border px-2 py-1 text-xs font-mono ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-slate-400 mr-2 text-[11px] font-sans">Seed</span>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value, 10) || 0)}
                className="w-16 bg-transparent text-right font-mono focus:outline-none tabular-nums"
                aria-label="PRNG Seed"
              />
              <button
                onClick={randomizeSeed}
                title="Generate new random seed"
                className="ml-2 p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Record Count Selector */}
            {currentView !== 'documents' && (
              <div
                className={`flex items-center rounded-lg border p-0.5 text-xs ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                {[10, 50, 100, 250, 500].map((count) => (
                  <button
                    key={count}
                    onClick={() => setRecordCount(count)}
                    className={`px-2 py-1 rounded font-mono tabular-nums transition-colors ${
                      recordCount === count
                        ? 'bg-blue-600 text-white font-medium shadow-xs'
                        : theme === 'dark'
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            )}

            {/* Prominent PapaParse CSV Download Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Download generated records as CSV using PapaParse with schema-mapped headers"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data</span>
                {copiedFormat && <span className="text-xs">({copiedFormat}!)</span>}
              </button>

              {showExportMenu && (
                <div
                  className={`absolute right-0 mt-1.5 w-56 rounded-xl shadow-xl border py-1.5 z-50 ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold">Export as CSV</div>
                      <div className="text-[10px] opacity-75">Comma separated rows</div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <FileCode className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-semibold">Export as JSON</div>
                      <div className="text-[10px] opacity-75">Full records array</div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportSQL}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Database className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-semibold">Export as SQL Inserts</div>
                      <div className="text-[10px] opacity-75">Direct database seeding</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

                  <button
                    onClick={handleExportSchemaJSON}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <FileCode className="w-4 h-4" />
                    <div>
                      <div className="font-semibold">Download Schema (JSON)</div>
                      <div className="text-[10px] opacity-75">Reusable schema structure</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SchemaManagerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </>
  );
};
